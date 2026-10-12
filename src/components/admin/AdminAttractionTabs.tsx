import React from 'react';
import { NavLink } from 'react-router-dom';
import { Info, MapPin, Images, Send } from 'lucide-react';

interface AdminAttractionTabsProps {
  attractionId: string;
}

const TABS = [
  { key: 'informacion', label: 'Información', icon: Info },
  { key: 'ubicacion', label: 'Ubicación', icon: MapPin },
  { key: 'imagenes', label: 'Imágenes', icon: Images },
  { key: 'publicacion', label: 'Publicación', icon: Send },
];

/** Pestañas de secciones independientes para la edición de un atractivo. */
export const AdminAttractionTabs: React.FC<AdminAttractionTabsProps> = ({ attractionId }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto border-b border-slate-200">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.key}
            to={`/admin/atractivos/${attractionId}/${tab.key}`}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 -mb-px transition ${
                isActive
                  ? 'border-ayacucho-gold text-ayacucho-night'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`
            }
          >
            <Icon className="w-3.5 h-3.5" />
            {tab.label}
          </NavLink>
        );
      })}
    </div>
  );
};

export default AdminAttractionTabs;
