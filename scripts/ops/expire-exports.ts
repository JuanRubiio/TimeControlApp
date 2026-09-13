import { expireDueExports } from '@/exports/retention';

expireDueExports().then((result) => {
  console.log(JSON.stringify({ operation: 'export-retention', ...result }));
}).catch((error) => {
  console.error('Export retention failed:', error instanceof Error ? error.message : 'unknown error');
  process.exitCode = 1;
});
