# S24 — Ausencias y permisos con decisión humana

**Estado:** discovery aprobado por PO; sin implementación, datos reales ni efecto sobre jornada. **Historia:** HU-TC-025 / #46. **Tamaño:** M. **Dependencias:** S1, S2, S6, S10, S11, S14, S15, DPO y asesoría laboral. **Relación con piloto:** no elimina el NO-GO de S15.

## Decisión de discovery

Se prioriza, tras la matriz #44, explorar una única capacidad: que una persona empleada pueda solicitar una ausencia o permiso y conocer una decisión humana trazable. No se presupone que la aplicación deba gestionar vacaciones, bajas, permisos legales, saldos ni reglas de convenio.

La primera hipótesis es deliberadamente mínima: una solicitud por intervalo de fecha y categoría operativa genérica, sin motivo libre ni adjuntos. Su valor debe probarse frente a la alternativa actual de gestión externa/manual antes de crear un dominio persistente.

## Problema y objetivo

Una persona necesita saber si una petición de no disponibilidad ha sido recibida y resuelta; una persona responsable necesita decidir dentro de su ámbito, sin que el sistema determine derechos ni consecuencias.

El objetivo es descubrir un flujo comprensible de solicitud, cancelación y decisión humana. No es calcular derecho a vacaciones, sustituir una herramienta de RR. HH. ni determinar ausencias justificadas.

## Alcance del contrato candidato

Si se autoriza una fase posterior, la propuesta mínima será:

- Solicitud propia con `fromDate`, `toDate` inclusivas, zona IANA resuelta en servidor y una categoría operativa limitada; no recibe `employeeId`, ámbito, saldo, regla ni estado desde el navegador.
- Estados explícitos: `pending`, `approved`, `rejected` y `cancelled`. No habrá aprobación automática, reapertura automática, escalado, SLA, recordatorios ni notificaciones multicanal.
- Empleado: crea y consulta exclusivamente sus solicitudes, y cancela sólo una solicitud aún `pending`.
- Responsable: consulta y decide únicamente solicitudes de su centro autorizado; administración puede hacerlo sólo mediante un permiso y ámbito explícitos. Cada decisión exige actor, instante UTC, versión y auditoría append-only.
- La decisión sólo comunica el estado operativo. No crea eventos de fichaje, saldo, cálculo, ausencia laboral efectiva, nómina, regla de jornada, calendario, exportación ni consecuencia disciplinaria.

## Datos y minimización

La candidata no debe recopilar diagnóstico médico, causa legal, documentos, adjuntos, comentarios libres, geolocalización, dispositivo ni evidencia de productividad. Si una necesidad real exige alguno de esos datos, este contrato se detiene: requerirá una ficha separada con finalidad, destinatarios, conservación, acceso, seguridad y aprobación DPO/laboral.

El servidor resolverá identidad, empresa, empleo, centro, zona y permisos. Las fechas se validarán como fechas de calendario, no como horas trabajadas, y nunca se transformarán en minutos, saldo o interpretación de convenio.

### Cribado de privacidad y laboral

La categoría inicial no puede codificar salud, discapacidad, embarazo, violencia, afiliación sindical, cuidado de familiar, causa legal, retribución ni diagnóstico. La AEPD advierte que los justificantes de ausencia pueden contener datos de salud y exige minimización y confidencialidad; el RGPD trata los datos de salud como categoría especial y su artículo 9 limita su tratamiento. Por tanto, la interfaz candidata rechazará adjuntos y texto libre y no presentará la selección de categoría como una declaración de derecho. [AEPD: justificantes de ausencia](https://www.aepd.es/preguntas-frecuentes/3-proteccion-de-datos-en-el-ambito-laboral/FAQ-0301-pueden-contener-datos-de-salud-los-justificantes-de-ausencia-laboral), [RGPD, artículo 9 en BOE](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

El Estatuto de los Trabajadores prevé supuestos de permisos y ausencias que dependen de norma aplicable, convenio o circunstancias concretas. S24 no los clasifica ni los ejecuta: DPO y asesoría laboral deberán decidir si la categoría genérica es admisible, qué información debe recibir la persona y cuándo un caso debe continuar por un canal externo especializado. [Estatuto de los Trabajadores, BOE](https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430).

## Superficie de contrato para una fase posterior

No es una API autorizada. Si las puertas se cierran favorablemente, los propietarios S1/S2/S6 deberán acordar un puerto separado, con una forma mínima equivalente a:

```ts
type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
type LeaveRequest = {
  id: string;
  fromDate: string; // YYYY-MM-DD, validada por servidor
  toDate: string;   // YYYY-MM-DD, inclusiva
  category: 'general_request';
  status: LeaveRequestStatus;
  requestedAt: string; // UTC de servidor
  decidedAt: string | null;
};
```

El sobre de lectura no expondrá motivo, adjunto, correo, datos de terceros, identidad de quien decide fuera del ámbito permitido ni eventos de ficha. La decisión humana se prueba y audita en S6 con un código técnico interno; la persona solicitante recibe sólo el estado y un canal de ayuda definido por PO. Cualquier campo adicional exige una enmienda de contrato y revisión de privacidad/laboral.

## Plantilla genérica sugerida para el piloto sintético

La siguiente plantilla sirve para evaluar comprensión del recorrido con fixtures. No es un formulario de vacaciones, baja, permiso legal ni justificante.

```text
SOLICITUD OPERATIVA DE AUSENCIA

Desde: [fecha]
Hasta: [fecha]
Tipo:   Solicitud general

No incluyas motivos personales, médicos, documentos ni información de terceras personas.

[Enviar solicitud]

Al enviarla: «Hemos registrado tu solicitud. Su estado es pendiente de decisión humana.
No modifica tu jornada, nómina ni derechos laborales.»
```

La bandeja de responsable sólo necesita mostrar persona dentro de ámbito, intervalo, estado y momento de solicitud. Sus únicas acciones candidatas son **Aprobar** o **No aprobar**, con una confirmación fija: «La decisión se registra; no modifica fichajes, cálculos ni derechos». Si se necesitara explicación, la persona recibe el canal de ayuda externo definido por la organización; no se habilita texto libre en esta fase.

## Decisión de revisión postpiloto

PO acuerda usar esta plantilla exclusivamente con datos sintéticos durante el piloto ampliado. La revisión DPO/laboral de categorías reales, retención, información y casos sensibles se abrirá en la fase postpiloto si la evidencia demuestra que la capacidad aporta valor. Esta postergación no habilita datos reales, categorías legales/médicas, adjuntos ni implementación fuera del contrato mínimo.

## Propuesta de integración entre dominios

La capacidad no reutiliza `corrections`: una corrección modifica la proyección de evidencia de fichaje y puede desencadenar cálculo; una solicitud de ausencia no debe hacerlo. Una fase posterior crea un dominio `leave-requests` separado y sólo consume de S1 la sesión/RBAC, de S2 la relación efectiva y el centro, y de S6 el patrón de decisión humana idempotente y auditada.

| Propietario | Aporta | S24 no puede hacer |
|---|---|---|
| S1 | sesión, permisos tipados, cookie, auditoría append-only | Inferir rol o ámbito desde cliente. |
| S2 | empleo activo, empresa, centro y zona IANA efectivos para cada fecha | Consultar o modificar tablas de personas directamente desde UI. |
| S6 | patrón de transición única, idempotencia y decisión humana | Crear `correction_effect`, recalcular ni reutilizar sus tablas. |
| S24 futuro | solicitud, cancelación y decisión operativas independientes | Convertir estado en saldo, evento, turno o derecho. |

### Permisos candidatos

Son nombres propuestos, no permisos concedidos todavía:

```text
leave-request.create:self
leave-request.read:self
leave-request.read:scope
leave-request.decide:scope
leave-request.cancel:self
```

El servidor exige el permiso y vuelve a resolver el empleo/centro en cada lectura o mutación. El rol `manager` sólo recibiría lectura y decisión de ámbito de centro mediante migración aditiva revisada; no puede crear solicitudes ajenas ni editar la configuración. Administración sólo actuaría si recibe los mismos permisos de manera explícita, nunca por el nombre del rol.

### Rutas candidatas y estados

| Operación | Ruta candidata | Reglas servidor | Resultado mínimo |
|---|---|---|---|
| Crear propia | `POST /api/v1/leave-requests` | fechas ISO de calendario, intervalo no invertido, empleo activo; `category` fijo `general_request`; `Idempotency-Key` | solicitud `pending` |
| Leer propia | `GET /api/v1/leave-requests?mine=true` | identidad de sesión | sobre sin motivo ni adjunto |
| Leer ámbito | `GET /api/v1/leave-requests` | permiso `read:scope`, centro efectivo | sólo centro autorizado |
| Decidir | `POST /api/v1/leave-requests/{id}/decision` | `decide:scope`, transición única, clave idempotente | `approved` o `rejected` |
| Cancelar propia | `POST /api/v1/leave-requests/{id}/cancel` | sólo solicitante y estado `pending` | `cancelled` |

Transiciones permitidas: `pending → approved | rejected | cancelled`. Todas las demás devuelven `LEAVE_REQUEST_STATE_INVALID` sin revelar solicitudes fuera de ámbito. Reintentos idénticos devuelven el resultado confirmado; la misma clave con otra carga devuelve `IDEMPOTENCY_CONFLICT`.

### Evidencia y eventos candidatos

Una tabla futura sólo conservaría ID, empleo, centro, intervalo, categoría fija, estado, actor e instantes UTC. No contendría motivo, documentos, comentarios, diagnóstico ni saldo. Las decisiones y cancelaciones serían append-only; no habría `UPDATE` ordinario del contenido original.

Tras confirmar transacción, el outbox podría publicar `leave-request.requested`, `leave-request.decided` o `leave-request.cancelled` con IDs, estado, centro, intervalo y correlación, sin contenido sensible. La auditoría usaría las mismas referencias mínimas. Ningún consumidor S3/S4/S5/S6 convierte esos eventos en cambios de jornada.

### Pruebas necesarias si se abre implementación

- Aislamiento entre empresas y denegación de centro ajeno; autoconsulta sin `employeeId` de navegador.
- Intervalo invertido, empleo no vigente, categoría distinta de `general_request`, adjunto/motivo/campo inesperado y doble envío.
- Transición única, cancelación después de decisión, decisión fuera de ámbito e idempotencia concurrente.
- Ausencia de efectos en `time_events`, cálculos, reglas, calendario y saldos.
- Fixtures exclusivamente sintéticos; estados de carga/error, teclado, foco, lector y 320/390/768/1280 en E2E manual.

## Fuera de alcance

- Vacaciones, bajas, permisos retribuidos/no retribuidos, bolsas de horas, antigüedad, convenios, derecho automático, documentación o certificados.
- Calendarios compartidos, cobertura, asignación de sustituciones, planificación de turnos, disponibilidad, aprobación por cadena, delegación, automatización, recordatorios, email, chat o push.
- Cambios en S3–S6, fichajes, cálculo, auditoría existente, retención, exportaciones, datos reales, proveedor, despliegue o S15.

## Puertas antes de implementación

1. **PO:** confirma que la categoría genérica y la ausencia de motivo cubren la hipótesis; si no, define el problema sin añadir datos por defecto.
2. **DPO/laboral:** queda como puerta obligatoria de la fase postpiloto antes de categorías reales, datos reales o ampliación de la plantilla; no bloquea la evaluación sintética de la plantilla genérica.
3. **S1/S2/S6:** acuerdan permisos, alcance, propiedad de solicitud/decisión y auditoría antes de cualquier tabla, API o UI.
4. **UX/QA:** validan carga, vacío, error, cancelación, rechazo, teclado, foco, lector, 320/390/768/1280 y que `approved` no se interprete como derecho legal ni cambio de jornada.
5. **S15:** conserva el NO-GO para datos reales, retención definitiva, operación y despliegue.

## Criterios de salida del discovery

- Se documenta el flujo mínimo y su alternativa externa menos intrusiva.
- Queda preparada la solicitud de revisión DPO/laboral para la fase postpiloto, antes de cualquier categoría real o dato real.
- PO elige rechazar, mantener como discovery o aprobar un contrato de implementación aislado.
- Cualquier implementación futura incluye contratos de autorización, modelo, auditoría, API, fixtures sintéticos, pruebas de aislamiento y E2E manual; no reutiliza internals de otros dominios.

## Registro de decisión — 14/09/2026

PO selecciona HU-TC-025 como siguiente candidata de la matriz competitiva #44 y autoriza exclusivamente este discovery. Geolocalización (#42/#43) permanece bloqueada por puerta DPO/laboral; no se interpreta esta decisión como aprobación de datos reales ni de una gestión completa de ausencias.
