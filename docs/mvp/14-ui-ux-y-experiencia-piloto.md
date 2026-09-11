# S14 — UI/UX y experiencia de piloto

**Estado:** implementación completada; validación humana final pendiente de S15. No autoriza cambios de reglas de negocio. **Tamaño:** M. **Dependencias:** contratos S4–S9 y resultados operativos de S15 para exportaciones. **Base de trabajo:** `7bdcb41` de `master`; rama `codex/s14-uiux-piloto`.

## Nombre y objetivo

Mejorar de forma sustancial la claridad, consistencia, accesibilidad y experiencia responsive del MVP entregado, sin modificar semántica de jornada, permisos, cálculos, auditoría ni aprobaciones. Prioridad: empleado en móvil; después responsable/RR. HH. en escritorio; finalmente administrador durante configuración y exportación.

## Entregable verificable

Una auditoría antes/después y una interfaz coherente para primer acceso, fichaje, historial, corrección, revisión y exportación: etiquetas humanas en lugar de UUID, estados de carga/error/vacío/éxito consistentes, navegación comprensible y validación manual con teclado, lector de pantalla y móviles definidos.

## Alcance

- Auditar rutas `/login`, `/employee`, `/employee/history`, `/employee/corrections`, `/admin`, `/admin/people`, `/admin/corrections` y la futura entrada visible de exportación S16.
- Definir sistema mínimo: tipografía legible, contraste AA, paleta semántica no exclusiva de color, escala de espaciado, estados, botones, formularios, tablas/listas, avisos y *focus* visible.
- Aplicar principios de simplicidad, confianza, privacidad por defecto, explicabilidad y accesibilidad: mostrar qué se registrará, la zona y el carácter informativo del saldo; no pedir permisos de cámara/ubicación; no ocultar incidencias ni convertir excesos en nómina.
- Mejorar jerarquía, copy en español, confirmaciones no ambiguas, vacíos, errores recuperables, carga y reintentos idempotentes. La UI debe preservar el mensaje/correlationId seguro del servidor sin exponer secretos.
- Validar móvil a 320, 390 y 768 px y escritorio a 1280 px; teclado completo, lector de pantalla con recorrido humano y contraste/zoom al 200 %.

## Flujos prioritarios

1. Primer acceso y MFA: explicar siguiente paso y sesión sin revelar información de cuentas ajenas.
2. Fichaje: acción actual inequívoca, confirmación de hora registrada y protección contra doble pulsación.
3. Historial: jornada, pausas, incidencias, regla y saldo con lenguaje informativo y referencias técnicas en detalle secundario.
4. Corrección: qué fuente se corrige, motivo, estado, efecto de aprobación y cómo actuar ante rechazo.
5. Revisión de responsable: cola, filtros existentes, detalle de evidencia y decisión irreversible explicada.
6. Exportación: alcance, período, autorización, generación, descarga y vencimiento, sólo cuando S16 la exponga.

## Exclusiones

No incorpora GPS, biometría, cámara, vigilancia, dark patterns, urgencia artificial, app nativa, offline completo, notificaciones, nuevos cálculos, reapertura de correcciones, cierre de período, vacaciones/ausencias, nómina ni interpretación de convenios. No modifica APIs, RBAC, tablas ni migraciones salvo que una mejora de accesibilidad exija un campo de presentación ya existente y se apruebe por la sesión propietaria.

## Dominios, rutas, módulos, tablas y documentación afectados

Propietaria de presentación y estilos compartidos: `src/app/globals.css`, layouts y componentes de `src/employee/*` y `src/admin/*`; puede crear componentes de presentación reutilizables bajo `src/ui/*`. Consume, sin alterar, S1 auth, S4 eventos, S5 cálculo, S6 correcciones, S8 administración y S9 exportaciones. No posee tablas. Documentará inventario visual, decisiones de copy y matriz de accesibilidad en este contrato y guía de piloto si cambia una interacción visible.

## Dependencias y paralelismo

Puede preparar auditoría y sistema visual en paralelo con S15. La integración de exportación depende de S16 y del almacenamiento/retención cerrado por S15. No debe editar a la vez los mismos componentes/rutas que S16 sin un commit de fundación acordado; S16 consume los componentes publicados por S14.

## Riesgos legales, técnicos y de integración

Riesgo de presentar saldos/excesos como decisión salarial, esconder trazabilidad al sustituir UUID, romper RBAC con enlaces visibles o provocar regresiones responsive. Mitigación: conservar IDs en detalle/auditoría, textos de límites, autorización sólo en servidor, pruebas de rutas existentes y revisión S4–S9. No se afirmará cumplimiento legal automático.

## Estrategia de implementación

Primero inventario de componentes y estados; después tokens/componentes atómicos; luego rutas de empleado; después rutas de responsable; por último exportación S16. Cada ruta conserva sus adaptadores/API actuales. Introducir componentes por sustitución acotada, sin reescribir flujos de dominio, y validar cada ruta antes de extender el sistema visual.

## Auditoría UX inicial — 11/09/2026

| Clasificación | Hallazgo | Impacto | Tratamiento S14 |
|---|---|---|---|
| Bloqueante de validación | El Compose sintético compila correctamente, pero el contenedor `app` quedó en estado `Created` y no llegó a estar disponible para el recorrido visual. | Impide repetir el recorrido manual pre-cambio en este equipo; no es evidencia de un defecto de dominio ni se modifica en S14. | Registrar, reintentar tras el cambio y derivar a S12/S15 si persiste. |
| Confuso | Regla, algoritmo y actor de decisión se enseñan como UUID o texto técnico dentro del flujo principal. | El usuario no puede distinguir fácilmente dato de auditoría y decisión humana. | Etiquetas humanas como contenido principal; identificadores sólo en un bloque técnico secundario. |
| Confuso | Carga, vacío, éxito y error se resuelven de forma distinta en cada ruta; algunos errores no quedan vinculados al contexto de acción. | Favorece reintentos innecesarios de fichaje y hace difícil recuperar un formulario. | Avisos semánticos reutilizables, estados de carga visibles y reintento contextual. |
| Mejora importante | La página de jornada no separa con claridad «estado actual», «siguiente acción» y confirmación. | Riesgo operativo de doble interacción o de no entender una pausa abierta. | Jerarquía de estado, explicación breve de la acción disponible y bloqueo visible durante la petición idempotente. |
| Mejora importante | La corrección y su revisión explican de manera insuficiente la inmutabilidad del original y el carácter humano/irreversible de la decisión. | Puede inducir a esperar una edición directa o a decidir sin contexto. | Copy explícito, estado textual además de color, ayuda de campo y controles bloqueados durante el envío. |
| Mejora menor | Escala tipográfica, espaciado, foco, estados de botones, badges, tarjetas y listas no pertenecen a un sistema visual único. | Baja consistencia, especialmente a 200 % de zoom y en móvil. | Tokens CSS y componentes de presentación compartidos; sin cambiar semántica de datos. |

### Plan de cambio aprobado por el contrato

- Crear `src/ui/feedback.tsx` y el sistema visual de `src/app/globals.css`: avisos, badges, carga, botones, formularios, listas, tarjetas y foco accesible.
- Modificar sólo la presentación de `/login`, `/employee`, `/employee/history`, `/employee/corrections`, `/admin`, `/admin/people` y `/admin/corrections`; no se incorpora la exportación visible, que pertenece a S16 tras S15.
- Validar fichaje, corrección, aprobación/rechazo, historial y navegación por teclado con pruebas de presentación más la regresión existente. Los viewports objetivo son 320, 390, 768 y 1280 px.
- Riesgo de regresión: componentes cliente compartidos y CSS global. Mitigación: no se cambian peticiones, endpoints, permisos, modelos ni claves de idempotencia; se verificará por pruebas y build. Cualquier problema persistente de arranque Compose se deriva a S12/S15.

## Criterios de aceptación

- Fichaje, historial, corrección, decisión y exportación conservan la misma petición autorizada, semántica e idempotencia que antes.
- Ningún listado visible presenta UUID como etiqueta principal; el identificador sigue disponible en detalle técnico/auditoría cuando sea necesario.
- Todas las acciones críticas muestran estado de carga, éxito y error recuperable; un error no induce a repetir un fichaje confirmado.
- Navegación por teclado, foco visible, nombres accesibles, mensajes de estado anunciables y contraste AA verificados manualmente; sin depender sólo de color.
- Los cuatro tamaños definidos no producen scroll horizontal, controles inaccesibles ni truncado de acciones esenciales.
- Pruebas de componentes/rutas y recorrido humano de empleado, responsable y administrador completados con datos sintéticos.

## Pruebas necesarias

Pruebas de regresión de S4–S9, pruebas de render/navegación de componentes, inspección de árbol accesible, teclado, lector de pantalla, contraste, zoom y capturas comparativas móvil/escritorio. Datos exclusivamente sintéticos; QR físico corresponde a S15.

## Resultado de implementación — 11/09/2026

Se aplicó el sistema mínimo en `src/app/globals.css` y `src/ui/feedback.tsx`, y se sustituyeron las presentaciones de empleado y revisión de correcciones para consumirlo. Los componentes reutilizables son `StatusNotice`, `StatusBadge` y `LoadingBlock`. Las rutas consumen las mismas APIs, clave de idempotencia y autorizaciones de S4–S8: no hay migraciones, cambios de modelos, RBAC, cálculos, auditoría ni exportación visible.

- **Fichaje:** la acción siguiente se separa del historial, explica el bloqueo durante la petición y anuncia confirmación o error. El doble clic sigue protegido por el mismo bloqueo de cliente y la misma clave/semántica idempotente de S4.
- **Historial y cálculo:** la diferencia se denomina «registrada» e informativa; regla, algoritmo e IDs quedan en un desplegable técnico secundario para no ocultar trazabilidad.
- **Correcciones:** el formulario explica que crea una propuesta aditiva, asocia la ayuda al campo y muestra estados textuales además de color. La revisión advierte de la decisión humana y no editable, bloquea ambos botones durante el envío y conserva referencias técnicas en detalle.
- **Responsive y accesibilidad:** foco visible de alto contraste, controles de al menos 44 px, aviso `alert/status`, carga anunciable, etiquetas asociadas y punto de ruptura para 320 px. La CSS cubre además 540/700 px y escritorio fluido; la validación humana con lector de pantalla y zoom 200 % permanece en S15.

### Validación posterior

- `docker compose --env-file .s13.synthetic.env run --rm --no-deps app npm test`: **69/69**, 24 ficheros correctos, incluidos tres casos nuevos S14.
- `docker compose --env-file .s13.synthetic.env run --rm --no-deps app npx tsc --noEmit`: correcto.
- `docker compose --env-file .s13.synthetic.env up -d --build`: build de producción correcto. Conserva los cuatro avisos conocidos S9 de acceso dinámico a ficheros de exportación.
- No fue posible repetir el recorrido visual HTTP: Docker informó que el puerto `3013` ya estaba ocupado por un proceso ajeno y no se detuvo ni alteró ese proceso. Es un bloqueo local de evidencia, no un cambio funcional de S14.

### Riesgos y bloqueos restantes

- Recorrido E2E visual adicional sobre una instancia S14 aislada (puerto 3015, dataset office sintético): se verificaron login/MFA, jornada, historial, correcciones, validación nativa, foco y vistas móvil 320 px. Se corrigieron scroll horizontal, navegación móvil y orientación de responsable sin ficha; la ruta de administración sigue autorizada exclusivamente en servidor.

- Pendiente S15: lector de pantalla humano, contraste auditado con herramienta, zoom 200 %, QR físico y aceptación de usuarios. S14 no debe presentarlos como verificados automáticamente.
- Pendiente S16: configuración y exportación guiadas. No se añadió un botón de exportación porque depende de su contrato y del cierre de retención/almacenamiento de S15.
- Mantiene NO-GO para datos reales de S13-005/S15; el cambio visual no modifica ese dictamen.

## Decisiones que requieren aprobación

1. Aceptar tamaño M y el cambio visual transversal antes de abrir S16.
2. Confirmar si la UI debe sustituir por completo las etiquetas técnicas o mostrar un enlace de detalle técnico para responsables.
3. Confirmar que S14 no añade reglas de negocio aunque revele fricciones que deban derivarse a una sesión posterior.
