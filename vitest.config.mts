import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Vitest runs the pure logic and the component contracts.
 *
 * Three deliberate choices:
 *  - `.mts`, not `.ts`: the package has no `"type": "module"`, so a `.ts`
 *    config is loaded as CommonJS and Vite warns that the ESM syntax in it
 *    is unsupported by the native loader it plans to make the default.
 *  - `globals: false` keeps `describe`/`it`/`expect` out of the ambient
 *    scope, so no `vitest/globals` types are needed in `tsconfig` and the
 *    files stay ordinary TypeScript that `next build` also type-checks.
 *    `vitest.setup.ts` registers the cleanup RTL would otherwise miss.
 *  - The `@` alias mirrors `tsconfig.json`'s `paths`, otherwise every
 *    component import resolves against the wrong root.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
});
