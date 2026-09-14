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

**Resultado:** no se autoriza ubicación real ni se mueve la HU-TC-022 a desarrollo. Un posible contrato de implementación sólo podrá abrirse tras una EIPD preventiva y dictamen conjunto DPO/laboral.

La opción a evaluar es una única muestra iniciada inequívocamente por la persona al comienzo o fin de jornada, en primer plano. La alternativa preferente es confirmar presencia en un área autorizada o descartar la coordenada tras validarla y conservar únicamente el resultado mínimo que DPO/laboral aprueben. Debe existir un método equivalente sin ubicación que no produzca perjuicio laboral.

Antes de datos reales, PO, DPO y asesoría laboral deben decidir: población/puestos donde es necesaria; por qué no basta un medio menos invasivo; precisión, conservación, RBAC/destinatarios y proveedores; información y consulta de representación de trabajadores cuando corresponda; corrección/impugnación humana; y prohibición de todo uso disciplinario, analítico o secundario. La interfaz/API futura deberá rechazar intervalos, segundo plano, rutas, historial y geovallas.

## Registro de discovery — #44, diferenciación competitiva

| Candidata | Valor y segmento | Riesgo / dependencia | Decisión recomendada |
|---|---|---|---|
| Jornada y turnos visibles read-only | Claridad para la persona empleada sin depender de soporte. | Medio; S3, vigencias, accesibilidad y copy no laboral. | **Priorizar HU-TC-024 (#45)** como siguiente candidata única. |
| Geolocalización puntual | Movilidad justificada y acreditación del instante de fichaje. | Crítico; ADR-TC-022, DPO/laboral, EIPD y alternativa equivalente. | Mantener HU-TC-022 bloqueada por decisión. |
| Ausencias/permisos | Autonomía de la plantilla y trazabilidad de decisión. | Alto; nuevo modelo, privacidad laboral y políticas. | Mantener HU-TC-025 posterior. |
| Recordatorios/notificaciones | Reducir olvidos. | Medio; canal, consentimiento/expectativas y coste. | No priorizar ahora. |
| IA, productividad, nómina, biometría y vigilancia | Suites competitivas amplias. | Crítico; incompatibles con el producto acotado. | Mantener rechazadas. |

La diferenciación propuesta es una vista personal de «mi jornada»: previsto frente a registrado, discrepancias explicadas y acceso a corrección. No incluye optimización, asignación automática, geolocalización, IA, scoring ni cálculos de nómina.

## Decisiones pendientes del PO

1. Segmento inicial: movilidad real, teletrabajo o ambos; no se presupone que la función sea general.
2. Alternativa preferida: prueba de zona sin coordenada persistida, coordenada puntual minimizada o rechazo.
3. Tratamiento ante permiso denegado, precisión insuficiente o ausencia de dispositivo compatible.
4. Qué candidata competitiva, además de geolocalización, merece ser el siguiente incremento sintético.

## Fuentes de referencia

- La AEPD explica que la geolocalización laboral exige información clara, minimización y proporcionalidad, y que para registro horario no debe utilizarse para conocer la ubicación de la persona en todo momento: [La protección de datos en las relaciones laborales](https://www.aepd.es/sites/default/files/2021-05/la-proteccion-de-datos-en-las-relaciones-laborales.pdf).
- El Estatuto de los Trabajadores reconoce la intimidad frente a geolocalización en los términos de la normativa de protección de datos: [BOE, art. 20 bis](https://www.boe.es/biblioteca_juridica/abrir_pdf.php?id=PUB-PB-2026-143).
- JornAda y Sesame HR se usan sólo como referencias públicas de mercado, no como requisitos ni afirmaciones de cumplimiento: [JornAda](https://jorn-ada.com/funcionalidades), [Sesame HR](https://www.sesamehr.es/software-control-horario/).
