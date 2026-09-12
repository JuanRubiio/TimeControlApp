# S20 — Diseños de referencia para la capa visual

**Estado:** preparada; referencias visuales generadas, no autorizan implementación ni cambios funcionales. **Tamaño:** M de diseño/documentación. **Dependencias:** S14 como sistema visual implementado; consume los límites de S4–S9, S15 y S16. **Base:** `master` `2e22bfb`.

## Nombre y objetivo

Entregar diseños web de referencia coherentes para que las sesiones visuales y funcionales futuras compartan una dirección de interfaz: clara, fiable, accesible, responsive y respetuosa con la privacidad. Las referencias muestran cómo podrían componerse capacidades ya contratadas; el servidor, los contratos de dominio y las decisiones de producto siguen siendo la fuente de verdad.

## Entregable verificable

Una biblioteca visual inicial, acompañada de esta guía de uso:

| Referencia | Usuarios y flujos cubiertos | Archivo |
| --- | --- | --- |
| Administración y sistema visual | Responsable/RR. HH.: revisión de equipo, correcciones, filtros y estados transversales. | [administracion-y-sistema-visual.png](assets/s20-diseno-referencia/administracion-y-sistema-visual.png) |
| Empleado móvil y estados | Empleado: jornada, pausa manual, confirmación, historial, corrección, error/reintento y foco. | [empleado-movil-y-estados.png](assets/s20-diseno-referencia/empleado-movil-y-estados.png) |
| Configuración y exportación | Administrador: checklist guiado y exportación controlada, como orientación para S16. | [configuracion-y-exportacion.png](assets/s20-diseno-referencia/configuracion-y-exportacion.png) |

Las tres imágenes son referencias bitmap generadas para discusión. No son capturas del producto, no contienen datos reales y no son especificaciones pixel-perfect.

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

S20 sólo es propietaria de este contrato, los tres PNG y las referencias en `README.md`. Consume sin alterar S14 (presentación), S16 (configuración/exportación) y los contratos S4–S9. No afecta rutas, módulos, tablas, migraciones, RBAC, auditoría ni documentación de uso del producto.

## Dependencias y posibilidad de ejecución paralela

Puede prepararse y revisarse en paralelo con S15. S16 y sesiones posteriores pueden consumir estas referencias tras aprobar su propio contrato; S20 no bloquea el Go/No-Go ni altera el orden de S15. Si una sesión necesita componentes comunes, S14 conserva la propiedad de la fundación visual y debe acordar el cambio antes de editarla.

## Riesgos legales, técnicos y de integración

El principal riesgo es convertir una imagen persuasiva en una promesa funcional o legal. También puede haber regresión si se adopta una referencia sin responsive, accesibilidad, RBAC o contrato de datos. Mitigación: anotaciones de alcance, revisión de la sesión propietaria, datos sintéticos y pruebas funcionales/a11y de cada sesión consumidora. Los diseños no afirman cumplimiento normativo.

## Criterios de aceptación

- Las tres referencias son legibles y cubren empleado móvil, responsable/escritorio y administrador/configuración-exportación.
- Cada composición incluye estados de carga, vacío, error o confirmación donde resultan relevantes y foco visible como patrón transversal.
- La guía separa explícitamente visual de funcional; no incorpora una capacidad no contratada.
- Ninguna referencia muestra vigilancia, dato personal real, nómina, puntuación de productividad ni afirmación de cumplimiento automático.
- Una persona de producto, diseño y desarrollo puede identificar qué contrato autoriza cada flujo antes de implementarlo.

## Pruebas necesarias

Inspección visual de los tres PNG, revisión de enlaces y de alcance documental. Las sesiones que lleven una referencia a código deberán realizar sus propias pruebas de contraste, teclado, lector de pantalla, responsive, RBAC, regresión de API y datos sintéticos; S20 no las sustituye.

## Decisiones que requieren aprobación

1. Aprobar la dirección visual como referencia no vinculante, o indicar ajustes de marca/tono antes de consumirla.
2. Confirmar qué futuros contratos pueden usarla primero: S16, una evolución de S14 u otra sesión específica.
3. Mantener sin aprobación independiente cualquier funcionalidad sólo ilustrada (búsqueda, notificaciones, ayuda activa o métricas).
