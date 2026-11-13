/**
 * Which picture a vocabulary word shows on a "What is this?" card. Words with a picture drawn for
 * them (`VOCAB_PICTURE_IDS`, scripts/art/renderVocabPictures.mjs) show it; the emoji stays as the
 * fallback while the file loads or if it is missing. Abstract words, and words whose emoji shows
 * something else and have no drawing, get no picture: the card shows the Hebrew word instead
 * ("How do you say this in English?"). The vocabulary's own emoji stays for the word bank and
 * other places that use it as decoration.
 */
import { getVocabPictureId } from '../components/art/vocabPictureIds';

/** A clearer emoji than the vocabulary's own, used while there is no drawing. */
const EMOJI_REPLACEMENTS: Readonly<Record<string, string>> = {
  grandparents: '👵👴',
};

/** Words a picture can't show: always the Hebrew word. */
export const ABSTRACT_WORDS: ReadonlySet<string> = new Set([
  'always',
  'never',
  'usually',
  'sometimes',
  'because',
  'favorite',
  'arrive',
  'next to',
  'straight',
  'left',
  'up',
  'bigger',
  'faster',
  'fast',
  'interesting',
  'practice',
  'prepare',
  'visit',
  'yesterday',
  'hobby',
  'history',
  'protect',
  'comfortable',
  'excited',
  'outside',
  'zero', // an empty plate doesn't read as "zero"
]);

/** Words whose emoji shows something else: the Hebrew word unless a picture was drawn for them. */
const MISLEADING_EMOJI_WORDS: ReadonlySet<string> = new Set([
  'doll', // 🪆 a nesting doll
  'desk', // 🪑 the same picture as chair
  'carpet', // 🧶 a ball of yarn
  'card', // 💌 a love letter
  'jump', // 🦘 reads as "kangaroo"
  'fly', // 🦅 an eagle, 🦸 a superhero
  'high', // 🦅 an eagle
  'big', // 🐘 an elephant
  'little', // 🐦 a bird
  'brave', // 🦁 a lion
  'fluffy', // 🐑 a sheep
  'brother', // 👦 any boy
  'sister', // 👧 any girl
  'kitten', // 🐱 reads as "cat"
  'puppy', // 🐶 reads as "dog"
]);

interface PicturedWord {
  wordEn: string;
  translationHe?: string;
  emoji?: string;
}

export interface PictureCue {
  /** Shown on the card until the drawing loads, and if it is missing */
  emoji: string;
  /** The drawn picture's icon id (public/art/icons/<id>.webp), when there is one */
  pictureId?: string;
  /** False when the emoji shows something else: keep it out of text such as the answer feedback */
  isEmojiFitting: boolean;
}

/** The picture for a "What is this?" card, or undefined when the word should show its Hebrew instead. */
export function getPictureCue(word: PicturedWord): PictureCue | undefined {
  const key = word.wordEn.trim().toLowerCase();
  if (ABSTRACT_WORDS.has(key)) return undefined;
  const emoji = EMOJI_REPLACEMENTS[key] ?? word.emoji;
  if (!emoji) return undefined;
  const isEmojiFitting = !MISLEADING_EMOJI_WORDS.has(key);
  const pictureId = getVocabPictureId(word.wordEn, word.translationHe);
  if (pictureId) return { emoji, pictureId, isEmojiFitting };
  return isEmojiFitting ? { emoji, isEmojiFitting } : undefined;
}
