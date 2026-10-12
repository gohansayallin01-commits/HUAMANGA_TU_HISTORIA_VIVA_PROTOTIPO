import React, { useEffect, useMemo, useState } from 'react';
import { Store, Plus, Search, CheckCircle2, XCircle, Eye, EyeOff, Trash2, Pencil } from 'lucide-react';
import {
  businessAdminService,
  businessStatusLabel,
  BusinessReviewStatus,
  AffiliatedBusiness,
} from '../../services/businessAdminService';
import { AdminPageHeader, AdminCard, AdminButton, AdminField, inputClass, EmptyState } from '../../components/admin/AdminUI';
import { StoredAttractionImage } from '../../components/common/StoredAttractionImage';

const STATUS_TONE: Record<BusinessReviewStatus, string> = {
  solicitud: 'bg-amber-50 text-amber-700 border-amber-200',
  aprobado: 'bg-blue-50 text-ayacucho-deep border-blue-200',
  rechazado: 'bg-rose-50 text-rose-600 border-rose-200',
  publicado: 'bg-emerald-50 text-ayacucho-success border-emerald-200',
  suspendido: 'bg-slate-100 text-slate-500 border-slate-200',
};

const emptyDraft: Partial<AffiliatedBusiness> = {
  name: '',
  category: 'Restaurante',
  district: 'Ayacucho',
  address: '',
  phone: '',
  description: '',
  status: 'solicitud',
};

export const BusinessesPage: React.FC = () => {
  const [items, setItems] = useState<AffiliatedBusiness[]>(() => businessAdminService.getAll());
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BusinessReviewStatus | 'todos'>('todos');
  const [editing, setEditing] = useState<AffiliatedBusiness | null>(null);
  const [draft, setDraft] = useState<Partial<AffiliatedBusiness>>(emptyDraft);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handler = () => setItems(businessAdminService.getAll());
    window.addEventListener('huamanga:businesses', handler);
    return () => window.removeEventListener('huamanga:businesses', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((b) => (statusFilter === 'todos' ? true : b.status === statusFilter))
      .filter((b) => (q ? b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) : true));
  }, [items, query, statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setIsFormOpen(true);
  };

  const openEdit = (b: AffiliatedBusiness) => {
    setEditing(b);
    setDraft({ ...b });
    setIsFormOpen(true);
  };

  const save = () => {
    if (!draft.name?.trim()) return;
    if (editing) businessAdminService.update(editing.id, draft);
    else businessAdminService.create(draft);
    setIsFormOpen(false);
  };

  const counts = useMemo(
    () => ({
      total: items.length,
      solicitud: items.filter((b) => b.status === 'solicitud').length,
      publicado: items.filter((b) => b.status === 'publicado').length,
    }),
    [items]
  );

  return (
    <div>
      <AdminPageHeader
        title="Negocios afiliados"
        subtitle={`${counts.total} registrados · ${counts.solicitud} solicitudes pendientes`}
        icon={<Store className="w-5 h-5" />}
        actions={
          <AdminButton variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>
            Nuevo negocio
          </AdminButton>
        }
      />

      <AdminCard className="mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar negocio o rubro…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BusinessReviewStatus | 'todos')}
            className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/40"
          >
            <option value="todos">Todos los estados</option>
            {(['solicitud', 'aprobado', 'publicado', 'rechazado', 'suspendido'] as BusinessReviewStatus[]).map((s) => (
              <option key={s} value={s}>
                {businessStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </AdminCard>

      {filtered.length === 0 ? (
        <AdminCard>
          <EmptyState icon={<Store className="w-6 h-6" />} title="Sin negocios" description="No hay negocios que coincidan con el filtro." />
        </AdminCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden flex flex-col">
              <StoredAttractionImage src={b.image} alt={b.name} className="w-full h-32 object-cover" />
              <div className="p-3.5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_TONE[b.status]}`}>
                    {businessStatusLabel(b.status)}
                  </span>
                  <span className="text-[10px] text-slate-400">{b.category}</span>
                </div>
                <h3 className="text-sm font-bold text-ayacucho-night mt-1.5">{b.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 flex-1">{b.description || 'Sin descripción.'}</p>
                <p className="text-[10px] text-slate-400 mt-1.5">{b.district} · {b.phone || 'Sin teléfono'}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  {b.status !== 'publicado' ? (
                    <AdminButton
                      variant="primary"
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      onClick={() => businessAdminService.setStatus(b.id, 'publicado')}
                    >
                      Publicar
                    </AdminButton>
                  ) : (
                    <AdminButton
                      variant="ghost"
                      icon={<EyeOff className="w-3.5 h-3.5" />}
                      onClick={() => businessAdminService.setStatus(b.id, 'suspendido')}
                    >
                      Suspender
                    </AdminButton>
                  )}
                  <button
                    title="Editar"
                    onClick={() => openEdit(b)}
                    className="ml-auto p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    title="Eliminar"
                    onClick={() => businessAdminService.remove(b.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-modal p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              {editing ? 'Editar negocio afiliado' : 'Registrar negocio afiliado'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminField label="Nombre" required className="sm:col-span-2">
                <input className={inputClass()} value={draft.name ?? ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </AdminField>
              <AdminField label="Rubro / categoría">
                <input className={inputClass()} value={draft.category ?? ''} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
              </AdminField>
              <AdminField label="Distrito">
                <input className={inputClass()} value={draft.district ?? ''} onChange={(e) => setDraft({ ...draft, district: e.target.value })} />
              </AdminField>
              <AdminField label="Dirección" className="sm:col-span-2">
                <input className={inputClass()} value={draft.address ?? ''} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
              </AdminField>
              <AdminField label="Teléfono">
                <input className={inputClass()} value={draft.phone ?? ''} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </AdminField>
              <AdminField label="Estado">
                <select
                  className={inputClass()}
                  value={draft.status ?? 'solicitud'}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as BusinessReviewStatus })}
                >
                  {(['solicitud', 'aprobado', 'publicado', 'rechazado', 'suspendido'] as BusinessReviewStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {businessStatusLabel(s)}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Descripción" className="sm:col-span-2">
                <textarea
                  rows={3}
                  className={inputClass()}
                  value={draft.description ?? ''}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </AdminField>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <AdminButton variant="secondary" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </AdminButton>
              <AdminButton variant="primary" icon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={save} disabled={!draft.name?.trim()}>
                Guardar
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessesPage;
