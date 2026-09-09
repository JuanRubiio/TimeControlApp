# S0 — Criterios de aceptación y riesgos abiertos

## Aceptación de S0

- [ ] ADR-0001 a ADR-0005 están enlazados y no contradicen las decisiones aprobadas.
- [ ] S1 puede implementar identidad, MFA administrativo, sesiones, RBAC, auditoría append-only y contratos base sin elegir requisitos de producto no aprobados.
- [ ] S2–S4 pueden crear sus módulos en paralelo usando el modelo, contratos HTTP/eventos y puertos temporales publicados.
- [ ] Se especifica autorización en servidor por identidad, permiso, entorno y ámbito; la UI no es control de seguridad.
- [ ] Fechas, zonas IANA, UTC, medianoche y DST tienen reglas y pruebas exigibles.
- [ ] Correcciones, aprobaciones, auditoría y exportación preservan evidencia y no sobrescriben el evento original.
- [ ] Convenciones de migración, pruebas y despliegue respetan entorno dedicado, Docker y automatización por cliente.
- [ ] No se ha creado código de producto, esquema funcional ni migración funcional durante S0.

## Riesgos abiertos y responsables de cierre

| Riesgo | Impacto | Cierre propuesto | Responsable/antes de |
|---|---|---|---|
| Proveedor y recuperación de MFA no concretados | bloqueo o recuperación insegura | ADR técnico de S1, prueba de recuperación auditada | S1 |
| Modelo exacto de incidencias | estados incompatibles con S6 | decidir si especialización de corrección o entidad propia | S6, antes de migración |
| Conservación legal, permisos RLT/Inspección y formato PDF | evidencia insuficiente o exposición | revisión abogado laboralista/DPO y contratos S9/S10 | antes de piloto |
| Estrategia de huella/encadenamiento de auditoría | integridad difícil de probar | diseño técnico, amenaza y prueba de verificación | S1/S9 |
| Backup, restore y rollback por entorno dedicado | pérdida o indisponibilidad | runbook y restore real automatizado | S12, antes de piloto |
| Seguridad de QR/PIN y recuperación de kiosco | suplantación básica | rotación, caducidad, rate limiting y pruebas | S4 |
| Cambio de zona o asignación histórica | cálculos erróneos | casos de vigencia/DST y resolución versionada | S3/S5 |

Cambiar cualquiera de los no negociables —incluido aislamiento, uso de GPS/biometría, app nativa, microservicios o modificación destructiva de evidencia— requiere ADR nuevo y aprobación explícita del propietario del producto.
