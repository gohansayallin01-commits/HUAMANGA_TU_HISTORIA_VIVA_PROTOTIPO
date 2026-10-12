export type CategoryType = 
  | 'historico' 
  | 'iglesia' 
  | 'museo' 
  | 'naturaleza' 
  | 'gastronomia' 
  | 'hospedaje' 
  | 'artesania' 
  | 'transporte' 
  | 'evento' 
  | 'tour';

/** Estado del flujo de publicación administrativa. */
export type PublicationStatus =
  | 'borrador'
  | 'pendiente'
  | 'publicado'
  | 'desactivado'
  | 'archivado';

/** Metadatos de una fotografía del atractivo. */
export interface ImageMeta {
  url: string;
  alt: string;
  source?: string;
  author?: string;
  license?: string;
  /** true = fotografía meramente ilustrativa, no verificada como oficial del lugar. */
  isReferential?: boolean;
}

export interface Attraction {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: CategoryType;
  subcategory?: string;
  shortDesc: string;
  shortDescEn: string;
  fullDesc: string;
  fullDescEn: string;
  history: string;
  historyEn: string;
  address: string;
  reference?: string;
  district: string;
  province?: string;
  region?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string;
  attentionDays?: string;
  price: number; // 0 = gratis
  currency: 'PEN';
  isFree?: boolean;
  phone: string;
  website?: string;
  rating: number;
  reviewsCount: number;
  services: string[];
  tips: string[];
  accessibility: string;
  accessibilityBadges: string[];
  images: string[];
  /** Metadatos por imagen (alt, fuente, autor, licencia, referencial). */
  imageMeta?: ImageMeta[];
  tags: string[];
  recommendedDuration: string;
  bestTimeToVisit: string;
  safetyTips: string;
  isFeatured?: boolean;
  isNearHuamanga?: boolean;
  isActive?: boolean;
  /** Estado dentro del flujo editorial (borrador → pendiente → publicado…). */
  publicationStatus?: PublicationStatus;
  /** Marca la portada como imagen referencial no verificada. */
  isReferentialImage?: boolean;
  createdAt?: string;
  lastModified?: string;
}

export interface AdminHistoryEntry {
  id: string;
  date: string;
  action: string;
  attractionName: string;
  user: string;
  previousStatus: PublicationStatus | '-';
  newStatus: PublicationStatus | '-';
}

export type AdminRole = 'superadmin' | 'municipal' | 'editor';

export interface AdminRoleInfo {
  id: AdminRole;
  name: string;
  description: string;
  permissions: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  nameEn: string;
  iconName: string;
  color: string;
  bgLight: string;
  description: string;
}

export interface RouteStop {
  id: string;
  name: string;
  attractionId?: string;
  order: number;
  estimatedTime: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RouteItem {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  duration: 'half_day' | 'one_day' | 'two_days' | 'three_days';
  durationLabel: string;
  durationLabelEn: string;
  stopsCount: number;
  distanceKm: number;
  difficulty: 'Fácil' | 'Moderado' | 'Exigente';
  difficultyEn: 'Easy' | 'Moderate' | 'Challenging';
  refPrice: number;
  description: string;
  descriptionEn: string;
  image: string;
  stops: RouteStop[];
  schedule: { time: string; activity: string }[];
  recommendations: string[];
}

export interface EventItem {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  descriptionEn: string;
  isFree: boolean;
  price?: number;
  image: string;
  isFeatured: boolean;
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  image: string;
  activePromotion: {
    title: string;
    discount: string;
    code: string;
    validUntil: string;
  };
  stats: {
    views30Days: number;
    inquiries: number;
    bookings: number;
    visitorOrigins: { country: string; percentage: number }[];
  };
}

export interface Booking {
  id: string;
  code: string;
  activityName: string;
  date: string;
  timeSlot: string;
  visitorsCount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface UserProfile {
  name: string;
  avatar: string;
  country: string;
  language: 'es' | 'en' | 'fr' | 'pt';
  preferences: string[];
}

export interface MonetizationPlan {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  frequency: string;
  frequencyEn: string;
  description: string;
  descriptionEn: string;
  features: string[];
  badge?: string;
  isPopular?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'event' | 'favorite' | 'route';
}
