# S10 — Privacidad, seguridad, retención y cumplimiento

**Estado:** revisada contra S1–S12 en `TimeControlApp/master` (`a6f6731`) el 10/09/2026. No es una certificación ni sustituye al DPO, abogado laboralista o revisión contractual de cada piloto.

**Registro Git:** documentación inicial integrada por PR #2; revisión de cierre en `codex/s10-closeout-review`, basada en `TimeControlApp/master` (`a6f6731`). Esta sesión sólo es propietaria de los cinco documentos `10-*.md` enlazados abajo; no modifica módulos, rutas, migraciones ni pruebas de otros dominios.

## Resultado

S10 convierte las decisiones de producto en el paquete revisable siguiente:

- [RAT e inventario de datos](10-rat-e-inventario.md).
- [Borrador de encargo y anexo de subencargados](10-dpa-y-subencargados-borrador.md).
- [Aviso, retención, derechos e incidentes](10-avisos-retencion-derechos-incidentes.md).
- [Seguridad, acceso técnico y modelo de amenazas](10-seguridad-y-modelo-amenazas.md).

El cliente es el **responsable del tratamiento** de los datos laborales; el proveedor de la aplicación actúa como **encargado**, estrictamente bajo instrucciones documentadas. Esta asignación es un punto de partida contractual que DPO y abogado deben validar por cliente y tratamiento. La obligación laboral de conservar el registro de jornada durante cuatro años deriva del artículo 34.9 ET; el producto no interpreta convenios ni garantiza por sí solo el cumplimiento laboral.

## Decisiones ya vinculantes

| Tipo | Decisión |
|---|---|
| Producto | Web responsive/PWA en español; web, QR y PIN para fichar; sin app nativa. |
| Privacidad por diseño | No se recogen GPS, geolocalización, biometría, reconocimiento facial, fotografía, vídeo, cámara ni monitorización. |
| Arquitectura | Un entorno dedicado por cliente: aplicación, PostgreSQL, exportaciones, secretos y backups aislados. |
| Evidencia | Fichajes y auditoría son aditivos/append-only; nunca se reescribe el evento original. |
| Requisito laboral | Los registros de jornada se preservan cuatro años y se ponen a disposición conforme aplique. |

## Evidencia verificada en código y documentación (S1–S12)

| Control | Evidencia | Estado |
|---|---|---|
| Aislamiento lógico dentro de entorno dedicado | `ENVIRONMENT_ID` de servidor y tabla singleton; no hay `tenant_id` ni selector de cliente HTTP. S12 añade proyecto Compose, red, volumen, directorio de backup y fichero de secretos por cliente. | Implementado localmente; hosting/proxy/TLS real pendiente de aprobar y probar. |
| Autenticación y sesión | Contraseñas Argon2id; token opaco hasheado; cookie `HttpOnly`, `SameSite`, `Secure` configurable por entorno, vencimiento y revocación. | Existente. |
| MFA administrativo | TOTP obligatorio antes de sesión administrativa; desafío de un uso y 5 minutos. | Existente; evaluar resistencia a phishing y recuperación auditada antes de piloto. |
| Mínimo privilegio | RBAC y ámbito aplicados en servidor; denegación por defecto; rol DB `mvp_app` limitado. | Existente en S1–S4. |
| Integridad | `audit_append` encadena hashes y bloquea `UPDATE`/`DELETE`; fichajes, correcciones, decisiones y versiones de cálculo son aditivos. S9 añade manifiesto/snapshot y SHA-256 de exportación. | Existente; verificación periódica de cadena y exportación de inspección completa siguen operativas por probar. |
| PIN/QR | PIN con HMAC + Argon2id + *pepper*; QR opaco temporal, sin PII; bloqueo tras cinco fallos. | Existente; falta rate-limit de proxy. |
| Exportaciones | S9 limita el alcance a una persona o centro autorizado, genera CSV/PDF sin URL pública, comprueba hash antes de descargar y audita generación/descarga. | Existente; el archivo expira lógicamente a 30 días, pero su eliminación programada no está implementada. |
| Backups y restauración | S12 incorpora `pg_dump`, AES-256-GCM con scrypt, checksum/manifiesto y runbooks de backup/restore por cliente. | Automatización revisada estáticamente; falta simulacro completo y verificación de identidad de destino. |
| Minimización y QA | S2/S4/S7/S8 excluyen datos invasivos; S11 usa fixtures sintéticos `@demo.test`; S12 filtra claves sensibles de logs y métricas agregadas. | Existente en el alcance revisado; la política/retención de logs y controles globales de registro siguen pendientes. |

S5–S9 añaden pruebas de cálculo determinista, correcciones inmutables, ámbitos administrativos y CSV/PDF/hash; S11 añade CI y datos sintéticos; S12 prueba la minimización de observabilidad. Esta revisión combina esas evidencias declaradas con lectura estática. No acredita TLS, WAF, cifrado de host, borrado material de archivos/backups, restore completo, monitorización ni operación de producción.

## Controles pendientes y bloqueos

| Prioridad | Requisito/incidencia | Propietario propuesto | Condición de cierre |
|---|---|---|---|
| Bloqueante | Provisionar y demostrar aislamiento de app, DB, secretos, almacenamiento y backup por cliente; cifrado TLS y cifrado en reposo del proveedor. | S12/plataforma | Proveedor/región aprobados, configuración efectiva y restore de un entorno de prueba. |
| Bloqueante | Política operativa de retención/bloqueo y job controlado: cuatro años para registros; retención diferenciada para otros datos y eliminación del archivo de exportación vencido. | S12 + futuro módulo transversal | Diseño aprobado, prueba de preservación y borrado/bloqueo con auditoría. |
| Bloqueante | Canal autenticado para derechos, inventario de solicitudes y extracción/rectificación/borrado controlados. | Propietario futuro | Flujo probado y responsable/plazos configurados por cliente. |
| Bloqueante | DPA firmado y listado real de subencargados/ubicaciones antes de tratar datos reales. | Legal/DPO | Anexos completos y autorizaciones documentadas. |
| Bloqueante | La restauración S12 sólo comprueba que existe `environment_context` tras recuperar; no compara su UUID con el `ENVIRONMENT_ID` esperado. | S12 | Validación estricta de identidad origen/destino y prueba negativa de backup cruzado. |
| Alta | El rol base `employee` no recibe `time-event.create:self` ni `time-event.read:self` (QA-001), aunque la UI/contrato los requieren. | S1, con revisión S4/S7 | Migración aditiva de permisos mínimos y E2E con empleado sin privilegio administrativo. |
| Alta | Rate-limit/WAF para login, MFA, PIN, QR y API; cabeceras de seguridad, política CORS/CSRF y análisis de dependencias en CI. | S12 | Pruebas negativas y configuración revisada. |
| Alta | Los filtros de logs excluyen claves conocidas, pero no imponen una lista permitida ni sustituyen una política global de logging. | S12 | Revisión de todos los emisores, allowlist o control equivalente y prueba negativa con datos laborales. |
| Alta | Runbook de incidentes, contactos 24×7, simulacro y registro de brechas. | Operación/DPO | Simulacro documentado. |
| Alta | Verificación periódica de cadena de auditoría, revisión de privilegios y baja de accesos de soporte. | Operación | Evidencia recurrente por piloto. |

No se modifica código de otros dominios desde S10. Los pendientes son requisitos de integración/operación, no afirmaciones de que ya estén resueltos.

## Checklist de salida previa al piloto

- [ ] DPO revisa y adapta RAT, aviso de empleado, retenciones, base jurídica y necesidad de EIPD/consulta previa para el cliente concreto.
- [ ] Abogado laboralista valida el procedimiento de registro, reglas configuradas, información/consulta a RLT cuando proceda y acceso a registros; no se infiere convenio automáticamente.
- [ ] Se firma DPA y se entrega/autoriza el anexo real de subencargados y transferencias.
- [ ] Se confirma por escrito responsable, contacto de privacidad y canal de derechos/brechas de cliente y proveedor.
- [ ] Entorno dedicado aprovisionado automáticamente; TLS, cifrado en reposo, secretos separados y accesos de soporte de mínimo privilegio evidenciados.
- [ ] Restauración real de backup aislado y prueba de disponibilidad documentadas; no sólo una copia creada.
- [ ] La restauración rechaza de forma comprobada un backup cuyo `ENVIRONMENT_ID` no corresponde al entorno dedicado destino.
- [ ] Se aplica matriz RBAC: MFA de administradores, no hay cuentas compartidas, usuarios de prueba revocados y accesos de soporte temporales/auditados.
- [ ] Una cuenta con sólo el rol `employee` puede fichar y consultar exclusivamente sus datos, sin permisos administrativos (resolver QA-001).
- [ ] Se prueba aislamiento, autorización negativa, cadena de auditoría, exportación autorizada y preservación de fichajes/correcciones.
- [ ] Rate-limit de infraestructura probado en login/MFA/PIN/QR; QR físico probado con lector real.
- [ ] No hay datos reales en demo/pruebas/logs; revisión de telemetría confirma minimización y ausencia de secretos.
- [ ] Se ensaya el procedimiento de derechos y de incidente; se registran contactos, decisiones y tiempos.
- [ ] Dependencias y configuración de producción se revisan; vulnerabilidades críticas/altas se tratan o aceptan formalmente con fecha.

## Referencias normativas de trabajo

La [AEPD resume el contenido del RAT](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/7-registro-de-actividades-de-tratamiento/FAQ-0220-que-es-el-registro-de-actividades-de-tratamiento); el [RGPD, arts. 28, 30, 32–34](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es) regula encargo, registro, seguridad y brechas. El [art. 34.9 ET actualizado](https://www.boe.es/biblioteca_juridica/publicacion.php?id=PUB-DT-2025-139) mantiene la conservación de cuatro años. Son referencias para revisión profesional, no asesoramiento jurídico.
