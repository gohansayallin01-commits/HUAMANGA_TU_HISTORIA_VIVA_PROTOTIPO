import { BusinessProfile } from '../types';

export const INITIAL_BUSINESS: BusinessProfile = {
  id: 'biz-1',
  name: 'Restaurante Turístico El Portón Huamanguino',
  category: 'Restaurante / Gastronomía Tradicional',
  description: 'Especialistas en la auténtica puca picante con lechón crujiente, trucha a la parrilla y pan chapla artesanal en patio colonial.',
  address: 'Jr. 28 de Julio N° 184, Centro Histórico, Ayacucho',
  phone: '+51 966 321890 (Referencial)',
  hours: 'Lun a Dom: 11:30 - 22:00 hrs',
  services: ['Patio colonial', 'WiFi gratuito', 'Música criolla en vivo', 'Acepta Visa y Mastercard', 'Carta bilingüe ES/EN'],
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  activePromotion: {
    title: 'Festival del Sabor Huamanguino',
    discount: '15% de descuento en platos tradicionales',
    code: 'HUAMANGA15',
    validUntil: '31 de Diciembre 2026'
  },
  stats: {
    views30Days: 1420,
    inquiries: 86,
    bookings: 34,
    visitorOrigins: [
      { country: 'Perú (Nacional)', percentage: 55 },
      { country: 'Estados Unidos', percentage: 18 },
      { country: 'Francia', percentage: 12 },
      { country: 'España', percentage: 9 },
      { country: 'Otros', percentage: 6 }
    ]
  }
};
