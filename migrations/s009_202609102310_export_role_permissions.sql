-- S9 follow-up: roles only gain export rights within the server-verified scope.
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code FROM roles r JOIN permissions p ON p.code IN ('export.create:scope','export.read:scope')
WHERE r.code IN ('employee','manager','auditor') ON CONFLICT DO NOTHING;
