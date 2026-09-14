# Contrato operativo — Docker Desktop y entornos locales

**Estado:** operativo para desarrollo, QA y demos sintéticas locales. **Ámbito:** Docker Desktop, Compose y recursos de TimeControlApp; aplicar junto a [desarrollo local reproducible](local-development.md) y los [runbooks](runbooks.md).

## Propósito y no negociables

Docker Desktop permite reproducir entornos aislados, no sustituye S15 ni autoriza producción o datos reales. Cada operación preserva aislamiento, secretos locales y recursos de otras sesiones.

- Usar sólo ficheros `.local/` y datasets sintéticos; nunca imprimir, subir o versionar secretos, contraseñas o dumps.
- Un entorno se identifica siempre con un nombre de proyecto Compose y un fichero de entorno explícitos.
- El contenedor, imagen, red y volumen de otra sesión se consideran ajenos aunque estén detenidos o parezcan prescindibles.
- Ninguna poda global, eliminación de volumen o limpieza de imágenes se realiza por falta de espacio sin inventario, objetivo exacto y autorización explícita.

## Preflight e inventario

Antes de arrancar, reconstruir, detener o limpiar:

1. Confirmar `Project`, `EnvFile`, perfil sintético, puertos y si existe una conexión local que deba mantenerse (por ejemplo DBeaver contra PostgreSQL).
2. Ejecutar comprobaciones de lectura: `docker compose --project-name <Project> --env-file <EnvFile> config --quiet`, `docker compose ... ps`, `docker ps --all`, `docker image ls` y `docker system df` cuando haya presión de espacio.
3. Verificar que los puertos no colisionan y que el nombre de proyecto no coincide con otro entorno activo.
4. Si el runtime Node del host no cumple la versión fijada, usar el contenedor para pruebas en vez de mezclar runtimes.

No ejecutar una acción destructiva con un nombre de proyecto calculado, comodines o rutas no verificadas.

## Ciclo normal de un entorno sintético

```powershell
$Project = 'time-control-office'
$EnvFile = '.local/test-office.env'
docker compose --project-name $Project --env-file $EnvFile up --build -d
docker compose --project-name $Project --env-file $EnvFile ps
Invoke-WebRequest http://localhost:3013/api/health
docker compose --project-name $Project --env-file $EnvFile exec app npm test
docker compose --project-name $Project --env-file $EnvFile down --remove-orphans
```

La migración, seed, smoke, build y pruebas se ejecutan sólo contra el mismo `Project`/`EnvFile`. Los errores se diagnostican con health, `compose ps` y logs minimizados antes de reconstruir todo.

### Regla de disponibilidad para revisión

Al mover una historia a **En revisión**, se mantiene en ejecución el mismo entorno sintético (`Project` y `EnvFile`) que superó la validación, para que la persona revisora pueda comprobarlo sin recrearlo. Se registra su URL, perfil y estado de health en la evidencia de la historia. Sólo se ejecuta `down --remove-orphans` cuando la revisión haya terminado, el entorno haya sido sustituido de forma explícita o la persona usuaria lo solicite.

## Clasificación de limpieza

| Operación | Efecto | Regla |
|---|---|---|
| `docker compose ... down --remove-orphans` | Detiene el entorno nombrado y sus huérfanos del mismo proyecto; conserva volúmenes. | Operación normal al terminar, tras comprobar el nombre. |
| `docker compose ... down -v` | Elimina volúmenes del proyecto, incluida la base sintética. | Destructiva: sólo si se desea reiniciar datos y no hay consumidor local. |
| `docker compose ... down --rmi local` | Elimina imágenes locales de ese proyecto. | Deliberada; útil para un entorno efímero, no para liberar espacio indiscriminadamente. |
| `docker image prune`, `docker builder prune`, `docker system prune` | Afecta caché o recursos globales, posiblemente de otras sesiones. | Requiere inventario, objetivo concreto y autorización explícita; evitar por defecto. |

Si Docker informa de espacio insuficiente, detener el trabajo, medir con `docker system df` y clasificar qué recursos pertenecen al entorno exacto. Nunca compensar eliminando volúmenes, contenedores o imágenes ajenos. Si se preserva PostgreSQL para DBeaver, no usar `down -v` ni limpiar su volumen.

## Construcción, pruebas y diagnósticos inteligentes

- Construir sólo el servicio que cambió cuando sea suficiente (`docker compose ... build app`); usar `up --build` cuando se necesite comprobar la composición completa.
- Mantener los entornos `office` y `multisite` separados para pruebas de aislamiento; no reutilizar cookies, puertos, volúmenes ni ficheros de entorno entre ellos.
- Tras un fallo de build, mirar primero el servicio y la versión de runtime; no purgar caché global como reacción automática.
- Tras un fallo de health, confirmar `db` con `pg_isready`, la configuración de entorno y los últimos logs técnicos sin cuerpos, cookies, contraseñas, tokens o URLs de base.
- Una prueba repetida debe declarar qué preserva y qué destruye. Si necesita una base limpia, usar un Project/volumen sintético propio y eliminarlo sólo al final con autorización.

## Seguridad y evidencia

- `SESSION_COOKIE_SECURE=false` sólo vale para localhost HTTP y nunca para piloto.
- Los logs, capturas y resultados compartidos omiten secretos y contenido laboral; la evidencia usa fixtures sintéticos.
- Backup/restore, retención y aprovisionamiento de un entorno dedicado se rigen por S15 y los runbooks, no por este contrato local.
- No exponer puertos, montar directorios ni añadir privilegios de contenedor para resolver una prueba sin revisar el contrato de seguridad correspondiente.

## Recuperación y salida

Ante interrupción o falta de espacio, registrar el Project/EnvFile, servicios activos, puertos, volúmenes preservados, evidencia ejecutada y siguiente acción. Al finalizar, confirmar que sólo se detuvo/limpió el entorno propio, que los recursos que debían persistir siguen disponibles y que no se alteró otro proyecto.

## Checklist de salida

- [ ] El nombre Compose, fichero `.local/`, puertos y perfil eran los correctos.
- [ ] Health, migración/seed y pruebas se ejecutaron contra el entorno declarado.
- [ ] No se mezclaron datos, cookies, volúmenes ni secretos entre perfiles.
- [ ] No hubo poda global ni borrado de volúmenes/imágenes ajenos.
- [ ] Si la historia pasó a revisión, el entorno exacto de validación permanece levantado y se documentaron URL, perfil y health.
- [ ] Si hubo limpieza destructiva, quedó registrada, autorizada y limitada al entorno sintético exacto.
- [ ] La evidencia y los logs compartidos están minimizados.
