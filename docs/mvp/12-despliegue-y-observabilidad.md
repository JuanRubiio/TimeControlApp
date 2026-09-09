# S12 — Despliegue, observabilidad y documentación técnica

**Objetivo:** disponer de un piloto seguro, recuperable y operable. **Tamaño:** M. **Ejecución:** paralela tras S1.

## Alcance

CI/CD, imágenes Docker, plantilla de aprovisionamiento de entorno dedicado por cliente, configuración por entorno, gestión de secretos, infraestructura, monitorización, alertas, backups, restauración, runbook y documentación de operación. Logs estructurados con minimización de PII.

## Entregable y aceptación

Despliegue repetible de entorno piloto dedicado; secretos fuera de repositorio; aplicación, PostgreSQL, almacenamiento y backups aislados por cliente; alertas básicas; backup cifrado y restauración probada; runbook de incidentes y rollback.

## Dependencias y validación

Depende de S1 y ADR tecnológico de S0. Paralela con S2/S3/S4/S10/S11. Riesgo: no poder recuperar datos o registrar información sensible. Validación mediante despliegue limpio, prueba de restore y revisión de logs.
