import { RouteItem } from '../types';

export const INITIAL_ROUTES: RouteItem[] = [
  {
    id: 'route-1',
    slug: 'ruta-historica-independencia',
    title: 'Ruta de la Independencia Americana',
    titleEn: 'American Independence Route',
    duration: 'one_day',
    durationLabel: '1 día completo',
    durationLabelEn: '1 full day',
    stopsCount: 4,
    distanceKm: 42,
    difficulty: 'Fácil',
    difficultyEn: 'Easy',
    refPrice: 45,
    description: 'Recorrido cívico e histórico que revive los pasos de los libertadores desde los portales de Huamanga hasta el Obelisco de Quinua.',
    descriptionEn: 'Civic and historic circuit retracing the liberators’ footsteps from Huamanga to the monumental Quinua Obelisk.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        id: 'stop-1-1',
        name: 'Plaza Mayor de Ayacucho',
        attractionId: 'attr-1',
        order: 1,
        estimatedTime: '45 min',
        description: 'Monumento a Sucre y portales coloniales de la capitulación.',
        coordinates: { lat: -13.1631, lng: -74.2236 }
      },
      {
        id: 'stop-1-2',
        name: 'Arco del Triunfo de San Francisco',
        attractionId: 'attr-3',
        order: 2,
        estimatedTime: '30 min',
        description: 'Monumento triunfal erigido en honor a los vencedores de 1824.',
        coordinates: { lat: -13.1645, lng: -74.2248 }
      },
      {
        id: 'stop-1-3',
        name: 'Complejo Arqueológico Wari',
        attractionId: 'attr-5',
        order: 3,
        estimatedTime: '2 horas',
        description: 'Parada intermedia para conocer la capital imperial andina.',
        coordinates: { lat: -13.0614, lng: -74.1953 }
      },
      {
        id: 'stop-1-4',
        name: 'Pampa de Ayacucho y Obelisco',
        attractionId: 'attr-6',
        order: 4,
        estimatedTime: '2.5 horas',
        description: 'Escenario de la célebre batalla que selló la libertad de América del Sur.',
        coordinates: { lat: -13.0456, lng: -74.1378 }
      }
    ],
    schedule: [
      { time: '08:30', activity: 'Punto de encuentro en Plaza Mayor y reseña histórica' },
      { time: '09:30', activity: 'Paso por el Arco del Triunfo y traslado hacia Quinua' },
      { time: '10:30', activity: 'Visita guiada por el Complejo Arqueológico Wari y museo' },
      { time: '13:00', activity: 'Almuerzo tradicional en el pueblo de Quinua' },
      { time: '14:30', activity: 'Llegada al Santuario Histórico de la Pampa de Ayacucho' },
      { time: '16:30', activity: 'Tiempo libre para fotografía y retorno a Huamanga' }
    ],
    recommendations: [
      'Llevar calzado deportivo y protección solar para la Pampa.',
      'Ropa de abrigo para la tarde (el viento en la meseta es frío).',
      'Cámara o celular con suficiente almacenamiento y batería.'
    ]
  },
  {
    id: 'route-2',
    slug: 'ruta-iglesias-coloniales',
    title: 'Ruta Sacra de los Templos Coloniales',
    titleEn: 'Sacred Route of Colonial Churches',
    duration: 'half_day',
    durationLabel: 'Medio día (4 hrs)',
    durationLabelEn: 'Half day (4 hrs)',
    stopsCount: 4,
    distanceKm: 3.5,
    difficulty: 'Fácil',
    difficultyEn: 'Easy',
    refPrice: 15,
    description: 'Inmersión en el arte barroco mestizo y la devoción de los templos más representativos del centro de Huamanga.',
    descriptionEn: 'Immersion in Andean baroque architecture across the most revered churches of central Huamanga.',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        id: 'stop-2-1',
        name: 'Basílica Catedral de Ayacucho',
        attractionId: 'attr-2',
        order: 1,
        estimatedTime: '50 min',
        description: 'Altares de cedro bañados en pan de oro y arte virreinal.',
        coordinates: { lat: -13.1628, lng: -74.2230 }
      },
      {
        id: 'stop-2-2',
        name: 'Templo de Santo Domingo',
        attractionId: 'attr-10',
        order: 2,
        estimatedTime: '40 min',
        description: 'Fachada con triple arco de piedra y hogar del Santo Sepulcro.',
        coordinates: { lat: -13.1612, lng: -74.2255 }
      },
      {
        id: 'stop-2-3',
        name: 'Templo de San Francisco de Asís',
        attractionId: 'attr-11',
        order: 3,
        estimatedTime: '45 min',
        description: 'Catacumbas históricas y biblioteca virreinal franciscana.',
        coordinates: { lat: -13.1648, lng: -74.2250 }
      },
      {
        id: 'stop-2-4',
        name: 'Templo de Santa Ana',
        attractionId: 'attr-12',
        order: 4,
        estimatedTime: '45 min',
        description: 'Templo parroquial de 1569 en el barrio de artesanos.',
        coordinates: { lat: -13.1678, lng: -74.2210 }
      }
    ],
    schedule: [
      { time: '09:00', activity: 'Apertura y recorrido interior en la Basílica Catedral' },
      { time: '10:00', activity: 'Caminata hacia Santo Domingo y visita a sus retablos' },
      { time: '11:00', activity: 'Visita a la plazuela y nave de San Francisco de Asís' },
      { time: '12:00', activity: 'Cierre en el atrio colonial de Santa Ana con degustación de panes' }
    ],
    recommendations: [
      'Guardar silencio en momentos de oración litúrgica.',
      'No usar flash al fotografiar pinturas virreinales al óleo.',
      'Calzado cómodo para caminar por calles empedradas.'
    ]
  },
  {
    id: 'route-3',
    slug: 'ruta-gastronomica-sabores-vivos',
    title: 'Ruta Gastronómica: Sabores Vivos de Huamanga',
    titleEn: 'Gastronomic Route: Living Flavors of Huamanga',
    duration: 'half_day',
    durationLabel: 'Medio día (5 hrs)',
    durationLabelEn: 'Half day (5 hrs)',
    stopsCount: 3,
    distanceKm: 2.8,
    difficulty: 'Fácil',
    difficultyEn: 'Easy',
    refPrice: 40,
    description: 'Sabores auténticos desde el mercado popular hasta la alta cocina novoandina en una casona virreinal.',
    descriptionEn: 'Authentic culinary experience from traditional market breakfasts to courtyard fine dining.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        id: 'stop-3-1',
        name: 'Mercado Central Carlos F. Vivanco',
        attractionId: 'attr-15',
        order: 1,
        estimatedTime: '1.5 horas',
        description: 'Panes chaplas calientes, quesos andinos frescos y jugos de lúcuma.',
        coordinates: { lat: -13.1652, lng: -74.2268 }
      },
      {
        id: 'stop-3-2',
        name: 'Puestos de Muyuchi bajo los Portales',
        attractionId: 'attr-1',
        order: 2,
        estimatedTime: '45 min',
        description: 'Helado tradicional elaborado batiendo leche fresca con canela y ajonjolí en pailas de hielo.',
        coordinates: { lat: -13.1631, lng: -74.2236 }
      },
      {
        id: 'stop-3-3',
        name: 'Restaurante La Casona Huamanguina',
        attractionId: 'attr-16',
        order: 3,
        estimatedTime: '2 horas',
        description: 'Almuerzo criollo con puca picante tradicional y música de guitarras.',
        coordinates: { lat: -13.1625, lng: -74.2220 }
      }
    ],
    schedule: [
      { time: '08:00', activity: 'Desayuno huamanguino en el Mercado Carlos F. Vivanco' },
      { time: '11:00', activity: 'Pausa dulce con helado muyuchi tradicional bajo los arcos' },
      { time: '13:00', activity: 'Almuerzo de gala con puca picante y chicha en La Casona' }
    ],
    recommendations: [
      'Venir con apetito para degustar cada plato.',
      'Preguntar por el nivel de picante en los potajes tradicionales.',
      'Tomar mate de hierbas digestivas tras las comidas copiosas.'
    ]
  },
  {
    id: 'route-4',
    slug: 'ruta-artesanal-manos-maestras',
    title: 'Ruta Artesanal: Manos Maestras de Ayacucho',
    titleEn: 'Artisan Route: Master Hands of Ayacucho',
    duration: 'one_day',
    durationLabel: '1 día completo',
    durationLabelEn: '1 full day',
    stopsCount: 4,
    distanceKm: 38,
    difficulty: 'Fácil',
    difficultyEn: 'Easy',
    refPrice: 35,
    description: 'Encuentro íntimo con los grandes maestros del retablo, la piedra de Huamanga y la alfarería tradicional.',
    descriptionEn: 'Intimate encounters with master artisans of retablo altarpieces, alabaster, and clay ceramics.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        id: 'stop-4-1',
        name: 'Taller de Escultura en Piedra de Huamanga',
        attractionId: 'attr-14',
        order: 1,
        estimatedTime: '1 hora',
        description: 'Talla en alabastro blanco traslúcido y piezas sacras finas.',
        coordinates: { lat: -13.1618, lng: -74.2212 }
      },
      {
        id: 'stop-4-2',
        name: 'Taller de Retablos Don Silvestre en Santa Ana',
        attractionId: 'attr-13',
        order: 2,
        estimatedTime: '1.5 horas',
        description: 'Armado, modelado en masa de papa y pintura de retablos vivos.',
        coordinates: { lat: -13.1672, lng: -74.2215 }
      },
      {
        id: 'stop-4-3',
        name: 'Barrio y Plazoleta de Santa Ana',
        attractionId: 'attr-12',
        order: 3,
        estimatedTime: '1 hora',
        description: 'Telares a pedal tradicionales y tapices con tintes naturales.',
        coordinates: { lat: -13.1678, lng: -74.2210 }
      },
      {
        id: 'stop-4-4',
        name: 'Pueblo Alfarero de Quinua',
        attractionId: 'attr-8',
        order: 4,
        estimatedTime: '2.5 horas',
        description: 'Visita a los talleres de cerámica y tejados con iglesitas protectoras.',
        coordinates: { lat: -13.0425, lng: -74.1390 }
      }
    ],
    schedule: [
      { time: '09:00', activity: 'Demostración de tallado en piedra en el Jr. Tres Máscaras' },
      { time: '10:30', activity: 'Clase demostrativa de retablo en el taller de Don Silvestre' },
      { time: '12:00', activity: 'Recorrido por los talleres textiles de Santa Ana' },
      { time: '14:00', activity: 'Viaje a Quinua y recorrido por los alfares tradicionales' }
    ],
    recommendations: [
      'Apoyar el comercio justo comprando directamente en el taller de los maestros.',
      'Solicitar certificado de origen o firma del artesano en piezas de colección.'
    ]
  },
  {
    id: 'route-5',
    slug: 'ruta-naturaleza-aguas-turquesas',
    title: 'Ruta de Naturaleza: Millpu y Miradores Andinos',
    titleEn: 'Nature Circuit: Millpu Turquoise Pools & Overlooks',
    duration: 'two_days',
    durationLabel: '2 días',
    durationLabelEn: '2 days',
    stopsCount: 3,
    distanceKm: 140,
    difficulty: 'Moderado',
    difficultyEn: 'Moderate',
    refPrice: 110,
    description: 'Expedición a los tesoros naturales de Ayacucho: desde el mirador panorámico de Huamanga hasta el cañón de Millpu.',
    descriptionEn: 'Natural expedition from city panoramic overlooks to the turquoise canyon of Millpu.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        id: 'stop-5-1',
        name: 'Mirador de Acuchimay',
        attractionId: 'attr-7',
        order: 1,
        estimatedTime: '1.5 horas',
        description: 'Vistas del atardecer sobre toda la cuenca de Huamanga.',
        coordinates: { lat: -13.1762, lng: -74.2215 }
      },
      {
        id: 'stop-5-2',
        name: 'Comunidad de Circamarca',
        attractionId: 'attr-9',
        order: 2,
        estimatedTime: '2 horas',
        description: 'Pueblo anfitrión y degustación de trucha andina fresca.',
        coordinates: { lat: -13.6210, lng: -74.3100 }
      },
      {
        id: 'stop-5-3',
        name: 'Aguas Turquesas de Millpu',
        attractionId: 'attr-9',
        order: 3,
        estimatedTime: '4 horas',
        description: 'Trekking bordeando las más de 20 pozas escalonadas de agua mineral.',
        coordinates: { lat: -13.6289, lng: -74.3122 }
      }
    ],
    schedule: [
      { time: 'Día 1 - 16:30', activity: 'Atardecer panorámico en el Mirador de Acuchimay' },
      { time: 'Día 2 - 06:00', activity: 'Salida de Huamanga hacia Circamarca (Fajardo)' },
      { time: 'Día 2 - 10:30', activity: 'Caminata y exploración por las pozas de Millpu' },
      { time: 'Día 2 - 15:00', activity: 'Almuerzo comunal y retorno a Huamanga' }
    ],
    recommendations: [
      'Calzado de trekking con buen agarre para zonas húmedas.',
      'Llevar abrigo ligero y cortaviento.',
      'Mejor temporada de visita entre mayo y noviembre.'
    ]
  },
  {
    id: 'route-6',
    slug: 'gran-circuito-ayacucho-3-dias',
    title: 'Gran Circuito: Lo Mejor de Huamanga y Alrededores',
    titleEn: 'Grand Circuit: Best of Huamanga & Environs',
    duration: 'three_days',
    durationLabel: '3 días completos',
    durationLabelEn: '3 full days',
    stopsCount: 6,
    distanceKm: 160,
    difficulty: 'Moderado',
    difficultyEn: 'Moderate',
    refPrice: 160,
    description: 'La experiencia definitiva: centro colonial, museos de la memoria, capital Wari, Quinua histórica y cañones naturales.',
    descriptionEn: 'The definitive Ayacucho experience: colonial core, Wari ruins, Quinua, and stunning nature.',
    image: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=1200&q=80',
    stops: [
      {
        id: 'stop-6-1',
        name: 'Plaza Mayor y Catedral',
        attractionId: 'attr-1',
        order: 1,
        estimatedTime: '2 horas',
        description: 'Patrimonio arquitectónico e historia fundacional.',
        coordinates: { lat: -13.1631, lng: -74.2236 }
      },
      {
        id: 'stop-6-2',
        name: 'Museo de la Memoria ANFASEP',
        attractionId: 'attr-4',
        order: 2,
        estimatedTime: '1.5 horas',
        description: 'Comprensión profunda de la historia social ayacuchana.',
        coordinates: { lat: -13.1582, lng: -74.2185 }
      },
      {
        id: 'stop-6-3',
        name: 'Complejo Arqueológico Wari',
        attractionId: 'attr-5',
        order: 3,
        estimatedTime: '2.5 horas',
        description: 'Mausoleos y urbanismo imperial prehispánico.',
        coordinates: { lat: -13.0614, lng: -74.1953 }
      },
      {
        id: 'stop-6-4',
        name: 'Pampa de Ayacucho y Santuario',
        attractionId: 'attr-6',
        order: 4,
        estimatedTime: '2 horas',
        description: 'Homenaje a la libertad continental al pie del Obelisco.',
        coordinates: { lat: -13.0456, lng: -74.1378 }
      },
      {
        id: 'stop-6-5',
        name: 'Barrio Artesanal de Santa Ana',
        attractionId: 'attr-12',
        order: 5,
        estimatedTime: '2 horas',
        description: 'Talleres vivos de retablo y tejidos de lana de alpaca.',
        coordinates: { lat: -13.1678, lng: -74.2210 }
      },
      {
        id: 'stop-6-6',
        name: 'Aguas Turquesas de Millpu',
        attractionId: 'attr-9',
        order: 6,
        estimatedTime: '5 horas',
        description: 'Jornada completa de aventura y naturaleza andina.',
        coordinates: { lat: -13.6289, lng: -74.3122 }
      }
    ],
    schedule: [
      { time: 'Día 1', activity: 'Centro histórico colonial, Catedral, iglesias y Museo de la Memoria' },
      { time: 'Día 2', activity: 'Excursión a Wari, talleres de Quinua y Santuario de la Pampa' },
      { time: 'Día 3', activity: 'Aventura de día completo en las Aguas Turquesas de Millpu' }
    ],
    recommendations: [
      'Ideal para turistas que disponen de un fin de semana largo o puente festivo.',
      'Aclimatarse el primer día con caminatas pausadas y mate de coca.'
    ]
  }
];
