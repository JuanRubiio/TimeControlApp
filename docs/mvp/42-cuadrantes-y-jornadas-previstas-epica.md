# E-TC-33 — Cuadrantes de turnos seguros y jornadas previstas

**Estado:** diseño de épica. La planificación es una referencia operativa futura; no altera fichajes, cálculo, correcciones, derechos laborales ni nómina. S15 conserva el NO-GO para datos reales.

## Decisión PO para el MVP

El **Responsable prepara** borradores sólo para relaciones vigentes de su centro. **Administración publica**, cancela o sustituye asignaciones futuras. La persona empleada ve únicamente su propia asignación publicada mediante una superficie separada. Esta segregación mantiene una revisión humana antes de hacer visible una planificación y evita que la rejilla se convierta en un mecanismo de control laboral.

No hay publicación automática, arrastrar y soltar obligatorio, resolución de solapes, rellenado de fichajes, cálculo de saldo, interpretación de convenio ni indicadores de productividad.

## Demostración de valor

La demo presenta un ciclo completo y explicable:

1. Administración crea una versión de plantilla reutilizable y publicada.
2. Un Responsable prepara un borrador para una relación vigente de su centro y una semana futura.
3. Administración revisa el intervalo y publica o devuelve el borrador; un conflicto requiere una nueva decisión humana.
4. El Responsable consulta el cuadrante semanal de su centro con estados textuales.
5. La persona empleada consulta sólo su planificación publicada, claramente diferenciada de la jornada registrada.

Una asignación publicada conserva una instantánea de la plantilla, zona IANA, segmentos y minutos previstos. Modificar una plantilla futura no cambia una asignación anterior; cancelar o sustituir conserva motivo-código y correlación.

## Entregas de la épica

| Tramo | Propietario | Valor y límite |
| --- | --- | --- |
| Fundamento de plantillas y asignaciones | Administración | Versiones inmutables, intervalos semiabiertos y conflictos explícitos; no toca `RuleResolver` ni S5. |
| Borrador por centro | Responsable | Propone para relaciones vigentes de su centro; no publica ni puede actuar fuera de ámbito. |
| Revisión y publicación | Administración | Publica, cancela o sustituye sólo futuro; no reescribe planificación pasada. |
| Cuadrante de consulta | Responsable | Tabla semántica y alternativa lineal por semana/centro; no edita desde la cuadrícula. |
| Vista propia publicada | Empleado | Referencia informativa propia; no muestra equipo, cobertura, fichajes ni balance. |
| Balance informativo | Empleado, opcional | Lectura propia de días no en curso, fuera de la ruta crítica del cuadrante. |

Cada tramo será una historia de implementación propia; no se habilita el siguiente por la mera existencia del diseño.

## Fronteras de dominio

- `shift_planning` se activa conforme a ADR-0008 y usa un puerto explícito de planificación; no accede a tablas internas de S3, S5, S6 o S23.
- S3 conserva turnos, calendario, zona IANA y reglas; una asignación no se convierte en fuente de cálculo sin enmienda explícita de S3/S5.
- S5 conserva el cálculo versionado y S6 las correcciones; ninguna publicación actualiza un fichaje ni corrige una jornada.
- El servidor resuelve sesión, centro, relación, plantilla, semana e instante de referencia. El navegador nunca es autoridad para `employeeId`, empresa, centro, rol o ámbito.

## Experiencia, seguridad y privacidad

El cuadrante comunica `Borrador`, `Publicado`, `Conflicto` y `Sin asignación` con texto además de color. En escritorio utiliza tabla con cabeceras semánticas; en móvil y lector de pantalla ofrece una alternativa lineal equivalente. Mantiene centro, semana, foco y contenido confirmado durante actualizaciones; no hace polling ni genera alertas.

Los datos mínimos son nombre laboral, semana, estado, plantilla/intervalo publicado y centro autorizado. Quedan excluidos ubicación, disponibilidad, ausencias, saldo, productividad, rendimiento, nómina, motivos personales y datos de otros centros. Un conflicto muestra sólo el mínimo permitido al actor y nunca se resuelve de forma automática.

## Puertas de implementación

1. Asesoría laboral valida que el copy presenta una referencia y no una orden, derecho, bolsa, nómina o decisión disciplinaria.
2. Arquitectura y S3/S5 acuerdan el puerto de lectura y confirman que ninguna asignación modifica fuente ni cálculo.
3. DPO/seguridad valida minimización, auditoría, retención de instantáneas y autorización por centro.
4. UX y QA validan tabla/alternativa lineal, foco, teclado, lector de pantalla, intervalos, DST/medianoche, vacío, conflicto, sesión y E2E multicíentro exclusivamente sintético.

## Referencias

Esta épica coordina sin sustituir [plantillas e instantáneas](35-plantillas-turno-y-asignaciones-versionadas.md), [cuadrante accesible](36-cuadrante-semanal-accesible-diseno.md) y [balance informativo opcional](37-balance-horas-informativo-diseno.md).
