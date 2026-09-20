# 01 — Plan de implantación

## Fase 0: patrocinio y límites

Nombrar `[PO]`, responsable técnico, responsable de seguridad/privacidad y autoridad de entorno. Definir qué datos no pueden entrar al sistema de trabajo, qué acciones requieren aprobación y cuál es la fuente de verdad de código/documentación/estado.

**Salida:** decisión escrita y responsables. Sin ella no se configura un tablero.

## Fase 1: GitHub Issues, Project y estructura mínima

Evaluar GitHub Issues y Projects (u otra combinación equivalente) por coste total, privacidad, residencia, control de acceso, auditoría, exportación, API y relación con Git. Configurar sólo tras aprobación: tipos, campos, estados, WIP y permisos humanos. Mantener una sola fuente operativa de estado.

Crear un Project con estos estados, sin saltos implícitos: `Intake`, `Refinamiento`, `Lista para desarrollo`, `En desarrollo`, `En revisión`, `Lista para merge`, `Merged`, `Desplegada` y `Cerrada`. Definir también `Bloqueada` como señal transversal (campo o etiqueta), con causa, propietario y siguiente revisión.

Configurar como mínimo los campos `Tipo`, `Prioridad`, `Tamaño`, `Riesgo`, `Dominio propietario`, `Decisión PO`, `Revisión técnica`, `QA/E2E`, `Seguridad/privacidad`, `Dependencia` y `Estado`. Usar etiquetas sólo como ayuda visual; los campos y enlaces son la trazabilidad operativa.

**Salida:** Project vacío, estados, campos, plantillas de Issue y PR; sin bots, webhooks, tokens o sincronización bidireccional.

## Fase 2: reglas, roles y puertas

Adoptar contratos breves de rol, Definition of Ready, Definition of Done, matriz de puertas, registro de decisiones/riesgos y protocolo de incidente. Registrar incompatibilidades: implementador no revisa solo su cambio crítico; agente no aprueba producción.

**Salida:** kit aprobado y versión inicial de reglas universales del repositorio, si son necesarias.

## Fase 3: discovery, Issues y backlog

El `[PO]` inicia manualmente una sesión de discovery con documentación/evidencia mínima y datos sintéticos. Crear 10–20 Issues candidatas como máximo: problema, usuario, beneficio, prioridad, dependencia, exclusión, riesgo y decisión pendiente. Añadirlas al Project en `Intake` y clasificar: obligatoria, valiosa, posterior, rechazada o pendiente.

**Salida:** backlog priorizado; ninguna candidata se implementa por el mero hecho de existir.

## Fase 4: piloto de proceso

Seleccionar 3–5 historias de tamaño pequeño/medio y riesgo controlado. Ejecutar el flujo completo: Issue, refinamiento, decisión PO, rama, PR, revisión, validación funcional/E2E y merge autorizado. Medir bloqueos y revisar si cada contrato de rol añade valor. No crear agentes persistentes hasta completar esta evidencia.

**Salida:** retrospectiva de proceso, simplificación de reglas y decisión de escalar o no.

## Fase 5: automatización opcional

Sólo tras ADR, prueba sintética, mínimo privilegio, propietario, auditoría, kill switch y autorización separada. La automatización puede sugerir o crear borradores; no debe aprobar, fusionar, desplegar ni mutar producción por defecto.
