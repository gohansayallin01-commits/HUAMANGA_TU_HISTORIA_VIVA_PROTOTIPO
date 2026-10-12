import React from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useAttractions } from '../../context/AttractionsContext';
import { AdminAttractionTabs } from './AdminAttractionTabs';
import { StatusBadge, AdminButton, EmptyState } from './AdminUI';

/** Devuelve el atractivo actual según el parámetro :id de la ruta. */
export function useAdminAttraction() {
  const { id } = useParams<{ id: string }>();
  const { attractions } = useAttractions();
  const attraction = attractions.find((a) => a.id === id);
  return { id, attraction };
}

export const AttractionEditLayout: React.FC = () => {
  const navigate = useNavigate();
  const { id, attraction } = useAdminAttraction();

  if (!id) return <Navigate to="/admin/atractivos" replace />;

  if (!attraction) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft">
        <EmptyState
          icon={<MapPin className="w-6 h-6" />}
          title="Atractivo no encontrado"
          description="Es posible que haya sido eliminado o que el enlace sea incorrecto."
          action={
            <AdminButton variant="primary" onClick={() => navigate('/admin/atractivos')}>
              Volver al listado
            </AdminButton>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin/atractivos')}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-ayacucho-deep mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a atractivos
        </button>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-bold text-ayacucho-night font-cultural">{attraction.name}</h1>
          {attraction.publicationStatus && <StatusBadge status={attraction.publicationStatus} />}
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {attraction.district} · {attraction.category} · Actualizado{' '}
          {attraction.lastModified ? new Date(attraction.lastModified).toLocaleString('es-PE') : '—'}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft">
        <div className="px-3 sm:px-4 pt-3">
          <AdminAttractionTabs attractionId={attraction.id} />
        </div>
        <div className="p-4 sm:p-5">
          <Outlet context={{ attraction }} />
        </div>
      </div>
    </div>
  );
};

export default AttractionEditLayout;
