import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  MapPin,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  AlertTriangle,
  CheckCircle2,
  Wand2,
  Eye,
} from 'lucide-react';
import { Attraction, CategoryType, PublicationStatus, ImageMeta } from '../../types';
import { attractionService, normalizeAttraction } from '../../services/attractionService';
import { localReferentialImages } from '../../data/attractions';
import { useToast } from '../common/ToastContext';
import { ImageFallback } from '../common/ImageFallback';
import { CoordinatePickerMap } from './CoordinatePickerMap';

interface AttractionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initial: Attraction | null;
  onSaved: (attraction: Attraction) => void;
}

type Tab = 'info' | 'location' | 'images' | 'publish';

const CATEGORY_OPTIONS: { value: CategoryType; label: string }[] = [
  { value: 'historico', label: 'Lugares históricos' },
  { value: 'iglesia', label: 'Iglesias' },
  { value: 'museo', label: 'Museos' },
  { value: 'naturaleza', label: 'Naturaleza' },
  { value: 'gastronomia', label: 'Gastronomía' },
  { value: 'hospedaje', label: 'Hospedajes' },
  { value: 'artesania', label: 'Artesanía' },
  { value: 'tour', label: 'Tours' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'evento', label: 'Eventos' },
];

const STATUS_OPTIONS: { value: PublicationStatus; label: string }[] = [
  { value: 'borrador', label: 'Borrador (solo administrador)' },
  { value: 'pendiente', label: 'Pendiente de revisión' },
  { value: 'publicado', label: 'Publicado (visible al visitante)' },
  { value: 'desactivado', label: 'Desactivado (oculto)' },
  { value: 'archivado', label: 'Archivado' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const emptyDraft = (): Attraction =>
  normalizeAttraction({
    name: '',
    nameEn: '',
    category: 'historico',
    shortDesc: '',
    coordinates: { lat: -13.1631, lng: -74.2236 },
    images: localReferentialImages('nuevo-atractivo'),
    publicationStatus: 'borrador',
    isReferentialImage: true,
  });

const inputClass =
  'w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none';
const labelClass = 'font-bold text-slate-700 block mb-1';

export const AttractionFormModal: React.FC<AttractionFormModalProps> = ({
  isOpen,
  onClose,
  mode,
  initial,
  onSaved,
}) => {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('info');
  const [draft, setDraft] = useState<Attraction>(emptyDraft());
  const [imageMeta, setImageMeta] = useState<ImageMeta[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTab('info');
    setSubmitted(false);
    setNewImageUrl('');
    if (mode === 'edit' && initial) {
      const copy = normalizeAttraction({ ...initial });
      setDraft(copy);
      setImageMeta(copy.imageMeta && copy.imageMeta.length ? copy.imageMeta.map((m) => ({ ...m })) : []);
    } else {
      const d = emptyDraft();
      setDraft(d);
      setImageMeta(d.imageMeta ? d.imageMeta.map((m) => ({ ...m })) : []);
    }
  }, [isOpen, mode, initial]);

  const update = (patch: Partial<Attraction>) => setDraft((d) => ({ ...d, ...patch }));

  const duplicate = useMemo(() => {
    if (!draft.coordinates) return undefined;
    return attractionService.findDuplicateCoordinates(draft.coordinates, mode === 'edit' ? draft.id : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.coordinates.lat, draft.coordinates.lng, draft.id, mode]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!draft.name.trim()) e.name = 'El nombre es obligatorio.';
    if (!draft.shortDesc.trim()) e.shortDesc = 'La descripción breve es obligatoria.';

    const { lat, lng } = draft.coordinates;
    if (typeof lat !== 'number' || Number.isNaN(lat)) e.lat = 'Latitud inválida.';
    else if (lat < -90 || lat > 90) e.lat = 'La latitud debe estar entre -90 y 90.';
    if (typeof lng !== 'number' || Number.isNaN(lng)) e.lng = 'Longitud inválida.';
    else if (lng < -180 || lng > 180) e.lng = 'La longitud debe estar entre -180 y 180.';
    if (lat === 0 && lng === 0) e.coords = 'Coordenadas (0,0) no son válidas para un atractivo real.';
    if (duplicate) e.coords = `Ya existe "${duplicate.name}" con las mismas coordenadas. Ajusta la ubicación.`;
    return e;
  }, [draft.name, draft.shortDesc, draft.coordinates, duplicate]);

  const syncImages = (metas: ImageMeta[]) => {
    setImageMeta(metas);
    update({ images: metas.map((m) => m.url), imageMeta: metas });
  };

  const addImage = () => {
    const url = newImageUrl.trim();
    if (!url) {
      showToast('Ingresa una URL de imagen válida.', 'alert');
      return;
    }
    const meta: ImageMeta = {
      url,
      alt: `${draft.name || 'Atractivo'} - imagen ${imageMeta.length + 1}`,
      source: 'Por confirmar',
      author: 'Autor por confirmar',
      license: 'Por verificar',
      isReferential: true,
    };
    syncImages([...imageMeta, meta]);
    setNewImageUrl('');
  };

  const generateReferential = () => {
    const slug = draft.slug || slugify(draft.name || 'atractivo');
    const [primary, secondary] = localReferentialImages(slug);
    const metas: ImageMeta[] = [
      {
        url: primary,
        alt: `${draft.name || 'Atractivo'} - portada (referencial)`,
        source: 'Ilustración referencial de demostración',
        author: 'Huamanga: Tu Historia Viva',
        license: 'Uso demostrativo académico',
        isReferential: true,
      },
      {
        url: secondary,
        alt: `${draft.name || 'Atractivo'} - galería (referencial)`,
        source: 'Ilustración referencial de demostración',
        author: 'Huamanga: Tu Historia Viva',
        license: 'Uso demostrativo académico',
        isReferential: true,
      },
    ];
    syncImages(metas);
    update({ isReferentialImage: true });
    showToast('Imágenes referenciales generadas.', 'info');
  };

  const updateImageField = (index: number, patch: Partial<ImageMeta>) => {
    const next = imageMeta.map((m, i) => (i === index ? { ...m, ...patch } : m));
    syncImages(next);
  };

  const removeImage = (index: number) => {
    syncImages(imageMeta.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= imageMeta.length) return;
    const next = [...imageMeta];
    [next[index], next[target]] = [next[target], next[index]];
    syncImages(next);
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...imageMeta];
    const [img] = next.splice(index, 1);
    next.unshift(img);
    syncImages(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name || errors.shortDesc) setTab('info');
      else setTab('location');
      showToast('Revisa los campos marcados antes de guardar.', 'alert');
      return;
    }
    if (imageMeta.length === 0) {
      showToast('Agrega al menos una imagen (puede ser referencial).', 'alert');
      setTab('images');
      return;
    }

    const status = draft.publicationStatus ?? 'publicado';
    const payload: Partial<Attraction> = {
      ...draft,
      slug: draft.slug ? slugify(draft.slug) : slugify(draft.name),
      images: imageMeta.map((m) => m.url),
      imageMeta,
      isFree: draft.price === 0,
      isActive: status === 'publicado' || status === 'pendiente' || status === 'borrador',
      lastModified: new Date().toISOString(),
    };

    const saved =
      mode === 'edit'
        ? attractionService.update(draft.id, payload)
        : attractionService.create(payload);

    if (saved) {
      showToast(
        mode === 'edit'
          ? `Atractivo "${saved.name}" actualizado.`
          : `Atractivo "${saved.name}" creado.`,
        'success'
      );
      onSaved(saved);
      onClose();
    }
  };

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'info', label: 'Información' },
    { id: 'location', label: 'Ubicación' },
    { id: 'images', label: 'Imágenes' },
    { id: 'publish', label: 'Publicación' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-modal overflow-hidden max-h-[92vh] flex flex-col animate-slide-up border border-slate-100">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-ayacucho-warmwhite">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-ayacucho-night text-ayacucho-gold flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ayacucho-night font-cultural">
                {mode === 'edit' ? 'Editar atractivo turístico' : 'Nuevo atractivo turístico'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Administración demostrativa con almacenamiento local (localStorage)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pestañas */}
        <div className="flex gap-1 px-4 pt-3 border-b border-slate-100 overflow-x-auto no-scrollbar">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg whitespace-nowrap transition ${
                tab === tb.id
                  ? 'bg-white text-ayacucho-night border border-slate-100 border-b-white -mb-px'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tb.label}
              {tb.id === 'location' && errors.coords && <span className="text-rose-500 ml-1">●</span>}
              {tb.id === 'images' && imageMeta.length === 0 && <span className="text-rose-500 ml-1">●</span>}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* -------------------- INFORMACIÓN -------------------- */}
          {tab === 'info' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nombre (Español) *</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => update({ name: e.target.value, slug: mode === 'create' ? slugify(e.target.value) : draft.slug })}
                    className={inputClass}
                  />
                  {submitted && errors.name && <p className="text-rose-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className={labelClass}>Nombre (Inglés)</label>
                  <input type="text" value={draft.nameEn} onChange={(e) => update({ nameEn: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select
                    value={draft.category}
                    onChange={(e) => update({ category: e.target.value as CategoryType })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Subcategoría / tipo</label>
                  <input type="text" value={draft.subcategory ?? ''} onChange={(e) => update({ subcategory: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Distrito</label>
                  <input type="text" value={draft.district} onChange={(e) => update({ district: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Provincia</label>
                  <input type="text" value={draft.province ?? ''} onChange={(e) => update({ province: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Región</label>
                  <input type="text" value={draft.region ?? ''} onChange={(e) => update({ region: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Dirección</label>
                <input type="text" value={draft.address} onChange={(e) => update({ address: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Referencia (cómo ubicarlo)</label>
                <input type="text" value={draft.reference ?? ''} onChange={(e) => update({ reference: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Descripción breve *</label>
                <textarea rows={2} value={draft.shortDesc} onChange={(e) => update({ shortDesc: e.target.value })} className={inputClass} />
                {submitted && errors.shortDesc && <p className="text-rose-500 mt-1">{errors.shortDesc}</p>}
              </div>
              <div>
                <label className={labelClass}>Descripción breve (Inglés)</label>
                <textarea rows={2} value={draft.shortDescEn} onChange={(e) => update({ shortDescEn: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Descripción completa</label>
                <textarea rows={3} value={draft.fullDesc} onChange={(e) => update({ fullDesc: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Historia</label>
                <textarea rows={3} value={draft.history} onChange={(e) => update({ history: e.target.value })} className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Horario</label>
                  <input type="text" value={draft.hours} onChange={(e) => update({ hours: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Días de atención</label>
                  <input type="text" value={draft.attentionDays ?? ''} onChange={(e) => update({ attentionDays: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Duración sugerida</label>
                  <input type="text" value={draft.recommendedDuration} onChange={(e) => update({ recommendedDuration: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Tarifa S/ (0 = Gratis)</label>
                  <input
                    type="number"
                    min={0}
                    value={draft.price}
                    onChange={(e) => update({ price: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="text" value={draft.phone} onChange={(e) => update({ phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Sitio web</label>
                  <input type="text" value={draft.website ?? ''} onChange={(e) => update({ website: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Valoración (0-5)</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    value={draft.rating}
                    onChange={(e) => update({ rating: Math.min(5, Math.max(0, Number(e.target.value))) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>N.º de reseñas</label>
                  <input type="number" min={0} value={draft.reviewsCount} onChange={(e) => update({ reviewsCount: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Mejor hora de visita</label>
                  <input type="text" value={draft.bestTimeToVisit} onChange={(e) => update({ bestTimeToVisit: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Servicios (separados por coma)</label>
                <input
                  type="text"
                  value={draft.services.join(', ')}
                  onChange={(e) => update({ services: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Recomendaciones / tips (uno por línea)</label>
                <textarea
                  rows={3}
                  value={draft.tips.join('\n')}
                  onChange={(e) => update({ tips: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Accesibilidad</label>
                <textarea rows={2} value={draft.accessibility} onChange={(e) => update({ accessibility: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Consejos de seguridad</label>
                <textarea rows={2} value={draft.safetyTips} onChange={(e) => update({ safetyTips: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={draft.tags.join(', ')}
                  onChange={(e) => update({ tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* -------------------- UBICACIÓN -------------------- */}
          {tab === 'location' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Latitud *</label>
                  <input
                    type="number"
                    step={0.000001}
                    value={draft.coordinates.lat}
                    onChange={(e) => update({ coordinates: { ...draft.coordinates, lat: Number(e.target.value) } })}
                    className={inputClass}
                  />
                  {submitted && errors.lat && <p className="text-rose-500 mt-1">{errors.lat}</p>}
                </div>
                <div>
                  <label className={labelClass}>Longitud *</label>
                  <input
                    type="number"
                    step={0.000001}
                    value={draft.coordinates.lng}
                    onChange={(e) => update({ coordinates: { ...draft.coordinates, lng: Number(e.target.value) } })}
                    className={inputClass}
                  />
                  {submitted && errors.lng && <p className="text-rose-500 mt-1">{errors.lng}</p>}
                </div>
              </div>

              {errors.coords && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errors.coords}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass + ' mb-0'}>
                    Selecciona la ubicación en el mapa (clic o arrastra el marcador)
                  </label>
                  <button
                    type="button"
                    onClick={() => update({ coordinates: { lat: -13.1631, lng: -74.2236 } })}
                    className="text-[11px] font-semibold text-ayacucho-deep hover:underline"
                  >
                    Centrar en Plaza Mayor
                  </button>
                </div>
                <CoordinatePickerMap
                  lat={draft.coordinates.lat}
                  lng={draft.coordinates.lng}
                  onChange={(lat, lng) => update({ coordinates: { lat, lng } })}
                />
              </div>
            </div>
          )}

          {/* -------------------- IMÁGENES -------------------- */}
          {tab === 'images' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Usa fotografías que puedas verificar. Si no cuentas con una foto oficial del lugar, marca la
                  imagen como <strong>referencial</strong> para ser transparentes con el visitante.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="URL de imagen (https://... o images/atractions/…)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-2 rounded-xl bg-ayacucho-night text-ayacucho-lightgold font-bold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar
                  </button>
                  <button
                    type="button"
                    onClick={generateReferential}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-ayacucho-gold" /> Referencial
                  </button>
                </div>
              </div>

              {imageMeta.length === 0 && (
                <p className="text-slate-400 italic">Aún no hay imágenes asociadas a este atractivo.</p>
              )}

              <div className="space-y-2.5">
                {imageMeta.map((img, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex gap-3">
                      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <ImageFallback src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => updateImageField(idx, { alt: e.target.value })}
                          placeholder="Texto alternativo"
                          className={inputClass}
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            value={img.source ?? ''}
                            onChange={(e) => updateImageField(idx, { source: e.target.value })}
                            placeholder="Fuente"
                            className={inputClass}
                          />
                          <input
                            type="text"
                            value={img.license ?? ''}
                            onChange={(e) => updateImageField(idx, { license: e.target.value })}
                            placeholder="Licencia"
                            className={inputClass}
                          />
                        </div>
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <input
                            type="checkbox"
                            checked={img.isReferential ?? false}
                            onChange={(e) => updateImageField(idx, { isReferential: e.target.checked })}
                          />
                          Imagen referencial (no verificada como oficial del lugar)
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-slate-200">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {idx === 0 ? 'PORTADA' : `Imagen ${idx + 1}`}
                      </span>
                      <div className="flex items-center gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => setCover(idx)}
                            className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-ayacucho-deep hover:bg-slate-100"
                          >
                            Usar de portada
                          </button>
                        )}
                        <button type="button" onClick={() => moveImage(idx, -1)} className="p-1 rounded-lg text-slate-500 hover:bg-white" aria-label="Subir">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => moveImage(idx, 1)} className="p-1 rounded-lg text-slate-500 hover:bg-white" aria-label="Bajar">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => removeImage(idx)} className="p-1 rounded-lg text-rose-500 hover:bg-rose-50" aria-label="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* -------------------- PUBLICACIÓN / VISTA PREVIA -------------------- */}
          {tab === 'publish' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Estado de publicación</label>
                  <select
                    value={draft.publicationStatus ?? 'borrador'}
                    onChange={(e) => update({ publicationStatus: e.target.value as PublicationStatus })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Flujo: borrador → pendiente → publicado → desactivado / archivado
                  </p>
                </div>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked={draft.isFeatured ?? false} onChange={(e) => update({ isFeatured: e.target.checked })} />
                  <span className="font-semibold text-slate-700">Destacar como recomendado</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked={draft.isNearHuamanga ?? false} onChange={(e) => update({ isNearHuamanga: e.target.checked })} />
                  <span className="font-semibold text-slate-700">Cerca de la ciudad de Huamanga</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked={draft.isReferentialImage ?? true} onChange={(e) => update({ isReferentialImage: e.target.checked })} />
                  <span className="font-semibold text-slate-700">Marcar portada como imagen referencial</span>
                </label>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                    <Eye className="w-3.5 h-3.5" /> Identificador público (slug)
                  </div>
                  <code className="text-[11px] break-all">{draft.slug || slugify(draft.name || 'nuevo-atractivo')}</code>
                </div>
              </div>

              <div>
                <span className={labelClass}>Vista previa de la tarjeta</span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-soft max-w-xs">
                  <div className="relative aspect-[4/3] bg-slate-100">
                    <ImageFallback
                      src={imageMeta[0]?.url || draft.images[0]}
                      alt={draft.name}
                      className="w-full h-full object-cover"
                    />
                    {draft.isFeatured && (
                      <span className="absolute top-2 left-2 bg-ayacucho-gold text-ayacucho-night text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                        ★ RECOMENDADO
                      </span>
                    )}
                    {(draft.isReferentialImage ?? true) && (
                      <span className="absolute bottom-2 left-2 bg-black/55 text-ayacucho-lightgold text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        Imagen referencial
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] font-bold uppercase text-ayacucho-deep/70">{draft.category}</span>
                    <h4 className="font-bold text-sm text-ayacucho-night line-clamp-1">{draft.name || 'Nombre del atractivo'}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{draft.shortDesc || 'Descripción breve del lugar.'}</p>
                    <div className="flex items-center justify-between text-[11px] mt-2 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {draft.rating.toFixed(1)}
                      </span>
                      <span className="font-bold text-ayacucho-deep">
                        {draft.price === 0 ? 'Gratis' : `S/ ${draft.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Pie de acciones */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {Object.keys(errors).length === 0 ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Datos válidos</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">{Object.keys(errors).length} campo(s) por corregir</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 rounded-xl bg-ayacucho-gold text-ayacucho-night font-bold hover:bg-ayacucho-lightgold transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{mode === 'edit' ? 'Guardar cambios' : 'Crear atractivo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionFormModal;
