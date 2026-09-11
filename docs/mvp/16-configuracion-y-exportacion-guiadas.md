# S16 — Configuración y exportación guiadas para piloto asistido

**Estado:** muy recomendable antes del piloto; condicional si producto acepta operación técnica asistida diaria. **Tamaño:** M. **Dependencias:** S2, S3, S8, S9, S14 y cierre de almacenamiento de S15.

## Nombre y objetivo

Exponer en UI, sin nuevas reglas de negocio, el alta/configuración mínima y la solicitud/descarga de exportaciones que ya existen por API. El objetivo es que el piloto mida el producto y no dependa de peticiones técnicas para operaciones rutinarias.

## Entregable verificable

Checklist de configuración de empresa con progreso honesto y formularios autorizados de empresa, centro, empleado, relación, calendario/regla/versiones vigentes; flujo de exportación CSV/PDF por persona o centro/período, con estado, vencimiento y mensajes de autorización. No habrá importación masiva.

## Alcance y exclusiones

Consume los contratos existentes de S2/S3/S9 y sus validaciones servidor. Incluye filtros/búsqueda de plantillas cuando el volumen lo requiera para operar los datos existentes. Excluye CSV/Excel de entrada, alta masiva, cambios retroactivos de reglas, conectores, vacaciones/ausencias, cierre de período, notificaciones, nómina, convenios, portal de asesoría y acceso de soporte por defecto.

## Dominios, rutas, módulos, tablas y documentación afectados

Propietaria de rutas/componentes administrativos de configuración y exportación, adaptadores UI de S2/S3/S9, pruebas de ruta y guía de piloto. Consume `/companies`, `/sites`, `/employees`, `/employments`, `/work-rules`, `/rule-versions`, `/calendars`, `/shifts`, `/exports` y descarga. No cambia tablas, permisos, APIs, cálculo ni auditoría; todas las mutaciones y descargas conservan autorización de servidor.

## Dependencias y paralelismo

Depende del sistema visual y componentes de S14; la descarga depende de que S15 cierre retención/almacenamiento. Puede preparar formularios de configuración en paralelo con S15, evitando editar simultáneamente componentes compartidos de S14. No puede ejecutarse en paralelo con otra sesión que posea las mismas rutas `admin/*` sin acuerdo.

## Riesgos legales, técnicos y de integración

Una UI podría inducir a pensar que una regla configura cumplimiento automático, permitir cambios de vigencia confusos o hacer exportaciones demasiado amplias. Mitigación: copy de límites, confirmación de vigencia, servidor como autoridad, alcance obligatorio de exportación, auditoría existente y pruebas RBAC. No se presentan saldos como nómina.

## Criterios de aceptación

- Administrador autorizado completa la configuración mínima con campos y errores comprensibles; cada paso refleja datos confirmados por API, sin inventar progreso.
- Versiones de regla/calendario muestran vigencia y no permiten sobrescribir historia; cualquier incompatibilidad la rechaza el servidor y la UI la explica.
- Responsable sólo ve y opera su ámbito; empleado no alcanza configuración ni exportación no autorizada, incluso navegando por URL/API.
- La exportación exige persona o centro y período, informa de generación, descarga autenticada y vencimiento; no crea enlaces públicos.
- La guía y ayuda contextual distinguen registro, configuración revisable y asesoría laboral; no prometen cumplimiento ni interpretación de convenios.
- Pruebas de autorización, validación, estados vacíos/error/carga, descarga expirado y regresión S2/S3/S8/S9 pasan con datos sintéticos.

## Pruebas necesarias

E2E de administrador/responsable/empleado, validación de vigencias, búsqueda/filtros, exportación CSV/PDF autorizada, expiración, accesibilidad y responsive conforme a S14. Validar que auditoría de las mutaciones/descargas sigue presente.

## Decisiones que requieren aprobación

1. Confirmar que S16 es condición de piloto o que se acepta explícitamente un piloto asistido con operación técnica limitada.
2. Definir campos mínimos de alta y quién valida calendario/regla antes de invitar empleados.
3. Aprobar que importación CSV/Excel, notificaciones, ausencias y cierre de período permanecen fuera de S16.
