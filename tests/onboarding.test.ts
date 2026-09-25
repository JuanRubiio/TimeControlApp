import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';
import { onboardingConfirmInput,onboardingPreviewInput } from '../src/onboarding/schemas';

const row={rowId:'00000000-0000-4000-8000-000000000001',displayName:'Persona sintética',siteId:'00000000-0000-4000-8000-000000000002',managerEmployeeId:null,effectiveFrom:'2026-10-01'};
describe('altas asistidas',()=>{
  it('limita y valida el contrato efímero de filas',()=>{expect(onboardingConfirmInput.safeParse(row).success).toBe(true);expect(onboardingPreviewInput.safeParse({rows:Array.from({length:25},(_,index)=>({...row,rowId:`00000000-0000-4000-8000-${String(index+10).padStart(12,'0')}`}))}).success).toBe(true);expect(onboardingPreviewInput.safeParse({rows:Array.from({length:26},()=>row)}).success).toBe(false);});
  it('protege vista previa y confirmación con ambos permisos y una clave idempotente',()=>{for(const path of ['src/app/api/v1/onboarding/preview/route.ts','src/app/api/v1/onboarding/confirm/route.ts']){const source=readFileSync(path,'utf8');expect(source).toContain("authenticated(request,'employee.write')");expect(source).toContain("permissions.has('employment.write')");}expect(readFileSync('src/app/api/v1/onboarding/confirm/route.ts','utf8')).toContain("idempotency-key");});
  it('no almacena una preparación y confirma persona y relación de forma atómica',()=>{const source=readFileSync('src/onboarding/service.ts','utf8');expect(source).toContain("INSERT INTO employees");expect(source).toContain("INSERT INTO employments");expect(source).toContain("onboarding_confirmation_idempotency");expect(source).not.toContain('onboarding_drafts');});
});
