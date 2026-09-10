# S10 — Privacidad, seguridad, retención y cumplimiento

**Estado:** documentada y contrastada con S1–S4 el 10/09/2026. No es una certificación ni sustituye al DPO, abogado laboralista o revisión contractual de cada piloto.

**Registro Git:** rama `codex/s10-privacy-compliance`, basada en `TimeControlApp/master` (`8d14485`). Esta sesión sólo es propietaria de los cinco documentos `10-*.md` enlazados abajo; no modifica módulos, rutas, migraciones ni pruebas de otros dominios.

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

## Evidencia verificada en código (S1–S4)

| Control | Evidencia | Estado |
|---|---|---|
| Aislamiento lógico dentro de entorno dedicado | `ENVIRONMENT_ID` de servidor y tabla singleton; no hay `tenant_id` ni selector de cliente HTTP. | Existente; falta evidencia de provisión/hosting por S12. |
| Autenticación y sesión | Contraseñas Argon2id; token opaco hasheado; cookie `HttpOnly`, `SameSite`, `Secure` configurable por entorno, vencimiento y revocación. | Existente. |
| MFA administrativo | TOTP obligatorio antes de sesión administrativa; desafío de un uso y 5 minutos. | Existente; evaluar resistencia a phishing y recuperación auditada antes de piloto. |
| Mínimo privilegio | RBAC y ámbito aplicados en servidor; denegación por defecto; rol DB `mvp_app` limitado. | Existente en S1–S4. |
| Integridad | `audit_append` encadena hashes y bloquea `UPDATE`/`DELETE`; `time_events` sólo concede `SELECT, INSERT`. | Existente. |
| PIN/QR | PIN con HMAC + Argon2id + *pepper*; QR opaco temporal, sin PII; bloqueo tras cinco fallos. | Existente; falta rate-limit de proxy. |
| Minimización | S2 no modela domicilio, documento, nómina, biometría ni GPS; S4 no recoge permisos de cámara/GPS. | Existente para el alcance actual. |

Las pruebas citadas por S1–S4 cubren permisos, auditoría SQL, sesiones, MFA, secuencias, idempotencia y ausencia de PIN/QR en claro. Esta revisión fue estática; no acredita cifrado de red, backups, borrado, monitorización, gestión de vulnerabilidades ni operación de producción.

## Controles pendientes y bloqueos

| Prioridad | Requisito/incidencia | Propietario propuesto | Condición de cierre |
|---|---|---|---|
| Bloqueante | Provisionar y demostrar aislamiento de app, DB, secretos, almacenamiento y backup por cliente; cifrado TLS y cifrado en reposo del proveedor. | S12/plataforma | Evidencia de IaC, configuración y restauración de un entorno de prueba. |
| Bloqueante | Política operativa de retención/bloqueo y job controlado: cuatro años para registros; retención diferenciada para otros datos. | S12 + futuro módulo transversal | Diseño aprobado, prueba de preservación y borrado/bloqueo con auditoría. |
| Bloqueante | Canal autenticado para derechos, inventario de solicitudes y extracción/rectificación/borrado controlados. | Propietario futuro | Flujo probado y responsable/plazos configurados por cliente. |
| Bloqueante | DPA firmado y listado real de subencargados/ubicaciones antes de tratar datos reales. | Legal/DPO | Anexos completos y autorizaciones documentadas. |
| Alta | Rate-limit/WAF para login, MFA, PIN, QR y API; cabeceras de seguridad, política CORS/CSRF y análisis de dependencias en CI. | S12 | Pruebas negativas y configuración revisada. |
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
- [ ] Se aplica matriz RBAC: MFA de administradores, no hay cuentas compartidas, usuarios de prueba revocados y accesos de soporte temporales/auditados.
- [ ] Se prueba aislamiento, autorización negativa, cadena de auditoría, exportación autorizada y preservación de fichajes/correcciones.
- [ ] Rate-limit de infraestructura probado en login/MFA/PIN/QR; QR físico probado con lector real.
- [ ] No hay datos reales en demo/pruebas/logs; revisión de telemetría confirma minimización y ausencia de secretos.
- [ ] Se ensaya el procedimiento de derechos y de incidente; se registran contactos, decisiones y tiempos.
- [ ] Dependencias y configuración de producción se revisan; vulnerabilidades críticas/altas se tratan o aceptan formalmente con fecha.

## Referencias normativas de trabajo

La [AEPD resume el contenido del RAT](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/7-registro-de-actividades-de-tratamiento/FAQ-0220-que-es-el-registro-de-actividades-de-tratamiento); el [RGPD, arts. 28, 30, 32–34](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es) regula encargo, registro, seguridad y brechas. El [art. 34.9 ET actualizado](https://www.boe.es/biblioteca_juridica/publicacion.php?id=PUB-DT-2025-139) mantiene la conservación de cuatro años. Son referencias para revisión profesional, no asesoramiento jurídico.
