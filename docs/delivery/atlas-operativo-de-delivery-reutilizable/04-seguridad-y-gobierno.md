# 04 — Seguridad, incidentes y gobierno

## Información permitida

Trabajar con mínimos datos, referencias, datos anonimizados y fixtures sintéticos. Prohibir secretos, credenciales, tokens, PII, bases/exportaciones reales, backups y logs crudos en Issues, comentarios, prompts y adjuntos.

## Incidente de proceso

Detener → limitar exposición → avisar al responsable → revocar/rotar si procede → evaluar/registrar en canal seguro → remediar → reanudar con autorización. Ningún agente decide avisos externos o gestiona el incidente de forma autónoma.

## Gobierno de cambios

Usar ramas, commits pequeños, PR, pruebas y revisión establecidos por `[WORKFLOW GIT]`. Cambios duraderos de arquitectura/datos requieren ADR; cambios de alcance o riesgo residual requieren decisión `[PO]`. Merge no equivale a despliegue; despliegue no equivale a autorización de producción.

## Métricas sanas del proceso

Medir edad de historias, tiempo bloqueado, defectos reabiertos, cumplimiento de revisiones y estabilidad del flujo. No medir actividad individual, tecleo, tiempo conectado ni productividad personal salvo una decisión legítima, proporcional y explícita que respete normativa aplicable.
