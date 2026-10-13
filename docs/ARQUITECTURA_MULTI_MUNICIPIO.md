# Arquitectura prevista: expansión multi-municipio

> Documento de diseño. **No describe funcionalidad implementada.** La expansión
> multi-municipio no se implementa en esta versión; sirve como guía para la
> evolución productiva de la plataforma.

## 1. Principio general

La plataforma nace enfocada en **Huamanga - Ayacucho**. La arquitectura se
prepara para alojar varios municipios en el futuro **sin mezclar información
entre ellos**.

Regla de oro: **todo contenido pertenece a un municipio**. Nada es "global"
salvo la infraestructura de la plataforma.

## 2. Roles y jerarquía

```
Super Admin  (administrador de la plataforma)
   └─ habilita / deshabilita municipios
      └─Municipio  (administrador municipal)
           └─ administra únicamente su territorio
              └─Negocio  (comercio local aprobado)
                   └─ administra únicamente su ficha comercial
```

### Super Admin
- Alta, habilitación y baja de municipios.
- Aprueba o rechaza la creación de negocios.
- Gobierno de la plataforma (configuración global, planes, reportes
  consolidados).
- **No** administra contenido turístico de un municipio en particular.

### Municipio (administrador municipal)
- Administra **solo** su territorio: atractivos turísticos, eventos, cultura,
  noticias e información oficial.
- Aprueba los negocios que operan dentro de su jurisdicción.
- No puede ver ni editar datos de otros municipios.

### Negocio (comercio local)
- Administra **únicamente** su propia ficha:
  - restaurante
  - hotel
  - recreo turístico
  - artesanía
  - información comercial
- Requiere aprobación previa del Super Admin (y/o del municipio).
- **No** puede modificar contenido turístico oficial (atractivos, eventos,
  cultura, noticias, información oficial).

## 3. Modelo de datos previsto

Toda entidad de contenido incorpora un identificador de municipio:

```
municipioId  ->  { huamanga | lima | pichari | vraem | ... }
```

Entidades clave:

| Entidad            | Administra              | Ámbito    |
|--------------------|-------------------------|-----------|
| Atractivos         | Municipio               | Municipal |
| Eventos            | Municipio               | Municipal |
| Cultura / Noticias | Municipio               | Municipal |
| Información oficial| Municipio               | Municipal |
| Negocios           | Negocio (aprobado)      | Comercial |
| Municipios         | Super Admin             | Global    |

Toda consulta del portal público debe filtrarse por `municipioId` para
garantizar el aislamiento de la información.

## 4. Ejemplos de municipios

- Huamanga (piloto actual)
- Lima
- Pichari
- VRAEM
- Otros municipios habilitados por el Super Admin

Cada municipio debe disponer de su propio conjunto de:

- atractivos
- negocios
- eventos
- administración

## 5. Estrategia de implementación futura (resumen)

1. Añadir `municipioId` a las entidades y al almacenamiento.
2. Incorporar el selector de municipio en el portal público.
3. Introducir el rol Super Admin con la gestión de municipios.
4. Restringir el panel municipal por municipio.
5. Mantener separados los negocios por municipio y por estado de aprobación.

> Estado actual: plataforma enfocada en Huamanga - Ayacucho. Arquitectura
> preparada conceptualmente para multi-municipio.
