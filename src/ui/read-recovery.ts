export type ReadRecoveryKind = 'recoverable' | 'session-expired' | 'forbidden';

export type ReadRecovery = {
  kind: ReadRecoveryKind;
  message: string;
  canRetry: boolean;
};

const messages: Record<ReadRecoveryKind, string> = {
  recoverable: 'No se pudo cargar la información. Puedes reintentar la consulta.',
  'session-expired': 'Tu sesión ha finalizado. Vuelve a acceder para continuar.',
  forbidden: 'No puedes acceder a esta información o ya no está disponible.'
};

export function readRecovery(status?: number): ReadRecovery {
  const kind: ReadRecoveryKind = status === 401 ? 'session-expired' : status === 403 || status === 404 ? 'forbidden' : 'recoverable';
  return { kind, message: messages[kind], canRetry: kind === 'recoverable' };
}
