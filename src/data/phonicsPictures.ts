import { ALPHABET } from './alphabet';
import { BLEND_WORDS } from './blendingWords';
import { getVocabPictureId } from '../components/art/vocabPictureIds';

const PICTURE_WORDS: readonly { en: string; he: string; emoji: string }[] = [
  ...BLEND_WORDS.map((w) => ({ en: w.word, he: w.he, emoji: w.emoji })),
  ...ALPHABET.flatMap((letter) => letter.words),
];

/**
 * The drawn picture behind a grade 1 picture emoji (🐔 → hen), for answers given only as an emoji
 * (first sentences, lesson quick tries). Undefined when no grade 1 word uses it or it isn't drawn yet.
 */
export function getPhonicsPictureId(emoji: string): string | undefined {
  const word = PICTURE_WORDS.find((w) => w.emoji === emoji);
  return word && getVocabPictureId(word.en, word.he);
}
