/**
 * The lines said in parts (a shared opener, the line's own text, a shared closer), as the player says
 * them: the part clips back to back. The review page plays these so you hear the joins, not the parts.
 * Same split and clip keys as hybridTtsService.findPartClips (hebrewLineClips).
 */
import { hebrewLineClips, type LineClip } from '../../src/services/tts/hebrewLineClips';
import { parseListenerGender } from '../../src/services/tts/ttsText';
import { collectWholeLineHebrewCorpus } from './corpus';

/** 'he' is a Gemini clip of the Hebrew voice, 'en' an Azure clip of the English voice. */
export type LinePart = LineClip;

export interface WholeLine {
  /** The line as the app asks for it, with its gender tag when it has one. */
  text: string;
  parts: LinePart[];
}

/** The clips of a line said in parts; null for a line that is one clip. */
export function partsOfLine(text: string): LinePart[] | null {
  const { gender, text: plain } = parseListenerGender(text);
  return hebrewLineClips(plain, gender);
}

export function buildWholeLines(): WholeLine[] {
  return collectWholeLineHebrewCorpus()
    .filter((phrase) => phrase.speed === 'normal')
    .flatMap((phrase) => {
      const parts = partsOfLine(phrase.text);
      return parts ? [{ text: phrase.text, parts }] : [];
    });
}
