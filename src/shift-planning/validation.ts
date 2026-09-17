import { z } from 'zod';

const segment = z.object({ start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/) });
export const moduleStatusInput = z.object({ status: z.enum(['configured','active','paused','disabled']) });
export const templateInput = z.object({ name: z.string().trim().min(1).max(160), timeZone: z.string().regex(/^[A-Za-z]+\/[A-Za-z_]+$/), segments: z.array(segment).min(1).max(8) });
export const assignmentInput = z.object({ employmentId: z.string().uuid(), templateId: z.string().uuid(), effectiveFrom: z.string().date(), effectiveTo: z.string().date().nullable().optional(), reasonCode: z.enum(['initial_plan','replacement','operational_change']) }).superRefine((value,ctx)=>{if(value.effectiveTo&&value.effectiveTo<=value.effectiveFrom)ctx.addIssue({code:'custom',path:['effectiveTo'],message:'La vigencia no es válida.'});});

export function expectedMinutes(segments: z.infer<typeof templateInput>['segments']) {
  return segments.reduce((total, segment) => {
    const [startHour, startMinute] = segment.start.split(':').map(Number);
    const [endHour, endMinute] = segment.end.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return total + (end > start ? end - start : 1440 - start + end);
  }, 0);
}
