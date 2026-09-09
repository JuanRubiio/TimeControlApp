# S4 — Fichaje de entrada, salida y pausas

**Objetivo:** registrar eventos diarios fiables y no invasivos. **Tamaño:** L. **Ejecución:** paralela tras S1.

## Alcance

Propietaria de `time-events`, API y UI/PWA de fichaje, QR dinámico y PIN de kiosco. Métodos aprobados: web responsive, QR y PIN. Incluye entrada, salida, inicio/fin de pausa, idempotencia, timestamps servidor/dispositivo y sincronización básica.

## Exclusiones

No GPS, biometría, reconocimiento facial, foto, vídeo, rastreo continuo ni app nativa.

## Entregable y aceptación

El sistema no sobrescribe eventos; rechaza secuencias imposibles o duplicados explicando el error; crea evento auditado con método y regla aplicable; funciona en móvil web. QR es dinámico y PIN no revela información sensible.

## Dependencias y validación

Depende de S1; consume interfaz de reglas de S3 mediante mock si hace falta. Bloquea S5–S7. Pruebas E2E de entrada/salida/pausas, dobles clics, medianoche, cambio horario, tenant y permisos. Riesgo: inconsistencia temporal o suplantación básica.
