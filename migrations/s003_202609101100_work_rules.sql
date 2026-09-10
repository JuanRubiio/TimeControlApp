-- S3 jornada y reglas. Las referencias de alcance son contratos UUID con S2,
-- deliberadamente sin FK para permitir el trabajo paralelo entre sesiones.
CREATE TABLE IF NOT EXISTS work_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL CHECK (scope_type IN ('company', 'site', 'collective')),
  scope_id uuid NOT NULL,
  name text NOT NULL CHECK (length(trim(name)) > 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  deactivated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((status = 'active' AND deactivated_at IS NULL) OR (status = 'inactive' AND deactivated_at IS NOT NULL)),
  UNIQUE(scope_type, scope_id, name)
);

CREATE TABLE IF NOT EXISTS calendars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  time_zone text NOT NULL,
  working_days jsonb NOT NULL DEFAULT '[1,2,3,4,5]'::jsonb,
  holidays jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  segments jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS rule_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  work_rule_id uuid NOT NULL REFERENCES work_rules(id),
  effective_from date NOT NULL,
  effective_to date,
  time_zone text NOT NULL,
  expected_minutes integer NOT NULL CHECK (expected_minutes >= 0 AND expected_minutes <= 1440),
  pause_policy jsonb NOT NULL,
  calendar_id uuid REFERENCES calendars(id),
  shift_id uuid REFERENCES shifts(id),
  calendar_snapshot jsonb,
  shift_snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_by uuid REFERENCES users(id),
  CHECK (effective_to IS NULL OR effective_to > effective_from),
  CHECK ((calendar_id IS NULL) = (calendar_snapshot IS NULL)),
  CHECK ((shift_id IS NULL) = (shift_snapshot IS NULL))
);

CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE rule_versions ADD CONSTRAINT rule_versions_no_overlap
  EXCLUDE USING gist (work_rule_id WITH =, daterange(effective_from, effective_to, '[)') WITH &&);
CREATE INDEX IF NOT EXISTS rule_versions_resolution ON rule_versions(work_rule_id, effective_from, effective_to);

GRANT SELECT, INSERT, UPDATE ON work_rules, calendars, shifts, rule_versions TO mvp_app;
