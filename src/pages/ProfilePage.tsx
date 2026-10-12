import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Heart, 
  Calendar, 
  RotateCcw, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Check, 
  Sparkles,
  Ticket
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useI18n } from '../i18n/i18nContext';
import { useToast } from '../components/common/ToastContext';
import { Modal } from '../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const { language, setLanguage, t } = useI18n();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(() => storageService.getUserProfile());
  const [bookings] = useState(() => storageService.getBookings());
  const favorites = storageService.getFavorites();

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Preferencias de viaje disponibles
  const availablePreferences = [
    'Historia',
    'Gastronomía',
    'Naturaleza',
    'Cultura',
    'Fotografía',
    'Artesanía',
    'Aventura',
    'Actividades familiares'
  ];

  const handleTogglePreference = (pref: string) => {
    let updated = [...profile.preferences];
    if (updated.includes(pref)) {
      updated = updated.filter(p => p !== pref);
    } else {
      updated.push(pref);
    }
    const newProfile = { ...profile, preferences: updated };
    setProfile(newProfile);
    storageService.saveUserProfile(newProfile);
    showToast('Preferencias actualizadas', 'info');
  };

  const handleResetData = () => {
    storageService.resetAllToExhibitionState();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-5 animate-fade-in text-slate-800">
      {/* 1. Tarjeta de Perfil de Usuario */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft flex items-center gap-4">
        <div className="relative">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-ayacucho-gold/50 shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-ayacucho-night font-cultural truncate">
              {profile.name}
            </h2>
            <span className="text-[10px] bg-ayacucho-gold/20 text-ayacucho-deep px-2 py-0.5 rounded font-bold">
              DEMO
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Procedencia: <strong>{profile.country}</strong> · Idioma: <strong>{language.toUpperCase()}</strong>
          </p>
        </div>
      </div>

      {/* Acceso a cuenta (visitante sin registro) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-ayacucho-night/5 text-ayacucho-deep flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-ayacucho-night block">Crear cuenta</span>
            <span className="text-[11px] text-slate-400 block">
              Disponible en una próxima versión. Puedes usar el prototipo sin registrarte.
            </span>
          </div>
        </div>
        <button
          onClick={() =>
            showToast('Crear cuenta estará disponible en una próxima versión. Por ahora navega como visitante.', 'info')
          }
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold whitespace-nowrap transition"
        >
          Crear cuenta
        </button>
      </div>

      {/* 2. Estadísticas de Actividad Demostrativa */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <Heart className="w-4 h-4 text-ayacucho-alert mx-auto mb-1" />
          <span className="text-sm font-extrabold text-ayacucho-night">{favorites.length}</span>
          <span className="text-[10px] text-slate-400 block">Favoritos</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <Calendar className="w-4 h-4 text-ayacucho-gold mx-auto mb-1" />
          <span className="text-sm font-extrabold text-ayacucho-night">6</span>
          <span className="text-[10px] text-slate-400 block">Rutas Disponibles</span>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-xs">
          <Ticket className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-sm font-extrabold text-ayacucho-night">{bookings.length}</span>
          <span className="text-[10px] text-slate-400 block">Reservas Demo</span>
        </div>
      </div>

      {/* 3. Preferencias de Viaje (Adaptan la experiencia local) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-ayacucho-gold" />
          <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
            Mis Intereses y Preferencias
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Selecciona tus temas preferidos para personalizar las sugerencias en portada:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {availablePreferences.map(pref => {
            const isSelected = profile.preferences.includes(pref);
            return (
              <button
                key={pref}
                onClick={() => handleTogglePreference(pref)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-ayacucho-night text-ayacucho-lightgold shadow-xs scale-102'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{pref}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Historial de Reservas Demostrativas */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-soft space-y-3">
        <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
          Mis Reservas Realizadas (Demostrativas)
        </h3>

        {bookings.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No tienes reservas activas.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-ayacucho-night block">{b.activityName}</span>
                  <span className="text-slate-500 text-[11px]">{b.date} ({b.timeSlot.split(' ')[0]}) · {b.visitorsCount} personas</span>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-emerald-700 block">S/ {b.totalPrice}.00</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {b.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Ajustes, Privacidad y Ayuda */}
      <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-soft space-y-1">
        <button
          onClick={() => setIsPrivacyOpen(true)}
          className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 transition"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Política de Privacidad Demostrativa</span>
          </div>
          <span className="text-slate-400">›</span>
        </button>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="w-full p-3 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 transition"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Ayuda y Preguntas Frecuentes</span>
          </div>
          <span className="text-slate-400">›</span>
        </button>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="w-full p-3 rounded-2xl hover:bg-rose-50 flex items-center justify-between text-xs font-semibold text-ayacucho-alert transition"
        >
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-ayacucho-alert" />
            <span>Restablecer Mis Datos Locales</span>
          </div>
          <span className="text-rose-400">›</span>
        </button>
      </div>

      {/* Modal Política de Privacidad */}
      <Modal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        title="Política de Privacidad Demostrativa"
      >
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            El prototipo <strong>HUAMANGA: TU HISTORIA VIVA</strong> es una investigación académica desarrollada para la Escuela de Educación Superior Tecnológica Privada La Pontificia (Ayacucho, 2026).
          </p>
          <p>
            <strong>Almacenamiento Local Exclusivo:</strong> Todos los datos de favoritos, itinerario, reservas de prueba y preferencias de idioma se almacenan de manera local y aislada en su propio navegador mediante la tecnología <em>localStorage</em>.
          </p>
          <p>
            <strong>Cero Recopilación Sensible:</strong> La plataforma no almacena contraseñas reales, no solicita números de tarjeta bancaria, no accede a documentos de identidad ni transmite información a servidores externos de cobro.
          </p>
        </div>
      </Modal>

      {/* Modal Ayuda */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Ayuda y Modo de Uso"
      >
        <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
          <p>
            <strong>¿Cómo navegar la plataforma?</strong> Utiliza el menú inferior para moverte entre la Portada, el Catálogo, el Mapa y tus Favoritos.
          </p>
          <p>
            <strong>¿Cómo escuchar las audioguías?</strong> En la ficha de cualquier atractivo, pulsa "Escuchar audioguía" para activar la síntesis de voz en español o inglés.
          </p>
          <p>
            <strong>Modo Exposición:</strong> En la cabecera superior puedes presionar "Modo Exposición" en cualquier momento para restaurar todos los registros de demostración limpios.
          </p>
        </div>
      </Modal>

      {/* Modal Confirmar Restablecer */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Confirmar Restablecimiento"
      >
        <div className="text-xs text-slate-600 space-y-3">
          <p>
            ¿Deseas restablecer todos los datos del prototipo a su estado de fábrica limpio? Se restablecerán favoritos, itinerario y reservas demostrativas.
          </p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsResetConfirmOpen(false)}
              className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleResetData}
              className="flex-1 py-2 rounded-xl bg-ayacucho-alert hover:bg-red-700 text-white font-bold transition"
            >
              Restablecer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
