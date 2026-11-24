/**
 * Makes the part clips of the lines said in parts (hebrewLineParts: opener, own text, shared closer
 * "נסי שוב!") by cutting the clips already rendered whole,
 * instead of rendering them again. No API calls.
 *   npm run tts:cut:he:parts -- dry   report only
 *   npm run tts:cut:he:parts          write the missing part clips, then the manifest
 * The shared parts themselves (openers, closers) are never cut here: they are one picked
 * take each. A line whose joins have no clear pause is left for rendering (tts:render:he -- submit).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { voiceForListener } from '../../src/services/tts/hebrewListener';
import { hebrewLineClips } from '../../src/services/tts/hebrewLineClips';
import {
  getClipKey,
  getClipText,
  HEBREW_CLOSERS,
  HEBREW_OPENERS,
  HEBREW_VOICE,
  hebrewLineParts,
  parseListenerGender,
  splitHebrewOpener,
  type ClipVoice,
  type ListenerGender,
} from '../../src/services/tts/ttsText';
import { getVoiceDir, listRenderedKeys, writeManifest } from './clipManifest';
import { collectCorpus, collectWholeLineHebrewCorpus } from './corpus';
import { parseSilences, type Silence } from './openerCut';
import { partRanges, speechLength, speechRuns, type Span } from './partCut';

const SILENCE_FILTER = 'silencedetect=noise=-35dB:d=0.1';
const isDry = process.argv.includes('dry');
const dir = getVoiceDir(HEBREW_VOICE);
const pathOf = (key: string) => join(dir, `${key}.mp3`);
const SHARED_TEXTS: ReadonlySet<string> = new Set([...HEBREW_OPENERS, ...HEBREW_CLOSERS].map((part) => getClipText(part)));

interface Piece {
  text: string;
  key: string;
}

interface Source {
  key: string;
  pieces: Piece[];
}

function analyse(path: string): { silences: Silence[]; duration: number } | null {
  const run = spawnSync('ffmpeg', ['-hide_banner', '-i', path, '-af', SILENCE_FILTER, '-f', 'null', '-'], { encoding: 'utf8' });
  const log = run.stderr ?? '';
  const match = /Duration: (\d+):(\d+):([\d.]+)/.exec(log);
  if (!match) return null;
  const duration = Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
  const silences = parseSilences(log);
  // A silence still running at the end of the clip has no silence_end line
  const starts = [...log.matchAll(/silence_start: (-?[\d.]+)/g)];
  if (starts.length > silences.length) silences.push({ start: Math.max(0, Number((starts[starts.length - 1] as RegExpMatchArray)[1])), end: duration });
  return { silences, duration };
}

const lengths = new Map<string, number | null>();

/** How long a shared part's own clip speaks (its picked take); null when it has no clip yet. */
function sharedLength(key: string): number | null {
  if (!lengths.has(key)) {
    const clip = existsSync(pathOf(key)) ? analyse(pathOf(key)) : null;
    lengths.set(key, clip ? speechLength(speechRuns(clip.silences, clip.duration)) : null);
  }
  return lengths.get(key) ?? null;
}

/** Writes `range` of a clip as a 48 kbps mono MP3, through a temp file. */
function cutClip(source: string, target: string, range: Span): void {
  const temp = `${target}.tmp.mp3`;
  const run = spawnSync('ffmpeg', ['-hide_banner', '-y', '-i', source, '-ss', range.start.toFixed(3), '-to', range.end.toFixed(3), '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '48k', temp], { encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`ffmpeg failed for ${target}: ${run.stderr?.slice(-200)}`);
  renameSync(temp, target);
}

/** The rendered clip a line's parts can be cut from: the whole line, or the rest after its opener (cut earlier). */
function sourceOf(phraseKey: string, text: string, gender: ListenerGender | null, pieces: Piece[], rendered: ReadonlySet<string>): Source | null {
  if (rendered.has(phraseKey)) return { key: phraseKey, pieces };
  const opened = splitHebrewOpener(text);
  if (!opened) return null;
  const restKey = getClipKey(voiceForListener(getClipText(opened.rest), gender), 'normal');
  return rendered.has(restKey) ? { key: restKey, pieces: pieces.slice(1) } : null;
}

function main(): void {
  const rendered = listRenderedKeys(HEBREW_VOICE);
  const made = new Set<string>();
  const leftOver: string[] = [];
  let noSource = 0;
  let cut = 0;
  for (const phrase of collectWholeLineHebrewCorpus()) {
    if (phrase.speed !== 'normal') continue;
    const { gender, text } = parseListenerGender(phrase.text);
    const parts = hebrewLineParts(text);
    const clips = hebrewLineClips(text, gender);
    // Only lines with a shared closer: the opener-only lines are tts:cut:he's
    const hasCloser = parts?.some((part, index) => index > 0 && SHARED_TEXTS.has(getClipText(part.text)));
    if (!parts || !clips || !hasCloser || parts.some((part) => part.voice === 'en')) continue;
    const pieces = parts.map((part, index) => ({ text: part.text, key: (clips[index] as { key: string }).key }));
    const isShared = (piece: Piece) => SHARED_TEXTS.has(getClipText(piece.text));
    const isWanted = (piece: Piece) => !isShared(piece) && !rendered.has(piece.key) && !made.has(piece.key);
    if (!pieces.some(isWanted)) continue;
    const source = sourceOf(phrase.key, text, gender, pieces, rendered);
    const clip = source ? analyse(pathOf(source.key)) : null;
    const known = source?.pieces.map((piece) => (isShared(piece) ? sharedLength(piece.key) : null)) ?? [];
    // A shared part without its own clip can't be measured: the line waits for it
    const isMeasured = known.filter((length) => length === null).length === 1;
    const ranges = source && clip && isMeasured ? partRanges(speechRuns(clip.silences, clip.duration), known, clip.duration) : null;
    if (!source || !ranges) {
      if (!source) noSource += 1;
      leftOver.push(phrase.text);
      continue;
    }
    source.pieces.forEach((piece, index) => {
      if (!isWanted(piece)) return;
      if (!isDry) cutClip(pathOf(source.key), pathOf(piece.key), ranges[index] as Span);
      made.add(piece.key);
      cut += 1;
    });
  }
  console.log(`${isDry ? 'Would cut' : 'Cut'} ${cut} part clips; ${leftOver.length} lines left for rendering (${noSource} with no whole clip to cut, the rest with no clear pause).`);
  if (leftOver.length) console.log(leftOver.slice(0, 30).join('\n'));
  if (isDry) return;
  const keyCache = new Map<ClipVoice, Set<string>>();
  const manifest = writeManifest((voice) => {
    if (!keyCache.has(voice)) keyCache.set(voice, new Set(collectCorpus(voice).map((phrase) => phrase.key)));
    return keyCache.get(voice) as Set<string>;
  });
  const missing = collectCorpus(HEBREW_VOICE).filter((phrase) => !existsSync(pathOf(phrase.key)));
  console.log(`Manifest: he-female ${manifest.voices[HEBREW_VOICE]?.length ?? 0}; ${missing.length} Hebrew clips still to render.`);
}

main();
