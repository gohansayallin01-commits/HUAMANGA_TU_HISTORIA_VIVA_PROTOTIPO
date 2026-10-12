import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Download, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  Compass
} from 'lucide-react';
import { Attraction, Booking } from '../../types';
import { storageService } from '../../services/storageService';
import { useAttractions } from '../../context/AttractionsContext';
import { useI18n } from '../../i18n/i18nContext';
import { useToast } from '../common/ToastContext';
import { isNotPastDate, isValidEmail } from '../../utils/helpers';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAttraction?: Attraction | null;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  preselectedAttraction
}) => {
  const { t } = useI18n();
  const { showToast } = useToast();
  const attractions = useAttractions().publishedAttractions;

  const [step, setStep] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(
    preselectedAttraction?.name || 'Tour Guiado: Ruta de la Independencia'
  );
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('08:30 hrs (Turno Mañana)');
  const [visitorsCount, setVisitorsCount] = useState(2);
  const [customerName, setCustomerName] = useState('Profesor Evaluador');
  const [customerEmail, setCustomerEmail] = useState('evaluador@lapontificia.edu.pe');
  const [customerPhone, setCustomerPhone] = useState('+51 966 123456');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const unitPrice = 45; // Precio referencial S/ 45 por persona
  const totalPrice = unitPrice * visitorsCount;

  const handleNext = () => {
    // Validaciones por paso
    if (step === 2) {
      if (!date || !isNotPastDate(date)) {
        showToast('Por favor seleccione una fecha válida (a partir de hoy).', 'alert');
        return;
      }
    }
    if (step === 4) {
      if (visitorsCount < 1) {
        showToast('Debe ingresar al menos 1 visitante.', 'alert');
        return;
      }
    }
    if (step === 5) {
      if (!customerName.trim() || customerName.length < 3) {
        showToast('Ingrese un nombre válido para la reserva.', 'alert');
        return;
      }
      if (!isValidEmail(customerEmail)) {
        showToast('Ingrese un correo electrónico válido.', 'alert');
        return;
      }
      if (!customerPhone.trim() || customerPhone.length < 6) {
        showToast('Ingrese un número de teléfono de contacto.', 'alert');
        return;
      }
    }
    if (step === 6) {
      if (!acceptTerms) {
        showToast('Debe aceptar las condiciones demostrativas para continuar.', 'alert');
        return;
      }

      // Generar código de reserva y guardar
      const bookingCode = `HMA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        id: Math.random().toString(),
        code: bookingCode,
        activityName: selectedActivity,
        date,
        timeSlot,
        visitorsCount,
        customerName,
        customerEmail,
        customerPhone,
        totalPrice,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };

      storageService.saveBooking(newBooking);
      setConfirmedBooking(newBooking);

      // Lanzar confeti celebratorio
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setStep(7);
      return;
    }

    setStep(prev => prev + 1);
  };

  const handleDownloadVoucher = () => {
    showToast('Comprobante preparado. Puede imprimirlo o guardarlo en PDF.', 'success');
    window.print();
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-modal overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 animate-slide-up">
        {/* Cabecera del Wizard */}
        <div className="bg-ayacucho-night text-white px-5 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-ayacucho-gold" />
              <h3 className="font-bold text-sm sm:text-base font-cultural">{t('booking.title')}</h3>
            </div>
            <p className="text-[11px] text-ayacucho-lightgold/80">
              {step <= 6 ? `Paso ${step} de 6: ${t(`booking.step${step}`)}` : '¡Reserva Completada!'}
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de progreso de pasos */}
        {step <= 6 && (
          <div className="w-full bg-slate-100 h-1.5">
            <div
              className="bg-ayacucho-gold h-1.5 transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        )}

        {/* Contenido del Paso */}
        <div className="p-5 overflow-y-auto flex-1 text-slate-800">
          {/* PASO 1: SELECCIONAR ACTIVIDAD */}
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-ayacucho-night">1. Seleccione la actividad o tour:</h4>
              <div className="space-y-2">
                {[
                  'Tour Guiado: Ruta de la Independencia',
                  'Excursión a las Aguas Turquesas de Millpu',
                  'Taller Vivo de Retablos en Santa Ana',
                  'Circuito Sacro: Las 33 Iglesias Coloniales',
                  'Ruta Gastronómica y Cata de Café Ayacuchano'
                ].map((act) => (
                  <label
                    key={act}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      selectedActivity === act
                        ? 'border-ayacucho-gold bg-ayacucho-gold/10 font-bold text-ayacucho-night'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{act}</span>
                    <input
                      type="radio"
                      name="activity"
                      value={act}
                      checked={selectedActivity === act}
                      onChange={() => setSelectedActivity(act)}
                      className="text-ayacucho-gold focus:ring-ayacucho-gold"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: SELECCIONAR FECHA */}
          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-ayacucho-night">2. Fecha de la visita:</h4>
              <p className="text-xs text-slate-500">Seleccione la fecha deseada para realizar el recorrido.</p>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-ayacucho-gold" />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none text-sm font-medium"
                />
              </div>
            </div>
          )}

          {/* PASO 3: SELECCIONAR HORARIO */}
          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-ayacucho-night">3. Seleccione el turno:</h4>
              <div className="space-y-2">
                {[
                  '08:30 hrs (Turno Mañana)',
                  '12:00 hrs (Turno Mediodía)',
                  '15:30 hrs (Turno Tarde)'
                ].map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      timeSlot === slot
                        ? 'border-ayacucho-gold bg-ayacucho-gold/10 font-bold text-ayacucho-night'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-ayacucho-gold" />
                      <span className="text-xs sm:text-sm">{slot}</span>
                    </div>
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      checked={timeSlot === slot}
                      onChange={() => setTimeSlot(slot)}
                      className="text-ayacucho-gold focus:ring-ayacucho-gold"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4: CANTIDAD DE VISITANTES */}
          {step === 4 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-ayacucho-night">4. Número de visitantes:</h4>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-ayacucho-gold" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Personas</p>
                    <p className="text-xs text-slate-500">Tarifa referencial: S/ 45.00 c/u</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setVisitorsCount(Math.max(1, visitorsCount - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-base w-6 text-center">{visitorsCount}</span>
                  <button
                    onClick={() => setVisitorsCount(Math.min(10, visitorsCount + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right text-xs font-semibold text-ayacucho-deep">
                Total estimado: S/ {totalPrice}.00
              </div>
            </div>
          )}

          {/* PASO 5: DATOS DE CONTACTO */}
          {step === 5 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-ayacucho-night">5. Datos de contacto:</h4>
              
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Nombre completo:</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Correo electrónico:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Teléfono / WhatsApp:</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+51 987 654 321"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 6: RESUMEN Y ACEPTACIÓN */}
          {step === 6 && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-ayacucho-night">6. Resumen de la reserva:</h4>

              <div className="p-3.5 bg-ayacucho-warmwhite rounded-2xl border border-ayacucho-gold/30 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Actividad:</span>
                  <span className="font-bold text-ayacucho-night">{selectedActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-bold text-ayacucho-night">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Horario:</span>
                  <span className="font-bold text-ayacucho-night">{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Visitantes:</span>
                  <span className="font-bold text-ayacucho-night">{visitorsCount} personas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular:</span>
                  <span className="font-bold text-ayacucho-night">{customerName}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                  <span className="font-bold text-slate-700">Total a pagar:</span>
                  <span className="font-extrabold text-ayacucho-deep">S/ {totalPrice}.00</span>
                </div>
              </div>

              {/* Advertencia Obligatoria */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{t('booking.disclaimer')}</span>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded text-ayacucho-gold focus:ring-ayacucho-gold mt-0.5"
                />
                <span>{t('booking.acceptTerms')}</span>
              </label>
            </div>
          )}

          {/* PASO 7: CONFIRMACIÓN Y COMPROBANTE */}
          {step === 7 && confirmedBooking && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-bold text-base text-ayacucho-night font-cultural">
                  ¡Reserva Registrada Exitosamente!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tu solicitud ha sido generada en el entorno de demostración.
                </p>
              </div>

              {/* Tarjeta del Voucher */}
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-ayacucho-gold/60 text-left text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">CÓDIGO DE RESERVA:</span>
                  <span className="font-extrabold text-ayacucho-night text-sm tracking-wide bg-ayacucho-gold/20 px-2 py-0.5 rounded">
                    {confirmedBooking.code}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Titular:</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Fecha y Hora:</span>
                    <span className="font-semibold text-slate-800">{confirmedBooking.date} ({confirmedBooking.timeSlot.split(' ')[0]})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Actividad:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{confirmedBooking.activityName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Referencial:</span>
                    <span className="font-bold text-emerald-700">S/ {confirmedBooking.totalPrice}.00</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleDownloadVoucher}
                  className="w-full py-2.5 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4 text-ayacucho-gold" />
                  <span>{t('booking.downloadVoucher')}</span>
                </button>

                <button
                  onClick={resetAndClose}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  {t('booking.backToHome')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones de Navegación del Wizard */}
        {step <= 6 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(prev => prev - 1)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('booking.prev')}</span>
              </button>
            ) : <span />}

            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-ayacucho-gold text-ayacucho-night text-xs font-bold hover:bg-ayacucho-lightgold shadow-sm transition"
            >
              <span>{step === 6 ? t('booking.confirm') : t('booking.next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
