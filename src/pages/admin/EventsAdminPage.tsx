import React, { useEffect, useState } from 'react';
import { Calendar, Star, MapPin, Clock, Ticket } from 'lucide-react';
import { INITIAL_EVENTS } from '../../data/events';
import { AdminPageHeader, AdminCard } from '../../components/admin/AdminUI';
import { StoredAttractionImage } from '../../components/common/StoredAttractionImage';

const KEY = 'huamanga_admin_event_featured';

function readFeatured(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const EventsAdminPage: React.FC = () => {
  const [featured, setFeatured] = useState<Record<string, boolean>>(() => readFeatured());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(featured));
  }, [featured]);

  const isFeatured = (id: string, fallback: boolean) => featured[id] ?? fallback;

  return (
    <div>
      <AdminPageHeader
        title="Eventos y festividades"
        subtitle={`${INITIAL_EVENTS.length} eventos registrados`}
        icon={<Calendar className="w-5 h-5" />}
      />

      <div className="space-y-3">
        {INITIAL_EVENTS.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl border border-slate-200 shadow-soft p-3 flex flex-col sm:flex-row gap-3">
            <StoredAttractionImage src={e.image} alt={e.title} className="w-full sm:w-40 h-32 sm:h-28 object-cover rounded-xl shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-ayacucho-night">{e.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">{e.category}</span>
                {isFeatured(e.id, e.isFeatured) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ayacucho-gold">
                    <Star className="w-3 h-3 fill-current" /> Destacado
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{e.description}</p>
              <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {e.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {e.time}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {e.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Ticket className="w-3 h-3" /> {e.isFree ? 'Gratuito' : `S/ ${e.price ?? 0}`}
                </span>
              </div>
            </div>
            <button
              onClick={() => setFeatured((f) => ({ ...f, [e.id]: !isFeatured(e.id, e.isFeatured) }))}
              className={`self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                isFeatured(e.id, e.isFeatured)
                  ? 'bg-ayacucho-gold text-ayacucho-night'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {isFeatured(e.id, e.isFeatured) ? 'Destacado' : 'Destacar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsAdminPage;
