# ADR-0004 — Fechas, instantes y zona horaria

**Estado:** Aprobado para el MVP el 09/09/2026.

## Decisión

1. Todo instante de negocio se persiste como UTC con precisión de milisegundos y se intercambia en ISO 8601 con sufijo `Z`.
2. Todo centro posee una zona IANA obligatoria; una relación laboral puede tener una zona IANA explícita si difiere. Para cada cálculo se conserva la zona efectiva y la versión de regla utilizadas.
3. La fecha laboral se deriva de `occurredAt` en la zona efectiva; no se deriva del reloj o zona del navegador. La UI presenta instantes en la zona efectiva, indicando fecha y hora.
4. El servidor asigna `recordedAt`; el cliente puede aportar `deviceOccurredAt` como dato no confiable y nunca sustituye al instante de servidor. La discrepancia se conserva si es útil para la evidencia.
5. No se aceptan timestamps locales sin offset/zona ni abreviaturas ambiguas (`CET`, `CEST`). La API devuelve `INVALID_DATETIME`.
6. Los cambios de zona, medianoche y horario de verano no reescriben eventos: los cálculos resuelven la regla/versiones históricas aplicables.

## Consecuencias y pruebas obligatorias

S3 es propietaria de la resolución de zona/regla y S4 del registro de instantes. S5 usa el mismo contrato de resolución. Deben probarse jornada partida, cruce de medianoche, hora inexistente y hora repetida del cambio DST, y cambio de centro/contrato con vigencia.
