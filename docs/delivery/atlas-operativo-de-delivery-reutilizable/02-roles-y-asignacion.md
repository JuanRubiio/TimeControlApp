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

## Autoridad por transición

| Transición | Evidencia mínima | Autoriza / actualiza |
|---|---|---|
| Intake → Refinamiento | problema, usuario y responsable PO | PO o persona delegada explícitamente |
| Refinamiento → Lista para desarrollo | DoR completa, alcance y riesgo aceptados | PO |
| Lista para desarrollo → En desarrollo | Issue, rama, base y responsable registrados | Implementador |
| En desarrollo → En revisión | PR enlazada, pruebas locales/CI y documentación proporcional | Implementador solicita; revisor confirma recepción |
| En revisión → Lista para merge | revisión técnica, QA y E2E requeridos aprobados; riesgos resueltos o aceptados | Revisor/QA y PO cuando afecte aceptación de producto |
| Lista para merge → Merged | checks obligatorios verdes, conversaciones resueltas y aprobación requerida | Integrador autorizado |
| Merged → Desplegada / Cerrada | evidencia de despliegue o aceptación final, según corresponda | Responsable de entorno / PO |

Si falta evidencia, el estado vuelve a la fase que permita resolverla o se marca `Bloqueada`; nunca se avanza para "desatascar" el tablero. La misma persona puede desempeñar varios roles en trabajo de bajo riesgo si el proyecto lo aprueba, salvo las separaciones obligatorias anteriores.
