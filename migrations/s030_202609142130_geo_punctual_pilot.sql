-- S30: piloto de verificación puntual. Nunca persiste coordenadas de la persona.
CREATE TABLE IF NOT EXISTS work_location_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id),
  label text NOT NULL CHECK (char_length(label) BETWEEN 1 AND 100),
  latitude numeric(8,5) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude numeric(8,5) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  radius_meters integer NOT NULL CHECK (radius_meters BETWEEN 25 AND 5000),
  is_active boolean NOT NULL DEFAULT true,
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE UNIQUE INDEX IF NOT EXISTS work_location_zones_company_label ON work_location_zones(company_id, lower(label));

CREATE TABLE IF NOT EXISTS employment_clocking_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employment_id uuid NOT NULL REFERENCES employments(id),
  method text NOT NULL CHECK (method IN ('web','geo_punctual')),
  location_zone_id uuid REFERENCES work_location_zones(id),
  reason_code text NOT NULL CHECK (reason_code IN ('fixed_site','approved_mobility')),
  effective_from date NOT NULL,
  effective_to date,
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (effective_to IS NULL OR effective_to > effective_from),
  CHECK ((method='geo_punctual' AND location_zone_id IS NOT NULL) OR (method='web' AND location_zone_id IS NULL))
);
ALTER TABLE employment_clocking_policies DROP CONSTRAINT IF EXISTS employment_clocking_policies_no_overlap;
ALTER TABLE employment_clocking_policies ADD CONSTRAINT employment_clocking_policies_no_overlap EXCLUDE USING gist (employment_id WITH =, daterange(effective_from, COALESCE(effective_to, 'infinity'::date), '[)') WITH &&);

ALTER TABLE time_events DROP CONSTRAINT IF EXISTS time_events_method_check;
ALTER TABLE time_events ADD CONSTRAINT time_events_method_check CHECK (method IN ('web','kiosk_qr','kiosk_pin','geo_punctual'));
ALTER TABLE time_events DROP CONSTRAINT IF EXISTS time_events_method_check;
ALTER TABLE time_events ADD CONSTRAINT time_events_method_check CHECK (
  (method IN ('web','geo_punctual') AND kiosk_session_id IS NULL AND created_by_user_id IS NOT NULL)
  OR (method IN ('kiosk_qr','kiosk_pin') AND kiosk_session_id IS NOT NULL AND created_by_user_id IS NULL)
);

CREATE TABLE IF NOT EXISTS time_event_geo_verifications (
  event_id uuid PRIMARY KEY REFERENCES time_events(id),
  policy_id uuid NOT NULL REFERENCES employment_clocking_policies(id),
  location_zone_id uuid NOT NULL REFERENCES work_location_zones(id),
  accuracy_band text NOT NULL CHECK (accuracy_band IN ('up_to_25m','up_to_50m','up_to_100m')),
  verified_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

GRANT SELECT, INSERT ON work_location_zones, employment_clocking_policies, time_event_geo_verifications TO mvp_app;
INSERT INTO permissions(code,description) VALUES
  ('clocking-policy.read:scope','Consultar políticas de fichaje del ámbito'),
  ('clocking-policy.write','Configurar políticas de fichaje y zonas autorizadas')
ON CONFLICT(code) DO NOTHING;
INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code='clocking-policy.read:scope' WHERE r.code='manager' ON CONFLICT DO NOTHING;
INSERT INTO role_permissions(role_id,permission_code)
SELECT r.id,p.code FROM roles r JOIN permissions p ON p.code IN ('clocking-policy.read:scope','clocking-policy.write') WHERE r.code='admin' ON CONFLICT DO NOTHING;
