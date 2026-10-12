# GUÍA DE DEMOSTRACIÓN Y SUSTENTACIÓN ACADÉMICA
## PROYECTO: "HUAMANGA: TU HISTORIA VIVA"
**Público Objetivo:** Jurado Evaluador / Docente / Directores de Carrera  
**Institución:** Escuela Superior La Pontificia  
**Duración Sugerida:** 3 a 5 minutos  

---

## 1. Guión Paso a Paso para la Exposición

### Minuto 0:00 - 0:45 | Introducción y Planteamiento del Problema
* **Acción en Pantalla:** Mostrar la pantalla de **Bienvenida (Splash)** y el **Onboarding**.
* **Discurso Sugerido:**
  > *"Estimado jurado / profesor, hoy presentamos **'HUAMANGA: TU HISTORIA VIVA'**, una solución tecnológica móvil orientada a la reactivación turística y preservación cultural de Ayacucho. Tradicionalmente, los visitantes se limitan a la Plaza Mayor y la Semana Santa. Nuestra plataforma democratiza la información histórica, geolocaliza el patrimonio material e inmaterial, y conecta directamente al turista con los artesanos y negocios locales bajo un modelo de ciudad inteligente."*
* **Demostración:** Cambiar el selector de idioma a **Inglés** (para mostrar capacidad internacional) y luego regresar a **Español**. Deslizar las 3 pantallas de introducción y presionar **"Comenzar Experiencia"**.

---

### Minuto 0:45 - 1:45 | Exploración Inteligente y Atractivos con Audioguía
* **Acción en Pantalla:** Navegar por la pestaña **Explorar** y abrir la **Basílica Catedral** o el **Taller de Retablos de Santa Ana**.
* **Discurso Sugerido:**
  > *"La aplicación cuenta con 18 atractivos auténticos categorizados. El turista puede filtrar por tiempo disponible —por ejemplo, si sólo cuenta con 2 horas libres— o por accesibilidad. Al ingresar a un atractivo, no sólo encontramos datos históricos y coordenadas exactas; incluimos una **audioguía interactiva** que narra la historia del monumento utilizando síntesis de voz nativa del dispositivo, eliminando la necesidad de guías físicos costosos o folletería de papel."*
* **Demostración:**
  1. Escribir *"Catedral"* o *"Santa Ana"* en la barra de búsqueda.
  2. Abrir la ficha del monumento.
  3. Presionar el botón **"Escuchar Audioguía"** (se escuchará la voz narrando la historia).
  4. Presionar el corazón de **"Guardar en Favoritos"**.

---

### Minuto 1:45 - 2:45 | Mapa Interactivo y Circuitos Turísticos
* **Acción en Pantalla:** Ir a la pestaña **Mapa** y luego a **Rutas**.
* **Discurso Sugerido:**
  > *"El mapa interactivo georreferencia los puntos de interés con iconos temáticos y permite trazar circuitos turísticos como la 'Ruta de las 33 Iglesias' o la 'Ruta de la Independencia'. Además, para promover la economía formal, integramos un **mago de reservas digital de 7 pasos** que simula la contratación de tours comunitarios con métodos de pago populares como Yape y Plin, emitiendo un comprobante digital con código QR para el viajero."*
* **Demostración:**
  1. Moverse por el mapa de Leaflet y tocar un marcador para ver la tarjeta flotante.
  2. Ir a **Rutas**, seleccionar la **"Ruta del Retablo Ayacuchano"**.
  3. Marcar una parada del checklist.
  4. Presionar **"Reservar este Circuito"**. Avanzar por los pasos del asistente, ingresar un nombre y confirmar la reserva (apreciar la lluvia de confeti y el comprobante con QR).

---

### Minuto 2:45 - 3:45 | Asistente Virtual Hana y Ecosistema de Negocios
* **Acción en Pantalla:** Abrir a **Hana Bot** (botón flotante o menú) y luego la sección **Negocios**.
* **Discurso Sugerido:**
  > *"Para resolver dudas en tiempo real, implementamos a **Hana**, una asistente virtual inteligente que responde preguntas frecuentes sobre gastronomía, clima y horarios. Asimismo, nuestra plataforma cuenta con un módulo SaaS para **Negocios Locales**, donde los artesanos del Barrio de Santa Ana y restaurantes pueden autogestionar su perfil comercial y previsualizar cómo los verán los turistas en sus teléfonos."*
* **Demostración:**
  1. Tocar el avatar de Hana. Presionar la sugerencia *"¿Dónde comer platos típicos?"*.
  2. Ir a la pestaña **Negocios** y mostrar el editor y el simulador de teléfono.

---

### Minuto 3:45 - 4:30 | Panel de Administración y Modelo de Sostenibilidad (SaaS)
* **Acción en Pantalla:** Ir al menú de **Perfil**, tocar **"Panel de Administración"**, digitar el PIN `admin123`.
* **Discurso Sugerido:**
  > *"Detrás de la experiencia del turista existe un centro de control administrativo para las autoridades o el operador turístico. Protegido con PIN de seguridad, permite auditar visitas, gestionar el catálogo de lugares en tiempo real y visualizar planes de monetización SaaS con tarifas escalonadas para negocios, guías y alianzas con la DIRCETUR."*
* **Demostración:**
  1. Digitar `admin123` y acceder.
  2. Mostrar las tarjetas de métricas y la tabla de atractivos.
  3. Mostrar la pestaña de **Planes SaaS**.

---

### Minuto 4:30 - 5:00 | Cierre y Activación del Modo Exposición
* **Acción en Pantalla:** Activar el **Tour Guiado** o el botón **Reiniciar Modo Exposición**.
* **Discurso Sugerido:**
  > *"Para facilitar la evaluación de los jurados, hemos incluido un **Tour Guiado de 10 pasos** integrado en la interfaz y un botón de **'Modo Exposición'** que restablece todos los datos de demostración en un clic. 'Huamanga: Tu Historia Viva' está lista para ser desplegada en producción y convertirse en el referente tecnológico de turismo de la región. Quedamos atentos a sus preguntas."*

---

## 2. Respuestas Rápidas para Preguntas del Jurado

* **Pregunta:** *¿Qué pasa si el turista se queda sin señal de internet en una iglesia o en Wari?*  
  * **Respuesta:** La aplicación fue diseñada como una PWA (Progressive Web App) con Service Worker y almacenamiento local (`localStorage`). Los datos de monumentos e imágenes cacheadas se mantienen disponibles aún en modo sin conexión.

* **Pregunta:** *¿Por qué eligieron React con Vite en lugar de una aplicación nativa en Kotlin o Swift?*  
  * **Respuesta:** Permite llegar al 100% de los usuarios sin necesidad de pasar por descargas forzosas de tiendas de aplicaciones, reduciendo la fricción a cero: el turista simplemente escanea un código QR en el terminal terrestre o aeropuerto de Ayacucho y accede instantáneamente en su navegador móvil.

* **Pregunta:** *¿Cómo genera ingresos este proyecto?*  
  * **Respuesta:** Mediante un modelo SaaS Freemium detallado en la sección de planes: suscripción destacada para restaurantes y hoteles, comisión por reservas de circuitos y convenios institucionales con municipalidades y DIRCETUR.
