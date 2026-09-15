# S22 — Fichaje geolocalizado puntual y diferenciación competitiva

**Estado:** discovery aprobado por PO; sin implementación ni captura de ubicación real. **Tamaño:** M de producto, privacidad, UX y contratos. **Dependencias:** S4, S7, S10, S11, S17, S20 y revisión humana de DPO/laboral. **Relación con piloto:** sólo escenarios sintéticos mientras S15 permanezca aplazado; no elimina el NO-GO para datos reales.

## Objetivo

Evaluar un método adicional de fichaje por geolocalización puntual para personas que trabajan fuera de un centro fijo, y transformar las referencias competitivas en hipótesis priorizadas. El objetivo no es vigilar presencia ni copiar una suite de RR. HH.; es decidir si una verificación puntual, mínima y comprensible aporta valor demostrable.

## Alcance de discovery

- Analizar una interacción web iniciada explícitamente por la persona al registrar entrada o salida; la ubicación no se solicita al cargar la aplicación ni se recoge entre eventos.
- Diseñar dos alternativas para decisión posterior: comprobación de centro/zona autorizada sin conservar coordenada precisa, o marca puntual con precisión/retención estrictamente justificadas.
- Definir la experiencia de permiso, denegación, precisión insuficiente, modo sin ubicación, corrección y transparencia para empleado y responsable.
- Comparar hipótesis de usuario de JornAda, Sesame HR y otras soluciones públicas: fichaje móvil/puntual, calendario de jornada, turnos visibles, ausencias, contexto de revisión y ayuda. La comparación no aprueba ninguna función.
- Crear una matriz de diferenciación: problema, segmento, evidencia, invasividad, coste, dependencia, alternativa menos intrusiva y decisión PO.

## Exclusiones no negociables

- Sin seguimiento continuo, segundo plano, historial de rutas, geovallas, alertas de movimiento, scoring, productividad, vigilancia, reconocimiento facial, biometría, cámara, fotografía o vídeo.
- Sin datos reales, coordenadas reales, permisos de ubicación del navegador, app nativa, hardware, SDK externo, proveedor, integración, notificación, automatización o despliegue.
- Sin usar ubicación para nómina, sanción, evaluación de desempeño, ranking, decisiones automáticas, control de pausas o interpretar convenios.
- Sin modificar S4/S5, eventos, cálculos, RBAC, auditoría, exportaciones, retención o contratos existentes durante el discovery.

## Guardarraíles de privacidad y laboral

1. La persona trabajadora y su representación, cuando corresponda, deberán recibir información previa, expresa, clara e inequívoca sobre finalidad, funcionamiento, datos, conservación y derechos.
2. La base jurídica, necesidad, proporcionalidad, alternativa menos invasiva, evaluación de impacto y retención serán validadas por DPO y asesoría laboral antes de datos reales. El permiso técnico del navegador no es por sí mismo una base jurídica laboral.
3. Si se aprobara una entrega futura, la localización sólo se asociaría al instante de fichaje permitido y para la finalidad aprobada; no se reutilizaría para conocer la ubicación en cada momento.
4. La persona podrá conocer qué se intentó recoger, el resultado y el canal de corrección; una denegación o precisión insuficiente tendrá una alternativa no punitiva definida por PO/laboral.

## Criterios de salida del discovery

- Existe problema demostrable por segmento y comparación con método menos invasivo.
- Hay ficha de diseño accesible para permiso, éxito, error, precisión insuficiente y alternativa manual.
- DPO/laboral emiten una decisión sobre base, información, proporcionalidad, retención, DPIA si procede y papel de la representación de trabajadores.
- El PO decide una de tres salidas: rechazar, mantener como investigación o aprobar un contrato de implementación independiente y limitado.
- El backlog competitivo queda clasificado en: ampliar antes de piloto sintético, posterior a piloto, rechazado o pendiente de decisión.

## Riesgos

El riesgo principal es transformar un fichaje puntual en monitorización laboral. También existen riesgos de acceso indebido, precisión engañosa, discriminación de personas sin dispositivo compatible, coste de soporte y promesas normativas impropias. La mitigación es minimización por diseño, alternativa no intrusiva, autorización de servidor, fixtures sintéticos, pruebas de aislamiento y puertas humanas antes de cualquier dato real.

## Registro de discovery — #42, geolocalización puntual

**Resultado:** no se autoriza ubicación real ni se mueve la HU-TC-022 a desarrollo. La puerta vinculante está en [ADR-0006](adr-0006-geolocalizacion-puntual.md): un posible contrato de implementación sólo podrá abrirse tras una EIPD preventiva y dictamen conjunto DPO/laboral.

La opción a evaluar es una única muestra iniciada inequívocamente por la persona al comienzo o fin de jornada, en primer plano. La alternativa preferente es confirmar presencia en un área autorizada o descartar la coordenada tras validarla y conservar únicamente el resultado mínimo que DPO/laboral aprueben. Debe existir un método equivalente sin ubicación que no produzca perjuicio laboral.

Antes de datos reales, PO, DPO y asesoría laboral deben decidir: población/puestos donde es necesaria; por qué no basta un medio menos invasivo; precisión, conservación, RBAC/destinatarios y proveedores; información y consulta de representación de trabajadores cuando corresponda; corrección/impugnación humana; y prohibición de todo uso disciplinario, analítico o secundario. La interfaz/API futura deberá rechazar intervalos, segundo plano, rutas, historial y geovallas.

## Registro de discovery — #44, diferenciación competitiva

| Candidata | Valor y segmento | Riesgo / dependencia | Decisión recomendada |
|---|---|---|---|
| Jornada y turnos visibles read-only | Claridad para la persona empleada sin depender de soporte. | Medio; S3, vigencias, accesibilidad y copy no laboral. | **Priorizar HU-TC-024 (#45)** como siguiente candidata única. |
| Geolocalización puntual | Movilidad justificada y acreditación del instante de fichaje. | Crítico; ADR-TC-022, DPO/laboral, EIPD y alternativa equivalente. | Mantener HU-TC-022 bloqueada por decisión. |
| Ausencias/permisos | Autonomía de la plantilla y trazabilidad de decisión. | Alto; nuevo modelo, privacidad laboral y políticas. | **PO selecciona HU-TC-025 (#46) para discovery mínimo, sin implementación.** |
| Recordatorios/notificaciones | Reducir olvidos. | Medio; canal, consentimiento/expectativas y coste. | No priorizar ahora. |
| IA, productividad, nómina, biometría y vigilancia | Suites competitivas amplias. | Crítico; incompatibles con el producto acotado. | Mantener rechazadas. |

La diferenciación propuesta es una vista personal de «mi jornada»: previsto frente a registrado, discrepancias explicadas y acceso a corrección. La única excepción evaluada es la verificación puntual y transparente de entrada/salida bajo política autorizada; no incluye optimización, asignación automática, IA, scoring ni cálculos de nómina.

### Actualización de matriz — 15/09/2026

La revisión posterior a las entregas sintéticas no convierte la publicidad de la competencia en requisito. Sólo contrasta patrones públicos con el alcance ya validado y conserva el NO-GO de S15 para datos reales.

| Patrón público contrastado | Estado en TimeControl | Decisión y límite |
|---|---|---|
| Turnos, ausencias y distintos métodos de fichaje agrupados en una suite | La consulta de jornada/turno publicado está entregada en #45 y la solicitud con decisión humana en #46. | No ampliar a planificación, saldo automático, convenio, nómina ni aprobaciones automáticas. |
| Ubicación opcional en el instante del fichaje para equipos móviles | #43 entrega una política por relación laboral, zona autorizada y alternativa equivalente sin ubicación, sólo con escenarios sintéticos. | No persistir coordenadas de la persona, no pedir ubicación fuera de entrada/salida, ni usar geovallas, segundo plano o consecuencias automáticas. |
| Detección automática de oficina, salida automática, biometría, métricas de rendimiento o recordatorios multicanal | No forma parte de TimeControl. | Mantener rechazado: introduce vigilancia, presión laboral, automatización o datos que no son necesarios para validar el MVP. |
| Restricción configurable por persona o puesto | La política de fichaje por relación laboral ya cubre el caso proporcional de método y zona autorizada. | Sólo Administración la configura; Responsable consulta dentro de su ámbito; no se usa como regla disciplinaria. |

Las páginas públicas consultadas muestran que JornAda combina ubicación, métodos de fichaje, turnos y ausencias; Woffu declara una opción de ubicación en el momento del fichaje para movilidad; y Sesame anuncia detección de oficina, auto-checkout y biometría. Esos últimos automatismos se registran como **contra-patrones**, no como objetivos de producto: [JornAda](https://www.jorn-ada.com/funcionalidades/control-horario), [Woffu](https://woffu.com/es/control-horario-y-registro-de-la-jornada-laboral/), [Sesame HR](https://www.sesamehr.es/software-control-horario/).

**Recomendación de #44:** no abrir una cuarta funcionalidad de usuario por imitación. Primero debe revisarse en producto el comportamiento sintético ya entregado de #43, #45 y #46. La única candidata posterior que podría volver a discovery es un recordatorio estrictamente opcional, pero requiere antes decisión PO sobre canal, horario, presión laboral, alternativa de no uso y privacidad; no pasa a desarrollo con esta matriz.

## Decisiones pendientes del PO

1. Segmento inicial: movilidad real, teletrabajo o ambos; no se presupone que la función sea general.
2. Alternativa preferida: prueba de zona sin coordenada persistida, coordenada puntual minimizada o rechazo.
3. Tratamiento ante permiso denegado, precisión insuficiente o ausencia de dispositivo compatible.
4. ~~Qué candidata competitiva, además de geolocalización, merece ser el siguiente incremento sintético.~~ Resuelta el 14/09/2026: HU-TC-025 (#46), sólo discovery; véase S24.
5. **Pendiente de cierre de #44:** PO decide si la matriz queda cerrada tras la revisión de #43/#45/#46 o si autoriza únicamente el discovery de recordatorios opcionales bajo un contrato y evaluación UX/UI independientes.

## Fuentes de referencia

- La AEPD explica que la geolocalización laboral exige información clara, minimización y proporcionalidad, y que para registro horario no debe utilizarse para conocer la ubicación de la persona en todo momento: [La protección de datos en las relaciones laborales](https://www.aepd.es/sites/default/files/2021-05/la-proteccion-de-datos-en-las-relaciones-laborales.pdf).
- El Estatuto de los Trabajadores reconoce la intimidad frente a geolocalización en los términos de la normativa de protección de datos: [BOE, art. 20 bis](https://www.boe.es/biblioteca_juridica/abrir_pdf.php?id=PUB-PB-2026-143).
- JornAda y Sesame HR se usan sólo como referencias públicas de mercado, no como requisitos ni afirmaciones de cumplimiento: [JornAda](https://jorn-ada.com/funcionalidades), [Sesame HR](https://www.sesamehr.es/software-control-horario/).
