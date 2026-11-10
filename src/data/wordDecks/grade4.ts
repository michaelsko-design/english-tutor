import type { GradeDecks } from './types';

/**
 * Grade 4's Ministry word decks (docs/content-packs-roadmap.md §3). Each deck is written with the
 * core pack it ships with and stays hidden until that pack is released.
 */
export const GRADE_4_DECKS: GradeDecks = [
  {
    id: 'g4-season2-1-town',
    packId: 'season2-1',
    topicEn: 'In Town & Directions',
    topicHe: 'בעיר ובדרך',
    items: [
      { wordEn: 'east', translationHe: 'מזרח', partOfSpeech: 'n', exampleEn: 'The sun comes up in the east.', exampleHe: 'השמש זורחת במזרח.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🌅' },
      { wordEn: 'west', translationHe: 'מערב', partOfSpeech: 'n', exampleEn: 'The sea is in the west.', exampleHe: 'הים נמצא במערב.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🌇' },
      { wordEn: 'road', translationHe: 'כביש', partOfSpeech: 'n', exampleEn: 'Look left and right before you cross the road.', exampleHe: 'מסתכלים שמאלה וימינה לפני שחוצים את הכביש.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🛣️' },
      { wordEn: 'center', translationHe: 'מרכז', partOfSpeech: 'n', exampleEn: 'We go shopping in the city center.', exampleHe: 'אנחנו עושים קניות במרכז העיר.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🎯' },
      { wordEn: 'hotel', translationHe: 'מלון', partOfSpeech: 'n', exampleEn: 'The hotel is near the beach.', exampleHe: 'המלון קרוב לחוף.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🏨' },
      { wordEn: 'store', translationHe: 'חנות', partOfSpeech: 'n', exampleEn: 'The toy store is on this street.', exampleHe: 'חנות הצעצועים נמצאת ברחוב הזה.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🏪' },
      { wordEn: 'restaurant', translationHe: 'מסעדה', partOfSpeech: 'n', exampleEn: 'We eat pizza at a restaurant.', exampleHe: 'אנחנו אוכלים פיצה במסעדה.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '🍽️' },
      { wordEn: 'bank', translationHe: 'בנק', partOfSpeech: 'n', exampleEn: 'My mom works in a bank.', exampleHe: 'אמא שלי עובדת בבנק.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🏦' },
      { wordEn: 'city', translationHe: 'עיר', partOfSpeech: 'n', exampleEn: 'Tel Aviv is a big city.', exampleHe: 'תל אביב היא עיר גדולה.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🏙️' },
      { wordEn: 'corner', translationHe: 'פינה', partOfSpeech: 'n', exampleEn: 'The bus stop is on the corner.', exampleHe: 'תחנת האוטובוס נמצאת בפינה.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '📐' },
      { wordEn: 'on the left', translationHe: 'משמאל', partOfSpeech: 'phrase', exampleEn: 'The park is on the left.', exampleHe: 'הפארק נמצא משמאל.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '⬅️' },
      { wordEn: 'on the right', translationHe: 'מימין', partOfSpeech: 'phrase', exampleEn: 'The school is on the right.', exampleHe: 'בית הספר נמצא מימין.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '➡️' },
      { wordEn: 'near', translationHe: 'קרוב ל־', partOfSpeech: 'prep', exampleEn: 'I live near the school.', exampleHe: 'אני גר קרוב לבית הספר.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '📍' },
      { wordEn: 'far', translationHe: 'רחוק', partOfSpeech: 'adj', exampleEn: 'The zoo is far from my house.', exampleHe: 'גן החיות רחוק מהבית שלי.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🔭' },
      { wordEn: 'behind', translationHe: 'מאחורי', partOfSpeech: 'prep', exampleEn: 'The garden is behind the house.', exampleHe: 'הגינה נמצאת מאחורי הבית.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🔙' },
      { wordEn: 'between', translationHe: 'בין', partOfSpeech: 'prep', exampleEn: 'The bank is between the hotel and the store.', exampleHe: 'הבנק נמצא בין המלון לחנות.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '↔️' },
      { wordEn: 'turn', translationHe: 'לפנות', partOfSpeech: 'v', exampleEn: 'Turn left at the corner.', exampleHe: 'פונים שמאלה בפינה.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '↪️' },
      { wordEn: 'walk', translationHe: 'ללכת ברגל', partOfSpeech: 'v', exampleEn: 'We walk to school every day.', exampleHe: 'אנחנו הולכים ברגל לבית הספר כל יום.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🚶' },
      { wordEn: 'sign', translationHe: 'שלט', partOfSpeech: 'n', exampleEn: 'The sign says "Stop".', exampleHe: 'על השלט כתוב "עצור".', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🪧' },
      { wordEn: 'inside', translationHe: 'בתוך', partOfSpeech: 'prep', exampleEn: 'The cat is inside the box.', exampleHe: 'החתול בתוך הקופסה.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '📦' },
    ],
  },
  {
    id: 'g4-season2-2-body',
    packId: 'season2-2',
    topicEn: 'Body & Health',
    topicHe: 'הגוף והבריאות',
    items: [
      { wordEn: 'ambulance', translationHe: 'אמבולנס', partOfSpeech: 'n', exampleEn: 'The ambulance goes to the hospital.', exampleHe: 'האמבולנס נוסע לבית החולים.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🚑' },
      { wordEn: 'lie down', translationHe: 'לשכב', partOfSpeech: 'phrasal v', exampleEn: 'I am tired. I want to lie down.', exampleHe: 'אני עייף. אני רוצה לשכב.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🛌' },
      { wordEn: 'shoulder', translationHe: 'כתף', partOfSpeech: 'n', exampleEn: 'The bird sits on my shoulder.', exampleHe: 'הציפור יושבת לי על הכתף.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '🤷' },
      { wordEn: 'arm', translationHe: 'זרוע', partOfSpeech: 'n', exampleEn: 'I have two arms.', exampleHe: 'יש לי שתי זרועות.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '💪' },
      { wordEn: 'back', translationHe: 'גב', partOfSpeech: 'n', exampleEn: 'My bag is on my back.', exampleHe: 'התיק שלי על הגב.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🎒' },
      { wordEn: 'body', translationHe: 'גוף', partOfSpeech: 'n', exampleEn: 'Sport is good for the body.', exampleHe: 'ספורט טוב לגוף.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🧍' },
      { wordEn: 'face', translationHe: 'פנים', partOfSpeech: 'n', exampleEn: 'She has a happy face.', exampleHe: 'יש לה פנים שמחות.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🙂' },
      { wordEn: 'finger', translationHe: 'אצבע', partOfSpeech: 'n', exampleEn: 'I have ten fingers.', exampleHe: 'יש לי עשר אצבעות.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '☝️' },
      { wordEn: 'hair', translationHe: 'שיער', partOfSpeech: 'n', exampleEn: 'My sister has long hair.', exampleHe: 'לאחותי יש שיער ארוך.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '💇' },
      { wordEn: 'head', translationHe: 'ראש', partOfSpeech: 'n', exampleEn: 'I wear a hat on my head.', exampleHe: 'אני חובש כובע על הראש.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🧢' },
      { wordEn: 'knee', translationHe: 'ברך', partOfSpeech: 'n', exampleEn: 'He fell and hurt his knee.', exampleHe: 'הוא נפל וקיבל מכה בברך.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🦵' },
      { wordEn: 'neck', translationHe: 'צוואר', partOfSpeech: 'n', exampleEn: 'A giraffe has a long neck.', exampleHe: 'לג׳ירפה יש צוואר ארוך.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🦒' },
      { wordEn: 'hospital', translationHe: 'בית חולים', partOfSpeech: 'n', exampleEn: 'The doctor works in a hospital.', exampleHe: 'הרופא עובד בבית חולים.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🏥' },
      { wordEn: 'feel', translationHe: 'להרגיש', partOfSpeech: 'v', exampleEn: 'I feel good today.', exampleHe: 'אני מרגיש טוב היום.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '💭' },
      { wordEn: 'fall', translationHe: 'ליפול', partOfSpeech: 'v', exampleEn: "Be careful! Don't fall!", exampleHe: 'זהירות! לא ליפול!', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🤕' },
    ],
  },
];
