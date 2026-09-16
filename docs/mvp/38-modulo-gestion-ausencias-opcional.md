# E-TC-34 — Módulo opcional de vacaciones y ausencias

**Estado:** propuesta de producto y frontera técnica para PO, asesoría laboral, DPO, UX y QA. **Issue:** [#88](https://github.com/JuanRubiio/TimeControlApp/issues/88). **Dependencias:** #83, #46, S6, S10, S14 y S15. No habilita datos reales, saldo legal, nómina, convenio, documentos, ausencias automáticas ni integración con fichajes o cálculo.

## Decisión de producto propuesta

`leave_management` es un módulo opcional por empresa, conforme al ADR-0008. Una empresa puede no adoptarlo; mientras esté `disabled` o `paused`, el servidor deniega las rutas y operaciones del dominio aunque un cliente intente acceder por URL directa. Activarlo no se infiere de la existencia del formulario sintético actual ni de la asignación de un rol.

El primer corte operativo conserva el valor ya validado de #46: una persona empleada solicita, consulta y puede cancelar una solicitud pendiente; el Responsable autorizado de su centro decide y rectifica una decisión con historia append-only. Administración configura y activa el módulo, pero no sustituye por defecto la decisión de Responsable. Una excepción administrativa requeriría permiso, ámbito y auditoría explícitos en una historia posterior.

PO debe aprobar antes de implementación real si el nombre comercial “vacaciones” se ofrece como una tipología configurable o si la primera versión mantiene nombres neutros. La aplicación no declara derechos, retribución, justificación ni adecuación a convenio.

## Ciclo de vida del módulo

| Estado | Administración | Responsable y Empleado | Conservación |
| --- | --- | --- | --- |
| `disabled` | Puede preparar configuración mínima. | No tienen navegación, lectura ni mutación. | No borra solicitudes o decisiones previas. |
| `configured` | Revisa tipologías, vigencias y copy antes de publicar. | No ven el módulo. | Conserva la versión de configuración. |
| `active` | Puede mantener configuración versionada. | Operan sólo las acciones y el ámbito de este contrato. | Audita transiciones y decisiones. |
| `paused` | Puede reanudar tras revisión. | No se admiten nuevas operaciones; la lectura histórica exacta requiere una decisión explícita de retención/soporte. | No recalcula ni altera historia. |

Las transiciones son las del ADR-0008: sólo Administración transita el estado con actor, instante, correlación, versión y motivo-código. Ni ocultar un menú ni validar en el navegador son controles de seguridad.

## Solicitud y decisión humana

Cada solicitud está asociada a una relación vigente y a un centro resuelto en servidor. Contiene intervalo de fechas, una instantánea mínima de la tipología vigente, estado y los metadatos de auditoría. El intervalo se valida como fechas ISO no invertidas y dentro de la relación; no incluye diagnóstico, documento, adjunto, saldo, remuneración, porcentaje de jornada ni campos de terceras personas.

Los estados actuales se conservan: `pending`, `approved`, `rejected` y `cancelled`.

- La persona empleada crea y lee sólo lo propio, y sólo cancela `pending`.
- El Responsable sólo lista y decide solicitudes de relaciones vigentes en sus centros autorizados.
- Una rectificación de Responsable añade una nueva decisión auditada; no reescribe la decisión anterior ni permite reabrir una cancelación terminal.
- Todas las mutaciones usan idempotencia y rechazan transiciones no permitidas sin enumerar datos fuera de ámbito.

`approved` significa únicamente “decisión operativa registrada”. Nunca genera un evento de fichaje, una corrección S6, una regla S3, un cálculo S5, una jornada prevista, saldo, pago, ausencia legal efectiva ni sustitución de personal.

## Tipologías y calendario minimizado

La #89 será propietaria de tipologías configurables y versionadas. Este épico sólo exige que una solicitud conserve la instantánea de nombre visible y versión de la tipología usada, para que retirar o renombrar un tipo no altere la lectura histórica. La tipología no puede codificar salud, embarazo, discapacidad, afiliación sindical, violencia, diagnóstico, persona dependiente, retribución o derecho legal.

El calendario futuro se limita a ausencias `approved` de relaciones dentro del ámbito del actor autorizado. Para Responsable muestra por día sólo la identidad mínima necesaria y una marca neutra de ausencia aprobada; no muestra motivo, comentario, tipología sensible, adjunto, estado médico, saldo, fichajes, duración efectiva ni datos de otros centros. Para Empleado muestra exclusivamente las propias. Administración no obtiene un calendario global por el mero rol.

El calendario queda después de la validación del flujo de solicitudes: no es condición para activar el módulo y no crea estadísticas de absentismo, alertas, cobertura ni planificación automática.

## Integración y límites de datos

La implementación futura crea o conserva un dominio `leave-requests` separado. Consume sesión/RBAC de S1, relación/centro efectivo de S2 y el patrón de decisión auditable de S6, pero no reutiliza `correction_effects` ni sus tablas. El resolvedor de módulo y toda autorización ocurren antes de leer o mutar solicitudes.

Los eventos mínimos posibles son `leave-request.requested`, `leave-request.decided` y `leave-request.cancelled`, con ID, empresa/centro ya autorizado, intervalo, estado, versión de tipología y correlación. Auditoría y outbox no incluyen comentario, motivo, adjunto o dato de salud. Ningún consumidor convierte estos eventos en cambios de fichaje, cálculo, previsto, exportación o nómina sin una decisión y un contrato posteriores.

No se permite importación, notificación externa, comentario obligatorio, archivo, reconocimiento automatizado, reglas de saldo, límite de solicitudes, ranking, analítica de absentismo ni IA. Si se necesita un canal para casos sensibles, se ofrece el proceso externo designado por la empresa, sin introducir esos datos en TimeControl.

## Experiencia y pruebas futuras

La interfaz usa el catálogo UX/UI para formulario, selector de tipo, calendario, botones, confirmación y errores. Cada estado se expresa por texto además de color. El formulario explica qué se registrará y advierte no incluir información médica, documentos o datos de otras personas. El flujo mantiene foco, estado y datos confirmados durante carga y reintento; no desmonta la página para mostrar un marco de recarga.

Antes de abrir implementación se prueban módulo apagado/configurado/activo/pausado, empresa ajena, URL directa, empleo terminado, centro ajeno, creación, cancelación, decisión, rectificación, carrera e idempotencia, retirada de tipo, vacío/error/sesión caducada, calendario minimizado, teclado, lector de pantalla y 320/390/768/1280 px. S15 mantiene el NO-GO de datos reales.

## Criterios de salida

1. PO aprueba el uso opcional del módulo y el primer conjunto no sensible de tipologías de #89.
2. DPO y asesoría laboral validan minimización, copy, canal externo para casos sensibles y ausencia de saldo/derechos automatizados.
3. S1/S2/S6 y el propietario de módulos confirman el puerto, permisos, ámbitos, transiciones y auditoría antes de migraciones o rutas nuevas.
4. UX y QA aprueban el catálogo de componentes, calendario minimizado y matriz de pruebas.
5. Cualquier efecto sobre planificación, fichaje, cálculo, nómina o convenio se abre como historia independiente con sus propietarios.

## Alternativas descartadas

- **Activar vacaciones para todas las empresas:** convierte una preferencia de producto en una capacidad efectiva sin adopción ni configuración.
- **Usar un formulario con adjuntos y motivo clínico:** incrementa datos sensibles sin ser necesario para la decisión operativa mínima.
- **Interpretar una aprobación como ausencia efectiva de jornada:** mezcla un flujo de RR. HH. con fuentes de fichaje/cálculo que tienen propietarios distintos.
- **Calendario global de Administración:** expone información personal de más sin un ámbito operativo concreto.
