-- La precisión recibida es una categoría de auditoría, no una ampliación de zona.
-- Conservamos sólo bandas; nunca se persisten coordenadas de la persona.
ALTER TABLE time_event_geo_verifications
  DROP CONSTRAINT IF EXISTS time_event_geo_verifications_accuracy_band_check;

ALTER TABLE time_event_geo_verifications
  ADD CONSTRAINT time_event_geo_verifications_accuracy_band_check
  CHECK (accuracy_band IN ('up_to_25m','up_to_50m','up_to_100m','over_100m'));
