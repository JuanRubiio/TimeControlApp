import { describe, expect, it } from 'vitest';
import { readRecovery } from '../src/ui/read-recovery';

describe('recuperación segura de lecturas', () => {
  it('ofrece sólo acceso de sesión para 401', () => expect(readRecovery(401)).toEqual({kind:'session-expired',message:'Tu sesión ha finalizado. Vuelve a acceder para continuar.',canRetry:false}));
  it.each([403,404])('agrupa %s sin enumerar el recurso', status => expect(readRecovery(status)).toEqual({kind:'forbidden',message:'No puedes acceder a esta información o ya no está disponible.',canRetry:false}));
  it.each([undefined,0,409,500])('permite un único reintento contextual para %s', status => expect(readRecovery(status)).toEqual({kind:'recoverable',message:'No se pudo cargar la información. Puedes reintentar la consulta.',canRetry:true}));
});
