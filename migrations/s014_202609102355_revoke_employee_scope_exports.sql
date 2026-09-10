-- S14: export.create/read:scope no distingue autoconsulta y, con ámbito de entorno,
-- permitiría a un empleado exportar registros de terceros. Se revoca hasta disponer
-- de permisos explícitos de exportación propia.
DELETE FROM role_permissions
WHERE role_id = (SELECT id FROM roles WHERE code = 'employee')
  AND permission_code IN ('export.create:scope', 'export.read:scope');
