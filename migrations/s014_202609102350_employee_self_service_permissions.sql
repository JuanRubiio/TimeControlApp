-- S14: mínimo privilegio para que una cuenta exclusivamente employee pueda usar los flujos S4–S7.
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code
FROM roles r
JOIN permissions p ON p.code IN (
  'employee.read:self',
  'time-event.create:self',
  'time-event.read:self',
  'time-calculation.read:self',
  'correction.create:self',
  'correction.read:self'
)
WHERE r.code = 'employee'
ON CONFLICT DO NOTHING;
