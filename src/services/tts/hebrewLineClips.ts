import { voiceForListener } from './hebrewListener';
import { getClipKey, getClipText, hebrewLineParts, type ListenerGender } from './ttsText';

/** A clip of a line said in parts: 'he' a clip of the Hebrew voice, 'en' of the English voice. */
export interface LineClip {
  voice: 'he' | 'en';
  key: string;
}

/**
 * The clip keys of a Hebrew line said in parts (hebrewLineParts), for this learner: the same keys
 * the corpus renders (a part's clip text, then its gender tag). Null for a line said as one clip.
 */
export function hebrewLineClips(text: string, gender: ListenerGender | null): LineClip[] | null {
  const parts = hebrewLineParts(text);
  if (!parts) return null;
  return parts.map((part) =>
    part.voice === 'en'
      ? { voice: 'en', key: getClipKey(part.text, 'normal') }
      : { voice: 'he', key: getClipKey(voiceForListener(getClipText(part.text), gender), 'normal') },
  );
}
