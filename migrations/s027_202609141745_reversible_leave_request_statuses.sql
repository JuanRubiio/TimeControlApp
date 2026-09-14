-- Los cambios de estado del responsable son reversibles y conservan cada transición como evidencia.
ALTER TABLE leave_request_decisions DROP CONSTRAINT IF EXISTS leave_request_decisions_leave_request_id_key;
ALTER TABLE leave_request_decisions DROP CONSTRAINT IF EXISTS leave_request_decisions_decision_check;
ALTER TABLE leave_request_decisions ADD CONSTRAINT leave_request_decisions_status_check CHECK (decision IN ('pending','approved','rejected'));
CREATE INDEX IF NOT EXISTS leave_request_decisions_request_decided ON leave_request_decisions(leave_request_id, decided_at DESC);
