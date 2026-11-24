import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 9 unit (Band II): conditionals recycled for careers, the first conditional
 * (If you practice, you will…) for real plans and the second (If I were…, I would…) for imagined
 * ones, with Band II Core II words the app never taught. Example Hebrew addresses the learner in
 * the plural; hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_4: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Careers',
  titleHe: 'קריירה ומקצועות',
  subtitleHe: 'עונה 4: מדברים על העתיד המקצועי עם If…, will ו-If I were…, I would',
  badgeEmoji: '💼',
  missions: [
    {
      icon: '🧑‍🎓',
      titleEn: 'If You Practice, You Will…',
      titleHe: 'אם תתאמנו, אז…',
      storyHookHe:
        'מה צריך כדי להגיע למקצוע שחולמים עליו? תנאי אמיתי לעתיד: If + הווה, ואחר כך will: If you practice, you will get better.',
      grammarTopic: 'First conditional: If + present, will + verb',
      skills: ['First Conditional', 'Plans', 'Careers'],
      sentenceEn: 'If you love animals, you will enjoy working as a vet.',
      sentenceHe: 'אם אתם אוהבים בעלי חיים, תיהנו לעבוד כווטרינרים.',
      vocab: [
        ['end up', 'phrasal verb', 'למצוא את עצמכם / להגיע בסוף', '🏁', 'If you don\'t plan, you will end up in a job you don\'t like.', 'אם לא תתכננו, תמצאו את עצמכם בעבודה שאתם לא אוהבים.'],
        ['set off', 'phrasal verb', 'לצאת לדרך', '🚀', 'If we set off early, we will get to the job fair on time.', 'אם נצא לדרך מוקדם, נגיע ליריד התעסוקה בזמן.'],
        ['take up', 'phrasal verb', 'להתחיל (תחביב / עיסוק)', '🎸', 'If you take up coding now, you will be good at it by twelfth grade.', 'אם תתחילו לתכנת עכשיו, תהיו טובים בזה עד כיתה י״ב.'],
        ['try out', 'phrasal verb', 'לנסות', '🧪', 'If you try out different jobs in the summer, you will learn what you like.', 'אם תנסו עבודות שונות בקיץ, תלמדו מה אתם אוהבים.'],
        ['adapt', 'verb', 'להסתגל', '🦎', 'If you move to a new city, you will need to adapt quickly.', 'אם תעברו לעיר חדשה, תצטרכו להסתגל מהר.'],
        ['aware', 'adjective', 'מודע', '👀', 'If you are aware of your strengths, you will choose better.', 'אם תהיו מודעים לחוזקות שלכם, תבחרו טוב יותר.'],
        ['various', 'adjective', 'שונים / מגוונים', '🎨', 'Doctors can work in various places, like hospitals and schools.', 'רופאים יכולים לעבוד במקומות שונים, כמו בתי חולים ובתי ספר.'],
        ['session', 'noun', 'מפגש', '🗓️', 'If you come to the advice session, you will meet real engineers.', 'אם תבואו למפגש הייעוץ, תפגשו מהנדסים אמיתיים.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'bracelet', translationHe: 'צמיד' },
          { wordEn: 'chimney', translationHe: 'ארובה' },
        ],
        shortSentenceEn: 'If it rains, we will play inside.',
        shortSentenceHe: 'אם ירד גשם, נשחק בפנים.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'If you practice every day, you will get better.',
          wrong: ['If you will practice every day, you will get better.', 'If you practice every day, you getting better.'],
          explainHe: 'תנאי מסוג ראשון: If + הווה, ואחר כך will + פועל. אחרי if לא בא will.',
          hintHe: 'איפה עומד will, ואיפה לא?',
        },
        story: {
          passageEn:
            'Shir wants to be a pilot. Her uncle, who is a pilot, told her, "If you take up flying at seventeen, you will understand the job better." He also said that pilots need to adapt to different weather and various countries. Shir is going to try out a flight simulator next week.',
          passageHe:
            'שיר רוצה להיות טייסת. הדוד שלה, שהוא טייס, אמר לה: "אם תתחילי ללמוד טיסה בגיל שבע עשרה, תביני את המקצוע טוב יותר." הוא גם אמר שטייסים צריכים להסתגל למזג אוויר שונה ולמדינות שונות. בשבוע הבא שיר הולכת לנסות סימולטור טיסה.',
          questionEn: 'What is Shir going to do next week?',
          questionHe: 'מה שיר הולכת לעשות בשבוע הבא?',
          correct: 'Try out a flight simulator.',
          wrong: ['Take a real flight.', 'Visit another country.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'If it is sunny, we will go to the beach.',
              wrong: ['If it will be sunny, we will go to the beach.'],
              explainHe: 'אחרי if בא הווה (is), לא will.',
              hintHe: 'מה בא אחרי if?',
            },
            story: {
              passageEn: 'If you come to the session, you will meet a real chef. He will cook with you!',
              passageHe: 'אם תבואו למפגש, תפגשו שף אמיתי. הוא יבשל איתכם!',
              questionEn: 'Who will they meet?',
              questionHe: 'את מי הם יפגשו?',
              correct: 'A real chef.',
              wrong: ['A pilot.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['aware', 'various'],
              ['aware', 'session'],
              ['aware', 'various'],
              ['aware', 'session'],
              ['various', 'session'],
              ['session', 'set off'],
              ['aware', 'adapt'],
              ['aware', 'various'],
            ],
          },
          master: {
            sentenceEn: 'If you set off now, you will catch the last train.',
            sentenceHe: 'אם תצאו לדרך עכשיו, תספיקו לרכבת האחרונה.',
            decoys: ['caught', 'would'],
            voiceEn: 'If I take up photography, I will buy a camera.',
            voiceHe: 'אם אתחיל לצלם, אקנה מצלמה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If she gets the job, she will move to Tel Aviv.',
              wrong: [
                'If she will get the job, she will move to Tel Aviv.',
                'If she get the job, she will move to Tel Aviv.',
                'If she gets the job, she will moves to Tel Aviv.',
              ],
              explainHe: 'אחרי If בא הווה (she gets, עם s), ואחרי will בא פועל בלי s.',
              hintEn: 'Check gets and will move.',
            },
            story: {
              passageEn:
                'Amit was sure he wanted to be a lawyer. Then, during a career session at school, he tried out a short coding course. If he enjoys the next course too, he will take up computer science in high school. His mom told him that it is fine to change plans, because many people end up in jobs they never imagined.',
              passageHe: '',
              questionEn: 'Why might Amit take up computer science?',
              questionHe: '',
              correct: 'He enjoyed a coding course and may enjoy the next one.',
              wrong: ['His mom wants him to.', 'He does not like lawyers.', 'The school told him to.'],
            },
            storyHintEn: 'What happened during the career session?',
          },
        },
      },
    },
    {
      icon: '💭',
      titleEn: 'If I Were You…',
      titleHe: 'אם הייתי במקומכם…',
      storyHookHe:
        'בואו נדמיין! תנאי דמיוני: If + עבר, ואחר כך would: If I were a doctor, I would… ועצה: If I were you, I would…',
      grammarTopic: 'Second conditional: If + past, would + verb',
      skills: ['Second Conditional', 'Advice', 'Dream Jobs'],
      sentenceEn: 'If I were a doctor, I would help people in small villages.',
      sentenceHe: 'אם הייתי רופא/ה, הייתי עוזר/ת לאנשים בכפרים קטנים.',
      vocab: [
        ['if I were you', 'phrase', 'אם הייתי במקומכם', '🤔', 'I would ask for help if I were you.', 'הייתי מבקש/ת עזרה אם הייתי במקומכם.'],
        ['would rather', 'phrase', 'מעדיף ל...', '⚖️', 'I would rather work outside than in an office.', 'הייתי מעדיף/ה לעבוד בחוץ מאשר במשרד.'],
        ['What if', 'phrase', 'מה אם...?', '❓', 'What if I didn\'t get the job?', 'ומה אם לא אקבל את העבודה?'],
        ['I suppose', 'phrase', 'אני מניח/ה', '💭', 'I suppose I would be a teacher if I were more patient.', 'אני מניח/ה שהייתי מורה אם הייתי סבלני/ת יותר.'],
        ['I guess', 'phrase', 'כנראה / אני מניח/ה', '🤷', 'I guess I would travel more if I had more money.', 'כנראה שהייתי מטייל/ת יותר אם היה לי יותר כסף.'],
        ['change your mind', 'phrase', 'לשנות את דעתכם', '🔄', 'You can change your mind about your career many times.', 'אפשר לשנות את הדעה לגבי הקריירה הרבה פעמים.'],
        ['face-to-face', 'adverb', 'פנים אל פנים', '👥', 'If I were a manager, I would talk to workers face-to-face.', 'אם הייתי מנהל/ת, הייתי מדבר/ת עם העובדים פנים אל פנים.'],
        ['terrific', 'adjective', 'נהדר', '🌟', 'It would be terrific if I could work with animals.', 'זה היה נהדר אם הייתי יכול/ה לעבוד עם בעלי חיים.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'helmet', translationHe: 'קסדה' },
          { wordEn: 'whistle', translationHe: 'משרוקית' },
        ],
        shortSentenceEn: 'I would be a pilot.',
        shortSentenceHe: 'הייתי טייס/ת.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'If I had more time, I would learn to play the piano.',
          wrong: ['If I would have more time, I would learn to play the piano.', 'If I had more time, I will learn to play the piano.'],
          explainHe: 'תנאי דמיוני (מסוג שני): If + עבר (had), ואחר כך would + פועל.',
          hintHe: 'מה בא אחרי if, ומה בא בחלק השני?',
        },
        story: {
          passageEn:
            'Our class played a career game. Each student answered the question "What job would you choose if you could choose any job?" Tom said that he would rather be a game designer than a doctor. Noa said that if she were rich, she would open an animal hospital. The teacher said that the answers were terrific.',
          passageHe:
            'בכיתה שלנו שיחקנו משחק קריירה. כל תלמיד ענה על השאלה: איזו עבודה הייתם בוחרים אם הייתם יכולים לבחור כל עבודה? תום אמר שהוא מעדיף להיות מעצב משחקים מאשר רופא. נועה אמרה שאם היא הייתה עשירה, היא הייתה פותחת בית חולים לבעלי חיים. המורה אמרה שהתשובות היו נהדרות.',
          questionEn: 'What would Noa do if she were rich?',
          questionHe: 'מה נועה הייתה עושה אם הייתה עשירה?',
          correct: 'Open an animal hospital.',
          wrong: ['Design games.', 'Become a doctor.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'If I were a bird, I would fly.',
              wrong: ['If I am a bird, I would fly.'],
              explainHe: 'בתנאי דמיוני אומרים If I were.',
              hintHe: 'זה דמיון, לא מציאות. איזה פועל מתאים?',
            },
            story: {
              passageEn: 'If I were a chef, I would cook pizza every day. That would be terrific!',
              passageHe: 'אם הייתי שף, הייתי מבשל/ת פיצה כל יום. זה היה נהדר!',
              questionEn: 'What would I cook every day?',
              questionHe: 'מה הייתי מבשל/ת כל יום?',
              correct: 'Pizza.',
              wrong: ['Soup.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['terrific', 'change your mind'],
              ['I guess', 'terrific'],
              ['Would rather', 'Terrific'],
              ['Would rather', 'Face-to-face'],
              ['Would rather', 'Terrific'],
              ['face-to-face', 'terrific'],
              ['would rather', 'I suppose'],
              ['would rather', 'I guess'],
            ],
          },
          master: {
            sentenceEn: 'What would you do if you lost your phone?',
            sentenceHe: 'מה הייתם עושים אם הייתם מאבדים את הטלפון?',
            decoys: ['will', 'lose'],
            voiceEn: 'If I were you, I would talk to her face-to-face.',
            voiceHe: 'אם הייתי במקומכם, הייתי מדבר/ת איתה פנים אל פנים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If he knew the answer, he would tell us.',
              wrong: [
                'If he knows the answer, he would tell us.',
                'If he would know the answer, he would tell us.',
                'If he knew the answer, he will tell us.',
              ],
              explainHe: 'תנאי דמיוני: If + עבר (knew), ואחר כך would + פועל.',
              hintEn: 'Check knew and would.',
            },
            story: {
              passageEn:
                'Dana was offered a summer job at a café, but she would rather work with children. Her dad said, "If I were you, I would ask at the community center." Dana thought, "What if they say no?" In the end, she went there and talked to the manager face-to-face. Two days later, they called her: she got the job!',
              passageHe: '',
              questionEn: 'Why did Dana go to the community center?',
              questionHe: '',
              correct: 'She preferred working with children.',
              wrong: ['The café was closed.', 'Her dad worked there.', 'The manager called her first.'],
            },
            storyHintEn: 'What kind of work did Dana want?',
          },
        },
      },
    },
    {
      icon: '💼',
      isBoss: true,
      titleEn: 'Boss: Career Day',
      titleHe: 'אתגר הבוס: יום הקריירה',
      storyHookHe: 'יום הקריירה בבית הספר! דברו על תוכניות אמיתיות עם If…, will, ועל חלומות עם If I were…, I would.',
      grammarTopic: 'First and second conditionals: Review',
      skills: ['First Conditional', 'Second Conditional', 'Review'],
      sentenceEn: 'If you visit the fire station, you will see the trucks up close.',
      sentenceHe: 'אם תבקרו בתחנת כיבוי האש, תראו את המשאיות מקרוב.',
      vocab: [
        ['babysit', 'verb', 'לעשות בייביסיטר', '👶', 'If you babysit for your neighbors, you will earn some money.', 'אם תעשו בייביסיטר לשכנים, תרוויחו קצת כסף.'],
        ['fire station', 'noun', 'תחנת כיבוי אש', '🔥', 'If I were a firefighter, I would sleep at the fire station.', 'אם הייתי כבאי/ת, הייתי ישן/ה בתחנת כיבוי האש.'],
        ['female', 'adjective', 'נשית / (ממין) נקבה', '👩', 'There are more female pilots today than in the past.', 'יש היום יותר טייסות מאשר בעבר.'],
        ['institution', 'noun', 'מוסד', '🏛️', 'A university is an institution for higher education.', 'אוניברסיטה היא מוסד להשכלה גבוהה.'],
        ['facility', 'noun', 'מתקן', '🏭', 'The new sports facility will open if the city finds the money.', 'מתקן הספורט החדש ייפתח אם העירייה תמצא את הכסף.'],
        ['apart from', 'phrase', 'חוץ מ...', '➖', 'Everyone in my family is a teacher apart from me.', 'כולם במשפחה שלי מורים חוץ ממני.'],
        ['lately', 'adverb', 'לאחרונה', '📅', 'I have been thinking a lot about my future lately.', 'לאחרונה אני חושב/ת הרבה על העתיד שלי.'],
        ['quite a while', 'phrase', 'די הרבה זמן', '⌛', 'It took quite a while to find a job that I liked.', 'לקח די הרבה זמן למצוא עבודה שאהבתי.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'saucer', translationHe: 'תחתית' },
          { wordEn: 'kettle', translationHe: 'קומקום' },
        ],
        shortSentenceEn: 'I would be a vet.',
        shortSentenceHe: 'הייתי וטרינר/ית.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'If I lived near the sea, I would work as a lifeguard.',
          wrong: ['If I live near the sea, I would work as a lifeguard.', 'If I lived near the sea, I will work as a lifeguard.'],
          explainHe: 'תנאי דמיוני: If + עבר (lived) ו-would + פועל. לא מערבבים בין שני סוגי התנאי.',
          hintHe: 'בדקו ששני החלקים מאותו סוג.',
        },
        story: {
          passageEn:
            'At our school\'s Career Day, a female firefighter came to speak. She said that she worked at the fire station near our school. She told us that, apart from fires, firefighters also help at car accidents. Lately, more women have joined the fire service. She said, "If you are strong and calm, you will be a great firefighter!"',
          passageHe:
            'ביום הקריירה בבית הספר שלנו, כבאית הגיעה לדבר. היא אמרה שהיא עובדת בתחנת כיבוי האש ליד בית הספר שלנו. היא סיפרה לנו שחוץ משריפות, כבאים עוזרים גם בתאונות דרכים. לאחרונה הצטרפו יותר נשים לשירותי הכבאות. היא אמרה: "אם אתם חזקים ורגועים, תהיו כבאים מצוינים!"',
          questionEn: 'Where does the firefighter work?',
          questionHe: 'איפה עובדת הכבאית?',
          correct: 'At the fire station near the school.',
          wrong: ['At a hospital.', 'In another city.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'If you babysit, you will earn money.',
              wrong: ['If you will babysit, you will earn money.'],
              explainHe: 'אחרי if לא בא will.',
              hintHe: 'מה בא אחרי if?',
            },
            story: {
              passageEn: 'Apart from my sister, everyone in my family works in a hospital. My sister is a chef.',
              passageHe: 'חוץ מאחותי, כל המשפחה שלי עובדת בבית חולים. אחותי שפית.',
              questionEn: 'What is the sister\'s job?',
              questionHe: 'מה המקצוע של האחות?',
              correct: 'A chef.',
              wrong: ['A doctor.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['lately', 'female'],
              ['lately', 'apart from'],
              ['lately', 'babysit'],
              ['lately', 'babysit'],
              ['lately', 'babysit'],
              ['lately', 'facility'],
              ['female', 'institution'],
              ['female', 'facility'],
            ],
          },
          master: {
            sentenceEn: 'If I were a pilot, I would fly all over the world.',
            sentenceHe: 'אם הייתי טייס/ת, הייתי טס/ה לכל העולם.',
            decoys: ['am', 'will'],
            voiceEn: 'Lately, I have been thinking about becoming a vet.',
            voiceHe: 'לאחרונה אני חושב/ת להיות וטרינר/ית.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If the facility opens, many people will work there.',
              wrong: [
                'If the facility will open, many people will work there.',
                'If the facility open, many people will work there.',
                'If the facility opens, many people would working there.',
              ],
              explainHe: 'תנאי מסוג ראשון: If + הווה (opens, עם s), ואחר כך will + פועל.',
              hintEn: 'Check opens and will work.',
            },
            story: {
              passageEn:
                'For quite a while, Yarden has babysat for families in her building, and she loves it. Lately, she has started to think about a career with kids. Her aunt, who works at an educational institution, told her, "If you study education, you will have many options. Apart from teaching, you could work in a museum or a hospital."',
              passageHe: '',
              questionEn: 'Why is Yarden thinking about a career with kids?',
              questionHe: '',
              correct: 'She has enjoyed babysitting for a long time.',
              wrong: ['Her aunt told her to stop babysitting.', 'She wants to work in a hospital.', 'She does not like her building.'],
            },
            storyHintEn: 'What has Yarden done for quite a while?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 9 unit (`../../registry.ts`) */
export const CORE_4_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', [UNIT_CORE_4]);
