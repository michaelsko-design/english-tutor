import { resolve } from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

const shared = {
  resolve: { alias: { 'emoji-jsx': resolve(__dirname, 'src/emojiJsx') } },
  esbuild: { jsx: 'automatic' as const, jsxImportSource: 'emoji-jsx' },
};

// .claude/worktrees holds stale checkouts of the repo; their tests must not run here. e2e/ is Playwright's.
const exclude = [...configDefaults.exclude, '.claude/**', 'node_modules/**', 'dist/**', 'e2e/**'];

export default defineConfig({
  ...shared,
  test: {
    // npm run test:coverage. Curriculum content, fixtures and type-only files are left out so the number reflects logic.
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'api/**/*.ts'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
        'src/data/curriculum/**',
        'src/data/testing/**',
        'src/test/**',
        'api/_lib/testing/**',
        'src/main.tsx',
      ],
      reporter: ['text-summary', 'json-summary', 'html'],
      // Floors just under today's numbers (docs/audits/2026-10-code-security-audit.md): raise them as tests are added
      thresholds: {
        lines: 60,
        statements: 59,
        functions: 58,
        branches: 54,
        'api/**': { lines: 90 },
        'src/data/**': { lines: 95 },
        'src/utils/**': { lines: 85 },
      },
    },
    projects: [
      {
        ...shared,
        // The clip base URL is a deploy setting; tests expect the app's own /tts/ paths.
        test: { name: 'unit', environment: 'node', include: ['**/*.test.ts'], exclude, env: { VITE_TTS_CLIP_BASE_URL: '' } },
      },
      {
        // Component tests (Testing Library) render in jsdom
        ...shared,
        test: {
          name: 'components',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          exclude,
          setupFiles: ['src/test/setup.ts'],
          // Calls recorded on vi.fn mocks never carry over to the next test
          clearMocks: true,
          env: { VITE_TTS_CLIP_BASE_URL: '' },
        },
      },
    ],
  },
});
