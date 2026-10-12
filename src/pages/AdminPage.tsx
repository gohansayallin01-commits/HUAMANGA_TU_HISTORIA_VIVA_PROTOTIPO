import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Compass,
  Building2,
  Calendar,
  ArrowLeft,
  AlertTriangle,
  Copy,
  History,
  Search,
  Eye,
  EyeOff,
  MapPin,
  ImageOff,
} from 'lucide-react';
import { useToast } from '../components/common/ToastContext';
import { useI18n } from '../i18n/i18nContext';
import { useAttractions } from '../context/AttractionsContext';
import { attractionService } from '../services/attractionService';
import { Attraction, PublicationStatus, AdminRole, AdminRoleInfo, AdminHistoryEntry } from '../types';
import { Modal } from '../components/common/Modal';
import { ImageFallback } from '../components/common/ImageFallback';
import { AttractionFormModal } from '../components/admin/AttractionFormModal';

const ADMIN_PASSWORD = 'admin123';

const ROLES: AdminRoleInfo[] = [
  {
    id: 'superadmin',
    name: 'Superadministrador',
    description: 'Acceso total: atractivos, usuarios y configuración.',
    permissions: ['CRUD de atractivos', 'Publicar/despublicar', 'Restaurar datos', 'Ver historial'],
  },
  {
    id: 'municipal',
    name: 'Administrador municipal',
    description: 'Gestión turística de la Municipalidad Provincial de Huamanga.',
    permissions: ['CRUD de atractivos', 'Publicar/despublicar', 'Ver historial'],
  },
  {
    id: 'editor',
    name: 'Editor de contenidos',
    description: 'Redacta y prepara fichas; no publica directamente.',
    permissions: ['Crear/editar como borrador', 'Enviar a revisión'],
  },
];

const STATUS_META: Record<PublicationStatus, { label: string; className: string }> = {
  borrador: { label: 'Borrador', className: 'bg-slate-100 text-slate-600' },
  pendiente: { label: 'Pendiente', className: 'bg-amber-50 text-amber-700' },
  publicado: { label: 'Publicado', className: 'bg-emerald-50 text-emerald-700' },
  desactivado: { label: 'Desactivado', className: 'bg-rose-50 text-rose-600' },
  archivado: { label: 'Archivado', className: 'bg-slate-200 text-slate-500' },
};

const STATUS_ORDER: PublicationStatus[] = ['borrador', 'pendiente', 'publicado', 'desactivado', 'archivado'];

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { showToast } = useToast();
  const { attractions } = useAttractions();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [role, setRole] = useState<AdminRole>('superadmin');

  const [view, setView] = useState<'attractions' | 'history'>('attractions');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | PublicationStatus>('todos');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<Attraction | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Attraction | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [history, setHistory] = useState<AdminHistoryEntry[]>(() => attractionService.getHistory());

  useEffect(() => {
    const sync = () => setHistory(attractionService.getHistory());
    window.addEventListener('huamanga:history', sync);
    return () => window.removeEventListener('huamanga:history', sync);
  }, []);

  const currentRole = ROLES.find((r) => r.id === role)!;

  const stats = useMemo(() => {
    const published = attractions.filter((a) => (a.publicationStatus ?? 'publicado') === 'publicado').length;
    const drafts = attractions.filter((a) => a.publicationStatus === 'borrador').length;
    const pending = attractions.filter((a) => a.publicationStatus === 'pendiente').length;
    const disabled = attractions.filter(
      (a) => a.publicationStatus === 'desactivado' || a.publicationStatus === 'archivado' || a.isActive === false
    ).length;
    const categories = new Set(attractions.map((a) => a.category)).size;
    const referential = attractions.filter((a) => a.isReferentialImage).length;
    const avgRating =
      attractions.length > 0
        ? attractions.reduce((sum, a) => sum + a.rating, 0) / attractions.length
        : 0;
    return { published, drafts, pending, disabled, categories, referential, avgRating };
  }, [attractions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return attractions.filter((a) => {
      const status = a.publicationStatus ?? 'publicado';
      const matchesStatus = statusFilter === 'todos' || status === statusFilter;
      const matchesQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [attractions, query, statusFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      showToast(`Acceso concedido como ${currentRole.name} (demostración)`, 'success');
    } else {
      showToast('Contraseña incorrecta. Utilice admin123 para la exposición.', 'alert');
    }
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (attr: Attraction) => {
    setFormMode('edit');
    setEditing(attr);
    setIsFormOpen(true);
  };

  const handleDuplicate = (attr: Attraction) => {
    const copy = attractionService.duplicate(attr.id);
    if (copy) showToast(`Se duplicó "${attr.name}" como borrador.`, 'info');
  };

  const handleToggleActive = (attr: Attraction) => {
    attractionService.toggleActive(attr.id);
    showToast(
      attr.isActive !== false ? `"${attr.name}" fue desactivado.` : `"${attr.name}" fue publicado.`,
      'info'
    );
  };

  const handleStatusChange = (attr: Attraction, status: PublicationStatus) => {
    attractionService.setPublicationStatus(attr.id, status);
    showToast(`Estado de "${attr.name}" actualizado a ${status}.`, 'success');
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    attractionService.remove(deleteTarget.id);
    showToast(`Atractivo "${deleteTarget.name}" eliminado.`, 'info');
    setDeleteTarget(null);
  };

  const handleReset = () => {
    attractionService.resetToDefaults();
    attractionService.clearHistory();
    setIsResetOpen(false);
    showToast('Base de atractivos restaurada a los datos originales.', 'success');
  };

  // ------------------------------------------------------------------
  // PANTALLA DE ACCESO DEMOSTRATIVO
  // ------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-modal text-slate-800 space-y-5 animate-slide-up">
          <div className="w-14 h-14 bg-ayacucho-night text-ayacucho-gold rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <span className="inline-block bg-ayacucho-gold/15 text-ayacucho-deep text-[10px] font-bold px-2 py-0.5 rounded-full border border-ayacucho-gold/30">
              Municipalidad Provincial de Huamanga
            </span>
            <h2 className="text-xl font-bold text-ayacucho-night font-cultural">
              Acceso al Panel Administrativo
            </h2>
            <p className="text-xs text-slate-500">
              Plataforma de gestión turística para Huamanga y Ayacucho
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Credencial académica de exposición:</strong>
              <span>
                Contraseña:{' '}
                <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-ayacucho-night border border-amber-300">
                  admin123
                </code>
              </span>
              <p className="text-[10px] text-amber-700 mt-1">
                * Administración demostrativa con almacenamiento local. No constituye seguridad real.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Rol para la demostración:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition ${
                    role === r.id
                      ? 'bg-ayacucho-night text-ayacucho-lightgold border-ayacucho-night'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r.id === 'superadmin' ? 'Super' : r.id === 'municipal' ? 'Municipal' : 'Editor'}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">{currentRole.description}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ingrese contraseña demostrativa:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-ayacucho-lightgold text-xs font-bold transition shadow-xs"
            >
              Ingresar al panel
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            ← Volver a la portada de viajeros
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // PANEL PRINCIPAL
  // ------------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-24 space-y-6 animate-fade-in text-slate-800">
      {/* Cabecera */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Volver a la portada"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-ayacucho-night font-cultural">
                Panel de Administración Turística
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {currentRole.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Municipalidad Provincial de Huamanga · Administración demostrativa con almacenamiento local
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold cursor-pointer"
            title="Cambiar rol (demostración)"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsResetOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
            title="Restaurar datos originales"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ayacucho-gold" />
            <span className="hidden sm:inline">Restaurar datos</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-ayacucho-alert text-xs font-bold transition"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Métricas reales del sistema */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total atractivos</span>
            <Compass className="w-4 h-4 text-ayacucho-deep" />
          </div>
          <div className="text-2xl font-extrabold text-ayacucho-night">{attractions.length}</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            {stats.categories} categorías activas
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">Publicados</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-ayacucho-night">{stats.published}</div>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
            {stats.pending} pendientes · {stats.drafts} borradores
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">Ocultos / desactivados</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-ayacucho-night">{stats.disabled}</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">No visibles al visitante</span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold">Valoración media</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-ayacucho-night">★ {stats.avgRating.toFixed(1)}</div>
          <span className="text-[11px] text-slate-500 font-medium block mt-1">
            {stats.referential} imágenes referenciales
          </span>
        </div>
      </div>

      {/* Conmutador de vista */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('attractions')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            view === 'attractions' ? 'bg-ayacucho-night text-ayacucho-lightgold' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <span className="inline-flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Atractivos</span>
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            view === 'history' ? 'bg-ayacucho-night text-ayacucho-lightgold' : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <span className="inline-flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> Historial ({history.length})</span>
        </button>
      </div>

      {view === 'attractions' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-ayacucho-night font-cultural">
                Gestión de atractivos turísticos
              </h3>
              <p className="text-xs text-slate-500">
                Crea, edita, publica, desactiva o elimina puntos de interés de la base local
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-ayacucho-gold hover:bg-ayacucho-lightgold text-ayacucho-night text-xs font-bold flex items-center gap-1.5 transition shadow-xs w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar atractivo</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row gap-2 border-b border-slate-100 bg-slate-50/60">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, distrito o categoría…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'todos' | PublicationStatus)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
            >
              <option value="todos">Todos los estados</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Atractivo</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3">Coordenadas</th>
                  <th className="py-3 px-3">Tarifa</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((attr) => {
                  const status = (attr.publicationStatus ?? 'publicado') as PublicationStatus;
                  return (
                    <tr key={attr.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-ayacucho-night">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                            <ImageFallback src={attr.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="line-clamp-1 block">{attr.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{attr.district}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-600">
                          {attr.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {attr.coordinates.lat.toFixed(4)}, {attr.coordinates.lng.toFixed(4)}
                        </span>
                        {attr.isReferentialImage && (
                          <span className="text-[9px] text-amber-600 flex items-center gap-0.5 mt-0.5">
                            <ImageOff className="w-3 h-3" /> imagen referencial
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">
                        {attr.price === 0 ? 'Gratis' : `S/ ${attr.price}`}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(attr, e.target.value as PublicationStatus)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-full cursor-pointer border-0 ${STATUS_META[status].className}`}
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>{STATUS_META[s].label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <button
                            onClick={() => handleToggleActive(attr)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-ayacucho-night hover:bg-slate-200 transition"
                            title={attr.isActive !== false ? 'Desactivar' : 'Publicar'}
                          >
                            {attr.isActive !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDuplicate(attr)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-ayacucho-night hover:bg-slate-200 transition"
                            title="Duplicar"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(attr)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-ayacucho-night hover:bg-slate-200 transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(attr)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      No se encontraron atractivos con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-ayacucho-night font-cultural">Historial de cambios</h3>
              <p className="text-xs text-slate-500">Registro demostrativo de acciones administrativas (local)</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => {
                  attractionService.clearHistory();
                  showToast('Historial vaciado.', 'info');
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Vaciar historial
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            {history.map((h) => (
              <div key={h.id} className="px-4 sm:px-5 py-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-ayacucho-night/5 text-ayacucho-deep flex items-center justify-center shrink-0">
                  <History className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-ayacucho-night">
                    {h.action}: <span className="font-semibold text-slate-600">{h.attractionName}</span>
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(h.date).toLocaleString('es-PE')} · {h.user}
                    {h.previousStatus !== '-' && ` · ${h.previousStatus} → ${h.newStatus}`}
                  </p>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="px-5 py-10 text-center text-slate-400 text-xs">
                Aún no hay acciones registradas. Crea, edita o cambia el estado de un atractivo.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal crear/editar */}
      <AttractionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        mode={formMode}
        initial={editing}
        onSaved={() => {
          /* el contexto se actualiza vía suscripción del servicio */
        }}
      />

      {/* Confirmar eliminación */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirmar eliminación">
        <div className="text-xs text-slate-600 space-y-3">
          <p>
            ¿Está seguro de eliminar el atractivo <strong>"{deleteTarget?.name}"</strong>? Esta acción se
            guardará localmente en el navegador y puede revertirse con "Restaurar datos".
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-ayacucho-alert hover:bg-red-700 text-white font-bold transition"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmar restauración */}
      <Modal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} title="Restaurar datos originales">
        <div className="text-xs text-slate-600 space-y-3">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Se descartarán todos los cambios locales (creaciones, ediciones y eliminaciones) y se restaurará
              la base original de demostración con 18 atractivos. El historial también se vaciará.
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsResetOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-ayacucho-night text-ayacucho-lightgold font-bold transition hover:bg-ayacucho-deep flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
