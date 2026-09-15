# S29 — Aprendizaje postpiloto minimizado

**Estado:** discovery documental en curso. **Issue:** [#36](https://github.com/JuanRubiio/TimeControlApp/issues/36). **Dependencias:** S11, S15, S17, S20 y decisión humana previa. **Límite:** este documento no recluta personas, no recoge feedback ni habilita un canal en el producto.

## Objetivo

Definir cómo comprobar una fricción de producto después de un piloto sin convertir el aprendizaje en telemetría de rendimiento, vigilancia laboral o un repositorio de contenido sensible. La unidad de aprendizaje es una **tarea de producto**, no la persona ni su productividad.

## Puerta obligatoria antes de cualquier investigación real

No se invita, contacta, observa ni registra a ninguna persona hasta que PO, DPO/laboral y la organización del piloto aprueben por escrito:

1. La hipótesis única, rol, tareas y alternativa de no participación.
2. Responsable operativo, canal, información previa, plazo, destinatarios y política de eliminación.
3. Base y proporcionalidad de la recogida, evitando que una relación de empleo se presente como consentimiento libre por defecto.
4. Separación entre quien facilita el estudio y quien toma decisiones laborales; ningún responsable recibe respuestas identificables para evaluar a su equipo.
5. Manejo de incidencias, derechos y retirada; ningún dato de acceso, PIN, token, contenido laboral, ubicación, salud o terceros entra en el estudio.

Sin esas decisiones se conserva exclusivamente el recorrido sintético de S11. S15 mantiene el NO-GO para datos reales.

## Protocolo candidato con datos sintéticos

| Fase | Acción permitida | Evidencia mínima | Prohibido |
| --- | --- | --- | --- |
| Preparar | PO formula una pregunta y una tarea que ya exista. | Ficha de hipótesis, rol y criterio de salida. | Instrumentar clics, activar *pop-ups*, crear formularios o contactar personas. |
| Recorrer | Facilitador ejecuta el guion con fixtures S11 y roles demo. | Resultado cualitativo: completó, se bloqueó o no se pudo evaluar; observación de la pantalla, sin identidad. | Cronometrar personas, inferir rendimiento, grabar pantalla/voz o capturar texto libre. |
| Clasificar | Agrupar fricciones por tarea, no por participante. | Una tarjeta con problema, evidencia, alternativa menos invasiva y decisión. | Ranking, perfiles individuales, SLA, alertas o decisión automática. |
| Decidir | PO acepta, rechaza o mantiene en discovery una candidata. | Decisión enlazada a contrato, riesgo y responsable. | Convertir una observación en implementación automática. |
| Eliminar | Descartar notas temporales conforme a la política aprobada. | Constancia de cierre sin contenido personal. | Retención indefinida, reutilización o exportación de respuestas. |

## Guion sintético inicial

El guion sólo comprueba claridad y recuperación de capacidades existentes. No genera nuevos datos de jornada ni modifica ninguna configuración:

- Empleado: iniciar sesión, reconocer su estado y siguiente acción, consultar jornada publicada y localizar la corrección existente.
- Responsable: entrar en su centro, localizar una corrección pendiente de su ámbito y entender que decide una persona, no la aplicación.
- Administración: distinguir configuración de decisiones de corrección y localizar trazabilidad sin capacidad de aprobar.
- Todos los roles: comprobar sesión vencida, error recuperable, foco de teclado y mensajes que no prometan cumplimiento, nómina o vigilancia.

Una fricción sólo pasa a candidata si impide completar una de estas tareas en fixture sintético y no puede resolverse con copy, orden o componente existente. Se documenta también la alternativa de no construir.

## Modelo mínimo de tarjeta de aprendizaje

| Campo | Contenido permitido |
| --- | --- |
| Tarea y rol | Nombre genérico de la tarea y rol autorizado. |
| Hipótesis | Problema observable, no atributo de una persona. |
| Evidencia | Resultado sintético o cita anonimizada aprobada, sin identificador ni contenido laboral sensible. |
| Impacto | Comprensión, recuperación o accesibilidad de la tarea; nunca productividad. |
| Alternativa menos invasiva | Ajuste de copy, ayuda pasiva o no actuar. |
| Riesgo y dependencia | Privacidad, laboral, RBAC, contrato propietario, UX, QA y operación. |
| Decisión PO | Rechazar, mantener discovery o autorizar una nueva historia con contrato propio. |

## UX, accesibilidad y privacidad por diseño

- No hay campanas, encuestas emergentes, puntuaciones, urgencia, incentivos ni mensajes que condicionen la participación.
- Si una investigación futura incorpora una superficie, debe usar el catálogo visual existente, explicar propósito y salida antes de preguntar, ser equivalente por teclado, lector de pantalla y móvil, y permitir abandonar sin perjuicio.
- El producto no envía correo, SMS, *push*, chat, notificaciones del navegador, webhooks ni integraciones de investigación.
- No se guardan identificadores personales, cuentas, eventos de fichaje, coordenadas, IP, dispositivo, duración de uso, grabaciones, capturas ni texto libre en GitHub, logs, analítica o fixtures.

## Criterios para cerrar #36

- El protocolo diferencia inequívocamente simulación sintética de investigación con personas.
- Cada futura candidata exige hipótesis, tarea, alternativa de no actuar, decisión PO y contrato independiente.
- El protocolo conserva RBAC, decisión humana, S15 y exclusiones de vigilancia/automatización.
- DPO/laboral, responsable y canal siguen siendo puertas previas a cualquier participación real; ninguna se declara aprobada por este documento.

## Decisión provisional

Se recomienda usar este protocolo sólo con fixtures hasta que exista una decisión formal de piloto. El siguiente producto no se selecciona por cantidad de observaciones, sino por una fricción concreta, proporcionada y no resuelta por las capacidades actuales.
