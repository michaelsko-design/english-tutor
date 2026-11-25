/**
 * Review page for the Hebrew read-aloud clips (npm run tts:review:he). Plays each clip next to the
 * line it should read; you mark it good or regenerate. Marks are kept in scripts/tts/hebrewReview.json,
 * so you can stop any time and a later run opens at the first clip not judged yet. A clip that was
 * replaced, or newly rendered, is unjudged again; the others never come back.
 *
 * Marking renders nothing. After a sitting:
 *   npm run tts:render:he -- regenerate   one batch for everything marked
 *   npm run tts:render:he -- status | collect   new takes land in .tts-candidates, the originals stay
 * then open this page again: the Compare tab plays the current and the new take. "New is better"
 * replaces the clip (and bumps its revision, src/services/tts/clipRevisions.ts); the page then
 * reminds you to run  npm run tts:upload -- --force  and commit.
 * On the phone: `npm run tts:review:he -- sync` sends the lines and marks to the online page and takes
 * the marks made there (docs/hebrew-review-phone.md); this page also syncs after every mark.
 * The "Cut line clips" list holds the clips cut before a shared closer; each plays alone, with its full
 * lines (opener + clip + closer) shown below it to play on request (L).
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { join } from 'node:path';
import { HEBREW_VOICE } from '../../src/services/tts/ttsText';
import { bumpClipRevisions, unbumpClipRevisions } from './clipRevisions';
import { toGeminiText } from './geminiSpelling';
import { getVoiceDir } from './clipManifest';
import { buildReviewCatalog, byWalkOrder } from './hebrewReviewCatalog';
import { getReviewDirs } from './hebrewReviewPaths';
import { REVIEW_GROUPS } from './hebrewReviewOrder';
import { createCoalescedRunner, syncMarks } from './hebrewReviewSync';
import { createCloudClient, readCloudConfig } from './reviewCloudClient';
import { publishSnapshot, runCloudCommand } from './reviewCloudCommands';
import {
  candidatePath,
  clipPath,
  decideCandidate,
  isTakeName,
  listReviewItems,
  listUndoable,
  loadState,
  markClip,
  MAX_NOTE_LENGTH,
  REVIEW_REASONS,
  saveState,
  undoDecision,
  type ReviewDecision,
  type ReviewDetail,
  type ReviewReason,
  type ReviewStatus,
} from './hebrewReviewState';

const HOST = '127.0.0.1';
/** PORT is set by a preview that found 5290 taken. */
const PORT = Number(process.env.PORT) || 5290;
const MAX_BODY_BYTES = 4096;
const DECISIONS: readonly ReviewDecision[] = ['new', 'old', 'again'];
const STATUSES: readonly (ReviewStatus | null)[] = ['good', 'regenerate', null];
const PAGE_PATH = join(process.cwd(), 'scripts', 'tts', 'reviewPage.html');
const SHARED_SCRIPT_PATH = join(process.cwd(), 'scripts', 'tts', 'reviewWorker', 'public', 'reviewShared.js');

const dirs = getReviewDirs();
const catalog = buildReviewCatalog();
const { phrases, wholeLines } = catalog;
const knownKeys = new Set(phrases.map((phrase) => phrase.key));
const phraseByKey = new Map(phrases.map((phrase) => [phrase.key, phrase]));

const config = readCloudConfig();
const cloud = config ? createCloudClient(config) : null;
const warnSync = (error: unknown): void => console.warn(`Phone sync failed (marks are safe on this PC): ${error instanceof Error ? error.message : String(error)}`);
/** Sends the marks to the phone page and takes its marks; never holds up a click. */
const syncInBackground = createCoalescedRunner(async () => {
  if (cloud) await syncMarks(cloud, dirs);
}, warnSync);

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString('utf8');
      if (raw.length > MAX_BODY_BYTES) reject(new Error('Body too large.'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}') as Record<string, unknown>);
      } catch {
        reject(new Error('Bad JSON.'));
      }
    });
  });
}

function parseDetail(body: Record<string, unknown>): ReviewDetail {
  const reasons = Array.isArray(body.reasons) ? body.reasons : [];
  if (!reasons.every((reason): reason is ReviewReason => REVIEW_REASONS.includes(reason as ReviewReason))) throw new Error('Bad reason.');
  const note = typeof body.note === 'string' ? body.note : '';
  if (note.length > MAX_NOTE_LENGTH) throw new Error('Note too long.');
  return { reasons: [...new Set(reasons)], note };
}

const englishPartKeys = new Set(wholeLines.flatMap((line) => line.parts.filter((part) => part.voice === 'en').map((part) => part.key)));
const MAX_LINE_MATCHES = 30;

/** An English rest ("The king has a gold crown.") is an Azure clip of the English voice. */
function sendEnglishClip(res: ServerResponse, key: string): void {
  const path = join(getVoiceDir('female'), `${key}.mp3`);
  if (!englishPartKeys.has(key) || !existsSync(path)) return sendJson(res, 404, { error: 'No such clip.' });
  res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': statSync(path).size, 'Cache-Control': 'no-store' });
  res.end(readFileSync(path));
}

/** Lines that open with a shared opener, to play the opener and the rest back to back. */
function matchingLines(query: string): unknown[] {
  const needle = query.trim().toLowerCase();
  return wholeLines
    .filter((line) => !needle || line.text.toLowerCase().includes(needle))
    .slice(0, MAX_LINE_MATCHES)
    .map((line) => ({
      text: line.text,
      spoken: toGeminiText(line.text),
      parts: line.parts.map((part) => ({ ...part, isMissing: !existsSync(part.voice === 'he' ? clipPath(dirs, part.key) : join(getVoiceDir('female'), `${part.key}.mp3`)) })),
    }));
}

function sendClip(res: ServerResponse, url: URL): void {
  const key = decodeURIComponent(url.pathname.slice('/clip/'.length)).replace(/\.mp3$/, '');
  if (url.searchParams.get('voice') === 'en') return sendEnglishClip(res, key);
  const take = url.searchParams.get('take') ?? 'current';
  if (take !== 'current' && !isTakeName(take)) return sendJson(res, 400, { error: 'Bad take.' });
  const path = take === 'current' ? clipPath(dirs, key) : candidatePath(dirs, key, take);
  if (!knownKeys.has(key) || !existsSync(path)) return sendJson(res, 404, { error: 'No such clip.' });
  res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': statSync(path).size, 'Cache-Control': 'no-store' });
  res.end(readFileSync(path));
}

async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  if (url.pathname === '/api/lines') return sendJson(res, 200, { lines: matchingLines(url.searchParams.get('q') ?? '') });
  if (url.pathname === '/api/clips') {
    // The walk order: general lines, core units, the Pro tail, then the packs; unplaced lines last
    const items = listReviewItems(phrases, loadState(dirs.statePath), dirs)
      .map((item) => ({ ...item, ...catalog.describe(phraseByKey.get(item.key) ?? item) }))
      .sort(byWalkOrder);
    return sendJson(res, 200, { items, groups: [...REVIEW_GROUPS, 'opener'], reasons: REVIEW_REASONS, maxNote: MAX_NOTE_LENGTH, undoable: listUndoable(dirs) });
  }
  const body = await readBody(req);
  const key = String(body.key ?? '');
  if (!knownKeys.has(key)) return sendJson(res, 400, { error: 'Unknown clip.' });
  const state = loadState(dirs.statePath);
  if (url.pathname === '/api/mark') {
    const status = (body.status ?? null) as ReviewStatus | null;
    if (!STATUSES.includes(status)) return sendJson(res, 400, { error: 'Bad status.' });
    saveState(dirs.statePath, markClip(dirs, state, key, status, parseDetail(body)));
    void syncInBackground();
    return sendJson(res, 200, { ok: true });
  }
  if (url.pathname === '/api/decide') {
    const decision = body.decision as ReviewDecision;
    if (!DECISIONS.includes(decision)) return sendJson(res, 400, { error: 'Bad decision.' });
    const take = typeof body.take === 'string' && isTakeName(body.take) ? body.take : undefined;
    const result = decideCandidate(dirs, state, key, decision, take);
    if (result.isReplaced) bumpClipRevisions(HEBREW_VOICE, [key]);
    saveState(dirs.statePath, result.state);
    void syncInBackground();
    return sendJson(res, 200, { ok: true, isReplaced: result.isReplaced });
  }
  if (url.pathname === '/api/undo') {
    const result = undoDecision(dirs, state, key);
    if (result.wasReplaced) unbumpClipRevisions(HEBREW_VOICE, [key]);
    saveState(dirs.statePath, result.state);
    void syncInBackground();
    return sendJson(res, 200, { ok: true, wasReplaced: result.wasReplaced });
  }
  return sendJson(res, 404, { error: 'Not found.' });
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://${HOST}:${PORT}`);
  const origin = req.headers.origin;
  if (origin && origin !== `http://${HOST}:${PORT}` && origin !== `http://localhost:${PORT}`) {
    return sendJson(res, 403, { error: 'Foreign origin.' });
  }
  if (req.method === 'POST' && !req.headers['content-type']?.startsWith('application/json')) {
    return sendJson(res, 415, { error: 'JSON only.' });
  }
  if (url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    return void res.end(readFileSync(PAGE_PATH));
  }
  if (url.pathname === '/reviewShared.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
    return void res.end(readFileSync(SHARED_SCRIPT_PATH));
  }
  if (url.pathname.startsWith('/clip/')) return sendClip(res, url);
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url).catch((error: unknown) => {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'Failed.' });
    });
    return;
  }
  sendJson(res, 404, { error: 'Not found.' });
});

function startServer(): void {
  server.listen(PORT, HOST, () => {
    console.log(`Hebrew clip review: http://localhost:${PORT}  (Ctrl+C to stop; marks are saved as you go)`);
    if (!cloud) return console.log('Phone review is not set up (docs/hebrew-review-phone.md): marks stay on this PC.');
    // Phone marks first, so the page opens with them; the snapshot for the phone can take a while
    void syncInBackground().then(() => publishSnapshot(cloud, catalog)).catch(warnSync);
  });
}

const [command] = process.argv.slice(2).filter((arg) => arg !== '--');
if (command) {
  runCloudCommand(command, catalog).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
} else {
  startServer();
}
