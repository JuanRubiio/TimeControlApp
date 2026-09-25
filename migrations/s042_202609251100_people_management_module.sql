ALTER TABLE company_modules DROP CONSTRAINT IF EXISTS company_modules_module_key_check;
ALTER TABLE company_modules ADD CONSTRAINT company_modules_module_key_check
  CHECK (module_key IN ('shift_planning','people_management','exports','informative_hour_balance','leave_management'));
