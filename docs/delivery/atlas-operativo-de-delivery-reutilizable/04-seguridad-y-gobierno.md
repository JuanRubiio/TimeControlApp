# 04 — Seguridad, incidentes y gobierno

## Información permitida

Trabajar con mínimos datos, referencias, datos anonimizados y fixtures sintéticos. Prohibir secretos, credenciales, tokens, PII, bases/exportaciones reales, backups y logs crudos en Issues, comentarios, prompts y adjuntos.

## Incidente de proceso

Detener → limitar exposición → avisar al responsable → revocar/rotar si procede → evaluar/registrar en canal seguro → remediar → reanudar con autorización. Ningún agente decide avisos externos o gestiona el incidente de forma autónoma.

## Gobierno de cambios

Usar una Issue por historia, ramas, commits pequeños, PR, pruebas y revisión establecidos por `[WORKFLOW GIT]`. El Project se actualiza manualmente con el estado real y evidencia enlazada. Cambios duraderos de arquitectura/datos requieren ADR; cambios de alcance o riesgo residual requieren decisión `[PO]`. Merge no equivale a despliegue; despliegue no equivale a autorización de producción.

## Control de PR, validación y merge

- Proteger la rama base con revisión requerida y checks que el proyecto haya definido; no usar un nombre de check inventado como política.
- La PR referencia la Issue (`Closes #<número>` cuando corresponde), expone alcance, pruebas, riesgo y rollback, y no contiene secretos ni datos reales.
- La revisión técnica cubre corrección, mantenibilidad, contratos y regresión; QA cubre criterios de aceptación y evidencia funcional/E2E. La revisión de seguridad/privacidad se añade por riesgo, no como gesto ritual.
- Un fallo de CI, revisión o E2E bloquea el merge y devuelve el trabajo a `En desarrollo` o lo marca `Bloqueada` con causa visible.
- Sólo un integrador autorizado fusiona una PR que está `Lista para merge`; tras ello comprueba el commit integrado y actualiza a `Merged`. La aceptación, despliegue y cierre siguen sus puertas propias.

Las integraciones, Actions, bots y automatizaciones pueden proponer enlaces o checks, pero no adelantan estados, aprueban PRs, fusionan, despliegan ni cierran trabajo sin una autorización humana auditable.

## Métricas sanas del proceso

Medir edad de historias, tiempo bloqueado, defectos reabiertos, cumplimiento de revisiones y estabilidad del flujo. No medir actividad individual, tecleo, tiempo conectado ni productividad personal salvo una decisión legítima, proporcional y explícita que respete normativa aplicable.
