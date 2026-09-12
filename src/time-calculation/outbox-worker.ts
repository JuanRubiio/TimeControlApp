import { logEvent } from '@/shared/observability';
import { processCalculationOutbox } from './outbox';

const intervalMs = 60_000;
const workerKey = Symbol.for('time-control.s19.outbox-worker');

/** One worker per dedicated Node process; it contains no tenant, event or secret in logs. */
export function startCalculationOutboxWorker() {
  const runtime = globalThis as typeof globalThis & { [workerKey]?: NodeJS.Timeout };
  if (runtime[workerKey]) return;
  const run = async () => {
    try { const result = await processCalculationOutbox(); if (result.processed) logEvent('info', 'time_calculation.outbox.processed', { processed: result.processed }); }
    catch { logEvent('error', 'time_calculation.outbox.failed'); }
  };
  runtime[workerKey] = setInterval(() => { void run(); }, intervalMs);
  void run();
}
