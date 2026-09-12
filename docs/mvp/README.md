# Fuente de verdad — MVP de control horario

Estado: **S1–S12 integradas; S13 validada con NO-GO para datos reales; ampliación prepiloto planificada, no implementada.** Fecha de revisión: 11/09/2026.

Este directorio es el contrato inicial de delivery. No se implementará una sesión hasta que sus decisiones previas estén aprobadas y se use su fichero como contrato de trabajo.

## Producto y segmento

Aplicación web responsive para pymes y empresas medianas españolas generalistas afectadas por la regulación de control de tiempo, con uno o más centros. Debe permitir un registro de jornada verificable, con métodos no invasivos, reglas visibles y exportación auditable. Las asesorías podrán ser canal futuro, pero no definen el ICP inicial.

**Propuesta de valor:** control horario sencillo y verificable para pymes españolas: fichajes no invasivos, reglas transparentes y registros auditables para empleados, asesorías e Inspección.

## Alcance MVP

Incluye: multiempresa básico; empresa, centros y empleados; autenticación y roles; reglas básicas de jornada/calendario/pausas; fichaje web responsive y kiosco QR/PIN; entrada, salida y pausa; incidencias; correcciones y aprobación; cálculo de tiempo y excesos; vistas de empleado y administración; auditoría; CSV/PDF; retención, seguridad, datos demo y despliegue piloto.

Se aplaza: portal de asesoría avanzado, importación Excel guiada, conectores de nómina, SSO, turnos rotativos complejos, PWA offline completa y API pública.

Fuera de alcance: biometría, reconocimiento facial, GPS continuo, geolocalización por defecto, videovigilancia, monitorización de pantalla, nómina propia, IA de productividad, app nativa, hardware propio e interpretación automática de convenios.

## No negociables de cumplimiento

- Inicio y fin individual diario; conservación de registros durante cuatro años.
- Acceso/exportación para empleado, RLT e Inspección, conforme a permisos aplicables.
- Correcciones aditivas: nunca sobrescribir ni borrar el evento original.
- Auditoría de eventos, decisiones, accesos administrativos y exportaciones.
- Privacidad por defecto: sin biometría, reconocimiento facial, foto o GPS en el MVP.
- Aislamiento estricto por empresa, mínimo privilegio, cifrado, MFA de administradores, backups probados y datos demo sintéticos.
- No prometer cumplimiento automático ni interpretar convenios; configuración revisable por asesoría.

## Decisiones que requieren aprobación

| Decisión | Recomendación | Límite | Afecta |
|---|---|---|---|
| ICP inicial | **Aprobado:** pymes y medianas generalistas afectadas por regulación de control de tiempo | Cerrado | S0, S1, S2, S8, S9 |
| Métodos de fichaje | **Aprobado:** web responsive + QR/PIN; sin GPS ni biometría | Cerrado | S0, S4, S7, S10 |
| Canales | **Aprobado:** web responsive/PWA, sin app nativa | Cerrado | S0, S4, S7 |
| Pausas | **Aprobado:** manual y visible; reglas configurables; sin descuento automático por defecto | Cerrado | S3, S4, S5 |
| Aprobaciones | **Aprobado:** sólo correcciones e incidencias | Cerrado | S6, S8 |
| Integraciones | **Aprobado:** CSV primero; sin conector de nómina MVP | Cerrado | S9 |
| Tenancy | **Aprobado:** entorno dedicado por cliente —aplicación, PostgreSQL, almacenamiento, secretos y backups aislados— aprovisionado automáticamente | Cerrado | S1, S2, S8, S9, S12 |
| Idiomas | **Aprobado:** sólo español; preparado para i18n | Cerrado | S7, S8 |
| Piloto/comercial | **Aprobado:** piloto asistido y prueba gratuita de 14 días; billing fuera del MVP | Cerrado para MVP | S12 |
| Arquitectura | **Aprobado:** monolito modular; no microservicios en MVP | Cerrado | S0–S12 |
| Datos | **Aprobado:** PostgreSQL como núcleo transaccional | Cerrado | S1, S3–S6, S9 |
| Stack | **Aprobado:** TypeScript, Next.js y PostgreSQL; UI web responsive/PWA | Cerrado | S0, S1, S7, S8, S11, S12 |
| Despliegue | **Aprobado:** Docker y despliegue automatizado por cliente/entorno dedicado | Cerrado | S12 |

## Dependencias y orden

`S0 → S1 → {S2,S3,S4,S10,S11,S12} → {S5,S6,S7} → S8 → S9 → S13 → S14 → S17 → S18 → S15 → S16 → piloto asistido`.

S9 también depende de contratos de S1, S4, S5 y S6. S11 y S10 son carriles continuos; S12 empieza tras S1. S15 es puerta obligatoria para datos reales. S14 puede auditar/preparar UI en paralelo con S15; S16 consume el sistema visual S14 y no activa exportación visible hasta cerrar almacenamiento/retención S15.

## Sesiones y contratos

| Sesión | Contrato | Tamaño | Ejecución |
|---|---|---:|---|
| S0 | [00-contratos-y-decisiones.md](00-contratos-y-decisiones.md) | M | Documentada; pendiente revisión de consumidores |
| S1 | [01-fundaciones.md](01-fundaciones.md) | L | Secuencial |
| S2 | [02-empresa-y-personas.md](02-empresa-y-personas.md) | M | Paralela tras S1 |
| S3 | [03-jornada-y-reglas.md](03-jornada-y-reglas.md) | L | Paralela tras S1 |
| S4 | [04-fichaje-y-pausas.md](04-fichaje-y-pausas.md) | L | Implementada en código; pendiente integración PostgreSQL/E2E |
| S5 | [05-motor-de-calculo.md](05-motor-de-calculo.md) | L | Tras S3/S4 |
| S6 | [06-correcciones-y-aprobaciones.md](06-correcciones-y-aprobaciones.md) | M | Tras S4 |
| S7 | [07-vista-empleado.md](07-vista-empleado.md) | M | Tras S4 |
| S8 | [08-vista-administracion.md](08-vista-administracion.md) | M | Tras S2/S5/S6 |
| S9 | [09-auditoria-y-exportacion.md](09-auditoria-y-exportacion.md) | L | Tras contratos de eventos |
| S10 | [10-privacidad-y-cumplimiento.md](10-privacidad-y-cumplimiento.md) | M | Continua tras S1 |
| S11 | [11-qa-y-datos-demo.md](11-qa-y-datos-demo.md) | M | Continua |
| S12 | [12-despliegue-y-observabilidad.md](12-despliegue-y-observabilidad.md) | M | Paralela tras S1 |
| S13 | [13-validacion-e2e-y-preparacion-piloto.md](13-validacion-e2e-y-preparacion-piloto.md) | M | Automatización y recorrido visual completados; NO-GO por operación/compliance |
| S14 | [14-ui-ux-y-experiencia-piloto.md](14-ui-ux-y-experiencia-piloto.md) | M | Muy recomendable; UX/accesibilidad sin nuevas reglas |
| S15 | [15-cierre-operativo-y-cumplimiento-prepiloto.md](15-cierre-operativo-y-cumplimiento-prepiloto.md) | M | Obligatoria; puerta de datos reales |
| S16 | [16-configuracion-y-exportacion-guiadas.md](16-configuracion-y-exportacion-guiadas.md) | M | Muy recomendable; requiere decisión sobre autoservicio mínimo |
| S17 | [17-evolucion-integral-de-producto.md](17-evolucion-integral-de-producto.md) | M | Evaluación y prioridad de S18 aprobadas; conserva límites y NO-GO de S15 |
| S18 | [18-experiencia-diaria-y-jornada-en-curso.md](18-experiencia-diaria-y-jornada-en-curso.md) | M | Finalizada: fuente read-only S5, proyección/API, recorrido visual, E2E sintética, aislamiento y regresión Docker validados |

## Base transversal publicada por S0

- ADRs: [plataforma y aislamiento](adr-0001-plataforma-y-aislamiento.md), [autenticación](adr-0002-autenticacion.md), [roles y permisos](adr-0003-roles-y-permisos.md), [fechas y zona horaria](adr-0004-fechas-y-zona-horaria.md), [auditoría inmutable](adr-0005-auditoria-inmutable.md).
- [Modelo de dominio](01-modelo-de-dominio.md), [contratos de integración](02-contratos-integracion.md), [convenciones y mocks](03-convenciones-y-mocks.md) y [aceptación/riesgos](04-aceptacion-y-riesgos-s0.md).

## Convenciones de integración

- Cada sesión es propietaria de sus módulos, rutas, pruebas y tablas; no edita dominios ajenos sin acuerdo explícito.
- S0 define OpenAPI, eventos, tipos, errores, RBAC, fechas y auditoría antes de código.
- Persistir fechas en UTC; presentar usando zona IANA de centro/empleado. Probar medianoche y cambio horario.
- Migraciones prefijadas por sesión y revisadas antes de integrar.
- Usar interfaces/mocks cuando el proveedor real no exista; integrar con pruebas de contrato.
- Todo acceso se autoriza por tenant y rol en servidor; la UI nunca es el control de seguridad.
- Un cliente equivale a un entorno dedicado: aplicación, base de datos, almacenamiento de exportaciones, secretos y backups no se comparten con otros clientes.
- El aprovisionamiento, migración, actualización, backup y rollback de entornos dedicados debe estar automatizado antes del piloto; no se acepta operación manual recurrente.
- El MVP se construye como monolito modular en TypeScript/Next.js con PostgreSQL y Docker; introducir servicios separados requiere ADR y aprobación posterior.

## Puertas de calidad antes del piloto

Revisión de abogado laboralista y DPO; pruebas de aislamiento entre tenants; correcciones inmutables; exportaciones completas y reproducibles; casos de zona horaria/jornada partida; restauración de backup real; sin datos reales en demo; validación de convenio, calendario y reglas por cada piloto.

## Estado posterior a S13 y decisiones pendientes

S13 confirmó los flujos funcionales con datos sintéticos y no encontró P0. El P1 S13-005 mantiene el **NO-GO**: faltan TLS/proxy/WAF/rate limit reales, restauración operativa, retención/borrado de exportaciones y cierres DPO/laboral/operación. Véase la [evaluación prepiloto](evaluacion-ampliacion-prepiloto.md).

Decisiones pendientes del propietario: proveedor/región/coste y RPO/RTO; política de retención/bloqueo y responsables de soporte; aprobaciones DPO, DPA y asesoría laboral; condición Go; límite de rediseño S14; si S16 es obligatorio o se acepta un piloto asistido con configuración/exportación técnica; y protocolo de feedback minimizado de S15. S18 está finalizada y consume la fuente efectiva read-only aprobada por S5 sin reimplementar su algoritmo ni leer internals ajenos. Importación CSV/Excel, notificaciones, cierre de período y vacaciones/ausencias permanecen fuera del ciclo hasta obtener evidencia durante piloto.
