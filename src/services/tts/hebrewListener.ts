import { resolveGenderSlashes } from '../../utils/hebrewGender';
import { addListenerGender, type ListenerGender } from './ttsText';

/**
 * A Hebrew line as it is said to this learner: boy/girl pairs in their form ("משחק/ת" is mesacheket
 * for a girl), and tagged with their gender when a word in it reads by gender ("בנית"). The same
 * text the clip corpus renders (scripts/tts/corpusBuilder.ts), so it finds the learner's clip.
 */
export function voiceForListener(text: string, gender: ListenerGender | null): string {
  if (!gender) return text;
  return addListenerGender(resolveGenderSlashes(text, gender), gender);
}
