/** Bumps the revision of re-rendered clips in src/services/tts/clipRevisions.ts (see its header). */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REVISIONS_FILE = join(process.cwd(), 'src', 'services', 'tts', 'clipRevisions.ts');
const FIRST_RE_RENDER_REVISION = 2;
const ENTRY_PATTERN = /'([^']+)':\s*(\d+)/g;
const MAP_PATTERN = /(CLIP_REVISIONS: Readonly<Record<string, number>> = )\{[^}]*\}/;

export function bumpClipRevisions(voice: string, keys: readonly string[]): void {
  const next = readRevisions();
  for (const key of keys) {
    const id = `${voice}/${key}`;
    next[id] = (next[id] ?? FIRST_RE_RENDER_REVISION - 1) + 1;
  }
  writeRevisions(next);
}

/** Takes a bump back (an undone replacement): the first re-render's revision goes away again. */
export function unbumpClipRevisions(voice: string, keys: readonly string[]): void {
  const next = readRevisions();
  for (const key of keys) {
    const id = `${voice}/${key}`;
    if ((next[id] ?? 0) <= FIRST_RE_RENDER_REVISION) delete next[id];
    else next[id] = (next[id] as number) - 1;
  }
  writeRevisions(next);
}

/**
 * The revisions as the file holds them now, not as the process loaded them: the review server stays
 * open through many decisions, and each one must add to the earlier ones.
 */
function readRevisions(): Record<string, number> {
  const map = MAP_PATTERN.exec(readFileSync(REVISIONS_FILE, 'utf8'))?.[0] ?? '';
  return Object.fromEntries([...map.matchAll(ENTRY_PATTERN)].map((match) => [match[1] as string, Number(match[2])]));
}

function writeRevisions(next: Readonly<Record<string, number>>): void {
  const body = Object.keys(next)
    .sort()
    .map((id) => `  '${id}': ${next[id]},\n`)
    .join('');
  writeFileSync(REVISIONS_FILE, readFileSync(REVISIONS_FILE, 'utf8').replace(MAP_PATTERN, `$1{\n${body}}`));
}
