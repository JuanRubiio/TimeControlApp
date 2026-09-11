# Propuesta sustituida — Operación segura y cierre externo de piloto

Este borrador queda sustituido por el contrato completo de [S15 — Cierre operativo y cumplimiento prepiloto](15-cierre-operativo-y-cumplimiento-prepiloto.md). Se conserva como antecedente de S13; no debe usarse para abrir una sesión nueva.

**Estado:** propuesta; requiere decisión del propietario del producto. **Estimación:** M de ingeniería/operación (2–4 días, sin incluir plazos de DPO, asesoría laboral o proveedor). **Dependencias:** S10, S12 y responsables de infraestructura.

## Problema e impacto

S13 completó los flujos automatizables en dos entornos sintéticos y el recorrido visual de empleado y responsable. Antes de cualquier piloto con datos reales aún no existe evidencia de restore en destino, TLS/proxy/WAF/rate limit reales, retención/borrado automatizado de exportaciones ni las aprobaciones de privacidad, laboral y operación. Esas carencias impiden un Go seguro aunque la aplicación local funcione.

## Alcance propuesto

1. Desplegar un entorno dedicado no productivo con TLS, proxy, rate limit/WAF, secretos y cifrado en reposo aprobados.
2. Ejecutar backup y restore aislados; documentar RPO/RTO, prueba de acceso cruzado negativa y rollback.
3. Implementar o configurar la tarea verificable de retención/borrado de exportaciones vencidas y conservar su evidencia de auditoría.
4. Obtener cierre de DPO/DPA, derechos, retención, gestión de incidentes y validación de calendario/convenio por asesoría laboral.
5. Realizar aceptación humana: lector de pantalla, kiosco/QR físico, red de piloto y recorridos de usuarios. Incluir las mejoras P2 de configuración/exportación guiada y etiquetas legibles en lugar de UUID si se aprueban.

## Fuera de alcance

GPS, biometría, cámara, app nativa, conectores externos, cambios de convenio, multitenancy compartido y servicios de pago.

## Riesgo y decisión necesaria

El propietario debe designar proveedor/operación y aprobar presupuesto, responsables y criterios de aceptación para TLS/WAF, backup/restore, retención y las validaciones DPO/laboralista. Hasta ese cierre, la decisión es **NO-GO para datos reales**.
