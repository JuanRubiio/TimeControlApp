# S9 — Auditoría, trazabilidad y exportación

**Objetivo:** producir evidencia reproducible para trabajador, RLT e Inspección. **Tamaño:** L. **Ejecución:** tras contratos de S1/S4/S5/S6.

## Alcance

Propietaria de `exports`, formatos CSV/PDF, manifiesto de período, versión de reglas y huella/hash de exportación. Consume auditoría y eventos sin reescribirlos.

## Entregable y aceptación

Exportación por persona/centro/período, legible y autorizada; incluye inicio/fin, pausas, correcciones y regla aplicable; manifiesto identifica generación y hash; toda exportación queda auditada.

## Dependencias y validación

Depende de S1/S4/S5/S6. Pruebas de integridad, permisos, volumen y comparación contra datos fuente. Riesgo: exportación incompleta o exposición masiva no autorizada.
