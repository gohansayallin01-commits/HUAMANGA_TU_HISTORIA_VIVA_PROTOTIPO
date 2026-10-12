import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Search,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Pencil,
  Star,
  Filter,
} from 'lucide-react';
import { useAttractions } from '../../context/AttractionsContext';
import { attractionService } from '../../services/attractionService';
import { PublicationStatus } from '../../types';
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  StatusBadge,
  EmptyState,
  STATUS_LABELS,
} from '../../components/admin/AdminUI';
import { StoredAttractionImage } from '../../components/common/StoredAttractionImage';

const STATUS_FILTERS: (PublicationStatus | 'todos')[] = [
  'todos',
  'publicado',
  'borrador',
  'pendiente',
  'desactivado',
  'archivado',
];

export const AttractionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { attractions } = useAttractions();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [status, setStatus] = useState<PublicationStatus | 'todos'>(
    (params.get('estado') as PublicationStatus) ?? 'todos'
  );
  const [category, setCategory] = useState<string>('todas');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(attractions.map((a) => a.category))).sort(),
    [attractions]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return attractions
      .filter((a) => (status === 'todos' ? true : a.publicationStatus === status))
      .filter((a) => (category === 'todas' ? true : a.category === category))
      .filter((a) =>
        q
          ? a.name.toLowerCase().includes(q) ||
            a.district.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
          : true
      );
  }, [attractions, query, status, category]);

  const handleCreate = () => {
    const created = attractionService.create({
      name: 'Nuevo atractivo turístico',
      publicationStatus: 'borrador',
      isActive: false,
    });
    navigate(`/admin/atractivos/${created.id}/informacion`);
  };

  const syncParams = (nextQ: string, nextStatus: string) => {
    const next = new URLSearchParams(params);
    if (nextQ) next.set('q', nextQ);
    else next.delete('q');
    if (nextStatus && nextStatus !== 'todos') next.set('estado', nextStatus);
    else next.delete('estado');
    setParams(next, { replace: true });
  };

  return (
    <div>
      <AdminPageHeader
        title="Atractivos turísticos"
        subtitle={`${attractions.length} registros en el inventario turístico`}
        icon={<MapPin className="w-5 h-5" />}
        actions={
          <AdminButton variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleCreate}>
            Nuevo atractivo
          </AdminButton>
        }
      />

      <AdminCard className="mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                syncParams(e.target.value, status);
              }}
              placeholder="Buscar por nombre, distrito o etiqueta…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={status}
              onChange={(e) => {
                const v = e.target.value as PublicationStatus | 'todos';
                setStatus(v);
                syncParams(query, v);
              }}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/40"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === 'todos' ? 'Todos los estados' : STATUS_LABELS[s]}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/40"
            >
              <option value="todas">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState
            icon={<MapPin className="w-6 h-6" />}
            title="No se encontraron atractivos"
            description="Ajusta los filtros o crea un nuevo atractivo turístico."
            action={
              <AdminButton variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={handleCreate}>
                Nuevo atractivo
              </AdminButton>
            }
          />
        </AdminCard>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft p-3 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <StoredAttractionImage
                src={a.images[0]}
                alt={a.name}
                className="w-full sm:w-20 h-32 sm:h-20 rounded-xl object-cover shrink-0"
                category={a.category}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-ayacucho-night truncate">{a.name}</h3>
                  {a.publicationStatus && <StatusBadge status={a.publicationStatus} />}
                  {a.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ayacucho-gold">
                      <Star className="w-3 h-3 fill-current" /> Destacado
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {a.category} · {a.district} · {a.images.length} imagen(es)
                </p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{a.shortDesc || 'Sin descripción breve.'}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <AdminButton
                  variant="ghost"
                  icon={<Pencil className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/admin/atractivos/${a.id}/informacion`)}
                >
                  Editar
                </AdminButton>
                <button
                  title={a.publicationStatus === 'publicado' ? 'Despublicar' : 'Publicar'}
                  onClick={() =>
                    attractionService.setPublicationStatus(
                      a.id,
                      a.publicationStatus === 'publicado' ? 'desactivado' : 'publicado'
                    )
                  }
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  {a.publicationStatus === 'publicado' ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  title="Duplicar"
                  onClick={() => {
                    const copy = attractionService.duplicate(a.id);
                    if (copy) navigate(`/admin/atractivos/${copy.id}/informacion`);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Eliminar"
                  onClick={() => setConfirmDelete(a.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-2xl shadow-modal p-5 max-w-sm w-full animate-slide-up">
            <h3 className="text-sm font-bold text-slate-800">Eliminar atractivo</h3>
            <p className="text-xs text-slate-500 mt-1.5">
              Esta acción quitará el atractivo del inventario turístico. Las imágenes asociadas en el dispositivo
              quedarán sin referencia.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <AdminButton variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </AdminButton>
              <AdminButton
                variant="danger"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  attractionService.remove(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Eliminar
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttractionsPage;
