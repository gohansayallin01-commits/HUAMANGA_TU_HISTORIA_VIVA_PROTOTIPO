import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  CheckCircle2,
  FileEdit,
  Clock,
  Store,
  Plus,
  ArrowUpRight,
  History,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';
import { useAttractions } from '../../context/AttractionsContext';
import { attractionService } from '../../services/attractionService';
import { businessAdminService } from '../../services/businessAdminService';
import { AdminHistoryEntry } from '../../types';
import { AdminPageHeader, AdminCard, AdminButton, StatusBadge, EmptyState } from '../../components/admin/AdminUI';
import { StoredAttractionImage } from '../../components/common/StoredAttractionImage';
import { isStoredRef } from '../../components/common/StoredAttractionImage';

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone: string;
  onClick?: () => void;
}> = ({ label, value, icon, tone, onClick }) => (
  <button
    onClick={onClick}
    disabled={!onClick}
    className="text-left bg-white rounded-2xl border border-slate-200 shadow-soft p-4 hover:shadow-elevated transition disabled:cursor-default"
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${tone}`}>{icon}</div>
    <div className="text-2xl font-bold text-ayacucho-night">{value}</div>
    <div className="text-[11px] text-slate-500 font-medium">{label}</div>
  </button>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { attractions } = useAttractions();
  const [history, setHistory] = useState<AdminHistoryEntry[]>(() => attractionService.getHistory());
  const businesses = useMemo(() => businessAdminService.getAll(), [attractions]);

  useEffect(() => {
    const handler = () => setHistory(attractionService.getHistory());
    window.addEventListener('huamanga:history', handler);
    window.addEventListener('huamanga:businesses', handler);
    return () => {
      window.removeEventListener('huamanga:history', handler);
      window.removeEventListener('huamanga:businesses', handler);
    };
  }, []);

  const stats = useMemo(() => {
    const total = attractions.length;
    const published = attractions.filter((a) => a.publicationStatus === 'publicado').length;
    const drafts = attractions.filter((a) => a.publicationStatus === 'borrador').length;
    const pending = attractions.filter((a) => a.publicationStatus === 'pendiente').length;
    const withStoredImages = attractions.filter((a) => a.images.some((img) => isStoredRef(img))).length;
    return { total, published, drafts, pending, withStoredImages };
  }, [attractions]);

  const recent = useMemo(
    () =>
      [...attractions]
        .sort((a, b) => (b.lastModified ?? '').localeCompare(a.lastModified ?? ''))
        .slice(0, 5),
    [attractions]
  );

  return (
    <div>
      <AdminPageHeader
        title="Panel de control"
        subtitle="Resumen de la gestión turística de Huamanga"
        icon={<LayoutDashboard className="w-5 h-5" />}
        actions={
          <AdminButton variant="primary" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => navigate('/admin/atractivos')}>
            Nuevo atractivo
          </AdminButton>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <StatCard
          label="Atractivos totales"
          value={stats.total}
          icon={<MapPin className="w-5 h-5 text-ayacucho-deep" />}
          tone="bg-blue-50"
          onClick={() => navigate('/admin/atractivos')}
        />
        <StatCard
          label="Publicados"
          value={stats.published}
          icon={<CheckCircle2 className="w-5 h-5 text-ayacucho-success" />}
          tone="bg-emerald-50"
          onClick={() => navigate('/admin/atractivos?estado=publicado')}
        />
        <StatCard
          label="Borradores"
          value={stats.drafts}
          icon={<FileEdit className="w-5 h-5 text-slate-500" />}
          tone="bg-slate-100"
          onClick={() => navigate('/admin/atractivos?estado=borrador')}
        />
        <StatCard
          label="Pendientes"
          value={stats.pending}
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          tone="bg-amber-50"
          onClick={() => navigate('/admin/atractivos?estado=pendiente')}
        />
        <StatCard
          label="Con imágenes propias"
          value={stats.withStoredImages}
          icon={<ImageIcon className="w-5 h-5 text-ayacucho-gold" />}
          tone="bg-yellow-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <AdminCard
          title="Actividad reciente"
          description="Últimos atractivos modificados"
          icon={<TrendingUp className="w-4 h-4" />}
          className="lg:col-span-2"
          actions={
            <AdminButton variant="ghost" icon={<ArrowUpRight className="w-3.5 h-3.5" />} onClick={() => navigate('/admin/atractivos')}>
              Ver todos
            </AdminButton>
          }
        >
          {recent.length === 0 ? (
            <EmptyState icon={<MapPin className="w-6 h-6" />} title="Sin atractivos aún" />
          ) : (
            <ul className="space-y-2">
              {recent.map((a) => (
                <li key={a.id}>
                  <button
                    onClick={() => navigate(`/admin/atractivos/${a.id}/informacion`)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition text-left"
                  >
                    <StoredAttractionImage
                      src={a.images[0]}
                      alt={a.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                      category={a.category}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-700 truncate">{a.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{a.district} · {a.category}</div>
                    </div>
                    {a.publicationStatus && <StatusBadge status={a.publicationStatus} />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard
          title="Historial administrativo"
          description="Registro de cambios"
          icon={<History className="w-4 h-4" />}
          actions={
            <button
              onClick={() => {
                attractionService.clearHistory();
                setHistory([]);
              }}
              className="text-[10px] font-bold text-slate-400 hover:text-rose-500"
            >
              Limpiar
            </button>
          }
        >
          {history.length === 0 ? (
            <EmptyState icon={<History className="w-6 h-6" />} title="Sin actividad registrada" />
          ) : (
            <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {history.slice(0, 12).map((h) => (
                <li key={h.id} className="flex gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-ayacucho-gold mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-slate-700">{h.action}</div>
                    <div className="text-[10px] text-slate-400 truncate">{h.attractionName}</div>
                    <div className="text-[9px] text-slate-300">
                      {new Date(h.date).toLocaleString('es-PE')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <button
          onClick={() => navigate('/admin/atractivos')}
          className="bg-gradient-to-tr from-ayacucho-night to-ayacucho-deep rounded-2xl p-4 text-left text-white hover:shadow-elevated transition"
        >
          <MapPin className="w-5 h-5 text-ayacucho-lightgold mb-2" />
          <div className="text-sm font-bold">Gestionar atractivos</div>
          <div className="text-[11px] text-slate-300">Información, ubicación, imágenes y publicación</div>
        </button>
        <button
          onClick={() => navigate('/admin/negocios')}
          className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:shadow-elevated transition"
        >
          <Store className="w-5 h-5 text-ayacucho-gold mb-2" />
          <div className="text-sm font-bold text-ayacucho-night">Negocios afiliados</div>
          <div className="text-[11px] text-slate-400">{businesses.length} registrados</div>
        </button>
        <button
          onClick={() => navigate('/admin/reportes')}
          className="bg-white rounded-2xl border border-slate-200 p-4 text-left hover:shadow-elevated transition"
        >
          <TrendingUp className="w-5 h-5 text-ayacucho-success mb-2" />
          <div className="text-sm font-bold text-ayacucho-night">Reportes turísticos</div>
          <div className="text-[11px] text-slate-400">Indicadores para la exposición</div>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
