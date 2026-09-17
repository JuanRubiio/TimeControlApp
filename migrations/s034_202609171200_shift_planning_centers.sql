-- S34: Administración habilita las plantillas por centro; Responsable publica sólo en su ámbito.
INSERT INTO permissions(code,description) VALUES
  ('shift-planning.publish:scope','Publica jornadas previstas para relaciones de sus centros autorizados')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code='shift-planning.publish:scope'
WHERE r.code='manager' ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS planned_shift_template_sites (
  template_id uuid NOT NULL REFERENCES planned_shift_templates(id),
  site_id uuid NOT NULL REFERENCES sites(id),
  assigned_by_user_id uuid NOT NULL REFERENCES users(id),
  assigned_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(template_id,site_id)
);

CREATE INDEX IF NOT EXISTS planned_shift_template_sites_site ON planned_shift_template_sites(site_id,template_id);
GRANT SELECT, INSERT, DELETE ON planned_shift_template_sites TO mvp_app;
