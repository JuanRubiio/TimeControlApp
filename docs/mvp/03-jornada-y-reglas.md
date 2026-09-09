# S3 — Jornada, calendario, turnos y reglas

**Objetivo:** configurar reglas básicas sin interpretar automáticamente convenios. **Tamaño:** L. **Ejecución:** paralela tras S1 y aprobación de pausas.

## Alcance

Propietaria de `work-rules`, `rule_versions`, `calendars`, `shifts`. Jornada esperada, calendario laboral, pausas configurables, turnos básicos y zona horaria. Cada cambio crea una versión fechada y explicable.

## Entregable y aceptación

Una regla queda asociada a empresa/centro/colectivo y rango de vigencia; un evento puede resolver la versión aplicable; no hay descuento automático de pausa por defecto; reglas no se presentan como interpretación jurídica.

## Dependencias y validación

Depende de S1 y decisión de pausas. Paralela con S2/S4. Pruebas de solapamiento de versiones, festivo, turno partido, medianoche y DST. Riesgo: reglas ambiguas o modelo incapaz de evolucionar.
