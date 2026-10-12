export interface HanaResponse {
  text: string;
  recommendedIds: string[];
  suggestedQuestions?: string[];
}

export const hanaBotService = {
  respond(userInput: string, isEnglish: boolean = false): HanaResponse {
    const input = userInput.toLowerCase().trim();

    // 1. Qué hacer en un día / One day
    if (input.includes('un día') || input.includes('1 día') || input.includes('one day') || input.includes('itinerario')) {
      if (isEnglish) {
        return {
          text: 'If you only have one day in Huamanga, I suggest starting at the Main Square and Cathedral, tasting hot chapla bread at Carlos F. Vivanco Market, and walking under the San Francisco Arch. Here are the must-see spots:',
          recommendedIds: ['attr-1', 'attr-2', 'attr-15', 'attr-3'],
          suggestedQuestions: ['Where can I eat typical food?', 'Which places are free?']
        };
      }
      return {
        text: '¡Excelente elección! Para un día inolvidable en Huamanga te sugiero empezar en la Plaza Mayor y la Catedral, desayunar pan chapla en el Mercado Vivanco, pasear bajo el Arco del Triunfo y visitar los talleres de Santa Ana. Aquí tienes los lugares recomendados:',
        recommendedIds: ['attr-1', 'attr-2', 'attr-15', 'attr-3'],
        suggestedQuestions: ['¿Dónde probar comida típica?', '¿Qué lugares son gratuitos?']
      };
    }

    // 2. Comida típica / Gastronomía / Food
    if (input.includes('comida') || input.includes('comer') || input.includes('gastronom') || input.includes('puca') || input.includes('food') || input.includes('restaurante')) {
      if (isEnglish) {
        return {
          text: 'Ayacucho gastronomy is legendary! Don’t leave without trying puca picante with crispy pork, hot chapla bread with Andean cheese, and very traditional "muyuchi" ice cream under the colonial arcades. Here are our top gastronomic highlights:',
          recommendedIds: ['attr-15', 'attr-16', 'attr-1'],
          suggestedQuestions: ['What can I visit in one day?', 'Historic churches']
        };
      }
      return {
        text: '¡La cocina ayacuchana es un festín! Te recomiendo no irte sin probar la puca picante con chicharrón, el pan chapla caliente con queso de Chuschi y el helado tradicional de muyuchi en los portales de la Plaza Mayor. Aquí tienes dónde degustarlos:',
        recommendedIds: ['attr-15', 'attr-16', 'attr-1'],
        suggestedQuestions: ['¿Qué puedo visitar en un día?', 'Ver iglesias coloniales']
      };
    }

    // 3. Lugares históricos / Independencia / Wari
    if (input.includes('histór') || input.includes('histor') || input.includes('independencia') || input.includes('batalla') || input.includes('wari') || input.includes('libertad')) {
      if (isEnglish) {
        return {
          text: 'Huamanga was the epicenter of South American independence and the imperial Wari culture. I strongly recommend visiting the Main Square, the Wari Archaeological Complex, and the Quinua Obelisk in the Historic Sanctuary:',
          recommendedIds: ['attr-1', 'attr-3', 'attr-5', 'attr-6'],
          suggestedQuestions: ['Traditional handicraft workshops', 'Millpu turquoise pools']
        };
      }
      return {
        text: 'Huamanga es la cuna de la libertad americana y hogar de la milenaria cultura Wari. Te recomiendo recorrer la Plaza Mayor, cruzar el Arco del Triunfo, visitar las murallas de Wari y pararte frente al Obelisco de la Pampa de Ayacucho:',
        recommendedIds: ['attr-1', 'attr-3', 'attr-5', 'attr-6'],
        suggestedQuestions: ['Talleres de retablo y artesanía', 'Aguas Turquesas de Millpu']
      };
    }

    // 4. Gratis / Presupuesto / Free
    if (input.includes('gratis') || input.includes('free') || input.includes('sin costo') || input.includes('econom') || input.includes('barato')) {
      if (isEnglish) {
        return {
          text: 'Many of Ayacucho’s most beautiful cultural attractions offer completely free admission! Take a look at these wonderful free landmarks:',
          recommendedIds: ['attr-1', 'attr-3', 'attr-6', 'attr-8', 'attr-10', 'attr-11'],
          suggestedQuestions: ['Where can I eat typical food?', 'What can I visit in one day?']
        };
      }
      return {
        text: '¡Una gran ventaja de Ayacucho es que muchos de sus atractivos más bellos tienen ingreso completamente libre! Puedes visitar estos lugares sin costo:',
        recommendedIds: ['attr-1', 'attr-3', 'attr-6', 'attr-8', 'attr-10', 'attr-11'],
        suggestedQuestions: ['¿Dónde probar comida típica?', '¿Qué puedo visitar en un día?']
      };
    }

    // 5. Iglesias / Templos / 33 iglesias
    if (input.includes('iglesia') || input.includes('templo') || input.includes('catedral') || input.includes('33') || input.includes('church')) {
      if (isEnglish) {
        return {
          text: 'Huamanga is celebrated as the City of 33 Churches. Don’t miss the Cathedral with its gold leaf altars, the three stone arches of Santo Domingo, and historic San Francisco:',
          recommendedIds: ['attr-2', 'attr-10', 'attr-11', 'attr-12'],
          suggestedQuestions: ['What can I visit in one day?', 'Museum of Memory']
        };
      }
      return {
        text: 'Huamanga es célebre como la "Ciudad de las 33 Iglesias". No puedes dejar de contemplar los retablos en pan de oro de la Catedral, la triple arquería de Santo Domingo y la histórica iglesia de San Francisco:',
        recommendedIds: ['attr-2', 'attr-10', 'attr-11', 'attr-12'],
        suggestedQuestions: ['¿Qué puedo visitar en un día?', 'Museo de la Memoria']
      };
    }

    // 6. Artesanía / Retablo / Piedra / Alfarería
    if (input.includes('artesan') || input.includes('retablo') || input.includes('piedra') || input.includes('ceramica') || input.includes('craft') || input.includes('santa ana')) {
      if (isEnglish) {
        return {
          text: 'Ayacucho’s master artisans are world-renowned. Visit the Santa Ana quarter for retablos and textiles, Tres Máscaras for white Huamanga stone carving, and Quinua for folk pottery:',
          recommendedIds: ['attr-13', 'attr-14', 'attr-8', 'attr-12'],
          suggestedQuestions: ['Historic churches', 'Typical food spots']
        };
      }
      return {
        text: '¡Los artesanos de Ayacucho son Patrimonio Vivo de la Nación! Te recomiendo visitar el taller de retablos en Santa Ana, el tallado en alabastro de piedra de Huamanga y los talleres de alfarería en Quinua:',
        recommendedIds: ['attr-13', 'attr-14', 'attr-8', 'attr-12'],
        suggestedQuestions: ['Ver iglesias históricas', 'Comida típica']
      };
    }

    // 7. Cerca de mí / Ubicación
    if (input.includes('cerca') || input.includes('ubicacion') || input.includes('near') || input.includes('distancia')) {
      if (isEnglish) {
        return {
          text: 'If you are in central Huamanga, almost all historic churches, squares, and markets are within a 5 to 10 minute walk:',
          recommendedIds: ['attr-1', 'attr-2', 'attr-3', 'attr-15'],
          suggestedQuestions: ['Open attractions map', 'Where to eat']
        };
      }
      return {
        text: 'Si te encuentras en el Centro Histórico de Huamanga, casi todos los atractivos principales están a solo 5 a 10 minutos caminando desde la Plaza Mayor:',
        recommendedIds: ['attr-1', 'attr-2', 'attr-3', 'attr-15'],
        suggestedQuestions: ['Abrir mapa interactivo', '¿Dónde almorzar?']
      };
    }

    // 8. Naturaleza / Millpu / Aventura
    if (input.includes('naturaleza') || input.includes('millpu') || input.includes('mirador') || input.includes('nature') || input.includes('aventura')) {
      if (isEnglish) {
        return {
          text: 'For breathtaking nature, take in the skyline from Acuchimay viewpoint or embark on a day trip to the turquoise canyon pools of Millpu in Circamarca:',
          recommendedIds: ['attr-7', 'attr-9'],
          suggestedQuestions: ['Full-day tour', 'Quinua village']
        };
      }
      return {
        text: 'Para disfrutar de paisajes naturales increíbles, contempla la vista panorámica desde el Mirador de Acuchimay o atrévete a la excursión a las famosas Aguas Turquesas de Millpu:',
        recommendedIds: ['attr-7', 'attr-9'],
        suggestedQuestions: ['Tour de día completo', 'Pueblo de Quinua']
      };
    }

    // 9. Seguridad y Altura / Soroche / Tips
    if (input.includes('seguridad') || input.includes('altura') || input.includes('soroche') || input.includes('tip') || input.includes('clima') || input.includes('altitude')) {
      if (isEnglish) {
        return {
          text: 'Tips for visiting Ayacucho (2,760 m.a.s.l.): Drink coca tea upon arrival, walk leisurely during your first hours, wear sunscreen, and carry small cash for artisan shops.',
          recommendedIds: ['attr-1', 'attr-17'],
          suggestedQuestions: ['What to visit in one day?', 'Free attractions']
        };
      }
      return {
        text: 'Consejos de viaje para Huamanga (2,760 m.s.n.m.): toma mate de coca el primer día para aclimatarte, camina a paso tranquilo, usa bloqueador solar y sombrero de ala ancha, y lleva monedas y billetes pequeños para comprar en los talleres artesanales.',
        recommendedIds: ['attr-1', 'attr-17'],
        suggestedQuestions: ['¿Qué visitar en un día?', 'Lugares gratuitos']
      };
    }

    // Respuesta genérica por defecto
    if (isEnglish) {
      return {
        text: 'I can help you explore Huamanga’s churches, historic battlefields, traditional foods, master workshops, or plan a personalized route. Try asking one of these questions:',
        recommendedIds: ['attr-1', 'attr-2', 'attr-6', 'attr-15'],
        suggestedQuestions: ['What can I visit in one day?', 'Show me historic places', 'Traditional food']
      };
    }

    return {
      text: 'Con gusto te ayudo a explorar Huamanga. Puedo recomendarte templos coloniales, rutas de un día, gastronomía tradicional, talleres de retablos o calcular distancias. Prueba preguntándome:',
      recommendedIds: ['attr-1', 'attr-2', 'attr-6', 'attr-15'],
      suggestedQuestions: ['¿Qué puedo visitar en un día?', 'Muéstrame lugares históricos', 'Quiero probar comida típica']
    };
  }
};
