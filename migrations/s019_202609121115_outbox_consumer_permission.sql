-- S19: el consumidor necesita bloquear de forma transaccional las filas que lee.
-- No concede mutación de eventos laborales ni altera el contenido del outbox.
GRANT UPDATE ON domain_event_outbox TO mvp_app;
