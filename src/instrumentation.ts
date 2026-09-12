export async function register() {
  (await import('./time-calculation/outbox-worker')).startCalculationOutboxWorker();
}
