# ADR-0006 — Puerta para geolocalización puntual laboral

**Estado:** aprobado como decisión de bloqueo el 14/09/2026. **Propietarios de la salida:** PO, DPO y asesoría laboral del cliente. **No es asesoramiento jurídico.**

## Contexto

La #42 evalúa si una comprobación puntual de localización puede ser necesaria para un segmento con movilidad real. El producto actual no solicita ni almacena geolocalización. Una capacidad comercial de terceros no acredita necesidad, proporcionalidad ni base para incorporarla.

La LOPDGDD exige información previa expresa, clara e inequívoca sobre estos dispositivos y los derechos aplicables; la AEPD recuerda que el registro de jornada no debe utilizarse para conocer la ubicación en todo momento y que debe escogerse un medio menos invasivo cuando exista. El RGPD exige una EIPD previa cuando el tratamiento previsto probablemente entrañe alto riesgo. Estas referencias orientan el control, pero la aplicación no declara cumplimiento por sí misma: [LOPDGDD, art. 90](https://www.boe.es/eli/es/lo/2018/12/05/3/con), [AEPD: relaciones laborales](https://www.aepd.es/documento/la-proteccion-de-datos-en-las-relaciones-laborales.pdf) y [RGPD, art. 35](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679).

## Decisión

1. Se rechaza por defecto la ubicación real, el permiso de geolocalización del navegador y cualquier SDK o proveedor de localización.
2. La #43 permanece bloqueada. No habrá ruta, tabla, permiso, auditoría con coordenadas, prueba de navegador ni cambio de fichaje hasta que se complete cada puerta de esta decisión.
3. El consentimiento o permiso técnico del navegador no es, por sí solo, una autorización laboral para tratar la localización.
4. Si se superan las puertas, se abrirá **otro** contrato de implementación, con una decisión PO explícita. No se reutiliza este ADR como autorización de entrega ni de datos reales.

## Puertas acumulativas

| Puerta | Evidencia mínima | Autoridad que confirma | Si falta |
|---|---|---|---|
| Necesidad de segmento | Puestos concretos, problema verificable y por qué web/QR/PIN no basta. | PO | Rechazar o mantener investigación. |
| Alternativa menos invasiva | Comparativa documentada: fichaje manual/corrección, validación de zona sin coordenada persistida y ubicación puntual. | PO + DPO/laboral | No diseñar captura. |
| EIPD y encaje laboral | EIPD preventiva, base y finalidad concretas, proporcionalidad, consulta/representación cuando proceda e información previa. | DPO + asesoría laboral | No usar datos reales. |
| Datos y ciclo de vida | Dato exacto, precisión, destinatarios/RBAC, proveedor/región, cifrado, retención mínima, borrado y canal de derechos/corrección. | DPO + seguridad/operación | No crear esquema ni proveedor. |
| Equidad y operación | Alternativa equivalente y no punitiva ante denegación, error, precisión insuficiente o ausencia de dispositivo; soporte y accesibilidad. | PO + UX + QA | No habilitar el flujo. |
| Contrato de implementación | API, servidor, pruebas negativas, auditoría minimizada, migración y plan de reversión revisados. | PO + arquitectura + seguridad + QA | La #43 sigue bloqueada. |

## Límite máximo de una entrega futura

Una entrega futura sólo podría evaluar una muestra iniciada inequívocamente por la persona al inicio o fin de jornada, en primer plano y para una finalidad aprobada. Deberá preferir conservar el resultado mínimo de una validación sobre una zona autorizada y descartar la coordenada; una coordenada puntual persistida requiere justificación específica adicional.

Quedan prohibidos incluso tras una futura autorización: seguimiento en segundo plano, intervalos, geovallas, rutas, historial, localización de pausas, alertas de movimiento, perfiles, ranking, uso disciplinario, uso para nómina, decisiones automáticas, cámara, biometría y reutilización secundaria.

## Reglas de diseño para un futuro prototipo sintético

Un prototipo previo a datos reales sólo podrá usar fixtures de coordenadas inventadas y no invocará `navigator.geolocation`. Debe ofrecer la alternativa sin localización en igualdad funcional y explicar que no verifica una obligación laboral. El servidor será la única autoridad de cualquier resultado futuro; el cliente nunca declara cumplimiento ni infiere presencia por precisión, dispositivo o IP.

## Resultado y revisión

La salida actual es **mantener investigación bloqueada**. Se revisará únicamente si PO, DPO y asesoría laboral aportan la evidencia de las puertas anteriores para un cliente y segmento concretos. Cualquier cambio de riesgo, proveedor, finalidad, precisión o conservación reinicia la evaluación.

