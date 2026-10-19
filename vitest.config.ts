import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // .claude/worktrees holds stale checkouts of the repo; their tests must not run here.
    exclude: [...configDefaults.exclude, '.claude/**', 'node_modules/**', 'dist/**'],
  },
});
