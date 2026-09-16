# HU-TC-043 — Revisión UX/UI de Configuración

## Diagnóstico

La pantalla actual organiza nueve formularios por bloques semánticos, pero mantiene todos los formularios expandidos. En escritorio la cuadrícula reduce altura en algunos grupos; en móvil pasa a una única columna, por lo que el usuario debe recorrer todos los pasos para localizar uno concreto. La dependencia entre pasos queda en el orden visual, no en una navegación persistente.

## Propuesta

Mantener una única ruta `/admin/configuration` y sus APIs, pero dividir la experiencia en cuatro áreas navegables:

1. **Resumen**: progreso confirmado por API, pendientes y accesos a cada área.
2. **Organización**: Empresa y Centro.
3. **Equipo y fichaje**: Persona, Relación laboral, Zona autorizada y Política de fichaje.
4. **Jornada**: Calendario, Turno, Regla y Vigencia.

En escritorio, un índice lateral adhesivo mostrará el área activa, el progreso y los pendientes. En móvil, el mismo índice será un control compacto al inicio de la pantalla; cada área funcionará como sección desplegable, conservando visibles su título, estado y la acción para abrirla.

Dentro de un área, sólo se expandirá por defecto el siguiente paso pendiente. Los formularios ya satisfechos se presentan como resumen read-only con la acción explícita de editar; no se ocultan los errores ni los estados confirmados por API.

## Reglas de interacción

- No cambiar rutas, contratos API, auditoría, RBAC, validaciones ni orden lógico de creación.
- No inferir que un paso está listo desde el cliente: el resumen se alimenta de la respuesta confirmada por API.
- Zona autorizada conserva búsqueda explícita, clic/arrastre, radio y el aviso de privacidad. No hay geolocalización continua, coordenadas de personas ni datos reales.
- Al guardar, el foco va al aviso de resultado; si se habilita un paso dependiente, se anuncia sin desplazar inesperadamente.

## Accesibilidad y responsive

- Índice como `nav` con enlaces a encabezados de área; el área activa se expone con `aria-current`.
- Desplegables mediante `button` nativo con `aria-expanded` y `aria-controls`; no ocultar controles con foco.
- Mantener orden DOM y de tabulación igual al orden de dependencia.
- Validar a 320, 390, 768 y 1280 px: sin desbordamiento horizontal, objetivos táctiles de al menos 44 px, foco visible y textos de ayuda asociados.
- Los resúmenes no deben depender sólo de color; usar texto de estado y estructura semántica.

## Decisión de producto solicitada

Adoptar esta arquitectura de cuatro áreas y divulgación progresiva antes de abrir una historia de implementación. La implementación debe dividirse en una historia técnica posterior y conservar las garantías de privacidad del piloto.
