import { EventItem } from '../types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Semana Santa de Ayacucho',
    titleEn: 'Holy Week of Ayacucho',
    category: 'Religioso / Cultural',
    date: '28 Mar - 05 Abr 2026',
    time: 'Todo el día',
    location: 'Plaza Mayor y Templos del Centro Histórico',
    description: 'La celebración religiosa más importante del Perú y una de las más célebres del mundo, con 10 días de procesiones solemnes, alfombras de flores naturales y el apoteósico Domingo de Resurrección con el anda monumental de cera.',
    descriptionEn: 'The most revered religious festival in Peru with 10 days of historic processions, flower carpets, and the monumental Easter Sunday pyramid of lights.',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    id: 'evt-2',
    title: 'Aniversario de Fundación de Huamanga',
    titleEn: 'Anniversary of Huamanga’s Foundation',
    category: 'Cívico / Festivo',
    date: '25 de Abril 2026',
    time: '09:00 - 22:00 hrs',
    location: 'Plaza Mayor de Huamanga',
    description: 'Conmemoración de la fundación virreinal española con desfiles folclóricos, serenata criolla, ferias gastronómicas y comparsas tradicionales.',
    descriptionEn: 'Celebration of the city founding with folk parades, midnight serenades, food fairs, and musical contests.',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  },
  {
    id: 'evt-3',
    title: 'Carnaval Ayacuchano (Patrimonio de la Nación)',
    titleEn: 'Ayacucho Carnival (National Heritage)',
    category: 'Tradición / Folclore',
    date: '14 - 18 Febrero 2026',
    time: '10:00 - 19:00 hrs',
    location: 'Calles principales y Plaza Mayor',
    description: 'Declarado Patrimonio Cultural de la Nación: comparsas multicolores, quenas, guitarras, cantos en quechua y picardía tradicional.',
    descriptionEn: 'Intangible Cultural Heritage of Peru: colorful troupes dancing through the streets with traditional quenas and guitars.',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false
  },
  {
    id: 'evt-4',
    title: 'Feria Nacional del Retablo y Piedra de Huamanga',
    titleEn: 'National Retablo & Huamanga Stone Fair',
    category: 'Artesanía / Expo',
    date: '12 - 16 Julio 2026',
    time: '09:00 - 20:00 hrs',
    location: 'Plazoleta Santa Ana',
    description: 'Exposición y venta directa de los más distinguidos maestros artesanos con demostraciones de tallado y modelado en vivo.',
    descriptionEn: 'Exhibition and direct sale from master craftsmen featuring live carving and altarpiece modeling.',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false
  },
  {
    id: 'evt-5',
    title: 'Día de la Canción Ayacuchana',
    titleEn: 'Day of the Ayacucho Folk Song',
    category: 'Música / Cultura',
    date: '06 de Noviembre 2026',
    time: '18:00 - 23:00 hrs',
    location: 'Teatro Municipal de Huamanga',
    description: 'Homenaje a los grandes compositores e intérpretes de la guitarra andina, el huayno tradicional y la marinera ayacuchana.',
    descriptionEn: 'Tribute to masters of Andean acoustic guitar, classical huayno, and regional melodies.',
    isFree: false,
    price: 20,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    isFeatured: false
  },
  {
    id: 'evt-6',
    title: 'Noche de Museos y Templos Abiertos',
    titleEn: 'Night of Open Museums & Temples',
    category: 'Patrimonio / Historia',
    date: '18 de Mayo 2026',
    time: '18:00 - 23:00 hrs',
    location: 'Museos y Templos del Centro Histórico',
    description: 'Apertura nocturna con visitas guiadas a la luz de las velas por los museos de la ciudad, catacumbas y salas de arte sacro.',
    descriptionEn: 'Candlelight evening tours across historic museums, crypts, and colonial sacred art halls.',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80',
    isFeatured: true
  }
];
