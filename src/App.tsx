import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { WelcomePage } from './pages/WelcomePage';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DetailPage } from './pages/DetailPage';
import { MapPage } from './pages/MapPage';
import { RoutesPage } from './pages/RoutesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AssistantPage } from './pages/AssistantPage';
import { EventsPage } from './pages/EventsPage';
import { BusinessPage } from './pages/BusinessPage';
import { PricingPage } from './pages/PricingPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AttractionsPage } from './pages/admin/AttractionsPage';
import { AttractionEditLayout } from './components/admin/AttractionEditLayout';
import { AttractionInfoPage } from './pages/admin/AttractionInfoPage';
import { AttractionLocationPage } from './pages/admin/AttractionLocationPage';
import { AttractionImagesPage } from './pages/admin/AttractionImagesPage';
import { AttractionPublicationPage } from './pages/admin/AttractionPublicationPage';
import { BusinessesPage } from './pages/admin/BusinessesPage';
import { RoutesAdminPage } from './pages/admin/RoutesAdminPage';
import { EventsAdminPage } from './pages/admin/EventsAdminPage';
import { UsersAdminPage } from './pages/admin/UsersAdminPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Componente que decide si mostrar bienvenida en primera visita
const InitialRouteHandler: React.FC = () => {
  const welcomeSeen = localStorage.getItem('huamanga_welcome_seen');
  if (!welcomeSeen) {
    return <WelcomePage />;
  }
  return <HomePage />;
};

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Pantalla de Bienvenida accesible directamente */}
        <Route path="/bienvenida" element={<WelcomePage />} />

        {/* Acceso administrativo (fuera del portal público) */}
        <Route path="/acceso-administrativo" element={<AdminLoginPage />} />

        {/* Layout Principal de la Aplicación (portal turístico público) */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<InitialRouteHandler />} />
          <Route path="explorar" element={<ExplorePage />} />
          <Route path="atractivo/:slug" element={<DetailPage />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="rutas" element={<RoutesPage />} />
          <Route path="favoritos" element={<FavoritesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="asistente" element={<AssistantPage />} />
          <Route path="eventos" element={<EventsPage />} />
          <Route path="negocios" element={<BusinessPage />} />
          <Route path="planes" element={<PricingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Portal Administrativo Municipal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="atractivos" element={<AttractionsPage />} />
          <Route path="atractivos/:id" element={<AttractionEditLayout />}>
            <Route index element={<Navigate to="informacion" replace />} />
            <Route path="informacion" element={<AttractionInfoPage />} />
            <Route path="ubicacion" element={<AttractionLocationPage />} />
            <Route path="imagenes" element={<AttractionImagesPage />} />
            <Route path="publicacion" element={<AttractionPublicationPage />} />
          </Route>
          <Route path="negocios" element={<BusinessesPage />} />
          <Route path="rutas" element={<RoutesAdminPage />} />
          <Route path="eventos" element={<EventsAdminPage />} />
          <Route path="usuarios" element={<UsersAdminPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
