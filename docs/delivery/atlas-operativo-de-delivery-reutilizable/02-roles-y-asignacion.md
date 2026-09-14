# 02 — Contratos y asignación de roles

## Patrón de contrato de rol

Cada rol debe definir: misión, límites, entradas autorizadas, entregables, criterios de calidad, autoridad, disparadores, hand-off, conflictos, modelo/herramientas permitidos, privacidad y escalado. Mantener el contrato en Markdown versionado; no ocultarlo en un prompt.

## Roles mínimos genéricos

| Rol | Resultado | Límite |
|---|---|---|
| PO | Prioridad, alcance y aceptación explícita | No delega aprobación a agentes |
| Analista | Historia verificable y exclusiones | No inventa requisitos |
| Implementador | Cambio acotado y pruebas | No aprueba su cambio crítico |
| QA/revisor | Evidencia independiente y hallazgos | No acepta riesgo de negocio |
| Seguridad/privacidad | Controles y bloqueo justificado | No sustituye a jurídico/DPO |
| SRE | Operación autorizada y rollback | No despliega sin autoridad |

Activar UX, arquitectura, datos o GTM por disparador, no por defecto. Mantener un registro por historia: rol+versión, responsable, modelo, entradas, salida, autoridad, límite de reintentos y receptor.

## Separación obligatoria

Para datos, identidad, RBAC, pagos, auditoría, infraestructura, exportación o producción: implementador, QA/revisor y decisor humano deben ser funciones distintas. Dos agentes con prompts parecidos no equivalen a revisión independiente.
