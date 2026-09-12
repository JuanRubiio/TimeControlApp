# Incidencias QA — S11

## QA-001 — El rol `employee` no recibe permisos de fichaje propios

Estado: **cerrada el 11/09/2026** por S14.

Evidencia histórica: `migrations/s001_202609091700_foundations.sql` creaba el rol `employee` sin `time-event.create:self` ni `time-event.read:self`, aunque el endpoint S4 los exige en servidor.

Resolución: `migrations/s014_202609102350_employee_self_service_permissions.sql` concede exclusivamente los permisos propios de ficha, fichaje, cálculo y corrección necesarios para S4–S7. `tests/employee-rbac.test.ts` prueba su presencia y confirma que no se conceden permisos de ámbito ni decisión; S13 validó además el flujo HTTP con una cuenta `employee` sintética.

No quedan acciones abiertas para esta incidencia. S11 no modificó la migración ni módulos propietarios.
