# Flujo Git de desarrollo

## Regla de salida

Ningún cambio de código, migración, prueba o contrato se considera terminado mientras no tenga una rama, un commit verificable y una rama remota publicada. La excepción es un experimento descartable que se elimina dentro de la misma sesión antes de afectar una entrega.

## Ramas y propiedad

- `master` permanece integrable: sólo recibe cambios mediante pull request o una integración explícitamente aprobada tras pasar las verificaciones.
- Cada sesión o corrección trabaja desde el último `master` remoto en una rama `codex/<sesion>-<tema>`, por ejemplo `codex/s2-company-people`.
- Las sesiones paralelas no comparten rama ni migración. Una sesión es propietaria de sus módulos, rutas, pruebas, contrato y migraciones. Las fundaciones compartidas requieren un commit separado, documentado y acordado antes de que otra rama dependa de él.
- No se cambian tablas, rutas o módulos que posea otra sesión. La integración entre dominios se realiza mediante contratos y adaptadores, no accediendo a internals ajenos.

## Secuencia obligatoria

1. Antes de editar: `git fetch`, comprobar `git status --short`, rama actual y commits pendientes de publicar. Si hay cambios ajenos, no se mezclan ni se descartan.
2. Crear la rama desde una base identificada y registrar en el contrato de sesión los archivos previstos.
3. Mantener commits pequeños, coherentes y reversibles. Un commit debe separar, cuando corresponda, migración/esquema, implementación, pruebas y documentación. Nunca incluir archivos de otra sesión ni secretos, `.env`, artefactos de build o datos locales.
4. Antes de cada commit: ejecutar pruebas y comprobaciones proporcionales, `git diff --check`, inspeccionar `git diff --staged` y verificar que la migración es aditiva, versionada y no modifica una migración aplicada.
5. Publicar la rama inmediatamente tras un commit válido con `git push -u TimeControlApp <rama>`. Si el push falla, el trabajo se declara pendiente de publicar y se conserva la causa.
6. Abrir revisión contra `master` con resumen, pruebas ejecutadas, riesgo de migración y dependencias. Integrar sólo con pruebas verdes y sin divergencias no revisadas.
7. Tras integrar: actualizar `master`, comprobar que la rama remota contiene el commit integrado y eliminar la rama sólo cuando ya no sea necesaria.

## Cambios paralelos y compartidos

Para trabajo concurrente, cada rama se prepara con `git add -- <rutas explícitas>`; queda prohibido `git add .` o `git commit -a` si el árbol contiene trabajo de otra sesión. Si dos sesiones necesitan modificar el mismo archivo, se crea primero un commit de fundación de propietario claro o se detiene una de ellas hasta acordar el orden. Las dependencias se consumen mediante la rama integrada o un commit SHA explícito, nunca copiando cambios manualmente entre árboles sucios.

## Migraciones y recuperación

Cada migración se añade en la rama propietaria, se prueba contra una base limpia y una base con la versión anterior, y se documenta su compatibilidad y rollback de aplicación. No se reescribe una migración publicada o aplicada: toda corrección llega en una migración nueva.
