import React, { useMemo } from 'react';
import { BarChart3, MapPin, Store, History, Star, Image as ImageIcon } from 'lucide-react';
import { useAttractions } from '../../context/AttractionsContext';
import { attractionService } from '../../services/attractionService';
import { businessAdminService } from '../../services/businessAdminService';
import { AdminPageHeader, AdminCard, StatusBadge, STATUS_LABELS } from '../../components/admin/AdminUI';
import { isStoredRef } from '../../components/common/StoredAttractionImage';
import { PublicationStatus } from '../../types';

const STATUS_ORDER: PublicationStatus[] = ['publicado', 'borrador', 'pendiente', 'desactivado', 'archivado'];

export const ReportsPage: React.FC = () => {
  const { attractions } = useAttractions();
  const businesses = useMemo(() => businessAdminService.getAll(), []);
  const history = useMemo(() => attractionService.getHistory(), []);

  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};
    STATUS_ORDER.forEach((s) => (map[s] = 0));
    attractions.forEach((a) => {
      const s = a.publicationStatus ?? 'borrador';
      map[s] = (map[s] ?? 0) + 1;
    });
    return map;
  }, [attractions]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    attractions.forEach((a) => (map[a.category] = (map[a.category] ?? 0) + 1));
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [attractions]);

  const total = attractions.length || 1;
  const maxCategory = Math.max(...byCategory.map(([, n]) => n), 1);
  const storedImageCount = attractions.reduce((acc, a) => acc + a.images.filter((i) => isStoredRef(i)).length, 0);
  const referentialCount = attractions.reduce((acc, a) => acc + a.images.filter((i) => !isStoredRef(i)).length, 0);

  return (
    <div>
      <AdminPageHeader
        title="Reportes turísticos"
        subtitle="Indicadores de gestión para la exposición"
        icon={<BarChart3 className="w-5 h-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Metric label="Atractivos" value={attractions.length} icon={<MapPin className="w-5 h-5 text-ayacucho-deep" />} tone="bg-blue-50" />
        <Metric label="Negocios afiliados" value={businesses.length} icon={<Store className="w-5 h-5 text-ayacucho-gold" />} tone="bg-yellow-50" />
        <Metric label="Cambios registrados" value={history.length} icon={<History className="w-5 h-5 text-ayacucho-success" />} tone="bg-emerald-50" />
        <Metric
          label="Fotos propias"
          value={storedImageCount}
          icon={<ImageIcon className="w-5 h-5 text-ayacucho-deep" />}
          tone="bg-slate-100"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <AdminCard title="Distribución por estado editorial" icon={<BarChart3 className="w-4 h-4" />}>
          <div className="space-y-3">
            {STATUS_ORDER.map((s) => {
              const n = byStatus[s] ?? 0;
              const pct = Math.round((n / total) * 100);
              return (
                <div key={s}>
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge status={s} />
                    <span className="text-[11px] font-bold text-slate-600">
                      {n} · {pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-ayacucho-gold transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard title="Atractivos por categoría" icon={<MapPin className="w-4 h-4" />}>
          <div className="space-y-2.5">
            {byCategory.map(([cat, n]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="w-24 text-[11px] font-semibold text-slate-600 capitalize truncate">{cat}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-ayacucho-deep transition-all" style={{ width: `${(n / maxCategory) * 100}%` }} />
                </div>
                <span className="text-[11px] font-bold text-slate-500 w-6 text-right">{n}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Calidad del contenido" icon={<Star className="w-4 h-4" />} className="mt-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <QualityItem label="Fotografías propias cargadas" value={storedImageCount} good={storedImageCount > 0} />
          <QualityItem label="Imágenes referenciales de demostración" value={referentialCount} good />
          <QualityItem
            label="Atractivos destacados"
            value={attractions.filter((a) => a.isFeatured).length}
            good={attractions.filter((a) => a.isFeatured).length > 0}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-3">
          Este prototipo utiliza ilustraciones referenciales de demostración cuando no existen fotografías propias.
          Reemplace las imágenes referenciales desde la sección «Imágenes» de cada atractivo.
        </p>
      </AdminCard>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number; icon: React.ReactNode; tone: string }> = ({ label, value, icon, tone }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-4">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${tone}`}>{icon}</div>
    <div className="text-2xl font-bold text-ayacucho-night">{value}</div>
    <div className="text-[11px] text-slate-500 font-medium">{label}</div>
  </div>
);

const QualityItem: React.FC<{ label: string; value: number; good?: boolean }> = ({ label, value, good }) => (
  <div className={`p-3 rounded-xl border ${good ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
    <div className="text-xl font-bold text-ayacucho-night">{value}</div>
    <div className="text-[11px] text-slate-500">{label}</div>
  </div>
);

export default ReportsPage;
