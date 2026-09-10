# S14 — Cierre de bloqueos de piloto y prueba E2E ejecutable

**Estado:** propuesta; requiere decisión del propietario del producto. **Estimación:** L (3–5 días de ingeniería más revisiones legal/operación). **Dependencias:** S1, S7, S11, S12 y aprobaciones S10.

## Problema e impacto

S13 no pudo ejecutar el MVP: Docker Desktop no estaba disponible y el host dispone de Node 18.12, inferior al mínimo. Además, el rol `employee` carece de permisos mínimos para fichar/consultar, la interfaz no presenta login/MFA/logout y el fixture no deja una historia E2E completa. Con datos reales, esto impediría el uso autónomo y dejaría sin evidencia controles críticos.

## Alcance propuesto

1. Proveer runner reproducible Node 20.19+ y Docker Desktop operativo, sin reutilizar datos o secretos de piloto.
2. Acordar explícitamente la matriz RBAC de `employee`; si se aprueba, añadir migración aditiva con permisos propios y pruebas de regresión/denegación.
3. Definir y entregar el acceso web de login, enrolamiento/verificación MFA y logout, o aprobar formalmente un acceso asistido alternativo. No se debe fingir ese flujo en la guía.
4. Extender sólo `tests/support/demo-fixtures.ts` y `scripts/seed-demo.ts` para dos entornos dedicados con eventos completos/incompletos, reintentos, pausas, correcciones pendientes/aprobadas/rechazadas, reglas versionadas, DST/medianoche y evidencia exportable.
5. Ejecutar y conservar evidencia de Compose limpio, health, migración, seed, E2E autenticado por rol, dos entornos aislados, CSV/PDF/hash/descarga, backup/restore y prueba negativa de entorno cruzado.
6. Configurar y probar proxy TLS, rate limit/WAF, retención/borrado de exportaciones y los controles S10 que el DPO y laboralista aprueben.

## Fuera de alcance

GPS, biometría, cámara, app nativa, conectores externos, cambios de convenio, multitenancy compartido y servicios de pago.

## Riesgo y decisión necesaria

Cambiar permisos o añadir UX de acceso afecta a seguridad y a la experiencia de todos los usuarios; la configuración legal/retención requiere validación profesional. El propietario debe aprobar: (a) permisos exactos de empleado, (b) si la autenticación se entrega en UI para el piloto, y (c) proveedor/operación, presupuesto y responsables de TLS, backups, DPA, DPO y asesoría laboral.
