import { z } from 'zod';
const row=z.object({rowId:z.string().uuid(),displayName:z.string().trim().min(1).max(160),siteId:z.string().uuid(),managerEmployeeId:z.string().uuid().nullable(),effectiveFrom:z.string().date()});
export const onboardingPreviewInput=z.object({rows:z.array(row).min(1).max(25)});
export const onboardingConfirmInput=row;
export type OnboardingRow=z.infer<typeof onboardingConfirmInput>;
