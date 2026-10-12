import React, { useEffect, useState } from 'react';
import { MapPin, Save, CheckCircle2, AlertTriangle, LocateFixed, RotateCcw } from 'lucide-react';
import { useAdminAttraction } from '../../components/admin/AttractionEditLayout';
import { attractionService } from '../../services/attractionService';
import { AdminCard, AdminButton, AdminField, inputClass } from '../../components/admin/AdminUI';
import { CoordinatePickerMap } from '../../components/admin/CoordinatePickerMap';

const HUAMANGA_CENTER = { lat: -13.1588, lng: -74.2239 };

export const AttractionLocationPage: React.FC = () => {
  const { attraction } = useAdminAttraction();
  const [lat, setLat] = useState(attraction?.coordinates.lat ?? HUAMANGA_CENTER.lat);
  const [lng, setLng] = useState(attraction?.coordinates.lng ?? HUAMANGA_CENTER.lng);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!attraction) return;
    setLat(attraction.coordinates.lat);
    setLng(attraction.coordinates.lng);
  }, [attraction?.id]);

  if (!attraction) return null;

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (lat < -90 || lat > 90 || Number.isNaN(lat)) next.lat = 'Latitud fuera de rango (-90 a 90).';
    if (lng < -180 || lng > 180 || Number.isNaN(lng)) next.lng = 'Longitud fuera de rango (-180 a 180).';
    if (!next.lat && !next.lng) {
      const duplicate = attractionService.findDuplicateCoordinates({ lat, lng }, attraction.id);
      if (duplicate) next.coordinates = `Las coordenadas coinciden con "${duplicate.name}". Verifique que no sea un duplicado.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    attractionService.updateAttractionLocation(attraction.id, { coordinates: { lat, lng } });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-ayacucho-success text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Ubicación actualizada correctamente.
        </div>
      )}
      {(errors.lat || errors.lng || errors.coordinates) && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.lat || errors.lng || errors.coordinates}</span>
        </div>
      )}

      <AdminCard
        title="Mapa interactivo"
        description="Haga clic o arrastre el marcador para definir el punto exacto"
        icon={<MapPin className="w-4 h-4" />}
      >
        <CoordinatePickerMap lat={lat} lng={lng} onChange={(la, ln) => { setLat(la); setLng(ln); setErrors({}); }} height="h-72" />
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <AdminField label="Latitud" error={errors.lat}>
            <input
              type="number"
              step="0.000001"
              className={inputClass(!!errors.lat)}
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
            />
          </AdminField>
          <AdminField label="Longitud" error={errors.lng}>
            <input
              type="number"
              step="0.000001"
              className={inputClass(!!errors.lng)}
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
            />
          </AdminField>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <AdminButton
            type="button"
            variant="ghost"
            icon={<LocateFixed className="w-3.5 h-3.5" />}
            onClick={() => {
              setLat(HUAMANGA_CENTER.lat);
              setLng(HUAMANGA_CENTER.lng);
              setErrors({});
            }}
          >
            Centrar en Huamanga
          </AdminButton>
          <AdminButton
            type="button"
            variant="ghost"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              setLat(attraction.coordinates.lat);
              setLng(attraction.coordinates.lng);
              setErrors({});
            }}
          >
            Restaurar guardado
          </AdminButton>
        </div>
      </AdminCard>

      <div className="flex justify-end gap-2">
        <AdminButton type="submit" variant="primary" icon={<Save className="w-3.5 h-3.5" />}>
          Guardar ubicación
        </AdminButton>
      </div>
    </form>
  );
};

export default AttractionLocationPage;
