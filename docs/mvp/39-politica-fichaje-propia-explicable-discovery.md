# HU-TC-033 — Política de fichaje propia visible y explicable

**Estado:** refinement documentado; pendiente de aprobación PO, DPO/asesoría laboral, UX y QA. **Issue:** [#79](https://github.com/JuanRubiio/TimeControlApp/issues/79). **Dependencias:** ADR-0006, #43, S4, S7, S10, S14 y S15. No autoriza implementación, nuevos permisos, datos, telemetría, cambios de fichaje ni uso con datos reales.

## Finalidad y decisión propuesta

La persona empleada necesita comprender, antes de fichar, cuál es su política efectiva y qué significa en lenguaje no técnico. La futura superficie es una consulta **sólo propia**, de lectura, que explica el método permitido, su vigencia y las condiciones mínimas aplicables. No convierte una configuración en una orden automática, una prueba de presencia ni una decisión laboral.

La recomendación de refinement es no abrir implementación hasta que PO confirme que esta explicación resuelve una fricción demostrable sin duplicar la información contextual de la pantalla de fichaje. Si se aprueba, será una historia de implementación separada y limitada.

## Alcance candidato

La política se resuelve en servidor para la sesión, relación laboral vigente y fecha efectiva; el cliente no aporta `employeeId`, centro, relación, zona, método ni fecha como autoridad. La vista sólo puede mostrar:

- método de fichaje efectivo con etiquetas humanas: web, kiosco QR/PIN o verificación puntual de ubicación cuando esté expresamente autorizada;
- vigencia de la política y un estado neutro si aún no está vigente, ha terminado o no existe;
- centro o zona autorizada únicamente cuando sea necesario para entender el método y ya esté dentro del ámbito propio;
- código o etiqueta operativa aprobada, minimizada y comprensible; y
- límites permanentes: la decisión final se confirma en servidor, un registro no acredita por sí solo una consecuencia laboral y existe un método equivalente sin ubicación cuando aplique ADR-0006.

La política configurada se presenta separada de los fichajes, su historial, coordenadas, precisión, dispositivo, IP y de cualquier evidencia posterior. La vista no afirma presencia, cumplimiento, puntualidad, disponibilidad ni obligación disciplinaria.

## Política puntual de ubicación

Si la política efectiva permite verificación puntual, el texto debe decir que puede solicitarse **sólo** por una acción inequívoca de entrada o salida, en primer plano y para la finalidad aprobada. Debe explicar que no hay seguimiento continuo, segundo plano, rutas, geovallas, pausas, alertas de movimiento ni coordenadas persistidas.

La alternativa sin ubicación conserva la misma funcionalidad y no desencadena una consecuencia automática ante denegación, error, precisión insuficiente, falta de red o dispositivo incompatible. El permiso del navegador no se describe como consentimiento laboral ni como base jurídica. La información previa aprobada y la política efectiva siguen siendo requisitos distintos, conforme al ADR-0006.

## Estados y experiencia accesible

| Situación | Presentación propuesta |
| --- | --- |
| Política vigente | Método, periodo de aplicación y límites con lenguaje breve; enlace contextual a la acción de fichar sólo si ya existe. |
| Sin política aplicable | “No hay una política de fichaje publicada para tu relación vigente. Puedes consultar con tu responsable autorizado.” No se infiere un método ni se revela configuración ajena. |
| Próxima o finalizada | Se muestran fechas legibles y que la política no está activa; no se ofrece una acción nueva. |
| Actualización | Se mantiene la información confirmada, título y foco; el bloque actualizado anuncia el cambio. |
| Error recuperable | Mensaje neutro y reintento; no se muestra una política por defecto ni datos de otro ámbito. |
| Sesión expirada o denegación | Respuesta genérica y retorno seguro, sin enumerar relaciones, centros o zonas. |

La futura interfaz reutiliza el catálogo S14: título y resumen antes del detalle, etiquetas de texto además de color, foco visible y orden lógico. El detalle secundario se abre con teclado y devuelve el foco a su activador. Se valida en 320, 390, 768 y 1280 px, con lector de pantalla, contraste y zoom. “Ubicación puntual” nunca se comunica sólo mediante icono o mapa.

## Autorización, minimización y trazabilidad

Sólo la persona autenticada consulta su propia política efectiva. Administración mantiene la política mediante el contrato que ya corresponda; Responsable puede consultar el efecto sólo dentro de su centro autorizado, pero no asignar, ampliar ni eludirla. Esta historia no crea una nueva facultad para ninguno de los roles.

El recurso futuro debe resolver autorización antes de leer cualquier política y rechazar URL directa, parámetros manipulados, relación terminada, otro tenant o centro ajeno. No expone coordenadas, geometría, radio, historial, motivos libres, salud, datos de terceras personas ni datos técnicos de dispositivos. Si se requiere una auditoría de seguridad, sólo registra actor, tipo de consulta, resultado técnico, correlación y versión/fecha efectiva; no captura contenido mostrado, ubicación ni método detallado.

## Contrato futuro y pruebas requeridas

Antes de implementar, el propietario de #43 debe publicar un puerto de lectura mínimo de política efectiva. La historia consumidora no lee tablas, resolvedores internos ni configuración de zonas directamente, ni reconstruye prioridades de vigencia en el navegador. El sobre queda sujeto a revisión de minimización y no contiene identificadores o detalles no necesarios para la explicación.

La matriz de aceptación de una implementación posterior cubrirá: política propia vigente; ausencia, futuro y caducidad; solapamientos resueltos sólo en servidor; relación terminada; módulos o puertas de ubicación no autorizados; sesión expirada; tenant, centro, empleado y URL manipulados; respuesta sin coordenadas ni datos ajenos; denegación/error/precisión insuficiente con alternativa equivalente; teclado, lector de pantalla, contraste, zoom y los cuatro anchos. Las pruebas usan únicamente fixtures sintéticos. E2E sólo será exigible si se aprueba una interfaz.

## Criterios de salida del refinement

1. PO confirma el problema de comprensión, el lugar de la información y que la primera entrega seguirá siendo sólo propia y read-only.
2. DPO y asesoría laboral aprueban copy, minimización y la separación entre permiso técnico, información laboral y política; cualquier cambio de finalidad, precisión o retención reabre ADR-0006.
3. El propietario de #43 confirma fuente pública, precedencia de vigencias, ámbito y sobre mínimo sin nuevos permisos ni exposición de datos.
4. UX y QA aprueban estados, accesibilidad y matriz de pruebas antes de abrir una historia de implementación.
5. S15 conserva el **NO-GO** para datos reales; esta documentación no habilita despliegue, capturas reales ni ampliación de fichaje.

## Alternativas descartadas

- **Editar la política desde la vista personal:** desplaza una autorización administrativa y aumenta el riesgo de cambios no controlados.
- **Mezclar política y registros históricos:** confunde configuración con evidencia y amplía innecesariamente datos de localización o dispositivo.
- **Mostrar un mapa, coordenadas o radio:** no es necesario para explicar el método y facilita una interpretación de vigilancia.
- **Convertir la política en bloqueo punitivo:** contradice la alternativa equivalente y no automática exigida para la verificación puntual.
- **Ampliar a equipo o centro:** expone información de terceras personas sin necesidad de la finalidad de comprensión propia.
