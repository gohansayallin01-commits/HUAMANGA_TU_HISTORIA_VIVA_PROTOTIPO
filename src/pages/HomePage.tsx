import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Compass, 
  Star, 
  Percent, 
  ChevronRight,
  Landmark,
  Church,
  Building2,
  Mountain,
  UtensilsCrossed,
  Hotel,
  Bus,
  Tag
} from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';
import { storageService } from '../services/storageService';
import { useAttractions } from '../context/AttractionsContext';
import { CATEGORIES } from '../data/categories';
import { INITIAL_ROUTES } from '../data/routes';
import { INITIAL_EVENTS } from '../data/events';
import { AttractionCard } from '../components/cards/AttractionCard';
import { ImageFallback } from '../components/common/ImageFallback';
import { formatPrice } from '../utils/helpers';

// Mapeo dinámico de iconos de categoría
const categoryIconMap: Record<string, any> = {
  Landmark,
  Church,
  Building2,
  Mountain,
  UtensilsCrossed,
  Hotel,
  Sparkles,
  Bus,
  Calendar,
  Compass
};

export const HomePage: React.FC = () => {
  const { language, t } = useI18n();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const { publishedAttractions: attractions } = useAttractions();
  const business = storageService.getBusinessProfile();

  const recommendedPlaces = attractions.filter(a => a.isFeatured).slice(0, 4);
  const nearPlaces = attractions.filter(a => a.isNearHuamanga).slice(0, 4);
  const suggestedRoutes = INITIAL_ROUTES.slice(0, 3);
  const featuredEvents = INITIAL_EVENTS.slice(0, 2);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explorar?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explorar');
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* 1. Barra de Búsqueda Inteligente */}
      <div className="px-4 pt-3">
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto flex items-center"
        >
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="w-full pl-10 pr-24 py-3 bg-white rounded-2xl border border-slate-200/80 shadow-soft text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ayacucho-gold/50 focus:border-ayacucho-gold transition"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-ayacucho-lightgold text-xs font-semibold shadow-xs transition"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* 2. Banner Turístico Principal */}
      <div className="px-4">
        <div className="relative rounded-3xl overflow-hidden bg-ayacucho-night text-white shadow-elevated max-w-4xl mx-auto">
          <div className="absolute inset-0 z-0">
            <ImageFallback
              src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80"
              alt="Plaza Mayor de Ayacucho y Huamanga"
              className="w-full h-full object-cover opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ayacucho-night via-ayacucho-night/80 to-transparent" />
          </div>

          <div className="relative z-10 p-5 sm:p-7 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ayacucho-gold/20 text-ayacucho-lightgold border border-ayacucho-gold/30 text-[10px] font-extrabold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3 h-3 text-ayacucho-gold" />
              DESTINO PATRIMONIAL
            </span>

            <h2 className="text-xl sm:text-2xl font-bold font-cultural leading-snug mb-2 text-white">
              Descubre Huamanga: Arte, Iglesias y Libertad
            </h2>

            <p className="text-xs text-slate-200 leading-relaxed mb-4 line-clamp-2">
              Explora templos barrocos, alfarería en Quinua, ruinas Wari milenarias y la gastronomía viva de Ayacucho.
            </p>

            <div className="flex items-center gap-2.5">
              <Link
                to="/explorar"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-ayacucho-gold to-ayacucho-lightgold text-ayacucho-night text-xs font-bold hover:brightness-105 shadow-md flex items-center gap-1.5 transition"
              >
                <span>Explorar Atractivos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/mapa"
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition"
              >
                Ver en Mapa
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 10 Categorías Obligatorias */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 max-w-5xl mx-auto">
          <h3 className="font-bold text-sm sm:text-base text-ayacucho-night font-cultural">
            {t('home.categories')}
          </h3>
          <Link
            to="/explorar"
            className="text-xs text-ayacucho-gold hover:text-ayacucho-deep font-semibold flex items-center gap-0.5"
          >
            <span>{t('home.viewAll')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Carrusel / Grilla deslizable de categorías */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar max-w-5xl mx-auto">
          {CATEGORIES.map((cat) => {
            const IconComponent = categoryIconMap[cat.iconName] || Compass;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/explorar?cat=${cat.id}`)}
                className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-100 shadow-soft hover:shadow-elevated hover:border-ayacucho-gold/50 min-w-20 sm:min-w-24 shrink-0 transition-all group"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110 shadow-xs"
                  style={{ backgroundColor: cat.bgLight, color: cat.color }}
                >
                  <IconComponent className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight line-clamp-1 group-hover:text-ayacucho-night">
                  {language === 'en' ? cat.nameEn : cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Lugares Recomendados (Top Atractivos) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-ayacucho-gold" />
            <h3 className="font-bold text-sm sm:text-base text-ayacucho-night font-cultural">
              {t('home.recommended')}
            </h3>
          </div>
          <Link
            to="/explorar"
            className="text-xs text-ayacucho-gold hover:text-ayacucho-deep font-semibold flex items-center gap-0.5"
          >
            <span>Ver más</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {recommendedPlaces.map((attr) => (
            <AttractionCard key={attr.id} attraction={attr} viewMode="grid" />
          ))}
        </div>
      </div>

      {/* 5. Cerca de Huamanga (Destinos complementarios: Wari, Quinua, Millpu) */}
      <div className="px-4 bg-slate-100/70 py-6 border-y border-slate-200/60">
        <div className="flex items-center justify-between mb-3 max-w-5xl mx-auto">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-ayacucho-night font-cultural">
              {t('home.nearby')}
            </h3>
            <p className="text-[11px] text-slate-500">
              Atractivos complementarios y valles cercanos a Huamanga
            </p>
          </div>
          <Link
            to="/explorar?cat=historico"
            className="text-xs text-ayacucho-gold hover:text-ayacucho-deep font-semibold flex items-center gap-0.5"
          >
            <span>Ver todo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {nearPlaces.map((attr) => (
            <AttractionCard key={attr.id} attraction={attr} viewMode="grid" />
          ))}
        </div>
      </div>

      {/* 6. Rutas Sugeridas */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-ayacucho-gold" />
            <h3 className="font-bold text-sm sm:text-base text-ayacucho-night font-cultural">
              {t('home.suggestedRoutes')}
            </h3>
          </div>
          <Link
            to="/rutas"
            className="text-xs text-ayacucho-gold hover:text-ayacucho-deep font-semibold flex items-center gap-0.5"
          >
            <span>Ver rutas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-5xl mx-auto">
          {suggestedRoutes.map((route) => (
            <Link
              key={route.id}
              to="/rutas"
              className="group bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-elevated transition overflow-hidden flex flex-col"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <ImageFallback
                  src={route.image}
                  alt={route.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-ayacucho-night/90 text-ayacucho-lightgold text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {language === 'en' ? route.durationLabelEn : route.durationLabel}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                  {route.stopsCount} paradas
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-ayacucho-night group-hover:text-ayacucho-deep line-clamp-1">
                    {language === 'en' ? route.titleEn : route.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {language === 'en' ? route.descriptionEn : route.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-50 mt-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Dificultad: <strong className="text-ayacucho-deep">{route.difficulty}</strong>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    Ref: S/ {route.refPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 7. Eventos Destacados */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-ayacucho-gold" />
            <h3 className="font-bold text-sm sm:text-base text-ayacucho-night font-cultural">
              {t('home.featuredEvents')}
            </h3>
          </div>
          <Link
            to="/eventos"
            className="text-xs text-ayacucho-gold hover:text-ayacucho-deep font-semibold flex items-center gap-0.5"
          >
            <span>Ver calendario</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-5xl mx-auto">
          {featuredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-soft flex gap-3 items-center"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <ImageFallback
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-ayacucho-gold uppercase tracking-wider block">
                  {evt.date}
                </span>
                <h4 className="font-bold text-xs text-ayacucho-night truncate">
                  {language === 'en' ? evt.titleEn : evt.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {evt.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Promociones de Negocios Locales */}
      <div className="px-4 max-w-5xl mx-auto">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-ayacucho-gold text-ayacucho-night flex items-center justify-center font-black shadow-sm shrink-0">
              <Percent className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                CUPÓN LOCAL
              </span>
              <h4 className="font-bold text-sm text-slate-800 mt-1">
                {business.activePromotion.title} · {business.name}
              </h4>
              <p className="text-xs text-slate-600">
                Usa el código <strong className="text-ayacucho-deep bg-white px-1.5 py-0.5 rounded border border-amber-300">{business.activePromotion.code}</strong> para {business.activePromotion.discount}.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/negocios')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-white text-xs font-bold transition shrink-0"
          >
            Ver Detalle Negocio
          </button>
        </div>
      </div>
    </div>
  );
};
