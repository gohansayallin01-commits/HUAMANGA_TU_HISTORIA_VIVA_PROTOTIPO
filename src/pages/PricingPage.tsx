import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Send, 
  AlertTriangle,
  Building2,
  Users,
  Megaphone,
  Compass
} from 'lucide-react';
import { MONETIZATION_PLANS } from '../data/plans';
import { useI18n } from '../i18n/i18nContext';
import { useToast } from '../components/common/ToastContext';
import { Modal } from '../components/common/Modal';
import { MonetizationPlan } from '../types';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const { showToast } = useToast();

  const [selectedPlan, setSelectedPlan] = useState<MonetizationPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario de interés comercial
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleOpenInterest = (plan: MonetizationPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleSendInterest = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(
      `¡Solicitud demostrativa enviada para el "${selectedPlan?.name}"!`,
      'success'
    );
    setIsModalOpen(false);
    setBusinessName('');
    setContactName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 pb-24 space-y-6 animate-fade-in text-slate-800">
      {/* Cabecera */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ayacucho-night font-cultural">
            {t('pricing.title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('pricing.subtitle')} · Huamanga: Tu Historia Viva
          </p>
        </div>
      </div>

      {/* Banner de Aviso Comercial Referencial */}
      <div className="p-3.5 bg-ayacucho-warmwhite rounded-2xl border border-ayacucho-gold/40 text-xs text-ayacucho-night flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-ayacucho-gold shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Modelo Comercial Referencial para Demostración Académica:</strong>
          <span>
            Las tarifas, comisiones y planes presentados son estimaciones financieras con fines de exposición. Los botones de contratación no ejecutan cargos bancarios reales.
          </span>
        </div>
      </div>

      {/* Grilla de los 4 Planes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MONETIZATION_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-5 border flex flex-col justify-between transition-all ${
              plan.isPopular
                ? 'bg-ayacucho-night text-white border-ayacucho-gold shadow-elevated scale-102 ring-2 ring-ayacucho-gold/50'
                : 'bg-white text-slate-800 border-slate-200 shadow-soft hover:shadow-elevated'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  plan.isPopular
                    ? 'bg-ayacucho-gold text-ayacucho-night'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {plan.badge}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base font-cultural">
                  {language === 'en' ? plan.nameEn : plan.name}
                </h3>
                <p className={`text-xs mt-1 leading-snug line-clamp-2 ${
                  plan.isPopular ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {language === 'en' ? plan.descriptionEn : plan.description}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-extrabold ${plan.isPopular ? 'text-ayacucho-lightgold' : 'text-ayacucho-night'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-[11px] ${plan.isPopular ? 'text-slate-300' : 'text-slate-500'}`}>
                    / {language === 'en' ? plan.frequencyEn : plan.frequency}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200/40 text-xs">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${plan.isPopular ? 'text-ayacucho-gold' : 'text-emerald-600'}`} />
                    <span className="leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 mt-4">
              <button
                onClick={() => handleOpenInterest(plan)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition shadow-xs ${
                  plan.isPopular
                    ? 'bg-ayacucho-gold hover:bg-ayacucho-lightgold text-ayacucho-night'
                    : 'bg-ayacucho-night hover:bg-ayacucho-deep text-white'
                }`}
              >
                {plan.id === 'plan-viajero' ? 'Ver Atractivos' : 'Solicitar Plan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Interés Comercial */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('pricing.modalTitle')}
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p className="leading-relaxed">
            Ha seleccionado: <strong className="text-ayacucho-night font-bold">{selectedPlan?.name} ({selectedPlan?.price})</strong>.
            Complete este formulario demostrativo para registrar su intención de contacto comercial.
          </p>

          <form onSubmit={handleSendInterest} className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre del Negocio o Emprendimiento:</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Hostal San Cristóbal"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Persona de Contacto:</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ej. María Quispe"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@negocio.pe"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono:</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+51 966 000 000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
              * Nota: Demostración académica. No se procesará ningún cobro bancario.
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-ayacucho-gold text-ayacucho-night font-bold hover:bg-ayacucho-lightgold transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('pricing.sendInterest')}</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
