import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
describe('migración de idempotencia para altas asistidas',()=>{it('vincula la respuesta a actor, entorno y clave sin guardar borradores',()=>{const sql=readFileSync('migrations/s041_202609241800_assisted_onboarding.sql','utf8');expect(sql).toContain('actor_user_id');expect(sql).toContain('UNIQUE(environment_id,actor_user_id,idempotency_key)');expect(sql).not.toContain('draft');});});
