import { z } from 'zod';

const uuid = z.string().uuid();
export const companyInput = z.object({ name: z.string().trim().min(1).max(160), legalIdentifier: z.string().trim().min(1).max(32).nullable().optional() });
export const siteInput = z.object({ name: z.string().trim().min(1).max(160), timeZone: z.string().regex(/^[A-Za-z]+\/[A-Za-z_]+$/).max(64) });
export const employeeInput = z.object({ displayName: z.string().trim().min(1).max(160), userId: uuid.nullable().optional() });
export const employmentInput = z.object({ employeeId: uuid, siteId: uuid, managerEmployeeId: uuid.nullable().optional(), effectiveFrom: z.string().date(), effectiveTo: z.string().date().nullable().optional() }).refine((value) => !value.effectiveTo || value.effectiveTo > value.effectiveFrom, { message: 'La fecha de fin debe ser posterior a la de inicio.', path: ['effectiveTo'] });
