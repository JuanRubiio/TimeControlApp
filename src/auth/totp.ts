import * as OTPAuth from 'otpauth';
export function createTotpSecret() { return new OTPAuth.Secret({ size: 20 }).base32; }
function totp(secret: string) { return new OTPAuth.TOTP({ issuer: 'Control horario', label: 'Administrador', algorithm: 'SHA1', digits: 6, period: 30, secret }); }
export function totpUri(secret: string, email: string) { const token = new OTPAuth.TOTP({ issuer: 'Control horario', label: email, algorithm: 'SHA1', digits: 6, period: 30, secret }); return token.toString(); }
export function verifyTotp(secret: string, token: string) { return totp(secret).validate({ token, window: 1 }) !== null; }
