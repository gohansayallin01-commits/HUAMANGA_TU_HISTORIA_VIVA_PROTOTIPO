import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Images,
  UploadCloud,
  Star,
  Trash2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ImagePlus,
} from 'lucide-react';
import { useAdminAttraction } from '../../components/admin/AttractionEditLayout';
import { attractionService } from '../../services/attractionService';
import { deleteImage, saveImage } from '../../services/imageStorage';
import { localReferentialImages } from '../../data/attractions';
import { AdminCard, AdminButton, EmptyState } from '../../components/admin/AdminUI';
import { StoredAttractionImage, isStoredRef, storedRefToImageId } from '../../components/common/StoredAttractionImage';
import { ImageMeta } from '../../types';

interface EditorImage {
  url: string;
  alt: string;
  source?: string;
  license?: string;
  isReferential?: boolean;
}

const MAX_SIZE_MB = 8;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export const AttractionImagesPage: React.FC = () => {
  const { attraction } = useAdminAttraction();
  const [items, setItems] = useState<EditorImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [showReferentials, setShowReferentials] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!attraction) return;
    const meta = attraction.imageMeta ?? [];
    setItems(
      attraction.images.map((url, i) => ({
        url,
        alt: meta[i]?.alt ?? `${attraction.name} - imagen ${i + 1}`,
        source: meta[i]?.source,
        license: meta[i]?.license,
        isReferential: meta[i]?.isReferential ?? !isStoredRef(url),
      }))
    );
  }, [attraction?.id]);

  const referentialOptions = useMemo(
    () => (attraction ? localReferentialImages(attraction.slug) : []),
    [attraction?.slug]
  );

  if (!attraction) return null;

  const persist = (next: EditorImage[]) => {
    const images = next.map((i) => i.url);
    const imageMeta: ImageMeta[] = next.map((i, index) => ({
      url: i.url,
      alt: i.alt || `${attraction.name} - imagen ${index + 1}`,
      source: i.source ?? (isStoredRef(i.url) ? 'Carga administrativa' : 'Ilustración referencial de demostración'),
      author: isStoredRef(i.url) ? 'Municipalidad Provincial de Huamanga' : 'Huamanga: Tu Historia Viva',
      license: i.license ?? (isStoredRef(i.url) ? 'Uso institucional' : 'Uso demostrativo académico'),
      isReferential: i.isReferential ?? !isStoredRef(i.url),
    }));
    attractionService.updateAttractionImages(attraction.id, { images, imageMeta, isReferentialImage: imageMeta[0]?.isReferential ?? true });
    setItems(next);
  };

  const flash = (type: 'ok' | 'error', text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3000);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const added: EditorImage[] = [];
    let rejected = 0;
    for (const file of Array.from(files)) {
      if (!ACCEPTED.includes(file.type) || file.size > MAX_SIZE_MB * 1024 * 1024) {
        rejected += 1;
        continue;
      }
      const imageId = `img-${attraction.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await saveImage(imageId, attraction.id, file, file.name, file.type, {
        altText: `${attraction.name} - ${file.name}`,
        source: 'Carga administrativa',
        license: 'Uso institucional',
        isReferential: false,
      });
      added.push({
        url: `idb:${imageId}`,
        alt: `${attraction.name} - ${file.name}`,
        source: 'Carga administrativa',
        license: 'Uso institucional',
        isReferential: false,
      });
    }
    if (added.length) persist([...items, ...added]);
    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (rejected > 0) flash('error', `${rejected} archivo(s) omitido(s): formato no permitido o superan ${MAX_SIZE_MB} MB.`);
    else if (added.length) flash('ok', `${added.length} imagen(es) cargada(s) y guardada(s) en el dispositivo.`);
  };

  const removeAt = async (index: number) => {
    const target = items[index];
    const next = items.filter((_, i) => i !== index);
    persist(next.length ? next : items.slice(0, 1));
    if (isStoredRef(target.url)) {
      const stillUsed = next.some((i) => i.url === target.url);
      if (!stillUsed) await deleteImage(storedRefToImageId(target.url));
    }
    flash('ok', 'Imagen eliminada.');
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    persist(next);
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    persist(next);
  };

  const addReferential = (url: string) => {
    if (items.some((i) => i.url === url)) {
      flash('error', 'Esa imagen referencial ya está en la galería.');
      return;
    }
    persist([
      ...items,
      {
        url,
        alt: `${attraction.name} - imagen referencial`,
        source: 'Ilustración referencial de demostración',
        license: 'Uso demostrativo académico',
        isReferential: true,
      },
    ]);
    flash('ok', 'Imagen referencial añadida.');
  };

  return (
    <div className="space-y-4">
      <AdminCard
        title="Galería del atractivo"
        description={`${items.length} imagen(es). La primera es la portada.`}
        icon={<Images className="w-4 h-4" />}
        actions={
          <AdminButton
            variant="secondary"
            icon={<ImagePlus className="w-3.5 h-3.5" />}
            onClick={() => setShowReferentials((v) => !v)}
          >
            Imágenes referenciales
          </AdminButton>
        }
      >
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold mb-4 animate-fade-in ${
              message.type === 'ok'
                ? 'bg-emerald-50 border-emerald-200 text-ayacucho-success'
                : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}
          >
            {message.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center cursor-pointer hover:border-ayacucho-gold hover:bg-ayacucho-gold/5 transition"
        >
          <UploadCloud className="w-8 h-8 text-ayacucho-gold mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-700">
            {busy ? 'Guardando imágenes…' : 'Arrastre imágenes aquí o haga clic para seleccionar'}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">JPG, PNG o WebP · máximo {MAX_SIZE_MB} MB por archivo</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            multiple
            disabled={busy}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {showReferentials && referentialOptions.length > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-bold text-slate-600 mb-2">Ilustraciones referenciales disponibles</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {referentialOptions.map((url) => (
                <button
                  key={url}
                  onClick={() => addReferential(url)}
                  className="relative rounded-xl overflow-hidden border border-slate-200 hover:ring-2 hover:ring-ayacucho-gold transition"
                >
                  <StoredAttractionImage src={url} alt="Referencial" className="w-full h-20 object-cover" category={attraction.category} />
                </button>
              ))}
            </div>
          </div>
        )}
      </AdminCard>

      <AdminCard title="Orden y portada" description="Reordene, cambie la portada o elimine imágenes">
        {items.length === 0 ? (
          <EmptyState icon={<Images className="w-6 h-6" />} title="Sin imágenes" description="Cargue al menos una imagen." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item, index) => (
              <div key={`${item.url}-${index}`} className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
                <div className="relative">
                  <StoredAttractionImage
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-36 object-cover"
                    category={attraction.category}
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ayacucho-gold text-ayacucho-night text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-current" /> Portada
                    </span>
                  )}
                  {item.isReferential && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-slate-500 text-[9px] font-bold">
                      Referencial
                    </span>
                  )}
                </div>
                <div className="p-2.5 space-y-2">
                  <input
                    value={item.alt}
                    onChange={(e) => {
                      const next = [...items];
                      next[index] = { ...item, alt: e.target.value };
                      setItems(next);
                    }}
                    onBlur={() => persist(items)}
                    placeholder="Texto alternativo"
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-[11px] focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/40"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      title="Mover a la izquierda"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      title="Mover a la derecha"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setCover(index)}
                      disabled={index === 0}
                      title="Establecer como portada"
                      className="p-1.5 rounded-lg bg-amber-50 text-ayacucho-gold hover:bg-amber-100 disabled:opacity-40"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeAt(index)}
                      disabled={items.length === 1}
                      title="Eliminar"
                      className="ml-auto p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-40"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default AttractionImagesPage;
