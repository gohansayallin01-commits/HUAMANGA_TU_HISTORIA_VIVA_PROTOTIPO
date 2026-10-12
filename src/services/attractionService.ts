import { Attraction, AdminHistoryEntry, PublicationStatus } from '../types';
import { INITIAL_ATTRACTIONS, localReferentialImages } from '../data/attractions';

const ATTRACTIONS_KEY = 'huamanga_attractions';
const SCHEMA_KEY = 'huamanga_attractions_schema';
const HISTORY_KEY = 'huamanga_admin_history';
const SCHEMA_VERSION = 8;

const listeners = new Set<(items: Attraction[]) => void>();

const DEFAULT_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23082A4A"/><path d="M 50 350 L 200 180 L 320 280 L 450 140 L 580 350 Z" fill="%230D3B66"/><circle cx="300" cy="120" r="35" fill="%23F2D493"/><text x="300" y="320" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23FAF8F3" text-anchor="middle">HUAMANGA: TU HISTORIA VIVA</text></svg>';

function generateId(prefix = 'attr'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeAttraction(partial: Partial<Attraction>): Attraction {
  const coords = partial.coordinates || { lat: -13.1631, lng: -74.2236 };
  const images = Array.isArray(partial.images) && partial.images.length > 0 ? partial.images : [DEFAULT_IMAGE];
  const name = partial.name ?? 'Atractivo sin nombre';
  const imageMeta =
    partial.imageMeta && partial.imageMeta.length
      ? partial.imageMeta
      : images.map((url, index) => ({
          url,
          alt: `${name} - imagen ${index + 1}`,
          source: 'Unsplash',
          author: 'Autor por confirmar',
          license: 'Unsplash License',
          isReferential: true,
        }));

  return {
    id: partial.id ?? generateId(),
    slug: partial.slug ?? `atractivo-${Date.now()}`,
    name,
    nameEn: partial.nameEn ?? name,
    category: partial.category ?? 'historico',
    subcategory: partial.subcategory ?? '',
    shortDesc: partial.shortDesc ?? '',
    shortDescEn: partial.shortDescEn ?? partial.shortDesc ?? '',
    fullDesc: partial.fullDesc ?? '',
    fullDescEn: partial.fullDescEn ?? partial.fullDesc ?? '',
    history: partial.history ?? '',
    historyEn: partial.historyEn ?? partial.history ?? '',
    address: partial.address ?? 'Centro Histórico, Ayacucho',
    reference: partial.reference ?? '',
    district: partial.district ?? 'Ayacucho',
    province: partial.province ?? 'Huamanga',
    region: partial.region ?? 'Ayacucho',
    coordinates: {
      lat: typeof coords.lat === 'number' ? coords.lat : -13.1631,
      lng: typeof coords.lng === 'number' ? coords.lng : -74.2236,
    },
    hours: partial.hours ?? 'Horario referencial',
    attentionDays: partial.attentionDays ?? 'Lunes a domingo',
    price: typeof partial.price === 'number' ? partial.price : 0,
    currency: 'PEN',
    isFree: partial.isFree ?? (typeof partial.price === 'number' ? partial.price === 0 : true),
    phone: partial.phone ?? '+51 66 312345 (Referencial)',
    website: partial.website ?? '',
    rating: typeof partial.rating === 'number' ? partial.rating : 4.7,
    reviewsCount: typeof partial.reviewsCount === 'number' ? partial.reviewsCount : 0,
    services: partial.services ?? [],
    tips: partial.tips ?? [],
    accessibility: partial.accessibility ?? 'Acceso referencial.',
    accessibilityBadges: partial.accessibilityBadges ?? [],
    images,
    imageMeta,
    tags: partial.tags ?? [],
    recommendedDuration: partial.recommendedDuration ?? '1 hora',
    bestTimeToVisit: partial.bestTimeToVisit ?? '09:00 - 17:00 hrs',
    safetyTips: partial.safetyTips ?? 'Información referencial de demostración.',
    isFeatured: partial.isFeatured ?? false,
    isNearHuamanga: partial.isNearHuamanga ?? false,
    isActive: partial.isActive ?? true,
    publicationStatus: partial.publicationStatus ?? (partial.isActive === false ? 'desactivado' : 'publicado'),
    isReferentialImage: partial.isReferentialImage ?? true,
    createdAt: partial.createdAt ?? new Date().toISOString(),
    lastModified: partial.lastModified ?? new Date().toISOString(),
  };
}

function readRaw(): Attraction[] | null {
  try {
    const data = localStorage.getItem(ATTRACTIONS_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function loadFromStorage(): Attraction[] {
  const stored = readRaw();
  const schema = localStorage.getItem(SCHEMA_KEY);

  if (!stored) {
    const seeded = INITIAL_ATTRACTIONS.map(normalizeAttraction);
    localStorage.setItem(ATTRACTIONS_KEY, JSON.stringify(seeded));
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    return seeded;
  }

  const migrated = stored.map((item) => {
    const attraction = normalizeAttraction(item);
    if (attraction.images.some((img) => typeof img === 'string' && img.includes('images.unsplash.com'))) {
      const [primary, secondary] = localReferentialImages(attraction.slug);
      attraction.images = [primary, secondary];
      attraction.imageMeta = [
        {
          url: primary,
          alt: `${attraction.name} - imagen de portada (referencial)`,
          source: 'Ilustración referencial de demostración',
          author: 'Huamanga: Tu Historia Viva',
          license: 'Uso demostrativo académico',
          isReferential: true,
        },
        {
          url: secondary,
          alt: `${attraction.name} - imagen de galería (referencial)`,
          source: 'Ilustración referencial de demostración',
          author: 'Huamanga: Tu Historia Viva',
          license: 'Uso demostrativo académico',
          isReferential: true,
        },
      ];
      attraction.isReferentialImage = true;
    }
    return attraction;
  });

  if (schema !== String(SCHEMA_VERSION)) {
    localStorage.setItem(ATTRACTIONS_KEY, JSON.stringify(migrated));
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
  }
  return migrated;
}

function persist(items: Attraction[]): void {
  localStorage.setItem(ATTRACTIONS_KEY, JSON.stringify(items));
  notifyChange(items);
}

function notifyChange(items: Attraction[]): void {
  listeners.forEach((listener) => listener(items));
}

export const attractionService = {
  getAll(): Attraction[] {
    return loadFromStorage();
  },

  getPublished(): Attraction[] {
    return loadFromStorage().filter(
      (a) => a.isActive !== false && a.publicationStatus !== 'archivado' && a.publicationStatus !== 'desactivado'
    );
  },

  getById(id: string): Attraction | undefined {
    return loadFromStorage().find((a) => a.id === id);
  },

  getBySlug(slug: string): Attraction | undefined {
    return loadFromStorage().find((a) => a.slug === slug);
  },

  saveAll(items: Attraction[]): void {
    persist(items.map((a) => ({ ...a, lastModified: new Date().toISOString() })));
  },

  create(payload: Partial<Attraction>): Attraction {
    const created = normalizeAttraction({
      ...payload,
      id: payload.id ?? generateId(),
      slug: payload.slug ?? generateId('slug'),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
    const all = loadFromStorage();
    persist([created, ...all]);
    this.logHistory('Creó atractivo', created.name, '-', created.publicationStatus ?? 'publicado');
    return created;
  },

  update(id: string, payload: Partial<Attraction>): Attraction | undefined {
    const all = loadFromStorage();
    let updated: Attraction | undefined;
    const next = all.map((a) => {
      if (a.id !== id) return a;
      const previous = a.publicationStatus ?? '-';
      updated = normalizeAttraction({ ...a, ...payload, id: a.id, lastModified: new Date().toISOString() });
      this.logHistory('Editó atractivo', updated.name, previous, updated.publicationStatus ?? '-');
      return updated;
    });
    persist(next);
    return updated;
  },

  duplicate(id: string): Attraction | undefined {
    const original = this.getById(id);
    if (!original) return undefined;
    const copy = normalizeAttraction({
      ...original,
      id: generateId(),
      slug: `${original.slug}-copia-${Math.random().toString(36).slice(2, 6)}`,
      name: `${original.name} (copia)`,
      nameEn: `${original.nameEn} (copy)`,
      publicationStatus: 'borrador',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
    persist([copy, ...loadFromStorage()]);
    this.logHistory('Duplicó atractivo', original.name, original.publicationStatus ?? '-', 'borrador');
    return copy;
  },

  remove(id: string): void {
    const all = loadFromStorage();
    const target = all.find((a) => a.id === id);
    persist(all.filter((a) => a.id !== id));
    if (target) this.logHistory('Eliminó atractivo', target.name, target.publicationStatus ?? '-', '-');
  },

  setPublicationStatus(id: string, status: PublicationStatus): void {
    const next = loadFromStorage().map((a) => {
      if (a.id !== id) return a;
      const previous = a.publicationStatus ?? '-';
      const updated: Attraction = {
        ...a,
        publicationStatus: status,
        isActive: status === 'publicado' || status === 'pendiente' || status === 'borrador',
        lastModified: new Date().toISOString(),
      };
      this.logHistory(`Cambió estado a ${status}`, a.name, previous, status);
      return updated;
    });
    persist(next);
  },

  toggleActive(id: string): void {
    const target = this.getById(id);
    if (!target) return;
    const wasInactive = target.isActive === false;
    this.setPublicationStatus(id, wasInactive ? 'publicado' : 'desactivado');
  },

  findDuplicateCoordinates(
    coordinates: { lat: number; lng: number },
    excludeId?: string
  ): Attraction | undefined {
    if (!coordinates) return undefined;
    return loadFromStorage().find(
      (a) =>
        a.id !== excludeId &&
        Math.abs(a.coordinates.lat - coordinates.lat) < 1e-6 &&
        Math.abs(a.coordinates.lng - coordinates.lng) < 1e-6
    );
  },

  resetToDefaults(): Attraction[] {
    const defaults = INITIAL_ATTRACTIONS.map(normalizeAttraction);
    localStorage.setItem(ATTRACTIONS_KEY, JSON.stringify(defaults));
    localStorage.setItem(SCHEMA_KEY, String(SCHEMA_VERSION));
    notifyChange(defaults);
    return defaults;
  },

  getHistory(): AdminHistoryEntry[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  logHistory(
    action: string,
    attractionName: string,
    previousStatus: PublicationStatus | '-',
    newStatus: PublicationStatus | '-',
    user = 'Administrador demostrativo'
  ): void {
    const entry: AdminHistoryEntry = {
      id: generateId('hist'),
      date: new Date().toISOString(),
      action,
      attractionName,
      user,
      previousStatus,
      newStatus,
    };
    const next = [entry, ...this.getHistory()].slice(0, 100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('huamanga:history'));
  },

  clearHistory(): void {
    localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
    window.dispatchEvent(new CustomEvent('huamanga:history'));
  },

  subscribe(listener: (items: Attraction[]) => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  updateAttractionInfo(id: string, info: Partial<Attraction>): Attraction | undefined {
    const all = loadFromStorage();
    let updated: Attraction | undefined;
    const next = all.map((a) => {
      if (a.id !== id) return a;
      updated = normalizeAttraction({ ...a, ...info, id: a.id, lastModified: new Date().toISOString() });
      return updated;
    });
    persist(next);
    if (updated) this.logHistory('Actualizó información', updated.name, '-', updated.publicationStatus ?? '-');
    return updated;
  },

  updateAttractionLocation(id: string, loc: { coordinates: { lat: number; lng: number } }): Attraction | undefined {
    const all = loadFromStorage();
    let updated: Attraction | undefined;
    const next = all.map((a) => {
      if (a.id !== id) return a;
      updated = normalizeAttraction({ ...a, coordinates: loc.coordinates, id: a.id, lastModified: new Date().toISOString() });
      return updated;
    });
    persist(next);
    if (updated) this.logHistory('Actualizó ubicación', updated.name, '-', updated.publicationStatus ?? '-');
    return updated;
  },

  updateAttractionImages(id: string, img: { images: string[]; imageMeta?: any[]; isReferentialImage?: boolean }): Attraction | undefined {
    const all = loadFromStorage();
    let updated: Attraction | undefined;
    const next = all.map((a) => {
      if (a.id !== id) return a;
      updated = normalizeAttraction({ ...a, ...img, id: a.id, lastModified: new Date().toISOString() });
      return updated;
    });
    persist(next);
    if (updated) this.logHistory('Actualizó imágenes', updated.name, '-', updated.publicationStatus ?? '-');
    return updated;
  },

  updateAttractionPublication(id: string, pub: {
    publicationStatus: PublicationStatus;
    isFeatured?: boolean;
    isNearHuamanga?: boolean;
    isActive?: boolean;
  }): Attraction | undefined {
    const all = loadFromStorage();
    let updated: Attraction | undefined;
    const next = all.map((a) => {
      if (a.id !== id) return a;
      updated = normalizeAttraction({
        ...a,
        ...pub,
        isActive: pub.isActive ?? (pub.publicationStatus === 'publicado' || pub.publicationStatus === 'pendiente' || pub.publicationStatus === 'borrador'),
        id: a.id,
        lastModified: new Date().toISOString(),
      });
      return updated;
    });
    persist(next);
    if (updated) this.logHistory('Actualizó publicación', updated.name, '-', updated.publicationStatus ?? '-');
    return updated;
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === ATTRACTIONS_KEY) notifyChange(loadFromStorage());
  });
}
