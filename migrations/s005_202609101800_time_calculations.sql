-- S5: proyecciones explicables de jornada. La evidencia S4 se consume sólo en lectura.
CREATE TABLE IF NOT EXISTS calculation_policies (
  rule_version_id uuid PRIMARY KEY REFERENCES rule_versions(id),
  excess_threshold_minutes integer NOT NULL DEFAULT 0 CHECK (excess_threshold_minutes >= 0 AND excess_threshold_minutes <= 1440),
  algorithm_version text NOT NULL DEFAULT 's5.v1',
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_by_user_id uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS daily_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  labor_date date NOT NULL,
  site_id uuid NOT NULL REFERENCES sites(id),
  rule_version_id uuid NOT NULL REFERENCES rule_versions(id),
  effective_time_zone text NOT NULL,
  current_version_id uuid,
  current_revision integer NOT NULL DEFAULT 0 CHECK (current_revision >= 0),
  calculated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(employee_id, labor_date)
);

CREATE TABLE IF NOT EXISTS daily_calculation_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_calculation_id uuid NOT NULL REFERENCES daily_calculations(id),
  revision integer NOT NULL CHECK (revision > 0),
  input_hash text NOT NULL CHECK (char_length(input_hash) = 64),
  algorithm_version text NOT NULL,
  source_event_ids jsonb NOT NULL,
  rule_version_id uuid NOT NULL REFERENCES rule_versions(id),
  effective_time_zone text NOT NULL,
  expected_minutes integer NOT NULL CHECK (expected_minutes >= 0),
  presence_minutes integer NOT NULL CHECK (presence_minutes >= 0),
  effective_minutes integer NOT NULL CHECK (effective_minutes >= 0),
  registered_break_minutes integer NOT NULL CHECK (registered_break_minutes >= 0),
  difference_minutes integer NOT NULL,
  excess_minutes integer NOT NULL CHECK (excess_minutes >= 0),
  excess_is_informational boolean NOT NULL DEFAULT true CHECK (excess_is_informational),
  incidents jsonb NOT NULL,
  calculated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(daily_calculation_id, revision),
  UNIQUE(daily_calculation_id, input_hash)
);
ALTER TABLE daily_calculations ADD CONSTRAINT daily_calculations_current_version_fk FOREIGN KEY (current_version_id) REFERENCES daily_calculation_versions(id);
CREATE INDEX IF NOT EXISTS daily_calculations_site_date ON daily_calculations(site_id, labor_date);
CREATE INDEX IF NOT EXISTS daily_calculation_versions_rule ON daily_calculation_versions(rule_version_id, calculated_at DESC);

GRANT SELECT, INSERT, UPDATE ON calculation_policies, daily_calculations, daily_calculation_versions TO mvp_app;
INSERT INTO permissions(code, description) VALUES
  ('time-calculation.read:self','Leer cálculo propio'),
  ('time-calculation.read:scope','Leer cálculos del ámbito'),
  ('time-calculation.recalculate:scope','Recalcular jornada del ámbito'),
  ('time-calculation.configure','Configurar umbral de exceso')
ON CONFLICT (code) DO NOTHING;
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code FROM roles r JOIN permissions p ON p.code IN ('time-calculation.read:self','time-calculation.read:scope','time-calculation.recalculate:scope','time-calculation.configure') WHERE r.code='admin' ON CONFLICT DO NOTHING;
