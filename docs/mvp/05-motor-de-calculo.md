# S5 — Motor de cálculo de jornada, incidencias y excesos

**Objetivo:** calcular tiempo trabajado y desviaciones de forma explicable. **Tamaño:** L. **Ejecución:** tras S3 y S4.

## Alcance

Propietaria de `time-calculation`, `balances`, reglas de cálculo y casos de prueba. Calcula tiempo efectivo, pausas registradas, jornada esperada, incidencias y exceso configurable. No calcula nómina ni dicta compensación jurídica.

## Entregable y aceptación

Cada resultado indica eventos y versión de regla usados; recalcular conserva historial/versionado; el saldo no se etiqueta como importe salarial. Casos de turno nocturno, partida, medianoche y DST producen resultado esperado.

## Dependencias y validación

Depende de S3/S4. API consumida por S8/S9. Pruebas deterministas por tabla de casos. Riesgo: equiparar exceso calculado con hora extraordinaria retribuible.
