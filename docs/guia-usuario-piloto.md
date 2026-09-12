# Guía de usuario del piloto

## Propósito y límites

Time Control registra entradas, salidas y pausas manuales, muestra incidencias y permite solicitar correcciones. Documenta la jornada: no calcula nómina, sanciones ni derechos económicos definitivos, ni interpreta convenios. El saldo y los excesos son informativos.

No usa geolocalización, cámara, biometría, foto, vídeo ni vigilancia. La aplicación se ejecuta en un entorno dedicado por empresa; el acceso se limita por rol y ámbito autorizado.

> Estado previo al piloto: esta guía describe sólo las pantallas entregadas. La configuración inicial por UI todavía no está disponible; no se debe invitar a usuarios no técnicos hasta cerrar los bloqueos operativos y de cumplimiento de S15. S17 ha documentado propuestas posteriores, pero no entrega temporizador, recordatorios, calendario, chatbot ni nuevas capacidades de seguimiento.

## Requisitos de acceso

Use un navegador actualizado, conexión al entorno asignado y una cuenta creada por la empresa. Abra `/login`, indique correo y contraseña, y complete MFA si se le solicita. Las páginas de jornada, historial, correcciones y administración requieren una sesión válida; al acceder a un enlace interno permitido, volverá a él tras iniciar sesión. La interfaz tiene vistas de fichaje (`/employee`), historial y correcciones; administración (`/admin`); y kiosco. No comparta sesiones ni PIN. Use **Cerrar sesión** al terminar.

## Acceso de demostración local

Estas cuentas existen sólo después de cargar el perfil sintético `office` con `DEMO_PASSWORD=UiE2eSyntheticPassword-2026`. Son públicas únicamente para revisión local del MVP: no deben reutilizarse, desplegarse ni usarse en un entorno con datos reales.

| Rol | Correo | Contraseña | Qué revisar |
|---|---|---|---|
| Empleado | `night.office@demo.test` | `UiE2eSyntheticPassword-2026` | Jornada, fichaje, pausas, historial y solicitud de corrección. |
| Responsable | `manager.office@demo.test` | `UiE2eSyntheticPassword-2026` | Resumen y correcciones del centro autorizado. Tras acceder, abra **Administración**. |
| Administración | `admin.office@demo.test` | `UiE2eSyntheticPassword-2026` | Panel completo de administración y revisión. En el primer acceso completa MFA, salvo que el entorno local sintético haya activado expresamente `LOCAL_SYNTHETIC_DEMO_MFA_BYPASS=true`. |

Las tres cuentas y todos sus registros son sintéticos. Si se reinicia la base, vuelva a ejecutar el seed con la misma contraseña para recrearlas.

El bypass MFA es exclusivo de HTTP local, sólo permite cuentas administrativas `@demo.test` y añade una entrada de auditoría. No debe configurarse en ningún despliegue ni con datos reales.

## Administrador y RR. HH.

La pantalla **Administración y RR. HH. > Resumen** presenta personas, centros, solicitudes pendientes e incidencias de la semana dentro del ámbito autorizado.

- En **Plantilla y jornadas**, filtre por centro, persona, estado y periodo; pulse **Aplicar filtros**. Puede abrir el detalle en lista para ver eventos originales, pausas, cálculo, incidencias, regla/versionado y zona horaria.
- En **Correcciones**, seleccione Pendientes, Aprobadas, Rechazadas o Todos. Abra **Ver y decidir**: aprobar solicita el recálculo; rechazar exige un motivo de tres caracteres o más. La solicitud y el evento original no se editan.
- Las altas de centros, empleados, relaciones, reglas y calendarios sólo están disponibles mediante APIs en esta versión. No existe una pantalla de configuración inicial; escale esta necesidad al equipo del piloto, no intente modificar datos directamente en la base.
- CSV/PDF se ofrecen por API autorizada; la interfaz no incorpora un botón de exportación. Solicítelos al equipo de operación mientras S14 no entregue un flujo visible.

## Responsable

El responsable ve exclusivamente sus centros, personas, jornadas y correcciones autorizadas. Use **Administración > Correcciones** para abrir una solicitud. Apruebe sólo cuando la propuesta sea correcta y rechace indicando el motivo: el empleado lo verá en su seguimiento. Si una persona/centro no aparece, no intente acceder por URL; solicite revisión de su ámbito.

## Empleado

En **Mi jornada**, consulte primero el estado de la jornada y **Siguiente acción**; el tiempo efectivo mostrado es exclusivamente informativo y no es nómina, sanción ni decisión disciplinaria. Pulse sólo la opción que corresponda: **Registrar entrada**, **Iniciar pausa**, **Finalizar pausa** o **Registrar salida**. El botón se bloquea mientras se confirma el registro y la pantalla anuncia la hora confirmada. Si aparece un aviso de fichaje histórico pendiente, el estado corresponde a hoy: solicite una corrección para el registro anterior y siga únicamente la acción que confirme el servidor. Si hay error, use **Reintentar la consulta** después de comprobar la conexión; no repita pulsaciones rápidamente.

En **Historial**, abra una fecha para consultar eventos, pausas, tiempo efectivo, jornada esperada, diferencia, incidencias, regla/versionado y zona horaria. Si existen registros y el cálculo todavía no está materializado, el aviso indicará que está pendiente sin negar el fichaje; si no hay registros, falta autorización o hay un error técnico, cada caso muestra un mensaje distinto. Reintentar la consulta no modifica ni recalcula la jornada. El saldo no es nómina ni sanción.

Para corregir un dato, desde el detalle use **Solicitar corrección** o abra **Correcciones**. Seleccione el registro, acción y fecha/hora propuesta, y escriba un motivo. La solicitud queda **Pendiente de revisión**; una aprobación genera un efecto aditivo y un rechazo muestra su motivo. El fichaje original nunca se borra. Los identificadores técnicos quedan en el detalle secundario de auditoría y no cambian el registro.


## Ante incidencias

- **Olvido o jornada incompleta:** solicite una corrección con la hora propuesta y el motivo.
- **Secuencia inválida:** siga el botón disponible; si ya hay una pausa iniciada, finalícela antes de salir.
- **Error de acceso:** no comparta credenciales; contacte al administrador de la empresa. La recuperación segura no está entregada todavía.
- **Kiosco/QR/PIN:** la pantalla pública de PIN sólo funciona con su enlace de kiosco autorizado que contiene un identificador opaco. No revele el PIN. El QR continúa requiriendo sesión de empleado válida; un fallo repetido debe escalarse al soporte.

## Privacidad, límites legales y soporte

Se muestran únicamente los datos laborales mínimos necesarios y los eventos de jornada. Empleados consultan lo propio; responsables, su ámbito; administración/RR. HH., el ámbito asignado. Las exportaciones y accesos administrativos se auditan.

La herramienta registra y documenta: no sustituye la configuración de convenio, asesoría laboral, DPO ni criterio jurídico. Durante el piloto, el punto de soporte es el administrador designado de la empresa; este debe escalar al equipo de operación aportando fecha/hora, pantalla, mensaje de error y el identificador de correlación si aparece, nunca contraseña, token ni PIN.

### Preguntas frecuentes

**¿Se puede fichar con GPS o biometría?** No.

**¿Puedo cambiar un fichaje ya enviado?** No directamente; solicite una corrección para conservar evidencia.

**¿Por qué no veo a otra persona?** El acceso está limitado por rol y centro.

**¿El saldo es salario u horas extra aprobadas?** No; es información de registro que debe revisarse según las reglas configuradas.
