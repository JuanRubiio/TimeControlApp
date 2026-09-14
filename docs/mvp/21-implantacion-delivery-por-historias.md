# S21 — Implantación controlada de delivery por historias

**Estado:** selección de herramienta aprobada el 13/09/2026; la configuración sigue pendiente de autorización explícita. **Tamaño estimado:** S. **Naturaleza:** preparación documental y de proceso; no autoriza instalar, conectar, migrar, automatizar, crear aplicaciones, usar tokens ni desplegar.

## Objetivo

Preparar el proceso aprobado de delivery mediante historias de usuario, roles, revisiones y Kanban, conservando GitHub/Git como fuente de código y los contratos Markdown como fuente documental. La herramienta **aprobada para uso interno** es GitHub Free Projects + Issues; OpenProject autoalojado sólo es alternativa para evaluación posterior de soberanía.

## Dependencias

- Aprobación por escrito de [evaluación de delivery](../delivery/evaluacion-trabajo-por-historias-y-agentes.md), [plantilla](../delivery/plantilla-historia-usuario.md), [matriz](../delivery/matriz-roles-y-modelos.md) y [Kanban](../delivery/propuesta-kanban.md).
- Designación de PO, revisor técnico, responsable de seguridad/privacidad y autoridad de despliegue.
- Mantener S15 como puerta de datos reales y no alterar sus pendientes, el Go/No-Go, los contratos de módulos ni el workflow Git.

## Alcance permitido tras aprobar esta sesión

1. Confirmar los tipos, campos, estados, límites WIP y permisos humanos de la propuesta.
2. Crear ejemplos **documentales** de una épica y tres historias con datos sintéticos en `docs/delivery/`, si el PO lo pide.
3. Preparar un ADR de elección de herramienta con edición, coste, DPA, región, retención, SSO, auditoría y responsable de operación **por confirmar**.
4. Definir checklist de implantación futura, prueba sintética y plan de reversión sin ejecutar ninguno.
5. Aplicar la [guía operativa interna](../delivery/guia-operativa-delivery-interno.md): preparar la sesión manual de discovery/backlog, la plantilla de Intake, la clasificación de candidatas y la separación de sesiones de análisis, implementación y revisión. El discovery sólo producirá documentación y propuestas; no abrirá trabajo técnico ni configurará el tablero.
6. Aprobar el [modelo contractual de roles y agentes](../delivery/modelo-contratos-roles-agentes.md): estructura de reglas universales, contratos de rol y registro de asignación por historia. No crear `AGENTS.md`, skills o agentes persistentes hasta que los contratos se hayan aprobado y probado manualmente.
7. Adoptar el kit mínimo operativo: [Definition of Ready](../delivery/definition-of-ready.md), [encargo de sesión](../delivery/plantilla-encargo-sesion.md), [registro de decisiones/riesgos](../delivery/registro-decisiones-riesgos-excepciones.md), [puertas de calidad](../delivery/matriz-puertas-calidad.md) y [protocolo de incidente](../delivery/protocolo-incidente-proceso.md). Su adopción sigue siendo documental hasta una autorización posterior de configuración.
8. Preparar la [guía de conexión segura con GitHub Projects e Issues](../delivery/guia-conexion-codex-github-projects-issues.md), empezando por el modo manual. La autenticación de CLI, token, GitHub App, webhook o automatización siguen prohibidos hasta que exista autorización separada.

## Fuera de alcance explícito

- Instalar, autoalojar o configurar OpenProject, Plane, GitLab, Taiga o cualquier otra herramienta.
- Crear/configurar GitHub Project, Issues, Apps, webhooks, Actions, secretos, tokens, OAuth, SSO o integraciones.
- Migrar issues, documentos, código, datos, usuarios o historial.
- Crear automatizaciones, agentes persistentes, jobs programados, pipelines, cambios de producción o despliegues.
- Usar PII, datos de empleados/clientes, registros reales, backups, secretos o `.env`.
- Alterar funcionalidad TypeScript/Next.js/PostgreSQL, migraciones, contratos de dominio o el NO-GO vigente.

## Criterios de aceptación

- Existe una decisión PO trazable sobre herramienta, fuente de verdad, responsables y riesgo aceptado.
- Las plantillas y reglas distinguen sugerencia de agente, revisión, aprobación, merge y despliegue.
- El plan de configuración futura define mínimo privilegio, token efímero/App si se autoriza, entorno sintético, registro de auditoría, kill switch y reversión.
- No hay cambios fuera de documentación aprobada ni conexiones a servicios.
- La guía deja definido que el flujo se inicia manualmente por el PO desde una sesión nueva de Codex, empieza por discovery/backlog antes de implementar, y mantiene S15/NO-GO como prioridad y bloqueo vigente.
- Los roles activos/bajo demanda, sus incompatibilidades y la plantilla de asignación quedan aprobados antes de abrir la primera sesión de trabajo por historias. No se configura ningún agente persistente como sustituto de esta aprobación.
- El kit mínimo operativo tiene responsables humanos, encaja con S15/NO-GO y no añade tratamiento de datos reales, automatizaciones ni conexiones.

## Decisiones que siguen requiriendo aprobación separada

1. Configurar siquiera el Project/Issues recomendado en GitHub.
2. Cualquier compra, DPA, residencia, SSO, integración o emisión de secreto/token.
3. Cualquier automatización de estados, comentarios, PR, CI/CD o despliegue.
4. Cualquier acceso a datos reales o cambio del Go/No-Go S15.
