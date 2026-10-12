import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Share2, 
  Bookmark, 
  Plus, 
  Sparkles,
  Ticket
} from 'lucide-react';
import { INITIAL_EVENTS } from '../data/events';
import { useI18n } from '../i18n/i18nContext';
import { useToast } from '../components/common/ToastContext';
import { shareContent } from '../utils/helpers';
import { ImageFallback } from '../components/common/ImageFallback';
import { EventItem } from '../types';

export const EventsPage: React.FC = () => {
  const { language, t } = useI18n();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [savedEvents, setSavedEvents] = useState<string[]>(['evt-1']);

  const categories = ['todos', 'Religioso / Cultural', 'Cívico / Festivo', 'Artesanía / Expo', 'Música / Cultura'];

  const filteredEvents = selectedCategory === 'todos'
    ? INITIAL_EVENTS
    : INITIAL_EVENTS.filter(e => e.category === selectedCategory);

  const featuredEvent = INITIAL_EVENTS.find(e => e.isFeatured) || INITIAL_EVENTS[0];

  const handleToggleSave = (id: string) => {
    let updated = [...savedEvents];
    if (updated.includes(id)) {
      updated = updated.filter(item => item !== id);
      showToast('Evento retirado de recordatorios', 'info');
    } else {
      updated.push(id);
      showToast('¡Evento guardado en tus recordatorios!', 'success');
    }
    setSavedEvents(updated);
  };

  const handleShare = async (evt: EventItem) => {
    const success = await shareContent(
      `${evt.title} | Eventos de Ayacucho`,
      evt.description,
      window.location.href
    );
    if (success) {
      showToast('Enlace del evento copiado al portapapeles', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 space-y-6 animate-fade-in text-slate-800">
      {/* Cabecera */}
      <div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ayacucho-gold" />
          <h1 className="text-xl sm:text-2xl font-bold text-ayacucho-night font-cultural">
            Calendario de Eventos y Festividades
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Fechas religiosas, carnavales y encuentros culturales en Huamanga
        </p>
      </div>

      {/* Evento Destacado Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-ayacucho-night text-white shadow-elevated">
        <div className="h-48 sm:h-64 w-full relative">
          <ImageFallback
            src={featuredEvent.image}
            alt={featuredEvent.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ayacucho-night via-ayacucho-night/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          <span className="bg-ayacucho-gold text-ayacucho-night text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow inline-block mb-1.5 uppercase tracking-wider">
            ★ EVENTO PRINCIPAL DEL AÑO
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-cultural text-white">
            {language === 'en' ? featuredEvent.titleEn : featuredEvent.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-ayacucho-lightgold mt-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {featuredEvent.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {featuredEvent.location}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros de Categoría */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-ayacucho-night text-ayacucho-lightgold shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat === 'todos' ? 'Todos los eventos' : cat}
          </button>
        ))}
      </div>

      {/* Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredEvents.map(evt => {
          const isSaved = savedEvents.includes(evt.id);
          return (
            <div
              key={evt.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ayacucho-deep bg-ayacucho-gold/15 px-2 py-0.5 rounded">
                    {evt.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    evt.isFree ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {evt.isFree ? 'Ingreso Libre' : `S/ ${evt.price}.00`}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-ayacucho-night font-cultural">
                  {language === 'en' ? evt.titleEn : evt.title}
                </h3>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-ayacucho-gold" />
                    <span>{evt.date} · {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed pt-1">
                  {language === 'en' ? evt.descriptionEn : evt.description}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleSave(evt.id)}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isSaved
                      ? 'bg-ayacucho-night text-ayacucho-lightgold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                </button>

                <button
                  onClick={() => handleShare(evt)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                  title="Compartir evento"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
