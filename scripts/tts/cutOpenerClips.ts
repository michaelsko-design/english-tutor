/**
 * Makes the opener and rest clips of HEBREW_OPENERS from the clips already rendered whole, instead
 * of rendering them again: each whole clip is cut at the pause after its opener. No API calls.
 *   npm run tts:cut:he -- dry     report only
 *   npm run tts:cut:he            write the clips that are still missing
 * "מעולה!" itself is not cut (its girl and boy clips are rendered), but the rest of its lines is.
 * A clip whose opener is not of the usual length (a missed or extra pause) is left for rendering.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { addListenerGender, englishRestOf, getClipKey, getClipText, HEBREW_VOICE, parseListenerGender, splitHebrewOpener } from '../../src/services/tts/ttsText';
import { getVoiceDir } from './clipManifest';
import { collectCorpus, collectWholeLineHebrewCorpus } from './corpus';
import { median, openerLength, openerRange, parseSilences, pauseNearUsual, pausesAfterLead, restStart, type Pause } from './openerCut';

const GENDERED_OPENER = 'מעולה!';
const SILENCE_FILTER = 'silencedetect=noise=-35dB:d=0.12';
const isDry = process.argv.includes('dry');
const dir = getVoiceDir(HEBREW_VOICE);
const pathOf = (key: string) => join(dir, `${key}.mp3`);

interface Whole {
  opener: string;
  text: string;
  wholeKey: string;
  openerKey: string;
  restKey: string;
  /** Every pause after the opening silence */
  pauses: Pause[];
}

function detectPauses(path: string): Pause[] {
  const run = spawnSync('ffmpeg', ['-hide_banner', '-i', path, '-af', SILENCE_FILTER, '-f', 'null', '-'], { encoding: 'utf8' });
  return pausesAfterLead(parseSilences(run.stderr ?? ''));
}

/** Writes `from`–`to` (seconds; `to` omitted: the end) of a clip as a 48 kbps mono MP3, through a temp file. */
function cutClip(source: string, target: string, from: number, to?: number): void {
  const temp = `${target}.tmp.mp3`;
  const range = ['-ss', from.toFixed(3), ...(to === undefined ? [] : ['-to', to.toFixed(3)])];
  const run = spawnSync('ffmpeg', ['-hide_banner', '-y', '-i', source, ...range, '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '48k', temp], { encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`ffmpeg failed for ${target}: ${run.stderr?.slice(-200)}`);
  renameSync(temp, target);
}

interface Candidate {
  opener: string;
  text: string;
  wholeKey: string;
  openerKey: string;
  restKey: string;
}

function candidates(): Candidate[] {
  const wanted = new Set(collectCorpus(HEBREW_VOICE).map((phrase) => phrase.key));
  const found: Candidate[] = [];
  for (const phrase of collectWholeLineHebrewCorpus()) {
    if (phrase.speed !== 'normal') continue;
    const { gender, text } = parseListenerGender(phrase.text);
    const split = splitHebrewOpener(text);
    if (!split || englishRestOf(split.rest)) continue;
    const isGenderedOpener = split.opener === GENDERED_OPENER;
    // "מעולה!" was rendered whole before it was gendered: that clip (neutral text) is cut, for rests with no gendered word
    const isRestGendered = addListenerGender(split.rest, 'girl') !== split.rest;
    if (isGenderedOpener && isRestGendered) continue;
    const wholeKey = isGenderedOpener ? getClipKey(text, 'normal') : phrase.key;
    if (!existsSync(pathOf(wholeKey))) continue;
    // Keyed as the corpus does: the part's clip text first (a lone word loses its punctuation), then the gender tag
    const openerText = getClipText(split.opener);
    const openerKey = getClipKey(isGenderedOpener ? addListenerGender(openerText, gender ?? 'girl') : openerText, 'normal');
    const restKey = getClipKey(addListenerGender(getClipText(split.rest), isGenderedOpener ? null : gender), 'normal');
    // The keys must be the ones the split corpus asks for
    if (wanted.has(openerKey) && wanted.has(restKey)) found.push({ opener: split.opener, text, wholeKey, openerKey, restKey });
  }
  return found;
}

function main(): void {
  mkdirSync(dir, { recursive: true });
  const all: Whole[] = [];
  for (const item of candidates()) {
    const pauses = detectPauses(pathOf(item.wholeKey));
    if (pauses.length > 0) all.push({ ...item, pauses });
  }
  const openers = [...new Set(all.map((whole) => whole.opener))];
  let cutRests = 0;
  const leftOver: string[] = [];
  for (const opener of openers) {
    const lines = all.filter((whole) => whole.opener === opener);
    // The usual opener length: the median over the first pause of each clip; then each clip's own pause is the one nearest it
    const usual = median(lines.map((whole) => openerLength(whole.pauses[0] as Pause)));
    const picked = lines.map((whole) => ({ whole, pause: pauseNearUsual(whole.pauses, usual) }));
    const typical = picked.filter((entry): entry is { whole: Whole; pause: Pause } => entry.pause !== null);
    // The opener clip: the whole clip whose opener is closest to the usual length
    const best = [...typical].sort((a, b) => Math.abs(openerLength(a.pause) - usual) - Math.abs(openerLength(b.pause) - usual))[0];
    if (best && !existsSync(pathOf(best.whole.openerKey)) && !isDry) {
      const { from, to } = openerRange(best.pause);
      cutClip(pathOf(best.whole.wholeKey), pathOf(best.whole.openerKey), from, to);
    }
    for (const { whole, pause } of typical) {
      if (existsSync(pathOf(whole.restKey))) continue;
      if (!isDry) cutClip(pathOf(whole.wholeKey), pathOf(whole.restKey), restStart(pause));
      cutRests += 1;
    }
    const rejected = picked.filter((entry) => entry.pause === null).map((entry) => entry.whole);
    leftOver.push(...rejected.map((whole) => whole.text));
    console.log(`${opener}  ${lines.length} lines, usual opener ${usual.toFixed(2)}s, ${typical.length} cut, ${rejected.length} left for rendering`);
  }
  console.log(`${isDry ? 'Would cut' : 'Cut'} ${cutRests} rest clips and ${openers.length} opener clips.`);
  if (leftOver.length) console.log(`Left for rendering (odd opener length):\n${leftOver.slice(0, 40).join('\n')}`);
}

main();
