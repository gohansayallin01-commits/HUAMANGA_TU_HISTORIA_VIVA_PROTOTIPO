# CRÉDITOS Y FUENTES - HUAMANGA: TU HISTORIA VIVA

## 1. Equipo del Proyecto y Contexto Académico
* **Institución:** Escuela Superior La Pontificia (Ayacucho, Perú)
* **Año Académico:** 2026
* **Carrera / Especialidad:** Desarrollo de Sistemas / Turismo Digital & Transformación Tecnológica
* **Nombre de la Aplicación:** **HUAMANGA: TU HISTORIA VIVA**
* **Naturaleza del Entregable:** Prototipo Web Móvil Funcional de Alta Fidelidad (PWA & SaaS Turismo)

---

## 2. Tecnologías y Librerías de Código Abierto
El prototipo fue construido utilizando las siguientes tecnologías y herramientas modernas de la industria de software:

* **React (v18.3.1):** Biblioteca de interfaces de usuario bajo arquitectura de componentes funcionales y Hooks.
  * *Licencia:* MIT (Meta Open Source).
* **TypeScript (v5.5.3):** Tipado estático estricto para alta mantenibilidad y prevención de errores en tiempo de compilación.
  * *Licencia:* Apache 2.0 (Microsoft).
* **Vite (v5.4.2):** Herramienta de compilación y empaquetado de última generación con Hot Module Replacement (HMR).
  * *Licencia:* MIT (Evan You / Vite Contributors).
* **Tailwind CSS (v3.4.1):** Framework de utilidades CSS para diseño responsive, diseño móvil primero y paleta cromática inspirada en el arte andino.
  * *Licencia:* MIT (Tailwind Labs).
* **React Router DOM (v6.26.0):** Enrutador cliente implementado con `HashRouter` para compatibilidad total con servidores estáticos y visualización sin caídas.
  * *Licencia:* MIT (Remix Software).
* **Leaflet (v1.9.4) & React-Leaflet (v4.2.1):** Biblioteca de mapas interactivos mobile-friendly.
  * *Licencia:* BSD-2-Clause (Vladimir Agafonkin / Leaflet).
* **Lucide React (v0.441.0):** Conjunto de iconos vectoriales modernos y consistentes para navegación táctil.
  * *Licencia:* ISC (Lucide Project).
* **Canvas Confetti (v1.9.4):** Animación de celebración para la confirmación de reservas de circuitos turísticos.
  * *Licencia:* MIT (Kiril Vatev).

---

## 3. Cartografía y Datos Geoespaciales
* **Tiles Cartográficos:** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
* **Proveedor de Mosaicos:** Standard CartoOSM Raster Tiles bajo licencia ODbL (Open Database License).
* **Coordenadas y Georreferenciación:** Coordenadas GPS reales del Centro Histórico de Huamanga, Barrio de Santa Ana, Miradores de Acuchimay y Picota, Complejo Arqueológico Wari y Pampa de Ayacucho (Quinua).

---

## 4. Recursos Visuales, Fotografía y Política de Imágenes Referenciales

### 4.1 Fuente oficial del contenido distribuido
El conjunto oficial de atractivos y sus imágenes viaja **dentro de la compilación** en
`src/data/official-attractions.json` (importado por `src/data/attractions.ts`). Esto garantiza
que cualquier dispositivo que abra el enlace público vea el contenido oficial **sin depender de
IndexedDB ni de localStorage previos**. Al iniciar, si la versión local es más antigua, se
restaura automáticamente el contenido oficial.

### 4.2 Ilustraciones referenciales locales (contenido actual)
Mientras no se incorporen fotografías verificadas, las portadas y galerías son **ilustraciones vectoriales (SVG) generadas para este prototipo** y almacenadas localmente en `public/images/attractions/`:

* Un archivo único por atractivo (una portada y una imagen de galería), por lo que **no se repite la misma imagen entre lugares distintos**.
* Cada archivo declara en su interior la leyenda **"IMAGEN REFERENCIAL · DEMOSTRACIÓN"**.
* Autoría: equipo del proyecto *Huamanga: Tu Historia Viva*.
* Licencia: uso demostrativo académico.

> **Transparencia:** estas ilustraciones **no son fotografías oficiales verificadas** de cada lugar. Se usan como *placeholders* honestos para la defensa académica. Cuando se disponga de fotografías propias o de licencia verificada, deberán reemplazarse con `node scripts/finalize-presentation-content.mjs` y registrarse en la sección 4.4.

### 4.3 Mecanismo de resiliencia visual
* Componente `ImageFallback` con SVG vectorial nativo andino: garantiza que ninguna tarjeta o cabecera quede vacía si una imagen falla o no hay conexión.
* En la ficha de detalle se muestra además el aviso visible **"Imagen referencial para demostración"** cuando la portada no está verificada.

### 4.4 Registro de fotografías definitivas de la exposición

> Complete esta tabla al incorporar cada fotografía real. Debe indicar atractivo, archivo,
> fuente, autor, licencia, procedencia y estado.

| Atractivo | Archivo | Autor | Licencia | Procedencia | Fecha | Estado |
| --------- | ------- | ----- | -------- | ----------- | ----- | ------ |
| _(pendiente)_ | _(sin fotografías incorporadas aún)_ | — | — | — | — | Pendiente |

Estados admitidos: **Verificada**, **Autorizada**, **Propia**, **Referencial**.

### 4.5 Registro de fuentes por imagen
Cada atractivo incluye metadatos de imagen (`imageMeta`) con: `url`, `alt`, `source`, `author`, `license` y `isReferential`. El panel administrativo permite editar estos campos y registrar la procedencia real cuando se sustituyan las ilustraciones.

### 4.6 Fondos decorativos
Algunos fondos de portada (bienvenida) reutilizan imágenes de **Unsplash** (cultura, arquitectura colonial andina e iglesias históricas).
* Licencia Unsplash: libre de regalías para demostración, prototipado e investigación académica.

---

## 5. Patrimonio Cultural e Histórico Referenciado
Los textos informativos, descripciones de atractivos, recorridos y audioguías fueron redactados tomando como referencia histórica:
* Dirección Regional de Comercio Exterior y Turismo de Ayacucho (DIRCETUR Ayacucho).
* Municipalidad Provincial de Huamanga.
* Guías oficiales de monumentos coloniales, templos virreinales y artesanía tradicional declarada Patrimonio Cultural de la Nación (Retablo Ayacuchano, Tallado en Piedra de Huamanga, Cerámica de Quinua y Textiles de Santa Ana).

---

*Desarrollado con estándares de excelencia en arquitectura frontend, accesibilidad web (WCAG 2.1 AA) y diseño móvil.*
