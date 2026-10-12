import { INITIAL_BUSINESS } from '../data/businesses';

const STORAGE_KEY = 'huamanga_affiliated_businesses';
const HISTORY_KEY = 'huamanga_business_requests';

export type BusinessReviewStatus = 'solicitud' | 'aprobado' | 'rechazado' | 'publicado' | 'suspendido';

export interface AffiliatedBusiness {
  id: string;
  name: string;
  category: string;
  district: string;
  address: string;
  phone: string;
  description: string;
  image: string;
  status: BusinessReviewStatus;
  isActive: boolean;
  createdAt: string;
  lastModified: string;
}

const STATUS_LABELS: Record<BusinessReviewStatus, string> = {
  solicitud: 'Solicitud',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  publicado: 'Publicado',
  suspendido: 'Suspendido',
};

export const businessStatusLabel = (status: BusinessReviewStatus): string => STATUS_LABELS[status];

function seed(): AffiliatedBusiness[] {
  const now = new Date().toISOString();
  return [
    {
      id: INITIAL_BUSINESS.id,
      name: INITIAL_BUSINESS.name,
      category: INITIAL_BUSINESS.category,
      district: 'Ayacucho',
      address: INITIAL_BUSINESS.address,
      phone: INITIAL_BUSINESS.phone,
      description: INITIAL_BUSINESS.description,
      image: INITIAL_BUSINESS.image,
      status: 'publicado',
      isActive: true,
      createdAt: now,
      lastModified: now,
    },
    {
      id: 'biz-demo-2',
      name: 'Taller de Retablos Don Silvestre',
      category: 'Artesanía',
      district: 'Ayacucho',
      address: 'Jr. 9 de Diciembre 338, Centro Histórico',
      phone: '+51 966 000222 (Referencial)',
      description: 'Taller familiar de retablos ayacuchanos con más de tres generaciones de maestros artesanos.',
      image: 'images/attractions/taller-retablos-don-silvestre.svg',
      status: 'solicitud',
      isActive: false,
      createdAt: now,
      lastModified: now,
    },
  ];
}

function readRaw(): AffiliatedBusiness[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persist(items: AffiliatedBusiness[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('huamanga:businesses'));
}

function logRequest(action: string, name: string): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const next = [
      { id: `breq-${Date.now()}`, date: new Date().toISOString(), action, name },
      ...(Array.isArray(list) ? list : []),
    ].slice(0, 100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // ignora errores de historial
  }
}

export const businessAdminService = {
  getAll(): AffiliatedBusiness[] {
    const stored = readRaw();
    if (stored) return stored;
    const seeded = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  },

  getPublished(): AffiliatedBusiness[] {
    return this.getAll().filter((b) => b.status === 'publicado' && b.isActive);
  },

  create(payload: Partial<AffiliatedBusiness>): AffiliatedBusiness {
    const now = new Date().toISOString();
    const created: AffiliatedBusiness = {
      id: payload.id ?? `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: payload.name ?? 'Nuevo negocio afiliado',
      category: payload.category ?? 'Servicios',
      district: payload.district ?? 'Ayacucho',
      address: payload.address ?? '',
      phone: payload.phone ?? '',
      description: payload.description ?? '',
      image: payload.image ?? 'images/attractions/plaza-mayor-huamanga.svg',
      status: payload.status ?? 'solicitud',
      isActive: payload.isActive ?? false,
      createdAt: now,
      lastModified: now,
    };
    persist([created, ...this.getAll()]);
    logRequest('Registró negocio', created.name);
    return created;
  },

  update(id: string, patch: Partial<AffiliatedBusiness>): void {
    const next = this.getAll().map((b) =>
      b.id === id ? { ...b, ...patch, id: b.id, lastModified: new Date().toISOString() } : b
    );
    persist(next);
    const target = next.find((b) => b.id === id);
    if (target) logRequest('Editó negocio', target.name);
  },

  setStatus(id: string, status: BusinessReviewStatus): void {
    const next = this.getAll().map((b) => {
      if (b.id !== id) return b;
      const isActive = status === 'publicado' || status === 'aprobado';
      return { ...b, status, isActive, lastModified: new Date().toISOString() };
    });
    persist(next);
    const target = next.find((b) => b.id === id);
    if (target) logRequest(`Cambió estado a ${STATUS_LABELS[status]}`, target.name);
  },

  toggleActive(id: string): void {
    const next = this.getAll().map((b) =>
      b.id === id ? { ...b, isActive: !b.isActive, lastModified: new Date().toISOString() } : b
    );
    persist(next);
  },

  remove(id: string): void {
    const target = this.getAll().find((b) => b.id === id);
    persist(this.getAll().filter((b) => b.id !== id));
    if (target) logRequest('Eliminó negocio', target.name);
  },

  reset(): void {
    const seeded = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    window.dispatchEvent(new CustomEvent('huamanga:businesses'));
  },
};
