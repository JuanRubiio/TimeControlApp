import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve:{alias:{'@':path.resolve(__dirname,'src')}},
  test:{
    include:['tests/**/*.test.ts'],
    env:{
      DATABASE_URL:'postgresql://test:test@127.0.0.1:5432/test',
      ENVIRONMENT_ID:'00000000-0000-4000-8000-000000000001'
    }
  }
});
