import { z } from 'zod';

const uuid = z.string().uuid();
const ianaTimeZone = z.string().min(1).max(64).refine((value) => {
  try { return Intl.supportedValuesOf('timeZone').includes(value); } catch { return false; }
}, 'Debe ser una zona horaria IANA válida.');
export const companyInput = z.object({ name: z.string().trim().min(1).max(160), legalIdentifier: z.string().trim().min(1).max(32).nullable().optional() });
export const siteInput = z.object({ name: z.string().trim().min(1).max(160), timeZone: ianaTimeZone });
export const employeeInput = z.object({ displayName: z.string().trim().min(1).max(160), userId: uuid.nullable().optional() });
export const employmentInput = z.object({ employeeId: uuid, siteId: uuid, managerEmployeeId: uuid.nullable().optional(), effectiveFrom: z.string().date(), effectiveTo: z.string().date().nullable().optional() }).refine((value) => !value.effectiveTo || value.effectiveTo > value.effectiveFrom, { message: 'La fecha de fin debe ser posterior a la de inicio.', path: ['effectiveTo'] });
