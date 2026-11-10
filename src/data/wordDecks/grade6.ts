import type { GradeDecks } from './types';

/**
 * Grade 6's Ministry word decks (docs/content-packs-roadmap.md §3). Each deck is written with the
 * core pack it ships with and stays hidden until that pack is released.
 */
export const GRADE_6_DECKS: GradeDecks = [
  {
    id: 'g6-season2-1-nature',
    packId: 'season2-1',
    topicEn: 'Science & Nature',
    topicHe: 'מדע וטבע',
    items: [
      { wordEn: 'gram', translationHe: 'גרם', partOfSpeech: 'n', exampleEn: 'The mouse weighs only twenty grams.', exampleHe: 'העכבר שוקל רק עשרים גרם.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '⚖️' },
      { wordEn: 'countryside', translationHe: 'אזור כפרי', partOfSpeech: 'n', exampleEn: 'There are many cows in the countryside.', exampleHe: 'יש הרבה פרות באזור הכפרי.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🌾' },
      { wordEn: 'nature', translationHe: 'טבע', partOfSpeech: 'n', exampleEn: 'We love to walk in nature.', exampleHe: 'אנחנו אוהבים לטייל בטבע.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🌿' },
      { wordEn: 'field', translationHe: 'שדה', partOfSpeech: 'n', exampleEn: 'The horses run in the field.', exampleHe: 'הסוסים רצים בשדה.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🌻' },
      { wordEn: 'hill', translationHe: 'גבעה', partOfSpeech: 'n', exampleEn: 'We climb the hill and look at the view.', exampleHe: 'אנחנו מטפסים על הגבעה ומסתכלים על הנוף.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '⛰️' },
      { wordEn: 'island', translationHe: 'אי', partOfSpeech: 'n', exampleEn: 'The island is in the middle of the sea.', exampleHe: 'האי נמצא באמצע הים.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🏝️' },
      { wordEn: 'wood', translationHe: 'עץ (חומר)', partOfSpeech: 'n', exampleEn: 'The table is made of wood.', exampleHe: 'השולחן עשוי מעץ.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🪵' },
      { wordEn: 'hole', translationHe: 'חור', partOfSpeech: 'n', exampleEn: 'The rabbit hides in a hole.', exampleHe: 'הארנב מתחבא בחור.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🕳️' },
      { wordEn: 'depth', translationHe: 'עומק', partOfSpeech: 'n', exampleEn: 'What is the depth of the lake?', exampleHe: 'מה העומק של האגם?', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🌊' },
      { wordEn: 'deep', translationHe: 'עמוק', partOfSpeech: 'adj', exampleEn: 'The sea is very deep here.', exampleHe: 'הים עמוק מאוד כאן.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🤿' },
      { wordEn: 'wide', translationHe: 'רחב', partOfSpeech: 'adj', exampleEn: 'The river is long and wide.', exampleHe: 'הנהר ארוך ורחב.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '↔️' },
      { wordEn: 'narrow', translationHe: 'צר', partOfSpeech: 'adj', exampleEn: 'The path in the forest is narrow.', exampleHe: 'השביל ביער צר.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🛤️' },
      { wordEn: 'huge', translationHe: 'ענק', partOfSpeech: 'adj', exampleEn: 'A whale is a huge animal.', exampleHe: 'לווייתן הוא חיה ענקית.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🐋' },
      { wordEn: 'contain', translationHe: 'להכיל', partOfSpeech: 'v', exampleEn: 'Oranges contain a lot of water.', exampleHe: 'תפוזים מכילים הרבה מים.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🍊' },
      { wordEn: 'plastic', translationHe: 'פלסטיק', partOfSpeech: 'n', exampleEn: 'Plastic is bad for the sea.', exampleHe: 'פלסטיק מזיק לים.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🧴' },
      { wordEn: 'air', translationHe: 'אוויר', partOfSpeech: 'n', exampleEn: 'Plants need air and water.', exampleHe: 'צמחים צריכים אוויר ומים.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🎈' },
      { wordEn: 'smoke', translationHe: 'עשן', partOfSpeech: 'n', exampleEn: 'There is black smoke from the fire.', exampleHe: 'יש עשן שחור מהאש.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🌫️' },
      { wordEn: 'grow', translationHe: 'לגדול', partOfSpeech: 'v', exampleEn: 'Plants grow in the sun.', exampleHe: 'צמחים גדלים בשמש.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🌱' },
      { wordEn: 'result', translationHe: 'תוצאה', partOfSpeech: 'n', exampleEn: 'We write the results in our notebooks.', exampleHe: 'אנחנו כותבים את התוצאות במחברות.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '📊' },
      { wordEn: 'information', translationHe: 'מידע', partOfSpeech: 'n', exampleEn: 'This book has a lot of information about animals.', exampleHe: 'בספר הזה יש הרבה מידע על בעלי חיים.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: 'ℹ️' },
    ],
  },
  {
    id: 'g6-season2-2-community',
    packId: 'season2-2',
    topicEn: 'Community & Jobs',
    topicHe: 'קהילה ומקצועות',
    items: [
      { wordEn: 'president', translationHe: 'נשיא', partOfSpeech: 'n', exampleEn: 'The president lives in Jerusalem.', exampleHe: 'הנשיא גר בירושלים.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🎖️' },
      { wordEn: 'homemaker', translationHe: 'עקר בית / עקרת בית', partOfSpeech: 'n', exampleEn: 'A homemaker takes care of the house and the family.', exampleHe: 'עקרת בית מטפלת בבית ובמשפחה.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🏠' },
      { wordEn: 'police station', translationHe: 'תחנת משטרה', partOfSpeech: 'n', exampleEn: 'The police station is next to the bank.', exampleHe: 'תחנת המשטרה נמצאת ליד הבנק.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🚓' },
      { wordEn: 'police', translationHe: 'משטרה', partOfSpeech: 'n', exampleEn: 'Call the police!', exampleHe: 'תתקשרו למשטרה!', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '👮' },
      { wordEn: 'nurse', translationHe: 'אח / אחות', partOfSpeech: 'n', exampleEn: 'The nurse helps the sick children.', exampleHe: 'האחות עוזרת לילדים החולים.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🩺' },
      { wordEn: 'company', translationHe: 'חברה (עסק)', partOfSpeech: 'n', exampleEn: 'My uncle works for a big company.', exampleHe: 'הדוד שלי עובד בחברה גדולה.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🏢' },
      { wordEn: 'university', translationHe: 'אוניברסיטה', partOfSpeech: 'n', exampleEn: 'My sister studies at the university.', exampleHe: 'אחותי לומדת באוניברסיטה.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🎓' },
      { wordEn: 'member', translationHe: 'חבר (בקבוצה)', partOfSpeech: 'n', exampleEn: 'I am a member of the school choir.', exampleHe: 'אני חבר במקהלת בית הספר.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🪪' },
      { wordEn: 'meeting', translationHe: 'פגישה', partOfSpeech: 'n', exampleEn: 'Mom has a meeting at work today.', exampleHe: 'לאמא יש היום פגישה בעבודה.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🤝' },
      { wordEn: 'sell', translationHe: 'למכור', partOfSpeech: 'v', exampleEn: 'They sell fruit at the market.', exampleHe: 'הם מוכרים פירות בשוק.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '🏷️' },
      { wordEn: 'pay', translationHe: 'לשלם', partOfSpeech: 'v', exampleEn: 'We pay for the food.', exampleHe: 'אנחנו משלמים על האוכל.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '💳' },
      { wordEn: 'market', translationHe: 'שוק', partOfSpeech: 'n', exampleEn: 'We buy vegetables at the market.', exampleHe: 'אנחנו קונים ירקות בשוק.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🧺' },
      { wordEn: 'worker', translationHe: 'עובד', partOfSpeech: 'n', exampleEn: 'The workers build a new school.', exampleHe: 'הפועלים בונים בית ספר חדש.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '👷' },
      { wordEn: 'waiter', translationHe: 'מלצר', partOfSpeech: 'n', exampleEn: 'The waiter brings us the menu.', exampleHe: 'המלצר מביא לנו את התפריט.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🤵' },
      { wordEn: 'waitress', translationHe: 'מלצרית', partOfSpeech: 'n', exampleEn: 'The waitress brings us water.', exampleHe: 'המלצרית מביאה לנו מים.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '💁' },
      { wordEn: 'driver', translationHe: 'נהג', partOfSpeech: 'n', exampleEn: 'The bus driver says good morning.', exampleHe: 'נהג האוטובוס אומר בוקר טוב.', ministryList: 'band-1-core-1', recProd: 'prod', emoji: '🚌' },
      { wordEn: 'office', translationHe: 'משרד', partOfSpeech: 'n', exampleEn: 'Dad works in an office.', exampleHe: 'אבא עובד במשרד.', ministryList: 'band-1-core-1', recProd: 'rec', emoji: '🗄️' },
      { wordEn: 'visitor', translationHe: 'מבקר', partOfSpeech: 'n', exampleEn: 'The museum has many visitors.', exampleHe: 'למוזיאון יש הרבה מבקרים.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🎟️' },
      { wordEn: 'join', translationHe: 'להצטרף', partOfSpeech: 'v', exampleEn: 'I want to join the football team.', exampleHe: 'אני רוצה להצטרף לקבוצת הכדורגל.', ministryList: 'band-1-core-2', recProd: 'prod', emoji: '➕' },
      { wordEn: 'department', translationHe: 'מחלקה', partOfSpeech: 'n', exampleEn: 'She works in the toy department.', exampleHe: 'היא עובדת במחלקת הצעצועים.', ministryList: 'band-1-core-2', recProd: 'rec', emoji: '🗂️' },
    ],
  },
];
