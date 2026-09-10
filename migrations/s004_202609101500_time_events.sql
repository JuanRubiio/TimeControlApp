-- S4: evidencia de fichaje inmutable y credenciales de kiosco por entorno dedicado.
CREATE TABLE IF NOT EXISTS time_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  employment_id uuid NOT NULL REFERENCES employments(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  rule_version_id uuid NOT NULL REFERENCES rule_versions(id),
  event_type text NOT NULL CHECK (event_type IN ('clock_in','clock_out','break_start','break_end')),
  method text NOT NULL CHECK (method IN ('web','kiosk_qr','kiosk_pin')),
  occurred_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  device_occurred_at timestamptz,
  effective_time_zone text NOT NULL,
  labor_date date NOT NULL,
  kiosk_session_id uuid,
  created_by_user_id uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((method = 'web' AND kiosk_session_id IS NULL AND created_by_user_id IS NOT NULL)
      OR (method IN ('kiosk_qr','kiosk_pin') AND kiosk_session_id IS NOT NULL AND created_by_user_id IS NULL))
);
CREATE INDEX IF NOT EXISTS time_events_employee_order ON time_events(employee_id, recorded_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS time_events_site_labor_date ON time_events(site_id, labor_date, recorded_at);

CREATE TABLE IF NOT EXISTS time_event_idempotency (
  employee_id uuid NOT NULL REFERENCES employees(id),
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 16 AND 200),
  request_fingerprint text NOT NULL,
  event_id uuid NOT NULL REFERENCES time_events(id),
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (employee_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS domain_event_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  payload jsonb NOT NULL,
  correlation_id uuid NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  dispatched_at timestamptz
);
CREATE INDEX IF NOT EXISTS domain_event_outbox_pending ON domain_event_outbox(occurred_at) WHERE dispatched_at IS NULL;

CREATE TABLE IF NOT EXISTS kiosk_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id),
  public_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','closed')),
  expires_at timestamptz NOT NULL,
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((status = 'active' AND closed_at IS NULL) OR (status = 'closed' AND closed_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS kiosk_sessions_active ON kiosk_sessions(public_id, expires_at) WHERE status='active';

CREATE TABLE IF NOT EXISTS kiosk_qr_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kiosk_session_id uuid NOT NULL REFERENCES kiosk_sessions(id),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS employee_kiosk_pins (
  employee_id uuid PRIMARY KEY REFERENCES employees(id),
  lookup_hmac text NOT NULL UNIQUE,
  pin_hash text NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0 CHECK (failed_attempts >= 0),
  locked_until timestamptz,
  rotated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_by_user_id uuid NOT NULL REFERENCES users(id)
);

ALTER TABLE time_events ADD CONSTRAINT time_events_kiosk_session_fk FOREIGN KEY (kiosk_session_id) REFERENCES kiosk_sessions(id);
GRANT SELECT, INSERT ON time_events, time_event_idempotency, domain_event_outbox, kiosk_sessions, kiosk_qr_challenges, employee_kiosk_pins TO mvp_app;
GRANT UPDATE ON kiosk_sessions, kiosk_qr_challenges, employee_kiosk_pins TO mvp_app;

INSERT INTO permissions(code, description) VALUES ('time-event.kiosk.manage','Administrar kioscos y PIN de fichaje') ON CONFLICT (code) DO NOTHING;
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code FROM roles r JOIN permissions p ON p.code='time-event.kiosk.manage' WHERE r.code='admin' ON CONFLICT DO NOTHING;
