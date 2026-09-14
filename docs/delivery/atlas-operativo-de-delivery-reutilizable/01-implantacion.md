# 01 — Plan de implantación

## Fase 0: patrocinio y límites

Nombrar `[PO]`, responsable técnico, responsable de seguridad/privacidad y autoridad de entorno. Definir qué datos no pueden entrar al sistema de trabajo, qué acciones requieren aprobación y cuál es la fuente de verdad de código/documentación/estado.

**Salida:** decisión escrita y responsables. Sin ella no se configura un tablero.

## Fase 1: herramienta y estructura mínima

Evaluar Kanban/Issue tracker por coste total, privacidad, residencia, control de acceso, auditoría, exportación, API y relación con Git. Configurar sólo tras aprobación: tipos, campos, estados, WIP y permisos humanos. Mantener una sola fuente operativa de estado.

**Salida:** tablero vacío y plantillas; sin bots, webhooks, tokens o sincronización bidireccional.

## Fase 2: reglas, roles y puertas

Adoptar contratos breves de rol, Definition of Ready, Definition of Done, matriz de puertas, registro de decisiones/riesgos y protocolo de incidente. Registrar incompatibilidades: implementador no revisa solo su cambio crítico; agente no aprueba producción.

**Salida:** kit aprobado y versión inicial de reglas universales del repositorio, si son necesarias.

## Fase 3: discovery y backlog

El `[PO]` inicia manualmente una sesión de discovery con documentación/evidencia mínima y datos sintéticos. Producir 10–20 candidatas como máximo: problema, usuario, beneficio, prioridad, dependencia, exclusión, riesgo y decisión pendiente. Clasificar: obligatoria, valiosa, posterior, rechazada o pendiente.

**Salida:** backlog priorizado; ninguna candidata se implementa por el mero hecho de existir.

## Fase 4: piloto de proceso

Seleccionar 3–5 historias de tamaño pequeño/medio y riesgo controlado. Ejecutar el flujo completo, medir bloqueos y revisar si cada contrato de rol añade valor. No crear agentes persistentes hasta completar esta evidencia.

**Salida:** retrospectiva de proceso, simplificación de reglas y decisión de escalar o no.

## Fase 5: automatización opcional

Sólo tras ADR, prueba sintética, mínimo privilegio, propietario, auditoría, kill switch y autorización separada. La automatización puede sugerir o crear borradores; no debe aprobar, fusionar, desplegar ni mutar producción por defecto.
