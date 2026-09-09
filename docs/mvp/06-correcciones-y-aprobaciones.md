# S6 — Correcciones y aprobaciones

**Objetivo:** resolver errores sin alterar la evidencia original. **Tamaño:** M. **Ejecución:** tras S1/S4.

## Alcance

Propietaria de `corrections`, `approvals` y sus rutas/API. Empleado propone corrección con motivo; responsable autorizado aprueba o rechaza. Las aprobaciones se aplican a correcciones/incidencias, no a toda jornada.

## Entregable y aceptación

El evento original permanece intacto; la corrección registra solicitante, motivo, fecha, decisión y aprobador; empleado ve estado y motivo de rechazo; no hay aprobación fuera de tenant/jerarquía.

## Dependencias y validación

Depende de S1/S4; puede operar en paralelo parcial con S5. Pruebas de estados, autorización, concurrencia y trazabilidad. Riesgo: corrección silenciosa o aprobación impropia.
