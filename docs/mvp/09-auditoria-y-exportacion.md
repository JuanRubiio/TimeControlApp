# S9 — Auditoría, trazabilidad y exportación

## Registro de implementación S9 — 10/09/2026

Estado: **implementación inicial completada; falta validar la migración y los flujos HTTP contra PostgreSQL antes de activar un piloto**. S9 es propietaria exclusiva de `exports`: lee eventos, cálculos y correcciones como evidencia y no modifica ninguna tabla ni módulo fuente.

### Diseño, contratos y matriz de acceso

La exportación se crea de forma síncrona a partir de una instantánea canónica (`snapshot`) de las proyecciones de jornada vigentes en el instante de la solicitud, sus eventos ordenados, correcciones/efectos y regla/versiones ya fijadas. CSV y PDF se derivan de esa instantánea, no de reglas, cálculos ni pantallas actuales. El manifiesto conserva parámetros, actor, `generatedAt`, versión de plantilla, hash del snapshot y SHA-256 de los bytes del archivo.

| Perfil | Puede solicitar/descargar |
|---|---|
| Empleado | Sólo su propia persona; requiere sus permisos de lectura propia y `export.*` explícito. |
| Responsable | Personas/centros dentro de sus asignaciones de centro. |
| RR. HH. | No es rol implícito: sólo los permisos y ámbitos RBAC expresamente otorgados. |
| Administrador | Todo el entorno dedicado, con MFA y permisos RBAC existentes. |
| Soporte | Ninguno por defecto; sólo una asignación temporal y auditada de `auditor` con ámbito explícito. |

No existen enlaces públicos, token de descarga, selector de tenant ni acceso permanente externo. Los rechazos se devuelven como autorización denegada sin revelar recursos ajenos.

### Superficie entregada

- `migrations/s009_202609102300_exports.sql`: metadatos, snapshot/manifiesto, hash, estado y expiración de cada exportación. Es aditiva; rollback de aplicación consiste en desactivar las rutas, nunca borrar evidencia.
- `src/exports/{contracts,service,http}.ts`: composición de evidencia, render CSV UTF-8 con BOM, PDF textual legible, SHA-256 y lectura autorizada.
- `POST /api/v1/exports`: `{format, employeeId|siteId, from, to}`; exige alcance concreto, nunca todo el entorno sin filtro. Devuelve ID y manifiesto.
- `GET /api/v1/exports/{id}/download`: descarga autenticada con hash recalculado. No devuelve una URL reutilizable.

El contenido incluye empresa, centro, persona, fecha/zona/período, inicio/fin, pausas, tiempo efectivo y esperado, incidencias, correcciones con fuente/efecto, y regla/version/algoritmo cuando existe cálculo. El exceso permanece sólo dentro de la proyección operativa y no se presenta como nómina, sanción o derecho económico definitivo.

### Almacenamiento, expiración y riesgos

`EXPORT_STORAGE_DIR` permite ubicar los archivos en el directorio exclusivo del entorno dedicado. Si no se configura, el destino local de desarrollo es `.exports`, que debe estar fuera de cualquier publicación web. El archivo temporal vence a los 30 días; el manifiesto y snapshot quedan como evidencia. La eliminación programada del archivo temporal, bloqueo legal, plazos finales de manifiestos y verificación periódica del almacenamiento requieren el job operativo y aprobación DPO/S12: **bloqueo explícito de piloto**. Un archivo que haya vencido no se entrega.

La implementación no constituye garantía de cumplimiento legal automático ni interpretación de convenio. Debe validarse por abogado laboralista/DPO para cada piloto, incluidas las condiciones aplicables a RLT e Inspección.

### Validación realizada y pendientes

- Correcto en Docker con Node 20/PostgreSQL: `npm test` — 60 pruebas en 20 suites, incluido CSV/PDF/hash S9; `npx tsc --noEmit`, `npm run db:check` y `next build` correctos. Las dos migraciones S9 quedaron aplicadas sin modificar la ya registrada.
- Pendiente: integración HTTP sintética completa por los cinco perfiles, comparación contra fixtures fuente S4–S6, descarga tras expiración y prueba de eliminación programada del archivo. No se declara lista para piloto hasta ejecutarlas.

**Objetivo:** producir evidencia reproducible para trabajador, RLT e Inspección. **Tamaño:** L. **Ejecución:** tras contratos de S1/S4/S5/S6.

## Alcance

Propietaria de `exports`, formatos CSV/PDF, manifiesto de período, versión de reglas y huella/hash de exportación. Consume auditoría y eventos sin reescribirlos.

## Entregable y aceptación

Exportación por persona/centro/período, legible y autorizada; incluye inicio/fin, pausas, correcciones y regla aplicable; manifiesto identifica generación y hash; toda exportación queda auditada.

## Dependencias y validación

Depende de S1/S4/S5/S6. Pruebas de integridad, permisos, volumen y comparación contra datos fuente. Riesgo: exportación incompleta o exposición masiva no autorizada.
