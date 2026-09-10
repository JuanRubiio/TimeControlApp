# S13 — Validación E2E, experiencia de usuario y preparación de piloto

**Estado:** cerrada con bloqueos. **Base:** `9f29232` (`master`, 10/09/2026). **Rama:** `codex/s13-validacion-e2e-piloto`. **Propiedad:** validación transversal; no modifica contratos de dominio.

## Alcance y dependencias

S13 valida el MVP integrado S1–S12 como producto, con datos exclusivamente sintéticos de S11. Incluye arranque reproducible, seguridad/RBAC/aislamiento, flujos de administración, empleado, fichaje, cálculo, correcciones, exportación y revisión UX/accesibilidad. No crea funciones de negocio, integraciones, datos reales, GPS, cámara, biometría ni servicios de pago.

Depende de S1–S12, `docs/operations/local-development.md`, Docker Desktop y Node 20.19 o superior. Los archivos previstos son este contrato, la guía de piloto, el informe y la propuesta S14.

## Dataset demostrable requerido

La base S11 es sintética, determinista e idempotente: `office` contiene una empresa y un centro; `multisite`, una empresa y Madrid/Canarias/Levante. Incluye administrador, responsable y empleado nocturno, reglas estándar/partida/nocturna, calendario 2026, festivos y política de pausa manual visible.

**Resultado:** no se ha podido cargar ni ampliar con fichajes, duplicados, pausas, correcciones ni exportaciones porque Docker Desktop no expone el daemon. Por tanto no hay evidencia honesta de que el conjunto completo requerido esté presente en PostgreSQL. La ampliación y ejecución se asignan a S14; nunca se usarán identidades ajenas a `@demo.test`.

## Matriz de pruebas y resultado real

| Área | Casos | Resultado | Evidencia / bloqueo |
|---|---|---|---|
| Arranque limpio | Compose, PostgreSQL, health, migración, seed | Bloqueado | `docker version` sólo devuelve cliente; falta `//./pipe/dockerDesktopLinuxEngine`. No se han tocado volúmenes existentes. |
| Calidad disponible | tests, smoke, tipo, build | Bloqueado | Host Node `v18.12.1`; Vitest requiere `node:fs.statfsSync` y Next exige Node >=20.9. |
| Autenticación/sesión/MFA | login, MFA administrativo, logout | Parcial estático | APIs y cookies `HttpOnly` existen; no hay pantalla de login/MFA ni control de logout en la interfaz. E2E HTTP bloqueado. |
| RBAC y acceso indebido | servidor, URL/API, responsable acotado | Parcial estático | Permisos se validan en servidor. QA-001: `employee` no recibe `time-event.create:self`/`read:self`, bloquea su flujo mínimo. |
| Aislamiento y PII | entorno dedicado, errores y logs | Parcial estático | `ENVIRONMENT_ID`, DB dedicada y filtro de claves sensibles existen. No se puede probar con dos entornos ni inspeccionar logs vivos. |
| Administración | centros, personas, reglas, vigencias, filtros | Parcial estático | APIs existen; la UI real sólo consulta plantilla/jornadas/correcciones, no ofrece configuración inicial. |
| Empleado | fichaje, pausas, historial, cálculo, corrección | Bloqueado | Pantallas reales existen y muestran mensajes/recuperación, pero QA-001 y falta de entorno impiden E2E. |
| Casos complejos | partida, medianoche, DST, inválidos, reintentos | Parcial automatizado previo | Fixtures/casos unitarios existen; no se reejecutaron por Node/Docker. QR físico y proxy rate-limit siguen pendientes. |
| Correcciones y auditoría | inmutabilidad, decisión, recálculo, trazabilidad | Parcial estático | Contratos muestran flujo aditivo y UI de decisión; no hay ejecución contra PostgreSQL. |
| Exportación | CSV/PDF, hash, descarga, roles, expiración | Parcial estático | Generador y autorización existen; no hay E2E. El borrado programado de vencidos no está implementado. |
| UX/accesibilidad | móvil/tablet/escritorio, teclado, foco, contraste | Parcial estático | CSS tiene breakpoints 420/540/700px, foco visible y roles de estado; no se hizo recorrido asistido ni lector de pantalla. |

## Hallazgos y decisiones

| ID | Pri. | Hallazgo | Decisión S13 |
|---|---:|---|---|
| S13-001 / QA-001 | P1 | Un empleado con sólo `employee` no puede fichar ni ver sus fichajes. | No se cambia autónomamente el catálogo RBAC; S14 debe acordar migración aditiva y E2E negativo/positivo. |
| S13-002 | P1 | El host no cumple Node >=20.19 y Docker Desktop no está disponible; no es posible validar el producto ejecutado. | No se suplanta evidencia con pruebas estáticas; operación debe reparar el entorno y repetir la matriz. |
| S13-003 | P1 | La interfaz no expone login, enrolamiento/verificación MFA ni logout, aunque las APIs existen. | Requiere decisión de producto/propiedad S1/S7 antes de pilotar usuarios no técnicos. |
| S13-004 | P1 | El dataset S11 no materializa todavía el historial completo de eventos, correcciones y exportaciones pedido para demo E2E. | Ampliar de forma idempotente en S14 y ejecutar contra dos bases dedicadas. |
| S13-005 | P1 | No están probados build fresco, backup/restore, TLS/proxy/rate-limit ni borrado de exportaciones vencidas. | Bloqueo operacional y de seguridad ya identificado por S10/S12; no apto para datos reales. |
| S13-006 | P2 | La UI administrativa entregada es de consulta/revisión; altas y configuración se ofrecen por API, no como flujo guiado. | La guía no inventa pantallas; decidir si se habilita UI o se documenta una operación técnica asistida. |
| S13-007 | P2 | La interfaz muestra UUID de regla/actor en detalles, poco comprensible para usuarios. | Mejora UX para S14 tras preservar trazabilidad. |

No se detectó P0 mediante ejecución porque el entorno no llegó a arrancar. La ausencia de P0 no equivale a aprobación: hay P1 bloqueantes.

## Riesgos, bloqueos y preparación de piloto

Riesgos abiertos: configuración laboral/calendario sin validación por asesoría; DPO/DPA/derechos/retención sin cierre; proveedor/TLS/cifrado en reposo y WAF sin aprobación; restore real no ensayado; QR físico no validado. No se verificó una fuga de PII, pero tampoco se pudo probar en tiempo de ejecución.

**Go / No-Go:** **NO-GO**. Para cambiar a «listo con condiciones» deben cerrarse S13-001 a S13-005, ejecutar todas las filas bloqueadas con evidencia reproducible y obtener las aprobaciones legal, privacidad y operación de S10/S12.

## Criterios de aceptación S13

- [ ] Entorno Docker limpio, migrado y dos perfiles demo ejecutados.
- [ ] Flujos críticos E2E, roles, aislamiento, auditoría, exportaciones y casos temporales ejecutados.
- [x] Hallazgos, decisiones, riesgos y bloqueos documentados sin ocultar fallos.
- [x] Guía fiel a las pantallas reales y límites del producto creada.
- [x] Informe Go/No-Go y propuesta fuera de alcance creados.
