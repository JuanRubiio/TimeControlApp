-- S35: calendario operativo explícito por centro y descanso semanal de plantilla.
ALTER TABLE planned_shift_templates ADD COLUMN IF NOT EXISTS working_days jsonb NOT NULL DEFAULT '[1,2,3,4,5]'::jsonb;

CREATE TABLE IF NOT EXISTS planning_site_holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id),
  holiday_date date NOT NULL,
  holiday_type text NOT NULL CHECK (holiday_type IN ('national','regional','local')),
  label text NOT NULL CHECK (char_length(trim(label)) BETWEEN 1 AND 160),
  created_by_user_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE(site_id,holiday_date)
);

ALTER TABLE leave_requests DROP CONSTRAINT IF EXISTS leave_requests_category_check;
ALTER TABLE leave_requests ADD CONSTRAINT leave_requests_category_check CHECK (category IN ('general_request','personal_management','availability_adjustment','vacation','absence'));

CREATE INDEX IF NOT EXISTS planning_site_holidays_site_date ON planning_site_holidays(site_id,holiday_date);
GRANT SELECT, INSERT ON planning_site_holidays TO mvp_app;
