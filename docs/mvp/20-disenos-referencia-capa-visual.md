# S20 — Diseños de referencia para la capa visual

**Estado:** finalizada; las ocho referencias visuales están aprobadas como dirección no vinculante y no autorizan implementación ni cambios funcionales. **Tamaño:** M de diseño/documentación. **Dependencias:** S14 como sistema visual implementado; consume los límites de S4–S9, S15 y S16. **Base:** `master` `2e22bfb`.

## Nombre y objetivo

Entregar diseños web de referencia coherentes para que las sesiones visuales y funcionales futuras compartan una dirección de interfaz: clara, fiable, accesible, responsive y respetuosa con la privacidad. Las referencias muestran cómo podrían componerse capacidades ya contratadas; el servidor, los contratos de dominio y las decisiones de producto siguen siendo la fuente de verdad.

## Entregable verificable

Una biblioteca visual por rol y estado, acompañada de esta guía de uso:

| Referencia | Usuarios y flujos cubiertos | Archivo |
| --- | --- | --- |
| Administración y sistema visual | Responsable/RR. HH.: revisión de equipo, correcciones, filtros y estados transversales. | [administracion-y-sistema-visual.png](assets/s20-diseno-referencia/administracion-y-sistema-visual.png) |
| Empleado móvil y estados | Empleado: jornada, pausa manual, confirmación, historial, corrección, error/reintento y foco. | [empleado-movil-y-estados.png](assets/s20-diseno-referencia/empleado-movil-y-estados.png) |
| Configuración y exportación | Administrador: checklist guiado y exportación controlada, como orientación para S16. | [configuracion-y-exportacion.png](assets/s20-diseno-referencia/configuracion-y-exportacion.png) |
| Acceso, MFA y kiosco | Todos los usuarios: acceso, MFA, sesión caducada; kiosco: PIN/QR sin revelar datos personales. | [acceso-mfa-y-kiosco.png](assets/s20-diseno-referencia/acceso-mfa-y-kiosco.png) |
| Historial y corrección | Empleado: lista, detalle diario, solicitud y estados pendiente/aprobada/rechazada. | [historial-y-correccion-empleado.png](assets/s20-diseno-referencia/historial-y-correccion-empleado.png) |
| Revisión y decisión | Responsable/RR. HH.: bandeja, evidencia, rechazo motivado y confirmación de decisión. | [revision-y-decision-responsable.png](assets/s20-diseno-referencia/revision-y-decision-responsable.png) |
| Gestión administrativa | Administrador: personas, centros, relaciones, reglas, vigencias, validación y vacío. | [gestion-administracion.png](assets/s20-diseno-referencia/gestion-administracion.png) |
| Candidatas futuras | Producto/diseño: importación, ausencias, cierre y avisos como exploración no disponible. | [exploracion-funciones-futuras.png](assets/s20-diseno-referencia/exploracion-funciones-futuras.png) |

Las ocho imágenes son referencias bitmap generadas para discusión. No son capturas del producto, no contienen datos reales y no son especificaciones pixel-perfect.

## Inventario de cobertura por rol

| Rol/superficie | Referencias | Cobertura | Límite |
| --- | --- | --- | --- |
| Visitante no autenticado | Acceso, MFA y kiosco | Login, MFA, sesión vencida, error/espera y entrada pública de kiosco. | No hay recuperación de contraseña nueva ni registro público. |
| Empleado | Empleado móvil; historial y corrección | Jornada, pausa manual, confirmación, error/reintento, historial, detalle y corrección. | No muestra datos de terceros, nómina ni planificación. |
| Responsable | Administración; revisión y decisión | Resumen de ámbito, filtros, bandeja, evidencia, aprobación/rechazo. | No añade SLA, automatismo, reapertura ni lectura fuera de centro. |
| RR. HH. | Administración; revisión y decisión | Misma superficie visual que responsable, con permisos explícitos. | No se presume un rol ni permiso adicional. |
| Administrador | Configuración/exportación; gestión administrativa | Empresa, centros, personas, relaciones, regla/calendario, exportación y auditoría visual. | Las operaciones se condicionan a S16/S15 y a RBAC servidor. |
| Auditor/soporte temporal | Configuración/exportación | Referencia de lectura/exportación controlada. | No se diseña acceso permanente; requiere asignación temporal y auditada de S1/S9. |
| Kiosco compartido | Acceso, MFA y kiosco | PIN y QR opaco, validación y error seguro. | No revela identidad, PIN, ubicación, cámara o datos de jornada. |

No existe un «rol futuro» genérico que pueda diseñarse de forma responsable. Si un rol nuevo se propone, se abre primero su ficha de capacidad y se decide su necesidad, mínimos datos, RBAC, auditoría y límites de privacidad.

## Sistema transversal de referencia

| Capa | Decisión visual de referencia | Regla de uso |
| --- | --- | --- |
| Tono y jerarquía | Superficies claras, azul marino como ancla, turquesa para acción principal y semántica moderada. | El color nunca es el único portador de estado; evitar apariencia de control o vigilancia. |
| Tipografía | Sans legible, titulares claros, texto de apoyo sobrio y cifras tabulares donde ayuden a leer registros. | Mantener contraste AA y permitir zoom al 200 %. |
| Espaciado y densidad | Escala base de 8 px, tarjetas sobrias, zonas de toque amplias y agrupación por tarea. | En móvil se prioriza una acción de fichaje inequívoca; en escritorio, lectura y revisión. |
| Navegación | Encabezado estable, navegación lateral en escritorio y navegación compacta en móvil. | Sólo mostrar destinos para los que el rol esté autorizado; el enlace no sustituye RBAC de servidor. |
| Estados | Cargando, vacío, éxito, advertencia, error y reintento contextual. | No sugerir repetir un fichaje si la confirmación es incierta; preservar idempotencia S4. |
| Formularios | Etiquetas visibles, ayuda cercana, validación comprensible y foco marcado. | Errores vienen de los contratos de servidor; no inventar reglas de jornada en cliente. |
| Listas y tablas | Cabecera legible, estado con icono/texto, acciones claramente etiquetadas y detalle progresivo. | Los UUID/huellas quedan en vista técnica secundaria cuando sean necesarios para trazabilidad. |
| Privacidad y confianza | Copy breve de registro informativo, autorización y auditabilidad. | Nunca mostrar saldo/exceso como nómina, sanción, productividad o cumplimiento legal automático. |

## Alcance

- Definir referencias visuales de los flujos ya existentes: acceso, fichaje, pausa, historial, corrección, revisión, configuración y exportación.
- Incluir elementos transversales que una aplicación de este tipo necesita: navegación por rol, encabezado, componentes de acción, formularios, avisos, vacíos, carga, errores, confirmación, estados de sesión, tabla/lista, filtros existentes, ayuda contextual, foco visible y adaptación móvil/escritorio.
- Documentar límites para que las sesiones que consuman la biblioteca distingan presentación de nuevas capacidades.
- Conservar los PNG bajo `docs/mvp/assets/s20-diseno-referencia/`; se generaron con la herramienta integrada de imagen y no proceden de terceros.

## Exclusiones

S20 no crea rutas, componentes de producción, APIs, tablas, eventos, permisos, búsquedas, notificaciones, telemetría, métricas de productividad, calendario nuevo, lógica de exportación ni reglas de cálculo. No incluye GPS, biometría, cámara, fotografía, vídeo, vigilancia, app nativa, nómina, interpretación automática de convenios, dark patterns ni urgencia artificial.

## Protocolo obligatorio para capacidades futuras

Toda funcionalidad candidata —incluso si hoy está fuera de alcance— deberá tener una ficha de diseño específica **antes** de su revisión de alcance y, de nuevo, antes de cualquier implementación. La ficha no supone aprobación ni cambia el roadmap.

| Elemento obligatorio de la ficha | Pregunta que resuelve |
| --- | --- |
| Problema, evidencia y usuario/rol | ¿Qué necesidad comprobable resuelve y para quién? |
| Pantallas y estados | ¿Qué vista existe para inicio, carga, vacío, éxito, error, permiso denegado y recuperación? |
| Flujos responsive y accesibles | ¿Cómo se completa por teclado, lector de pantalla, móvil y escritorio? |
| Datos, privacidad y seguridad | ¿Qué datos mínimos usa, qué no recoge y qué autorización/auditoría requiere? |
| Límite de negocio | ¿Qué no calcula, decide, vigila o promete? |
| Dependencias y contrato técnico | ¿Qué sesión/API/tabla necesita y quién conserva la propiedad? |
| Criterios de aceptación visuales y funcionales | ¿Cómo se valida sin confundir la referencia con la entrega? |
| Decisión de alcance | ¿Se aprueba para el piloto, se aplaza o se rechaza? |

La [exploración de funciones futuras](assets/s20-diseno-referencia/exploracion-funciones-futuras.png) es una plantilla visual para las candidatas ya conocidas: importación controlada, ausencias, revisión de período y avisos. Todas permanecen **no disponibles** y requieren la ficha anterior, evidencia y decisión posterior al piloto. No se diseñan ni se aceptan por adelantado capacidades de vigilancia, biometría, geolocalización, nómina, cumplimiento automático ni planificación compleja.

## Control de alcance de las composiciones

Algunos recursos gráficos representan convenciones visuales habituales, no requisitos aprobados. Ninguna sesión puede implementarlos sólo porque aparezcan en una imagen.

| Elemento que aparece como referencia | Interpretación permitida | No autoriza |
| --- | --- | --- |
| Campo de búsqueda, campana o iconos auxiliares | Patrón de cabecera, densidad y estados. | Búsqueda global, notificaciones, alertas ni canales nuevos. |
| Resumen de equipo o tarjetas numéricas | Jerarquía de lectura para datos que S8 ya autorice. | Métricas de rendimiento, productividad o datos fuera de ámbito. |
| Checklist de configuración | Presentación candidata de las operaciones S2/S3 que S16 ya delimita. | Nuevas reglas, cambios retroactivos, importación o planificación compleja. |
| Exportación con vencimiento/traza | Composición candidata de la API S9, condicionada por S15/S16. | Descargar sin autorización, enlace público o cambiar retención. |
| Ayuda o enlaces de privacidad | Copy y ubicación visual. | Chatbot, formulario libre de soporte o captura de datos adicionales. |

## Dominios, rutas, módulos, tablas y documentación afectados

S20 sólo es propietaria de este contrato, los ocho PNG enumerados en el entregable y las referencias en `README.md`. Consume sin alterar S14 (presentación), S16 (configuración/exportación) y los contratos S4–S9. No afecta rutas, módulos, tablas, migraciones, RBAC, auditoría ni documentación de uso del producto.

## Dependencias y posibilidad de ejecución paralela

Puede prepararse y revisarse en paralelo con S15. S16 y sesiones posteriores pueden consumir estas referencias tras aprobar su propio contrato; S20 no bloquea el Go/No-Go ni altera el orden de S15. Si una sesión necesita componentes comunes, S14 conserva la propiedad de la fundación visual y debe acordar el cambio antes de editarla.

## Riesgos legales, técnicos y de integración

El principal riesgo es convertir una imagen persuasiva en una promesa funcional o legal. También puede haber regresión si se adopta una referencia sin responsive, accesibilidad, RBAC o contrato de datos. Mitigación: anotaciones de alcance, revisión de la sesión propietaria, datos sintéticos y pruebas funcionales/a11y de cada sesión consumidora. Los diseños no afirman cumplimiento normativo.

## Criterios de aceptación

- Las ocho referencias son legibles, están enlazadas desde este contrato y cubren los roles y límites descritos en el inventario. Las tres composiciones prioritarias de validación son empleado móvil, responsable/escritorio y administrador/configuración-exportación.
- Cada composición incluye estados de carga, vacío, error o confirmación donde resultan relevantes y foco visible como patrón transversal.
- La guía separa explícitamente visual de funcional; no incorpora una capacidad no contratada.
- Ninguna referencia muestra vigilancia, dato personal real, nómina, puntuación de productividad ni afirmación de cumplimiento automático.
- Una persona de producto, diseño y desarrollo puede identificar qué contrato autoriza cada flujo antes de implementarlo.

## Pruebas necesarias

Inspección visual de los ocho PNG —con revisión obligatoria de las tres composiciones prioritarias—, revisión de enlaces y de alcance documental. Las sesiones que lleven una referencia a código deberán realizar sus propias pruebas de contraste, teclado, lector de pantalla, responsive, RBAC, regresión de API y datos sintéticos; S20 no las sustituye.

## Decisiones que requieren aprobación

1. **Aprobada:** la dirección visual es una referencia no vinculante. Cada capacidad sigue requiriendo contrato, revisión de alcance y pruebas propias.
2. **Aprobada:** S16 será la primera consumidora. Puede preparar configuración con datos sintéticos y contratos existentes, pero no activar descarga visible hasta el cierre de almacenamiento, vencimiento y auditoría de S15.
3. Mantener sin aprobación independiente cualquier funcionalidad sólo ilustrada (búsqueda, notificaciones, ayuda activa o métricas).

## Cierre documental — 12/09/2026

- Alcance completado: ocho PNG de referencia bajo `assets/s20-diseno-referencia/`, protocolo de fichas futuras y límites de composición documentados; no se crearon rutas, componentes de producción, APIs, tablas, migraciones, permisos ni integraciones.
- Se resuelve el P3 documental: el contrato ya no alterna entre tres y ocho activos. Las ocho imágenes son el entregable; las tres composiciones prioritarias sólo delimitan la revisión visual mínima por rol y superficie.
- Validación: enlaces a los ocho PNG comprobados y revisión visual de las tres composiciones prioritarias. No aplica una suite de código porque S20 no altera software ni configuración.
- Riesgo vigente: ninguna imagen habilita búsqueda, notificaciones, ayuda activa, métricas, descargas públicas o cambios de reglas. S16 deberá registrar qué composición adopta y validar responsive, accesibilidad, RBAC y contratos de servidor con fixtures sintéticos.
- Bloqueo vigente: S15 continúa siendo la puerta para cualquier descarga visible, por sus requisitos de almacenamiento aislado, vencimiento, borrado controlado y auditoría.
