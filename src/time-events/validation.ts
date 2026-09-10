import { z } from 'zod';
import { TIME_EVENT_TYPES } from './contracts';

export const timeEventCommand = z.object({
  eventType:z.enum(TIME_EVENT_TYPES),
  deviceOccurredAt:z.string().datetime({offset:true}).refine((value)=>/Z$/i.test(value), 'UTC required').optional()
});
export const kioskStartCommand = z.object({siteId:z.string().uuid(), expiresInMinutes:z.number().int().min(5).max(720).default(480)});
export const kioskPinCommand = timeEventCommand.extend({publicKioskId:z.string().uuid(), pin:z.string().regex(/^\d{6,10}$/)});
export const kioskQrCommand = timeEventCommand.extend({challenge:z.string().min(32).max(200)});
export const kioskPinSetCommand = z.object({pin:z.string().regex(/^\d{6,10}$/)});
export function assertIdempotencyKey(key:string|null) { if (!key || key.length < 16 || key.length > 200) throw new Error('IDEMPOTENCY_KEY_REQUIRED'); return key; }
