import React, { useState } from 'react';
import { Settings, Building2, RotateCcw, Download, Trash2, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { attractionService } from '../../services/attractionService';
import { businessAdminService } from '../../services/businessAdminService';
import { storageService } from '../../services/storageService';
import { restoreOfficialContent, OFFICIAL_CONTENT_VERSION, OFFICIAL_UPDATED_AT } from '../../services/officialContent';
import { AdminPageHeader, AdminCard, AdminButton, AdminField, inputClass } from '../../components/admin/AdminUI';

export const SettingsPage: React.FC = () => {
  const [info, setInfo] = useState({
    name: 'Municipalidad Provincial de Huamanga',
    address: 'Plaza Mayor s/n, Ayacucho, Perú',
    phone: '+51 66 312345',
    email: 'turismo@huamanga.gob.pe',
  });
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'warn'; text: string } | null>(null);
  const [restoring, setRestoring] = useState(false);

  const flash = (type: 'ok' | 'warn', text: string) => {
    setFeedback({ type, text });
    window.setTimeout(() => setFeedback(null), 3000);
  };

  const handleRestoreOfficial = async () => {
    const confirmed = window.confirm(
      'Se restaurará el contenido oficial de la exposición.\n\n' +
        '· Se eliminarán las modificaciones locales realizadas en este dispositivo.\n' +
        '· Se eliminarán las imágenes subidas localmente (IndexedDB).\n' +
        '· Se conservarán los favoritos del visitante.\n\n' +
        '¿Desea continuar?'
    );
    if (!confirmed) return;
    setRestoring(true);
    try {
      await restoreOfficialContent();
      flash('ok', 'Contenido oficial de la exposición restaurado correctamente.');
    } catch {
      flash('warn', 'No se pudo restaurar por completo el contenido oficial.');
    } finally {
      setRestoring(false);
    }
  };

  const exportData = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      attractions: attractionService.getAll(),
      businesses: businessAdminService.getAll(),
      history: attractionService.getHistory(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `huamanga-datos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash('ok', 'Respaldo JSON descargado.');
  };

  return (
    <div>
      <AdminPageHeader
        title="Configuración"
        subtitle="Datos institucionales y mantenimiento del prototipo"
        icon={<Settings className="w-5 h-5" />}
      />

      {feedback && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold mb-4 animate-fade-in ${
            feedback.type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-ayacucho-success' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {feedback.type === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {feedback.text}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <AdminCard title="Datos de la municipalidad" icon={<Building2 className="w-4 h-4" />}>
          <div className="space-y-3">
            <AdminField label="Nombre de la institución">
              <input className={inputClass()} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
            </AdminField>
            <AdminField label="Dirección">
              <input className={inputClass()} value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} />
            </AdminField>
            <AdminField label="Teléfono">
              <input className={inputClass()} value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
            </AdminField>
            <AdminField label="Correo de contacto">
              <input className={inputClass()} value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
            </AdminField>
            <div className="flex justify-end">
              <AdminButton variant="primary" onClick={() => flash('ok', 'Datos institucionales guardados (solo para la demostración).')}>
                Guardar
              </AdminButton>
            </div>
          </div>
        </AdminCard>

        <div className="space-y-4">
          <AdminCard title="Respaldo de información" icon={<Download className="w-4 h-4" />}>
            <p className="text-[11px] text-slate-500 mb-3">
              Descargue un archivo JSON con los atractivos, negocios e historial registrados en este dispositivo.
            </p>
            <AdminButton variant="secondary" icon={<Download className="w-3.5 h-3.5" />} onClick={exportData}>
              Exportar respaldo JSON
            </AdminButton>
          </AdminCard>

          <AdminCard title="Mantenimiento del prototipo" icon={<RotateCcw className="w-4 h-4" />}>
            <p className="text-[11px] text-slate-500 mb-3">
              Restaure los datos de demostración originales. Los cambios realizados se perderán.
            </p>
            <div className="flex flex-wrap gap-2">
              <AdminButton
                variant="secondary"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => {
                  attractionService.resetToDefaults();
                  businessAdminService.reset();
                  flash('ok', 'Atractivos y negocios restaurados a los datos de demostración.');
                }}
              >
                Restaurar datos de demostración
              </AdminButton>
              <AdminButton
                variant="danger"
                icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  attractionService.clearHistory();
                  flash('warn', 'Historial administrativo eliminado.');
                }}
              >
                Limpiar historial
              </AdminButton>
            </div>
          </AdminCard>

          <AdminCard title="Contenido oficial de la exposición" icon={<ShieldCheck className="w-4 h-4" />}>
            <p className="text-[11px] text-slate-500 mb-2">
              Restaura el contenido oficial distribuido (fotografías y fichas de la exposición) eliminando
              únicamente las modificaciones locales de este dispositivo. No elimina los favoritos del visitante.
            </p>
            <p className="text-[10px] text-slate-400 mb-3">
              Versión de contenido oficial: {OFFICIAL_CONTENT_VERSION}
              {OFFICIAL_UPDATED_AT ? ` · Actualizado: ${OFFICIAL_UPDATED_AT.slice(0, 10)}` : ''}
            </p>
            <AdminButton
              variant="primary"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              onClick={handleRestoreOfficial}
              disabled={restoring}
            >
              {restoring ? 'Restaurando…' : 'Restaurar contenido oficial de la exposición'}
            </AdminButton>
            <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-100 pt-2">
              Los cambios realizados en esta demostración se almacenan localmente. En la versión comercial serán
              sincronizados mediante un servidor central para todos los visitantes.
            </p>
          </AdminCard>

          <AdminCard title="Modo exposición" icon={<AlertTriangle className="w-4 h-4" />}>
            <p className="text-[11px] text-slate-500 mb-3">
              Restablece toda la experiencia pública (favoritos, itinerario, negocio) a su estado inicial. La página se
              recargará.
            </p>
            <AdminButton
              variant="danger"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => storageService.resetAllToExhibitionState()}
            >
              Reiniciar toda la demostración
            </AdminButton>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
