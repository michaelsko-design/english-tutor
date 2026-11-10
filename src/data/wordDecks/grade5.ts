import type { GradeDecks } from './types';

/**
 * Grade 5's Ministry word decks (docs/content-packs-roadmap.md §3). Each deck is written with the
 * core pack it ships with and stays hidden until that pack is released.
 */
export const GRADE_5_DECKS: GradeDecks = [
  {
    id: 'g5-season2-1-weather',
    packId: 'season2-1',
    topicEn: 'Weather',
    topicHe: 'מזג האוויר',
    items: [
      { wordEn: 'autumn', translationHe: 'סתיו', partOfSpeech: 'n', exampleEn: 'The leaves fall in autumn.', exampleHe: 'העלים נושרים בסתיו.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🍂' },
      { wordEn: 'cool', translationHe: 'קריר', partOfSpeech: 'adj', exampleEn: 'The evening is cool and nice.', exampleHe: 'הערב קריר ונעים.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🌬️' },
      { wordEn: 'warm', translationHe: 'חמים', partOfSpeech: 'adj', exampleEn: 'It is warm today, so we go to the beach.', exampleHe: 'היום חמים, אז אנחנו הולכים לים.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '🌤️' },
      { wordEn: 'dark', translationHe: 'חשוך', partOfSpeech: 'adj', exampleEn: 'In winter it gets dark early.', exampleHe: 'בחורף מחשיך מוקדם.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🌑' },
      { wordEn: 'bright', translationHe: 'בהיר', partOfSpeech: 'adj', exampleEn: 'The sun is very bright today.', exampleHe: 'השמש בהירה מאוד היום.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🔆' },
      { wordEn: 'sky', translationHe: 'שמיים', partOfSpeech: 'n', exampleEn: 'The sky is blue and clear.', exampleHe: 'השמיים כחולים ובהירים.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '🌌' },
      { wordEn: 'wind', translationHe: 'רוח', partOfSpeech: 'n', exampleEn: 'The wind is strong today.', exampleHe: 'הרוח חזקה היום.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '💨' },
      { wordEn: 'cloud', translationHe: 'ענן', partOfSpeech: 'n', exampleEn: 'There is a big gray cloud in the sky.', exampleHe: 'יש ענן אפור גדול בשמיים.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '☁️' },
      { wordEn: 'snow', translationHe: 'שלג', partOfSpeech: 'n', exampleEn: 'There is snow on the Hermon.', exampleHe: 'יש שלג בחרמון.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '❄️' },
      { wordEn: 'wet', translationHe: 'רטוב', partOfSpeech: 'adj', exampleEn: 'My shoes are wet from the rain.', exampleHe: 'הנעליים שלי רטובות מהגשם.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '💧' },
      { wordEn: 'the cold', translationHe: 'הקור', partOfSpeech: 'n', exampleEn: 'Wear a coat in the cold.', exampleHe: 'כדאי ללבוש מעיל בקור.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🥶' },
      { wordEn: 'north', translationHe: 'צפון', partOfSpeech: 'n', exampleEn: 'It is rainy in the north today.', exampleHe: 'היום גשום בצפון.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '⬆️' },
      { wordEn: 'south', translationHe: 'דרום', partOfSpeech: 'n', exampleEn: 'It is hot and dry in the south.', exampleHe: 'בדרום חם ויבש.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '⬇️' },
    ],
  },
  {
    id: 'g5-season2-2-house',
    packId: 'season2-2',
    topicEn: 'House & Chores',
    topicHe: 'הבית ומטלות הבית',
    items: [
      { wordEn: 'refrigerator', translationHe: 'מקרר', partOfSpeech: 'n', exampleEn: 'The milk is in the refrigerator.', exampleHe: 'החלב במקרר.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🧊' },
      { wordEn: 'stove', translationHe: 'כיריים', partOfSpeech: 'n', exampleEn: 'Dad cooks soup on the stove.', exampleHe: 'אבא מבשל מרק על הכיריים.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🍳' },
      { wordEn: 'mug', translationHe: 'ספל', partOfSpeech: 'n', exampleEn: 'I drink hot tea from a big mug.', exampleHe: 'אני שותה תה חם מספל גדול.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '☕' },
      { wordEn: 'toothbrush', translationHe: 'מברשת שיניים', partOfSpeech: 'n', exampleEn: 'My toothbrush is in the bathroom.', exampleHe: 'מברשת השיניים שלי בחדר האמבטיה.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🪥' },
      { wordEn: 'wash up', translationHe: 'לשטוף כלים', partOfSpeech: 'phrasal v', exampleEn: 'After dinner, I wash up.', exampleHe: 'אחרי ארוחת הערב אני שוטף כלים.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🧽' },
      { wordEn: 'turn on', translationHe: 'להדליק', partOfSpeech: 'phrasal v', exampleEn: 'Please turn on the light.', exampleHe: 'בבקשה להדליק את האור.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '💡' },
      { wordEn: 'turn off', translationHe: 'לכבות', partOfSpeech: 'phrasal v', exampleEn: 'Turn off the TV before bed.', exampleHe: 'מכבים את הטלוויזיה לפני השינה.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🔌' },
      { wordEn: 'put away', translationHe: 'להחזיר למקום', partOfSpeech: 'phrasal v', exampleEn: 'Put away your toys, please.', exampleHe: 'בבקשה להחזיר את הצעצועים למקום.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🧺' },
      { wordEn: 'tidy', translationHe: 'מסודר', partOfSpeech: 'adj', exampleEn: 'My room is clean and tidy.', exampleHe: 'החדר שלי נקי ומסודר.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '✨' },
      { wordEn: 'dining room', translationHe: 'פינת אוכל', partOfSpeech: 'n', exampleEn: 'We eat dinner in the dining room.', exampleHe: 'אנחנו אוכלים ארוחת ערב בפינת האוכל.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🪑' },
      { wordEn: 'living room', translationHe: 'סלון', partOfSpeech: 'n', exampleEn: 'We watch TV in the living room.', exampleHe: 'אנחנו צופים בטלוויזיה בסלון.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🛋️' },
      { wordEn: 'upstairs', translationHe: 'למעלה', partOfSpeech: 'adv', exampleEn: 'My bedroom is upstairs.', exampleHe: 'חדר השינה שלי למעלה.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🔼' },
      { wordEn: 'downstairs', translationHe: 'למטה', partOfSpeech: 'adv', exampleEn: 'The kitchen is downstairs.', exampleHe: 'המטבח למטה.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🔽' },
      { wordEn: 'shower', translationHe: 'מקלחת', partOfSpeech: 'n', exampleEn: 'I take a shower every evening.', exampleHe: 'אני מתקלח כל ערב.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🚿' },
      { wordEn: 'soap', translationHe: 'סבון', partOfSpeech: 'n', exampleEn: 'Wash your hands with soap.', exampleHe: 'שוטפים ידיים עם סבון.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🧼' },
      { wordEn: 'do the cleaning', translationHe: 'לנקות את הבית', partOfSpeech: 'phrase', exampleEn: 'On Friday we do the cleaning.', exampleHe: 'ביום שישי אנחנו מנקים את הבית.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🧹' },
      { wordEn: 'feed', translationHe: 'להאכיל', partOfSpeech: 'v', exampleEn: 'I feed the dog every morning.', exampleHe: 'אני מאכיל את הכלב כל בוקר.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🐕' },
      { wordEn: 'empty', translationHe: 'ריק', partOfSpeech: 'adj', exampleEn: 'The bottle is empty.', exampleHe: 'הבקבוק ריק.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🫙' },
      { wordEn: 'knife', translationHe: 'סכין', partOfSpeech: 'n', exampleEn: 'Cut the bread with a knife.', exampleHe: 'חותכים את הלחם בסכין.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '🔪' },
      { wordEn: 'plate', translationHe: 'צלחת', partOfSpeech: 'n', exampleEn: 'Put the cake on a plate.', exampleHe: 'שמים את העוגה על צלחת.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🍽️' },
    ],
  },
];
