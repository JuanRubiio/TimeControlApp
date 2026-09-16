# HU-TC-039 — Balance de horas cerradas e informativo

**Estado:** propuesta de diseño para PO, asesoría laboral, UX, privacidad y QA. **Issue:** [#87](https://github.com/JuanRubiio/TimeControlApp/issues/87). **Dependencias:** #83, #84, S5, S6, S18 y S19. No autoriza bolsa de horas, saldo exigible, compensación, cierre contable, nómina, ranking, alertas, exportación ni cambios de cálculo.

## Finalidad y decisión propuesta

El balance explica a una persona empleada, con lenguaje informativo, los minutos **registrados**, **previstos** y su **diferencia registrada** en días que ya no están en curso. Sirve para entender qué proyección existe y acceder a la corrección ya disponible cuando haya una incidencia; no determina deuda, derecho económico, productividad, cumplimiento de convenio ni consecuencia disciplinaria.

La recomendación para la primera entrega es **consulta exclusivamente propia**. Aunque un Responsable podría necesitar operar dentro de su ámbito, exponer el desglose individual de terceras personas aumenta la sensibilidad sin ser necesario para que la persona comprenda su registro. PO, privacidad y asesoría laboral deberán aprobar una historia separada si desean ese acceso de ámbito; ésta no habilita agregados ni detalle de equipo.

## Fuente y corte temporal

La vista futura consume sólo una lectura pública de S5, resuelta en servidor para la identidad propia y una fecha o periodo solicitado válidos. La lectura aporta por día: fecha laboral y zona IANA de presentación, minutos previstos, efectivos y de pausa ya calculados, diferencia registrada, incidencia mínima y versión/huella de cálculo para un detalle técnico secundario. No recibe `employeeId`, centro, empresa, zona ni instante de corte desde el navegador como autoridad.

Un día es consultable cuando su fecha laboral local es anterior a “hoy” resuelto por servidor; el día actual y cualquier fecha futura quedan fuera para no fabricar un déficit de una jornada abierta o aún no iniciada. “Cerrado” en esta interfaz significa “no está en curso”, no un cierre mensual, laboral o contable irreversible.

S5 sigue siendo propietaria de `daily_calculations`, versiones inmutables, regla y algoritmo. Si S6 aprueba una corrección, mantiene la evidencia original y solicita el recálculo versionado existente: una lectura posterior puede reflejar la nueva proyección y explica que fue actualizada, sin reescribir el registro de fichaje ni convertir una corrección en saldo acumulado.

## Presentación propuesta

1. **Cabecera breve.** “Balance informativo” y el periodo seleccionado, con el aviso permanente: “No es nómina, bolsa de horas ni una decisión disciplinaria”.
2. **Resumen de periodo.** Muestra días con cálculo disponible y los totales de previsto, registrado y diferencia registrada. Sólo suma días incluidos con proyección; no transforma ausencia de fuente en cero ni completa jornadas abiertas.
3. **Desglose diario.** Lista o tabla semántica con fecha, previsto, registrado, diferencia e incidencia. Un estado `Sin cálculo disponible` se mantiene separado de un cero y ofrece el enlace de corrección sólo cuando la autorización existente lo permita.
4. **Explicación opcional.** Un detalle secundario explica fuente, versión, fecha de recálculo, zona y qué significa la diferencia. No muestra IDs, eventos, motivos de corrección, datos de dispositivo ni información de otras personas.
5. **Cambio de periodo.** Controles de mes/intervalo anterior y siguiente etiquetados, con un límite máximo acordado por PO. La vista conserva periodo, foco y datos confirmados mientras se actualiza.

Las etiquetas de estado incluyen texto: `Calculado`, `Actualizado tras corrección`, `Incidencia pendiente`, `Sin cálculo disponible` y `Sin datos para el periodo`. Color, icono y posición nunca son la única señal. Todos los contadores se expresan como duración legible, no como puntuación, porcentaje de cumplimiento o semáforo de rendimiento.

## Estados, errores y accesibilidad

| Situación | Respuesta |
| --- | --- |
| Carga inicial | Esqueletos breves de resumen y desglose; el título y el contexto no se desmontan. |
| Actualización de periodo | Se conserva contenido confirmado, foco y selección; sólo el bloque afectado anuncia actualización. No se usa una pantalla de “recargando”. |
| Sin proyecciones | “No hay cálculos disponibles para este periodo”; no se deduce ausencia, incumplimiento ni cero minutos. |
| Incidencia | Se explica como registro que puede requerir revisión, sin juicio ni diagnóstico laboral. |
| Error recuperable | Mensaje y reintento explícito del catálogo UI sin cambiar el periodo. |
| Sesión expirada o denegación | Respuesta genérica y retorno seguro sin enumerar cálculos o datos personales. |

El desglose usa cabeceras de tabla reales en escritorio y una alternativa lineal equivalente en móvil o lector de pantalla. El orden de foco es cabecera, periodo, resumen, detalle y explicación; los detalles se abren con teclado y devuelven el foco a su activador. Se prueba en 320, 390, 768 y 1280 px empleando los tamaños, separación, foco y botones del catálogo UX/UI.

## Autorización, auditoría y privacidad

`informative_hour_balance` debe estar activo conforme al ADR-0008 y el servidor resuelve sesión, relación vigente y pertenencia antes de la lectura. Una URL directa, módulo inactivo o parámetro ajeno devuelve la denegación genérica. El cliente no filtra datos para aplicar seguridad.

La consulta no genera perfilado ni telemetría de productividad. Si se audita por motivo de seguridad, el evento mínimo contiene actor, tipo de consulta, periodo y resultado técnico, sin minutos, diferencia, incidencias, ubicación, motivos ni contenido de pantalla. No se crean exportaciones, avisos o listas para responsables.

## Pruebas futuras y criterios de salida

La futura historia de implementación deberá cubrir lectura propia, aislamiento entre personas, módulo desactivado, URL directa, hoy/futuro excluidos, zona IANA, medianoche/DST, ausencia de cálculo distinta de cero, corrección S6 y nueva versión S5, error/reintento, sesión expirada, teclado, lector de pantalla y los cuatro anchos.

1. PO aprueba la primera entrega sólo propia y el máximo de periodo consultable.
2. Asesoría laboral aprueba el copy que niega bolsa, deuda, nómina y decisión disciplinaria.
3. S5/S6 confirman el sobre mínimo de lectura versionada; no se accede a tablas internas desde una pantalla nueva.
4. Privacidad, UX y QA validan minimización, estados, alternativa lineal y pruebas antes de abrir implementación.

## Alternativas descartadas

- **Bolsa acumulada o saldo exigible:** requeriría reglas de compensación, redondeo y un acuerdo laboral que no existen.
- **Incluir hoy como déficit provisional:** presenta una jornada abierta como incumplimiento ficticio.
- **Panel de equipo para Responsable desde la primera entrega:** amplía datos personales sin necesidad para la comprensión propia.
- **Recalcular o reparar durante un `GET`:** altera una lectura informativa y rompe la responsabilidad versionada de S5/S6.
