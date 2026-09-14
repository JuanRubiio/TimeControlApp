# Registro de decisiones, riesgos y excepciones

**Uso:** una entrada por decisión duradera, excepción o aceptación de riesgo. Si afecta arquitectura, datos, retención, seguridad o integración, crear además o actualizar un ADR versionado.

| Campo | Contenido obligatorio |
|---|---|
| ID y fecha | `DEC-YYYY-NNN` / fecha |
| Historia/épica/ADR | Enlaces trazables |
| Tipo | Decisión, riesgo residual, excepción temporal, cambio de alcance |
| Contexto y evidencia | Hechos verificados, no supuestos ni datos sensibles |
| Opciones consideradas | Incluye no hacer nada y motivo de descarte |
| Decisión / condición | Qué se aprueba, rechaza o aplaza; límites explícitos |
| Impacto | Producto, legal, privacidad, seguridad, UX, operación y coste |
| Controles / seguimiento | Qué debe ocurrir y cómo se verifica |
| Responsable de decisión | PO; DPO/jurídico/SRE cuando aplique |
| Caducidad / revisión | Fecha, evento o condición que obliga a revisarla |
| Riesgo aceptado | Quién lo acepta de forma explícita; nunca un agente |

No se registra un secreto, PII, exportación real ni detalle de incidente sensible. Si la excepción necesita información reservada, el registro público interno sólo referencia el repositorio seguro y el responsable.
