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

## Fuera de alcance

- Vacaciones, bajas, permisos retribuidos/no retribuidos, bolsas de horas, antigüedad, convenios, derecho automático, documentación o certificados.
- Calendarios compartidos, cobertura, asignación de sustituciones, planificación de turnos, disponibilidad, aprobación por cadena, delegación, automatización, recordatorios, email, chat o push.
- Cambios en S3–S6, fichajes, cálculo, auditoría existente, retención, exportaciones, datos reales, proveedor, despliegue o S15.

## Puertas antes de implementación

1. **PO:** confirma que la categoría genérica y la ausencia de motivo cubren la hipótesis; si no, define el problema sin añadir datos por defecto.
2. **DPO/laboral:** determinan finalidad, base, información, minimización, conservación, acceso y si la categoría propuesta revela información sensible o laboralmente protegida.
3. **S1/S2/S6:** acuerdan permisos, alcance, propiedad de solicitud/decisión y auditoría antes de cualquier tabla, API o UI.
4. **UX/QA:** validan carga, vacío, error, cancelación, rechazo, teclado, foco, lector, 320/390/768/1280 y que `approved` no se interprete como derecho legal ni cambio de jornada.
5. **S15:** conserva el NO-GO para datos reales, retención definitiva, operación y despliegue.

## Criterios de salida del discovery

- Se documenta el flujo mínimo y su alternativa externa menos intrusiva.
- Existe decisión DPO/laboral sobre las categorías permitidas y prohibidas, sin inferir cumplimiento automático.
- PO elige rechazar, mantener como discovery o aprobar un contrato de implementación aislado.
- Cualquier implementación futura incluye contratos de autorización, modelo, auditoría, API, fixtures sintéticos, pruebas de aislamiento y E2E manual; no reutiliza internals de otros dominios.

## Registro de decisión — 14/09/2026

PO selecciona HU-TC-025 como siguiente candidata de la matriz competitiva #44 y autoriza exclusivamente este discovery. Geolocalización (#42/#43) permanece bloqueada por puerta DPO/laboral; no se interpreta esta decisión como aprobación de datos reales ni de una gestión completa de ausencias.
