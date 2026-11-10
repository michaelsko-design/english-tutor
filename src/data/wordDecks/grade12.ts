import type { GradeDecks } from './types';

/**
 * Grade 12's Ministry word decks (docs/content-packs-roadmap.md §3): the 5-point words the units
 * don't hold. Each deck is written with the core pack it ships with and stays hidden until that
 * pack is released.
 */
export const GRADE_12_DECKS: GradeDecks = [
  {
    id: 'g12-season2-1-linking',
    packId: 'season2-1',
    topicEn: 'Linking Ideas',
    topicHe: 'קישור רעיונות',
    items: [
      { wordEn: 'after all', translationHe: 'אחרי הכול', partOfSpeech: 'phrase', exampleEn: 'Do not be too hard on him; after all, he is only fifteen.', exampleHe: 'לא כדאי להיות קשוחים איתו; אחרי הכול, הוא רק בן חמש־עשרה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'on the contrary', translationHe: 'להפך', partOfSpeech: 'phrase', exampleEn: 'The test was not easy. On the contrary, it was very hard.', exampleHe: 'המבחן לא היה קל. להפך, הוא היה קשה מאוד.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'nonetheless', translationHe: 'למרות זאת', partOfSpeech: 'adv', exampleEn: 'The plan was risky; nonetheless, they decided to try it.', exampleHe: 'התוכנית הייתה מסוכנת; למרות זאת, הם החליטו לנסות.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'undoubtedly', translationHe: 'ללא ספק', partOfSpeech: 'adv', exampleEn: 'She is undoubtedly the best player on the team.', exampleHe: 'היא ללא ספק השחקנית הטובה ביותר בקבוצה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'in comparison with', translationHe: 'בהשוואה ל־', partOfSpeech: 'phrase', exampleEn: 'In comparison with last year, prices have gone up.', exampleHe: 'בהשוואה לשנה שעברה, המחירים עלו.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'in view of', translationHe: 'לאור; בהתחשב ב־', partOfSpeech: 'phrase', exampleEn: 'In view of the storm, the trip was cancelled.', exampleHe: 'לאור הסערה, הטיול בוטל.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'on account of', translationHe: 'בגלל; עקב', partOfSpeech: 'phrase', exampleEn: 'The game was delayed on account of the heavy rain.', exampleHe: 'המשחק נדחה עקב הגשם הכבד.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'in the first place', translationHe: 'מלכתחילה', partOfSpeech: 'phrase', exampleEn: 'Why did they agree to the plan in the first place?', exampleHe: 'למה הם הסכימו לתוכנית מלכתחילה?', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'not to mention', translationHe: 'שלא לדבר על', partOfSpeech: 'phrase', exampleEn: 'The hotel was expensive, not to mention noisy.', exampleHe: 'המלון היה יקר, שלא לדבר על הרעש.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'to be precise', translationHe: 'ליתר דיוק', partOfSpeech: 'phrase', exampleEn: 'The city is old — three thousand years old, to be precise.', exampleHe: 'העיר עתיקה – בת שלושת אלפים שנה, ליתר דיוק.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'to make matters worse', translationHe: 'וכאילו זה לא מספיק', partOfSpeech: 'phrase', exampleEn: 'We missed the bus, and to make matters worse, it started to rain.', exampleHe: 'פספסנו את האוטובוס, וכאילו זה לא מספיק, התחיל לרדת גשם.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'last but not least', translationHe: 'אחרון חביב', partOfSpeech: 'phrase', exampleEn: 'Last but not least, I want to thank my parents.', exampleHe: 'ואחרון חביב, אני רוצה להודות להורים שלי.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'in brief', translationHe: 'בקצרה', partOfSpeech: 'phrase', exampleEn: 'In brief, the project was a great success.', exampleHe: 'בקצרה, הפרויקט היה הצלחה גדולה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'in relation to', translationHe: 'ביחס ל־', partOfSpeech: 'phrase', exampleEn: 'The article discusses prices in relation to salaries.', exampleHe: 'המאמר דן במחירים ביחס למשכורות.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'so as to', translationHe: 'כדי ל־', partOfSpeech: 'phrase', exampleEn: 'She left early so as to catch the first train.', exampleHe: 'היא יצאה מוקדם כדי להספיק לרכבת הראשונה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'despite the fact that', translationHe: 'למרות העובדה ש־', partOfSpeech: 'phrase', exampleEn: 'Despite the fact that he was tired, he finished the race.', exampleHe: 'למרות העובדה שהיה עייף, הוא סיים את המרוץ.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'it goes without saying', translationHe: 'מובן מאליו', partOfSpeech: 'phrase', exampleEn: 'It goes without saying that safety comes first.', exampleHe: 'מובן מאליו שהבטיחות קודמת לכול.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'pros and cons', translationHe: 'יתרונות וחסרונות', partOfSpeech: 'phrase', exampleEn: 'The essay weighs the pros and cons of school uniforms.', exampleHe: 'החיבור שוקל את היתרונות והחסרונות של תלבושת אחידה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'versus', translationHe: 'לעומת; נגד', partOfSpeech: 'prep', exampleEn: 'The debate is about city life versus country life.', exampleHe: 'הוויכוח עוסק בחיים בעיר לעומת חיים בכפר.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'the latter', translationHe: 'האחרון (מבין השניים)', partOfSpeech: 'n', exampleEn: 'I like tea and coffee, but I prefer the latter.', exampleHe: 'אני אוהב תה וקפה, אבל אני מעדיף את האחרון.', ministryList: 'band-3-core-2', recProd: 'prod' },
    ],
  },
  {
    id: 'g12-season2-2-media',
    packId: 'season2-2',
    topicEn: 'Media & Culture',
    topicHe: 'תקשורת ותרבות',
    items: [
      { wordEn: 'publicity', translationHe: 'פרסום; יחסי ציבור', partOfSpeech: 'n', exampleEn: 'The film got a lot of publicity before it came out.', exampleHe: 'הסרט זכה להרבה פרסום לפני שיצא.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'fame', translationHe: 'תהילה; פרסום', partOfSpeech: 'n', exampleEn: 'The singer found fame on social media.', exampleHe: 'הזמרת זכתה לתהילה ברשתות החברתיות.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'fantasy', translationHe: 'פנטזיה; דמיון', partOfSpeech: 'n', exampleEn: 'Harry Potter is a famous fantasy series.', exampleHe: 'הארי פוטר היא סדרת פנטזיה מפורסמת.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'craft', translationHe: 'מלאכת יד; אומנות', partOfSpeech: 'n', exampleEn: 'Pottery is an ancient craft.', exampleHe: 'קדרות היא מלאכת יד עתיקה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'philosophy', translationHe: 'פילוסופיה', partOfSpeech: 'n', exampleEn: 'She studies philosophy at university.', exampleHe: 'היא לומדת פילוסופיה באוניברסיטה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'discourse', translationHe: 'שיח', partOfSpeech: 'n', exampleEn: 'Social media has changed public discourse.', exampleHe: 'הרשתות החברתיות שינו את השיח הציבורי.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'current affairs', translationHe: 'אקטואליה', partOfSpeech: 'n', exampleEn: 'The podcast covers current affairs every morning.', exampleHe: 'הפודקאסט עוסק באקטואליה בכל בוקר.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'influential', translationHe: 'משפיע', partOfSpeech: 'adj', exampleEn: 'She is one of the most influential writers of her time.', exampleHe: 'היא אחת הסופרות המשפיעות ביותר בתקופתה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'controversial', translationHe: 'שנוי במחלוקת', partOfSpeech: 'adj', exampleEn: 'The new law is very controversial.', exampleHe: 'החוק החדש שנוי מאוד במחלוקת.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'informal', translationHe: 'לא רשמי', partOfSpeech: 'adj', exampleEn: 'Use informal language when you write to a friend.', exampleHe: 'בכתיבה לחבר משתמשים בשפה לא רשמית.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'sponsor', translationHe: 'נותן חסות', partOfSpeech: 'n', exampleEn: 'A bank is the main sponsor of the festival.', exampleHe: 'בנק הוא נותן החסות הראשי של הפסטיבל.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'promote', translationHe: 'לקדם', partOfSpeech: 'v', exampleEn: 'The band is on tour to promote its new album.', exampleHe: 'הלהקה יוצאת לסיבוב הופעות כדי לקדם את האלבום החדש.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'feature', translationHe: 'להציג; לכלול', partOfSpeech: 'v', exampleEn: 'The exhibition features works by young artists.', exampleHe: 'התערוכה מציגה עבודות של אמנים צעירים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'leaflet', translationHe: 'עלון', partOfSpeech: 'n', exampleEn: 'Volunteers handed out leaflets about the concert.', exampleHe: 'מתנדבים חילקו עלונים על ההופעה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'commerce', translationHe: 'מסחר', partOfSpeech: 'n', exampleEn: 'Online commerce has grown fast in recent years.', exampleHe: 'המסחר המקוון גדל מהר בשנים האחרונות.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'traditionally', translationHe: 'באופן מסורתי', partOfSpeech: 'adv', exampleEn: 'Traditionally, families watch the ceremony together.', exampleHe: 'באופן מסורתי, משפחות צופות בטקס יחד.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'oral', translationHe: 'בעל פה', partOfSpeech: 'adj', exampleEn: 'Many old stories survived as oral tradition.', exampleHe: 'סיפורים עתיקים רבים שרדו כמסורת שבעל פה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'tendency', translationHe: 'נטייה', partOfSpeech: 'n', exampleEn: 'News sites have a tendency to focus on bad news.', exampleHe: 'לאתרי חדשות יש נטייה להתמקד בחדשות רעות.', ministryList: 'band-3-core-2', recProd: 'prod' },
    ],
  },
];
