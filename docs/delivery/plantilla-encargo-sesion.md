# Plantilla — Encargo de sesión o agente por fase

> Un encargo invoca un rol temporal. No le concede permisos, aprobación ni acceso más allá de lo expresamente indicado.

## Identidad

- **HU / fase:**
- **Rol contractual y versión:**
- **Responsable humano / sesión Codex:**
- **Modelo y esfuerzo propuestos:** confirmar disponibilidad; no asumir precio ni capacidad futura.

## Objetivo y límites

- **Objetivo concreto de esta fase:**
- **Entrega esperada y ubicación:**
- **Fuera de alcance / condición de parada:**
- **Decisiones que no puede tomar:**

## Contexto mínimo autorizado

- Contrato de historia / Issue:
- ADRs, contratos y archivos exactos a leer:
- Fixtures sintéticos permitidos:
- Archivos/rutas que puede editar, si procede:
- Información expresamente prohibida: PII, secretos, `.env`, datos de cliente/producción, backups y exportaciones reales.

## Calidad, hand-off y escalado

- Criterios/controles que debe comprobar:
- Pruebas o evidencia requerida:
- ¿Requiere E2E? recorrido integrado, excepción justificada o no aplica:
- Receptor del hand-off:
- Máximo de reintentos: dos; después dividir, mejorar evidencia o escalar.
- Escalar a: PO / arquitectura / seguridad-privacidad / SRE (según corresponda).
- Estado Kanban recomendado al terminar y evidencia para la transición: uno de los estados configurados del Project; si no puede avanzar, `Bloqueada` con causa, desbloqueador y fecha de revisión.
