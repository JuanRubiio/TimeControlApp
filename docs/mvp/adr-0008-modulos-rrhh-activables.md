# ADR-0008 — Módulos de RR. HH. activables por empresa

**Estado:** propuesto para decisión de PO, seguridad/privacidad, UX y QA. **Issue:** [#83](https://github.com/JuanRubiio/TimeControlApp/issues/83). **Dependencias:** ADR-0001, ADR-0003, ADR-0005, S2, S10 y S15. No autoriza todavía tablas, rutas, migraciones, módulos funcionales ni datos reales.

## Contexto

TimeControl incorpora candidatos de RR. HH. con naturaleza distinta —cuadrantes de turno, balance informativo y vacaciones/ausencias—. Ofrecerlos a todas las empresas de forma implícita convertiría una opción de producto en un permiso efectivo, ampliaría datos y causaría confusión en relaciones donde el módulo no es aplicable.

RBAC responde quién puede hacer una acción; no responde si una empresa ha adoptado el módulo que la contiene. Ocultar un enlace tampoco impide que alguien llegue a una ruta o API por URL directa. Este ADR define una segunda puerta, por empresa, independiente de las asignaciones de rol y ámbito.

## Decisión propuesta

Cada módulo se identifica mediante una clave estable y se resuelve en servidor para la empresa efectiva de la sesión. El catálogo inicial queda reservado, sin activar capacidades:

| Clave | Propietaria futura | Finalidad acotada |
| --- | --- | --- |
| `shift_planning` | #84–#86 | Jornadas previstas y cuadrantes publicados. |
| `informative_hour_balance` | #87 | Comparación informativa de tiempo cerrado, previsto y registrado. |
| `leave_management` | #88–#89 | Tipologías y solicitudes de ausencia con decisión humana. |

Una clave no implica ruta, dato, permiso ni promesa comercial. Añadir otra exige historia propia y revisión de este ADR.

### Estados y transiciones

| Estado | Significado | Lectura | Nuevas mutaciones |
| --- | --- | --- | --- |
| `disabled` | No adoptado para la empresa. Estado inicial. | Sólo Administración puede consultar su configuración. | Denegadas. |
| `configured` | Administración ha completado la configuración mínima, pero no ha publicado el módulo. | Administración; no se presenta a Responsable ni Empleado. | Sólo configuración administrativa revisable. |
| `active` | Módulo disponible para los roles y ámbitos que determine su contrato. | Según RBAC y ámbito. | Permitidas sólo por el contrato del módulo. |
| `paused` | Se detienen nuevas operaciones para revisión, sin borrar evidencia. | Lectura mínima autorizada de historia y configuración. | Denegadas, salvo la transición administrativa. |

Sólo Administración puede transitar `disabled → configured`, `configured → active`, `active → paused`, `paused → active` y cualquier retorno a `disabled`. Activar requiere configuración válida conforme al contrato del módulo; volver a `disabled` no borra decisiones ni evidencia y requiere motivo-código. Responsable no puede activar, pausar, reactivar ni desactivar. Empleado no puede modificar el estado.

## Autorización acumulativa

Una operación futura se permite únicamente cuando se cumplen todas las puertas:

1. La sesión pertenece al entorno y empresa efectivos.
2. El módulo está `active` para esa empresa y para el instante evaluado.
3. El actor dispone del permiso RBAC concreto.
4. El actor conserva el ámbito, relación y vigencia que exija el módulo.
5. La validación de dominio de la mutación resulta correcta.

La UI puede adaptar la navegación al estado efectivo, pero nunca es autoridad. Las APIs, acciones de servidor y rutas deben llamar al resolvedor de módulo antes de consultar o mutar su dominio. Un acceso de Empleado o Responsable a un módulo desactivado recibe una denegación genérica sin enumerar módulos de otras empresas; Administración recibe una explicación operativa sólo dentro de su empresa.

## Auditoría y mínimo de datos

Cada transición conserva de forma append-only: empresa, clave del módulo, estado anterior/nuevo, instante efectivo, actor, correlación, versión de configuración y motivo-código de catálogo. No se registra texto libre, contenido laboral, coordenadas, contraseña, correo adicional ni datos de personas afectadas.

Pausar o desactivar conserva fichajes, jornadas previstas publicadas, solicitudes, decisiones y auditoría según sus contratos/retenciones. El estado posterior sólo limita operaciones futuras; nunca reescribe el pasado ni calcula una consecuencia laboral automáticamente.

## Contrato de implementación posterior

La futura fundación técnica podrá exponer un puerto `ModuleEntitlementResolver` con una consulta de servidor del estilo `effectiveModule(companyId, moduleKey, at)`. La respuesta mínima será estado, versión y momento efectivo; no expone configuración sensible ni una lista global de módulos al cliente.

Cada módulo propietario deberá declarar antes de implementarse:

- sus permisos y ámbitos exactos;
- configuración mínima y validación de paso a `active`;
- rutas/API protegidas y respuesta de denegación;
- evidencia y retención de su configuración/decisiones;
- comportamiento ante pausa, desactivación y cambio de vigencia;
- pruebas de autorización cruzada, URL directa, idempotencia, auditoría, teclado, lector de pantalla y móvil.

No se crea una bandera genérica en el navegador, un proveedor externo ni una migración en esta entrega. La primera migración y el primer adaptador serán propiedad de una historia de implementación independiente aprobada por PO, seguridad/privacidad y QA.

## Límites por módulo

- `shift_planning` no autoriza asignación automática, IA, optimización de costes, cierre/relleno de fichajes, notificaciones ni cambios retroactivos.
- `informative_hour_balance` no autoriza bolsa/deuda de horas, redondeo, tolerancia, compensación, nómina, ranking o decisión disciplinaria.
- `leave_management` no autoriza saldo legal automático, documentos de salud, adjuntos, sustituciones, notificaciones externas ni estadísticas de absentismo.

## Alternativas descartadas

- **Flag sólo de interfaz:** se elude por URL/API y no deja evidencia de autoridad.
- **Permiso RBAC nuevo por cada activación:** mezcla rol estable y contratación/configuración empresarial; complica revocación y auditoría.
- **Responsable activa su módulo de centro:** permite ampliar superficie de datos sin segregación de funciones.
- **Desactivar borrando configuración e historia:** destruye trazabilidad e impide explicar decisiones pasadas.
- **Activar todos los módulos por defecto:** impone procesos, datos y expectativas que una empresa puede no necesitar.

## Criterios de salida de #83

1. PO aprueba o enmienda estados, autoridad y catálogo inicial.
2. Seguridad/privacidad valida minimización y denegaciones sin filtración interempresa.
3. UX revisa configuración administrativa, estados pausado/desactivado y alternativas accesibles.
4. QA acepta la matriz de pruebas negativas antes de abrir #84, #87 o #88 a desarrollo.
5. S15 conserva sin cambio el NO-GO de datos reales; esta decisión no habilita despliegue ni módulos con datos reales.
