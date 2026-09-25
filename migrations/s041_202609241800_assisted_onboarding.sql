CREATE TABLE IF NOT EXISTS onboarding_confirmation_idempotency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id uuid NOT NULL,
  actor_user_id uuid NOT NULL REFERENCES users(id),
  idempotency_key uuid NOT NULL,
  request_fingerprint text NOT NULL,
  response jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(environment_id,actor_user_id,idempotency_key)
);
GRANT SELECT, INSERT ON onboarding_confirmation_idempotency TO mvp_app;
