# ADR-0006 — Puerta para geolocalización puntual laboral

**Estado:** aprobado para un piloto controlado el 14/09/2026, tras validación comunicada por DPO, asesoría laboral y EIPD. **Propietarios de la ejecución:** PO, DPO, asesoría laboral, seguridad y QA. **No es asesoramiento jurídico.**

## Contexto

La #42 evalúa si una comprobación puntual de localización puede ser necesaria para un segmento con movilidad real. El producto actual no solicita ni almacena geolocalización. Una capacidad comercial de terceros no acredita necesidad, proporcionalidad ni base para incorporarla.

La LOPDGDD exige información previa expresa, clara e inequívoca sobre estos dispositivos y los derechos aplicables; la AEPD recuerda que el registro de jornada no debe utilizarse para conocer la ubicación en todo momento y que debe escogerse un medio menos invasivo cuando exista. El RGPD exige una EIPD previa cuando el tratamiento previsto probablemente entrañe alto riesgo. Estas referencias orientan el control, pero la aplicación no declara cumplimiento por sí misma: [LOPDGDD, art. 90](https://www.boe.es/eli/es/lo/2018/12/05/3/con), [AEPD: relaciones laborales](https://www.aepd.es/documento/la-proteccion-de-datos-en-las-relaciones-laborales.pdf) y [RGPD, art. 35](https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679).

## Decisión

1. Se aprueba exclusivamente una verificación de ubicación **puntual**, iniciada de forma inequívoca por la persona al comenzar o finalizar la jornada y en primer plano. No se aprueba ninguna otra captura de ubicación.
2. La #43 queda desbloqueada para un contrato de implementación acotado. Antes de datos reales deberá concretar API, controles de servidor, modelo de dato mínimo, auditoría, pruebas negativas, migración, reversión y evidencias de QA.
3. El consentimiento o permiso técnico del navegador no es, por sí solo, una autorización laboral para tratar la localización. Debe acompañarse de la información laboral aprobada y de la política aplicable visible antes de fichar.
4. El resultado normal será una validación mínima frente a una zona autorizada; no se conservará la coordenada exacta salvo justificación específica, aprobada y documentada por DPO/laboral. Esta decisión no autoriza proveedores, finalidades ni conservaciones distintas.

## Puertas acumulativas

| Puerta | Evidencia mínima | Autoridad que confirma | Si falta |
|---|---|---|---|
| Necesidad de segmento | Puestos concretos, problema verificable y por qué web/QR/PIN no basta. | PO | Aprobada para el piloto; reabrir ante un segmento nuevo. |
| Alternativa menos invasiva | Comparativa documentada: fichaje manual/corrección, validación de zona sin coordenada persistida y ubicación puntual. | PO + DPO/laboral | Aprobada sólo con alternativa equivalente sin localización. |
| EIPD y encaje laboral | EIPD preventiva, base y finalidad concretas, proporcionalidad, consulta/representación cuando proceda e información previa. | DPO + asesoría laboral | Aprobada para el piloto; no ampliar finalidad. |
| Datos y ciclo de vida | Resultado de validación preferente, precisión, destinatarios/RBAC, proveedor/región, cifrado, retención mínima, borrado y canal de derechos/corrección. | DPO + seguridad/operación | No crear esquema ni proveedor. |
| Equidad y operación | Alternativa equivalente y no punitiva ante denegación, error, precisión insuficiente o ausencia de dispositivo; soporte y accesibilidad. | PO + UX + QA | No habilitar el flujo. |
| Contrato de implementación | API, servidor, pruebas negativas, auditoría minimizada, migración y plan de reversión revisados. | PO + arquitectura + seguridad + QA | No activar datos reales. |

## Límite máximo de una entrega futura

La entrega autorizada sólo podrá evaluar una muestra iniciada inequívocamente por la persona al inicio o fin de jornada, en primer plano y para la finalidad aprobada. Deberá conservar el resultado mínimo de una validación sobre una zona autorizada y descartar la coordenada; una coordenada puntual persistida requiere justificación específica adicional.

Quedan prohibidos incluso tras una futura autorización: seguimiento en segundo plano, intervalos, geovallas, rutas, historial, localización de pausas, alertas de movimiento, perfiles, ranking, uso disciplinario, uso para nómina, decisiones automáticas, cámara, biometría y reutilización secundaria.

## Política futura de método de fichaje por relación laboral

La empresa podrá necesitar métodos distintos para puestos de oficina, centro fijo o movilidad justificada. La configuración candidata no será global ni libre por defecto: un administrador autorizado configurará una **política de método de fichaje** sobre una relación laboral concreta, con fecha de vigencia, autor y motivo operativo minimizado. El responsable podrá consultar el efecto dentro de su centro, pero no asignar, ampliar ni eludir la política.

El catálogo futuro parte de `web`, `kiosco QR/PIN` y `verificación puntual de ubicación`. Esta última sólo podrá asignarla Administración a relaciones laborales incluidas en el piloto y con las puertas de este ADR cumplidas. La asignación debe conservar siempre un método equivalente sin localización y no podrá imponer una consecuencia automática por denegación de permiso, precisión insuficiente, fallo de red o dispositivo incompatible. Una excepción individual no puede contener ubicación, salud, motivo disciplinario ni texto libre laboral; sólo un código de necesidad aprobado y una vigencia revisable.

La entrega de la #43 deberá resolver en servidor la política efectiva por relación y fecha, registrar de forma append-only los cambios de configuración y presentar a la persona la política aplicable antes de fichar. El cliente no podrá activar GPS mediante un selector ni configurar zonas/coordenadas fuera del ámbito aprobado. La configuración de empresa es una medida de ámbito, no una sustitución de la evaluación de proporcionalidad.

## Referencias de mercado, no requisitos

Las páginas públicas de JornAda describen registro GPS al fichar y restricción de métodos por empleado; Sesame describe coordenadas en el momento de fichar, zonas y configuraciones por tipo de puesto; Woffu anuncia restricciones por dirección IP y geolocalización. Se usan para reconocer el patrón de configuración por contexto, no para copiar funcionalidad ni avalar sus afirmaciones: [JornAda](https://jorn-ada.com/functionalities/time-tracking), [Sesame](https://www.sesamehr.es/software-control-horario/) y [Woffu](https://woffu.com/es/precios-woffu/).

## Reglas de diseño del prototipo e implementación

El prototipo previo a datos reales sólo podrá usar fixtures de coordenadas inventadas y no invocará `navigator.geolocation`. La implementación posterior sólo podrá solicitar la ubicación en el evento de fichaje autorizado, y deberá ofrecer la alternativa sin localización en igualdad funcional. El servidor será la única autoridad del resultado; el cliente nunca declara cumplimiento ni infiere presencia por precisión, dispositivo o IP.

## Resultado y revisión

La salida actual es **habilitar la #43 para diseñar y probar el piloto bajo estos límites**. La activación con datos reales sólo ocurrirá tras el contrato de implementación y las puertas operativas pendientes. Cualquier cambio de riesgo, proveedor, finalidad, precisión o conservación reinicia la evaluación.
