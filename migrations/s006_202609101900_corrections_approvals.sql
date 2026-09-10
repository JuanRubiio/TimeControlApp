-- S6: solicitudes y efectos aditivos. Nunca modifica time_events ni versiones S5.
CREATE TABLE IF NOT EXISTS correction_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  labor_date date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('time_event','calculation_incident')),
  time_event_id uuid REFERENCES time_events(id),
  daily_calculation_version_id uuid REFERENCES daily_calculation_versions(id),
  proposed_effect jsonb NOT NULL,
  reason text NOT NULL CHECK (char_length(btrim(reason)) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  requested_by_user_id uuid NOT NULL REFERENCES users(id),
  requested_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  decision_id uuid,
  CHECK ((kind='time_event' AND time_event_id IS NOT NULL AND daily_calculation_version_id IS NULL)
      OR (kind='calculation_incident' AND time_event_id IS NULL AND daily_calculation_version_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS correction_requests_employee_date ON correction_requests(employee_id, labor_date, requested_at DESC);
CREATE INDEX IF NOT EXISTS correction_requests_site_pending ON correction_requests(site_id, requested_at) WHERE status='pending';

CREATE TABLE IF NOT EXISTS correction_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_request_id uuid NOT NULL UNIQUE REFERENCES correction_requests(id),
  decision text NOT NULL CHECK (decision IN ('approved','rejected')),
  reason text CHECK (reason IS NULL OR char_length(btrim(reason)) BETWEEN 3 AND 1000),
  request_fingerprint text NOT NULL CHECK (char_length(request_fingerprint)=64),
  decided_by_user_id uuid NOT NULL REFERENCES users(id),
  decided_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((decision='approved' AND reason IS NULL) OR (decision='rejected' AND reason IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS correction_effects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_request_id uuid NOT NULL UNIQUE REFERENCES correction_requests(id),
  employee_id uuid NOT NULL REFERENCES employees(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  labor_date date NOT NULL,
  replaces_time_event_id uuid REFERENCES time_events(id),
  event_type text NOT NULL CHECK (event_type IN ('clock_in','clock_out','break_start','break_end')),
  occurred_at timestamptz NOT NULL,
  rule_version_id uuid NOT NULL REFERENCES rule_versions(id),
  effective_time_zone text NOT NULL,
  approved_by_user_id uuid NOT NULL REFERENCES users(id),
  approved_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE INDEX IF NOT EXISTS correction_effects_employee_date ON correction_effects(employee_id, labor_date, occurred_at, id);
ALTER TABLE correction_requests ADD CONSTRAINT correction_requests_decision_fk FOREIGN KEY (decision_id) REFERENCES correction_decisions(id);

GRANT SELECT, INSERT, UPDATE ON correction_requests, correction_decisions, correction_effects TO mvp_app;
INSERT INTO permissions(code, description) VALUES
  ('correction.create:self','Proponer corrección propia'),
  ('correction.read:self','Leer correcciones propias'),
  ('correction.read:scope','Leer correcciones del ámbito'),
  ('correction.decide','Decidir correcciones del ámbito')
ON CONFLICT (code) DO NOTHING;
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code IN ('correction.read:scope','correction.decide')
WHERE r.code='manager' ON CONFLICT DO NOTHING;
