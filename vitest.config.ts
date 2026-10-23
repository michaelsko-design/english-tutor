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
