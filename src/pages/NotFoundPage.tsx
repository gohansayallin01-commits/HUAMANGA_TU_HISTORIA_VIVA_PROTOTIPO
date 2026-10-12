import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-200 shadow-soft space-y-4">
        <div className="w-16 h-16 bg-ayacucho-gold/20 rounded-2xl flex items-center justify-center mx-auto text-ayacucho-night">
          <Compass className="w-8 h-8 text-ayacucho-gold animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-ayacucho-night font-cultural">
            Ruta no encontrada (404)
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            El camino que buscas no existe en el mapa de Huamanga o ha sido reubicado.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full py-2.5 rounded-xl bg-ayacucho-night hover:bg-ayacucho-deep text-ayacucho-lightgold text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>
      </div>
    </div>
  );
};
