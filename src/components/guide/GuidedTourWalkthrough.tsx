import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  Compass, 
  Map, 
  Bot, 
  Calendar, 
  Briefcase, 
  ShieldCheck 
} from 'lucide-react';
import { useToast } from '../common/ToastContext';

interface GuidedTourWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  title: string;
  desc: string;
  actionText: string;
  route: string;
  icon: any;
}

export const GuidedTourWalkthrough: React.FC<GuidedTourWalkthroughProps> = ({
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: TourStep[] = [
    {
      title: '1. Buscar un lugar',
      desc: 'El buscador inteligente en la portada y catálogo permite encontrar atractivos por nombre, categoría, distrito o palabra clave.',
      actionText: 'Ir a Explorar y Buscar',
      route: '/explorar',
      icon: Compass
    },
    {
      title: '2. Explorar categorías',
      desc: 'Navega por las 10 categorías obligatorias: iglesias, lugares históricos, gastronomía, naturaleza, museos y artesanía.',
      actionText: 'Ver Categorías',
      route: '/explorar',
      icon: Compass
    },
    {
      title: '3. Abrir el mapa interactivo',
      desc: 'El mapa de Ayacucho basado en OpenStreetMap ubica cada atractivo con pines interactivos, cálculo de distancias y rutas referenciales.',
      actionText: 'Abrir Mapa',
      route: '/mapa',
      icon: Map
    },
    {
      title: '4. Visualizar ficha turística',
      desc: 'Cada atractivo cuenta con historia, horarios, tarifas referenciales, accesibilidad, recomendaciones y audioguía interactiva.',
      actionText: 'Ver Ficha de la Catedral',
      route: '/atractivo/basilica-catedral',
      icon: Sparkles
    },
    {
      title: '5. Guardar en favoritos',
      desc: 'Guarda atractivos con el botón de corazón. Los datos persisten localmente en localStorage sin requerir registro obligatorio.',
      actionText: 'Ver Favoritos e Itinerario',
      route: '/favoritos',
      icon: Sparkles
    },
    {
      title: '6. Explorar y seguir rutas',
      desc: 'El planificador incluye 6 rutas temáticas con cronograma. Permite marcar paradas como visitadas y ver el avance porcentual.',
      actionText: 'Ver Rutas Turísticas',
      route: '/rutas',
      icon: Compass
    },
    {
      title: '7. Consultar a la asistente Hana',
      desc: 'Hana es una asistente basada en reglas locales que responde preguntas sobre un día en Ayacucho, comida típica y lugares gratuitos.',
      actionText: 'Abrir Asistente Hana',
      route: '/asistente',
      icon: Bot
    },
    {
      title: '8. Simular una reserva',
      desc: 'Flujo interactivo en 7 pasos con validación de fechas futuras y generación de comprobante demostrativo sin cobros bancarios.',
      actionText: 'Ir al Inicio para Reservar',
      route: '/',
      icon: Calendar
    },
    {
      title: '9. Ver modelo de negocio y SaaS',
      desc: 'Explora la propuesta de sostenibilidad con planes para negocios locales (S/ 29/mes), publicidad premium y comisión por tours.',
      actionText: 'Ver Planes y Monetización',
      route: '/planes',
      icon: Briefcase
    },
    {
      title: '10. Entrar al panel administrativo',
      desc: 'Panel de gestión con contraseña académica abierta (admin123), métricas de actividad y CRUD completo para atractivos turísticos.',
      actionText: 'Ir al Panel Admin',
      route: '/acceso-administrativo',
      icon: ShieldCheck
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      showToast('¡Recorrido guiado completado con éxito!', 'success');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleExecuteAction = () => {
    navigate(currentStep.route);
    showToast(`Navegando a: ${currentStep.title}`, 'info');
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    navigate('/');
    showToast('Recorrido reiniciado al inicio', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-modal overflow-hidden border-2 border-ayacucho-gold/50 animate-slide-up flex flex-col">
        {/* Cabecera del Recorrido */}
        <div className="bg-ayacucho-night text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-ayacucho-gold" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-ayacucho-lightgold">
              Guía de Exposición Docente ({currentStepIndex + 1}/{steps.length})
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleRestart}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              title="Reiniciar recorrido"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              title="Omitir recorrido"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-ayacucho-gold h-1 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Contenido del Paso */}
        <div className="p-5 text-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-ayacucho-gold/20 flex items-center justify-center shrink-0 text-ayacucho-night">
              <StepIcon className="w-5 h-5 text-ayacucho-gold" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-sm text-ayacucho-night font-cultural">
                {currentStep.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {currentStep.desc}
              </p>
            </div>
          </div>

          {/* Botón de acción contextual */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={handleExecuteAction}
              className="w-full py-2 px-3 rounded-xl bg-ayacucho-warmwhite hover:bg-ayacucho-gold/20 border border-ayacucho-gold/40 text-ayacucho-night text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>{currentStep.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5 text-ayacucho-gold" />
            </button>
          </div>
        </div>

        {/* Controles de avance y retroceso */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 disabled:opacity-30 hover:bg-slate-200 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium"
          >
            Omitir
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-ayacucho-gold text-ayacucho-night text-xs font-bold hover:bg-ayacucho-lightgold shadow-sm transition"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
            {currentStepIndex === steps.length - 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
