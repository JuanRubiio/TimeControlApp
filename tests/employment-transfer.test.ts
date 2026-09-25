import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { employmentTransferInput } from '../src/company-people/schemas';

const id='00000000-0000-4000-8000-000000000001';

describe('HU-TC-060 traslado futuro de centro',()=>{
 it('acepta únicamente el mínimo necesario para programar un traslado',()=>{
  expect(employmentTransferInput.safeParse({siteId:id,managerEmployeeId:null,effectiveFrom:'2026-10-01'}).success).toBe(true);
  expect(employmentTransferInput.safeParse({siteId:'centro',effectiveFrom:'2026-10-01'}).success).toBe(false);
  expect(employmentTransferInput.safeParse({siteId:id,effectiveFrom:'01/10/2026'}).success).toBe(false);
 });
 it('cierra el origen y crea el destino dentro de una transacción auditable',()=>{
  const source=readFileSync('src/company-people/service.ts','utf8');
  expect(source).toContain('export async function transferEmployment');
  expect(source).toContain("await client.query('BEGIN')");
  expect(source).toContain('UPDATE employments SET effective_to=$2::date');
  expect(source).toContain('INSERT INTO employments(employee_id,site_id,manager_employee_id,effective_from)');
  expect(source).toContain("'employment.transferred'");
 });
 it('reserva la operación a administración y no convierte una edición en traslado',()=>{
  const route=readFileSync('src/app/api/v1/employments/[id]/transfer/route.ts','utf8');
  const ui=readFileSync('src/admin/people-management.tsx','utf8');
  expect(route).toContain('hasEnvironmentScope(access.actor)');
  expect(ui).toContain('Trasladar de centro');
  expect(ui).toContain('Programar traslado');
 });
});
