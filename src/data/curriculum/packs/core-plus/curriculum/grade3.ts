import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 3, Season 2 (core-plus pack): jobs with "He / She is a…" (and a / an from unit 3), then
 * my day with "I + verb". Builds on units 1–4 (am / is / are, a / an, I can, I like).
 * Hebrew copy is gender-neutral (slash forms such as "אוכל/ת").
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Jobs: Who Is This?',
    titleHe: 'עונה 2: מקצועות, מי זה?',
    subtitleHe: 'הרפתקאות בונוס: מקצועות (doctor, pilot, baker) ומשפטי "He is a / She is a"',
    badgeEmoji: '💼',
    missions: [
      {
        icon: '👩‍🏫',
        titleEn: 'He Is a Doctor, She Is a Cook',
        titleHe: 'הוא רופא, היא טבחית',
        storyHookHe: 'עונה 2 מתחילה בעיר הקטנה! כל אחד עובד במשהו אחר. בואו נגלה מי עושה מה.',
        grammarTopic: 'Jobs & "He is a / She is a"',
        skills: ['Jobs', 'He / She is a...', 'Speaking Aloud'],
        sentenceEn: 'She is a doctor and he is a cook.',
        sentenceHe: 'היא רופאה והוא טבח.',
        vocab: [
          ['doctor', 'noun', 'רופא / רופאה', '🩺', 'The doctor helps sick children.', 'הרופא עוזר לילדים חולים.'],
          ['farmer', 'noun', 'חקלאי / חקלאית', '🌾', 'The farmer has three cows.', 'לחקלאי יש שלוש פרות.'],
          ['cook', 'noun', 'טבח / טבחית', '🍳', 'The cook makes soup.', 'הטבח מכין מרק.'],
          ['teacher', 'noun', 'מורה', '👩‍🏫', 'My teacher is kind.', 'המורה שלי נחמדה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'window', translationHe: 'חלון' },
            { wordEn: 'pizza', translationHe: 'פיצה' },
          ],
          shortSentenceEn: 'He is a farmer.',
          shortSentenceHe: 'הוא חקלאי.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She is a teacher.',
            wrong: ['She a teacher.', 'She are a teacher.'],
            explainHe: 'עם she (היא) ו-he (הוא) אומרים is, ולפני המקצוע a: She is a teacher.',
            hintHe: 'איזו צורה של be הולכת עם היא? ואל תשכחו שבאנגלית צריך אותה במשפט.',
          },
          story: {
            passageEn: 'This is Gil. He is a farmer. He has a big farm. His friend Noa is a cook.',
            passageHe: 'זה גיל. הוא חקלאי. יש לו חווה גדולה. החברה שלו, נועה, היא טבחית.',
            questionEn: 'Who is a cook?',
            questionHe: 'מי טבחית?',
            correct: 'Noa',
            wrong: ['Gil', 'the doctor'],
          },
        },
      },
      {
        icon: '🚀',
        titleEn: 'An Artist and an Astronaut',
        titleHe: 'אמנית ואסטרונאוט',
        storyHookHe: 'ביום המקצועות בבית הספר מגיעים אורחים מיוחדים: טייסת, זמר ואפילו אסטרונאוט!',
        grammarTopic: 'Jobs with "a" or "an"',
        skills: ['Jobs', 'a / an', 'Listening'],
        sentenceEn: 'He is an astronaut and she is a pilot.',
        sentenceHe: 'הוא אסטרונאוט והיא טייסת.',
        vocab: [
          ['artist', 'noun', 'אמן / אמנית', '🎨', 'The artist paints a big picture.', 'האמנית מציירת תמונה גדולה.'],
          ['astronaut', 'noun', 'אסטרונאוט / אסטרונאוטית', '🚀', 'An astronaut can fly to the moon.', 'אסטרונאוט יכול לטוס לירח.'],
          ['pilot', 'noun', 'טייס / טייסת', '🧑‍✈️', 'The pilot flies the plane.', 'הטייס מטיס את המטוס.'],
          ['singer', 'noun', 'זמר / זמרת', '🎤', 'The singer has a red guitar.', 'לזמרת יש גיטרה אדומה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'desk', translationHe: 'שולחן כתיבה' },
            { wordEn: 'zebra', translationHe: 'זברה' },
          ],
          shortSentenceEn: 'She is an artist.',
          shortSentenceHe: 'היא אמנית.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'He is an astronaut.',
            wrong: ['He is a astronaut.', 'He is astronaut an.'],
            explainHe: 'astronaut מתחילה בצליל a, ולכן אומרים an: an astronaut. ה-an בא לפני המקצוע.',
            hintHe: 'בדקו באיזה צליל מתחילה המילה שאחרי המילה הקטנה, וזכרו שהיא באה לפני המקצוע.',
          },
          story: {
            passageEn: 'Today is Job Day. A singer comes to our class. She sings a happy song. Then an artist comes. He paints a purple bird.',
            passageHe: 'היום יום המקצועות. זמרת מגיעה לכיתה שלנו. היא שרה שיר שמח. אחר כך מגיע אמן. הוא מצייר ציפור סגולה.',
            questionEn: 'What does the artist paint?',
            questionHe: 'מה האמן מצייר?',
            correct: 'a purple bird',
            wrong: ['a happy song', 'a green tree'],
          },
        },
      },
      {
        icon: '🏅',
        isBoss: true,
        titleEn: 'Boss: Job Day Parade',
        titleHe: 'אתגר הבוס: מצעד המקצועות',
        storyHookHe: 'כל העיר יוצאת למצעד המקצועות! זהו מי צועד במצעד והראו את כל מה שלמדנו.',
        grammarTopic: 'Jobs, a / an & He / She is Review',
        skills: ['Jobs', 'Review', 'Reading'],
        sentenceEn: 'My dad is a baker and my mom is a vet.',
        sentenceHe: 'אבא שלי אופה ואמא שלי וטרינרית.',
        vocab: [
          ['baker', 'noun', 'אופה', '🍞', 'The baker makes fresh bread.', 'האופה מכין לחם טרי.'],
          ['firefighter', 'noun', 'כבאי / כבאית', '🔥', 'The firefighter is brave.', 'הכבאי אמיץ.'],
          ['vet', 'noun', 'וטרינר / וטרינרית', '🐾', 'The vet helps my sick cat.', 'הווטרינרית עוזרת לחתול החולה שלי.'],
          ['builder', 'noun', 'בנאי / בנאית', '🏗️', 'The builder makes a new house.', 'הבנאי בונה בית חדש.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'balloon', translationHe: 'בלון' },
            { wordEn: 'ruler', translationHe: 'סרגל' },
          ],
          shortSentenceEn: 'She is a vet.',
          shortSentenceHe: 'היא וטרינרית.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'They are builders.',
            wrong: ['They is builders.', 'They are builder.'],
            explainHe: 'עם they (הם) אומרים are, וכשיש יותר מאחד המקצוע מקבל s: They are builders.',
            hintHe: 'כמה אנשים יש במשפט? בדקו את צורת be שמתאימה להם, ואם המקצוע מקבל תוספת בסוף.',
          },
          story: {
            passageEn:
              'The parade is in the street. A firefighter waves to the children. A baker gives them bread. A vet walks with a big dog. Everyone is happy.',
            passageHe: 'המצעד ברחוב. כבאית מנופפת לילדים. אופה נותן להם לחם. וטרינר הולך עם כלב גדול. כולם שמחים.',
            questionEn: 'Who walks with a big dog?',
            questionHe: 'מי הולך עם כלב גדול?',
            correct: 'a vet',
            wrong: ['a baker', 'a firefighter'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'My Busy Day',
    titleHe: 'עונה 2: היום העמוס שלי',
    subtitleHe: 'הרפתקאות בונוס: מה עושים כל יום (get up, go, eat) ומשפטי "I + פועל"',
    badgeEmoji: '⏰',
    missions: [
      {
        icon: '🌅',
        titleEn: 'Good Morning! I Get Up',
        titleHe: 'בוקר טוב! אני קם/ה',
        storyHookHe: 'השעון המעורר מצלצל! בואו נספר באנגלית מה אנחנו עושים כל בוקר.',
        grammarTopic: 'Morning Routine & "I + verb"',
        skills: ['Daily Routine', 'I + verb', 'Speaking Aloud'],
        sentenceEn: 'I get up and I eat breakfast.',
        sentenceHe: 'אני קם/ה ואני אוכל/ת ארוחת בוקר.',
        vocab: [
          ['get up', 'verb', 'לקום', '⏰', 'I get up early on Sunday.', 'אני קם/ה מוקדם ביום ראשון.'],
          ['wash', 'verb', 'לשטוף / לרחוץ', '💧', 'I wash my face with cold water.', 'אני שוטף/ת את הפנים במים קרים.'],
          ['brush', 'verb', 'לצחצח / להבריש', '🪥', 'I brush my teeth every morning.', 'אני מצחצח/ת שיניים כל בוקר.'],
          ['breakfast', 'noun', 'ארוחת בוקר', '🥣', 'We have eggs for breakfast.', 'אנחנו אוכלים ביצים לארוחת בוקר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'giraffe', translationHe: "ג'ירפה" },
            { wordEn: 'paper', translationHe: 'נייר / דף' },
          ],
          shortSentenceEn: 'I get up early.',
          shortSentenceHe: 'אני קם/ה מוקדם.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I wash my hands.',
            wrong: ['I am wash my hands.', 'I washes my hands.'],
            explainHe: 'כשמספרים מה עושים, אחרי I בא הפועל עצמו, בלי am ובלי es: I wash.',
            hintHe: 'אחרי אני בא הפועל כמו שהוא. בדקו שאין לפניו מילה מיותרת ושאין לו תוספת בסוף.',
          },
          story: {
            passageEn: 'I get up at seven. I wash my face. I brush my teeth. Then I eat breakfast with my sister.',
            passageHe: 'אני קם/ה בשבע. אני שוטף/ת פנים. אני מצחצח/ת שיניים. אחר כך אני אוכל/ת ארוחת בוקר עם אחותי.',
            questionEn: 'Who do I eat breakfast with?',
            questionHe: 'עם מי אני אוכל/ת ארוחת בוקר?',
            correct: 'my sister',
            wrong: ['my teacher', 'my dog'],
          },
        },
      },
      {
        icon: '🏫',
        titleEn: 'I Go to School',
        titleHe: 'אני הולך/ת לבית הספר',
        storyHookHe: 'התיק על הגב ויוצאים לדרך! מה עושים בבית הספר ומה אוכלים בצהריים?',
        grammarTopic: 'School Day & "I + verb" (go, eat, do)',
        skills: ['Daily Routine', 'I + verb', 'Listening'],
        sentenceEn: 'I go to school and I eat lunch at home.',
        sentenceHe: 'אני הולך/ת לבית הספר ואני אוכל/ת ארוחת צהריים בבית.',
        vocab: [
          ['go', 'verb', 'ללכת / לנסוע', '🚌', 'I go to school by bus.', 'אני נוסע/ת לבית הספר באוטובוס.'],
          ['eat', 'verb', 'לאכול', '🍽️', 'We eat together at the table.', 'אנחנו אוכלים יחד ליד השולחן.'],
          ['lunch', 'noun', 'ארוחת צהריים', '🥪', 'I have a sandwich for lunch.', 'יש לי כריך לארוחת צהריים.'],
          ['homework', 'noun', 'שיעורי בית', '📝', 'I do my homework after lunch.', 'אני מכין/ה שיעורי בית אחרי ארוחת הצהריים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'monkey', translationHe: 'קוף' },
            { wordEn: 'crayon', translationHe: 'עיפרון צבעוני' },
          ],
          shortSentenceEn: 'I go to school.',
          shortSentenceHe: 'אני הולך/ת לבית הספר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I do my homework.',
            wrong: ['I my homework do.', 'I am do my homework.'],
            explainHe: 'באנגלית הסדר הוא: מי (I), מה עושים (do), ואז מה (my homework).',
            hintHe: 'קודם מי עושה, מיד אחריו הפועל, ורק בסוף הדבר. האם צריך מילה בין אני לפועל?',
          },
          story: {
            passageEn: 'I go to school at eight. I sit with my friend Ron. At one, I go home. I eat lunch and I do my homework.',
            passageHe: 'אני הולך/ת לבית הספר בשמונה. אני יושב/ת עם החבר שלי רון. באחת אני הולך/ת הביתה. אני אוכל/ת ארוחת צהריים ומכין/ה שיעורי בית.',
            questionEn: 'Who do I sit with?',
            questionHe: 'ליד מי אני יושב/ת?',
            correct: 'my friend Ron',
            wrong: ['my mom', 'the teacher'],
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: Season 2 Finale, Day and Night',
        titleHe: 'אתגר הבוס: סיום עונה 2, מבוקר עד לילה',
        storyHookHe: 'הגמר הגדול של עונה 2! ספרו על יום שלם, מהבוקר ועד הלילה, וזכו בגביע.',
        grammarTopic: 'My Day, I + verb & Review',
        skills: ['Daily Routine', 'Review', 'Reading Aloud'],
        sentenceEn: 'I play in the park and I eat dinner at seven.',
        sentenceHe: 'אני משחק/ת בפארק ואני אוכל/ת ארוחת ערב בשבע.',
        vocab: [
          ['play', 'verb', 'לשחק', '⚽', 'I play football with my brother.', 'אני משחק/ת כדורגל עם אח שלי.'],
          ['dinner', 'noun', 'ארוחת ערב', '🍲', 'Dad makes soup for dinner.', 'אבא מכין מרק לארוחת ערב.'],
          ['sleep', 'verb', 'לישון', '😴', 'Babies sleep a lot.', 'תינוקות ישנים הרבה.'],
          ['night', 'noun', 'לילה', '🌃', 'The moon is big tonight.', 'הירח גדול הלילה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'scissors', translationHe: 'מספריים' },
            { wordEn: 'lion', translationHe: 'אריה' },
          ],
          shortSentenceEn: 'I sleep at night.',
          shortSentenceHe: 'אני ישן/ה בלילה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I play with my friends.',
            wrong: ['I plays with my friends.', 'I am play with my friends.'],
            explainHe: 'אחרי I הפועל נשאר כמו שהוא: I play. לא מוסיפים s ולא am.',
            hintHe: 'אחרי אני בא הפועל בלי שום תוספת ובלי מילה לפניו.',
          },
          story: {
            passageEn:
              'After school, I play in the park. At seven, I eat dinner with my family. I brush my teeth. At nine, I go to bed. I sleep all night.',
            passageHe:
              'אחרי בית הספר אני משחק/ת בפארק. בשבע אני אוכל/ת ארוחת ערב עם המשפחה. אני מצחצח/ת שיניים. בתשע אני הולך/ת לישון. אני ישן/ה כל הלילה.',
            questionEn: 'Where do I play after school?',
            questionHe: 'איפה אני משחק/ת אחרי בית הספר?',
            correct: 'in the park',
            wrong: ['in the kitchen', 'at the zoo'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_3_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-3', UNITS);
