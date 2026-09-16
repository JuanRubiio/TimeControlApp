import { z } from 'zod';

const segment = z.object({ start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) });
export const moduleStatusInput = z.object({ status: z.enum(['configured','active','paused','disabled']) });
export const templateInput = z.object({ name: z.string().trim().min(1).max(160), timeZone: z.string().regex(/^[A-Za-z]+\/[A-Za-z_]+$/), segments: z.array(segment).min(1).max(8), expectedMinutes: z.number().int().min(0).max(1440) });
export const assignmentInput = z.object({ employmentId: z.string().uuid(), templateId: z.string().uuid(), effectiveFrom: z.string().date(), effectiveTo: z.string().date().nullable().optional(), reasonCode: z.enum(['initial_plan','replacement','operational_change']) }).superRefine((value,ctx)=>{if(value.effectiveTo&&value.effectiveTo<=value.effectiveFrom)ctx.addIssue({code:'custom',path:['effectiveTo'],message:'La vigencia no es válida.'});});
