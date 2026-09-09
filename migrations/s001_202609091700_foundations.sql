-- S1 foundations. Applied once via schema_migrations; statements are retry-safe for bootstrap.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  checksum text NOT NULL
);

CREATE TABLE IF NOT EXISTS environment_context (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  environment_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  password_hash text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  mfa_secret text,
  mfa_enrolled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (email = lower(email))
);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS permissions (
  code text PRIMARY KEY,
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id),
  permission_code text NOT NULL REFERENCES permissions(code),
  PRIMARY KEY (role_id, permission_code)
);

CREATE TABLE IF NOT EXISTS user_role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  role_id uuid NOT NULL REFERENCES roles(id),
  scope_type text NOT NULL DEFAULT 'environment' CHECK (scope_type IN ('self', 'site', 'environment')),
  scope_id uuid,
  valid_from timestamptz NOT NULL DEFAULT clock_timestamp(),
  valid_to timestamptz,
  assigned_by uuid REFERENCES users(id),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (valid_to IS NULL OR valid_to > valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS active_role_assignment ON user_role_assignments(user_id, role_id, scope_type, COALESCE(scope_id, '00000000-0000-0000-0000-000000000000')) WHERE valid_to IS NULL;

CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  rotated_from_id uuid REFERENCES auth_sessions(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  last_seen_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  correlation_id uuid NOT NULL,
  CHECK (expires_at > created_at)
);
CREATE INDEX IF NOT EXISTS auth_sessions_active ON auth_sessions(user_id, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS auth_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token_hash text NOT NULL UNIQUE,
  purpose text NOT NULL CHECK (purpose IN ('mfa_enroll','mfa_verify')),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS audit_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  environment_id uuid NOT NULL,
  actor_type text NOT NULL CHECK (actor_type IN ('user', 'system', 'kiosk')),
  actor_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  result text NOT NULL CHECK (result IN ('success', 'denied', 'failure')),
  correlation_id uuid NOT NULL,
  origin jsonb NOT NULL DEFAULT '{}'::jsonb,
  changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  previous_hash text,
  entry_hash text NOT NULL UNIQUE
);
CREATE INDEX IF NOT EXISTS audit_entries_order ON audit_entries(occurred_at, id);

CREATE OR REPLACE FUNCTION audit_append(
  p_environment_id uuid, p_actor_type text, p_actor_id uuid, p_action text,
  p_resource_type text, p_resource_id text, p_result text, p_correlation_id uuid,
  p_origin jsonb DEFAULT '{}'::jsonb, p_changes jsonb DEFAULT '{}'::jsonb
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_previous text; v_id uuid := gen_random_uuid(); v_occurred timestamptz := clock_timestamp(); v_hash text;
BEGIN
  PERFORM pg_advisory_xact_lock(71209001);
  SELECT entry_hash INTO v_previous FROM audit_entries ORDER BY occurred_at DESC, id DESC LIMIT 1;
  v_hash := encode(digest(concat_ws('|', v_id::text, v_occurred::text, p_environment_id::text, p_actor_type, coalesce(p_actor_id::text,''), p_action, p_resource_type, coalesce(p_resource_id,''), p_result, p_correlation_id::text, p_origin::text, p_changes::text, coalesce(v_previous,'')), 'sha256'), 'hex');
  INSERT INTO audit_entries(id, occurred_at, environment_id, actor_type, actor_id, action, resource_type, resource_id, result, correlation_id, origin, changes, previous_hash, entry_hash)
  VALUES(v_id, v_occurred, p_environment_id, p_actor_type, p_actor_id, p_action, p_resource_type, p_resource_id, p_result, p_correlation_id, p_origin, p_changes, v_previous, v_hash);
  RETURN v_id;
END $$;

GRANT USAGE ON SCHEMA public TO mvp_app;
GRANT SELECT, INSERT, UPDATE ON users, user_role_assignments, auth_sessions, auth_challenges TO mvp_app;
GRANT SELECT ON environment_context, roles, permissions, role_permissions, audit_entries TO mvp_app;
GRANT EXECUTE ON FUNCTION audit_append(uuid,text,uuid,text,text,text,text,uuid,jsonb,jsonb) TO mvp_app;
REVOKE INSERT, UPDATE, DELETE ON audit_entries FROM PUBLIC, mvp_app;
REVOKE UPDATE, DELETE ON schema_migrations FROM PUBLIC, mvp_app;

INSERT INTO permissions(code, description) VALUES
('company.read','Leer empresa'),('company.write','Modificar empresa'),('site.read','Leer centros'),('site.write','Modificar centros'),
('employee.read:self','Leer persona propia'),('employee.read:scope','Leer personas del ámbito'),('employee.write','Modificar personas'),
('employment.read','Leer relaciones'),('employment.write','Modificar relaciones'),('rule.read','Leer reglas'),('rule.write','Modificar reglas'),
('time-event.create:self','Crear fichaje propio'),('time-event.read:self','Leer fichajes propios'),('time-event.read:scope','Leer fichajes del ámbito'),
('correction.create:self','Proponer corrección propia'),('correction.read:self','Leer correcciones propias'),('correction.read:scope','Leer correcciones del ámbito'),('correction.decide','Decidir correcciones'),
('audit.read:scope','Leer auditoría del ámbito'),('export.create:scope','Crear exportación'),('export.read:scope','Leer exportaciones'),('role.assign','Asignar roles'),('auth.admin','Administrar autenticación')
ON CONFLICT (code) DO NOTHING;
INSERT INTO roles(code, description) VALUES ('employee','Empleado'),('manager','Responsable'),('admin','Administrador'),('auditor','Auditor'),('system','Sistema') ON CONFLICT (code) DO NOTHING;
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code FROM roles r CROSS JOIN permissions p WHERE r.code = 'admin' ON CONFLICT DO NOTHING;
