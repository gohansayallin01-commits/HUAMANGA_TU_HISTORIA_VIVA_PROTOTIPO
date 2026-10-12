import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Grid2X2, 
  List, 
  Map as MapIcon, 
  SlidersHorizontal, 
  RotateCcw,
  Star,
  MapPin,
  Check
} from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';
import { storageService } from '../services/storageService';
import { useAttractions } from '../context/AttractionsContext';
import { AttractionCard } from '../components/cards/AttractionCard';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { calculateDistanceKm } from '../utils/helpers';
import { Attraction } from '../types';

export const ExplorePage: React.FC = () => {
  const { language, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { location } = useGeolocation();

  const { publishedAttractions: attractions } = useAttractions();

  // Estados de búsqueda, filtros y vista
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState<string>(searchParams.get('cat') || 'todos');
  const [sortBy, setSortBy] = useState<string>('recomendados');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    if (q) setQuery(q);
    if (cat) setActiveFilter(cat);
  }, [searchParams]);

  // Filtros aplicables
  const filterOptions = [
    { id: 'todos', label: t('explore.filterAll') },
    { id: 'gratis', label: t('explore.filterFree') },
    { id: 'pago', label: t('explore.filterPaid') },
    { id: 'cerca', label: t('explore.filterNearMe') },
    { id: 'valorados', label: t('explore.filterTopRated') },
    { id: 'accesible', label: t('explore.filterAccessible') },
    { id: 'familiar', label: t('explore.filterFamily') },
    { id: 'naturaleza', label: t('explore.filterNature') },
    { id: 'cultura', label: t('explore.filterCulture') },
    { id: 'gastronomia', label: t('explore.filterGastronomy') },
  ];

  // Lógica de filtrado y ordenamiento reactivo
  const filteredAttractions = useMemo(() => {
    let result = [...attractions];

    // 1. Filtro por texto de búsqueda
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(a => 
        a.name.toLowerCase().includes(q) ||
        a.nameEn.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // 2. Filtro por chips
    if (activeFilter === 'gratis') {
      result = result.filter(a => a.price === 0);
    } else if (activeFilter === 'pago') {
      result = result.filter(a => a.price > 0);
    } else if (activeFilter === 'valorados') {
      result = result.filter(a => a.rating >= 4.8);
    } else if (activeFilter === 'accesible') {
      result = result.filter(a => a.accessibilityBadges.length > 0);
    } else if (activeFilter === 'familiar') {
      result = result.filter(a => !a.isNearHuamanga || a.category === 'historico' || a.category === 'gastronomia');
    } else if (activeFilter === 'naturaleza') {
      result = result.filter(a => a.category === 'naturaleza');
    } else if (activeFilter === 'cultura') {
      result = result.filter(a => a.category === 'historico' || a.category === 'iglesia' || a.category === 'museo');
    } else if (activeFilter === 'gastronomia') {
      result = result.filter(a => a.category === 'gastronomia');
    } else if (activeFilter !== 'todos') {
      result = result.filter(a => a.category === activeFilter);
    }

    // 3. Ordenamiento
    if (sortBy === 'cercanos') {
      result.sort((a, b) => {
        const distA = calculateDistanceKm(location.lat, location.lng, a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistanceKm(location.lat, location.lng, b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      });
    } else if (sortBy === 'valorados') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'precio_menor') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'visitados') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else {
      // Recomendados por defecto (destacados primero)
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [attractions, query, activeFilter, sortBy, location]);

  const handleResetFilters = () => {
    setQuery('');
    setActiveFilter('todos');
    setSortBy('recomendados');
    setSearchParams({});
  };

  return (
    <div className="pb-24 animate-fade-in">
      {/* Cabecera y Buscador */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('explore.subtitle')}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none transition"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ×
                </button>
              )}
            </div>

            {/* Alternador de Vistas: 2 columnas, Lista o Mapa */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-500'
                }`}
                title="Vista Cuadrícula (2 columnas)"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'list' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-500'
                }`}
                title="Vista Lista"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'map' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-500'
                }`}
                title="Vista Mapa"
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filtros horizontales desplazables */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === opt.id
                    ? 'bg-ayacucho-night text-ayacucho-lightgold shadow-sm scale-102'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Barra de Ordenamiento y Contador de Resultados */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="font-medium">
              <strong className="text-ayacucho-night">{filteredAttractions.length}</strong> {t('explore.resultsFound')}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 text-xs focus:outline-none cursor-pointer"
              >
                <option value="recomendados">{t('explore.sortRecommended')}</option>
                <option value="cercanos">{t('explore.sortDistance')}</option>
                <option value="valorados">{t('explore.sortRating')}</option>
                <option value="precio_menor">{t('explore.sortPriceLow')}</option>
                <option value="visitados">{t('explore.sortVisited')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido según vista */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        {viewMode === 'map' ? (
          <div className="rounded-3xl overflow-hidden shadow-elevated border border-slate-200">
            <InteractiveMap attractions={filteredAttractions} />
          </div>
        ) : filteredAttractions.length === 0 ? (
          /* Estado Vacío / Sin Resultados */
          <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-auto my-8 border border-slate-200/60 shadow-soft">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-base text-ayacucho-night font-cultural">
              {t('explore.noResults')}
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Prueba cambiando el término de búsqueda o seleccionando otro filtro de categoría.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-ayacucho-gold text-ayacucho-night font-bold text-xs hover:bg-ayacucho-lightgold transition flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('explore.resetFilters')}</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Vista Cuadrícula (2 Columnas en móvil, 4 en desktop) */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredAttractions.map((attr) => (
              <AttractionCard key={attr.id} attraction={attr} viewMode="grid" />
            ))}
          </div>
        ) : (
          /* Vista Lista (1 Columna en móvil, 2 en desktop) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAttractions.map((attr) => (
              <AttractionCard key={attr.id} attraction={attr} viewMode="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
