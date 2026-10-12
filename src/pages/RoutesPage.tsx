import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  Share2, 
  Bookmark, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { INITIAL_ROUTES } from '../data/routes';
import { storageService } from '../services/storageService';
import { useI18n } from '../i18n/i18nContext';
import { useToast } from '../components/common/ToastContext';
import { shareContent, formatPrice } from '../utils/helpers';
import { ImageFallback } from '../components/common/ImageFallback';
import { RouteItem } from '../types';

export const RoutesPage: React.FC = () => {
  const { language, t } = useI18n();
  const { showToast } = useToast();

  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<RouteItem>(INITIAL_ROUTES[0]);
  const [visitedStops, setVisitedStops] = useState<Record<string, boolean>>(() =>
    storageService.getRouteProgress()
  );

  // Filtrado por duración
  const filteredRoutes = durationFilter === 'all'
    ? INITIAL_ROUTES
    : INITIAL_ROUTES.filter(r => r.duration === durationFilter);

  // Manejo de parada visitada
  const handleToggleStop = (stopId: string) => {
    const isVisited = storageService.toggleStopVisited(stopId);
    setVisitedStops(storageService.getRouteProgress());
    showToast(
      isVisited ? '¡Parada marcada como visitada!' : 'Parada desmarcada',
      isVisited ? 'success' : 'info'
    );
  };

  // Cálculo de progreso porcentual de la ruta seleccionada
  const completedCount = selectedRoute.stops.filter(s => visitedStops[s.id]).length;
  const progressPercent = Math.round((completedCount / selectedRoute.stops.length) * 100);

  const handleShareRoute = async () => {
    const success = await shareContent(
      `${selectedRoute.title} | Rutas de Huamanga`,
      selectedRoute.description,
      window.location.href
    );
    if (success) {
      showToast('Enlace de la ruta copiado al portapapeles', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 space-y-6 animate-fade-in">
      {/* Cabecera */}
      <div>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-ayacucho-gold" />
          <h1 className="text-xl sm:text-2xl font-bold text-ayacucho-night font-cultural">
            {t('routes.title')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {t('routes.subtitle')}
        </p>
      </div>

      {/* Filtros de Duración */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: t('routes.filterAll') },
          { id: 'half_day', label: t('routes.halfDay') },
          { id: 'one_day', label: t('routes.oneDay') },
          { id: 'two_days', label: t('routes.twoDays') },
          { id: 'three_days', label: t('routes.threeDays') },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setDurationFilter(filter.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              durationFilter === filter.id
                ? 'bg-ayacucho-night text-ayacucho-lightgold shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Selector de Rutas (Pestañas visuales) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {filteredRoutes.map((route) => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedRoute.id === route.id
                ? 'bg-ayacucho-night text-white border-ayacucho-gold shadow-md'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className={`text-[10px] font-bold block ${
              selectedRoute.id === route.id ? 'text-ayacucho-lightgold' : 'text-slate-400'
            }`}>
              {route.durationLabel}
            </span>
            <h4 className="font-bold text-xs line-clamp-1 mt-0.5">
              {language === 'en' ? route.titleEn : route.title}
            </h4>
            <span className="text-[11px] block mt-1 opacity-80">
              {route.stopsCount} paradas · {route.distanceKm} km
            </span>
          </button>
        ))}
      </div>

      {/* Detalle de la Ruta Seleccionada */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="relative h-44 sm:h-56 w-full">
          <ImageFallback
            src={selectedRoute.image}
            alt={selectedRoute.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="bg-ayacucho-gold text-ayacucho-night text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
              {selectedRoute.durationLabel}
            </span>
            <h2 className="text-lg sm:text-xl font-bold font-cultural mt-1">
              {language === 'en' ? selectedRoute.titleEn : selectedRoute.title}
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Métricas de la ruta */}
          <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Paradas</span>
              <span className="font-extrabold text-ayacucho-night text-sm">{selectedRoute.stopsCount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Recorrido</span>
              <span className="font-extrabold text-ayacucho-night text-sm">{selectedRoute.distanceKm} km</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Precio Ref.</span>
              <span className="font-extrabold text-emerald-700 text-sm">{formatPrice(selectedRoute.refPrice)}</span>
            </div>
          </div>

          {/* Barra de progreso de la ruta */}
          <div className="p-3.5 bg-ayacucho-warmwhite rounded-2xl border border-ayacucho-gold/30">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-bold text-ayacucho-night flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-ayacucho-gold" />
                Progreso del recorrido
              </span>
              <span className="font-extrabold text-ayacucho-deep">
                {progressPercent}% ({completedCount}/{selectedRoute.stops.length})
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-ayacucho-gold to-emerald-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'en' ? selectedRoute.descriptionEn : selectedRoute.description}
          </p>

          {/* Paradas ordenadas e interactivas */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
              Paradas ordenadas del circuito:
            </h3>

            <div className="space-y-2.5">
              {selectedRoute.stops.map((stop, index) => {
                const isVisited = !!visitedStops[stop.id];
                return (
                  <div
                    key={stop.id}
                    onClick={() => handleToggleStop(stop.id)}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                      isVisited
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      className="mt-0.5 text-slate-400"
                      aria-label={isVisited ? 'Marcar no visitado' : 'Marcar visitado'}
                    >
                      {isVisited ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs sm:text-sm text-ayacucho-night">
                          {index + 1}. {stop.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium shrink-0">
                          {stop.estimatedTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {stop.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cronograma Sugerido */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
              {t('routes.schedule')}:
            </h3>
            <div className="space-y-2">
              {selectedRoute.schedule.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <span className="font-bold text-ayacucho-deep w-20 shrink-0">{item.time}</span>
                  <span className="text-slate-600">{item.activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones de la Ruta */}
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <button
              onClick={() => showToast('¡Ruta iniciada! Los puntos están listos en tu mapa.', 'success')}
              className="flex-1 py-2.5 rounded-xl bg-ayacucho-night text-ayacucho-lightgold text-xs font-bold hover:bg-ayacucho-deep transition shadow-xs text-center"
            >
              {t('routes.startRoute')}
            </button>

            <button
              onClick={handleShareRoute}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Compartir ruta"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
