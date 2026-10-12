import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Globe, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useI18n } from '../i18n/i18nContext';
import { useToast } from '../components/common/ToastContext';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();
  const { showToast } = useToast();

  const handleLanguageChange = (lang: 'es' | 'en' | 'fr' | 'pt') => {
    if (lang === 'fr' || lang === 'pt') {
      showToast(`${lang.toUpperCase()} estará disponible próximamente en la versión productiva.`, 'info');
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
    <div className="relative min-h-screen bg-ayacucho-night text-white flex flex-col justify-between overflow-hidden">
      {/* Fondo panorámico con overlay estilizado */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1600&q=80"
          alt="Panorámica de Huamanga Ayacucho"
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ayacucho-night/80 via-ayacucho-night/60 to-ayacucho-night" />
      </div>

      {/* Encabezado superior con badge */}
      <header className="relative z-10 p-6 flex justify-between items-center max-w-md mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-ayacucho-gold/20 border border-ayacucho-gold/40 flex items-center justify-center">
            <Compass className="w-5 h-5 text-ayacucho-gold" />
          </div>
          <span className="text-xs font-bold tracking-widest text-ayacucho-lightgold uppercase">
            Ayacucho · Perú
          </span>
        </div>

        <span className="text-[10px] font-semibold bg-white/10 px-2.5 py-1 rounded-full text-slate-300 border border-white/10">
          Prototipo Académico
        </span>
      </header>

      {/* Contenido Central Hero */}
      <main className="relative z-10 px-6 max-w-md mx-auto w-full text-center my-auto py-8">
        {/* Isotipo Circular */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-ayacucho-gold to-ayacucho-lightgold p-1 shadow-elevated mb-6 flex items-center justify-center animate-pulse-subtle">
          <Compass className="w-12 h-12 text-ayacucho-night stroke-[2.2]" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-cultural leading-none mb-2">
          HUAMANGA
        </h1>
        <p className="text-xl sm:text-2xl font-cultural italic text-ayacucho-gold mb-3">
          Tu historia viva
        </p>

        <p className="text-sm text-slate-200 max-w-xs mx-auto leading-relaxed mb-8">
          {t('welcome.heroDesc')}
        </p>

        {/* Selector Visual de Idiomas */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 max-w-xs mx-auto mb-8 shadow-soft">
          <p className="text-[11px] font-semibold text-ayacucho-lightgold uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            {t('welcome.selectLanguage')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLanguageChange('es')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                language === 'es'
                  ? 'bg-ayacucho-gold text-ayacucho-night shadow-sm'
                  : 'bg-white/5 hover:bg-white/15 text-white'
              }`}
            >
              <span>🇪🇸 Español</span>
              {language === 'es' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleLanguageChange('en')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                language === 'en'
                  ? 'bg-ayacucho-gold text-ayacucho-night shadow-sm'
                  : 'bg-white/5 hover:bg-white/15 text-white'
              }`}
            >
              <span>🇺🇸 English</span>
              {language === 'en' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleLanguageChange('fr')}
              className="py-1.5 px-3 rounded-xl text-[11px] font-medium bg-white/5 text-slate-400 flex items-center justify-center gap-1.5"
            >
              <span>🇫🇷 Français</span>
              <span className="text-[9px] bg-white/10 px-1 rounded text-slate-400">{t('welcome.soon')}</span>
            </button>

            <button
              onClick={() => handleLanguageChange('pt')}
              className="py-1.5 px-3 rounded-xl text-[11px] font-medium bg-white/5 text-slate-400 flex items-center justify-center gap-1.5"
            >
              <span>🇧🇷 Português</span>
              <span className="text-[9px] bg-white/10 px-1 rounded text-slate-400">{t('welcome.soon')}</span>
            </button>
          </div>
        </div>

        {/* Botones Principales */}
        <div className="space-y-3 max-w-xs mx-auto">
          <button
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-ayacucho-gold to-ayacucho-lightgold text-ayacucho-night font-bold text-sm tracking-wide shadow-elevated hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Ingresar como visitante</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={handleStart}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 font-medium transition"
          >
            {t('welcome.continueGuest')}
          </button>

          <div className="pt-2 border-t border-white/10 space-y-2">
            <button
              onClick={handleBusinessDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-ayacucho-lightgold font-semibold transition border border-ayacucho-gold/30"
            >
              Demostración para negocios
            </button>

            <button
              onClick={handleAdminAccess}
              className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-200 font-medium transition"
            >
              Acceso administrativo (demostración)
            </button>
          </div>
        </div>
      </main>

      {/* Pie de pantalla */}
      <footer className="relative z-10 p-4 text-center text-[11px] text-slate-400 border-t border-white/5 max-w-md mx-auto w-full">
        <span>Escuela de Educación Superior La Pontificia · 2026</span>
      </footer>
    </div>
  );
};
