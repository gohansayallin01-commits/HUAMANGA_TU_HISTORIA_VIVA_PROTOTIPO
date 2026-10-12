import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Eye, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Smartphone, 
  Edit3, 
  Save, 
  Percent, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { useToast } from '../components/common/ToastContext';
import { useI18n } from '../i18n/i18nContext';
import { ImageFallback } from '../components/common/ImageFallback';
import { BusinessProfile } from '../types';

export const BusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [business, setBusiness] = useState<BusinessProfile>(() => storageService.getBusinessProfile());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editar' | 'preview'>('dashboard');

  // Estado del formulario editable
  const [formName, setFormName] = useState(business.name);
  const [formCategory, setFormCategory] = useState(business.category);
  const [formDescription, setFormDescription] = useState(business.description);
  const [formAddress, setFormAddress] = useState(business.address);
  const [formPhone, setFormPhone] = useState(business.phone);
  const [formHours, setFormHours] = useState(business.hours);
  const [formPromoTitle, setFormPromoTitle] = useState(business.activePromotion.title);
  const [formPromoDiscount, setFormPromoDiscount] = useState(business.activePromotion.discount);
  const [formPromoCode, setFormPromoCode] = useState(business.activePromotion.code);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessProfile = {
      ...business,
      name: formName,
      category: formCategory,
      description: formDescription,
      address: formAddress,
      phone: formPhone,
      hours: formHours,
      activePromotion: {
        ...business.activePromotion,
        title: formPromoTitle,
        discount: formPromoDiscount,
        code: formPromoCode
      }
    };

    setBusiness(updated);
    storageService.saveBusinessProfile(updated);
    showToast(t('business.changesSaved'), 'success');
    setActiveTab('preview');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 pb-24 space-y-6 animate-fade-in text-slate-800">
      {/* Barra superior del Panel de Negocio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title="Volver a la vista del viajero"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-ayacucho-night font-cultural">
                {business.name}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                NEGOCIO VERIFICADO
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t('business.subtitle')} · Ayacucho
            </p>
          </div>
        </div>

        {/* Pestañas de control */}
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-600'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-ayacucho-gold" />
            <span>Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('editar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'editar' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-600'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Editar Perfil</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'preview' ? 'bg-white text-ayacucho-night shadow-xs' : 'text-slate-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vista Celular</span>
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: DASHBOARD Y MÉTRICAS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          {/* Tarjetas KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Visitas al Perfil</span>
                <Eye className="w-4 h-4 text-ayacucho-deep" />
              </div>
              <div className="text-2xl font-extrabold text-ayacucho-night">
                {business.stats.views30Days}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                +24% vs mes anterior
              </span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Consultas Recibidas</span>
                <MessageSquare className="w-4 h-4 text-ayacucho-gold" />
              </div>
              <div className="text-2xl font-extrabold text-ayacucho-night">
                {business.stats.inquiries}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                8 consultas esta semana
              </span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Reservas Generadas</span>
                <Calendar className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-ayacucho-night">
                {business.stats.bookings}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                Comisión referencial S/ 0
              </span>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold">Cupón Activo</span>
                <Percent className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-lg font-bold text-ayacucho-night truncate">
                {business.activePromotion.code}
              </div>
              <span className="text-[11px] text-amber-700 font-bold mt-1 block">
                {business.activePromotion.discount}
              </span>
            </div>
          </div>

          {/* Gráfico y Desglose de Procedencia de Viajeros */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-soft space-y-4">
            <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
              Procedencia de los Viajeros que consultaron tu negocio (Últimos 30 días)
            </h3>

            <div className="space-y-3">
              {business.stats.visitorOrigins.map((orig, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{orig.country}</span>
                    <span className="font-bold text-ayacucho-deep">{orig.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-ayacucho-deep to-ayacucho-gold h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${orig.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: FORMULARIO DE EDICIÓN LOCAL */}
      {activeTab === 'editar' && (
        <form onSubmit={handleSaveChanges} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <h3 className="font-bold text-sm text-ayacucho-night font-cultural pb-2 border-b border-slate-100">
            Editar Información del Negocio Turístico
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Comercial:</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Rubro / Categoría:</label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Descripción para el Turista:</label>
              <textarea
                value={formDescription}
                rows={3}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Dirección exacta:</label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Teléfono / WhatsApp:</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Horario de atención:</label>
              <input
                type="text"
                value={formHours}
                onChange={(e) => setFormHours(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-slate-100">
              <h4 className="font-bold text-xs text-ayacucho-night mb-2">Promoción / Cupón Activo:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Título de la oferta:</label>
                  <input
                    type="text"
                    value={formPromoTitle}
                    onChange={(e) => setFormPromoTitle(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Descuento ofrecido:</label>
                  <input
                    type="text"
                    value={formPromoDiscount}
                    onChange={(e) => setFormPromoDiscount(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Código del cupón:</label>
                  <input
                    type="text"
                    value={formPromoCode}
                    onChange={(e) => setFormPromoCode(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none uppercase font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-ayacucho-gold text-ayacucho-night font-bold text-xs hover:bg-ayacucho-lightgold shadow-sm flex items-center gap-1.5 transition"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* PESTAÑA 3: VISTA PREVIA EN MOCKUP DE CELULAR */}
      {activeTab === 'preview' && (
        <div className="flex justify-center">
          {/* Mockup Frame de Celular */}
          <div className="w-full max-w-sm bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800">
            {/* Notch superior */}
            <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

            <div className="bg-slate-50 rounded-[32px] overflow-hidden text-slate-800 max-h-[580px] overflow-y-auto space-y-3 pb-6">
              <div className="relative h-44 w-full">
                <ImageFallback
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-ayacucho-night/90 text-ayacucho-lightgold text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {business.category}
                </div>
              </div>

              <div className="px-4 space-y-2">
                <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
                  {business.name}
                </h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {business.description}
                </p>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1 font-bold">
                    <Percent className="w-3.5 h-3.5 text-amber-600" />
                    <span>{business.activePromotion.title}</span>
                  </div>
                  <p className="text-[11px]">
                    Código: <strong className="bg-white px-1 py-0.5 rounded border border-amber-300">{business.activePromotion.code}</strong> · {business.activePromotion.discount}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-ayacucho-gold" />
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-ayacucho-gold" />
                    <span>{business.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-ayacucho-gold" />
                    <span>{business.phone}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => showToast('Simulación: Solicitud de contacto enviada al negocio.', 'success')}
                    className="w-full py-2 rounded-xl bg-ayacucho-night text-ayacucho-lightgold text-xs font-bold shadow-xs hover:bg-ayacucho-deep transition"
                  >
                    Contactar al Negocio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
