-- Algunas bases creadas antes de S30 conservan la restricción con nombre
-- implícito `time_events_check`, que sólo admitía fichaje web o kiosco.
-- Se reemplazan ambas variantes por la misma regla explícita y compatible.
ALTER TABLE time_events
  DROP CONSTRAINT IF EXISTS time_events_check;

ALTER TABLE time_events
  DROP CONSTRAINT IF EXISTS time_events_method_check;

ALTER TABLE time_events
  ADD CONSTRAINT time_events_method_check CHECK (
    (method IN ('web','geo_punctual') AND kiosk_session_id IS NULL AND created_by_user_id IS NOT NULL)
    OR (method IN ('kiosk_qr','kiosk_pin') AND kiosk_session_id IS NOT NULL AND created_by_user_id IS NULL)
  );
