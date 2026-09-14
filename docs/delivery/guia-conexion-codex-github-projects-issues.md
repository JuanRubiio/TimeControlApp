# Guía de conexión segura — Codex, GitHub Projects e Issues

**Estado:** guía de preparación para S21. No ejecutar pasos de conexión, no crear tokens, Apps, webhooks ni automatizaciones sin autorización explícita posterior.
**Ámbito:** GitHub Free para trabajo interno; no contiene ni transporta datos de clientes, PII laboral, secretos o producción.

> **Contrato operativo complementario:** para sesiones que usen `gh`, aplicar también el [flujo de Issues y Projects](../development/github-issues-project-workflow.md). Esta guía define la decisión de conexión; el contrato operativo define preflight, límites de API, recuperación e interacción segura.

## Idea clave

Codex no necesita una conexión persistente a GitHub Projects para trabajar con una historia. El modo inicial recomendado es **manual y trazable**: el PO crea/actualiza el Issue y Project, y una sesión de Codex trabaja en el repositorio local sobre una historia ya aprobada. La sesión devuelve enlaces, SHA, pruebas y una recomendación de estado; una persona actualiza el tablero y aprueba cada transición relevante.

Esto separa el código local, el Kanban interno y la autoridad humana. Evita registrar un token o exponer el tablero a un agente antes de tener evidencia de que una integración aporta valor.

## Modos de conexión y decisión

| Modo | Qué permite | Credencial/conexión | Estado recomendado |
|---|---|---|---|
| **A. Manual** | Crear/editar Issues y Project desde GitHub web; Codex trabaja localmente y la persona enlaza rama/PR/pruebas. | Ninguna credencial de GitHub adicional para Codex. | **Adoptar primero.** |
| **B. Asistencia local puntual con GitHub CLI** | Una sesión autorizada consulta o crea/actualiza Issues/Project mediante `gh`; sigue requiriendo instrucción humana por acción. | Autenticación personal interactiva y alcance mínimo; no se almacena en prompts ni repo. | Evaluar tras 3–5 historias manuales. |
| **C. GitHub App específica** | Servicio/agente separado con permisos de Issues/Projects muy acotados y auditoría. | App instalada sólo en la organización/repositorio/proyecto necesarios; tokens efímeros. | Futuro, mediante ADR, prueba sintética y aprobación separada. |

No usar OAuth genérico ni PAT clásico de larga duración para un agente persistente. GitHub documenta que las GitHub Apps no tienen permisos por defecto y deben recibir sólo el mínimo requerido; sus permisos pueden limitarse por recurso e instalación. [Permisos de GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app), [diferencias con OAuth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps).

## Modo A — operación manual inicial

### 1. Iniciar una necesidad

El PO abre una sesión nueva de Codex y pide discovery o refinamiento, según la [guía operativa](guia-operativa-delivery-interno.md). Con el resultado aprobado, crea un Issue interno usando la [plantilla de historia](plantilla-historia-usuario.md) y lo añade al Project.

El Issue contiene identificador, objetivo, criterios, riesgos minimizados, enlaces a documentos/ADR y decisión PO. No contiene PII, secretos, datos reales, logs crudos, exportaciones ni adjuntos de clientes.

### 2. Abrir implementación

El PO crea una nueva sesión de Codex con el ID de historia y el [encargo de sesión](plantilla-encargo-sesion.md). La sesión sigue el workflow Git, crea la rama `codex/<sesion>-<tema>`, realiza commits y publica la rama. La persona enlaza manualmente rama, SHA y PR en el Issue/Project.

### 3. Revisar y cerrar

QA/revisor/seguridad entrega evidencia mediante el Issue o documentación versionada. El PO mueve estados después de comprobar las puertas de la [matriz de calidad](matriz-puertas-calidad.md). Merge, despliegue y cierre siguen teniendo autorizaciones humanas distintas.

## Modo B — GitHub CLI asistido, si se aprueba

Este modo no es una automatización. Es una herramienta local usada bajo orden explícita en una sesión concreta. Antes de activarlo, registrar la decisión, el responsable de la cuenta, alcance, expiración y revocación en el [registro de decisiones](registro-decisiones-riesgos-excepciones.md).

### Alcances mínimos orientativos

| Necesidad | Permiso/alcance mínimo a confirmar en GitHub | Prohibiciones |
|---|---|---|
| Leer Issues | Permiso `Issues: read` limitado al repositorio. | No leer secretos, Actions, variables, entornos ni contenido ajeno a la historia. |
| Crear/editar Issue propio | `Issues: write` limitado al repositorio. | No cerrar/repriorizar trabajo ajeno sin PO. |
| Consultar Project | `read:project` para CLI clásico, o `Projects: read` en token/app compatible. | No leer/procesar items fuera del Project interno necesario. |
| Actualizar estado/campos Project | `project` para CLI clásico, o `Projects: write` limitado a organización/proyecto aprobado. | No crear campos, borrar items o cambiar prioridades sin PO. |

La documentación de GitHub indica `gh auth login --scopes "project"` para modificar Projects, y `read:project` para sólo lectura en los flujos descritos; confirma el alcance vigente en la fecha de configuración. [Projects por API](https://docs.github.com/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects?tool=cli). Los endpoints REST de Issues requieren permisos de repositorio `Issues` y los de Projects de organización requieren `Projects`; verificar endpoint concreto antes de conceder escritura. [Issues](https://docs.github.com/en/rest/issues/issues), [Projects](https://docs.github.com/en/rest/projects/projects).

### Controles de operación

1. El propietario inicia sesión interactivamente; el token nunca se imprime, pega en prompts, incluye en un script ni entra en `.env` del proyecto.
2. Usar una cuenta humana asignada y MFA; limitar repositorio/organización y fecha de revisión.
3. El agente sólo ejecuta llamadas declaradas en el encargo; para escritura, muestra primero el cambio propuesto o recibe una orden textual inequívoca por operación.
4. No habilitar webhooks, Actions, Apps, OAuth, runners, secret scanning bypass, despliegues ni acceso a contenidos/Actions/entornos como consecuencia de esta guía.
5. Al cerrar el piloto, revocar la autorización local si no sigue siendo necesaria y registrar la revisión.

## Modo C — GitHub App futura, si se aprueba

Una App sólo se justifica para un caso repetible que haya demostrado valor —por ejemplo, **sugerir** la actualización de trazabilidad de PR a Issue— y nunca para decisiones, merge o despliegue. Requiere ADR, responsable técnico, responsable de seguridad/privacidad, entorno sintético, prueba de fallo, logs minimizados, kill switch y proceso de revocación.

Permisos iniciales máximos recomendados para un piloto de trazabilidad:

- `Issues: read` y, sólo si se aprueba el comentario/traza, `Issues: write` sobre el repositorio seleccionado.
- `Projects: read`; `Projects: write` sólo si el piloto necesita actualizar un campo previamente definido.
- `Pull requests: read` y `Metadata: read` si necesita asociar PR/commit.
- Sin `Contents: write`, `Workflows`, `Actions`, `Secrets`, `Variables`, `Environments`, `Deployments`, `Administration`, `Organization members` ni webhooks.

GitHub permite permisos dirigidos por recurso y registra que mutaciones GraphQL/REST pueden necesitar permisos adicionales; se debe probar la consulta/mutación exacta con el mínimo privilegio antes de ampliar. [Referencia de permisos](https://docs.github.com/en/rest/authentication/permissions-required-for-github-apps), [Projects GraphQL](https://docs.github.com/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects?tool=cli).

## Flujo visible tras la conexión

```text
PO inicia una sesión Codex
  → discovery/refinamiento (sin acceso GitHub automático)
  → PO aprueba historia
  → Issue/Project registra trazabilidad
  → sesión de implementación en rama aislada
  → PR, pruebas y revisión independientes
  → persona actualiza estado / aprueba merge y despliegue
```

Incluso si más adelante existe el modo B o C, el agente propone; la persona responsable confirma. Los estados `Lista para merge`, `Merged`, `Desplegada` y `Cerrada` nunca cambian automáticamente.

## Checklist de autorización previa

- [ ] PO aprueba el modo A/B/C y el caso de uso concreto.
- [ ] Herramienta, repositorio, Project y datos permitidos están identificados.
- [ ] Privacidad/seguridad aprueban alcance y minimización si hay API/App.
- [ ] El permiso es el mínimo, tiene dueño, fecha de revisión y revocación definida.
- [ ] La prueba inicial usa Issues/fixtures sintéticos y no producción.
- [ ] Existe kill switch y una persona responsable puede revocar acceso.
- [ ] No se activa ninguna acción que fusione, despliegue o cambie producción.

## Relación con S21

S21 puede dejar esta guía, la configuración deseada y el checklist listos. Configurar GitHub Projects/Issues, autenticar `gh`, emitir un token, crear una App o habilitar automatización exige una autorización posterior distinta, además de respetar S15 y el Go/No-Go para datos reales.
