-- S24: solicitudes operativas sintéticas. No afectan fichajes, cálculos ni saldos.
CREATE TABLE IF NOT EXISTS leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  from_date date NOT NULL,
  to_date date NOT NULL,
  category text NOT NULL DEFAULT 'general_request' CHECK (category='general_request'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','cancelled')),
  requested_by_user_id uuid NOT NULL REFERENCES users(id),
  requested_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  decision_id uuid,
  cancelled_by_user_id uuid REFERENCES users(id),
  cancelled_at timestamptz,
  CHECK (to_date >= from_date),
  CHECK ((status='cancelled') = (cancelled_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS leave_requests_employee_requested ON leave_requests(employee_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS leave_requests_site_pending ON leave_requests(site_id, requested_at) WHERE status='pending';

CREATE TABLE IF NOT EXISTS leave_request_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leave_request_id uuid NOT NULL UNIQUE REFERENCES leave_requests(id),
  decision text NOT NULL CHECK (decision IN ('approved','rejected')),
  request_fingerprint text NOT NULL CHECK (char_length(request_fingerprint)=64),
  decided_by_user_id uuid NOT NULL REFERENCES users(id),
  decided_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_decision_fk FOREIGN KEY (decision_id) REFERENCES leave_request_decisions(id);

CREATE TABLE IF NOT EXISTS leave_request_idempotency (
  employee_id uuid NOT NULL REFERENCES employees(id),
  idempotency_key text NOT NULL CHECK (char_length(idempotency_key) BETWEEN 16 AND 200),
  request_fingerprint text NOT NULL CHECK (char_length(request_fingerprint)=64),
  leave_request_id uuid NOT NULL REFERENCES leave_requests(id),
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(employee_id,idempotency_key)
);

INSERT INTO permissions(code,description) VALUES
  ('leave-request.create:self','Crear solicitud operativa propia'),
  ('leave-request.read:self','Leer solicitudes operativas propias'),
  ('leave-request.read:scope','Leer solicitudes operativas del ámbito'),
  ('leave-request.decide:scope','Decidir solicitudes operativas del ámbito'),
  ('leave-request.cancel:self','Cancelar solicitud operativa propia')
ON CONFLICT(code) DO NOTHING;
INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code IN ('leave-request.create:self','leave-request.read:self','leave-request.cancel:self') WHERE r.code='employee'
ON CONFLICT DO NOTHING;
INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code IN ('leave-request.read:scope','leave-request.decide:scope') WHERE r.code='manager'
ON CONFLICT DO NOTHING;
INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code LIKE 'leave-request.%' WHERE r.code='admin'
ON CONFLICT DO NOTHING;
GRANT SELECT, INSERT, UPDATE ON leave_requests, leave_request_decisions, leave_request_idempotency TO mvp_app;
