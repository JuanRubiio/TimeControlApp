# S3 — Jornada, calendario, turnos y reglas

**Objetivo:** configurar reglas básicas sin interpretar automáticamente convenios. **Tamaño:** L. **Ejecución:** paralela tras S1 y aprobación de pausas.

## Registro de implementación S3 — 10/09/2026

Estado: **implementado y validado localmente**. S3 es propietaria de `work_rules`, `rule_versions`, `calendars` y `shifts`, creadas por `migrations/s003_202609101100_work_rules.sql`. La migración usa un `EXCLUDE` sobre rangos de fecha semiabiertos para impedir versiones solapadas de una misma regla y no modifica tablas, rutas ni módulos de S2.

### Contratos y API creados

- `src/work-rules/contracts.ts` publica `RuleResolver`, `ResolvedRule`, `RuleScope` y el puerto `EmploymentScopeProvider` para S2. El puerto recibe un instante UTC y devuelve atómicamente relación laboral, empresa, centro, zona IANA efectiva y alcances `company`/`site`; no da acceso a tablas internas. `collective` sigue siendo un alcance futuro de S3: no forma parte de S2 hasta que tenga modelo y sesión propietaria.
- `PostgresRuleResolver` elige la regla activa más específica (`site`, `collective`, `company`) para el instante UTC recibido y conserva zona IANA, versión, calendario y turno resueltos. `FixedRuleResolver` es el mock contractual para S4/S5.
- `GET` y `POST /api/v1/work-rules`, `/api/v1/rule-versions`, `/api/v1/calendars` y `/api/v1/shifts`, más `POST /api/v1/work-rules/{id}/deactivate`, exponen la configuración. La lectura exige `rule.read` y las mutaciones `rule.write`. Las versiones capturan una instantánea de calendario y turno: modificar la configuración futura no reescribe lo ya resuelto.
- La política de pausa sólo permite `manual_visible` con `autoDeduct: false`. Estas configuraciones son operativas y revisables; no constituyen interpretación legal automática ni promesa de cumplimiento.

### Auditoría y validación

Se auditan creación de regla, calendario y turno, publicación/cambio de vigencia y desactivación mediante el writer append-only de S1. Se añadieron pruebas unitarias para solapamiento de vigencias, festivo conservado en calendario, jornada partida, cruce de medianoche, DST (hora adelantada y repetida), zona IANA e instante UTC estricto. La migración concede sólo los permisos de aplicación necesarios y es aditiva/reintentable.

### Riesgos de integración

S2 proporciona `PostgresEmploymentScopeProvider`, que valida la pertenencia de empresa y centro al entorno y resuelve atómicamente vigencia y zona efectiva. Los colectivos siguen pendientes de su dominio propietario. Antes de habilitar consumo por S4/S5, añadir pruebas de contrato contra el adaptador y pruebas PostgreSQL de exclusión/resolve con una base migrada. La edición versionada de calendarios y turnos se entrega como creación de recursos e instantánea al publicar la regla; un CRUD de edición sólo deberá añadirse creando una nueva versión, nunca alterando una versión publicada.

## Alcance

Propietaria de `work-rules`, `rule_versions`, `calendars`, `shifts`. Jornada esperada, calendario laboral, pausas configurables, turnos básicos y zona horaria. Cada cambio crea una versión fechada y explicable.

## Entregable y aceptación

Una regla queda asociada a empresa/centro/colectivo y rango de vigencia; un evento puede resolver la versión aplicable; no hay descuento automático de pausa por defecto; reglas no se presentan como interpretación jurídica.

## Dependencias y validación

Depende de S1 y decisión de pausas. Paralela con S2/S4. Pruebas de solapamiento de versiones, festivo, turno partido, medianoche y DST. Riesgo: reglas ambiguas o modelo incapaz de evolucionar.
