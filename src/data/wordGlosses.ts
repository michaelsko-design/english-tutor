import { lookupTranslationHe } from './customWordLists';
import { getWordGlosses, WordGloss } from '../utils/hints';
import { EXTRA_WORD_TRANSLATIONS_HE } from './wordGlossesExtra';

/** Small words the curriculum vocabulary does not list, so a sentence hint can still translate them. */
const FUNCTION_WORD_TRANSLATIONS_HE: Readonly<Record<string, string>> = {
  a: 'אחד / אחת',
  an: 'אחד / אחת',
  the: 'ה (היידוע)',
  i: 'אני',
  you: 'אתה / את / אתם',
  he: 'הוא',
  she: 'היא',
  it: 'זה / זו',
  we: 'אנחנו',
  they: 'הם / הן',
  my: 'שלי',
  your: 'שלך',
  his: 'שלו',
  her: 'שלה',
  our: 'שלנו',
  their: 'שלהם',
  is: 'הוא / היא (נמצא)',
  am: 'אני (נמצא)',
  are: 'הם / אתם (נמצאים)',
  was: 'היה / הייתה',
  were: 'היו',
  have: 'יש / יש לי',
  has: 'יש לו / לה',
  do: 'לעשות',
  does: 'עושה',
  can: 'יכול / יכולה',
  not: 'לא',
  and: 'ו',
  or: 'או',
  but: 'אבל',
  in: 'ב',
  on: 'על',
  at: 'ב',
  to: 'ל',
  of: 'של',
  for: 'בשביל',
  with: 'עם',
  from: 'מ',
  this: 'זה',
  that: 'ההוא / ש',
  there: 'שם / יש',
  here: 'כאן',
  what: 'מה',
  where: 'איפה',
  who: 'מי',
  when: 'מתי',
  why: 'למה',
  how: 'איך',
  very: 'מאוד',
  too: 'גם / מדי',
  like: 'אוהב / כמו',
  want: 'רוצה',
};

/** Hebrew for one English word: the curriculum vocabulary first, then the small-words list, then the sentence words. */
export function lookupWordGlossHe(wordEn: string): string | undefined {
  const key = wordEn.trim().toLowerCase().replace(/[’‘]/g, "'");
  return lookupTranslationHe(key) ?? FUNCTION_WORD_TRANSLATIONS_HE[key] ?? EXTRA_WORD_TRANSLATIONS_HE[key];
}

/** The tappable translation words for a sentence-builder hint; `vocabulary` wins over the lists. */
export function getSentenceHintWords(words: string[], vocabulary: ReadonlyArray<WordGloss> = []): WordGloss[] {
  return getWordGlosses(words, lookupWordGlossHe, vocabulary);
}
