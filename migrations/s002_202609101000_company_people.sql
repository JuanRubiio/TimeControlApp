-- S2 company, sites, employees and basic employment. Dedicated-environment schema; no tenant key.
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id uuid NOT NULL UNIQUE REFERENCES environment_context(environment_id),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  legal_identifier text CHECK (legal_identifier IS NULL OR char_length(legal_identifier) BETWEEN 1 AND 32),
  is_active boolean NOT NULL DEFAULT true,
  deactivated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((is_active AND deactivated_at IS NULL) OR (NOT is_active AND deactivated_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 160),
  time_zone text NOT NULL CHECK (time_zone ~ '^[A-Za-z]+/[A-Za-z_]+$'),
  is_active boolean NOT NULL DEFAULT true,
  deactivated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((is_active AND deactivated_at IS NULL) OR (NOT is_active AND deactivated_at IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS sites_active_name ON sites(company_id, lower(name)) WHERE is_active;

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  user_id uuid UNIQUE REFERENCES users(id),
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 160),
  is_active boolean NOT NULL DEFAULT true,
  deactivated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK ((is_active AND deactivated_at IS NULL) OR (NOT is_active AND deactivated_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS employments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  manager_employee_id uuid REFERENCES employees(id),
  effective_from date NOT NULL,
  effective_to date,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (effective_to IS NULL OR effective_to > effective_from),
  CHECK (manager_employee_id IS NULL OR manager_employee_id <> employee_id),
  CHECK (ended_at IS NULL OR effective_to IS NOT NULL)
);
ALTER TABLE employments DROP CONSTRAINT IF EXISTS employments_no_overlapping_ranges;
ALTER TABLE employments ADD CONSTRAINT employments_no_overlapping_ranges EXCLUDE USING gist (employee_id WITH =, daterange(effective_from, COALESCE(effective_to, 'infinity'::date), '[)') WITH &&);
CREATE INDEX IF NOT EXISTS employments_site_current ON employments(site_id) WHERE effective_to IS NULL;

GRANT SELECT, INSERT, UPDATE ON companies, sites, employees, employments TO mvp_app;

INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code FROM roles r JOIN permissions p ON p.code IN ('employee.read:scope','employment.read','site.read')
WHERE r.code = 'manager' ON CONFLICT DO NOTHING;
