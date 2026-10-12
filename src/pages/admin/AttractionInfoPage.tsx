import React, { useEffect, useState } from 'react';
import { Info, Save, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { useAdminAttraction } from '../../components/admin/AttractionEditLayout';
import { attractionService } from '../../services/attractionService';
import { AdminCard, AdminButton, AdminField, inputClass } from '../../components/admin/AdminUI';
import { AttractionInfoData } from '../../services/adminAttractionTypes';
import { Attraction, CategoryType } from '../../types';

const CATEGORY_OPTIONS: CategoryType[] = [
  'historico',
  'iglesia',
  'museo',
  'naturaleza',
  'gastronomia',
  'hospedaje',
  'artesania',
  'transporte',
  'evento',
  'tour',
];

function toForm(attraction: ReturnType<typeof useAdminAttraction>['attraction']): AttractionInfoData {
  return {
    name: attraction?.name ?? '',
    nameEn: attraction?.nameEn ?? '',
    category: attraction?.category ?? 'historico',
    subcategory: attraction?.subcategory ?? '',
    district: attraction?.district ?? '',
    province: attraction?.province ?? '',
    region: attraction?.region ?? '',
    address: attraction?.address ?? '',
    reference: attraction?.reference ?? '',
    shortDesc: attraction?.shortDesc ?? '',
    shortDescEn: attraction?.shortDescEn ?? '',
    fullDesc: attraction?.fullDesc ?? '',
    fullDescEn: attraction?.fullDescEn ?? '',
    history: attraction?.history ?? '',
    historyEn: attraction?.historyEn ?? '',
    hours: attraction?.hours ?? '',
    attentionDays: attraction?.attentionDays ?? '',
    price: attraction?.price ?? 0,
    phone: attraction?.phone ?? '',
    website: attraction?.website ?? '',
    recommendedDuration: attraction?.recommendedDuration ?? '',
    tips: attraction?.tips ?? [],
    accessibility: attraction?.accessibility ?? '',
    bestTimeToVisit: attraction?.bestTimeToVisit ?? '',
    safetyTips: attraction?.safetyTips ?? '',
    rating: attraction?.rating ?? 4.7,
    reviewsCount: attraction?.reviewsCount ?? 0,
  };
}

export const AttractionInfoPage: React.FC = () => {
  const { attraction } = useAdminAttraction();
  const [form, setForm] = useState<AttractionInfoData>(() => toForm(attraction));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(toForm(attraction));
    setErrors({});
  }, [attraction?.id]);

  if (!attraction) return null;

  const set = <K extends keyof AttractionInfoData>(key: K, value: AttractionInfoData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio.';
    if (!form.shortDesc.trim()) next.shortDesc = 'La descripción breve es obligatoria.';
    if (!form.district.trim()) next.district = 'El distrito es obligatorio.';
    if (form.price < 0 || Number.isNaN(form.price)) next.price = 'El precio no puede ser negativo.';
    if (form.website && !/^https?:\/\/.+/i.test(form.website)) next.website = 'Ingrese una URL válida (http/https).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    attractionService.updateAttractionInfo(attraction.id, form as unknown as Partial<Attraction>);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const errorsCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-ayacucho-success text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Información guardada correctamente.
        </div>
      )}
      {errorsCount > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4" />
          Revise {errorsCount} campo(s) obligatorio(s) o con formato inválido.
        </div>
      )}

      <AdminCard title="Identificación" icon={<Info className="w-4 h-4" />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <AdminField label="Nombre (ES)" required error={errors.name}>
            <input className={inputClass(!!errors.name)} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </AdminField>
          <AdminField label="Nombre (EN)">
            <input className={inputClass()} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
          </AdminField>
          <AdminField label="Categoría">
            <select className={inputClass()} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Subcategoría">
            <input
              className={inputClass()}
              value={form.subcategory ?? ''}
              onChange={(e) => set('subcategory', e.target.value)}
            />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard title="Descripciones" icon={<Info className="w-4 h-4" />}>
        <div className="space-y-3">
          <AdminField label="Descripción breve (ES)" required error={errors.shortDesc}>
            <textarea
              rows={2}
              className={inputClass(!!errors.shortDesc)}
              value={form.shortDesc}
              onChange={(e) => set('shortDesc', e.target.value)}
            />
          </AdminField>
          <AdminField label="Descripción breve (EN)">
            <textarea
              rows={2}
              className={inputClass()}
              value={form.shortDescEn ?? ''}
              onChange={(e) => set('shortDescEn', e.target.value)}
            />
          </AdminField>
          <AdminField label="Descripción completa (ES)">
            <textarea
              rows={4}
              className={inputClass()}
              value={form.fullDesc}
              onChange={(e) => set('fullDesc', e.target.value)}
            />
          </AdminField>
          <AdminField label="Descripción completa (EN)">
            <textarea
              rows={4}
              className={inputClass()}
              value={form.fullDescEn ?? ''}
              onChange={(e) => set('fullDescEn', e.target.value)}
            />
          </AdminField>
          <AdminField label="Historia / contexto (ES)">
            <textarea rows={3} className={inputClass()} value={form.history} onChange={(e) => set('history', e.target.value)} />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard title="Ubicación administrativa y contacto" icon={<Info className="w-4 h-4" />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <AdminField label="Distrito" required error={errors.district}>
            <input
              className={inputClass(!!errors.district)}
              value={form.district}
              onChange={(e) => set('district', e.target.value)}
            />
          </AdminField>
          <AdminField label="Provincia">
            <input className={inputClass()} value={form.province ?? ''} onChange={(e) => set('province', e.target.value)} />
          </AdminField>
          <AdminField label="Región">
            <input className={inputClass()} value={form.region ?? ''} onChange={(e) => set('region', e.target.value)} />
          </AdminField>
          <AdminField label="Dirección" className="sm:col-span-1">
            <input className={inputClass()} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </AdminField>
          <AdminField label="Referencia de acceso" className="sm:col-span-2">
            <input className={inputClass()} value={form.reference ?? ''} onChange={(e) => set('reference', e.target.value)} />
          </AdminField>
          <AdminField label="Teléfono (referencial)">
            <input className={inputClass()} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </AdminField>
          <AdminField label="Sitio web" error={errors.website}>
            <input className={inputClass(!!errors.website)} value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} />
          </AdminField>
        </div>
      </AdminCard>

      <AdminCard title="Visita, horarios y tarifas" icon={<Info className="w-4 h-4" />}>
        <div className="grid sm:grid-cols-2 gap-3">
          <AdminField label="Horario" hint="Ej.: 09:00 - 17:00 hrs">
            <input className={inputClass()} value={form.hours} onChange={(e) => set('hours', e.target.value)} />
          </AdminField>
          <AdminField label="Días de atención">
            <input
              className={inputClass()}
              value={form.attentionDays ?? ''}
              onChange={(e) => set('attentionDays', e.target.value)}
            />
          </AdminField>
          <AdminField label="Precio (PEN)" hint="0 = ingreso gratuito" error={errors.price}>
            <input
              type="number"
              min={0}
              step="0.5"
              className={inputClass(!!errors.price)}
              value={form.price}
              onChange={(e) => set('price', Number(e.target.value))}
            />
          </AdminField>
          <AdminField label="Duración recomendada">
            <input
              className={inputClass()}
              value={form.recommendedDuration}
              onChange={(e) => set('recommendedDuration', e.target.value)}
            />
          </AdminField>
          <AdminField label="Mejor momento para visitar">
            <input
              className={inputClass()}
              value={form.bestTimeToVisit ?? ''}
              onChange={(e) => set('bestTimeToVisit', e.target.value)}
            />
          </AdminField>
          <AdminField label="Accesibilidad">
            <input
              className={inputClass()}
              value={form.accessibility ?? ''}
              onChange={(e) => set('accessibility', e.target.value)}
            />
          </AdminField>
        </div>
      </AdminCard>

      <div className="flex justify-end gap-2 sticky bottom-0 py-3 bg-ayacucho-bg/80 backdrop-blur">
        <AdminButton
          type="button"
          variant="secondary"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={() => {
            setForm(toForm(attraction));
            setErrors({});
          }}
        >
          Descartar cambios
        </AdminButton>
        <AdminButton type="submit" variant="primary" icon={<Save className="w-3.5 h-3.5" />}>
          Guardar información
        </AdminButton>
      </div>
    </form>
  );
};

export default AttractionInfoPage;
