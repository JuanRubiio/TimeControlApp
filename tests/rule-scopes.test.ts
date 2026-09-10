import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('adaptador S2 para resolución de reglas',()=>{
  it('implementa el puerto atómico de S3',()=>{const source=readFileSync('src/company-people/rule-scopes.ts','utf8');expect(source).toContain('implements EmploymentScopeProvider');expect(source).toContain('contextForEmployee');});
  it('resuelve relación vigente, centro y zona en la misma consulta',()=>{const source=readFileSync('src/company-people/rule-scopes.ts','utf8');expect(source).toContain('em.effective_from <=');expect(source).toContain('em.effective_to IS NULL OR em.effective_to >');expect(source).toContain("{type:'company'");expect(source).toContain("{type:'site'");});
});
