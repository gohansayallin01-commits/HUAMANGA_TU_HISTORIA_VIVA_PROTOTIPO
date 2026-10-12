import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Phone, 
  Navigation, 
  Volume2, 
  Pause, 
  Play, 
  RotateCcw,
  Star, 
  MapPin, 
  Clock, 
  Ticket, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useAttractions } from '../context/AttractionsContext';
import { useFavorites } from '../hooks/useFavorites';
import { useSpeechAudio } from '../hooks/useSpeechAudio';
import { useToast } from '../components/common/ToastContext';
import { useI18n } from '../i18n/i18nContext';
import { shareContent, formatPrice } from '../utils/helpers';
import { StoredAttractionImage } from '../components/common/StoredAttractionImage';
import { BookingWizardModal } from '../components/booking/BookingWizardModal';
import { Modal } from '../components/common/Modal';

export const DetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const audioGuide = useSpeechAudio();

  const attractions = useAttractions().attractions;
  const attraction = attractions.find(a => a.slug === slug);

  // Estados locales
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState<'es' | 'en'>(language === 'en' ? 'en' : 'es');

  if (!attraction) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12">
        <h3 className="font-bold text-lg text-ayacucho-night">Atractivo no encontrado</h3>
        <p className="text-xs text-slate-500 mt-2">El lugar solicitado no existe en la base demostrativa.</p>
        <button
          onClick={() => navigate('/explorar')}
          className="mt-4 px-4 py-2 rounded-xl bg-ayacucho-night text-white text-xs font-bold"
        >
          Volver al Catálogo
        </button>
      </div>
    );
  }

  const isFav = isFavorite(attraction.id);
  const name = language === 'en' ? attraction.nameEn : attraction.name;
  const shortDesc = language === 'en' ? attraction.shortDescEn : attraction.shortDesc;
  const fullDesc = language === 'en' ? attraction.fullDescEn : attraction.fullDesc;
  const history = language === 'en' ? attraction.historyEn : attraction.history;

  // Lugares cercanos sugeridos
  const nearbyPlaces = attractions
    .filter(a => a.id !== attraction.id && a.district === attraction.district)
    .slice(0, 3);

  // Acciones de botones
  const handleToggleFav = () => {
    const added = toggleFavorite(attraction.id);
    showToast(
      added ? `${name} guardado en favoritos` : `${name} retirado de favoritos`,
      added ? 'success' : 'info'
    );
  };

  const handleShare = async () => {
    const success = await shareContent(
      `${name} | Huamanga: Tu Historia Viva`,
      shortDesc,
      window.location.href
    );
    if (success) {
      showToast(t('detail.linkCopied'), 'success');
    }
  };

  const handleCall = () => {
    showToast(`${t('detail.demoContactWarning')} Teléfono: ${attraction.phone}`, 'info');
  };

  const handlePlayAudio = () => {
    if (audioGuide.isPlaying && !audioGuide.isPaused) {
      audioGuide.pause();
    } else if (audioGuide.isPaused) {
      audioGuide.resume();
    } else {
      const speechText = audioLanguage === 'en'
        ? `${attraction.nameEn}. ${attraction.shortDescEn}. ${attraction.historyEn}`
        : `${attraction.name}. ${attraction.shortDesc}. ${attraction.history}`;
      audioGuide.play(speechText, audioLanguage);
      showToast('Reproduciendo audioguía interactiva...', 'info');
    }
  };

  return (
    <div className="pb-28 animate-fade-in bg-slate-50">
      {/* 1. Portada y Galería Deslizable */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full bg-slate-900 max-h-96">
        <StoredAttractionImage
          src={attraction.images[activeImageIndex] || attraction.images[0]}
          alt={name}
          category={attraction.category}
          className="w-full h-full object-cover"
        />

        {/* Gradiente superior e inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />

        {/* Aviso de imagen referencial */}
        {attraction.isReferentialImage && (
          <div className="absolute bottom-4 left-4 z-10 bg-black/55 backdrop-blur-sm text-ayacucho-lightgold text-[10px] font-semibold px-2 py-1 rounded-md border border-white/15">
            Imagen referencial para demostración
          </div>
        )}

        {/* Barra superior de acciones */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-sm transition"
              aria-label="Compartir atractivo"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleFav}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white shadow-md backdrop-blur-sm transition"
              aria-label={isFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFav ? 'fill-ayacucho-alert text-ayacucho-alert' : 'text-slate-800'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Miniaturas de la galería */}
        {attraction.images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 flex gap-1.5">
            {attraction.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition ${
                  activeImageIndex === idx
                    ? 'border-ayacucho-gold scale-105'
                    : 'border-white/60 opacity-70'
                }`}
              >
                <StoredAttractionImage src={img} alt="" category={attraction.category} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Información Principal */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-elevated border border-slate-100">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ayacucho-deep bg-ayacucho-gold/15 px-2.5 py-0.5 rounded-md border border-ayacucho-gold/30">
              {attraction.category}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
              Abierto · Horario referencial
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-ayacucho-night font-cultural mt-2">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{attraction.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({attraction.reviewsCount} reseñas)</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{attraction.district}</span>
            </div>
            <span>•</span>
            <div className="font-bold text-ayacucho-deep">
              {formatPrice(attraction.price)}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 italic flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{attraction.address}</span>
          </p>

          {/* Botones de Acción Inmediata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            <button
              onClick={() => navigate(`/mapa?ruta=${attraction.slug}`)}
              className="py-2.5 px-3 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-ayacucho-lightgold text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <Navigation className="w-4 h-4 text-ayacucho-gold" />
              <span>{t('detail.howToGet')}</span>
            </button>

            <button
              onClick={handleCall}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{t('detail.call')}</span>
            </button>

            <button
              onClick={handleToggleFav}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-ayacucho-alert text-ayacucho-alert' : ''}`} />
              <span>{isFav ? t('detail.saved') : t('detail.save')}</span>
            </button>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-ayacucho-gold hover:bg-ayacucho-lightgold text-ayacucho-night text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs col-span-2 sm:col-span-1"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar</span>
            </button>
          </div>
        </div>

        {/* 3. Módulo de Audioguía Interactiva */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-ayacucho-gold" />
              <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
                {t('audio.title')}
              </h3>
            </div>

            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setAudioLanguage('es')}
                className={`px-2 py-0.5 rounded-md transition ${
                  audioLanguage === 'es' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-500'
                }`}
              >
                ES
              </button>
              <button
                onClick={() => setAudioLanguage('en')}
                className={`px-2 py-0.5 rounded-md transition ${
                  audioLanguage === 'en' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-500'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-ayacucho-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${audioGuide.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>{audioGuide.isPlaying ? 'Reproduciendo voz oficial' : 'Listo para escuchar'}</span>
              <span>{audioGuide.progress}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handlePlayAudio}
              className="flex-1 py-2 rounded-xl bg-ayacucho-night text-ayacucho-lightgold text-xs font-bold flex items-center justify-center gap-2 hover:bg-ayacucho-deep transition"
            >
              {audioGuide.isPlaying && !audioGuide.isPaused ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{t('audio.pause')}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t('audio.play')}</span>
                </>
              )}
            </button>

            <button
              onClick={audioGuide.stop}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Detener audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Transcripción del audio */}
          <div className="p-3 bg-ayacucho-warmwhite rounded-xl border border-ayacucho-gold/20 text-xs text-slate-600 leading-relaxed">
            <span className="font-bold text-[11px] text-ayacucho-deep uppercase block mb-1">
              Transcripción:
            </span>
            {audioLanguage === 'en' ? (
              <p>{attraction.nameEn}. {attraction.shortDescEn} {attraction.historyEn}</p>
            ) : (
              <p>{attraction.name}. {attraction.shortDesc} {attraction.history}</p>
            )}
          </div>
        </div>

        {/* 4. Descripción Completa e Historia */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-ayacucho-night font-cultural mb-1.5">
              {t('detail.about')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {fullDesc}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h3 className="font-bold text-sm text-ayacucho-night font-cultural mb-1.5">
              {t('detail.history')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {history}
            </p>
          </div>

          {/* Horario y Tarifas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-ayacucho-gold shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-700 block">{t('detail.schedule')}</span>
                <span className="text-xs text-slate-600">{attraction.hours}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-2.5">
              <Ticket className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-slate-700 block">{t('detail.pricing')}</span>
                <span className="text-xs text-slate-600 font-semibold">
                  {formatPrice(attraction.price)} (Referencial)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Servicios y Accesibilidad */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3">
          <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
            {t('detail.services')} & {t('detail.accessibility')}
          </h3>

          <div className="flex flex-wrap gap-2">
            {attraction.services.map((srv, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {srv}
              </span>
            ))}
          </div>

          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200/60 text-xs text-blue-900 mt-2">
            <strong className="block font-bold mb-0.5">Condiciones de Accesibilidad:</strong>
            <p>{attraction.accessibility}</p>
          </div>
        </div>

        {/* 6. Recomendaciones y Seguridad */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 space-y-3">
          <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
            {t('detail.recommendations')}
          </h3>

          <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
            {attraction.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Consejo de Seguridad:</strong>
              <p>{attraction.safetyTips}</p>
            </div>
          </div>
        </div>

        {/* 7. Atractivos Cercanos Sugeridos */}
        {nearbyPlaces.length > 0 && (
          <div className="pt-2">
            <h3 className="font-bold text-sm text-ayacucho-night font-cultural mb-3">
              {t('detail.nearbyPlaces')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {nearbyPlaces.map((near) => (
                <Link
                  key={near.id}
                  to={`/atractivo/${near.slug}`}
                  className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-soft hover:shadow-elevated transition flex items-center gap-3 group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                    <StoredAttractionImage
                      src={near.images[0]}
                      alt={near.name}
                      category={near.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-xs text-ayacucho-night truncate group-hover:text-ayacucho-deep">
                      {language === 'en' ? near.nameEn : near.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {near.category}
                    </span>
                    <span className="text-[11px] font-bold text-amber-500 flex items-center gap-0.5 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {near.rating.toFixed(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Reserva en 7 Pasos */}
      <BookingWizardModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedAttraction={attraction}
      />
    </div>
  );
};
