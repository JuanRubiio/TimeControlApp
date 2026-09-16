# ADR-TC-016 — Condición de piloto y puerta de exportación visible

**Estado:** propuesta para decisión de PO. **Alcance:** documental; no habilita rutas, descargas, secretos, proveedor ni datos reales. **Dependencias:** S15, S16, S9, DPO, asesoría laboral, operación y PO.

## Contexto comprobado

S16 ya aporta configuración guiada con datos sintéticos y el servidor conserva las validaciones de ámbito, vigencia, RBAC y auditoría. No es necesario abrir una capacidad adicional para que administración prepare ese entorno sintético.

S15 ha validado controles internos concretos —retención física auditada y restauración aislada con rechazo cruzado—, pero siguen sin cerrarse los controles y aprobaciones externos: proveedor/región, TLS/proxy/WAF/rate limit efectivos, RPO/RTO, retención y bloqueo legal, DPA/subencargados, DPO, asesoría laboral, soporte e incidencias. Por ello el dictamen vigente es **NO-GO para datos reales**.

La API de exportación no convierte una descarga en segura por sí sola. Una interfaz visible puede aumentar la expectativa de disponibilidad y debe depender de la misma evidencia operativa que protege el almacenamiento, el vencimiento y la auditoría.

## Opciones evaluadas

1. **Exigir S16 completo, incluida la descarga visible, antes de todo piloto.** Rechazada: adelantaría una superficie de exportación mientras S15 mantiene el NO-GO y no aporta evidencia adicional.
2. **Aceptar S16 como configuración guiada del entorno sintético; mantener exportación asistida y no visible hasta S15.** Recomendada: permite comprobar la preparación administrativa sin presentar una descarga como disponible ni reducir las puertas de seguridad.
3. **Posponer toda la configuración hasta S15.** No recomendada: la configuración ya está disponible con contratos existentes y datos sintéticos; no modifica el dictamen ni la evidencia exigida a S15.

## Recomendación al PO

Adoptar la opción 2 con estas condiciones:

- La configuración guiada de S16 se considera suficiente para un **recorrido sintético asistido**. No autoriza un piloto con datos reales, despliegue ni afirmaciones de cumplimiento.
- No se muestra botón, enlace, solicitud ni descarga de exportación en ninguna ruta hasta que S15 tenga evidencia completa y una decisión Go escrita.
- Si operación requiere una exportación durante pruebas sintéticas, se tramita por el procedimiento técnico ya autorizado, con alcance mínimo y evidencias existentes; no se convierte en una función pública de la interfaz.
- Cuando S15 cierre, la historia que exponga la UI de exportación debe reevaluar RBAC, período/alcance, vencimiento, estados de error, auditoría, accesibilidad y E2E. Esta decisión no aprueba esa implementación por adelantado.

## Puerta verificable para exportación visible

La única transición permitida es `bloqueada → candidata a implementación`. Para alcanzarla deben constar, de forma trazable, todos estos elementos:

1. Go formal de PO para el entorno y datos autorizados.
2. Evidencia operativa S15 de almacenamiento dedicado, vencimiento/borrado auditado y restore/rechazo cruzado.
3. TLS/proxy, cabeceras, WAF/rate limit y gestión de secretos efectivos en el entorno seleccionado.
4. RPO/RTO, retención/bloqueo, DPA/subencargados, DPO, asesoría laboral, soporte e incidentes aprobados.
5. Contrato y revisión independiente de la interfaz de exportación; la autorización del servidor sigue siendo obligatoria.

La falta de cualquiera de estos puntos conserva la exportación visible bloqueada. No hay excepción por datos sintéticos que permita publicar una descarga sin esta puerta.

## Consecuencias y seguimiento

- S15 sigue siendo el propietario de la evidencia y del NO-GO.
- S16 sigue siendo propietario de la configuración guiada; no se reabre ni se le añaden formularios.
- S9 mantiene el contrato de exportación y sus autorizaciones; no se cambia su API.
- PO debe aceptar, rechazar o enmendar esta recomendación. Hasta entonces, el estado es de propuesta y no de decisión aprobada.
