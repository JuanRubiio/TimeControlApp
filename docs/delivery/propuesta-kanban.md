# Propuesta Kanban central — GitHub Projects + Issues

**Decisión de herramienta aprobada el 13/09/2026; configuración aún no realizada.** GitHub Free, Projects + Issues se usarán exclusivamente para trabajo interno. Fuente documental: Markdown versionado en `docs/`; fuente del código: repositorio Git privado; fuente operativa del estado: un único GitHub Project de organización/repo cuando se autorice configurarlo. No se añadirán clientes, PII, secretos ni integraciones.

## Tipos y jerarquía

`Épica → Historia (HU-TC-XXX) → Subtarea/bug/riesgo/decisión`. Una épica no se considera entregada por cerrar todas sus historias: requiere validación de objetivo del PO.

## Campos propuestos

| Campo | Valores / uso |
|---|---|
| Estado | Intake, Refinamiento, Pendiente aprobación PO, Diseño/ADR, Lista para desarrollo, En desarrollo, En revisión, QA/validación, Lista para merge, Merged, Pendiente despliegue autorizado, Desplegada, Validación producto, Cerrada, Bloqueada, Rechazada/Aplazada. |
| Tipo | Épica, Historia, Subtarea, Bug, Riesgo, Decisión/ADR, Deuda técnica. |
| Prioridad | P0, P1, P2, P3; prioridad sólo cambia PO. |
| Tamaño | XS, S, M, L; estimación, no compromiso. |
| Riesgo | Bajo, Medio, Alto, Crítico; dispara revisiones. |
| Dominio propietario | S1…S20 / módulo; evita colisiones. |
| Privacidad | Ninguno, metadato minimizado, revisión necesaria; nunca PII. |
| Seguridad/UX/QA/SRE | Pendiente, no aplica, en curso, aprobado, bloqueado. |
| Modelo/clase | Luna, Terra, Sol, Astra; sólo recomendación y evidencia de escalado. |
| Dependencia | Enlace a Issue/ADR/contrato; no texto ambiguo. |
| Rama/PR/commit | Enlaces o SHA; no secretos. |
| Decisión PO | Pendiente, aprobada, rechazada, condicionada. |

## Vistas y políticas

- **Kanban de flujo:** agrupado por Estado, filtro de trabajo activo; WIP inicial máximo: 2 historias en desarrollo, 2 en revisión y 2 en QA para el equipo pequeño.
- **Backlog:** orden por Prioridad, evidencia y dependencia; sólo PO reordena P0/P1.
- **Riesgo/compliance:** filtro riesgo Alto/Crítico o revisión pendiente; se revisa antes de planificación semanal.
- **Entrega:** muestra PR, checks, despliegue y validación; no permite cerrar sin enlaces de evidencia.
- **Bloqueadas:** motivo, propietario desbloqueador, fecha y decisión requerida; nunca se ocultan por moverlas a Done.

## Reglas de transición

1. `Intake` a `Refinamiento`: existe evidencia mínima y no contiene datos reales.
2. `Pendiente aprobación PO` a `Diseño/ADR`: PO aprueba objetivo, exclusiones y riesgo.
3. `Lista para desarrollo` a `En desarrollo`: contrato con pruebas, propietario de módulos y rama propuesta.
4. `En desarrollo` a `En revisión`: la rama está publicada y la PR enlaza la Issue, los commits, las pruebas y la documentación proporcional.
5. `En revisión` a `QA/validación`: revisión técnica recibida; QA registra evidencia funcional y E2E cuando el cambio atraviesa un flujo integrado. Un fallo vuelve a `En desarrollo` o queda `Bloqueada` con causa.
6. `QA/validación` a `Lista para merge`: revisiones requeridas sin hallazgos abiertos y PO informado de riesgo residual.
7. `Merged` no equivale a `Desplegada`; pasa primero por `Pendiente despliegue autorizado`, y el despliegue exige autoridad de entorno y S15/Go-No-Go cuando aplique.
8. `Cerrada`: tras `Validación producto`, el PO valida resultado y aprendizaje; las decisiones pendientes quedan en nuevo Issue, no enterradas en comentarios.

## Permisos y contenido

- PO: prioriza, aprueba alcance, cierra producto.
- Implementadores: actualizan su trabajo y enlaces, no se autoaprueban alto riesgo.
- Revisores/QA/seguridad: pueden bloquear y comentar; no modifican prioridad sin PO.
- Automatizaciones: deshabilitadas inicialmente. Una futura integración sólo podrá sugerir/crear borradores en entorno sintético tras ADR, mínimo privilegio y aprobación independiente.
- En Issues: enlaces a contratos; nunca secretos, PII, fixtures no sintéticos, exportaciones ni clientes reales.
