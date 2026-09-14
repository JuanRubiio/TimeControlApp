import { z } from 'zod';
import { LEAVE_REQUEST_CATEGORIES,LEAVE_REQUEST_MANAGER_STATUSES } from './contracts';
export const leaveRequestInput=z.object({fromDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),toDate:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),category:z.enum(LEAVE_REQUEST_CATEGORIES),comment:z.string().trim().max(500).optional().transform(value=>value||undefined)}).strict().superRefine((value,ctx)=>{if(value.toDate<value.fromDate)ctx.addIssue({code:'custom',message:'El intervalo de fechas no es válido'});});
export const leaveDecisionInput=z.object({decision:z.enum(LEAVE_REQUEST_MANAGER_STATUSES)}).strict();
export const idempotencyKey=(value:string|null)=>{if(!value||value.length<16||value.length>200)throw new Error('IDEMPOTENCY_KEY_REQUIRED');return value;};
