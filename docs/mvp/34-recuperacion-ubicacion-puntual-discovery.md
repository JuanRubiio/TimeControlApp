# HU-TC-034 — Recuperación proporcionada ante ubicación puntual no validable

**Estado:** discovery UX/privacidad. No autoriza una nueva captura, proveedor, dato persistido ni activación con datos reales.

## Decisión de experiencia

La verificación puntual es un método opcional de un único fichaje. Si no puede completarse, la persona conserva una alternativa equivalente: fichar sin ubicación. La interfaz explica el siguiente paso, no diagnostica el dispositivo más allá de lo necesario y no transforma un fallo técnico en una consecuencia laboral.

La pantalla no muestra un mapa personal, distancia, coordenadas, precisión numérica, nombre de zona ni la causa de una eventual política de otra persona.

## Catálogo de recuperación

| Situación observable | Mensaje para la persona | Acción principal | Alternativa equivalente | Datos que no se conservan |
| --- | --- | --- | --- | --- |
| Navegador sin capacidad | «Este dispositivo no permite comprobar la ubicación.» | Fichar sin ubicación | Solicitar corrección si el registro no corresponde | dispositivo, IP, coordenadas |
| Permiso bloqueado o denegado | «La ubicación no está disponible para este fichaje.» | Reintentar, sólo si la persona quiere revisar su permiso | Fichar sin ubicación | estado detallado de permisos, coordenadas |
| Sin respuesta o servicio temporal | «No se pudo comprobar la ubicación ahora.» | Reintentar | Fichar sin ubicación | red, señal, IP, coordenadas |
| Precisión insuficiente | «No se pudo completar la comprobación de ubicación.» | Reintentar | Fichar sin ubicación | precisión exacta, coordenadas, distancia |
| Verificación fuera de la zona autorizada | «No se pudo verificar este fichaje con ubicación.» | Fichar sin ubicación | Solicitar corrección si hace falta contexto adicional | zona, radio, distancia y coordenadas |

El copy deliberadamente no atribuye culpa, no ordena activar un permiso y no afirma presencia, ausencia o incumplimiento.

## Comportamiento y accesibilidad

1. El aviso se anuncia mediante una región de estado y mantiene el foco en la acción de fichaje; no abre modal ni bloquea la alternativa.
2. «Con ubicación» y «Sin ubicación» permanecen visibles, tienen nombres accesibles inequívocos y están disponibles para entrada y salida por igual.
3. Reintentar solicita la ubicación sólo mediante una acción nueva e inequívoca de la persona. Nunca hay reintentos automáticos ni en segundo plano.
4. El fallo de navegador no se envía al servidor. Un rechazo de servidor muestra el mismo patrón de recuperación y no expone datos de la zona configurada.
5. Si se registra sin ubicación, el evento conserva únicamente su método `web`; no se infiere un motivo del fallo ni una excepción laboral.

## Evidencia mínima

La evidencia existente para una verificación correcta conserva política, zona autorizada y banda de precisión, nunca coordenadas. Para un fallo local no se añade auditoría ni telemetría. Para una respuesta negativa del servidor, una futura revisión de auditoría sólo podrá usar un código técnico minimizado y correlación, sin coordenada, distancia, precisión exacta, IP ni estado de permiso.

## Contrato de la siguiente entrega

Antes de modificar UI o API, una historia de implementación deberá:

- normalizar en cliente y servidor los cinco resultados anteriores en códigos no reveladores;
- conservar la alternativa sin ubicación con igual capacidad de fichar;
- verificar E2E sintético para permiso denegado, navegador no compatible, timeout, precisión insuficiente y fuera de zona;
- comprobar lector de pantalla, foco, teclado y reducción de movimiento;
- pasar revisión DPO/laboral, QA y seguridad sobre copy, auditoría y retención.

No forma parte de esta historia crear bloqueo de fichaje, reglas disciplinarias, ubicación continua, historial, mapa de persona, telemetría del dispositivo ni un proveedor externo.
