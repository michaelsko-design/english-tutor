import type { GradeDecks } from './types';

/**
 * Grade 11's Ministry word decks (docs/content-packs-roadmap.md §3): the 5-point words the units
 * don't hold. Each deck is written with the core pack it ships with and stays hidden until that
 * pack is released.
 */
export const GRADE_11_DECKS: GradeDecks = [
  {
    id: 'g11-season2-1-science-tech',
    packId: 'season2-1',
    topicEn: 'Science & Technology',
    topicHe: 'מדע וטכנולוגיה',
    items: [
      { wordEn: 'evolution', translationHe: 'אבולוציה', partOfSpeech: 'n', exampleEn: 'Darwin wrote about the evolution of animals.', exampleHe: 'דרווין כתב על האבולוציה של בעלי החיים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'dimension', translationHe: 'ממד', partOfSpeech: 'n', exampleEn: 'A 3D printer works in three dimensions.', exampleHe: 'מדפסת תלת־ממד עובדת בשלושה ממדים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'measurement', translationHe: 'מדידה', partOfSpeech: 'n', exampleEn: 'Scientists need exact measurements.', exampleHe: 'מדענים צריכים מדידות מדויקות.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'width', translationHe: 'רוחב', partOfSpeech: 'n', exampleEn: 'Measure the length and the width of the table.', exampleHe: 'מודדים את האורך ואת הרוחב של השולחן.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'magnetic', translationHe: 'מגנטי', partOfSpeech: 'adj', exampleEn: 'The Earth has a magnetic field.', exampleHe: 'לכדור הארץ יש שדה מגנטי.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'transparent', translationHe: 'שקוף', partOfSpeech: 'adj', exampleEn: 'Glass is transparent, so light passes through it.', exampleHe: 'זכוכית שקופה, ולכן האור עובר דרכה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'explosive', translationHe: 'נפיץ', partOfSpeech: 'adj', exampleEn: 'Keep explosive materials away from fire.', exampleHe: 'יש להרחיק חומרים נפיצים מאש.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'manufacture', translationHe: 'לייצר', partOfSpeech: 'v', exampleEn: 'The company manufactures parts for smartphones.', exampleHe: 'החברה מייצרת חלקים לטלפונים חכמים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'output', translationHe: 'תפוקה; פלט', partOfSpeech: 'n', exampleEn: 'The new machines doubled the factory\'s output.', exampleHe: 'המכונות החדשות הכפילו את התפוקה של המפעל.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'backup', translationHe: 'גיבוי', partOfSpeech: 'n', exampleEn: 'Always keep a backup of your important files.', exampleHe: 'תמיד כדאי לשמור גיבוי של קבצים חשובים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'browse', translationHe: 'לגלוש; לדפדף', partOfSpeech: 'v', exampleEn: 'I browsed the Internet for information about Mars.', exampleHe: 'גלשתי באינטרנט כדי למצוא מידע על מאדים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'spam', translationHe: 'דואר זבל', partOfSpeech: 'n', exampleEn: 'My email filter blocks most of the spam.', exampleHe: 'המסנן בדואר האלקטרוני חוסם את רוב דואר הזבל.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'classify', translationHe: 'למיין; לסווג', partOfSpeech: 'v', exampleEn: 'Biologists classify animals into groups.', exampleHe: 'ביולוגים מסווגים בעלי חיים לקבוצות.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'subtract', translationHe: 'לחסר', partOfSpeech: 'v', exampleEn: 'Subtract five from twelve and you get seven.', exampleHe: 'מחסרים חמש משתים־עשרה ומקבלים שבע.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'concept', translationHe: 'מושג', partOfSpeech: 'n', exampleEn: 'Gravity is a difficult concept for young children.', exampleHe: 'כוח המשיכה הוא מושג קשה לילדים צעירים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'in theory', translationHe: 'בתיאוריה', partOfSpeech: 'phrase', exampleEn: 'In theory the plan works, but nobody has tested it.', exampleHe: 'בתיאוריה התוכנית עובדת, אבל אף אחד לא בדק אותה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'illustrate', translationHe: 'להמחיש; לאייר', partOfSpeech: 'v', exampleEn: 'The chart illustrates how temperatures have risen.', exampleHe: 'התרשים ממחיש כיצד הטמפרטורות עלו.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'fabric', translationHe: 'בד', partOfSpeech: 'n', exampleEn: 'This fabric is made from recycled bottles.', exampleHe: 'הבד הזה עשוי מבקבוקים ממוחזרים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'glue', translationHe: 'דבק', partOfSpeech: 'n', exampleEn: 'Use strong glue to fix the broken handle.', exampleHe: 'כדאי להשתמש בדבק חזק כדי לתקן את הידית השבורה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'shallow', translationHe: 'רדוד', partOfSpeech: 'adj', exampleEn: 'The water near the shore is shallow.', exampleHe: 'המים ליד החוף רדודים.', ministryList: 'band-3-core-2', recProd: 'prod' },
    ],
  },
  {
    id: 'g11-season2-2-character',
    packId: 'season2-2',
    topicEn: 'Feelings & Character',
    topicHe: 'רגשות ואופי',
    items: [
      { wordEn: 'affection', translationHe: 'חיבה', partOfSpeech: 'n', exampleEn: 'She showed great affection for her little brother.', exampleHe: 'היא גילתה חיבה רבה לאחיה הקטן.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'embarrassed', translationHe: 'נבוך', partOfSpeech: 'adj', exampleEn: 'He was embarrassed when he forgot his lines.', exampleHe: 'הוא היה נבוך כששכח את הטקסט.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'desperate', translationHe: 'נואש', partOfSpeech: 'adj', exampleEn: 'After hours in the desert, they were desperate for water.', exampleHe: 'אחרי שעות במדבר הם היו נואשים למים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'frustration', translationHe: 'תסכול', partOfSpeech: 'n', exampleEn: 'He kicked the ball in frustration.', exampleHe: 'הוא בעט בכדור מתוך תסכול.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'determination', translationHe: 'נחישות', partOfSpeech: 'n', exampleEn: 'With hard work and determination, she reached her goal.', exampleHe: 'בעבודה קשה ובנחישות היא הגיעה למטרה שלה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'self-confidence', translationHe: 'ביטחון עצמי', partOfSpeech: 'n', exampleEn: 'Performing on stage gave him self-confidence.', exampleHe: 'ההופעה על הבמה נתנה לו ביטחון עצמי.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'modest', translationHe: 'צנוע', partOfSpeech: 'adj', exampleEn: 'Even after winning, she stayed modest.', exampleHe: 'גם אחרי הזכייה היא נשארה צנועה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'considerate', translationHe: 'מתחשב', partOfSpeech: 'adj', exampleEn: 'It was considerate of him to call before he came.', exampleHe: 'זה היה מתחשב מצידו להתקשר לפני שהגיע.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'decent', translationHe: 'הגון; סביר', partOfSpeech: 'adj', exampleEn: 'He is a decent person who always tells the truth.', exampleHe: 'הוא אדם הגון שתמיד אומר את האמת.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'obedient', translationHe: 'צייתן; ממושמע', partOfSpeech: 'adj', exampleEn: 'The dog is very obedient and sits when it is told.', exampleHe: 'הכלב ממושמע מאוד ויושב כשאומרים לו.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'coward', translationHe: 'פחדן', partOfSpeech: 'n', exampleEn: 'In the story, the hero is called a coward, but he proves them wrong.', exampleHe: 'בסיפור קוראים לגיבור פחדן, אבל הוא מוכיח שהם טועים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'heroine', translationHe: 'גיבורה', partOfSpeech: 'n', exampleEn: 'The heroine of the novel is a young doctor.', exampleHe: 'גיבורת הרומן היא רופאה צעירה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'delight', translationHe: 'עונג; שמחה', partOfSpeech: 'n', exampleEn: 'To our delight, the concert was free.', exampleHe: 'לשמחתנו, ההופעה הייתה בחינם.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'charm', translationHe: 'קסם', partOfSpeech: 'n', exampleEn: 'The old village has a special charm.', exampleHe: 'לכפר העתיק יש קסם מיוחד.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'fierce', translationHe: 'עז; פראי', partOfSpeech: 'adj', exampleEn: 'There was fierce competition for the last place on the team.', exampleHe: 'הייתה תחרות עזה על המקום האחרון בקבוצה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'ridiculous', translationHe: 'מגוחך', partOfSpeech: 'adj', exampleEn: 'That excuse is ridiculous; nobody will believe it.', exampleHe: 'התירוץ הזה מגוחך; אף אחד לא יאמין לו.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'pretend', translationHe: 'להעמיד פנים', partOfSpeech: 'v', exampleEn: 'She pretended to be asleep.', exampleHe: 'היא העמידה פנים שהיא ישנה.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'beg', translationHe: 'להתחנן', partOfSpeech: 'v', exampleEn: 'The children begged their parents for a puppy.', exampleHe: 'הילדים התחננו בפני ההורים שיקנו להם גור.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'calm down', translationHe: 'להירגע', partOfSpeech: 'phrasal v', exampleEn: 'Take a deep breath and calm down.', exampleHe: 'נושמים עמוק ונרגעים.', ministryList: 'band-3-core-2', recProd: 'prod' },
      { wordEn: 'show off', translationHe: 'להשוויץ', partOfSpeech: 'phrasal v', exampleEn: 'He likes to show off his new phone.', exampleHe: 'הוא אוהב להשוויץ בטלפון החדש שלו.', ministryList: 'band-3-core-2', recProd: 'prod' },
    ],
  },
];
