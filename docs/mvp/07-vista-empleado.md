# S7 — Vista del empleado

**Objetivo:** permitir fichar y entender los propios datos con claridad. **Tamaño:** M. **Ejecución:** tras S4.

## Registro de implementación S7 — 10/09/2026

Estado: **implementada y validada localmente; pendiente de publicación Git**. Rama: `codex/s7-vista-empleado`, basada en `TimeControlApp/master` `e8a55df`.

### Rutas y componentes

- `/employee`: panel de jornada, acciones de fichaje y últimos registros.
- `/employee/history` y `/employee/history/[laborDate]`: historial propio, eventos, pausas, cálculo, regla/versionado, zona e incidencias.
- `/employee/corrections`: solicitud de corrección de un evento propio y seguimiento de estado/rechazo.
- `src/employee/{api,components,presentation}.ts(x)`: adaptador de UI, componentes y lógica de presentación aislados de S4–S6.

### Contratos consumidos y decisiones

- S4: `GET/POST /api/v1/time-events`; POST con `Idempotency-Key`, acciones secuenciales y autorización `:self` en servidor.
- S5: `GET /api/v1/time-calculations?employeeId=&laborDate=`; se obtiene el identificador propio desde `GET /api/v1/employees/me` y se presenta como información explicable, nunca salarial.
- S6: `GET /api/v1/corrections?mine=true` y `POST /api/v1/corrections`; no hay edición de eventos originales.
- No se invoca `getUserMedia`, geolocalización ni APIs de biometría; QR puede usarse con código ya obtenido, sin solicitar cámara.

### Riesgos y traspaso

- La UI nunca es el control de acceso: todos los contratos usados resuelven empleado, permiso y ámbito en servidor. S8 puede reutilizar los estados visibles de corrección, pero su cola/decisión sigue siendo exclusiva de S8. S9 dispone de IDs de eventos, cálculo y corrección visibles para enlazar exportaciones futuras, sin que S7 exporte datos.
- La solicitud de corrección de incidencia queda enlazada desde el detalle; el formulario de corrección de eventos conserva el flujo principal. No hay bloqueo de contrato para S8 ni S9.

### Validación real

- Node 24 del runtime local: `vitest run` — **53 pruebas correctas en 17 suites**; incluye las pruebas S7 de secuencia de acciones, estado/incidencia, formato informativo, idempotencia y propagación de errores de API.
- Node 24: `tsc --noEmit` — correcto; `next build` — correcto, con las cuatro rutas `employee/*` generadas.
- Docker local: reconstrucción de `app` correcta y saludable. Navegador en `localhost:3000/employee`: navegación accesible, estado de carga, error seguro de sesión no autenticada y acción de reintento verificados. La presentación se comprobó también a 390×844 px; no se solicitó permiso de dispositivo.
- El E2E autenticado de entrada → pausa → fin → salida y de envío/aprobación requiere una cuenta demo de empleado ya autenticada; no se ejecutó contra el entorno local existente para no alterar sus datos ni usar credenciales no proporcionadas. Los contratos de autorización negativa de S4–S6 siguen cubiertos por sus suites de integración de servidor.

## Alcance

Propietaria de rutas y componentes `employee/*`: fichaje, historial, detalle, pausas, saldo explicable y solicitud de corrección. Español e interfaz preparada para i18n; responsive y accesible.

## Entregable y aceptación

Empleado ficha en tres pasos o menos, ve registros y correcciones propios, nunca ve datos ajenos, entiende incidencia y regla aplicada. Cumple pruebas responsive y de accesibilidad básica.

## Dependencias y validación

Depende de S4; integra S6/S5 cuando estén disponibles. Pruebas E2E de fichaje y corrección, autorización y navegación móvil. Riesgo: presentar saldo como dato salarial definitivo.
