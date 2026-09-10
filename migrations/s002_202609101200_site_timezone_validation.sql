-- Corrección S2: la forma de una zona no basta; debe ser un identificador IANA
-- disponible en PostgreSQL. Es aditiva y segura con las migraciones ya aplicadas.
CREATE OR REPLACE FUNCTION is_supported_iana_time_zone(value text)
RETURNS boolean LANGUAGE sql STABLE PARALLEL SAFE AS $$
  SELECT EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = value)
$$;

ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_time_zone_supported;
ALTER TABLE sites ADD CONSTRAINT sites_time_zone_supported CHECK (is_supported_iana_time_zone(time_zone));
