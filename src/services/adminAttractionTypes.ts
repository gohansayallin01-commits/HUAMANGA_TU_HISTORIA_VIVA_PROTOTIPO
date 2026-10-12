import { Attraction, PublicationStatus, ImageMeta } from '../types';

export interface AttractionInfoData {
  name: string;
  nameEn: string;
  category: string;
  subcategory?: string;
  district: string;
  province?: string;
  region?: string;
  address: string;
  reference?: string;
  shortDesc: string;
  shortDescEn?: string;
  fullDesc: string;
  fullDescEn?: string;
  history: string;
  historyEn?: string;
  hours: string;
  attentionDays?: string;
  price: number;
  phone: string;
  website?: string;
  recommendedDuration: string;
  tips?: string[];
  accessibility?: string;
  bestTimeToVisit?: string;
  safetyTips?: string;
  rating?: number;
  reviewsCount?: number;
  services?: string[];
  tags?: string[];
  accessibilityBadges?: string[];
}

export interface AttractionLocationData {
  coordinates: { lat: number; lng: number };
}

export interface AttractionImagesData {
  images: string[];
  imageMeta?: ImageMeta[];
  isReferentialImage?: boolean;
}

export interface AttractionPublicationData {
  publicationStatus: PublicationStatus;
  isFeatured?: boolean;
  isNearHuamanga?: boolean;
  isActive?: boolean;
}