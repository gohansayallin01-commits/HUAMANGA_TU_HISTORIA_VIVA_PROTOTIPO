import React, { useState } from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Store,
  Route,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useAdminAuth, ROLE_LABELS } from '../context/AdminAuthContext';
import { storageService } from '../services/storageService';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/atractivos', label: 'Atractivos turísticos', icon: MapPin },
  { to: '/admin/negocios', label: 'Negocios afiliados', icon: Store },
  { to: '/admin/rutas', label: 'Rutas', icon: Route },
  { to: '/admin/eventos', label: 'Eventos', icon: Calendar },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

const SidebarContent: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-ayacucho-deep/40 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ayacucho-gold to-ayacucho-lightgold p-1 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-ayacucho-night" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-sm text-white font-cultural leading-tight">Huamanga Admin</div>
          <div className="text-[10px] text-ayacucho-lightgold/80 leading-tight">Portal municipal</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-ayacucho-gold text-ayacucho-night shadow-sm'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-2 border-t border-ayacucho-deep/40 space-y-0.5 shrink-0">
        <button
          onClick={() => {
            onNavigate?.();
            navigate('/');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Volver al portal turístico</span>
        </button>
        <button
          onClick={() => {
            onNavigate?.();
            logout();
            navigate('/acceso-administrativo');
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-200 hover:bg-rose-500/20 transition"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Cerrar sesión demostrativa</span>
        </button>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC = () => {
  const { session, role, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');

  if (!session) {
    return <Navigate to="/acceso-administrativo" replace />;
  }

  const notifications = storageService.getNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/admin/atractivos?q=${encodeURIComponent(q)}` : '/admin/atractivos');
  };

  return (
    <div className="min-h-screen bg-ayacucho-bg flex text-slate-800">
      {/* Sidebar escritorio / tablet compacto */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30 w-20 lg:w-64 bg-ayacucho-night transition-all">
        <div className="hidden lg:block h-full">
          <SidebarContent />
        </div>
        {/* Versión compacta (tablet): solo iconos */}
        <div className="lg:hidden h-full flex flex-col items-center py-3 gap-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ayacucho-gold to-ayacucho-lightgold p-1 flex items-center justify-center mb-2 shrink-0">
            <ShieldCheck className="w-5 h-5 text-ayacucho-night" />
          </div>
          <nav className="flex-1 flex flex-col items-center gap-1 w-full px-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-11 h-11 rounded-xl transition ${
                      isActive ? 'bg-ayacucho-gold text-ayacucho-night' : 'text-slate-200 hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                </NavLink>
              );
            })}
          </nav>
          <div className="flex flex-col items-center gap-1 w-full px-1.5">
            <button
              onClick={() => navigate('/')}
              title="Volver al portal turístico"
              className="flex items-center justify-center w-11 h-11 rounded-xl text-slate-200 hover:bg-white/10 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/acceso-administrativo');
              }}
              title="Cerrar sesión"
              className="flex items-center justify-center w-11 h-11 rounded-xl text-rose-200 hover:bg-rose-500/20 transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Drawer móvil */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-ayacucho-night shadow-modal animate-slide-up">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-300 hover:bg-white/10"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent onNavigate={() => setIsDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col md:pl-20 lg:pl-64 min-w-0">
        {/* Header administrativo */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="h-16 px-3 sm:px-5 flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar atractivos, negocios…"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-ayacucho-gold/50 focus:outline-none"
              />
            </form>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600">
              <Building2 className="w-3.5 h-3.5 text-ayacucho-deep" />
              Municipalidad Provincial de Huamanga
            </div>

            <div className="relative">
              <button
                className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                aria-label="Notificaciones"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ayacucho-alert rounded-full" />
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-ayacucho-night text-ayacucho-lightgold flex items-center justify-center text-xs font-bold">
                AD
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-slate-700">Usuario demostrativo</div>
                <div className="text-[10px] text-slate-400">{ROLE_LABELS[role]}</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ayacucho-night text-ayacucho-lightgold text-xs font-bold hover:bg-ayacucho-deep transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Portal turístico</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
