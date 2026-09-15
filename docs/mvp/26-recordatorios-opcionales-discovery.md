# S25 — Discovery de recordatorios de fichaje opcionales

**Estado:** discovery completado; no autoriza implementación ni envío. **Issue:** [#55](https://github.com/JuanRubiio/TimeControlApp/issues/55). **Dependencias:** S20, S22/#44, S15 NO-GO y validación humana de PO, DPO/laboral y operación antes de cualquier canal. **Datos:** exclusivamente sintéticos.

## Decisión de discovery

No se incorpora ahora un sistema de recordatorios. La necesidad —reducir olvidos sin convertir la jornada en una fuente de presión— es plausible, pero no está demostrada para un segmento concreto y un aviso que llegue fuera de la aplicación requiere un canal, programación, consentimiento/expectativas, datos de contacto o permisos técnicos y soporte operativo que el MVP no ha aprobado.

La candidata futura más proporcionada es un recordatorio **opt-in y propiedad de la persona**, explicable y fácilmente desactivable. Antes de diseñarla o implementarla, el PO debe escoger un único caso de uso y DPO/laboral/operación deben validar los límites de datos, horario y canal. No hay envío, tarea programada, cola, *push*, correo, SMS, integración, telemetría ni almacenamiento nuevo en este alcance.

## Evidencia y lectura de mercado

La competencia comercializa recordatorios y varios canales: JornAda indica avisos automáticos de fichajes omitidos y configuración individual de categorías de notificación; Woffu comunica recordatorios y alertas de jornada; Sesame anuncia avisos por panel, correo y *push*. Son patrones de mercado, no una necesidad validada ni una pauta de cumplimiento para TimeControl: [JornAda](https://jorn-ada.com/funcionalidades/app-control-horario), [Woffu](https://woffu.com/es/control-horario-y-registro-de-la-jornada-laboral/), [Sesame HR](https://www.sesamehr.es/software-control-horario/).

La AEPD recuerda que correo y teléfono personales no son, con carácter general, datos necesarios para la relación laboral; su entrega debe ser voluntaria y estar informada. Por ello, el discovery descarta pedir o reutilizar contactos personales para recordatorios. También se excluye cualquier perfilado o consecuencia automatizada sobre la conducta de fichaje: [AEPD, datos de contacto particulares](https://www.aepd.es/preguntas-frecuentes/3-proteccion-de-datos-en-el-ambito-laboral/FAQ-0308-puede-solicitar-el-empresario-el-telefono-y-direccion-de-correo-electronico-particular-del-trabajador), [AEPD, decisiones individuales automatizadas](https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-no-ser-objeto-de-decisiones-individuales).

## Problema, personas y alternativas

| Persona | Necesidad verificable | Alternativa menos invasiva | Límite de autoridad |
| --- | --- | --- | --- |
| Empleado | Recordar voluntariamente la próxima acción de jornada sin sentirse vigilado. | Consultar la acción actual en «Mi jornada» cuando abre la aplicación. | Activa, pausa o desactiva su preferencia; nunca recibe una orden ni penalización. |
| Responsable | Resolver incidencias ya existentes dentro de su ámbito. | Bandeja y corrección con decisión humana. | No configura ni consulta preferencias personales de aviso. |
| Administración | Mantener políticas de fichaje y soporte. | Ayuda de producto y configuración contractual existente. | No activa avisos masivos ni usa preferencias para evaluar a personas. |
| PO / UX / DPO-laboral / operación | Decidir si un caso de uso concreto justifica un canal nuevo. | No implementar. | Cada uno valida su puerta; ninguno la sustituye. |

No se presupone que un olvido sea incumplimiento ni que deba corregirse automáticamente. La persona puede no usar recordatorios y conservar el mismo flujo de fichaje, consulta y corrección.

## Opciones examinadas

| Opción | Valor esperado | Coste e impacto | Resultado |
| --- | --- | --- | --- |
| Información contextual al abrir «Mi jornada» | Explica el siguiente paso sin salir de la aplicación. | No entrega un aviso fuera de sesión; puede confundirse con la UI actual. | Mantener como alternativa de no uso; no añade capacidad. |
| Aviso de navegador explícitamente aceptado | Podría llegar mientras la persona no está viendo la página. | Requiere permiso, comportamiento por navegador/dispositivo, horario, frecuencia, soporte y diseño de revocación. | Sólo candidata a una ficha UX y contrato posterior. |
| Correo, SMS, WhatsApp, Slack, Teams o *push* externo | Potencial alcance multicanal. | Contacto/consentimiento, integraciones, entrega, costes, retención, incidentes y presión laboral. | Rechazado para MVP y este discovery. |
| Recordatorio automático al detectar ausencia, ubicación o conducta | Puede parecer oportuno. | Perfilado, vigilancia o decisión implícita; además contradice límites vigentes. | Rechazado. |

## Ficha UX/UI obligatoria antes de cualquier interfaz

Si se autoriza explorar una sola opción, el diseño debe partir de una preferencia clara y voluntaria, no de una campana global ni de un mensaje persistente. La ficha debe cubrir:

1. Una explicación breve de finalidad, canal, cuándo puede aparecer, frecuencia máxima, franja silenciosa y cómo desactivarlo antes de pedir permiso.
2. Estados de inicio, sin preferencia, activación, permiso denegado, dispositivo no compatible, envío no confirmado, pausa y desactivación; ninguno repite un fichaje ni cambia el estado de la jornada.
3. Una acción secundaria de igual jerarquía para «Ahora no» o «Seguir sin recordatorios», con foco visible, teclado, lector de pantalla, móvil y escritorio.
4. Controles del catálogo S20/S25: etiquetas visibles, ayuda contextual, acción operativa de 40 px y alternativas agrupadas, sin botones desproporcionados, *badges* de urgencia ni color como único significado.
5. Copy no punitivo: no menciona productividad, retraso, sanción, cumplimiento automático ni supervisión. La preferencia no se muestra a responsable ni Administración salvo una justificación futura aprobada.

La prueba de descubrimiento, si PO la aprueba, será un prototipo sintético sin entrega real: cinco personas empleadas representativas realizan activación, rechazo, lectura y desactivación; se registra sólo feedback cualitativo no identificable. No se mide puntualidad, tasas individuales ni rendimiento.

## Privacidad, laboral, seguridad y operación

| Área | Regla de diseño | Puerta previa a implementación |
| --- | --- | --- |
| Datos | No correo/teléfono personal, ubicación, biometría, contenido de fichaje, calendario externo ni datos de terceros. Preferencia mínima y propósito declarado sólo si se aprueba un contrato posterior. | DPO y laboral definen base, información, proporcionalidad, retención, destinatarios, derechos y si procede evaluación de impacto. |
| Decisiones | No detectar olvidos, perfilar, escalar, sancionar, bloquear fichaje ni decidir correcciones. | PO confirma el beneficio y la alternativa equivalente sin recordatorio. |
| Canal | Ningún canal se presume autorizado; permiso técnico no sustituye la decisión laboral/privacidad. | PO escoge uno; DPO/laboral valida; seguridad revisa proveedor, secretos y superficie de ataque. |
| Operación | No cron, colas, reintentos, webhooks, proveedores, SLAs ni telemetría durante el discovery. | Operación define propietario, horarios, límites de frecuencia, observabilidad minimizada, incidencias, baja y coste. |
| S15 | No cambia el NO-GO de piloto ni habilita datos reales. | S15 se mantiene como bloqueo independiente. |

## Criterios de salida y decisión pendiente

El discovery queda cerrado documentalmente cuando este contrato esté revisado en producto. Una historia de implementación sólo podrá abrirse si se cumplen **todos** estos puntos:

- PO identifica segmento y un único problema observable, y aprueba la alternativa menos invasiva.
- UX entrega la ficha de la sección anterior y una prueba sintética accesible; no hay patrón coercitivo.
- DPO/laboral emite validación sobre información, base, proporcionalidad, horario, retención y no uso disciplinario.
- Seguridad y operación aprueban el canal único, permiso/revocación, límites de frecuencia, soporte, fallo y retirada.
- Un contrato técnico independiente delimita RBAC, datos, auditoría, retención, pruebas negativas y una opción equivalente sin recordatorio.
- S15 conserva sus puertas; esta capacidad no habilita datos reales ni despliegue.

Hasta que exista esa decisión conjunta, la salida correcta es **no implementar**. Se conserva «Mi jornada» como orientación manual y no se abre ninguna configuración, ruta, API, tabla, tarea ni integración de recordatorios.
