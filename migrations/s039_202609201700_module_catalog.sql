-- S39: catálogo explícito de capacidades instalables; retirar conserva historia.
ALTER TABLE company_modules DROP CONSTRAINT IF EXISTS company_modules_module_key_check;
ALTER TABLE company_modules ADD CONSTRAINT company_modules_module_key_check
  CHECK (module_key IN ('shift_planning','exports','informative_hour_balance','leave_management'));
