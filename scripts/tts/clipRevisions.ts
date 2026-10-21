/** Bumps the revision of re-rendered clips in src/services/tts/clipRevisions.ts (see its header). */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CLIP_REVISIONS } from '../../src/services/tts/clipRevisions';

const REVISIONS_FILE = join(process.cwd(), 'src', 'services', 'tts', 'clipRevisions.ts');
const FIRST_RE_RENDER_REVISION = 2;
const MAP_PATTERN = /(CLIP_REVISIONS: Readonly<Record<string, number>> = )\{[^}]*\}/;

export function bumpClipRevisions(voice: string, keys: readonly string[]): void {
  const next = { ...CLIP_REVISIONS };
  for (const key of keys) {
    const id = `${voice}/${key}`;
    next[id] = (next[id] ?? FIRST_RE_RENDER_REVISION - 1) + 1;
  }
  const body = Object.keys(next)
    .sort()
    .map((id) => `  '${id}': ${next[id]},\n`)
    .join('');
  writeFileSync(REVISIONS_FILE, readFileSync(REVISIONS_FILE, 'utf8').replace(MAP_PATTERN, `$1{\n${body}}`));
}
