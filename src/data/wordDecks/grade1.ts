import type { GradeDecks } from './types';

/**
 * Grade 1's Ministry word decks (docs/content-packs-roadmap.md §3). Each deck is written with the
 * core pack it ships with and stays hidden until that pack is released. Grade 1's units are
 * complete, so its track is the Pre-Band I phrases the units don't hold.
 */
export const GRADE_1_DECKS: GradeDecks = [
  {
    id: 'g1-season2-2-phrases',
    packId: 'season2-2',
    topicEn: 'Everyday Phrases',
    topicHe: 'משפטים לכל יום',
    items: [
      { wordEn: 'My name is Dan.', translationHe: 'קוראים לי דן.', partOfSpeech: 'phrase', exampleEn: 'Hello! My name is Dan.', exampleHe: 'שלום! קוראים לי דן.', ministryList: 'pre-band-1', recProd: 'rec', emoji: '📛' },
      { wordEn: "What's your name?", translationHe: 'איך קוראים לך?', partOfSpeech: 'phrase', exampleEn: "Hello! What's your name?", exampleHe: 'שלום! איך קוראים לך?', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🙋' },
      { wordEn: 'How old are you?', translationHe: 'בן כמה אתה?', partOfSpeech: 'phrase', exampleEn: 'How old are you? I am six.', exampleHe: 'בן כמה אתה? אני בן שש.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🎂' },
      { wordEn: "I'm a girl.", translationHe: 'אני ילדה.', partOfSpeech: 'phrase', exampleEn: "I'm Mia. I'm a girl.", exampleHe: 'אני מיה. אני ילדה.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '👧' },
      { wordEn: "I'm a boy.", translationHe: 'אני ילד.', partOfSpeech: 'phrase', exampleEn: "I'm Dan. I'm a boy.", exampleHe: 'אני דן. אני ילד.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '👦' },
      { wordEn: 'Excuse me, please.', translationHe: 'סליחה, בבקשה.', partOfSpeech: 'phrase', exampleEn: 'Excuse me, please. I have a question.', exampleHe: 'סליחה, בבקשה. יש לי שאלה.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '✋' },
      { wordEn: "You're welcome.", translationHe: 'אין בעד מה.', partOfSpeech: 'phrase', exampleEn: "Thank you! You're welcome.", exampleHe: 'תודה! אין בעד מה.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '😊' },
      { wordEn: 'Yes, please.', translationHe: 'כן, בבקשה.', partOfSpeech: 'phrase', exampleEn: 'Cake? Yes, please!', exampleHe: 'עוגה? כן, בבקשה!', ministryList: 'pre-band-1', recProd: 'prod', emoji: '👍' },
      { wordEn: 'Well done!', translationHe: 'כל הכבוד!', partOfSpeech: 'phrase', exampleEn: 'Well done, Dan!', exampleHe: 'כל הכבוד, דן!', ministryList: 'pre-band-1', recProd: 'rec', emoji: '👏' },
      { wordEn: 'Have a good day!', translationHe: 'שיהיה יום טוב!', partOfSpeech: 'phrase', exampleEn: 'Goodbye! Have a good day!', exampleHe: 'להתראות! שיהיה יום טוב!', ministryList: 'pre-band-1', recProd: 'prod', emoji: '☀️' },
      { wordEn: 'See you later!', translationHe: 'נתראה אחר כך!', partOfSpeech: 'phrase', exampleEn: 'Goodbye, Mia! See you later!', exampleHe: 'להתראות, מיה! נתראה אחר כך!', ministryList: 'pre-band-1', recProd: 'prod', emoji: '👋' },
      { wordEn: 'Take care!', translationHe: 'שמרו על עצמכם!', partOfSpeech: 'phrase', exampleEn: 'Goodbye! Take care!', exampleHe: 'להתראות! שמרו על עצמכם!', ministryList: 'pre-band-1', recProd: 'prod', emoji: '💛' },
      { wordEn: 'No problem!', translationHe: 'אין בעיה!', partOfSpeech: 'phrase', exampleEn: 'Thank you! No problem!', exampleHe: 'תודה! אין בעיה!', ministryList: 'pre-band-1', recProd: 'prod', emoji: '👌' },
      { wordEn: 'Are you ready?', translationHe: 'מוכנים?', partOfSpeech: 'phrase', exampleEn: 'Are you ready? Open the book!', exampleHe: 'מוכנים? פתחו את הספר!', ministryList: 'pre-band-1', recProd: 'prod', emoji: '🏁' },
      { wordEn: 'What is it?', translationHe: 'מה זה?', partOfSpeech: 'phrase', exampleEn: 'What is it? It is a cat.', exampleHe: 'מה זה? זה חתול.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '❓' },
      { wordEn: 'Who is this?', translationHe: 'מי זה?', partOfSpeech: 'phrase', exampleEn: 'Who is this? This is my friend.', exampleHe: 'מי זה? זה החבר שלי.', ministryList: 'pre-band-1', recProd: 'prod', emoji: '👀' },
      { wordEn: "What's the matter?", translationHe: 'מה קרה?', partOfSpeech: 'phrase', exampleEn: "What's the matter, Dan?", exampleHe: 'מה קרה, דן?', ministryList: 'pre-band-1', recProd: 'prod', emoji: '😟' },
      { wordEn: 'Of course!', translationHe: 'כמובן!', partOfSpeech: 'phrase', exampleEn: 'Can I play? Of course!', exampleHe: 'אפשר לשחק? כמובן!', ministryList: 'pre-band-1', recProd: 'rec', emoji: '✅' },
    ],
  },
];
