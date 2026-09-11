# Informe de preparación de piloto

**Recomendación:** **no listo (NO-GO) para datos reales**. **Fecha:** 11/09/2026. **Versión evaluada:** `835ce96` de `codex/s13-validacion-e2e-piloto` (base `9f29232`); última validación visual posterior a las correcciones locales.

## Entorno y evidencia

- Windows local, PowerShell; Docker Desktop con Node 20 en la imagen y Node 24 empaquetado para las comprobaciones locales. El Node del host sigue siendo 18.12.1 y no se usa para construir ni probar.
- Dos proyectos Compose aislados: `time-control-s13` (office, puerto 3013) y `time-control-s13-multisite` (multisite, puerto 3014), cada uno con PostgreSQL propio, migración y seed sintético.
- Evidencia ejecutada: `docker compose ... up -d --build`; `npm run seed:demo`; health checks; `npm test` dentro de Docker (**66/66**); TypeScript; build Docker; E2E HTTP autenticado; y recorrido del navegador integrado.
- Datos: exclusivamente fixtures `office`/`multisite`, cuentas `@demo.test`, contraseñas sintéticas y eventos reproducibles. No se emplearon PII, credenciales reales ni servicios de pago.

## Escenarios y resultado

| Escenario | Resultado real |
|---|---|
| Arranque, health y migración | Dos entornos arrancados desde Compose, migrados y saludables. |
| Login, logout y MFA | Login y logout web; MFA administrativa con setup y TOTP, todos `200`. |
| RBAC y aislamiento | Empleado: autoconsulta y fichaje permitidos; exportación y administración, `403`; cookie office contra multicentro, `401`. Responsable limitado a su centro. |
| Fichaje y temporalidad | Entrada, pausa, salida, repetición idempotente, secuencias e historial nocturno E2E; suites deterministas para medianoche y ambos DST. |
| Correcciones y cálculo | Corrección web sintética, aprobación por responsable, confirmación de recálculo y conservación del evento original; aprobación/rechazo también por API. |
| Exportación | CSV/PDF autorizados, descarga y contenido CSV inspeccionado; pruebas S9 validan BOM y cabecera PDF. |
| UX visual | Login, empleado, historial, corrección, bandeja, decisión y resumen de responsable recorridos en el navegador integrado. Foco, etiquetas y mensajes de estado expuestos en el árbol accesible. |

## Defectos y mejoras

| Prioridad | Defecto / riesgo | Estado |
|---|---|---|
| P0 | Ninguno confirmado. | Cerrado. |
| P1 | `S13-001`: permisos mínimos de employee. | Corregido mediante migración aditiva y E2E. |
| P1 | `S13-002`: runner Docker/Node no ejecutable. | Corregido para la validación con Docker Node 20/Node 24 empaquetado. |
| P1 | `S13-003`: acceso, MFA y logout sin interfaz. | Corregido y recorrido en vivo. |
| P1 | `S13-004`: fixture E2E insuficiente. | Corregido; seed office/multisite e historial reproducible. |
| P1 | `S13-005`: TLS/WAF/rate limit, restore real y retención/borrado de exportaciones no comprobados. | Abierto; bloqueo de piloto con datos reales. |
| P2 | S13-006: configuración inicial y exportación no tienen flujo UI guiado. | Propuesta S14 / decisión de producto. |
| P2 | S13-007: detalles muestran UUID técnicos (regla/actor) en vez de etiquetas legibles. | Mejora UX S14. |
| P2 | S13-008: el selector de una segunda corrección no ofreció registros tras aprobar una primera en el dataset nocturno. | Reproducir y aclarar comportamiento esperado en S14. |
| P2 | Turbopack advierte de acceso dinámico a ficheros en exportaciones. | Evaluar empaquetado y tamaño antes del despliegue gestionado. |
| P2 | S14: experiencia visual y estados de fichaje/correcciones insuficientemente consistentes. | Corregido en presentación; quedan revisión humana de lector de pantalla, zoom, contraste instrumental y recorrido HTTP bloqueado localmente por puerto 3013 ocupado. |

Se corrigieron además dos defectos observados en vivo: consulta SQL ambigua de centros que impedía cargar el área de responsable, y detalle de corrección que no refrescaba tras decidir. Regresiones: `tests/company-people.test.ts` y `tests/admin-ui.test.ts`.

## Riesgos y checklist Go/No-Go

- [x] Docker limpio, migraciones, health y seed office/multisite.
- [x] E2E positivo/negativo por rol y prueba negativa entre entornos.
- [x] Fichajes, pausas, noche/DST, duplicidad y recuperación automatizable.
- [x] Corrección aditiva, recálculo solicitado, auditoría y CSV/PDF autorizados.
- [ ] Restore aislado en destino, TLS/proxy/rate limit/WAF y retención/borrado automatizado.
- [ ] Aprobación DPO, abogado laboralista, DPA, retención/derechos/incidentes y operación.
- [ ] Revisión humana final de lector de pantalla, kiosco/QR físico y aceptación de usuarios.

S14 incorporó un sistema visual reutilizable, foco visible, estados anunciables, ayuda de formulario y etiquetas humanas con referencias técnicas secundarias. No modifica el NO-GO ni sustituye la revisión humana pendiente de S15.

La aplicación no debe recibir datos reales hasta cerrar el P1 abierto y las aprobaciones indicadas. Véanse [S13](13-validacion-e2e-y-preparacion-piloto.md), la [guía de usuario](../guia-usuario-piloto.md) y [S14](14-cierre-bloqueos-piloto.md).
