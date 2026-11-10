import type { WordDeck } from './types';

/**
 * A test-only deck (never imported by the app or the scripts), so the engine is tested before the
 * real decks are written. `season2-1` serves every grade; `holidays-spring` stands in for a Pro pack.
 */
export const FIXTURE_DECK: WordDeck = {
  id: 'test-food',
  packId: 'season2-1',
  topicEn: 'Food',
  topicHe: 'אוכל',
  items: [
    { wordEn: 'apple', translationHe: 'תפוח', partOfSpeech: 'n', exampleEn: 'I eat an apple.', exampleHe: 'אני אוכלת תפוח.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🍎' },
    { wordEn: 'bread', translationHe: 'לחם', partOfSpeech: 'n', exampleEn: 'We buy bread.', exampleHe: 'אנחנו קונים לחם.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🍞' },
    { wordEn: 'milk', translationHe: 'חלב', partOfSpeech: 'n', exampleEn: 'The milk is cold.', exampleHe: 'החלב קר.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🥛' },
    { wordEn: 'hungry', translationHe: 'רעב', partOfSpeech: 'adj', exampleEn: 'I am hungry.', exampleHe: 'אני רעב.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '😋' },
    { wordEn: 'ice cream', translationHe: 'גלידה', partOfSpeech: 'n', exampleEn: 'Ice cream is sweet.', exampleHe: 'גלידה מתוקה.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🍦' },
    { wordEn: 'all the time', translationHe: 'כל הזמן', partOfSpeech: 'phr', exampleEn: 'He eats all the time.', exampleHe: 'הוא אוכל כל הזמן.', ministryList: 'pre-band-1', recProd: 'rec' },
  ],
};

export const FIXTURE_PRO_DECK: WordDeck = {
  ...FIXTURE_DECK,
  id: 'test-food-pro',
  packId: 'holidays-spring',
  topicEn: 'More food',
  topicHe: 'עוד אוכל',
};
