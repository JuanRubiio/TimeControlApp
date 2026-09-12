-- S19: cursor aditivo para materialización asíncrona; nunca modifica evidencia S4.
CREATE TABLE IF NOT EXISTS time_calculation_outbox_consumptions (
  outbox_id uuid PRIMARY KEY REFERENCES domain_event_outbox(id),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  processed_at timestamptz,
  last_error_code text,
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS time_calculation_outbox_due ON time_calculation_outbox_consumptions(next_attempt_at) WHERE processed_at IS NULL;
GRANT SELECT, INSERT, UPDATE ON time_calculation_outbox_consumptions TO mvp_app;
