/**
 * Clips that were re-rendered after they shipped. A clip's file name is the hash of its text, so
 * a new take keeps its URL, and browsers (and the service worker) keep the old audio for a year.
 * Each entry adds `?r=<revision>` to that clip's URL so every device fetches the new take.
 * Written by `npm run tts:render:he -- redo` (scripts/tts/clipRevisions.ts); keyed `<voice>/<key>`.
 */
export const CLIP_REVISIONS: Readonly<Record<string, number>> = {
  'he-female/10z9uqmc0i': 2,
  'he-female/14x6k9vrdei': 2,
  'he-female/1apbzh1lw3o': 2,
  'he-female/lt3qmr46kb': 2,
};

/** The query to put after a clip's URL: empty for a clip that was never re-rendered. */
export function getClipRevisionQuery(voice: string, key: string): string {
  const revision = CLIP_REVISIONS[`${voice}/${key}`];
  return revision ? `?r=${revision}` : '';
}
