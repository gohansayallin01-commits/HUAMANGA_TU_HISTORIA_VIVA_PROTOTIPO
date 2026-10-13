import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowRight, Store, ShieldCheck, MapPin, Landmark, Calendar, Sparkles, Check } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';
import { useToast } from '../components/common/ToastContext';

const HERO_IMAGE = `${import.meta.env.BASE_URL}images/hero/huamanga-hero.jpg`;
const FLAGS_PATH = `${import.meta.env.BASE_URL}images/flags/`;

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: `${FLAGS_PATH}spain.svg` },
  { code: 'en', label: 'English', flag: `${FLAGS_PATH}united-kingdom.svg` },
  { code: 'fr', label: 'Français', flag: `${FLAGS_PATH}france.svg` },
  { code: 'pt', label: 'Português', flag: `${FLAGS_PATH}brazil.svg` }
] as const;

const HIGHLIGHTS = [
  { key: 'atractivos', label: 'Atractivos turísticos', icon: Landmark },
  { key: 'rutas', label: 'Rutas patrimoniales', icon: MapPin },
  { key: 'eventos', label: 'Eventos y cultura', icon: Calendar }
] as const;

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const { showToast } = useToast();

  const handleLanguageChange = (lang: 'es' | 'en' | 'fr' | 'pt') => {
    if (lang === 'fr') {
      showToast('Français estará disponible próximamente', 'info');
      return;
    }
    if (lang === 'pt') {
      showToast('Português estará disponible próximamente', 'info');
      return;
    }
    setLanguage(lang);
    showToast(lang === 'es' ? 'Idioma: Español' : 'Language: English', 'success');
  };

  const handleStart = () => {
    localStorage.setItem('huamanga_welcome_seen', 'true');
    navigate('/');
  };

  const handleBusinessDemo = () => {
    localStorage.setItem('huamanga_welcome_seen', 'true');
    navigate('/negocios');
  };

  const handleAdminAccess = () => {
    localStorage.setItem('huamanga_welcome_seen', 'true');
    navigate('/acceso-administrativo');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-ayacucho-night text-white">
      {/* Fotografía hero premium como fondo visual (sin elementos dibujados) */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center"
      />

      {/* Capas de contraste: móvil (vertical) y escritorio (horizontal institucional) */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/85 lg:bg-gradient-to-r lg:from-black/88 lg:via-black/55 lg:to-black/25" />

      {/* Contenido real en React sobre la fotografía */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Encabezado: marca + selector de idioma visible */}
        <header className="w-full shrink-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:px-10 lg:py-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-ayacucho-gold to-ayacucho-lightgold shadow-elevated lg:h-11 lg:w-11">
                <Compass className="h-5 w-5 text-ayacucho-night stroke-[2.2] lg:h-6 lg:w-6" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-cultural text-sm font-bold tracking-wide text-white lg:text-base">HUAMANGA</span>
                  <span className="rounded border border-ayacucho-gold/40 bg-ayacucho-gold/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-ayacucho-lightgold">
                    Prototipo
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ayacucho-lightgold/90">
                  Ayacucho · Perú
                </span>
              </div>
            </div>

            {/* Selector premium de idiomas: banderas circulares + nombre completo */}
            <div
              role="group"
              aria-label="Seleccionar idioma"
              className="flex items-center gap-1.5 self-center rounded-3xl border border-white/15 bg-white/10 p-2 shadow-soft backdrop-blur-xl lg:gap-2 lg:self-auto lg:p-2.5"
            >
              {LANGUAGES.map((l) => {
                const isActive = language === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleLanguageChange(l.code)}
                    title={l.label}
                    aria-label={l.label}
                    aria-pressed={isActive}
                    className={`group flex min-w-[54px] flex-col items-center gap-1.5 rounded-2xl px-1 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ayacucho-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ayacucho-night lg:min-w-[68px] lg:px-2 lg:py-2 ${
                      isActive ? 'bg-ayacucho-gold/20' : 'hover:bg-white/10'
                    }`}
                  >
                    <span className="relative">
                      <span
                        className={`block h-8 w-8 overflow-hidden rounded-full border shadow-soft transition lg:h-11 lg:w-11 ${
                          isActive
                            ? 'border-ayacucho-gold ring-2 ring-ayacucho-gold/80'
                            : 'border-white/40 group-hover:border-white/70 group-hover:ring-2 group-hover:ring-white/20'
                        }`}
                      >
                        <img
                          src={l.flag}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </span>
                      {isActive && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ayacucho-gold text-ayacucho-night shadow">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] leading-none lg:text-xs ${
                        isActive ? 'font-bold text-ayacucho-lightgold' : 'font-semibold text-white/85'
                      }`}
                    >
                      {l.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Contenido principal: institucional en escritorio, app en móvil */}
        <main className="flex flex-1 items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-4 lg:grid-cols-12 lg:px-10 lg:py-8">
            <div className="text-center lg:col-span-7 lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-ayacucho-lightgold backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                Patrimonio Vivo del Perú
              </span>

              <h1 className="mt-4 font-cultural text-[2.15rem] font-extrabold leading-none tracking-[0.22em] text-white drop-shadow-lg sm:text-5xl lg:text-6xl xl:text-7xl">
                {t('welcome.heroTitle')}
              </h1>

              <p className="mt-2 font-cultural text-lg font-light italic text-ayacucho-lightgold drop-shadow sm:text-2xl lg:text-3xl">
                {t('welcome.heroSubtitle')}
              </p>

              <p className="mx-auto mt-4 max-w-xs text-[13px] leading-relaxed text-white/90 drop-shadow sm:max-w-md sm:text-sm lg:mx-0 lg:max-w-xl lg:text-base">
                {t('welcome.heroDesc')}
              </p>

              {/* Botones principales */}
              <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:mt-8 lg:justify-start">
                <button
                  onClick={handleStart}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ayacucho-gold to-ayacucho-lightgold px-6 py-3.5 text-sm font-extrabold tracking-wide text-ayacucho-night shadow-elevated transition-all hover:brightness-105 active:scale-[0.98]"
                >
                  <span>Ingresar como visitante</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </button>

                <button
                  onClick={handleStart}
                  className="rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-[0.98]"
                >
                  {t('welcome.continueGuest')}
                </button>
              </div>

              {/* Accesos secundarios: Negocios y Administración */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <button
                  onClick={handleBusinessDemo}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-ayacucho-gold/40 bg-white/10 px-4 py-2 text-[11px] font-semibold text-ayacucho-lightgold backdrop-blur-md transition hover:bg-white/20"
                >
                  <Store className="h-3.5 w-3.5" /> Negocios
                </button>
                <button
                  onClick={handleAdminAccess}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-medium text-slate-200 backdrop-blur-md transition hover:bg-white/20"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Administración municipal
                </button>
              </div>
            </div>

            {/* Panel institucional (solo escritorio) */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-modal backdrop-blur-xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ayacucho-lightgold">
                  Plataforma turística de Huamanga
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Información oficial, negocios locales y administración municipal en un solo lugar.
                </p>

                <div className="mt-5 space-y-2.5">
                  {HIGHLIGHTS.map((h) => {
                    const Icon = h.icon;
                    return (
                      <div
                        key={h.key}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2.5"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ayacucho-gold/20 text-ayacucho-lightgold">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-white/90">{h.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Pie institucional */}
        <footer className="w-full shrink-0">
          <div className="mx-auto max-w-7xl px-4 pb-4 lg:px-10 lg:pb-6">
            <p className="text-center text-[10px] text-white/60 drop-shadow lg:text-left">
              Escuela de Educación Superior La Pontificia · 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
