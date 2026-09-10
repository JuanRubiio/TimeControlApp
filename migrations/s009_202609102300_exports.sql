-- S9: snapshots de evidencia y artefactos temporales por entorno dedicado.
CREATE TABLE IF NOT EXISTS exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by_user_id uuid NOT NULL REFERENCES users(id),
  format text NOT NULL CHECK (format IN ('csv','pdf')),
  scope_type text NOT NULL CHECK (scope_type IN ('employee','site')),
  employee_id uuid REFERENCES employees(id),
  site_id uuid REFERENCES sites(id),
  period_from date NOT NULL,
  period_to date NOT NULL,
  snapshot jsonb NOT NULL,
  manifest jsonb NOT NULL,
  content_hash text NOT NULL CHECK (char_length(content_hash)=64),
  storage_key text NOT NULL UNIQUE,
  template_version text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available','expired','failed')),
  expired_at timestamptz,
  CHECK (period_to >= period_from),
  CHECK ((scope_type='employee' AND employee_id IS NOT NULL AND site_id IS NULL) OR (scope_type='site' AND site_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS exports_requested_by ON exports(requested_by_user_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS exports_expiry ON exports(expires_at) WHERE status='available';
GRANT SELECT, INSERT, UPDATE ON exports TO mvp_app;
