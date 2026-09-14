-- La decisión ordinaria de correcciones pertenece exclusivamente al responsable con ámbito de centro.
DELETE FROM role_permissions rp USING roles r
WHERE rp.role_id=r.id AND r.code='admin' AND rp.permission_code='correction.decide';
