# Atlas Operativo de Delivery — guía reutilizable de implantación

**Propósito:** plantilla independiente para implantar un sistema de delivery por historias, GitHub Issues, GitHub Project, pull requests y puertas humanas en otro proyecto. No es la fuente de trabajo de TimeControlApp y no debe recibir sus datos, decisiones, clientes ni secretos.

## Resultado que busca

Un equipo dispone de un backlog gobernable, una entrada manual de trabajo, historias verificables, roles con límites, trazabilidad entre Issue, Project, rama y PR, y puertas humanas para merge/despliegue. Los agentes aceleran artefactos concretos; no sustituyen producto, seguridad, legalidad u operación.

## Flujo operativo de referencia

```text
Intake → Refinamiento → Lista para desarrollo → En desarrollo → En revisión
  ↑          │                 │                     │               │
  └─ PO pide completar/        └─ PO autoriza        └─ PR +         └─ validación
     rechaza                     inicio                 pruebas         técnica y E2E
                                                                    ↓
                                                    Lista para merge → Merged → Desplegada/Cerrada
```

El Project refleja el estado de delivery; la Issue conserva el contexto y decisiones; Git y la PR contienen el cambio y su evidencia. Ninguna flecha es automática por defecto. El PO decide prioridad, alcance, entrada a desarrollo, aceptación de producto y cierre; la persona autorizada para integrar decide el merge tras las verificaciones requeridas.

## Cómo usar este Atlas en un proyecto nuevo

1. Copiar el directorio al repositorio destino antes de configurar herramientas.
2. Sustituir los marcadores `[PROYECTO]`, `[PO]`, `[STACK]`, `[RIESGOS]` y `[WORKFLOW GIT]` mediante una decisión humana.
3. Ejecutar las fases de [implantación](01-implantacion.md) en orden; no activar automatizaciones al principio.
4. Configurar GitHub Issues y un GitHub Project con los estados y campos mínimos descritos en este atlas, tras evaluar coste, residencia, DPA, acceso y trazabilidad del proyecto destino.
5. Aprobar roles y puertas, hacer discovery/backlog y probar el proceso con 3–5 historias, incluida al menos una PR y una validación E2E, antes de crear agentes persistentes o integraciones.

## Contenido

- [01 — Plan de implantación](01-implantacion.md)
- [02 — Contratos y asignación de roles](02-roles-y-asignacion.md)
- [03 — Plantillas operativas](03-plantillas-operativas.md)
- [04 — Seguridad, incidentes y gobierno](04-seguridad-y-gobierno.md)

## Principios reutilizables

- Una historia tiene una única Issue propietaria; una rama y una PR por Issue es la norma.
- El estado sólo se adelanta con evidencia enlazada y la persona con autoridad correspondiente.
- `Merged` significa integrado en la rama base; no significa desplegado, aceptado en producción ni cerrado por el PO.
- La validación E2E usa datos sintéticos y cubre el recorrido de usuario relevante antes de autorizar el merge cuando el cambio afecta un flujo integrado.
- El Project ayuda a coordinar; no sustituye la Issue, la PR, los contratos versionados ni las decisiones humanas.

## Límites universales

No asumir precios, modelos, límites de proveedor ni residencia de datos: verificarlos en la fecha de la implantación. No introducir PII, secretos o datos de producción en tableros/prompts. No automatizar merge, despliegue o cambios de producción sin aprobación humana verificable. Adaptar siempre los controles a los requisitos legales, sectoriales y de seguridad del proyecto destino.
