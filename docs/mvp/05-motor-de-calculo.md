# S5 — Motor de cálculo de jornada, incidencias y excesos

## Registro de implementación S5 — 10/09/2026

Base: `TimeControlApp/master` en `4505a3a`; rama de trabajo: `codex/s5-time-calculation`.

### Dependencias consumidas, sin modificar sus dominios

- S1: `Actor`/permisos en servidor y `audit_append` append-only.
- S2: `EmploymentScopeProvider` y ámbitos de centro para identificar empleo y autorizar lectura.
- S3: `ResolvedRule`, `RuleResolver` y snapshots versionados de calendario, turno y política de pausa.
- S4: `TimeEvent`/`time_events` como evidencia inmutable, incluidos `ruleVersionId`, zona efectiva y fecha laboral.

### Modelo y recálculo

S5 materializa una proyección diaria actual (`daily_calculations`) y versiones inmutables (`daily_calculation_versions`). Cada versión incluye IDs de eventos fuente, ID de versión de regla, zona IANA, versión de algoritmo, huella SHA-256 de sus entradas y hora UTC de cálculo. Un recálculo toma un bloqueo transaccional por empleado/fecha laboral: si la huella ya existe devuelve esa versión sin escribir; si cambian fuentes o configuración versionada añade una versión y avanza la proyección actual. Los eventos S4 nunca se actualizan ni eliminan.

El umbral de exceso es una configuración S5 por `ruleVersionId`, inmutable tras su primer uso y con valor inicial `0`. El exceso es `max(0, efectivo - esperado - umbral)` y se etiqueta explícitamente como informativo/no salarial.

### Semántica temporal fijada

- La fecha de una jornada es la fecha local IANA de su `clock_in`; una sesión puede acabar al día siguiente y sigue perteneciendo a esa fecha.
- Las duraciones se restan entre instantes UTC, por lo que los cambios DST no añaden ni quitan minutos artificiales. La zona sólo deriva fecha laboral, calendario y presentación.
- Se permiten varios pares entrada/salida de la misma fecha (jornada partida). Las pausas sólo se descuentan cuando tienen inicio y fin registrados; no se infiere ni descuenta ninguna pausa automática.
- Entrada sin salida, pausa abierta, salida sin entrada, transición no válida o versiones de regla mezcladas quedan como incidencias objetivas. Los tramos abiertos no se inventan: no aumentan tiempo efectivo ni pausa registrada.
- Los eventos se ordenan por `occurredAt,id`. Reintentos que S4 rechazó no existen como fuente; si hubiera evidencia histórica duplicada o inválida, se conserva como fuente y genera incidencia.
- La regla fijada en el primer evento de entrada es la fuente histórica del cálculo. Una nueva versión futura no altera resultados que ya tienen eventos; sólo puede afectar una jornada aún sin evidencia al resolverla expresamente.

### Archivos previstos antes de editar

- `migrations/s005_202609101800_time_calculations.sql`: configuración de exceso, proyección y versiones, permisos y roles.
- `src/time-calculation/{contracts,algorithm,service,http}.ts` y rutas `src/app/api/v1/{time-calculations,balances}`: contratos, cálculo, persistencia y API de lectura/recálculo.
- `tests/time-calculation.test.ts` y `tests/time-calculation-sql.test.ts`: algoritmo, DST, regla, incidencias, aislamiento, idempotencia y concurrencia verificable por SQL.
- Este contrato: decisiones, APIs, riesgos, resultados reales y traspaso S6–S9.

### Superficie implementada

- `migrations/s005_202609101800_time_calculations.sql` crea `calculation_policies`, `daily_calculations` y `daily_calculation_versions`. La migración es aditiva; el rollback es de aplicación (desactivar S5), sin borrar proyecciones ni evidencia.
- `src/time-calculation/algorithm.ts` es el cálculo puro; `service.ts` materializa la versión actual e histórica con bloqueo asesor por empleado/fecha y huella de entrada; `contracts.ts` es el contrato de lectura estable.
- `GET/POST /api/v1/time-calculations?employeeId={uuid}&laborDate={YYYY-MM-DD}` expone lectura y recálculo; `GET /api/v1/balances` es el alias de lectura de saldo diario. `POST /api/v1/time-calculations/policies` configura el umbral antes del primer cálculo de la versión de regla. Las operaciones aplican permisos y ámbito de centro en servidor.

### Contratos listos para las siguientes sesiones

| Consumidor | Contrato listo | Límite explícito |
|---|---|---|
| S6 | `PersistedDailyCalculation`, incidencias objetivas y fuentes versionadas | S6 crea correcciones aditivas; S5 no las implementa todavía. |
| S7 | Lectura propia con `time-calculation.read:self` y campos de presentación (`effectiveTimeZone`, minutos, incidencias) | No se entrega pantalla. |
| S8 | Lectura/recálculo de ámbito de centro y saldo diario bajo permisos `:scope` | No se entrega vista ni operación administrativa. |
| S9 | IDs de fuentes, regla, zona, algoritmo, huella y revisiones inmutables | No se exporta ningún archivo. |

### Validación real

- Node 20: `vitest run` — **43 pruebas correctas en 13 suites**; incluye casos estándar, pausa, jornada partida, nocturna, medianoche, DST, incompletos, secuencia heredada, festivo, cambio de versión, exceso y estabilidad determinista.
- Node 20: `tsc --noEmit` — correcto.
- Docker/PostgreSQL local: la migración S5 quedó aplicada y se verificó en `schema_migrations`; build de producción correcto e incluye las rutas S5. La suite dentro del contenedor dio **43/43** correcta y el servicio quedó saludable.

### Riesgos y límites pendientes

- La ruta de política usa la versión de regla como frontera de inmutabilidad: para cambiar un umbral ya usado se publica una nueva versión S3, no se reescribe historia.
- La aplicación no inventa minutos en tramos abiertos. Por tanto una jornada abierta requiere una futura corrección S6 o un fichaje de salida para completarse; no se considera una decisión disciplinaria.
- S5 no resuelve todavía una jornada sin ningún evento: se devuelve ausencia de fuente y no se materializa una expectativa “vacía”. Si producto necesita saldos de absentismo sin fichaje deberá ser una decisión de S6/S8 con calendario y autorización explícitos.

**Objetivo:** calcular tiempo trabajado y desviaciones de forma explicable. **Tamaño:** L. **Ejecución:** tras S3 y S4.

## Alcance

Propietaria de `time-calculation`, `balances`, reglas de cálculo y casos de prueba. Calcula tiempo efectivo, pausas registradas, jornada esperada, incidencias y exceso configurable. No calcula nómina ni dicta compensación jurídica.

## Entregable y aceptación

Cada resultado indica eventos y versión de regla usados; recalcular conserva historial/versionado; el saldo no se etiqueta como importe salarial. Casos de turno nocturno, partida, medianoche y DST producen resultado esperado.

## Dependencias y validación

Depende de S3/S4. API consumida por S8/S9. Pruebas deterministas por tabla de casos. Riesgo: equiparar exceso calculado con hora extraordinaria retribuible.

## Enmienda read-only para S18 — 11/09/2026

Se publica el contrato `EffectiveWorkday`/`EffectiveWorkdayEvent` y el adaptador `effectiveWorkday(employeeId, asOf)` de S5. Resuelve en servidor la relación laboral vigente, zona IANA y fecha laboral; devuelve únicamente la secuencia efectiva ordenada que S5 usa para cálculo, excluyendo eventos sustituidos e incorporando efectos de correcciones aprobadas. No muta evidencia, cálculos, auditoría ni idempotencias, y no expone motivos de corrección, PIN, datos de dispositivo ni datos de terceros. S18 lo consumirá después de autorizar y resolver el empleado propio; no recibe ámbito ni instante desde el navegador.
