# Matriz operativa — roles, modelos y aprobación

**Regla:** el modelo asiste; las personas autorizadas deciden. Disponibilidad/modelos a reconfirmar en cada sesión.

| Trabajo | Rol líder | Participan | Modelo inicial | Elevar a | Aprobación/bloqueo |
|---|---|---|---|---|---|
| Triage y plantilla | PM/analista | PO | `gpt-5.6-luna` | Terra si hay ambigüedad | PO para prioridad/alcance |
| Criterios y exclusiones | PM/analista | UX, QA, privacidad | Terra | Sol/Astra si afecta legal/datos | PO; DPO/jurídico cuando corresponda |
| ADR/arquitectura transversal | Arquitectura | backend, seguridad, SRE | Sol | Astra | PO para decisión duradera |
| Diseño UI/a11y | UX | PM, frontend, QA | Terra | Sol para flujo complejo | PO si cambia alcance |
| Implementación acotada | Frontend o backend | QA | Terra/Sol | Sol/Astra por riesgo | Revisor técnico + checks |
| Migración/auditoría/RBAC/exportación | Backend | arquitectura, seguridad, QA | Sol alto | Astra alto/máximo | PO + revisor independiente; no paralelizar |
| Pruebas/regresión | QA | implementador | Terra/Sol | Astra si evidencia contradictoria | QA puede bloquear; PO acepta residual |
| Seguridad/privacidad | Seguridad | DPO, arquitectura, QA | Sol alto | Astra alto/máximo | DPO/PO; no aprobación automática |
| Infraestructura/backup/despliegue | SRE/DevOps | seguridad, QA | Sol | Astra | autoridad de entorno + PO; producción explícita |
| Revisión de PR alto riesgo | Revisor independiente | QA, seguridad | Sol/Astra distinto del implementador | Astra | merge por persona autorizada |
| Métricas/marketing | Datos o GTM | PO, privacidad | Luna/Terra | Sol | PO, DPO/jurídico para datos o claims |

## Disparadores de escalado

- Subir a Sol/Astra y exigir revisión cruzada si toca datos personales, exportación, identidad, MFA/RBAC, auditoría append-only, migración, secreto, infraestructura, DPA/RGPD, requisitos laborales o más de un módulo propietario.
- No usar agentes paralelos si dos tareas editan la misma tabla/migración/ruta/módulo o si el contrato de eventos aún no está aprobado.
- Máximo dos intentos equivalentes. Tras ellos: dividir tarea, mejorar evidencia o escalar de modelo/rol.
- Contexto mínimo: contrato + ADR + paths/diff + tests relevantes. Nunca `.env`, secretos, PII o base de datos real.

## Separación de funciones

El agente/rol que implementa no revisa su propia historia de alto riesgo. QA valida la evidencia; seguridad/privacidad evalúa controles; PO acepta alcance/riesgo; SRE sólo despliega con autorización. Ningún modelo mueve por sí solo un estado a merge, despliegue o cierre.
