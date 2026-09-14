# Atlas Operativo de Delivery — guía reutilizable de implantación

**Propósito:** plantilla independiente para implantar un sistema de delivery por historias, roles y agentes en otro proyecto. No es la fuente de trabajo de TimeControlApp y no debe recibir sus datos, decisiones, clientes ni secretos.

## Resultado que busca

Un equipo dispone de un backlog gobernable, una entrada manual de trabajo, historias verificables, roles con límites, trazabilidad Git y puertas humanas para merge/despliegue. Los agentes aceleran artefactos concretos; no sustituyen producto, seguridad, legalidad u operación.

## Cómo usar este Atlas en un proyecto nuevo

1. Copiar el directorio al repositorio destino antes de configurar herramientas.
2. Sustituir los marcadores `[PROYECTO]`, `[PO]`, `[STACK]`, `[RIESGOS]` y `[WORKFLOW GIT]` mediante una decisión humana.
3. Ejecutar las fases de [implantación](01-implantacion.md) en orden; no activar automatizaciones al principio.
4. Elegir una herramienta Kanban tras evaluar coste, residencia, DPA, acceso y trazabilidad del proyecto destino.
5. Aprobar roles y puertas, hacer discovery/backlog y probar el proceso con 3–5 historias antes de crear agentes persistentes o integraciones.

## Contenido

- [01 — Plan de implantación](01-implantacion.md)
- [02 — Contratos y asignación de roles](02-roles-y-asignacion.md)
- [03 — Plantillas operativas](03-plantillas-operativas.md)
- [04 — Seguridad, incidentes y gobierno](04-seguridad-y-gobierno.md)

## Límites universales

No asumir precios, modelos, límites de proveedor ni residencia de datos: verificarlos en la fecha de la implantación. No introducir PII, secretos o datos de producción en tableros/prompts. No automatizar merge, despliegue o cambios de producción sin aprobación humana verificable. Adaptar siempre los controles a los requisitos legales, sectoriales y de seguridad del proyecto destino.
