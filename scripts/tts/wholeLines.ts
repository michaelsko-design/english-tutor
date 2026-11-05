/**
 * The lines that open with a shared opener, as the player says them: the opener clip, then the
 * rest of the line, back to back. The review page plays these so you hear the join, not the parts.
 * Mirrors hybridTtsService.findOpenerClips (same split, same clip keys).
 */
import { voiceForListener } from '../../src/services/tts/hebrewListener';
import { englishRestOf, getClipKey, getClipText, parseListenerGender, splitHebrewOpener } from '../../src/services/tts/ttsText';
import { collectWholeLineHebrewCorpus } from './corpus';

export interface LinePart {
  /** 'he' is a Gemini clip of the Hebrew voice, 'en' an Azure clip of the English voice. */
  voice: 'he' | 'en';
  key: string;
}

export interface WholeLine {
  /** The line as the app asks for it, with its gender tag when it has one. */
  text: string;
  parts: [LinePart, LinePart];
}

/** The two clips of a line with an opener; null for a line that is one clip. */
export function partsOfLine(text: string): [LinePart, LinePart] | null {
  const { gender, text: plain } = parseListenerGender(text);
  const split = splitHebrewOpener(plain);
  if (!split) return null;
  const hebrewKey = (part: string): string => getClipKey(voiceForListener(getClipText(part), gender), 'normal');
  const english = englishRestOf(split.rest);
  return [
    { voice: 'he', key: hebrewKey(split.opener) },
    english ? { voice: 'en', key: getClipKey(english, 'normal') } : { voice: 'he', key: hebrewKey(split.rest) },
  ];
}

export function buildWholeLines(): WholeLine[] {
  return collectWholeLineHebrewCorpus()
    .filter((phrase) => phrase.speed === 'normal')
    .flatMap((phrase) => {
      const parts = partsOfLine(phrase.text);
      return parts ? [{ text: phrase.text, parts }] : [];
    });
}
