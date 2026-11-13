/**
 * Which picture a vocabulary word shows on a "What is this?" card. A word whose emoji can't show it
 * clearly (an abstract word, or an emoji that reads as something else) gets no picture: the card
 * shows the Hebrew word instead ("How do you say this in English?"). The vocabulary's own emoji
 * stays for the word bank and other places that use it as decoration.
 */

/** A clearer picture than the vocabulary's emoji. */
const PICTURE_REPLACEMENTS: Readonly<Record<string, string>> = {
  grandparents: '👵👴',
};

/** Words that get the Hebrew word instead of a picture. */
const WORDS_WITHOUT_PICTURE: ReadonlySet<string> = new Set([
  // The emoji shows something else
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
  // Abstract words a picture can't show
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
]);

interface PicturedWord {
  wordEn: string;
  emoji?: string;
}

/** The picture for a "What is this?" card, or undefined when the word should show its Hebrew instead. */
export function getPictureCue(word: PicturedWord): string | undefined {
  const key = word.wordEn.trim().toLowerCase();
  if (WORDS_WITHOUT_PICTURE.has(key)) return undefined;
  return PICTURE_REPLACEMENTS[key] ?? (word.emoji || undefined);
}
