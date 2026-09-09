# S8 — Vista de administración y RR. HH.

**Objetivo:** permitir operar plantilla, incidencias y revisión sin acceso excesivo. **Tamaño:** M. **Ejecución:** tras S2/S5/S6.

## Alcance

Propietaria de `admin/*`: plantilla, centros, reglas, incidencias, aprobaciones y filtros por período/centro. No incluye portal avanzado de asesoría ni nómina.

## Entregable y aceptación

Administrador autorizado configura dominio y revisa incidencias; responsable sólo accede a equipo asignado; filtros no cruzan tenant; decisiones quedan auditadas.

## Dependencias y validación

Depende de S2/S5/S6. Pruebas RBAC, filtros, carga y flujos de aprobación. Riesgo: privilegios demasiado amplios o interfaz que permita cambios de regla retroactivos.
