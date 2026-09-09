# S2 — Empresa, centros y personas

**Objetivo:** permitir administrar estructura laboral mínima por tenant. **Tamaño:** M. **Ejecución:** paralela tras S1.

## Alcance

Propietaria de `companies`, `sites`, `employees`, `employment`. CRUD de empresa, centro, empleado y relación laboral básica; bajas lógicas; asignación de responsable/centro. No contiene reglas de jornada ni fichajes.

## Entregable y aceptación

Administración crea y desactiva centros/empleados autorizados; empleado sólo ve su ficha mínima; los datos se limitan a lo necesario; validación de pertenencia a tenant y centro; auditoría de altas/bajas.

## Dependencias y validación

Depende de S1. Paralela con S3/S4/S10/S11/S12. Pruebas CRUD, autorización, baja lógica y aislamiento. Riesgo: datos laborales excesivos o relaciones ambiguas entre empleado, centro y contrato.
