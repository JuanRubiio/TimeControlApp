-- S8: permite a responsables consultar evidencia y cálculos de sus centros.
-- La comprobación de centro continúa en el servidor; no se concede escritura.
INSERT INTO role_permissions(role_id, permission_code)
SELECT r.id, p.code
FROM roles r JOIN permissions p ON p.code IN ('time-event.read:scope', 'time-calculation.read:scope')
WHERE r.code='manager'
ON CONFLICT DO NOTHING;
