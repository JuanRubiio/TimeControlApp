# Modelo contractual de roles y agentes

**Estado:** propuesta para aprobación previa a S21. No crea agentes persistentes, skills, automatizaciones, permisos, tokens ni cambios de configuración de Codex.
**Principio rector:** un rol es una responsabilidad contractual; un agente es una ejecución temporal de ese rol para una historia concreta. No son sinónimos ni conceden autoridad por sí mismos.

## Recomendación

Adoptar un sistema de tres capas, versionado en el repositorio:

```text
Reglas universales del repositorio
        ↓
Contrato de rol estable y acotado
        ↓
Encargo de historia y decisión humana por fase
```

No se recomienda una colección de agentes permanentes con instrucciones largas, memoria no controlada o permiso genérico para ejecutar. Las instrucciones personalizadas se añaden a las instrucciones base de un agente y los modelos pueden ser sensibles a `AGENTS.md` y otros archivos de guía; por ello, reglas contradictorias o repetidas elevan el riesgo de comportamiento inconsistente. [Referencia oficial de agentes](https://developers.openai.com/api/reference/typescript/resources/beta/subresources/agents/methods/create), [guía oficial de modelos](https://developers.openai.com/api/docs/guides/latest-model).

### Qué va en cada capa

| Capa | Ubicación y alcance | Contenido permitido | No debe contener |
|---|---|---|---|
| Reglas universales | `AGENTS.md` futuro, sólo si S21 lo aprueba; aplica al repositorio | Seguridad básica, workflow Git, datos sintéticos, pruebas, prohibiciones y forma de escalar. | Descripción extensa de todos los roles, prompts de historia, secretos, preferencias temporales o reglas de producto duplicadas. |
| Contrato de rol | `docs/delivery/roles/<rol>.md` futuro; aplica cuando se asigna ese rol | Mandato, entradas, salidas, límites, calidad, autoridad, conflictos, escalado y modelo orientativo. | Credenciales, datos reales, instrucciones específicas de una historia, aprobación automática. |
| Encargo de historia | Issue/contrato HU + prompt de sesión; válido sólo para una fase | ID de historia, objetivo, artefactos a leer, entrega requerida, modelo, presupuesto de contexto y parada. | Reglas globales repetidas, acceso implícito a otros dominios, decisiones sin PO. |

La guía de [trabajo interno](guia-operativa-delivery-interno.md) sigue definiendo cuándo abre el PO cada sesión y la [plantilla de historia](plantilla-historia-usuario.md) conserva la fuente de trazabilidad. Un contrato de rol no desplaza esos documentos.

## Plantilla normativa de contrato de rol

Cada contrato debe caber preferentemente en 1–2 páginas y mantener exactamente estas secciones:

1. **Identidad y estado:** nombre, versión, dueño humano, fecha de revisión y `activo`/`bajo demanda`/`no activado`.
2. **Misión:** resultado que protege o produce, expresado sin solución prescrita.
3. **Responsabilidad y límites:** qué hace y qué explícitamente no hace.
4. **Entradas autorizadas:** documentos, paths, fixtures y decisiones que puede consumir; mínimos de contexto.
5. **Entregables:** formato, ubicación, identificador de historia y evidencia esperada.
6. **Criterios de calidad:** condiciones comprobables antes de entregar.
7. **Autoridad:** qué puede proponer, bloquear o actualizar; decisiones que sólo corresponden al PO, DPO/jurídico o autoridad de entorno.
8. **Cuándo interviene:** disparadores de entrada y condición clara de salida.
9. **Dependencias y hand-off:** a qué rol entrega y qué debe acompañar la entrega.
10. **Conflictos e incompatibilidades:** cuándo no puede aprobar, implementar o decidir simultáneamente.
11. **Modelo y herramientas:** clase de modelo orientativa, esfuerzo y herramientas permitidas; nunca un precio o disponibilidad asumidos.
12. **Privacidad y seguridad:** prohibiciones de PII, secretos, producción, egress y automatización; cómo notifica un incidente.
13. **Escalado y caducidad:** a quién escala, máximo de reintentos y cuándo debe revisarse el contrato.

Un contrato se revisa mediante PR y aprobación PO cuando cambia autoridad, datos permitidos, herramientas, límites de riesgo o modelo por defecto. Se anota versión en la historia que lo consumió; no se cambia retrospectivamente para justificar una decisión pasada.

## Catálogo de roles y contratos propuestos

Los roles no se activan todos en cada historia. Se asignan por disparador. En historias de bajo riesgo, una persona/agente puede asumir análisis e implementación, pero mantiene revisión humana antes de merge. En riesgo alto o crítico se aplican las incompatibilidades indicadas.

| Rol contractual | Estado inicial | Mandato y salida | No puede hacer | Disparador / incompatibilidad |
|---|---|---|---|---|
| **PO** | Activo, humano | Prioriza, aprueba alcance/riesgo/cierre y deja decisión explícita. | Delegar aprobación final a un agente; autorizar producción por defecto. | Todas las épicas/historias; no sustituye DPO, asesoría laboral ni SRE. |
| **Analista funcional/negocio** | Activo | Convierte evidencia en HU, criterios, exclusiones, dependencias y preguntas. Entrega contrato refinado. | Inventar requisito legal, prometer cumplimiento, aprobar prioridad o alcance. | Intake/refinamiento; no es revisor final de una implementación que definió sin contraste. |
| **Arquitectura** | Bajo demanda | Propone ADR, contratos, modularidad, compatibilidad y rollback de aplicación. | Cambiar arquitectura/datos transversal sin PO; implementar como atajo de decisión. | Más de un módulo, API, evento, tabla, auth/RBAC, auditoría o infraestructura. Si diseña alto riesgo, revisión técnica independiente. |
| **UX/accesibilidad** | Bajo demanda; obligatoria en UI | Define flujo, estados, copy, teclado/lector, responsive y criterios verificables. | Cambiar reglas de negocio, autorización o prometer valor/legalidad. | Toda UI nueva/modificada; entrega a frontend + QA. |
| **Frontend** | Bajo demanda | Implementa UI sobre contrato, conserva autorización en servidor y cubre pruebas de presentación. | Redefinir API, RBAC, dominio o datos sin contrato propietario. | Historia de presentación; no revisa en solitario su propio cambio de alto riesgo. |
| **Backend** | Bajo demanda | Implementa dominio/API/migración autorizada, aislamiento, auditoría y pruebas. | Reescribir migración publicada, editar módulos ajenos, usar datos reales o desplegar. | Cambio servidor/datos; separación obligatoria de seguridad/QA para riesgo alto. |
| **QA** | Activo en historias listas para validar | Mantiene plan de pruebas, casos negativos, fixtures sintéticos y evidencia reproducible. Puede bloquear por falta de evidencia. | Aceptar riesgo de negocio, rebajar criterio sin PO o ser el único revisor de su implementación crítica. | Desde refinamiento a cierre; independiente en riesgo alto. |
| **Seguridad y privacidad** | Bajo demanda; obligatoria en disparadores | Evalúa minimización, acceso, secretos, logging, amenazas, retención y proveedor. Entrega dictamen/control o bloqueo. | Interpretación jurídica final, aceptación unilateral de riesgo o despliegue. | PII, exportación, identidad, MFA/RBAC, auditoría, secreto, tercero, logs, red o entorno. Independiente del implementador. |
| **DevOps/SRE** | Bajo demanda | Diseña/ejecuta operación autorizada, backup/restore, observabilidad, rollback y runbooks. | Crear producción, activar CD, exponer secretos o desplegar sin autoridad explícita. | Infraestructura, CI/CD, despliegue, S15. No combina autorización de despliegue y ejecución crítica sin segunda persona. |
| **Revisión técnica/cumplimiento** | Activo en riesgo medio/alto | Revisa contrato, diff, pruebas y límites de forma independiente; entrega hallazgos priorizados. | Implementar/corregir silenciosamente el cambio que revisa o aprobarse a sí mismo. | Antes de `Lista para merge`; obligatorio si riesgo alto/crítico. |
| **Datos/métricas** | No activado hasta decisión | Propone medición mínima y análisis agregado de hipótesis aprobadas. | Telemetría por iniciativa propia, perfilado de empleados o dato real sin base legal. | Sólo tras PO + privacidad. |
| **Marketing/SEO/GTM** | No activado hasta decisión | Prepara mensajes y validación de mercado de límites aprobados. | Publicar, afirmar cumplimiento legal o recoger leads/datos sin aprobación. | Próximo a piloto/mercado, con PO y revisión legal cuando aplique. |

## Registro de asignación por historia

El contrato estable no basta: antes de abrir cada sesión se completa una tabla breve en la historia. Es la única fuente que convierte un rol posible en una asignación real.

| Campo | Ejemplo |
|---|---|
| HU y fase | `HU-TC-003`, diseño de seguridad |
| Rol y versión de contrato | Seguridad y privacidad `v1.0` |
| Responsable humano / sesión | Nombre/ID de sesión, no credencial |
| Modelo y esfuerzo | `gpt-6-astra`, alto; confirmar disponibilidad en la sesión |
| Entradas permitidas | HU, ADR-0005, contrato S9/S15, diff y fixtures sintéticos |
| Salida exigida | Dictamen con riesgos, controles, pruebas y bloqueos |
| Autoridad concreta | Puede bloquear `Lista para merge`; PO acepta riesgo residual |
| Herramientas permitidas | Sólo lectura/edición de docs o código según fase; sin red/servicios si no están autorizados |
| Límite de tiempo/reintentos | Dos intentos; luego escalado a PO/arquitectura |
| Receptor del hand-off | QA + revisor técnico + PO |

Sin este registro no se invoca un rol para una historia de riesgo medio/alto.

## Separación de deberes

| Situación | Regla |
|---|---|
| Implementación crítica | Implementador ≠ revisor técnico ≠ QA independiente cuando se toca datos, RBAC, auditoría, exportación, infraestructura o producción. |
| Decisión de producto | Quien la analiza puede recomendar; sólo PO decide. |
| Riesgo legal/privacidad | Seguridad puede bloquear; DPO/asesoría y PO resuelven/aceptan. |
| Despliegue | SRE ejecuta sólo con autorización de entorno; PO no sustituye el control técnico y el agente nunca la autocrea. |
| Cambio de contrato de rol | Autor del cambio ≠ único aprobador; PO y, si afecta seguridad/datos, responsable de seguridad/privacidad. |

La separación se aplica a **roles**, no necesariamente a números de modelo: usar dos nombres de modelo no sustituye la independencia de evidencia, prompt, contexto y revisión humana.

## Protocolo de hand-off

Todo rol termina con una salida de máximo una página, enlazada a la historia:

1. Resultado y alcance cubierto.
2. Evidencia y archivos/artefactos revisados.
3. Decisiones tomadas o que siguen pendientes.
4. Riesgos, controles y pruebas faltantes.
5. Recomendación de estado Kanban (`puede avanzar`, `bloqueada`, `requiere PO`) y destinatario.

No se permite el hand-off basado en «parece correcto». Si un rol no puede verificar una condición, la declara como pendiente y no la convierte en hecho.

## Gobernanza de instrucciones y contexto

- Mantener `AGENTS.md` futuro breve y exclusivamente transversal; no duplicar contratos de producto ni prompts de rol.
- Mantener contratos de rol en documentación, con dueño humano y versión; no enterrarlos en conversaciones de Codex.
- El prompt de sesión referencia los documentos exactos y su versión; no vuelca el repositorio entero ni conversaciones anteriores.
- Usar listas de archivos permitidos cuando el trabajo sea acotado. Si un rol necesita ampliar alcance, lo declara y pide la decisión correspondiente.
- Las skills se evalúan aparte: una skill reutilizable sólo se crea después de probar el rol/documento manualmente en varias historias y comprobar que no introduce reglas ocultas o contradictorias.
- No usar agentes persistentes/configurados por API en S21. La documentación oficial contempla agentes reutilizables con instrucciones, modelo, herramientas y configuración multagente; esta propuesta no supone que esa API ni sus costes/retención estén aprobados para el producto. [Referencia oficial](https://developers.openai.com/api/reference/typescript/resources/beta/subresources/agents/methods/create).

## Condiciones para considerar preparado el sistema

Antes de iniciar el primer discovery o historia bajo este modelo, el PO debe aprobar:

- [ ] La decisión GitHub Free interno, estados, campos, WIP y permisos humanos.
- [ ] Esta estructura de tres capas y el catálogo de roles activo/bajo demanda.
- [ ] El dueño humano de cada contrato y las incompatibilidades de alto riesgo.
- [ ] La plantilla de contrato de rol y registro de asignación por historia.
- [ ] Los límites de información, fixtures sintéticos y protocolo de incidente.
- [ ] La política de modelos, escalado, dos reintentos y revisión cruzada.
- [ ] El flujo de discovery/backlog y la autoridad del PO para priorizar.
- [ ] Que S15/NO-GO sigue siendo una puerta externa e independiente.

Después de la primera historia completa, se celebra una revisión de proceso: conservar, corregir o retirar contratos; no ampliar roles por defecto. Las modificaciones se hacen por PR/documentación y se aprueban antes de afectar a historias futuras.
