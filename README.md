# Time Control MVP

Aplicación web de control horario para pruebas locales. Permite registrar entradas, salidas y pausas, consultar historial, solicitar correcciones y revisarlas según el rol.

> Todo el recorrido descrito aquí usa datos sintéticos. No cargue datos reales: el piloto sigue sujeto a las validaciones operativas y de cumplimiento indicadas en la [documentación del MVP](docs/mvp/README.md).

## Probar la aplicación en local

Necesita [Docker Desktop](https://www.docker.com/products/docker-desktop/) iniciado y el puerto `3000` disponible. No hace falta instalar Node ni PostgreSQL en el equipo.

En todos los comandos se debe usar el mismo nombre de proyecto y el mismo fichero de entorno. Defínalos una vez en la terminal que va a utilizar:

```powershell
$Project='time-control'
$EnvFile='.env'
```

> Si utiliza otro fichero, por ejemplo `.s13.synthetic.env`, asigne ese nombre a `$EnvFile` y no mezcle sus comandos con `.env`. El perfil S13 expone la aplicación en el puerto `3013`.

1. Cree su configuración local. No añada este archivo al repositorio.

   ```powershell
   Copy-Item .env.example .env
   ```

2. Abra `.env` y sustituya cada valor `replace-...` por un secreto local. Mantenga `SESSION_COOKIE_SECURE=false` únicamente para esta prueba HTTP local.

   Para revisar la cuenta administrativa sintética sin configurar una aplicación TOTP, añada también esta línea. Sólo funciona para cuentas `@demo.test` con cookie HTTP local y nunca debe activarse en un despliegue:

   ```text
   LOCAL_SYNTHETIC_DEMO_MFA_BYPASS=true
   ```

3. Construya e inicie una instancia nueva:

   ```powershell
   docker compose --project-name $Project --env-file $EnvFile up -d --build --pull always
   ```

4. Compruebe que está lista:

   ```powershell
   Invoke-WebRequest http://localhost:3000/api/health
   ```

   Este ejemplo corresponde a `.env`. Si su fichero define `APP_PORT`, sustituya `3000` por ese valor (por ejemplo, `.s13.synthetic.env` usa `3013`).

5. Cargue los datos demo y abra `http://localhost:<APP_PORT>/login` (`http://localhost:3000/login` con `.env`):

   ```powershell
   $env:DEMO_PASSWORD='UiE2eSyntheticPassword-2026'
   docker compose --project-name $Project --env-file $EnvFile exec -e DEMO_PASSWORD=$env:DEMO_PASSWORD app npm run seed:demo
   ```

La carga es idempotente: puede repetirla sin duplicar el conjunto demo. Las cuentas de empleado, responsable y administración, junto con qué revisar en cada una, están en la [guía de usuario del piloto](docs/guia-usuario-piloto.md#acceso-de-demostración-local).

## Recorrido recomendado

| Rol | Qué comprobar |
|---|---|
| Empleado | En **Mi jornada**, identifique la siguiente acción; pruebe historial, pausas y solicitud de corrección. |
| Responsable | Abra **Administración** tras iniciar sesión; revise la bandeja y una propuesta dentro de su ámbito. |
| Administración | Revise el resumen, plantilla y jornadas, y la trazabilidad de una corrección. El primer acceso requiere configurar MFA. |

Las correcciones añaden una propuesta: nunca cambian ni eliminan el fichaje original. Los saldos y diferencias son informativos; no son nómina, sanción ni una decisión económica definitiva.

## Ejecutar las comprobaciones

Con la aplicación iniciada, ejecute la suite dentro del mismo entorno Docker:

```powershell
docker compose --project-name $Project --env-file $EnvFile run --rm --no-deps app npm test
```

Para comprobar el build de producción, reconstruya la aplicación:

```powershell
docker compose --project-name $Project --env-file $EnvFile up -d --build --pull always
```

## Cerrar la prueba

Al terminar, cierre y elimine los contenedores de esta instancia:

```powershell
docker compose --project-name $Project --env-file $EnvFile down
docker ps -a
```

`down` conserva el volumen local para poder retomar la demo. Si quiere borrar también sus datos demo, use `docker compose --project-name $Project --env-file $EnvFile down -v`; esta acción elimina la base local y no se puede deshacer.

## Límites del MVP

- Web responsive; no hay app nativa.
- Fichaje por web, QR y PIN; pausas manuales y visibles.
- Sin geolocalización, cámara, biometría, foto, vídeo ni vigilancia.
- No promete cumplimiento legal automático ni sustituye asesoramiento laboral.
- El acceso se limita por rol y ámbito autorizado en el servidor.

## Más información

- [Guía para personas usuarias del piloto](docs/guia-usuario-piloto.md)
- [Estado, riesgos y pruebas de preparación](docs/mvp/informe-preparacion-piloto.md)
- [Contrato de experiencia de usuario S14](docs/mvp/14-ui-ux-y-experiencia-piloto.md)
- [Contratos y decisiones del MVP](docs/mvp/README.md)
- [Operación y despliegue](docs/operations/)
