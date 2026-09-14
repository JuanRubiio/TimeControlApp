# Protocolo de incidente del proceso de delivery

**Disparador:** posible inclusión o exposición de PII, secreto, token, contraseña, dato de cliente, exportación/backup real o información confidencial en Issue, comentario, prompt, adjunto, commit, rama, log o salida de herramienta.

## Respuesta inicial

1. **Detener** la tarea y cualquier compartición/automatización relacionada. No copiar el contenido a otros comentarios ni prompts.
2. **Limitar la exposición:** retirar acceso público si existe y preservar sólo la evidencia mínima necesaria para la respuesta; no reescribir historia Git si ello destruye trazabilidad sin decisión de seguridad.
3. **Notificar** al responsable humano de seguridad/privacidad y al PO con: canal, tipo de dato, alcance conocido, hora y enlaces seguros. No pegar el secreto/dato en la notificación.
4. **Contener:** revocar/rotar la credencial si puede ser secreto; retirar adjunto/contenido según política y capacidad del sistema; pausar la historia.
5. **Evaluar y registrar:** responsable determina impacto, obligaciones de aviso, remediación y qué evidencia conservar. El registro operativo se minimiza y no se usa como Issue ordinario.
6. **Reanudar sólo con autorización:** registrar causa, control preventivo, responsable y condición de cierre. Si afecta datos personales, DPO/jurídico decide los pasos exigibles.

## Prevención obligatoria

- Usar fixtures sintéticos y revisar antes de pegar/adjuntar/publicar.
- Nunca incluir `.env`, claves privadas, cookies, tokens, dumps, logs crudos, registros laborales ni exportaciones reales.
- Aplicar mínimo contexto a sesiones y agentes; los secretos viven sólo en mecanismos aprobados de gestión de secretos, nunca en prompts.
- Una herramienta/agente no gestiona el incidente de forma autónoma ni decide notificaciones externas.
