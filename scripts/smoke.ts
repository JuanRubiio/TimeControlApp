import { execFileSync } from 'node:child_process';

const run=(args:string[]) => execFileSync(process.execPath,args,{stdio:'inherit'});
run(['node_modules/vitest/vitest.mjs','run','tests/qa-demo.test.ts','tests/qa-contracts.test.ts','tests/permissions.test.ts','tests/company-people.test.ts','tests/work-rules.test.ts','tests/time-events.test.ts']);
run(['node_modules/typescript/bin/tsc','--noEmit']);
