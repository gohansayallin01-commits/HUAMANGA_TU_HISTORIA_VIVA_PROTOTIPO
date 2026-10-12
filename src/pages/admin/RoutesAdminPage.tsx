import React, { useEffect, useState } from 'react';
import { Route, Eye, EyeOff, Clock, MapPin, Gauge } from 'lucide-react';
import { INITIAL_ROUTES } from '../../data/routes';
import { AdminPageHeader, AdminCard } from '../../components/admin/AdminUI';
import { StoredAttractionImage } from '../../components/common/StoredAttractionImage';

const KEY = 'huamanga_admin_route_visibility';

function readVisibility(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const RoutesAdminPage: React.FC = () => {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() => readVisibility());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(visibility));
  }, [visibility]);

  const isVisible = (id: string) => visibility[id] !== false;

  return (
    <div>
      <AdminPageHeader
        title="Rutas turísticas"
        subtitle={`${INITIAL_ROUTES.length} rutas temáticas de Huamanga`}
        icon={<Route className="w-5 h-5" />}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {INITIAL_ROUTES.map((r) => (
          <AdminCard key={r.id} className="flex flex-col">
            <StoredAttractionImage src={r.image} alt={r.title} className="w-full h-36 object-cover rounded-xl mb-3" />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-ayacucho-night">{r.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{r.description}</p>
              </div>
              <button
                onClick={() => setVisibility((v) => ({ ...v, [r.id]: !isVisible(r.id) }))}
                title={isVisible(r.id) ? 'Ocultar ruta' : 'Mostrar ruta'}
                className={`p-2 rounded-xl shrink-0 ${isVisible(r.id) ? 'bg-emerald-50 text-ayacucho-success' : 'bg-slate-100 text-slate-400'}`}
              >
                {isVisible(r.id) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {r.durationLabel}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {r.stopsCount} paradas
              </span>
              <span className="inline-flex items-center gap-1">
                <Gauge className="w-3 h-3" /> {r.difficulty}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-500 mb-1.5">Paradas</p>
              <ol className="space-y-1">
                {r.stops.map((s) => (
                  <li key={s.id} className="text-[11px] text-slate-600 flex gap-2">
                    <span className="w-4 h-4 rounded-full bg-ayacucho-gold/20 text-ayacucho-deep text-[9px] font-bold flex items-center justify-center shrink-0">
                      {s.order}
                    </span>
                    <span className="truncate">{s.name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
};

export default RoutesAdminPage;
