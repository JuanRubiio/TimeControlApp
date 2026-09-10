import { z } from 'zod';
export const exportInput=z.object({format:z.enum(['csv','pdf']),employeeId:z.string().uuid().optional(),siteId:z.string().uuid().optional(),from:z.string().date(),to:z.string().date()}).refine(x=>(!!x.employeeId)!=(!!x.siteId),{message:'Indique una persona o un centro.'}).refine(x=>x.from<=x.to,{message:'El período no es válido.'});
