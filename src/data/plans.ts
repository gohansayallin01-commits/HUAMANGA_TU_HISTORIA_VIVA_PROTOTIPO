import { MonetizationPlan } from '../types';

export const MONETIZATION_PLANS: MonetizationPlan[] = [
  {
    id: 'plan-viajero',
    name: 'Plan Gratuito para Viajeros',
    nameEn: 'Free Traveler Plan',
    price: 'S/ 0',
    frequency: 'Gratis para siempre',
    frequencyEn: 'Free forever',
    description: 'Acceso total a la riqueza histórica y cultural de Huamanga sin costo para el visitante.',
    descriptionEn: 'Full access to Huamanga’s cultural and historic wealth at zero cost for travelers.',
    features: [
      'Exploración de más de 18 atractivos turísticos',
      'Mapa interactivo con filtros por categoría',
      'Acceso a las 6 rutas turísticas recomendadas',
      'Audioguía interactiva en español e inglés',
      'Guardado de favoritos e itinerario en dispositivo',
      'Asistente virtual Hana para consultas locales'
    ],
    badge: 'Para Viajeros',
    isPopular: false
  },
  {
    id: 'plan-negocios',
    name: 'Plan para Negocios Locales',
    nameEn: 'Local Business Plan',
    price: 'S/ 29',
    frequency: 'mensual (referencial)',
    frequencyEn: 'per month (referential)',
    description: 'Para restaurantes, casonas, hospedajes y talleres que buscan visibilidad turística calificada.',
    descriptionEn: 'For restaurants, hotels, and craft workshops seeking qualified tourist visibility.',
    features: [
      'Perfil comercial verificado en el catálogo',
      'Publicación de cupones y promociones exclusivas',
      'Panel de analítica con visitas y procedencia',
      'Recepción de solicitudes y consultas directas',
      'Aparición en recomendaciones de la asistente Hana',
      'Soporte técnico preferente'
    ],
    badge: 'Recomendado para Negocios',
    isPopular: true
  },
  {
    id: 'plan-premium',
    name: 'Publicidad Premium & Banners',
    nameEn: 'Premium Ads & Banners',
    price: 'Desde S/ 50',
    frequency: 'mensual (referencial)',
    frequencyEn: 'per month (referential)',
    description: 'Máximo posicionamiento en la pantalla de inicio y cabecera de las rutas temáticas.',
    descriptionEn: 'Maximum exposure on home screen hero banners and thematic route headers.',
    features: [
      'Banner promocional en la portada principal',
      'Ubicación en los primeros 3 resultados de búsqueda',
      'Campañas especiales durante Semana Santa y feriados',
      'Segmentación por idioma y preferencias del visitante',
      'Reporte mensual detallado de impresiones y clics',
      'Gestor de cuenta publicitaria dedicado'
    ],
    badge: 'Alta Visibilidad',
    isPopular: false
  },
  {
    id: 'plan-tours',
    name: 'Alianza y Venta de Tours',
    nameEn: 'Tour Operator Partnership',
    price: '10 %',
    frequency: 'comisión por reserva (referencial)',
    frequencyEn: 'per booked tour (referential)',
    description: 'Integración para operadores turísticos oficiales y asociaciones de guías certificados.',
    descriptionEn: 'Integration for licensed tour operators and certified regional guide associations.',
    features: [
      'Publicación de paquetes turísticos y full days',
      'Módulo de reserva anticipada integrado',
      'Gestión de cupos, fechas y horarios en vivo',
      'Sin costo fijo mensual: comisión solo sobre ventas',
      'Cobranza segura y liquidación quincenal simulada',
      'Promoción cruzada en itinerarios sugeridos'
    ],
    badge: 'Para Operadores',
    isPopular: false
  }
];
