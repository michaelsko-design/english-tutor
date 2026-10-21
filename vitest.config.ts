import { resolve } from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { 'emoji-jsx': resolve(__dirname, 'src/emojiJsx') } },
  esbuild: { jsx: 'automatic', jsxImportSource: 'emoji-jsx' },
  test: {
    // .claude/worktrees holds stale checkouts of the repo; their tests must not run here.
    exclude: [...configDefaults.exclude, '.claude/**', 'node_modules/**', 'dist/**'],
  },
});
