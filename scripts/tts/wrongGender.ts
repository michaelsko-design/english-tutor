/**
 * Drops the clips the app never asks for. A line with a word that reads by gender gets a girl clip
 * and a boy clip of the same text, but the app shows each learner text already worded for them
 * ("הקשיבי ובחרי" to a girl, "הקשב ובחר" to a boy), so a feminine text with a boy tag, or a masculine
 * text with a girl tag, is never played. Wording is told by inflectHebrew, the table the app inflects
 * with: a text it changes for a boy is feminine; a text that is the boy form of another corpus text is masculine.
 */
import { parseListenerGender } from '../../src/services/tts/ttsText';
import { inflectHebrew } from '../../src/utils/hebrewGender';
import type { CorpusPhrase } from './corpusBuilder';

export function dropWrongGender(phrases: CorpusPhrase[]): CorpusPhrase[] {
  const parsed = phrases.map((phrase) => ({ phrase, ...parseListenerGender(phrase.text) }));
  const masculine = new Set(
    [...new Set(parsed.filter((item) => item.gender).map((item) => item.text))]
      .map((text) => ({ text, boy: inflectHebrew(text, 'boy') }))
      .filter((pair) => pair.boy !== pair.text)
      .map((pair) => pair.boy),
  );
  return parsed
    .filter((item) => {
      if (item.gender === 'boy') return inflectHebrew(item.text, 'boy') === item.text;
      if (item.gender === 'girl') return !masculine.has(item.text);
      return true;
    })
    .map((item) => item.phrase);
}
