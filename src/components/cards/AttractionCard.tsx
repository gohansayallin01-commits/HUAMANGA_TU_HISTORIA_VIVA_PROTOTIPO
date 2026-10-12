import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, MapPin } from 'lucide-react';
import { Attraction } from '../../types';
import { StoredAttractionImage } from '../common/StoredAttractionImage';
import { useFavorites } from '../../hooks/useFavorites';
import { useToast } from '../common/ToastContext';
import { useI18n } from '../../i18n/i18nContext';
import { formatPrice } from '../../utils/helpers';

interface AttractionCardProps {
  attraction: Attraction;
  viewMode?: 'grid' | 'list';
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  viewMode = 'grid'
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const { language, t } = useI18n();

  const isFav = isFavorite(attraction.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite(attraction.id);
    showToast(
      added ? `${attraction.name} guardado en favoritos` : `${attraction.name} retirado de favoritos`,
      added ? 'success' : 'info'
    );
  };

  const name = language === 'en' ? attraction.nameEn : attraction.name;
  const desc = language === 'en' ? attraction.shortDescEn : attraction.shortDesc;

  if (viewMode === 'list') {
    return (
      <Link
        to={`/atractivo/${attraction.slug}`}
        className="group flex gap-3.5 p-3 bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-elevated transition-all duration-200"
      >
        <div className="relative w-28 sm:w-36 h-28 shrink-0 rounded-xl overflow-hidden">
          <StoredAttractionImage
            src={attraction.images[0]}
            alt={name}
            category={attraction.category}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {attraction.isFeatured && (
            <span className="absolute top-2 left-2 bg-ayacucho-gold text-ayacucho-night text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
              ★ TOP
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ayacucho-deep/70">
                {attraction.category}
              </span>
              <button
                onClick={handleFavoriteClick}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition"
                aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFav ? 'fill-ayacucho-alert text-ayacucho-alert' : 'hover:text-ayacucho-alert'
                  }`}
                />
              </button>
            </div>

            <h3 className="font-bold text-sm text-ayacucho-night group-hover:text-ayacucho-deep line-clamp-1 mt-0.5">
              {name}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
              {desc}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-50 mt-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{attraction.rating.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px] font-normal">({attraction.reviewsCount})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px] flex items-center gap-0.5">
                <MapPin className="w-3 h-3" />
                {attraction.district}
              </span>
              <span className="font-bold text-ayacucho-deep text-xs px-2 py-0.5 bg-slate-100 rounded-md">
                {formatPrice(attraction.price)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Vista Grid (Cuadrícula móvil 2 columnas)
  return (
    <Link
      to={`/atractivo/${attraction.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-soft hover:shadow-elevated transition-all duration-200 overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <StoredAttractionImage
          src={attraction.images[0]}
          alt={name}
          category={attraction.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Badges superiores */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {attraction.isFeatured ? (
            <span className="bg-ayacucho-gold text-ayacucho-night text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
              ★ RECOMENDADO
            </span>
          ) : <span />}

          <button
            onClick={handleFavoriteClick}
            className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm pointer-events-auto hover:bg-white text-slate-700 transition"
            aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav ? 'fill-ayacucho-alert text-ayacucho-alert' : 'hover:text-ayacucho-alert'
              }`}
            />
          </button>
        </div>

        {/* Precio en imagen */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs font-semibold">
          <span className="px-2 py-0.5 rounded-md bg-ayacucho-night/80 backdrop-blur-sm text-[11px] font-bold text-ayacucho-lightgold">
            {formatPrice(attraction.price)}
          </span>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[11px]">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>{attraction.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ayacucho-deep/70">
            {attraction.category}
          </span>
          <h3 className="font-bold text-xs sm:text-sm text-ayacucho-night group-hover:text-ayacucho-deep line-clamp-1 mt-0.5">
            {name}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
            {desc}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-50 mt-2">
          <span className="truncate flex items-center gap-0.5">
            <MapPin className="w-3 h-3 shrink-0" />
            {attraction.district}
          </span>
          <span className="text-emerald-700 font-medium shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
            Abierto
          </span>
        </div>
      </div>
    </Link>
  );
};
