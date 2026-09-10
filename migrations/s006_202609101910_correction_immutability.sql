-- S6 follow-up: an application connection may advance a pending request once,
-- but it cannot rewrite its evidence, decision, or applied effect.
CREATE OR REPLACE FUNCTION correction_request_immutable_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.employee_id IS DISTINCT FROM OLD.employee_id OR NEW.site_id IS DISTINCT FROM OLD.site_id
    OR NEW.labor_date IS DISTINCT FROM OLD.labor_date OR NEW.kind IS DISTINCT FROM OLD.kind
    OR NEW.time_event_id IS DISTINCT FROM OLD.time_event_id OR NEW.daily_calculation_version_id IS DISTINCT FROM OLD.daily_calculation_version_id
    OR NEW.proposed_effect IS DISTINCT FROM OLD.proposed_effect OR NEW.reason IS DISTINCT FROM OLD.reason
    OR NEW.requested_by_user_id IS DISTINCT FROM OLD.requested_by_user_id OR NEW.requested_at IS DISTINCT FROM OLD.requested_at
    OR OLD.status <> 'pending' OR NEW.status NOT IN ('approved','rejected') OR NEW.decision_id IS NULL THEN
    RAISE EXCEPTION 'CORRECTION_REQUEST_IMMUTABLE';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS correction_request_immutable ON correction_requests;
CREATE TRIGGER correction_request_immutable BEFORE UPDATE ON correction_requests FOR EACH ROW EXECUTE FUNCTION correction_request_immutable_guard();
REVOKE UPDATE, DELETE ON correction_decisions, correction_effects FROM mvp_app;
