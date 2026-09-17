-- S33: planificación futura aislada de reglas, fichajes y cálculos.
CREATE EXTENSION IF NOT EXISTS btree_gist;

INSERT INTO permissions(code,description)
VALUES
  ('shift-planning.read','Consulta configuración y publicaciones de planificación autorizadas'),
  ('shift-planning.write','Gestiona configuración y publicaciones futuras de planificación')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code IN ('shift-planning.read','shift-planning.write')
WHERE r.code='admin'
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS company_modules (
  company_id uuid NOT NULL REFERENCES companies(id),
  module_key text NOT NULL CHECK (module_key IN ('shift_planning','informative_hour_balance','leave_management')),
  status text NOT NULL DEFAULT 'disabled' CHECK (status IN ('disabled','configured','active','paused')),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_by_user_id uuid REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(company_id,module_key)
);

CREATE TABLE IF NOT EXISTS planned_shift_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL CHECK (length(trim(name)) BETWEEN 1 AND 160),
  version integer NOT NULL CHECK (version > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','retired')),
  time_zone text NOT NULL,
  segments jsonb NOT NULL,
  expected_minutes integer NOT NULL CHECK (expected_minutes BETWEEN 0 AND 1440),
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(company_id,name,version)
);

CREATE TABLE IF NOT EXISTS planned_shift_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  employment_id uuid NOT NULL REFERENCES employments(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  template_id uuid NOT NULL REFERENCES planned_shift_templates(id),
  template_snapshot jsonb NOT NULL,
  effective_from date NOT NULL,
  effective_to date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','cancelled','superseded')),
  reason_code text NOT NULL CHECK (reason_code IN ('initial_plan','replacement','operational_change')),
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  published_by_user_id uuid REFERENCES users(id),
  published_at timestamptz,
  cancelled_at timestamptz,
  correlation_id uuid,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (effective_to IS NULL OR effective_to > effective_from),
  CHECK ((status='published') = (published_by_user_id IS NOT NULL AND published_at IS NOT NULL)),
  CHECK ((status IN ('cancelled','superseded')) = (cancelled_at IS NOT NULL))
);

ALTER TABLE planned_shift_assignments ADD CONSTRAINT planned_shift_assignments_no_published_overlap
  EXCLUDE USING gist (employment_id WITH =, daterange(effective_from,effective_to,'[)') WITH &&)
  WHERE (status='published');

CREATE INDEX IF NOT EXISTS planned_shift_assignments_site_period
  ON planned_shift_assignments(site_id,effective_from,effective_to) WHERE status='published';

GRANT SELECT, INSERT, UPDATE ON company_modules, planned_shift_templates, planned_shift_assignments TO mvp_app;
