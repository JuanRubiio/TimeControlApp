import { z } from 'zod';
export const uuid = z.string().uuid();
export const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const localTime = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const segments = z.array(z.object({ start: localTime, end: localTime })).min(1).superRefine((items, ctx) => {
  for (let i=0;i<items.length;i++) if (items[i].start === items[i].end) ctx.addIssue({code:z.ZodIssueCode.custom,message:'Un tramo debe tener duración positiva.',path:[i]});
});
export function assertIana(timeZone:string) { try { if (!Intl.supportedValuesOf('timeZone').includes(timeZone)) throw new Error('unsupported'); new Intl.DateTimeFormat('en-US',{timeZone}); } catch { throw new Error('INVALID_TIME_ZONE'); } }
export function localDateAt(instant:string, timeZone:string) {
  const value=new Date(instant); if (Number.isNaN(value.getTime()) || !/Z$/i.test(instant)) throw new Error('INVALID_DATETIME');
  assertIana(timeZone); const parts=new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(value);
  const pick=(type:string)=>parts.find(p=>p.type===type)?.value; return `${pick('year')}-${pick('month')}-${pick('day')}`;
}
