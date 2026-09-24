-- S40: marcas personales aditivas; no cierran períodos ni reescriben cálculos.
INSERT INTO permissions(code,description) VALUES ('monthly-review.create:self','Marcar la revisión informativa de un período propio') ON CONFLICT (code) DO NOTHING;
INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code='monthly-review.create:self' WHERE r.code='employee' ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS monthly_period_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  period_start date NOT NULL CHECK (date_trunc('month',period_start::timestamp)::date=period_start),
  snapshot_hash text NOT NULL CHECK (length(snapshot_hash)=64),
  reviewed_by_user_id uuid NOT NULL REFERENCES users(id),
  idempotency_key uuid NOT NULL,
  correlation_id uuid,
  reviewed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(employee_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS monthly_period_reviews_lookup ON monthly_period_reviews(employee_id,period_start,reviewed_at DESC);
GRANT SELECT, INSERT ON monthly_period_reviews TO mvp_app;
