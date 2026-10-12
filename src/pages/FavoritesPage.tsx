import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  MapPin, 
  Clock, 
  Compass, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAttractions } from '../context/AttractionsContext';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../components/common/ToastContext';
import { useI18n } from '../i18n/i18nContext';
import { AttractionCard } from '../components/cards/AttractionCard';
import { StoredAttractionImage } from '../components/common/StoredAttractionImage';

export const FavoritesPage: React.FC = () => {
  const { language, t } = useI18n();
  const { favorites, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'favoritos' | 'itinerario'>('favoritos');
  const [itineraryIds, setItineraryIds] = useState<string[]>(() => storageService.getItinerary());

  const allAttractions = useAttractions().attractions;
  const favoriteAttractions = allAttractions.filter(a => favorites.includes(a.id));
  const itineraryAttractions = itineraryIds
    .map(id => allAttractions.find(a => a.id === id))
    .filter(Boolean) as typeof allAttractions;

  // Acciones en Itinerario
  const moveStop = (index: number, direction: 'up' | 'down') => {
    const newIds = [...itineraryIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;

    const temp = newIds[index];
    newIds[index] = newIds[targetIndex];
    newIds[targetIndex] = temp;

    setItineraryIds(newIds);
    storageService.saveItinerary(newIds);
    showToast('Orden del itinerario actualizado', 'info');
  };

  const removeItineraryStop = (id: string) => {
    storageService.removeFromItinerary(id);
    const updated = itineraryIds.filter(item => item !== id);
    setItineraryIds(updated);
    showToast('Lugar retirado del itinerario', 'info');
  };

  const addFavoriteToItinerary = (id: string) => {
    if (itineraryIds.includes(id)) {
      showToast('Este lugar ya se encuentra en tu itinerario.', 'info');
      return;
    }
    const updated = [...itineraryIds, id];
    setItineraryIds(updated);
    storageService.saveItinerary(updated);
    showToast('¡Agregado al itinerario diario!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 pb-24 space-y-5 animate-fade-in">
      {/* Cabecera y Selector de Pestañas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ayacucho-night font-cultural">
            Mis Guardados e Itinerario
          </h1>
          <p className="text-xs text-slate-500">
            Gestiona tus lugares preferidos y arma tu circuito del día
          </p>
        </div>

        {/* Pestañas: Favoritos vs Itinerario */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('favoritos')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'favoritos'
                ? 'bg-white text-ayacucho-night shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-ayacucho-alert" />
            <span>Favoritos ({favoriteAttractions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('itinerario')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'itinerario'
                ? 'bg-white text-ayacucho-night shadow-xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-ayacucho-gold" />
            <span>Itinerario ({itineraryAttractions.length})</span>
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: FAVORITOS */}
      {activeTab === 'favoritos' && (
        <div>
          {favoriteAttractions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto my-8 border border-slate-200/60 shadow-soft">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-ayacucho-alert mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-ayacucho-night font-cultural">
                Aún no tienes favoritos guardados
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Toca el icono del corazón en cualquier tarjeta turística para guardar atractivos y consultarlos aquí sin conexión.
              </p>
              <button
                onClick={() => navigate('/explorar')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-ayacucho-gold text-ayacucho-night font-bold text-xs hover:bg-ayacucho-lightgold transition"
              >
                Explorar Atractivos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {favoriteAttractions.map(attr => (
                  <div key={attr.id} className="relative group">
                    <AttractionCard attraction={attr} viewMode="grid" />
                    <button
                      onClick={() => addFavoriteToItinerary(attr.id)}
                      className="mt-1.5 w-full py-1 px-2 rounded-lg bg-ayacucho-warmwhite hover:bg-ayacucho-gold/20 text-ayacucho-deep text-[11px] font-bold border border-ayacucho-gold/30 flex items-center justify-center gap-1 transition"
                    >
                      <Plus className="w-3 h-3 text-ayacucho-gold" />
                      <span>Añadir a Itinerario</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: ITINERARIO PERSONAL */}
      {activeTab === 'itinerario' && (
        <div className="space-y-4">
          {/* Resumen del Día */}
          <div className="p-4 bg-gradient-to-r from-ayacucho-night to-ayacucho-deep rounded-3xl text-white shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ayacucho-lightgold">
                PLANIFICADOR PERSONAL
              </span>
              <h3 className="text-base font-bold font-cultural mt-0.5">
                Tu Circuito del Día en Huamanga
              </h3>
              <p className="text-xs text-slate-300">
                {itineraryAttractions.length} paradas planificadas · Tiempo estimado: ~{itineraryAttractions.length * 1.5} horas
              </p>
            </div>

            <button
              onClick={() => navigate('/mapa')}
              className="py-2 px-4 rounded-xl bg-ayacucho-gold text-ayacucho-night text-xs font-bold hover:bg-ayacucho-lightgold transition shrink-0"
            >
              Ver en Mapa
            </button>
          </div>

          {itineraryAttractions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto my-8 border border-slate-200/60 shadow-soft">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-ayacucho-night font-cultural">
                Tu itinerario está vacío
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Agrega lugares desde la pestaña de favoritos o el catálogo para armar tu recorrido personalizado.
              </p>
              <button
                onClick={() => setActiveTab('favoritos')}
                className="mt-4 px-5 py-2.5 rounded-xl bg-ayacucho-night text-ayacucho-lightgold font-bold text-xs hover:bg-ayacucho-deep transition"
              >
                Ver Favoritos
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {itineraryAttractions.map((attr, index) => (
                <div
                  key={attr.id}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-soft flex items-center gap-3"
                >
                  {/* Número de parada */}
                  <div className="w-8 h-8 rounded-xl bg-ayacucho-night text-ayacucho-lightgold font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>

                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <StoredAttractionImage
                      src={attr.images[0]}
                      alt={attr.name}
                      category={attr.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {attr.category}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-ayacucho-night truncate">
                      {language === 'en' ? attr.nameEn : attr.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {attr.district} · {attr.recommendedDuration}
                    </span>
                  </div>

                  {/* Controles de Reordenamiento */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveStop(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-20 transition"
                      title="Mover arriba"
                      aria-label="Mover arriba"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveStop(index, 'down')}
                      disabled={index === itineraryAttractions.length - 1}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-20 transition"
                      title="Mover abajo"
                      aria-label="Mover abajo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItineraryStop(attr.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition"
                      title="Quitar parada"
                      aria-label="Quitar parada"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
