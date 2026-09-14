# Evaluación operativa — delivery por historias y agentes

**Estado:** decisión de herramienta aprobada el 13/09/2026; el resto de la implantación permanece pendiente de autorización expresa. No autoriza conexión, migración, automatización ni despliegue.
**Fecha de consulta:** 13/09/2026 (Europe/Madrid).
**Ámbito:** siguiente etapa del SaaS de control horario; los datos de producción continúan bloqueados por S15/NO-GO.

## Resumen ejecutivo

### Recomendación

Adoptar **GitHub Projects (Projects v2) + GitHub Issues + pull requests** como tablero único inicial, con la documentación contractual versionada en este repositorio. Es la opción de menor fricción porque el repositorio remoto ya es GitHub y el workflow vigente exige rama remota, commit verificable y PR. Cada historia será un Issue, cada épica un Issue tipo `Epic`/campo de relación o un issue padre, y el Project será la vista Kanban y de cartera. La adopción inicial no requiere exportar código ni documentos a un segundo proveedor.

Usar **OpenProject Community autoalojado** como alternativa secundaria si el propietario decide que el tablero, sus comentarios y adjuntos deben permanecer bajo infraestructura propia antes del piloto. Es la opción más madura de soberanía entre las revisadas, pero introduce operación, actualizaciones, copias, seguridad y una integración GitHub que debe configurarse y revisarse. No es la elección de inicio para un equipo pequeño mientras S15 todavía demanda capacidad operativa.

La gobernanza propuesta es **propietario de producto como único aprobador de alcance/riesgo**, contratos por historia versionados, ejecución con agente implementador y revisión independiente obligatoria para cambios de riesgo. No se da a un agente capacidad de aprobar producción, secretos, cambios legales ni decisiones de producto.

### Decisión registrada

El propietario ha aprobado **GitHub Free, Projects + Issues** como Kanban de trabajo **interno**. No es una herramienta para clientes, no se conectará a datos de clientes y no se crearán automatizaciones, Apps, webhooks, tokens ni integraciones hasta una autorización posterior separada. El repositorio Git privado conserva el código y `docs/` conserva los contratos. La guía operativa aplicable tras la implantación está en [guía de trabajo interno](guia-operativa-delivery-interno.md).

### Hechos verificados

- El árbol está limpio y en `master`, sincronizado con `TimeControlApp/master`; la cabeza local es `35b24de` y el remoto configurado es GitHub. La estructura contiene Next.js/TypeScript, PostgreSQL, Docker, `src/`, `migrations/`, `tests/`, `ops/` y los contratos S0–S20.
- El workflow vigente exige rama `codex/<sesion>-<tema>`, commits pequeños, pruebas y revisión, publicación remota y PR antes de integrar; prohíbe mezclar trabajo paralelo, `.env`, secretos y `git add .`. Véase [workflow Git](/D:/Proyectos/TimeControlApp/docs/development/git-workflow.md).
- El MVP conserva un **NO-GO para datos reales**: faltan controles operativos externos, criterios RPO/RTO y aprobaciones DPO/laboral/operación. Esta propuesta no modifica esa puerta. Véanse [README MVP](/D:/Proyectos/TimeControlApp/docs/mvp/README.md) y [evaluación prepiloto](/D:/Proyectos/TimeControlApp/docs/mvp/evaluacion-ampliacion-prepiloto.md).
- GitHub Projects permite campos de issue tipados, agrupación/filtros/vistas, automatización integrada, GraphQL, Actions y webhooks; los webhooks de Projects v2 siguen en vista previa según la documentación oficial. [Campos de Issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/managing-issue-fields-in-your-organization), [automatización de Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project), [webhooks](https://docs.github.com/en/enterprise-cloud@latest/webhooks/webhook-events-and-payloads).
- OpenProject dispone de Community autoalojada sin licencia, tableros ágiles y una integración GitHub que relaciona work packages, PR y estados de Actions. [Ediciones/operación](https://www.openproject.org/docs/installation-and-operations/), [tableros](https://www.openproject.org/docs/user-guide/agile-boards/), [integración GitHub](https://www.openproject.org/docs/system-admin-guide/integrations/github-integration/).
- Plane ofrece REST API, webhooks, Wiki/Pages e integración GitHub; tiene ediciones autoalojadas, incluida Community AGPL, pero la integración autoalojada exige configurar credenciales, claves y webhooks. [API](https://developers.plane.so/api-reference/introduction), [ediciones](https://developers.plane.so/self-hosting/editions-and-versions), [integración](https://developers.plane.so/self-hosting/govern/integrations/github).
- Linear ofrece Issues, proyectos/iniciativas, API/webhooks y planes comerciales; el precio publicado consultado es Free $0, Basic $10/usuario/mes anual y Business $16/usuario/mes anual; SAML/SCIM aparece en Enterprise. [Pricing oficial](https://linear.app/pricing).
- GitLab combina planificación, repositorio y CI/CD, y se puede autoalojar; en la consulta su Free alojado indica 5 usuarios por grupo privado y 400 minutos/mes, Premium $29/usuario/mes anual y Ultimate por presupuesto. GitLab.com se declara alojado en EE. UU.; GitLab Self-Managed permite controlar infraestructura/datos. [Pricing oficial](https://about.gitlab.com/pricing/).
- Taiga documenta REST, webhooks, repositorios GitHub/GitLab y una integración GitHub principalmente unidireccional basada en commits/issues. La documentación indexada de la integración es antigua, por lo que su profundidad comercial, soporte y precios deben reconfirmarse antes de compra. [Taiga API/integraciones](https://docs.taiga.io/), [GitHub](https://docs.taiga.io/integrations-github.html), [webhooks](https://docs.taiga.io/webhooks.html).
- En este entorno de Codex se ofrecen actualmente `gpt-6-astra`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna` y `gpt-5.5`, con esfuerzos de razonamiento que varían por modelo. La disponibilidad real para una futura sesión debe comprobarse de nuevo en ese momento. La documentación oficial sitúa Astra como máxima capacidad y Terra/Luna como equilibrio/coste; los precios de API no equivalen necesariamente al coste de una suscripción de Codex. [Modelos oficiales](https://developers.openai.com/api/docs/models), [guía de selección](https://developers.openai.com/api/docs/guides/latest-model).

### Inferencias y recomendación

Centralizar el trabajo en GitHub reduce duplicación de objetos, sincronizaciones y credenciales de terceros. Es una inferencia basada en que el remoto actual es GitHub y en las capacidades anteriores, no una garantía de que el plan actual de la organización incluya cada control empresarial. Para documentos con información sensible, la fuente de verdad continuará siendo Markdown en Git privado; el Issue sólo contendrá resumen, enlaces y decisiones no sensibles.

## Comparativa de Kanban e historias

| Opción | Planificación y trazabilidad | Git/CI/API/agentes | Privacidad, acceso y residencia | Coste confirmado / esfuerzo | Adecuación y dictamen |
|---|---|---|---|---|---|
| **GitHub Projects + Issues** | Tablero, tabla, filtros, campos tipo prioridad/esfuerzo/fecha; Issues, subissues/relaciones según plan y configuración. Épicas mediante tipos/campo padre o issue padre. Comentarios, menciones, adjuntos y enlaces viven con el Issue. | Nativo con commits, ramas, PR, checks y Actions; GraphQL, REST, Apps y webhooks. No automatizar inicialmente. | Código y metadatos salen a GitHub Cloud si se usa el remoto actual. Enterprise ofrece opciones adicionales de gobernanza, SAML y servidor propio; confirmar contrato, región y retención. | No se confirma coste aplicable sin ver el plan de la organización. Adopción baja: configurar tipos/campos/vistas. | **Recomendada ahora.** Máxima trazabilidad con el workflow actual y mínima operación adicional. Riesgo: metadatos de producto en SaaS; mitigarlo con minimización y repositorio privado. |
| **OpenProject** | Work packages, tipos, relaciones/dependencias, actividades/comentarios y tableros Kanban; integra tableros con planificación más amplia. | API/tokens; integración GitHub enlaza PR, estado y resultados de Actions; requiere webhook y secreto. | Community se autoaloja; Cloud Enterprise en centro de datos UE según su documentación. SSO/controles avanzados son add-ons Enterprise. | Community gratuita; planes Enterprise publicados desde €5,95/usuario/mes con mínimo de 25 en la consulta, más infraestructura/operación. Adopción media-alta. | **Alternativa secundaria de soberanía.** Elegir sólo con responsable de operación, hardening, backup, actualizaciones y DPA aprobados. |
| **Plane** | Work items, proyectos, ciclos/módulos, páginas/wiki, formularios, analítica y relaciones; UI orientada a producto. | REST, webhooks, MCP/agents documentados; integración GitHub conecta issues, PR y commits. | Cloud o autoalojado; Community AGPL, Commercial/Airgapped con alcance distinto. La configuración de GitHub solicita secretos, clave privada y webhooks. | Cloud/precio y licencias deben verificarse antes de compra; documento oficial de ediciones menciona 12 plazas free para Commercial, y la web comercial declara recursos mínimos de 4 CPU/8GB/50GB. Adopción media-alta. | Potente si se decide plataforma dedicada a agentes, pero **no ahora**: más superficie operativa y potenciales secretos/integraciones. |
| **Linear** | Issues, ciclos, proyectos, iniciativas, subiniciativas y vistas ágiles rápidas; comentarios, adjuntos e integraciones. | API y webhooks publicados; integración de código depende de plan. | SaaS; no se verificó en la fuente consultada una opción de autoalojamiento. SAML/SCIM y controles finos se listan en Enterprise. | Free: 2 equipos/250 issues/10MB por archivo; Basic $10 y Business $16 por usuario/mes anual; Enterprise custom, datos de 13/09/2026. Adopción baja. | Excelente ergonomía, pero **descartada para fase actual**: duplicaría la fuente de código/traza y requiere evaluación contractual de datos. |
| **GitLab Issues/Boards** | Issues, tableros, épicas/tareas, pesos, iteraciones y documentación Wiki según nivel. | Repositorio, MR, CI/CD, seguridad y API en una plataforma. | GitLab.com multi-tenant en EE. UU.; Self-Managed proporciona control de infraestructura. | Free/Premium/Ultimate oficiales arriba; migrar desde GitHub y operar o contratar GitLab agrega esfuerzo alto. | Capaz y escalable, pero **no recomendado** salvo decisión estratégica de mover todo el SCM/CI. No crear espejo parcial. |
| **Taiga** | Backlog, historias, tareas, issues, épicas, Kanban/Scrum y wiki están documentados; capacidad de dependencias y auditoría fina debe validarse con una prueba controlada. | REST/webhooks; integración GitHub limitada según documento: commits, issues y comentarios, principalmente de GitHub hacia Taiga. | Autoalojable en la tradición del proyecto, pero no se verificaron en fuente actual controles empresariales, residencia, SSO o precio aplicable. | Precio/soporte actuales: **no confirmado**. Adopción media. | **No elegida.** La documentación encontrada para integración está desactualizada y la trazabilidad con PR/CI parece menos completa. |
| **Forgejo/Gitea (alternativa adicional)** | Posible combinación ligera de forja/Issues/Projects autoalojada, pero no se realizó una verificación oficial suficiente de todas las capacidades solicitadas. | API/webhooks y acciones pueden existir según edición, sin evaluación completa aquí. | Autoalojamiento puede reducir exposición, pero exige operar otra forja y migrar del remoto actual. | Coste de licencia y características exactas: no confirmados en esta investigación. | **No recomendada por ahora.** Mantenerla como opción de investigación si la prioridad cambia a soberanía integral de código, no sólo tablero. |

### Criterios de elección y límites

1. No se incorporará texto de contrato con PII laboral, secretos, claves, registros de jornada ni adjuntos de clientes a ningún tablero SaaS.
2. La decisión no la determina el precio aislado: debe compararse el coste total de propiedad (administración, copias, actualizaciones, SSO, logs, seguridad y soporte) con el valor de residencia/control.
3. Antes de adquirir o conectar una opción: comprobar edición exacta, DPA, subencargados, región, cifrado, auditoría, exportación, borrado, retención, SSO, límites de API y política de IA; registrar la decisión como ADR.

## Orquestación de agentes: opciones y modelo elegido

| Opción | Beneficio | Límite | Dictamen |
|---|---|---|---|
| **Orquestación manual por contrato + Kanban** | Aprobaciones humanas claras; mínimo privilegio; empieza sin automatización ni tokens persistentes. | Requiere disciplina de actualización. | **Elegida para fase actual.** |
| **Agentes disparados por eventos/webhooks** | Actualiza estados y genera artefactos repetitivos. | Introduce credenciales, egress, fallos de sincronización y riesgo de que una acción automática se confunda con aprobación. | Diferir hasta una sesión aprobada de implantación y un piloto sintético. |
| **Plataforma externa de agentes integrada con el tablero** | Puede coordinar trabajos a escala. | Aumenta exposición de contexto, dependencia y superficie de proveedores. | No adoptar sin evaluación DPA/seguridad y caso de uso probado. |
| **Agentes dentro de una instancia autoalojada** | Mejor control de red y contexto si se opera bien. | No elimina riesgo de prompts, permisos ni mantenimiento. | Considerar sólo si se elige una solución autoalojada y existe capacidad SRE. |

### Roles especializados, límites y puertas

| Rol | Responsabilidad, entradas y entregables | Interviene / calidad | Autonomía y dependencia |
|---|---|---|---|
| Propietario de producto (PO) | Prioridad, valor, alcance, decisiones de negocio; recibe evidencia, riesgo y alternativas. Entrega aprobación/rechazo explícito. | En toda épica, inicio/cierre de historia y cada puerta de alto riesgo. Calidad: decisión trazable y límites claros. | **Único** que aprueba alcance, presupuesto, datos reales, proveedor, producción y excepciones. |
| PM/analista funcional | Convierte evidencia y reglas aprobadas en historia, exclusiones, criterios, dependencias y preguntas. | Antes de diseño; criterio: verificable, sin inventar obligación legal. | Puede proponer y ordenar con PO; depende de PO y consulta jurídico/DPO para límites. No aprueba interpretación legal. |
| Arquitectura | Evalúa módulos, ADR, contratos, migración, rendimiento, integración y reversibilidad. | Si toca más de un módulo, datos, auth/RBAC, auditoría, infraestructura o API. | Propone diseño; requiere PO para decisión transversal. Evita duplicar análisis funcional. |
| UI/UX y accesibilidad | Flujos, estados, copy, responsive, teclado/lector y evidencia de prueba; usa S14/S20 como dirección no vinculante. | Antes del plan si hay interfaz; revisión antes de merge. Calidad: no altera regla de negocio ni promesa legal. | Propone; PO aprueba cambio de alcance. Depende de funcional/arquitectura. |
| Frontend | Implementa presentación/cliente dentro del contrato y pruebas de UI. | Sólo cuando existe diseño/contrato. Calidad: a11y, no confiar en UI para autorización, pruebas verdes. | Implementa, no redefine APIs ni negocio. Coordina con backend por contrato. |
| Backend | Implementa dominio, API, autorización, auditoría, migraciones aditivas y pruebas. | Cuando hay cambio de servidor/datos. Calidad: tenant/rol servidor, idempotencia, UTC, append-only y migración compatible. | Implementa sólo módulos propios; arquitectura/PO autorizan cambio transversal. |
| QA | Plan de prueba, casos negativos, regresión, fixtures sintéticos y evidencia. | Desde criterios hasta cierre. Calidad: reproducible, cobertura de autorizaciones, DST, errores y no regressions. | Puede bloquear por evidencia insuficiente; no aprueba riesgo residual de negocio. Independiente del implementador en alto riesgo. |
| Seguridad y privacidad | Threat model proporcional, minimización, secretos, DPA/RGPD, abuso, retención y revisión de exposición. | Obligatorio para datos, identidad, roles, exportación, logs, proveedor o despliegue. | Puede bloquear por control ausente; PO/DPO/jurídico asumen o resuelven riesgo. No sustituye asesoramiento profesional. |
| DevOps/SRE | Entornos, IaC/operación, backup/restore, observabilidad, CI/CD, rollback y runbook. | Infraestructura, secretos, pipelines, despliegue y S15. | Propone y ejecuta sólo en entorno autorizado; **no despliega producción sin aprobación explícita**. |
| Datos/métricas | Métricas de producto minimizadas, hipótesis y análisis agregado. | Sólo tras decisión de medición y base legal/privacidad. | No crear telemetría ni perfilar empleados por iniciativa propia. |
| Marketing/SEO/GTM | Mensajes, páginas y activación sin prometer cumplimiento automático. | Sólo al acercarse al piloto/mercado y tras validación legal. | No publica ni afirma requisitos legales sin PO/jurídico. |
| Revisor técnico/cumplimiento | Revisión independiente del diff, contrato, pruebas, seguridad y documentación. | Obligatorio antes de merge para alto riesgo; rotativo en bajo riesgo. | No es el implementador. Recomienda aprobar/bloquear; merge lo realiza persona autorizada conforme al workflow. |

**Roles mínimos ahora:** PO, analista funcional/PM, arquitectura a demanda, un implementador (frontend/backend según historia), QA independiente en riesgo medio/alto, seguridad-privacidad a demanda y revisor técnico. UI/UX entra en toda superficie visible; DevOps/SRE entra sólo en S15/infraestructura. Datos y marketing se aplazan hasta que exista una decisión de medición o GTM. Esto evita agentes por moda y mantiene el equipo proporcional al MVP.

### Secuencia y paralelismo

El carril principal es secuencial: refinamiento → aceptación PO → arquitectura/diseño → plan → implementación → QA/revisiones → PR → aprobación/merge → despliegue autorizado → validación. Se puede paralelizar análisis de riesgo, diseño UX, plan de pruebas y exploración técnica **sólo** cuando consumen el mismo contrato sin editar las mismas rutas, tablas, migraciones o documentación de propiedad ajena. No se paraleliza una historia que modifique auditoría, autenticación, RBAC, exportaciones, migración o infraestructura hasta que exista un ADR/contrato de fundación y responsables claros.

## Política recomendada de modelos

La política se basa en las opciones visibles de Codex en esta sesión y la guía oficial de selección, no en una promesa de disponibilidad futura. La calidad se valida por evidencia, no por el nombre del modelo.

| Clase | Modelos permitidos hoy (preferencia) | Usos | Esfuerzo/contexto | Control obligatorio |
|---|---|---|---|---|
| Rápido/económico | `gpt-5.6-luna`; si el caso exige más, `gpt-5.6-terra` | Clasificar backlog, comprobar plantillas, extraer criterios, inventario de archivos, redactar borradores no críticos. | Bajo; paquete mínimo de contrato y archivos relevantes; salida estructurada. | No aprueba diseño, seguridad, PR ni cambio de estado crítico. |
| Equilibrado | `gpt-5.6-terra` o `gpt-5.6-sol` | Implementación acotada, pruebas, análisis de diff, documentación técnica y UX ordinaria. | Medio; incluir contrato, ADR y módulos de propiedad, no todo el repositorio. | PR y pruebas revisados por humano/revisor; elevar si toca los disparadores de riesgo. |
| Máxima capacidad | `gpt-6-astra` (alternativa visible: `gpt-5.6-sol` con esfuerzo alto/máximo) | Arquitectura transversal, seguridad/RGPD, diseño de migración, amenaza, recuperación, cambios con impacto legal/operativo y revisión final compleja. | Alto/xhigh/max según evidencia; trocear contexto por dominio y adjuntar decisiones, no datos reales. | Revisión independiente humana y PO; no ejecución productiva autónoma. |
| Revisión cruzada | Modelo distinto del implementador, preferiblemente `gpt-6-astra` o `gpt-5.6-sol` para alto riesgo | Verificar supuestos, tests faltantes, aislamiento, auditoría, límites y documentos. | Contexto: contrato + diff + tests + ADR, no conversación completa innecesaria. | Hallazgos deben resolverse o aceptarse por PO con registro. |

Reglas operativas: (a) comenzar por el modelo de menor clase que pueda resolver una tarea reversible; (b) elevar una clase si hay dos fallos fundamentados, dependencia transversal, cambio de datos/identidad/privacidad o incertidumbre material; (c) máximo dos reintentos con el mismo enfoque y después reformular, dividir o escalar; (d) presupuesto por subentrega: primero resumen de 1–2 páginas y archivos estrictamente pertinentes, ampliar sólo mediante lista explícita; (e) un modelo económico nunca mueve `Ready to merge`, `Deployed`, `Closed` ni aprueba una excepción; (f) repetir con modelo/rol independiente ante alto riesgo, no una segunda vez con el mismo contexto y sesgo.

No se fija un coste monetario de Codex: no se verificó el plan de cuenta, sus cuotas ni su facturación. Como referencia de **API**, la página oficial consultada publica para GPT-6 Astra $10/MTok de entrada y $50/MTok de salida; no debe usarse para presupuestar Codex sin confirmar la modalidad comercial aplicable. [Ficha oficial Astra](https://developers.openai.com/api/docs/models/gpt-6-astra).

## Flujo obligatorio por historia

```text
Épica → Historia → criterios verificables → diseño/ADR → plan técnico
→ desarrollo → pruebas → revisión seguridad/privacidad + UX → PR/merge
→ despliegue autorizado → validación de producto → cierre/aprendizaje
```

Estados Kanban propuestos: `Intake` → `Refinamiento` → `Pendiente aprobación PO` → `Diseño/ADR` → `Lista para desarrollo` → `En desarrollo` → `En revisión` → `QA/validación` → `Lista para merge` → `Merged` → `Pendiente despliegue autorizado` → `Desplegada` → `Validación producto` → `Cerrada`; carriles laterales `Bloqueada` y `Rechazada/Aplazada` con motivo.

Puertas:

1. No pasa de refinamiento sin objetivo, exclusiones, criterios y riesgos.
2. No pasa a desarrollo sin PO, diseño proporcional y responsables definidos.
3. No pasa a PR sin rama, commits, pruebas y documentación exigidos por el workflow.
4. No se hace merge sin QA/revisor y, cuando aplica, seguridad/privacidad/UX.
5. No se despliega sin aprobación explícita de la autoridad de entorno; producción y datos reales siguen sujetos a S15 y Go/No-Go.
6. No se cierra sin enlaces de evidencia, decisión de aceptación y aprendizaje breve.

## Ejemplos aplicables

### HU-TC-001 — Fichaje diario de empleado

**Épica:** E-TC-01 Registro verificable. **Historia:** Como empleado, quiero registrar la acción disponible de mi jornada desde web responsive para conservar un registro individual verificable. **Alcance:** entrada/salida/pausa manual sobre contratos S4/S5 existentes; confirmación e idempotencia. **Exclusiones:** GPS, biometría, cámara, vigilancia, nómina, offline completo.

**Aceptación:** (1) el servidor autoriza por empleado/tenant; (2) la secuencia inválida se rechaza claramente; (3) doble envío no duplica evidencia; (4) se muestra hora/zona y confirmación sin prometer cumplimiento automático; (5) casos medianoche/DST y error de red están probados con fixtures sintéticos; (6) auditoría append-only conserva actor/correlación sin secretos. **Riesgos:** privacidad bajo pero seguridad/temporalidad altos; accesibilidad móvil. **Dependencias:** S4/S5, S14/S20; no se cambia su dominio sin contrato de propietario. **Agentes:** funcional, UX, backend/front, QA, revisor; seguridad si se altera identidad/auditoría. **Modelo:** Terra/Sol para plan/implementación; Astra o Sol alto para cambio transversal; Luna sólo para checklist. **Done:** tests, PR, referencias a commits/CI, revisión UX y seguridad proporcional, evidencia sintética y aceptación PO.

### HU-TC-002 — Corrección y aprobación de fichaje

**Épica:** E-TC-02 Correcciones auditables. **Historia:** Como empleado, quiero proponer una corrección motivada para que un responsable autorizado pueda revisarla sin borrar el evento original. **Alcance:** propuesta aditiva, decisión humana, RBAC por centro y trazabilidad; **exclusiones:** edición destructiva, aprobación automática, reapertura no contratada, sanción o nómina.

**Aceptación:** (1) original inmutable; (2) motivo y fuente validados; (3) responsable sólo ve/decide ámbito autorizado; (4) aprobación/rechazo queda auditado e informa recalculo conforme a contrato; (5) UI explica que no es edición directa; (6) pruebas negativas de tenant/rol, doble decisión, rechazo y accesibilidad. **Riesgos:** alto en integridad, privacidad y relación laboral. **Dependencias:** S4/S5/S6/S8; ADR auditoría. **Agentes/modelos:** Astra/Sol alto para contrato si cambia evidencia; Terra/Sol implementación; QA y revisor independiente obligatorios; seguridad/privacidad y UX obligatorios. **Decisión PO:** cualquier cambio de semántica, plazos, reapertura o actor.

### HU-TC-003 — Exportación verificable de registros

**Épica:** E-TC-03 Acceso y exportación auditable. **Historia:** Como administrador autorizado, quiero solicitar y descargar una exportación verificable de registros dentro de mi ámbito para atender necesidades autorizadas de consulta o entrega. **Alcance:** CSV/PDF autorizado, alcance/período, generación, descarga, vencimiento y auditoría; **exclusiones:** enlace público, exportación permanente, datos fuera de tenant, afirmación de cumplimiento legal automático.

**Aceptación:** (1) autorización servidor y scope; (2) contenido reproducible y trazable; (3) expiración/borrado y auditoría verificables; (4) descarga sólo si S15 demuestra almacenamiento/retención aprobados; (5) UI accesible aclara alcance/vencimiento; (6) negativas RBAC/tenant y prueba de retención con fixtures sintéticos. **Riesgo:** crítico (datos personales y evidencia laboral). **Dependencias:** S9, S15, S16 y aprobaciones DPO/operación. **Agentes/modelos:** Astra alto/máximo para amenaza/operación, Sol/Terra para implementación acotada, QA + seguridad/privacidad + DevOps/SRE + UX + revisor independientes. **Bloqueo actual:** permanece en `Bloqueada` hasta el cierre S15; ninguna historia elimina el NO-GO.

## Gobierno, seguridad y trazabilidad

### Información permitida y prohibida

| Lugar | Permitido | Prohibido |
|---|---|---|
| Historia/Issue | Identificador, objetivo, criterios, riesgos clasificados, enlaces internos, decisiones y evidencia sintética. | Nombre/email/ID real de empleado o cliente, horarios reales, exportaciones, credenciales, tokens, URLs privadas con secretos, logs no saneados, contratos/DPA sin autorización. |
| Comentario/prompt | Resumen mínimo, datos anonimizados/sintéticos, paths/diffs permitidos y pregunta concreta. | `.env`, claves privadas, cookies, secretos de CI, datos de producción, capturas con PII, contenido de tickets de clientes sin sanitizar. |
| Adjunto | Mock, diagrama, fixture o captura sintética aprobada. | Copias de BD, registros laborales, backups, archivos exportados o datos de cliente. |

Los fixtures sintéticos son obligatorios y deben usar dominios/cuentas de prueba (`@demo.test` cuando corresponda). Los agentes reciben mínimo contexto por propósito y no tienen acceso de escritura a producción. Cualquier posible exposición se trata como incidente: detener el flujo, revocar/rotar si aplica, registrar y escalar a la persona responsable.

### Aprobaciones humanas no delegables

- Cambio de alcance, prioridad, precio/proveedor, contratación, DPA, región y residencia.
- Tratamiento de datos reales, telemetría, nuevas categorías de datos, retención, exportación o derechos.
- Interpretación laboral, cumplimiento, configuración de convenios o mensaje comercial/legal.
- Arquitectura transversal, migración irreversible, excepción de seguridad, secreto, acceso privilegiado o red.
- Merge de alto riesgo, activación de CI/CD, creación de automatización y todo despliegue, especialmente producción.

### Trazabilidad mínima exigida

`Epic → HU-ID → contrato Markdown → ADR/decisión → Issue/Project → rama → commits → PR → checks/pruebas → revisión → despliegue → validación → cierre`. El identificador HU aparece en título de rama, commits y PR, sin sustituir la nomenclatura `codex/<sesion>-<tema>` del workflow. Se registra en el contrato: SHA base, archivos previstos, responsable, comandos de prueba, links de PR/CI y decisión de merge. Un ADR nuevo se crea para decisión arquitectónica o de datos duradera; un cambio de alcance se registra en la sección de decisiones de la historia y exige PO.

### Política de Git y despliegue

Se conserva íntegramente el workflow documentado: partir de `master` remoto identificado, una rama/propiedad por sesión, commits pequeños y reversibles, migraciones aditivas, `git diff --check`, pruebas proporcionales, `git push -u TimeControlApp <rama>` y PR contra `master`. No se permiten tokens personales de larga vida para agentes; si más adelante se aprueba integración, usar identidad de app con mínimo privilegio, tokens cortos, auditoría, entorno sintético, allowlist de acciones y kill switch. Ninguna automatización podrá crear, fusionar, desplegar, modificar configuración ni acceder a producción sin una aprobación humana explícita y verificable por cada transición sensible.

## Riesgos, costes y mitigaciones

| Riesgo | Probabilidad/impacto | Mitigación |
|---|---|---|
| Filtrar PII/secretos al tablero o prompt | Media / crítica | Plantilla con clasificación, fixtures sintéticos, revisión humana, mínimo contexto, secretos fuera de Issues y escaneo/rotación si hay incidente. |
| Confundir salida de agente con aprobación | Media / alta | Estados de aprobación separados; PO y revisor humano explícitos; agentes sin credenciales de merge/deploy. |
| Duplicación GitHub–herramienta externa | Media / media | Elegir una fuente de verdad; no sincronizar bidireccionalmente en fase inicial. |
| Coste/latencia de modelos | Media / media | Modelo por clase, contextos acotados, dos reintentos, medición por historia y escalado justificado. |
| Sobreoperar self-hosting | Alta / alta | No instalar OpenProject/Plane hasta que S15 tenga responsables, backup/patching/monitorización y coste aprobados. |
| Deriva de alcance o promesa legal | Alta / alta | Exclusiones explícitas, revisión legal/DPO, ADR y aprobación PO; no afirmar cumplimiento automático. |
| Dependencia de capacidades/precios cambiantes | Media / media | Fecha/fuente en ADR de compra y revalidación inmediatamente antes de contratación/implantación. |

**Estimación no contractual:** configuración documental de GitHub Projects y plantillas, una vez aprobada, es S (media jornada a 1 día) sin automatización. Una prueba controlada de OpenProject autoalojado es M (2–5 días de operación, sin incluir infraestructura, hardening, DPA/SSO ni integración). Implantar automatización segura por eventos es M–L (5–15 días más controles y pruebas), y queda fuera de esta propuesta. Son inferencias de esfuerzo, no presupuesto ni compromiso.

## Decisiones pendientes del propietario

1. Aprobar los tipos, campos, estados, límites WIP y permisos de la propuesta Kanban adjunta.
2. Confirmar quién asume PO, revisión técnica, seguridad/privacidad y autoridad de despliegue.
3. Confirmar que se acepta el riesgo residual de metadatos internos minimizados en GitHub Cloud; si no, reabrir la alternativa OpenProject autoalojado.
4. Autorizar o rechazar la futura sesión de configuración documental; dicha sesión no conectará GitHub, creará automatizaciones ni migrará datos sin una autorización posterior específica.
5. Antes de cualquier plan de pago: validar precio, edición, DPA, región, soporte, límites y retención directamente con el proveedor.

## Fuentes y fiabilidad

**Alta:** documentación oficial de GitHub, OpenProject, Plane, Linear, GitLab, Taiga y OpenAI enlazada en este documento, consultada el 13/09/2026; y documentos/repositorio locales leídos en modo lectura. **Media:** afirmaciones comerciales de páginas de proveedor (capacidad anunciada; requieren validación contractual). **Baja/no confirmada:** precios/SSO/auditoría de cualquier plan no enlazado específicamente, residencia concreta para el tenant, límites de cuenta existentes, disponibilidad futura de modelos y capacidad real tras integración. Las recomendaciones y estimaciones están marcadas como tales y no son hechos verificados.
