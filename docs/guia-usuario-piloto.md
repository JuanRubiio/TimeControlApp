# Guía de usuario del piloto

## Propósito y límites

Time Control registra entradas, salidas y pausas manuales, muestra incidencias y permite solicitar correcciones. Documenta la jornada: no calcula nómina, sanciones ni derechos económicos definitivos, ni interpreta convenios. El saldo y los excesos son informativos.

No usa geolocalización, cámara, biometría, foto, vídeo ni vigilancia. La aplicación se ejecuta en un entorno dedicado por empresa; el acceso se limita por rol y ámbito autorizado.

> Estado previo al piloto: esta guía describe sólo las pantallas entregadas. El acceso web de login/MFA/logout y la configuración inicial por UI todavía no están disponibles; no se debe invitar a usuarios no técnicos hasta que S14 los cierre.

## Requisitos de acceso

Use un navegador actualizado, conexión al entorno asignado y una cuenta creada por la empresa. La interfaz actual tiene vistas de fichaje (`/employee`), historial y correcciones; administración (`/admin`); y kiosco (`/kiosk`). No comparta sesiones ni PIN. Un administrador debe completar MFA cuando el flujo de acceso esté habilitado.

## Administrador y RR. HH.

La pantalla **Administración y RR. HH. > Resumen** presenta personas, centros, solicitudes pendientes e incidencias de la semana dentro del ámbito autorizado.

- En **Plantilla y jornadas**, filtre por centro, persona, estado y periodo; pulse **Aplicar filtros**. Puede abrir el detalle en lista para ver eventos originales, pausas, cálculo, incidencias, regla/versionado y zona horaria.
- En **Correcciones**, seleccione Pendientes, Aprobadas, Rechazadas o Todos. Abra **Ver y decidir**: aprobar solicita el recálculo; rechazar exige un motivo de tres caracteres o más. La solicitud y el evento original no se editan.
- Las altas de centros, empleados, relaciones, reglas y calendarios sólo están disponibles mediante APIs en esta versión. No existe una pantalla de configuración inicial; escale esta necesidad al equipo del piloto, no intente modificar datos directamente en la base.
- CSV/PDF se ofrecen por API autorizada; la interfaz no incorpora un botón de exportación. Solicítelos al equipo de operación mientras S14 no entregue un flujo visible.

## Responsable

El responsable ve exclusivamente sus centros, personas, jornadas y correcciones autorizadas. Use **Administración > Correcciones** para abrir una solicitud. Apruebe sólo cuando la propuesta sea correcta y rechace indicando el motivo: el empleado lo verá en su seguimiento. Si una persona/centro no aparece, no intente acceder por URL; solicite revisión de su ámbito.

## Empleado

En **Mi jornada**, pulse sólo la acción que corresponda: **Registrar entrada**, **Iniciar pausa**, **Finalizar pausa** o **Registrar salida**. La pantalla muestra únicamente las acciones válidas y confirma la hora registrada. Si hay error, use **Reintentar** después de comprobar la conexión; no repita pulsaciones rápidamente.

En **Historial**, abra una fecha para consultar eventos, pausas, tiempo efectivo, jornada esperada, diferencia, incidencias, regla/versionado y zona horaria. El saldo no es nómina ni sanción.

Para corregir un dato, desde el detalle use **Corregir** o abra **Correcciones**. Seleccione el registro, acción y fecha/hora propuesta, y escriba un motivo. La solicitud queda Pendiente; una aprobación genera un efecto aditivo y un rechazo muestra su motivo. El fichaje original nunca se borra.

La cuenta con sólo rol `employee` está bloqueada actualmente por S13-001. No otorgue privilegios de administrador como solución temporal: comuníquelo al soporte del piloto.

## Ante incidencias

- **Olvido o jornada incompleta:** solicite una corrección con la hora propuesta y el motivo.
- **Secuencia inválida:** siga el botón disponible; si ya hay una pausa iniciada, finalícela antes de salir.
- **Error de acceso:** no comparta credenciales; contacte al administrador de la empresa. La recuperación segura no está entregada todavía.
- **Kiosco/QR/PIN:** use sólo el kiosco autorizado. No se solicitan permisos de cámara ni ubicación. Un fallo repetido debe escalarse al soporte, sin revelar el PIN.

## Privacidad, límites legales y soporte

Se muestran únicamente los datos laborales mínimos necesarios y los eventos de jornada. Empleados consultan lo propio; responsables, su ámbito; administración/RR. HH., el ámbito asignado. Las exportaciones y accesos administrativos se auditan.

La herramienta registra y documenta: no sustituye la configuración de convenio, asesoría laboral, DPO ni criterio jurídico. Durante el piloto, el punto de soporte es el administrador designado de la empresa; este debe escalar al equipo de operación aportando fecha/hora, pantalla, mensaje de error y el identificador de correlación si aparece, nunca contraseña, token ni PIN.

### Preguntas frecuentes

**¿Se puede fichar con GPS o biometría?** No.

**¿Puedo cambiar un fichaje ya enviado?** No directamente; solicite una corrección para conservar evidencia.

**¿Por qué no veo a otra persona?** El acceso está limitado por rol y centro.

**¿El saldo es salario u horas extra aprobadas?** No; es información de registro que debe revisarse según las reglas configuradas.
