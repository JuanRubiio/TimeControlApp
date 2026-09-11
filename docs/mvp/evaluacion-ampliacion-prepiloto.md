# Evaluación de ampliación prepiloto posterior a S13

**Fecha:** 11/09/2026. **Base de evidencia:** S13, informe de preparación, guía de piloto y contratos S1–S12. **Naturaleza:** decisión de alcance; no autoriza implementación.

## Conclusión

**El piloto debe esperar a sesiones concretas obligatorias.** No hay P0 confirmado ni un defecto funcional crítico no corregido, pero S13-005 es un P1 abierto: no hay evidencia operativa de TLS/WAF/rate limit, restauración aislada, retención/borrado de exportaciones ni cierre DPO/laboral/operación. Tratar datos reales antes de cerrarlo sería incompatible con el propio Go/No-Go de S13.

El MVP sí valida la hipótesis funcional central con datos sintéticos: empleado ficha y corrige; responsable revisa dentro de su centro; cálculo, trazabilidad y exportación autorizada funcionan. La ampliación debe ser mínima: cerrar la operación segura (S15), mejorar de manera sustancial la experiencia existente (S14) y, si el piloto no va a depender de operación técnica diaria, exponer las capacidades ya contratadas de configuración y exportación (S16). No se recomienda redefinir la hipótesis principal.

## Priorización fundada

| Propuesta | Evidencia S13 | Prioridad | Valor piloto | Esfuerzo | Riesgo | Nueva sesión / ampliación | Requiere aprobación |
| --------- | ------------- | --------- | ------------ | -------- | ------ | ------------------------- | ------------------- |
| Cierre de entorno, restore, retención y validaciones externas | S13-005 P1 abierto; NO-GO explícito | Obligatorio antes del piloto | Hace posible tratar datos reales de forma recuperable y defendible | M | Seguridad, privacidad, operación y legal alto | S15 | Sí: proveedor, responsables, DPO/laboral y criterios RPO/RTO |
| Auditoría UI/UX transversal y accesible | S13-006/007/008 P2; lector de pantalla y aceptación humana pendientes | Muy recomendable antes del piloto | Reduce errores de fichaje y revisión, y hace el piloto representativo | M | Operativo y accesibilidad medio | S14 | Sí: alcance visual y tolerancia a cambios de rutas compartidas |
| Configuración inicial y exportación guiadas sobre APIs existentes | S13-006: alta/configuración y exportación sólo API; guía obliga a escalar | Muy recomendable antes del piloto asistido | Evita que el piloto mida soporte manual en vez de producto | M | Operativo/comercial medio | S16 | Sí: decidir autoservicio mínimo frente a piloto asistido |
| Resolución de selector para segunda corrección | S13-008 no reproducido con segundo evento; puede ser protección o defecto | Recomendable durante el piloto, salvo reproducción P1 | Evita bloqueo de correcciones repetidas reales | S | Operativo medio | Ampliación controlada de S14/S16 tras caso reproducible | Sí: comportamiento esperado contra duplicados |
| Revisión humana QR físico y aceptación de usuarios | S13 declara QR físico y aceptación humana pendientes | Obligatorio dentro de S15 | Confirma que el método aprobado funciona fuera del laboratorio | S | Operativo y seguridad medio | S15 | Sí: centro, lector y participantes sintéticos/consentidos |
| Importación CSV/Excel controlada | README la aplaza; S13 no aporta evidencia de necesidad | Post-piloto | Acelera altas si el piloto confirma volumen repetido | M | Calidad de datos y privacidad medio | Roadmap, no sesión prepiloto | Sí: plantilla, validación, reversión y DPO |
| Notificaciones de fichaje incompleto/corrección | No hay evidencia de incumplimiento del flujo ni canal de entrega aprobado | Durante piloto | Puede mejorar seguimiento si se mide fricción real | M | Privacidad, ruido y expectativas laborales medio | Roadmap condicionado | Sí: canal, opt-in, destinatarios y horario |
| Cierre de período e incidencias | S5/S6 ya calculan y revisan; no hay evidencia de que falte un cierre formal | Durante piloto | Puede estructurar la revisión mensual sin reinterpretar convenio | M | Legal/operativo medio | Descubrimiento durante piloto | Sí: semántica de cierre y reapertura |
| Vacaciones/ausencias | S5 sólo identifica ausencia de fuente; no existe evidencia de que el piloto deba gestionarlas | Post-piloto | Sólo útil si el piloto confirma que bloquea la lectura de incidencias | L | Laboral y reglas de negocio alto | Roadmap | Sí: modelo, permisos, integración con calendario y asesoría |

## Evaluación por área

| Área | Hallazgo/evidencia | Usuarios y riesgo | Decisión |
| --- | --- | --- | --- |
| Onboarding y empresa | S13-006: altas, centros, relaciones, reglas y calendarios se hacen por API; la guía pide escalar. | Administrador/RR. HH.; operación manual y adopción comercial. | S16 muy recomendable: checklist y formularios sobre contratos S2/S3, sin nuevas reglas. |
| Empleados, centros, calendario y jornada | S2/S3 ya cubren modelo y versionado; S13 no encontró fallo de dominio. | Administrador; configuración incorrecta si se opera por API. | S16: UI mínima validada, no importación ni turnos complejos. |
| Fichaje móvil/escritorio | Recorrido S13 correcto; falta QR físico y revisión visual/móvil humana. | Empleado; error cotidiano y confianza. | S14 + prueba S15. Sin app nativa ni offline completa. |
| Pausas, incidencias, saldos y correcciones | Funcionan; UUID técnico y posible segunda corrección poco claros. Saldo ya es informativo. | Empleado/responsable; confusión y corrección no resuelta. | S14 mejora copy/presentación; investigar S13-008 antes de cambiar reglas. |
| Aprobación | Bandeja y decisiones probadas, responsable acotado. | Responsable/RR. HH.; demora o decisión mal informada. | S14 mejora jerarquía/estados; no cadenas, SLA ni reapertura. |
| Exportación y revisión | CSV/PDF autorizados funcionan, pero no hay UI ni borrado programado. | RR. HH./administrador; evidencia inaccesible o retención incorrecta. | S15 obligatorio para retención; S16 muy recomendable para solicitar/descargar en UI. |
| Errores y recuperación | S13 validó mensajes/etiquetas básicos; faltan estados consistentes y recuperación visual revisada. | Todos; abandono o duplicidad. | S14, con reintento seguro e idempotencia visible, sin ocultar límites. |
| Accesibilidad, responsive y lenguaje | Faltan lector de pantalla, aceptación humana y hay IDs técnicos. | Empleado y responsable; exclusión y malentendidos. | S14 obligatorio para la mejora UX, validación humana dentro de S15. |
| Gestión del piloto | Datos demo reproducibles existen; faltan proveedor, soporte operativo, aceptación y feedback estructurado. | Administrador, soporte; piloto no representativo. | S15: runbook, responsables, alta, soporte y captura de feedback minimizado. |
| Seguridad, privacidad y recuperación | S13-005, S10/S12: controles locales, no evidencia en destino. | Todos; alto impacto. | S15 obligatorio y condición de Go. |
| Exclusiones | Los contratos y S13 las mantienen fuera. | Producto y DPO; deriva de alcance. | Mantener excluidas explícitamente. |

## Contratos de trabajo y orden

1. **S15 obligatoria:** cierre operativo, privacidad y aceptación en entorno dedicado. Es la puerta de datos reales.
2. **S14 muy recomendable:** mejora UI/UX y accesibilidad de los flujos existentes. Puede preparar componentes mientras S15 opera, pero no desplegar cambios sin coordinar con S16.
3. **S16 muy recomendable:** configuración y exportación guiadas, sólo sobre contratos existentes. Depende de la dirección visual de S14 y de que S15 confirme el almacenamiento/retención de exportaciones.
4. Realizar el piloto asistido con métricas cualitativas y sólo entonces decidir S13-008, notificaciones, cierre de período, ausencias e importación.

## Exclusiones y rechazos explícitos

Se rechazan para este ciclo GPS/geolocalización, biometría, reconocimiento facial, cámara, fotografía, vídeo, vigilancia, analítica de productividad, monitorización de pantalla, nómina, interpretación automática de convenios, planificación compleja de turnos, conectores de nómina, app nativa y PWA offline completa. Aumentan riesgo, coste o invasividad sin evidencia S13 de valor para la hipótesis del piloto.

Tampoco se autoriza importar CSV/Excel, enviar notificaciones, cerrar períodos o modelar vacaciones/ausencias por intuición. Requieren evidencia de piloto y decisión de producto documentada.
