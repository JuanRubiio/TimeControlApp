-- Compatibilidad aditiva para una instancia local que ya aplicó S24 durante la revisión.
ALTER TABLE leave_request_decisions ADD COLUMN IF NOT EXISTS idempotency_key text;
UPDATE leave_request_decisions SET idempotency_key='legacy-decision-' || id::text WHERE idempotency_key IS NULL;
ALTER TABLE leave_request_decisions ALTER COLUMN idempotency_key SET NOT NULL;
ALTER TABLE leave_request_decisions ADD CONSTRAINT leave_request_decisions_idempotency_key_check CHECK (char_length(idempotency_key) BETWEEN 16 AND 200);
