-- S38: la política del centro es el valor predeterminado; las políticas de
-- relación laboral quedan reservadas para excepciones de movilidad vigentes.
CREATE TABLE IF NOT EXISTS site_clocking_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id),
  method text NOT NULL CHECK (method IN ('web','geo_punctual')),
  location_zone_id uuid REFERENCES work_location_zones(id),
  effective_from date NOT NULL,
  effective_to date,
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  CHECK (effective_to IS NULL OR effective_to > effective_from),
  CHECK ((method='geo_punctual' AND location_zone_id IS NOT NULL) OR (method='web' AND location_zone_id IS NULL))
);
ALTER TABLE site_clocking_policies DROP CONSTRAINT IF EXISTS site_clocking_policies_no_overlap;
ALTER TABLE site_clocking_policies ADD CONSTRAINT site_clocking_policies_no_overlap EXCLUDE USING gist (site_id WITH =, daterange(effective_from, COALESCE(effective_to, 'infinity'::date), '[)') WITH &&);

-- El valor de zona y el origen se guardan ya en la evidencia del evento; no
-- se reescriben verificaciones ni fichajes existentes al cambiar un centro.
GRANT SELECT, INSERT, UPDATE (effective_to) ON site_clocking_policies TO mvp_app;

ALTER TABLE time_event_geo_verifications ALTER COLUMN policy_id DROP NOT NULL;
