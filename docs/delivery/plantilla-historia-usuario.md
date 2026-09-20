# Plantilla — Historia de usuario con contrato de delivery

> Estado inicial: `Intake`. Esta plantilla no autoriza desarrollo hasta aprobación del propietario del producto (PO).

## Identidad y producto

- **ID:** `HU-TC-XXX`
- **Título:**
- **Épica / objetivo de negocio:** `E-TC-XX` —
- **Prioridad / tamaño / fecha objetivo:**
- **Estado Kanban / límite WIP:**
- **Propietario de producto / responsable de historia:**
- **Fuente de evidencia / hipótesis:**
- **Decisión PO (estado, alcance/riesgo aceptado y fecha):**

## Historia

Como **[rol autorizado]**, quiero **[acción concreta]**, para **[beneficio observable]**.

### Alcance

- Incluye:
- Exclusiones explícitas:
- No promesas: no afirmar cumplimiento legal automático, cálculo de nómina ni interpretación automática de convenios.

### Criterios de aceptación verificables

1. Dado/Cuando/Entonces:
2. Autorización, tenant y rol:
3. Auditoría, inmutabilidad, idempotencia y recuperación (si aplica):
4. Accesibilidad, móvil y estados de error/carga:
5. Pruebas negativas y datos sintéticos:

## Riesgo, datos y decisiones

| Dimensión | Nivel | Riesgo/mitigación | Revisión requerida |
|---|---:|---|---|
| Laboral/legal | Bajo/Medio/Alto/Crítico | | PO + asesoría/DPO cuando aplique |
| Privacidad/RGPD | | | Seguridad/privacidad |
| Seguridad | | | Revisor independiente |
| Accesibilidad/UX | | | UX + QA |
| Operación/despliegue | | | DevOps/SRE |

- **Datos permitidos:** exclusivamente fixtures sintéticos/minimizados.
- **Datos prohibidos en Issue, adjuntos y prompts:** PII real, registros laborales reales, secretos, tokens, backups, `.env`, exportaciones reales.
- **Dependencias/bloqueos:**
- **Decisiones pendientes del PO:**
- **ADRs/contratos vinculados:**

## Diseño y plan

- Diseño funcional/UI enlazado:
- Arquitectura/contrato de API/eventos/migración:
- Módulos, rutas, tablas y propietario:
- Alternativas descartadas y motivo:
- Plan técnico por commits (migración, implementación, pruebas, documentación):
- Agentes/roles implicados y responsable de cada entrega:
- Modelo recomendado por tarea y razón:
- Paralelismo permitido / conflictos que evitar:

## Plan de pruebas y Definition of Done

- Unitarias / integración / contrato / E2E:
- Justificación y alternativa si E2E no aplica:
- Autorización, aislamiento, DST/UTC, idempotencia, auditoría y regresión:
- Revisión manual UX/a11y:
- Revisión seguridad/privacidad/operación:
- Evidencia sintética adjunta/enlazada:

Una historia está **Done** sólo si: criterios satisfechos; exclusiones preservadas; pruebas y `git diff --check` correctos; rama, commits y PR publicados; revisiones requeridas resueltas; documentación/ADR actualizados; decisión de merge/despliegue registrada; validación de producto y aprendizaje cerrados. `Done` no significa autorización para datos reales ni producción.

## Trazabilidad de ejecución

| Hito | Enlace / SHA / evidencia | Responsable | Fecha |
|---|---|---|---|
| Issue/Project | | | |
| Base `master` | | | |
| Rama `codex/<sesion>-<tema>` | | | |
| Commits | | | |
| Pull request y revisiones | | | |
| Checks/CI/pruebas | | | |
| Validación QA/E2E | | | |
| Autorización de merge | | | |
| Despliegue autorizado | | | |
| Validación de producto | | | |
| Cierre/aprendizaje | | | |
