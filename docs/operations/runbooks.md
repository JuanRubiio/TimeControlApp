# Runbooks de operación

## Alta de cliente

Validar DPA, contactos, dominio, DPO, retención y hosting aprobado. Crear secretos únicos, ejecutar `npm run ops:provision`, construir imagen inmutable, levantar el proyecto Compose aislado, migrar, configurar proxy/TLS y ejecutar salud, métricas y restore de prueba. Guardar la evidencia.

## Incidencia

Confirmar la alerta sin recopilar PII. Registrar hora, entorno, correlación técnica y operador; comprobar `/api/health`, estado Compose y backup reciente. Reducir acceso al mínimo y escalar a responsable/DPO conforme al contrato. No copiar logs con cookies, cuerpos o datos laborales a herramientas externas.

## Brecha

Aislar el entorno y revocar sesiones/credenciales afectadas. Preservar logs y auditoría; informar al responsable y DPO usando los contactos acordados. El DPO determina evaluación, notificación y plazos RGPD. No afirmar alcance ni notificar externamente sin esa coordinación.

## Rollback

Detener la actualización, restaurar el `APP_IMAGE` inmutable anterior y levantarlo con `--no-build`. Confirmar salud y autorización. Las migraciones son aditivas; no borrar tablas/eventos. Si los datos exigen recuperación, usar el runbook de restore.

## Restore

Revisar autorización, backup, hash, cliente y destino dedicado. Ejecutar el comando con `RESTORE_CONFIRM`, comprobar `environment_context`, salud y permisos; documentar RTO/RPO y resultado. Rotar secretos si existe indicio de compromiso.

## Rotación de secretos

Generar secreto distinto, actualizar el gestor/fichero seguro, reiniciar el entorno, probar login/MFA, métricas y backup. Para contraseñas PostgreSQL, cambiar rol y parámetro de forma coordinada. Mantener el secreto previo sólo durante la ventana aprobada y revocarlo después. Auditar operador, fecha y entorno sin anotar el valor.
