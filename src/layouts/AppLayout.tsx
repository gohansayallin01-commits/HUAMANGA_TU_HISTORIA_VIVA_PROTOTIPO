import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/common/BottomNav';
import { HanaFloatingButton } from '../components/assistant/HanaFloatingButton';
import { HanaChatModal } from '../components/assistant/HanaChatModal';
import { GuidedTourWalkthrough } from '../components/guide/GuidedTourWalkthrough';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [isHanaChatOpen, setIsHanaChatOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);

  // Ocultar botón flotante en la pantalla dedicada del asistente para no duplicar
  const isAssistantPage = location.pathname.includes('/asistente');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-ayacucho-bg flex flex-col antialiased selection:bg-ayacucho-gold/30">
      {/* Cabecera Principal */}
      <Header onStartTour={() => setIsGuidedTourOpen(true)} />

      {/* Contenido Principal de Rutas */}
      <main className="flex-1 w-full pb-safe">
        <Outlet />
      </main>

      {/* Botón Flotante de Hana */}
      {!isAssistantPage && !isAdminRoute && (
        <HanaFloatingButton onClick={() => setIsHanaChatOpen(true)} />
      )}

      {/* Modal de Chat con Hana */}
      <HanaChatModal
        isOpen={isHanaChatOpen}
        onClose={() => setIsHanaChatOpen(false)}
      />

      {/* Recorrido Guiado para el Docente */}
      <GuidedTourWalkthrough
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
      />

      {/* Barra de Navegación Inferior Fija */}
      {!isAdminRoute && <BottomNav />}
    </div>
  );
};
