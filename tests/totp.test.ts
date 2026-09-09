import { describe, expect, it } from 'vitest';
import { createTotpSecret, verifyTotp } from '../src/auth/totp';
import * as OTPAuth from 'otpauth';
describe('MFA TOTP', () => it('acepta un código actual y rechaza otro', () => { const secret=createTotpSecret(); const code=new OTPAuth.TOTP({secret,algorithm:'SHA1',digits:6,period:30}).generate(); expect(verifyTotp(secret,code)).toBe(true); expect(verifyTotp(secret,'000000')).toBe(false); }));
