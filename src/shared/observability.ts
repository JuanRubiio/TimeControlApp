type LogContext = Record<string, boolean | number | string | undefined>;

const sensitiveKey = /authorization|cookie|email|password|pepper|secret|token|database_url|connection/i;

export function safeLogContext(context: LogContext): Record<string, boolean | number | string> {
  return Object.fromEntries(Object.entries(context)
    .filter(([key, value]) => value !== undefined && !sensitiveKey.test(key)) as Array<[string, boolean | number | string]>);
}

export function logEvent(level: 'error' | 'info' | 'warn', event: string, context: LogContext = {}) {
  const payload = { timestamp: new Date().toISOString(), level, event, ...safeLogContext(context) };
  console[level](JSON.stringify(payload));
}

export const metricsText = (dbUp: boolean) => [
  '# HELP time_control_application_up Whether the application can reach its dedicated database.',
  '# TYPE time_control_application_up gauge',
  `time_control_application_up ${dbUp ? 1 : 0}`,
  '# HELP time_control_build_info Static application build marker.',
  '# TYPE time_control_build_info gauge',
  'time_control_build_info{service="time-control"} 1'
].join('\n') + '\n';
