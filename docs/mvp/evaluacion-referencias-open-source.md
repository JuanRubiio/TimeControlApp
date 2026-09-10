# Evaluación de referencias open source — MVP de control horario

**Estado:** evaluación de referencia; no autoriza reutilización de código ni dependencias.
**Fecha de consulta:** 10/09/2026 (Europe/Madrid).
**Alcance de la revisión:** ramas `main` descargadas para lectura, documentación pública y metadatos de GitHub. No se ejecutaron los proyectos, no se hicieron pruebas de penetración ni auditoría de dependencias con CVE. Las conclusiones de seguridad son señales de revisión, no una certificación.

## Dictamen ejecutivo

**Recomendación: no reutilizar ninguno; extraer únicamente aprendizajes técnicos y funcionales.** Ambos repositorios están bajo **GNU AGPL-3.0**. Copiar código, componentes, estilos sustanciales o hacer un fork para ofrecer el producto por red activaría un riesgo de obligación de ofrecer el código fuente correspondiente a los usuarios remotos; no es compatible con un SaaS propietario sin una decisión comercial y jurídica explícita. La AGPL no impide leer, observar o implementar desde cero ideas, pero tampoco permite asumir que un diseño visual concreto pueda copiarse sin más.

`openjornada-trabajadores` es la mejor referencia funcional/UX de los dos para el flujo de trabajador web responsive (entrada/salida, pausa, incidencia, solicitud de corrección y resumen). Sigue siendo sólo una referencia: es un frontend React/Vite dependiente de una API ajena y su autenticación de servicio se configura con variables expuestas al navegador. `jamataran/fichaje` aporta más superficie administrativa y despliegue Docker, pero es arquitectónicamente incompatible, tiene componentes muy envejecidos y **solicita/muestra geolocalización**, función prohibida en el MVP.

> **VALIDACIÓN JURÍDICA OBLIGATORIA.** Este informe no sustituye el análisis de un abogado de licencias ni de un laboralista/DPO. En especial, hay que validar el alcance de AGPL al combinar, modificar o distribuir software y toda afirmación de cumplimiento laboral o RGPD.

## Criterio de evaluación

Se han usado como contrato vinculante el `README.md`, ADR-0001, `00-contratos-y-decisiones.md` y `01-fundaciones.md` de este directorio: monolito modular TypeScript/Next.js/PostgreSQL/Docker, un entorno aislado por cliente, web/PWA, QR/PIN, auditoría append-only, correcciones aditivas y privacidad por defecto. Las «sesiones» citadas abajo son las definidas en el README del MVP.

## 1. openjornada/openjornada-trabajadores

### Estado, mantenimiento y madurez

- Repositorio público con 34 commits, 1 estrella, 0 forks, 0 issues y 0 PR abiertos en la consulta. Tiene README, guía de contribución, Dockerfile/Compose, CI de publicación e imagen en GHCR. El README documenta instalación, configuración, arquitectura, i18n y despliegue. [Repositorio](https://github.com/openjornada/openjornada-trabajadores), [README](https://github.com/openjornada/openjornada-trabajadores/blob/main/README.md).
- Actividad reciente: `main` revisada en el commit `925fd6b` del 07/09/2026. GitHub lista releases hasta `v1.0.10`, publicada el 13/08/2026. Es una señal positiva de mantenimiento, aunque con comunidad pequeña y sin historial público de incidencias que permita medir soporte. [Releases](https://github.com/openjornada/openjornada-trabajadores/releases).
- Madurez: razonable como frontend de un producto concreto; **no demostrada para producción autónoma**. Sólo se localizaron cuatro archivos de prueba, concentrados en i18n/mensajes de error, y el propio README aún enumera mejoras futuras de tests automatizados y accesibilidad. No contiene backend, modelo de datos, migraciones, autorización del servidor ni pruebas de aislamiento.

### Licencia y posibilidades de reutilización

La raíz contiene `LICENSE` y `package.json` declara **AGPL-3.0**; GitHub la identifica como AGPL-3.0. [Licencia](https://github.com/openjornada/openjornada-trabajadores/blob/main/LICENSE), [metadatos del repositorio](https://github.com/openjornada/openjornada-trabajadores).

| Forma de uso | Dictamen | Obligación/riesgo |
|---|---|---|
| Copiar código, componentes, CSS, Dockerfile o modificar/forkear | **No autorizado para el MVP** | La AGPL exige preservar avisos y licencia y, cuando el programa modificado se usa para interactuar por red, ofrecer a esos usuarios el código fuente correspondiente. Riesgo alto de copyleft y de dependencia de una API externa. |
| Arquitectura, flujos e ideas implementados desde cero | Permitido como aprendizaje | No copiar expresión concreta ni código; documentar requisitos propios y trazabilidad independiente. Riesgo bajo/medio si se evita semejanza sustancial. |
| Referencia de UX durante diseño | Permitido con cautela | Observar el flujo no transfiere código, pero no copiar literalmente textos, iconografía, branding, assets o pantallas. Riesgo bajo. |

> **VALIDACIÓN JURÍDICA OBLIGATORIA:** confirmar con asesor especializado la frontera entre componente independiente, obra derivada, distribución y prestación SaaS antes de cualquier excepción. No existe una licencia comercial alternativa verificada en esta revisión.

### Arquitectura, stack y seguridad

- SPA React 18 + TypeScript + Vite 7, React Router, Tailwind, Axios, Vitest, `vite-plugin-pwa`, `jspdf`; estructura plana por componentes, servicios y tipos. Es compatible a nivel de lenguaje/React, pero no con la arquitectura objetivo: Next.js sustituye Vite/Router y el MVP necesita rutas y RBAC en servidor.
- Es solamente el portal de trabajador. Consume una API REST externa (`/api/time-records`, incidencias, solicitudes, ausencias e informes), no publica OpenAPI ni backend/PostgreSQL. Por ello no permite verificar persistencia, inmutabilidad, retención ni autorización real.
- Incluye Docker/Nginx y configuración de runtime; es aprovechable como idea de empaquetado de UI, no como plantilla de despliegue dedicado. No aporta aprovisionamiento por cliente, PostgreSQL, backups/restauración ni observabilidad del entorno, exigidos por S12.
- **Señal crítica:** el README y `.env.example` configuran `VITE_API_USERNAME` y `VITE_API_PASSWORD`; el cliente los usa para obtener un JWT de API. Las variables `VITE_*` se incorporan al bundle o quedan recuperables por el navegador. No trasladar ese patrón: en nuestro MVP los secretos, sesiones y autorización viven en servidor (S1).
- El cliente reenvía email y contraseña del trabajador en varias llamadas de negocio. Tampoco se debe adoptar: usar la sesión HttpOnly y autorización de servidor aprobadas por S1. Hay i18n, validación de tipos, lint y algunos tests, pero no evidencia suficiente de SAST, SBOM, escaneo de dependencias, rate limiting de todos los flujos, MFA, pruebas de autorización o observabilidad.
- La PWA usa caché de assets y `NetworkOnly` para API: evita cachear fichajes, una precaución conceptualmente valiosa. No implementa cola offline de fichajes; el README y el código indican PWA, pero la entrega offline de registros no queda demostrada.

### Funcionalidad de control horario

- Trabajador: login, entrada/salida con botón según estado, pausa inicio/fin y tipos de pausa, incidencias, solicitudes de corrección, historial/estado, informe mensual PDF y firma mensual. Incluye ausencias, vacaciones, balance, adjuntos y calendario de equipo; esto último es una ampliación ajena al núcleo del MVP. [Características documentadas](https://github.com/openjornada/openjornada-trabajadores#-caracter%C3%ADsticas).
- Útil como referencia: presentar estado actual claramente; flujo visible de pausa; separar «registrar» de «informar incidencia»; solicitar corrección en lugar de editar una marca; informe diario/mensual legible.
- Fuera de alcance o no verificable: QR/PIN/kiosco, aprobación de correcciones, RBAC administrativo, turnos/reglas, exportación CSV para empresa/RLT/Inspección, auditoría append-only, backend de retención y persistencia offline de eventos. La firma mensual no es un requisito del MVP y debe tratarse como posible ampliación, no evidencia de cumplimiento.

### Privacidad y cumplimiento

- La interfaz informa que procesa nombre, email y registros de entrada/salida/pausa, y muestra retención mínima de cuatro años. Es una declaración de UI; sin backend no se puede verificar borrado, retención efectiva, bases jurídicas, medidas de acceso ni trazabilidad. [Modal de privacidad](https://github.com/openjornada/openjornada-trabajadores/blob/main/src/components/PrivacyModal.tsx).
- No se detectó código de geolocalización, biometría, foto o vídeo en esta SPA revisada. Aun así, la API subyacente no se evaluó: no debe presentarse como garantía de privacidad del sistema completo.
- El README no afirma una certificación legal automática. La retención y el informe de horas son funciones útiles, pero el encaje con convenio, jornada y acceso regulado debe seguir validándose por cada piloto.

### Aprendizajes reutilizables

| Clasificación | Hallazgo, razón y sesión | Riesgo |
|---|---|---|
| Adoptar como patrón | Estado de jornada visible y acciones contextuales de entrada/salida/pausa; reduce errores de usuario. **S4, S7.** Implementar desde cero. | Medio: las transiciones e idempotencia deben ser de servidor. |
| Adoptar como patrón | Corrección solicitada como flujo separado de la marca original, no como edición directa. **S6, S9.** | Medio: asegurar evento correctivo, aprobador y cadena de auditoría append-only. |
| Adaptar conceptualmente | PWA que no cachea la API de fichajes. **S4, S7, S11.** | Medio: definir UX explícita de red caída; no prometer offline completo. |
| Adaptar conceptualmente | Informe mensual legible para trabajador. **S7, S9.** | Medio: el servidor debe generar una exportación reproducible con metadatos/auditoría. |
| Investigar más | Pausas tipificadas y regla «cuenta/no cuenta como trabajo». **S3, S4, S5.** | Alto: no deducir reglas de convenio; configurar y revisar por empresa. |
| Rechazar | Credenciales de API en variables `VITE_*` y reenvío de contraseña en peticiones de negocio. **S1, S4.** | Crítico: exposición de secreto y modelo de autenticación contrario a S1. |
| Rechazar | Copia de código/UI o fork AGPL. **S0–S12.** | Crítico: copyleft de red y deuda de integración. |

## 2. jamataran/fichaje

### Estado, mantenimiento y madurez

- Repositorio público, fork de `alejandroferrin/fichajespi`, con 117 commits, documentación de Docker, setup, wiki, CI/CD y CodeQL. En la consulta mostraba 11 issues y 3 PR en el repositorio principal. [Repositorio](https://github.com/jamataran/fichaje), [README](https://github.com/jamataran/fichaje/blob/main/README.md), [Wiki](https://github.com/jamataran/fichaje/wiki).
- El último commit inspeccionado (`fb28270`) es del 24/02/2026; muestra mantenimiento, pero la última release pública es `0.0.1` y GitHub la describe como «Versión inicial», incluida la transición de MIT a AGPL. Señal de empaquetado/release inmaduro para producción. [Releases](https://github.com/jamataran/fichaje/releases).
- Hay monorepo y automatización de build, pero el workflow CI tiene lint y tests comentados; sólo se localizaron cuatro archivos de prueba. La antigüedad de Angular 13, Spring Boot 2.5.1, Java 11, Node 16 en Docker frontend y Nginx 1.17.1 agrava el riesgo de mantenimiento y vulnerabilidades. No se realizó escaneo CVE: hay que hacerlo antes de cualquier despliegue.

### Licencia y posibilidades de reutilización

El repositorio muestra `LICENSE` AGPL-3.0 y la release indica el cambio desde MIT a GNU AGPL v3. Como es un fork, además debe verificarse la trazabilidad de licencias de todos los commits heredados y dependencias. [Licencia](https://github.com/jamataran/fichaje/blob/main/LICENSE), [release y cambio de licencia](https://github.com/jamataran/fichaje/releases).

| Forma de uso | Dictamen | Obligación/riesgo |
|---|---|---|
| Fork, código backend/frontend, Docker o entidades | **No autorizado para el MVP** | Riesgo AGPL de interacción remota, atribución/avisos y compatibilidad de la historia del fork. Incompatible además con stack y alcance. |
| Inspiración funcional o de módulos | Permitido como aprendizaje | Formular requisitos propios; no copiar tablas, DTOs, textos, CSS ni algoritmos. |
| Referencia UX | Desaconsejada salvo pantallas concretas y rediseño independiente | La experiencia incluye escritorio y geolocalización, contrarios al producto. |

> **VALIDACIÓN JURÍDICA OBLIGATORIA:** antes incluso de reutilizar un fragmento, revisar el historial del fork, avisos de terceros y las obligaciones AGPL aplicables al SaaS. Un repositorio público no concede permisos adicionales a los de su licencia.

### Arquitectura, stack y seguridad

- Monorepo pnpm/Turborepo: backend Java 11/Spring Boot 2.5.1/JPA/MySQL; frontend Angular 13/TypeScript; aplicación Java de escritorio; web/landing Astro y proxy Caddy. Es un sistema más amplio, pero incompatible con Next.js/PostgreSQL y con la decisión de web/PWA sin app nativa.
- Expone REST con controladores/DTOs y Swagger antiguo, JWT, bcrypt y roles Admin/Supervisor/Empleado. Docker separa proxy, frontend, backend y MySQL: puede inspirar la operación de un entorno dedicado, pero no constituye monolito modular Next.js ni automatiza el ciclo completo de alta/migración/backup/rollback por cliente.
- La persistencia usa entidades JPA genéricas y servicios/controladores con `PUT`/`DELETE`; se localizaron pantallas y servicios que permiten editar/eliminar incidencias, y un `CommonService.delete` basado en `repository.deleteById`. No hay evidencia de protección de fichajes originales mediante permisos DB ni de una cadena hash append-only. Es incompatible con S1/S6/S9 hasta rediseñarlo desde cero.
- Hay CodeQL y CI, pero no ejecución obligatoria de tests/lint, ni evidencia en la revisión de MFA administrativa, rate limit, backup/restauración probado, SBOM, observabilidad, segregación de secretos o tests de autorización. Las credenciales iniciales de administrador documentadas (`fichajesPi000`) refuerzan la necesidad de bootstrap seguro; no adoptar ese patrón.

### Funcionalidad de control horario

- Entrada/salida, perfiles, calendarios, vacaciones/ausencias, incidencias, informes descargables y acceso del empleado a registros propios; además roles y API keys. El README declara sello temporal, retención y auditoría. [Funciones y nota de cumplimiento](https://github.com/jamataran/fichaje#-cumplimiento-normativo-espa%C3%B1ol---rdl-82019).
- No se encontró soporte QR/PIN/kiosco ni pausas explícitas en el flujo de fichaje inspeccionado. Incluye aplicación de escritorio, excluida por el MVP.
- **Geolocalización:** el frontend carga `navigator.geolocation.getCurrentPosition`, muestra latitud/longitud y un mapa Leaflet desde la pantalla de inicio. No se evaluará como funcionalidad a adoptar ni se debe trasladar al diseño: contradice la decisión aprobada de no GPS/geolocalización. [Componente de geolocalización](https://github.com/jamataran/fichaje/tree/main/apps/fichaje-fe/src/app/shared/components/geolocation).

### Privacidad y cumplimiento

- Ubicación precisa es dato personal y la muestra por defecto en el inicio; aunque la revisión no halló una persistencia de coordenadas en el backend, pedirla y visualizarla ya eleva el riesgo de minimización, transparencia, base jurídica, proporcionalidad laboral y DPIA. **No inferir que no se almacene** sin revisar tráfico, backend y configuración.
- El README se presenta como diseñado para cumplir RDL 8/2019, RGPD y retención mínima de cuatro años, pero matiza que el cumplimiento depende de asesoría legal. La revisión no halló pruebas verificables de una garantía integral (inmutabilidad, acceso RLT/Inspección, configuración por convenio, retención aplicada, ni auditoría inalterable). No trasladar la etiqueta «RGPD compliant» ni prometer cumplimiento automático.
- El uso de CRUD y borrado genérico es una señal contraria al requisito de conservar fichajes y correcciones aditivas. Separar datos de jornadas de incidencias generales no soluciona el problema sin un modelo de eventos y permisos de BD.

### Aprendizajes reutilizables

| Clasificación | Hallazgo, razón y sesión | Riesgo |
|---|---|---|
| Adoptar como patrón | Calendario laboral configurable y reportes por persona, como capacidades de negocio a definir con contratos propios. **S3, S8, S9.** | Medio: no codificar convenios ni convertir el calendario en interpretación legal automática. |
| Adaptar conceptualmente | Imagen Docker por capa de aplicación y datos para un cliente. **S12.** | Alto: rediseñar para Next.js/PostgreSQL, secretos, backups y automatización por entorno. |
| Investigar más | Roles admin/supervisor/empleado y acceso del trabajador a sus registros. **S1, S7, S8.** | Alto: mapear a permisos atómicos S0, servidor y pruebas de denegación. |
| Investigar más | Exportación CSV/reportes y API documentada. **S9.** | Medio/alto: validar campos, trazabilidad, acceso de RLT/Inspección y reproducibilidad. |
| Rechazar | Geolocalización, coordenadas y mapa. **S4, S10.** | Crítico: vulnera el alcance aprobado y aumenta riesgos RGPD/laborales. |
| Rechazar | CRUD/borrado genérico aplicado a dominio de jornada. **S1, S6, S9.** | Crítico: quebraría registros originales, retención y auditoría append-only. |
| Rechazar | App de escritorio y fork/copia AGPL. **S0, S7, S12.** | Alto/crítico: fuera de alcance, copyleft e incompatibilidad técnica. |

## Comparativa final

| Criterio | openjornada-trabajadores | jamataran/fichaje | Recomendación para nuestro proyecto |
|---|---|---|---|
| Actividad/documentación | Activo al 07/09/2026; releases frecuentes; documentación clara; comunidad mínima. | Activo al 24/02/2026; documentación amplia; una única release 0.0.1; fork. | Referencias puntuales, nunca evidencia de madurez productiva. |
| Licencia/reutilización | AGPL-3.0. | AGPL-3.0, más riesgo de procedencia por ser fork. | No copiar, no forkear, no incorporar dependencias; sólo aprendizaje independiente. |
| Encaje de stack | React/TS sí; Vite SPA y API externa no; sin DB/backend. | Angular/Java/Spring/MySQL/desktop; incompatibilidad alta. | Mantener Next.js/TS/PostgreSQL/monolito modular. |
| Fichaje MVP | Buen flujo web de trabajador, pausas e incidencias/correcciones. Sin QR/PIN/kiosco probado. | Entrada/salida, calendarios, informes, pero sin pausas/QR/PIN verificadas. | Tomar de OpenJornada la claridad del flujo, desde cero. |
| Inmutabilidad/auditoría | No verificable sin API/backend. | Declara auditoría, pero CRUD/borrado genérico contradice el patrón requerido. | Diseñar eventos originales + correcciones aditivas y auditoría DB append-only propios. |
| Privacidad | Sin geolocalización detectada en la SPA; secretos/contraseñas en cliente son riesgo. | Geolocalización/mapa visible; riesgo elevado. | Privacidad por defecto: QR/PIN, sin ubicación/biometría/foto/vídeo. |
| Despliegue dedicado | Contenedor de frontend, sin operación de entorno completo. | Compose multi-contenedor, pero sin automatización completa por cliente. | Construir S12 propio con automatización, BD/backups/secretos/almacenamiento aislados. |
| Calidad/seguridad | TypeScript/lint y cuatro tests; no suficiente evidencia de seguridad. | CI/CodeQL, pero tests/lint desactivados y runtime legado. | Aplicar S11/S12, análisis de dependencias y pruebas de autorización/backup antes del piloto. |

## Decisiones y próximos controles

1. Mantener la decisión aprobada de **no reutilizar código AGPL ni dependencias de estos repositorios**. OpenJornada puede consultarse como referencia de UX; Fichaje sólo como referencia de riesgos y de alcance administrativo.
2. Para S4/S6, convertir en criterios de aceptación propios: transiciones de entrada/salida/pausa idempotentes, sin API cacheada; la corrección crea un nuevo evento enlazado al original y su aprobación queda auditada.
3. Para S1/S9, prohibir secretos en bundle cliente y password replay como mecanismo de autorización; conservar sesiones del servidor, RBAC atómico, auditoría append-only y exportaciones reproducibles.
4. Para S10, añadir prueba de ausencia de permisos/SDK/campos de geolocalización, biometría, foto, vídeo y reconocimiento facial. La ausencia de código en una referencia no equivale a control en nuestro producto.
5. Antes de piloto, cumplir las puertas existentes: abogado laboralista, DPO, revisión de seguridad, pruebas de aislamiento, restauración real y validación de reglas/calendarios por cliente. No usar declaraciones de los repositorios como certificación legal.

## Fuentes externas consultadas

- [OpenJornada: repositorio y README](https://github.com/openjornada/openjornada-trabajadores), [releases](https://github.com/openjornada/openjornada-trabajadores/releases), [licencia](https://github.com/openjornada/openjornada-trabajadores/blob/main/LICENSE), consultados el 10/09/2026.
- [Fichaje: repositorio y README](https://github.com/jamataran/fichaje), [releases](https://github.com/jamataran/fichaje/releases), [licencia](https://github.com/jamataran/fichaje/blob/main/LICENSE), consultados el 10/09/2026.
- [Texto oficial GNU AGPL v3](https://www.gnu.org/licenses/agpl-3.0.html), consultado como referencia de licencia el 10/09/2026.

Las fechas de commits y los recuentos de GitHub son fotografías de consulta; pueden variar. Los hashes revisados fueron `925fd6bebbfe47abc3df4f4cdf8630b1ecd67c` (OpenJornada) y `fb28270c9265df3d2b3f81e581f966e5c796adde` (Fichaje).
