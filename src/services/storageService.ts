import { Attraction, BusinessProfile, Booking, UserProfile, NotificationItem } from '../types';
import { INITIAL_ATTRACTIONS } from '../data/attractions';
import { INITIAL_BUSINESS } from '../data/businesses';

const KEYS = {
  ATTRACTIONS: 'huamanga_attractions',
  FAVORITES: 'huamanga_favorites',
  ITINERARY: 'huamanga_itinerary',
  BUSINESS: 'huamanga_business',
  BOOKINGS: 'huamanga_bookings',
  ROUTE_PROGRESS: 'huamanga_route_progress',
  USER_PROFILE: 'huamanga_profile',
  NOTIFICATIONS: 'huamanga_notifications',
  EXHIBITION_MODE: 'huamanga_exhibition_mode',
  TOUR_COMPLETED: 'huamanga_guided_tour_done',
};

export const storageService = {
  // Atractivos
  getAttractions(): Attraction[] {
    const data = localStorage.getItem(KEYS.ATTRACTIONS);
    if (!data) {
      localStorage.setItem(KEYS.ATTRACTIONS, JSON.stringify(INITIAL_ATTRACTIONS));
      return INITIAL_ATTRACTIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ATTRACTIONS;
    }
  },

  saveAttractions(attractions: Attraction[]) {
    localStorage.setItem(KEYS.ATTRACTIONS, JSON.stringify(attractions));
  },

  resetAttractions(): Attraction[] {
    localStorage.setItem(KEYS.ATTRACTIONS, JSON.stringify(INITIAL_ATTRACTIONS));
    return INITIAL_ATTRACTIONS;
  },

  // Favoritos
  getFavorites(): string[] {
    const data = localStorage.getItem(KEYS.FAVORITES);
    if (!data) return ['attr-1', 'attr-2', 'attr-6']; // Iniciales atractivos para mejor experiencia demo
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  toggleFavorite(id: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(id);
    let isAdded = false;
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(id);
      isAdded = true;
    }
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    return isAdded;
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  // Itinerario Personalizado (Lista de IDs ordenados)
  getItinerary(): string[] {
    const data = localStorage.getItem(KEYS.ITINERARY);
    if (!data) return ['attr-1', 'attr-2', 'attr-15'];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveItinerary(ids: string[]) {
    localStorage.setItem(KEYS.ITINERARY, JSON.stringify(ids));
  },

  addToItinerary(id: string) {
    const current = this.getItinerary();
    if (!current.includes(id)) {
      current.push(id);
      this.saveItinerary(current);
    }
  },

  removeFromItinerary(id: string) {
    const current = this.getItinerary().filter(item => item !== id);
    this.saveItinerary(current);
  },

  // Progreso de Rutas (Stop IDs marcados como visitados)
  getRouteProgress(): Record<string, boolean> {
    const data = localStorage.getItem(KEYS.ROUTE_PROGRESS);
    if (!data) return { 'stop-1-1': true };
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  },

  toggleStopVisited(stopId: string): boolean {
    const current = this.getRouteProgress();
    current[stopId] = !current[stopId];
    localStorage.setItem(KEYS.ROUTE_PROGRESS, JSON.stringify(current));
    return current[stopId];
  },

  // Perfil del Negocio
  getBusinessProfile(): BusinessProfile {
    const data = localStorage.getItem(KEYS.BUSINESS);
    if (!data) {
      localStorage.setItem(KEYS.BUSINESS, JSON.stringify(INITIAL_BUSINESS));
      return INITIAL_BUSINESS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BUSINESS;
    }
  },

  saveBusinessProfile(profile: BusinessProfile) {
    localStorage.setItem(KEYS.BUSINESS, JSON.stringify(profile));
  },

  // Reservas
  getBookings(): Booking[] {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    if (!data) {
      const sampleBooking: Booking = {
        id: 'book-sample-1',
        code: 'HMA-2026-8942',
        activityName: 'Tour Guiado: Ruta de la Independencia',
        date: '2026-10-15',
        timeSlot: '08:30 hrs',
        visitorsCount: 2,
        customerName: 'Profesor Evaluador',
        customerEmail: 'evaluador@lapontificia.edu.pe',
        customerPhone: '+51 966 000111',
        totalPrice: 90,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([sampleBooking]));
      return [sampleBooking];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveBooking(booking: Booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  // Perfil de Usuario
  getUserProfile(): UserProfile {
    const data = localStorage.getItem(KEYS.USER_PROFILE);
    if (!data) {
      return {
        name: 'Viajero Explorador',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        country: 'Perú',
        language: 'es',
        preferences: ['Historia', 'Gastronomía', 'Artesanía']
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return {
        name: 'Viajero Explorador',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        country: 'Perú',
        language: 'es',
        preferences: ['Historia', 'Gastronomía', 'Artesanía']
      };
    }
  },

  saveUserProfile(profile: UserProfile) {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Notificaciones
  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    if (!data) {
      const initials: NotificationItem[] = [
        {
          id: 'notif-1',
          title: '¡Bienvenido a Huamanga!',
          message: 'Explora la Plaza Mayor y disfruta el tradicional helado muyuchi bajo los portales.',
          time: 'Hace 5 min',
          read: false,
          type: 'info'
        },
        {
          id: 'notif-2',
          title: 'Próxima festividad',
          message: 'La Semana Santa de Ayacucho reúne a miles de devotos y viajeros de todo el mundo.',
          time: 'Hace 1 hora',
          read: false,
          type: 'event'
        },
        {
          id: 'notif-3',
          title: 'Ruta sugerida activa',
          message: 'La Ruta de la Independencia está lista para ser explorada.',
          time: 'Ayer',
          read: true,
          type: 'route'
        }
      ];
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(initials));
      return initials;
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  markNotificationsRead() {
    const notifications = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Restaurar todo a estado inicial prístino (Modo Exposición)
  resetAllToExhibitionState() {
    localStorage.setItem(KEYS.ATTRACTIONS, JSON.stringify(INITIAL_ATTRACTIONS));
    localStorage.setItem(KEYS.BUSINESS, JSON.stringify(INITIAL_BUSINESS));
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(['attr-1', 'attr-2', 'attr-6']));
    localStorage.setItem(KEYS.ITINERARY, JSON.stringify(['attr-1', 'attr-2', 'attr-15']));
    localStorage.setItem(KEYS.ROUTE_PROGRESS, JSON.stringify({ 'stop-1-1': true }));
    localStorage.setItem(KEYS.EXHIBITION_MODE, 'true');
    window.location.reload();
  }
};
