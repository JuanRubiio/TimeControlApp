# S15 — Cierre operativo y cumplimiento prepiloto

**Estado:** obligatoria antes de datos reales. **Tamaño:** M de ingeniería/operación, más plazos externos. **Dependencias:** S10, S12, proveedor, DPO, asesoría laboral y propietario del producto.

## Nombre y objetivo

Convertir los controles locales de S12 y el NO-GO de S13-005 en evidencia de operación segura para un entorno dedicado de piloto. No amplía el producto de control horario.

## Entregable verificable

Paquete de Go/No-Go con entorno no productivo dedicado, configuración TLS/proxy/WAF/rate limit/cifrado/secreto evidenciada; backup y restore aislados ejecutados con rechazo cruzado; tarea de retención/borrado de exportaciones probada y auditada; responsables, DPA, privacidad, laboral, soporte, incidentes y aceptación humana documentados.

## Alcance y exclusiones

Incluye provisión automatizada por cliente, prueba de health/aislamiento, RPO/RTO aprobados, backup/restore, retención de exportaciones, observabilidad minimizada, runbooks, QR físico, lector de pantalla, red del piloto, alta de cliente/demo sintético, soporte y canal de feedback minimizado. Excluye cambios de reglas de negocio, GPS, biometría, cámara, nómina, convenios, app nativa y cualquier dato real hasta aprobar el Go.

## Dominios, rutas, módulos, tablas y documentación afectados

Propietaria de `ops/`, `docker/ops`, Compose/plataforma, secretos gestionados, almacenamiento aislado, automatización de retención, CI/observabilidad y `docs/operations/*`, S10 y guía de piloto. No modifica tablas o rutas de S1–S9 salvo una integración transversal expresamente acordada para borrar físicamente un artefacto de exportación vencido conservando el manifiesto/auditoría.

## Dependencias y ejecución paralela

Depende de S12 y de la selección de proveedor. Puede correr en paralelo con auditoría S14; S16 sólo puede activar descarga visible cuando S15 cierre almacenamiento, vencimiento y auditoría. No comparte migraciones funcionales.

## Riesgos legales, técnicos y de integración

Los riesgos son pérdida o cruce de datos, fuerza bruta, restauración errónea, retención indebida y promesas de cumplimiento. Mitigación: evidencia repetible, principio de mínimo privilegio, prueba negativa de backup cruzado, DPA/DPO/laboral y decisión Go escrita. No constituye asesoramiento jurídico.

## Criterios de aceptación

- Entorno dedicado con app, PostgreSQL, secretos, exportaciones y backups aislados; TLS, HSTS/cabeceras, CORS/CSRF y WAF/rate limit probados en login, MFA, PIN, QR y API.
- Backup restaurado en destino de prueba, checksum e identidad de entorno verificados; backup de otro entorno rechazado antes de restaurar; RPO/RTO y rollback documentados.
- Exportación vencida se elimina físicamente por tarea controlada y deja manifiesto/auditoría; registros laborales se preservan conforme a política aprobada y bloqueo legal.
- DPA/subencargados/región, DPO, base jurídica, derechos, incidentes, contacto de soporte, asesoría laboral/calendario y responsables del cliente quedan aprobados por escrito.
- QR físico, teclado/lector de pantalla, red y recorridos de empleado/responsable se aceptan con datos sintéticos o según base autorizada.
- Feedback del piloto tiene canal, responsable, severidad y minimización de datos; no solicita credenciales, PIN, token ni datos innecesarios.

## Pruebas necesarias

Despliegue limpio, smoke autenticado, negativas de rate limit/RBAC/entorno, restauración y rechazo cruzado, expiración/borrado, revisión de logs, simulacro de incidente, QR físico y aceptación humana. Conservar evidencia sin secretos.

## Decisiones que requieren aprobación

Proveedor/región/coste, RPO/RTO, política de retención y bloqueo, responsables 24×7, DPA/subencargados, aprobación DPO/laboral, base y alcance de datos del piloto, y condición formal de Go.
