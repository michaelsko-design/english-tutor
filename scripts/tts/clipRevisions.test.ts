import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const TEMPLATE = `export const CLIP_REVISIONS: Readonly<Record<string, number>> = {
  'he-female/old': 2,
};
`;

async function loadInTempProject() {
  const root = mkdtempSync(join(tmpdir(), 'revisions-'));
  mkdirSync(join(root, 'src', 'services', 'tts'), { recursive: true });
  const file = join(root, 'src', 'services', 'tts', 'clipRevisions.ts');
  writeFileSync(file, TEMPLATE);
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.resetModules();
  const module = await import('./clipRevisions');
  return { file, ...module };
}

describe('bumpClipRevisions', () => {
  afterEach(() => vi.restoreAllMocks());

  it('keeps every earlier bump when the same process bumps again (the review server stays open)', async () => {
    const { file, bumpClipRevisions } = await loadInTempProject();
    bumpClipRevisions('he-female', ['one']);
    bumpClipRevisions('he-female', ['two']);
    bumpClipRevisions('he-female', ['one']);
    const text = readFileSync(file, 'utf8');
    expect(text).toContain("'he-female/old': 2");
    expect(text).toContain("'he-female/one': 3");
    expect(text).toContain("'he-female/two': 2");
  });

  it('takes a bump back without losing the others', async () => {
    const { file, bumpClipRevisions, unbumpClipRevisions } = await loadInTempProject();
    bumpClipRevisions('he-female', ['one', 'two']);
    unbumpClipRevisions('he-female', ['one']);
    const text = readFileSync(file, 'utf8');
    expect(text).not.toContain('he-female/one');
    expect(text).toContain("'he-female/two': 2");
  });
});
