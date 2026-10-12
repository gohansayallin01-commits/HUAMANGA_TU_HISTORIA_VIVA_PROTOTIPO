import React, { useEffect, useState } from 'react';
import {
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  Archive,
  Star,
  MapPin,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAdminAttraction } from '../../components/admin/AttractionEditLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { attractionService } from '../../services/attractionService';
import { PublicationStatus } from '../../types';
import { AdminCard, AdminButton, StatusBadge, STATUS_LABELS } from '../../components/admin/AdminUI';
import { StoredAttractionImage } from '../../components/common/StoredAttractionImage';

const FLOW: { status: PublicationStatus; label: string; icon: React.ReactNode; hint: string }[] = [
  { status: 'borrador', label: 'Borrador', icon: <Send className="w-3.5 h-3.5" />, hint: 'En preparación por el editor.' },
  { status: 'pendiente', label: 'Pendiente de revisión', icon: <AlertTriangle className="w-3.5 h-3.5" />, hint: 'Listo para que el municipio lo revise.' },
  { status: 'publicado', label: 'Publicado', icon: <Eye className="w-3.5 h-3.5" />, hint: 'Visible para los visitantes.' },
  { status: 'desactivado', label: 'Desactivado', icon: <EyeOff className="w-3.5 h-3.5" />, hint: 'Oculto temporalmente.' },
  { status: 'archivado', label: 'Archivado', icon: <Archive className="w-3.5 h-3.5" />, hint: 'Retirado del flujo activo.' },
];

export const AttractionPublicationPage: React.FC = () => {
  const { attraction } = useAdminAttraction();
  const { role } = useAdminAuth();
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNearHuamanga, setIsNearHuamanga] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!attraction) return;
    setIsFeatured(!!attraction.isFeatured);
    setIsNearHuamanga(!!attraction.isNearHuamanga);
  }, [attraction?.id]);

  if (!attraction) return null;

  const isEditor = role === 'editor';
  const canPublish = role === 'superadmin' || role === 'municipal';
  const currentStatus = attraction.publicationStatus ?? 'borrador';

  const apply = (status: PublicationStatus, extras: { isFeatured?: boolean; isNearHuamanga?: boolean } = {}) => {
    attractionService.updateAttractionPublication(attraction.id, {
      publicationStatus: status,
      isFeatured: extras.isFeatured ?? isFeatured,
      isNearHuamanga: extras.isNearHuamanga ?? isNearHuamanga,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const toggleFeatured = () => {
    const next = !isFeatured;
    setIsFeatured(next);
    if (canPublish) apply(currentStatus, { isFeatured: next });
  };

  const toggleNear = () => {
    const next = !isNearHuamanga;
    setIsNearHuamanga(next);
    if (canPublish) apply(currentStatus, { isNearHuamanga: next });
  };

  return (
    <div className="space-y-4">
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-ayacucho-success text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Estado de publicación actualizado.
        </div>
      )}

      <AdminCard
        title="Estado editorial"
        description="Flujo de publicación del atractivo turístico"
        icon={<ShieldCheck className="w-4 h-4" />}
        actions={<StatusBadge status={currentStatus} />}
      >
        {isEditor && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] mb-4">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            Como editor puede preparar la ficha y enviarla a revisión, pero la publicación final corresponde al
            municipio.
          </div>
        )}
        <div className="space-y-2">
          {FLOW.map((step) => {
            const isCurrent = currentStatus === step.status;
            const blockEditor = isEditor && (step.status === 'publicado' || step.status === 'desactivado' || step.status === 'archivado');
            return (
              <button
                key={step.status}
                disabled={blockEditor || step.status === currentStatus}
                onClick={() => apply(step.status)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                  isCurrent
                    ? 'border-ayacucho-gold bg-ayacucho-gold/10'
                    : 'border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCurrent ? 'bg-ayacucho-gold text-ayacucho-night' : 'bg-slate-100 text-slate-500'}`}>
                  {step.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-700">
                    {step.label} {isCurrent && '· actual'}
                  </span>
                  <span className="block text-[10px] text-slate-400">{step.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </AdminCard>

      <AdminCard title="Destacados en el portal" icon={<Star className="w-4 h-4" />}>
        <div className="space-y-2">
          <ToggleRow
            label="Destacar en la portada"
            description="Aparecerá primero en las recomendaciones del portal turístico."
            checked={isFeatured}
            onChange={toggleFeatured}
            disabled={!canPublish}
          />
          <ToggleRow
            label="Cercano a Huamanga"
            description="Se mostrará en la sección de lugares próximos al centro histórico."
            checked={isNearHuamanga}
            onChange={toggleNear}
            disabled={!canPublish}
          />
        </div>
        {!canPublish && (
          <p className="text-[10px] text-slate-400 mt-3">Solo el administrador municipal o superior puede modificar destacados.</p>
        )}
      </AdminCard>

      <AdminCard title="Vista previa" description="Cómo se verá la tarjeta en el portal público" icon={<Eye className="w-4 h-4" />}>
        <div className="max-w-sm rounded-2xl overflow-hidden border border-slate-200 shadow-soft bg-white">
          <StoredAttractionImage src={attraction.images[0]} alt={attraction.name} className="w-full h-40 object-cover" category={attraction.category} />
          <div className="p-3.5">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={currentStatus} />
              {isFeatured && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-ayacucho-gold">
                  <Star className="w-3 h-3 fill-current" /> Destacado
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-ayacucho-night">{attraction.name}</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{attraction.shortDesc || 'Sin descripción breve.'}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2">
              <MapPin className="w-3 h-3" />
              {attraction.district}
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
};

const ToggleRow: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ label, description, checked, onChange, disabled }) => (
  <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 ${disabled ? 'opacity-60' : ''}`}>
    <div className="min-w-0">
      <div className="text-xs font-bold text-slate-700">{label}</div>
      <div className="text-[10px] text-slate-400">{description}</div>
    </div>
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition shrink-0 ${checked ? 'bg-ayacucho-success' : 'bg-slate-300'} disabled:cursor-not-allowed`}
      aria-pressed={checked}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  </div>
);

export default AttractionPublicationPage;
