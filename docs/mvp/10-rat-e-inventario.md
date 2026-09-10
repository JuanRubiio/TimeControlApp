# S10 — RAT e inventario de datos

**Estado:** borrador operativo para completar y aprobar por DPO antes del piloto. **Titular previsto:** proveedor como encargado; cada cliente mantiene su RAT de responsable.

## Registro de actividades del encargado

| Campo art. 30.2 RGPD | Contenido del MVP |
|---|---|
| Encargado y contacto | `[Proveedor, domicilio, contacto privacidad y DPO si aplica: completar]`. Responsable: `[cliente y contacto/DPO: completar]`. |
| Categorías de tratamiento | Servicio de control horario: cuentas, estructura laboral mínima, reglas/calendarios, fichajes, pausas, kioscos, correcciones futuras, auditoría y exportaciones autorizadas. |
| Interesados | Personas empleadas/usuarios del cliente; administradores y responsables. No está diseñado para menores ni categorías especiales. |
| Instrucciones/fines | Prestar, asegurar, mantener y soportar el servicio de registro horario según contrato e instrucciones documentadas del cliente. No reutilizar datos para publicidad, perfilado o entrenamiento. |
| Transferencias | Ninguna prevista por diseño. Completar ubicación/país de cada proveedor real y mecanismo aplicable antes de alta. |
| Subencargados | Sólo los aprobados y listados en el anexo del DPA; inventario vacío hasta selección real. |
| Seguridad | Entorno dedicado; RBAC en servidor; MFA administrativa; auditoría append-only; secretos no versionados; controles pendientes en documento de seguridad. |

## Inventario mínimo

| Conjunto | Datos | Finalidad y base jurídica orientativa del responsable | Destinatarios | Retención propuesta |
|---|---|---|---|---|
| Identidad y acceso | nombre de presentación, email, usuario, hash de contraseña, secreto MFA, roles/ámbitos, sesiones hasheadas | acceso y administración del sistema; art. 6.1.b/c/f según el caso, a validar por cliente | usuario autorizado, soporte bajo instrucción | mientras la cuenta esté activa + plazo técnico/documentado pendiente de DPO; revocar de inmediato al dar de baja |
| Estructura laboral | empresa, centro, zona IANA, empleado, relación laboral, responsable, vigencia | configurar el registro y ámbitos | cliente autorizado; encargado | vigencia de servicio + plazo definido por cliente/DPO; bajas lógicas no equivalen a conservación indefinida |
| Jornada | entrada/salida/pausas, fecha laboral, zona, método, regla/relación fijadas, timestamp de servidor; timestamp del dispositivo opcional | registro diario de jornada; art. 34.9 ET y base RGPD que confirme el cliente | empleado, responsables autorizados, RLT/Inspección cuando proceda, exportación autorizada | **mínimo 4 años** desde el registro, con preservación de evidencia |
| Kiosco | ID público, desafío QR opaco temporal, hash/HMAC de PIN, contador/bloqueo | permitir fichaje QR/PIN sin datos invasivos | sólo proceso y administradores autorizados | desafío: máximo 2 minutos/consumido; PIN: hasta rotación/baja + borrado controlado; sesiones: plazo operativo documentado |
| Auditoría | actor, acción, recurso, resultado, correlación, resumen minimizado, hashes | seguridad, trazabilidad e integridad | administradores/auditores autorizados; soporte bajo instrucción | al menos mientras sea necesaria para evidenciar registro y seguridad; plazo final y bloqueo a aprobar por DPO/abogado |
| Exportaciones | contenido solicitado, manifiesto/hashes y quién/cuándo la solicitó | atender acceso/obligaciones y entrega autorizada | solicitante legitimado | contenido con expiración y borrado seguro; manifiesto/evidencia conforme a retención de auditoría |

### Exclusiones verificadas

No se modelan ni solicitan: geolocalización/GPS, biometría, rostro, huella, fotografía, vídeo, cámara, audio, vigilancia, monitorización de pantalla, domicilio, DNI, fecha de nacimiento, nómina ni diagnóstico automático de convenio. Si se propone alguno, debe abrirse una decisión de producto y revisión DPO previa; no se añade como configuración.

## Información que el cliente debe completar

- Responsable, DPO y canales de contacto; base jurídica concreta y normas/convenio/procedimiento interno aplicables.
- Destinatarios efectivamente habilitados (incluida RLT) y procedimiento de entrega.
- Proveedores de hosting, correo, backup, monitorización y soporte, región y transferencias.
- Plazos de datos de cuenta, soporte, auditoría y exportación; criterios de bloqueo y litigio.
- Evaluación de necesidad de EIPD, consulta a trabajadores/RLT y obligaciones sectoriales.
