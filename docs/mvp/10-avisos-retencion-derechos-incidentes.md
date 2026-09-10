# S10 — Aviso, retención, derechos e incidentes

**Estado:** procedimientos y textos base; requieren parametrización por el responsable y prueba antes del piloto.

## Aviso de privacidad para empleado — texto base

`[Cliente]`, como responsable, trata sus datos de identificación profesional, relación/centro, credenciales y registros de inicio, fin y pausas de jornada para gestionar y acreditar el registro diario de jornada y la seguridad del servicio. La base jurídica concreta será `[completar por cliente]`; el registro de jornada se conserva, como mínimo, cuatro años conforme al artículo 34.9 ET. Los datos se alojan en un entorno dedicado operado por `[Proveedor]` como encargado. Podrán acceder las personas autorizadas de la empresa y, cuando corresponda, la RLT y la Inspección. No se usan GPS, biometría, reconocimiento facial, fotos, vídeo, cámara ni monitorización. Puede ejercer los derechos aplicables ante `[canal del responsable]` y contactar con `[DPO/contacto]`; tiene derecho a reclamar ante la AEPD. Las transferencias, subencargados y plazos adicionales se informarán en la versión completada del aviso.`

El cliente debe entregar este aviso antes de la activación individual y conservar prueba de entrega cuando proceda. No se emplea consentimiento como sustituto de la base jurídica que corresponda en la relación laboral.

## Política de retención y bloqueo

1. **Preservar:** fichajes, pausas, correcciones y evidencia necesaria se conservan al menos cuatro años; las correcciones son aditivas y no eliminan la evidencia original.
2. **Separar plazos:** cuenta, sesión, QR, PIN, soporte, auditoría y exportaciones tienen plazos diferenciados definidos en RAT/DPA; no se aplica una eliminación global.
3. **Bloquear antes de suprimir:** al vencer la finalidad/plazo, impedir uso ordinario y limitar acceso al mínimo para responsabilidades legales, litigio o instrucciones válidas. Documentar fundamento, responsable, fecha de revisión y alcance.
4. **Borrado seguro:** tras levantar el bloqueo, borrar de aplicación, DB, almacenamiento y backups conforme a ciclo documentado; emitir evidencia de ejecución sin exponer datos.
5. **Litigio/inspección:** una orden de preservación suspende el borrado del alcance afectado y se audita; al finalizar, se reanuda el ciclo con aprobación.

S9 aplica una caducidad lógica de 30 días a los archivos de exportación y deniega su descarga tras el vencimiento, pero no hay job que elimine el archivo materializado ni los artefactos de otros conjuntos. Sigue sin existir un job transversal de retención, bloqueo y borrado ni un catálogo final de plazos. Es un bloqueo de piloto, no un control existente.

## Solicitudes de derechos

| Fase | Responsable | Acción |
|---|---|---|
| Recepción | Cliente/responsable | Registrar solicitud, fecha, canal, identidad, derecho y alcance; acusar recibo conforme a su procedimiento. |
| Verificación | Cliente | Verificar identidad de forma proporcional sin solicitar datos excesivos. |
| Evaluación | Cliente + DPO | Determinar derecho, excepciones, terceros y posible conflicto con conservación laboral/evidencia. |
| Ejecución | Encargado bajo instrucción | Extraer, rectificar mediante mecanismo aditivo, restringir/bloquear o borrar cuando proceda; nunca editar fichajes originales. |
| Cierre | Cliente | Responder dentro del plazo legal aplicable, documentar decisión/evidencia y actualizar el registro. |

El encargado remite sin demora al cliente cualquier solicitud recibida directamente. Rectificación no significa reescribir auditoría o fichajes: se incorpora corrección/evidencia vinculada cuando el dominio correspondiente esté disponible.

## Incidentes y brechas

1. **Contener:** quien detecta aísla acceso/credencial si es seguro, preserva logs/evidencia y abre incidente con hora UTC, entorno, correlación y persona de guardia.
2. **Escalar:** operación avisa a seguridad/DPO del proveedor; si puede afectar datos del cliente, el encargado avisa al contacto del responsable sin dilación indebida, con hechos conocidos, no especulación.
3. **Evaluar:** clasificar confidencialidad, integridad, disponibilidad, categorías/volumen, duración, causa, afectados y riesgo. El responsable decide y documenta notificación a autoridad; el RGPD contempla, cuando procede, hasta 72 horas desde que conoce la brecha.
4. **Comunicar/remediar:** el responsable decide comunicación a interesados cuando exista alto riesgo; proveedor proporciona datos técnicos, contención, recuperación y seguimiento.
5. **Cerrar:** análisis de causa, acciones correctivas, fecha objetivo, validación y retención del expediente. Simulacro antes de piloto.

Canales, guardias, RACI y plantillas de aviso se completan en el DPA/runbook de operación. No se promete que toda incidencia sea notificable ni que la herramienta determine jurídicamente el umbral.
