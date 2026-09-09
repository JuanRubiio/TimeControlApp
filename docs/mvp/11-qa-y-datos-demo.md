# S11 — Pruebas, QA y datos de demostración

**Objetivo:** sostener calidad y demostración segura durante todo el delivery. **Tamaño:** M. **Ejecución:** continua desde S0.

## Alcance

Fixtures sintéticos, pruebas de contrato, unitarias, integración, E2E, matrices de casos de jornada y smoke tests. Propietaria de datos demo; no debe introducir datos personales reales.

## Entregable y aceptación

Entorno demo reproducible con empresas ficticias; pruebas críticas de tenant, fichaje, corrección, cálculo, exportación y fechas; criterios de regresión integrados en CI.

## Dependencias y validación

Consume contratos de S0 y evoluciona con todas las sesiones. Riesgo: fixtures que oculten fallos reales o datos reales en demo. Validación de anonimato/sinteticidad y ejecución automática en CI.
