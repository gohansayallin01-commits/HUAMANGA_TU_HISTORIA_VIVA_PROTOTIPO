# HOJA DE RUTA FUTURA Y ESCALABILIDAD (FUTURE ROADMAP)
## PROYECTO: "HUAMANGA: TU HISTORIA VIVA"

Este documento presenta la visión arquitectónica y el plan de evolución técnica para transformar el prototipo de alta fidelidad en un producto mínimo viable (MVP) y posteriormente en una plataforma turística SaaS a nivel nacional.

---

## Fase A: Arquitectura de Producción y Backend (Meses 1 - 3)

### 1. Backend y Base de Datos Geoespacial
* **Framework Backend:** Node.js con NestJS o Go (Golang) para alto rendimiento y microservicios modulares.
* **Base de Datos:** PostgreSQL con la extensión **PostGIS** para consultas geoespaciales avanzadas (cálculo de perímetros, lugares cercanos a menos de 500m con índices espaciales R-Tree).
* **Autenticación:** OAuth 2.0 con soporte para inicio de sesión con Google, Apple ID y autenticación biométrica en dispositivos móviles.

### 2. Pasarela de Pagos Reales
* Integración con pasarelas de pago peruanas reguladas:
  * **Culqi / Niubiz:** Procesamiento de tarjetas de débito/crédito nacionales e internacionales con liquidación automática.
  * **Yape para Empresas / Plin:** Pagos instantáneos mediante integración directa por API o códigos QR interoperables del BCRP.
* Emisión automática de boletas electrónicas mediante conexión con PSE (Proveedor de Servicios Electrónicos) autorizado por SUNAT.

---

## Fase B: Experiencias Inmersivas e Inteligencia Artificial (Meses 4 - 6)

### 1. Realidad Aumentada (AR) en Monumentos Históricos
* Utilización de **WebXR** y Three.js para ofrecer visualización en Realidad Aumentada sin obligar a descargar apps pesadas.
* Reconstrucción 3D referencial de la ciudadela imperial de **Wari** y del Obelisco de la Pampa de la Quinua superpuesta sobre la cámara del smartphone del visitante.

### 2. Hana AI con Modelos de Lenguaje Avanzados (LLM)
* Evolución del asistente conversacional conectando un modelo Gemini 1.5 Flash o Claude 3.5 Sonnet mediante RAG (Retrieval-Augmented Generation).
* Base de conocimiento alimentada con las tesis históricas de la Universidad Nacional de San Cristóbal de Huamanga (UNSCH) y archivos de la DIRCETUR.
* Soporte para respuestas y consultas por voz en **Quechua Chanka**.

---

## Fase C: Notificaciones por Geolocalización y Geofencing (Meses 7 - 9)

### 1. Geocercas (Geofencing) y Web Push
* Al aproximarse a menos de 100 metros de un monumento (ej. Arco del Triunfo o Templo de Santo Domingo), la PWA emitirá una notificación interactiva invitando al turista a escuchar la audioguía.
* Descuentos y ofertas exclusivas de talleres artesanales cercanos para incentivar el consumo local en el Barrio de Santa Ana.

### 2. Conectividad 100% Offline con Mapas Vectoriales
* Almacenamiento en caché de mapas vectoriales (MapLibre GL / MBTiles) para permitir navegación guiada paso a paso en zonas rurales sin cobertura móvil (Cangallo, Vilcashuamán, Millpu).

---

## Fase D: Escalabilidad SaaS Multi-Región (Meses 10 - 12)

### 1. Plataforma Multi-Inquilino (Multi-Tenant)
* Adaptación de la arquitectura para desplegar réplicas regionales:
  * *"Cusco: Tu Historia Viva"*
  * *"Arequipa: Tu Historia Viva"*
  * *"Cajamarca: Tu Historia Viva"*
* Portal de autogestión para Gobiernos Regionales y Direcciones de Turismo con métricas de afluencia turística en tiempo real y mapas de calor (heatmaps).

---

*Diseñado para convertir a Ayacucho en el primer modelo de Smart Tourism Destination (STD) del sur del Perú.*
