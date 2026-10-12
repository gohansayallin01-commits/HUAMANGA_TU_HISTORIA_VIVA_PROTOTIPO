# HUAMANGA: TU HISTORIA VIVA
*Plataforma Turística Inteligente Mobile-First para Ayacucho, Perú*

Prototipo web móvil empresarial, funcional y navegable desarrollado como proyecto de investigación aplicada para la **Escuela de Educación Superior Tecnológica Privada La Pontificia** (Ayacucho - Perú, 2026).

---

## 🏛️ 1. Descripción del Proyecto

**“HUAMANGA: TU HISTORIA VIVA”** es una aplicación turística interactiva diseñada bajo arquitectura *Mobile-First*, accesible desde cualquier navegador móvil, tablet o computadora sin necesidad de instalación forzada, configuración de bases de datos remotas ni creación obligatoria de cuentas para el visitante.

El sistema orienta a turistas nacionales, visitantes extranjeros, estudiantes y familias que recorren la emblemática ciudad de Huamanga y sus alrededores (Complejo Wari, Pampa de Ayacucho y Aguas Turquesas de Millpu), conectándolos además con la oferta de prestadores locales de artesanía, gastronomía, hospedaje y transporte.

---

## 🚀 2. Tecnologías Empleadas

- **Framework & Build**: React 18 / 19, TypeScript 5, Vite 5.
- **Estilos & Diseño**: Tailwind CSS v3 con tokens y paleta institucional andina:
  * *Azul Noche*: `#082A4A`
  * *Azul Profundo*: `#0D3B66`
  * *Dorado Turístico*: `#D8A64C`
  * *Dorado Claro*: `#F2D493`
  * *Blanco Cálido*: `#FAF8F3`
  * *Gris de Fondo*: `#F4F6F8`
  * *Verde de Confirmación*: `#16865B`
  * *Rojo de Alerta*: `#CB3A3A`
- **Tipografías**: *Inter* (interfaz y lectura ágil) y *Playfair Display* (títulos culturales).
- **Rutas**: React Router (DOM) v6 configurado con `HashRouter` para garantizar que la recarga de páginas en cualquier servidor estático no genere errores HTTP 404.
- **Cartografía Interactiva**: Leaflet v1.9 y React-Leaflet con mosaicos libres de OpenStreetMap, pines SVG categorizados y trazado de rutas polilíneas referenciales.
- **Audioguía Accesible**: Web Speech API (`window.speechSynthesis`) para locución en vivo en español e inglés sin costo de APIs de terceros.
- **Persistencia**: `localStorage` tipado para favoritos, itinerario personalizado, progreso de rutas, reservas demostrativas y perfil del negocio.
- **PWA**: `manifest.webmanifest`, Service Worker (`sw.js`) con estrategia de caché *stale-while-revalidate*, e iconos optimizados de 192x192 y 512x512 px.

---

## 📂 3. Estructura del Código Fuente

```text
HUAMANGA_TU_HISTORIA_VIVA_PROTOTIPO/
├── public/
│   ├── favicon.svg          # Isotipo vectorial de la marca
│   ├── icon-192.png         # Icono para pantalla de inicio móvil
│   ├── icon-512.png         # Icono en alta resolución
│   ├── manifest.webmanifest # Manifiesto de aplicación PWA instalable
│   ├── sw.js                # Service Worker para funcionamiento offline
│   └── images/attractions/  # Fotografías/ilustraciones definitivas (local, relativo)
├── src/
│   ├── assets/              # Isotipo y logotipos vectoriales
│   ├── components/
│   │   ├── admin/           # Componentes del portal administrativo
│   │   ├── assistant/       # Asistente virtual Hana y botón flotante
│   │   ├── booking/         # Wizard de reserva en 7 pasos y voucher
│   │   ├── cards/           # AttractionCard (cuadrícula de 2 columnas y lista)
│   │   ├── common/          # Header, BottomNav, Modal, Toast, ImageFallback
│   │   ├── guide/           # GuidedTourWalkthrough (recorrido para el docente)
│   │   └── map/             # InteractiveMap con pines Leaflet y carrusel
│   ├── data/
│   │   ├── official-attractions.json  # FUENTE OFICIAL del contenido distribuido
│   │   ├── attractions.ts   # Importa la fuente oficial y exporta helpers
│   │   ├── categories.ts    # 10 categorías turísticas obligatorias
│   │   ├── events.ts        # Calendario cultural (Semana Santa, festividades)
│   │   ├── plans.ts         # Modelo de monetización y planes SaaS
│   │   └── routes.ts        # 6 rutas temáticas con cronograma y paradas
│   ├── context/             # AttractionsContext, AdminAuthContext
│   ├── hooks/               # useFavorites, useGeolocation, useSpeechAudio, useToast
│   ├── i18n/                # es.json, en.json y contexto i18nContext bilingüe
│   ├── layouts/             # AppLayout principal móvil y AdminLayout
│   ├── pages/               # Publicas + portal administrativo (pages/admin/)
│   ├── services/            # storageService, attractionService, imageStorage, etc.
│   ├── types/               # Definiciones estrictas de TypeScript
│   └── utils/               # Helpers de cálculo Haversine, compartir y sanitización
├── scripts/
│   ├── finalize-presentation-content.mjs  # Incorpora fotos definitivas + respaldo
│   └── generate-official-content.mjs      # Regenera official-attractions.json
├── .github/workflows/deploy.yml           # CI/CD GitHub Pages automático
├── imagenes_definitivas_exposicion/       # Carpeta destino de las fotos reales
├── DEMO_GUIDE.md            # Guion paso a paso para la defensa de tesis
├── TEST_REPORT.md           # Matriz exhaustiva de pruebas ejecutadas
├── CREDITS.md               # Licencias y atribuciones fotográficas
├── FUTURE_ROADMAP.md        # Plan de migración a backend y base de datos
├── package.json
└── vite.config.ts           # base '/huamanga-tu-historia-viva/'
```

---

## 💻 4. Instalación y Ejecución Local

### Requisitos Previos
- Node.js versión 18 o superior instalado en el equipo.
- Navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Safari).

### Comandos de Terminal
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en vivo (puerto 3000)
npm run dev

# 3. Verificación de tipos de TypeScript
npx tsc --noEmit

# 4. (Opcional) Incorporar fotografías definitivas de la exposición
#    Coloque las fotos en imagenes_definitivas_exposicion/ y ejecute:
node scripts/finalize-presentation-content.mjs

# 5. Compilar bundle de producción optimizado
npm run build

# 6. Previsualizar la compilación de producción (puerto 4173)
npm run preview
```

### Ejecución Directa con Doble Clic (Windows)
Sin necesidad de abrir la consola, haga doble clic sobre:
👉 **`ABRIR_HUAMANGA.bat`**
El script detecta automáticamente Node.js o Python, inicia el servidor local y abre su navegador predeterminado.

---

## 🔑 5. Credenciales Demostrativas

- **Panel de Administración**:
  * Acceso desde el menú superior o la ruta `#/acceso-administrativo` (portal en `#/admin`)
  * Contraseña de exposición: `admin123`
  * *Nota: Credencial puramente demostrativa para la sustentación académica.*
- **Modo Visitante**:
  * Acceso libre sin registro previo obligatorio.

---

## ✨ 6. Funcionalidades del Prototipo

### Totalmente Operativas en el Navegador
1. **Pantalla de Bienvenida**: Selector de idioma, frase emblemática y acceso libre.
2. **Internacionalización**: Alternancia reactiva entre **Español** e **Inglés** en todos los componentes. Francés y Portugués rotulados con etiqueta *"Próximamente"*.
3. **Catálogo y Búsqueda**: Motor de búsqueda reactivo por texto y filtros (*Gratis, De pago, Cerca de mí, Mejor valorados, Accesible, Familiar, Naturaleza, Cultura, Gastronomía*).
4. **Vistas Adaptables**: Alternador entre **cuadrícula de 2 columnas en celular**, **vista de lista** y **vista de mapa**.
5. **Audioguía Integrada**: Locución mediante la API nativa de síntesis de voz del navegador con barra de progreso, pausa y transcripción legible.
6. **Mapa con Geolocalización**: Centrado en Huamanga, marcadores por categoría, cálculo de distancias por fórmula de Haversine y trazado de ruta referencial origen-destino.
7. **Rutas Turísticas**: 6 circuitos temáticos con cronogramas y checklist de paradas visitadas con porcentaje de avance persistente.
8. **Asistente Hana**: Chat inteligente con motor de reglas que recomienda tarjetas de atractivos para preguntas sobre planes de un día, comida típica, templos coloniales o lugares gratuitos.
9. **Simulador de Reserva en 7 Pasos**: Flujo completo con validación de fechas futuras y generación de comprobante descargable/imprimible con código `HMA-XXXX`.
10. **Panel de Negocios**: Edición de datos comerciales locales en `localStorage`, métricas gráficas y previsualización en mockup móvil.
11. **Portal Administrativo Municipal**: Inicio de sesión con roles (`admin123`), dashboard con métricas, CRUD completo de atractivos por pestañas (información, ubicación, imágenes, publicación), gestión de negocios, rutas, eventos, usuarios, reportes y configuración.
12. **Contenido oficial de la exposición**: El contenido viaja dentro de la compilación (`official-attractions.json`); cualquier dispositivo lo muestra sin configuración previa y el panel permite *Restaurar contenido oficial de la exposición*.
13. **Modo Exposición**: Botón en cabecera que restablece la base a su estado prístino en un solo clic para presentaciones repetidas ante el jurado.

### Simuladas / Diseñadas para Demostración Académica
- Cobros y pasarelas de pago (no se solicitan datos de tarjetas bancarias).
- Envío de notificaciones a través de redes celulares de terceros.
- Conexión a bases de datos relacionales en la nube.

---

## 🌐 7. Despliegue Público con GitHub Pages (Un Solo Enlace)

El prototipo se publica en **GitHub Pages** mediante un flujo automático (GitHub Actions).
El visitante **no necesita instalar nada ni ejecutar comandos**: con el enlace basta.

### Configuración y publicación (una sola vez)
1. Cree un repositorio GitHub llamado **`huamanga-tu-historia-viva`** y suba este proyecto a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. En cada push a `main`, el flujo `.github/workflows/deploy.yml` ejecuta:
   `npm ci` → `npx tsc --noEmit` → `npm run build` → publica la carpeta `dist/`.
4. Enlace público resultante:
   `https://USUARIO.github.io/huamanga-tu-historia-viva/`

> `vite.config.ts` usa `base: '/huamanga-tu-historia-viva/'` (debe coincidir con el nombre
> del repositorio) y el enrutado emplea `HashRouter`, por lo que la recarga no genera 404.

### Tareas automatizadas del build
- `npm run build`: compila y empaqueta; falla (y no publica) si el código no pasa TypeScript.
- `node scripts/finalize-presentation-content.mjs`: incorpora las fotos reales colocadas en
  `imagenes_definitivas_exposicion/`, las optimiza, crea respaldo en `.presentation_backup/`
  y actualiza `src/data/official-attractions.json`.

### Cambios oficiales vs. locales (importante para la exposición)
- **Contenido oficial (fotografías y fichas):** está dentro de la compilación. Al abrir el enlace
  en cualquier navegador (incluido modo incógnito) se muestra ese contenido, sin depender de
  datos previos.
- **Cambios locales (demostrativos):** las ediciones del portal administrativo y las imágenes
  subidas se guardan en `localStorage`/`IndexedDB` de cada dispositivo. Son útiles **solo para
  la demostración en pantalla**; no se propagan a otros visitantes.
- En **Configuración → Contenido oficial de la exposición** el administrador puede restaurar el
  contenido oficial eliminando únicamente los cambios locales (los favoritos del visitante se
  conservan). Si un dispositivo tiene contenido local antiguo, el sistema restaura el oficial
  automáticamente al detectar una versión nueva.

### Limitaciones del hosting estático
- No hay servidor central: los cambios administrativos no se sincronizan entre dispositivos.
- Los formularios no envían datos reales a una base de datos.
- **Más adelante** (ver `FUTURE_ROADMAP.md`): backend + base de datos relacional, autenticación
  segura, sincronización de fotos y comercio real.

---

## 📜 8. Autores y Filiación Académica

- **Institución**: Escuela de Educación Superior Tecnológica Privada La Pontificia.
- **Programa**: Bachiller en Ingeniería de Sistemas de Información.
- **Línea de Investigación**: Desarrollo de Software y Metodologías.
- **Ciudad**: Ayacucho, Perú.
- **Año**: 2026.
