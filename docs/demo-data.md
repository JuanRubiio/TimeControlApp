# Datos de demostración sintéticos — S11

Los perfiles son inventados y reproducibles: no incluyen DNI/NIE, teléfono, dirección, fecha de nacimiento, datos de nómina, GPS, biometría, fotografía ni datos de personas reales. Las cuentas usan exclusivamente el dominio reservado `demo.test`; la contraseña se recibe sólo por la variable local `DEMO_PASSWORD`, nunca se imprime ni se versiona.

## Perfiles

`office` crea una pyme ficticia con una sede en `Europe/Madrid`. `multisite` crea una empresa ficticia con centros en Madrid, Canarias y Levante; en este perfil las tres cuentas se asignan a centros distintos para que las reglas de ámbito de S3 resuelvan, respectivamente, jornada estándar, partida y de cruce de medianoche. Incluye calendario 2026, festivos explícitos y pausas `manual_visible` sin descuento automático.

El modelo de aislamiento dedicado permite una única empresa por base. Por ello los perfiles se cargan en entornos demo separados y una base que ya contiene otro perfil se rechaza de forma segura.

## Ejecución

Después de migrar una base demo vacía, copie uno de los perfiles versionados de [`config/test-env`](../config/test-env/README.md) a `.local/`, sustituya sus marcadores y ejecute:

```powershell
$env:DEMO_PROFILE='office' # o multisite
$env:DEMO_PASSWORD='una-clave-local-de-demo-de-al-menos-16-caracteres'
npm run seed:demo
```

Repetir el mismo perfil es idempotente. El seeder deja una entrada de auditoría mínima `demo.seeded` sin contraseña, PIN, correo ni nombres de persona. No se debe usar en producción ni sobre un entorno con datos no demo.
