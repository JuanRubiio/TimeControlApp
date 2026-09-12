import { execFileSync } from 'node:child_process';

const run=(args:string[]) => execFileSync(process.execPath,args,{stdio:'inherit'});
// La smoke cubre todas las suites integradas S1–S19; no mantiene una lista parcial obsoleta.
run(['node_modules/vitest/vitest.mjs','run']);
run(['node_modules/typescript/bin/tsc','--noEmit']);
