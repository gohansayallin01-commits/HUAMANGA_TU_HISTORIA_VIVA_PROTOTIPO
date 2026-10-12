import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Map, Heart, User } from 'lucide-react';
import { useI18n } from '../../i18n/i18nContext';
import { useFavorites } from '../../hooks/useFavorites';

export const BottomNav: React.FC = () => {
  const { t } = useI18n();
  const { favorites } = useFavorites();

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/explorar', label: t('nav.explore'), icon: Compass },
    { to: '/mapa', label: t('nav.map'), icon: Map },
    { to: '/favoritos', label: t('nav.favorites'), icon: Heart, badge: favorites.length },
    { to: '/perfil', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav 
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all"
    >
      <div className="max-w-md md:max-w-xl mx-auto px-2 flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-200 group ${
                  isActive
                    ? 'text-ayacucho-night font-semibold'
                    : 'text-slate-400 hover:text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indicador superior activo */}
                  {isActive && (
                    <span className="absolute top-0 w-8 h-1 bg-ayacucho-gold rounded-full transition-all duration-200" />
                  )}

                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive
                          ? 'scale-110 text-ayacucho-gold stroke-[2.4]'
                          : 'group-hover:scale-105 stroke-[1.8]'
                      }`}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-ayacucho-alert text-[10px] font-bold text-white flex items-center justify-center leading-none">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] mt-1 tracking-tight transition-colors ${
                      isActive ? 'text-ayacucho-night font-bold' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
