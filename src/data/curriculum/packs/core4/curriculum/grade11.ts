import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 11 unit (Band III): the future perfect (By 2040, robots will have changed…)
 * and the future in the past (I was going to…, She said that she would…), about predictions and
 * plans, with Band III Core I (4-point) words the app never had. Example Hebrew addresses the
 * learner in the plural; hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_4: HighSchoolUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Predictions & Plans',
  titleHe: 'תחזיות ותוכניות',
  subtitleHe: 'עונה 4: מה כבר יקרה עד אז? will have + V3, ומה התכוונו לעשות: was going to ו-would',
  badgeEmoji: '🔮',
  missions: [
    {
      icon: '🚀',
      titleEn: 'By 2040, We Will Have…',
      titleHe: 'עד 2040, כבר…',
      storyHookHe:
        'איך ייראה העולם בעוד עשרים שנה? כשמדברים על משהו שכבר יסתיים עד זמן מסוים בעתיד, משתמשים ב-will have + V3: By 2040, robots will have changed many jobs.',
      grammarTopic: 'Future perfect: will have + past participle',
      skills: ['Future Perfect', 'Predictions', 'Careers of the Future'],
      sentenceEn: 'By the end of this year, we will have learned a lot of new words.',
      sentenceHe: 'עד סוף השנה הזאת, נלמד הרבה מילים חדשות.',
      vocab: [
        ['fortune', 'noun', 'הון', '💰', 'By the age of forty, she will have made a fortune.', 'עד גיל ארבעים, היא כבר תעשה הון.'],
        ['profession', 'noun', 'מקצוע', '💼', 'By 2040, robots will have changed almost every profession.', 'עד 2040, רובוטים כבר ישנו כמעט כל מקצוע.'],
        ['unemployed', 'adjective', 'מובטל', '🧑‍💼', 'By next year, the new factory will have hired many people who were unemployed.', 'עד השנה הבאה, המפעל החדש כבר יעסיק הרבה אנשים שהיו מובטלים.'],
        ['union', 'noun', 'איגוד', '🤝', 'The workers\' union will have signed a new agreement by June.', 'איגוד העובדים יחתום על הסכם חדש עד יוני.'],
        ['psychology', 'noun', 'פסיכולוגיה', '🧠', 'By the time she is twenty-five, Noa will have finished her degree in psychology.', 'עד גיל עשרים וחמש, נועה כבר תסיים את התואר שלה בפסיכולוגיה.'],
        ['personality', 'noun', 'אישיות', '😊', 'Your personality will have changed a lot by the time you are thirty.', 'האישיות שלכם תשתנה הרבה עד שתהיו בני שלושים.'],
        ['maker', 'noun', 'יצרן', '🏭', 'The car maker says that it will have built a flying car by 2035.', 'יצרנית המכוניות אומרת שעד 2035 היא תבנה מכונית מעופפת.'],
        ['input', 'noun', 'משוב / הערות; קלט', '⌨️', 'Thanks for your input. We will have improved the app by next month.', 'תודה על ההערות שלכם. נשפר את האפליקציה עד החודש הבא.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'mitten', translationHe: 'כפפה' },
          { wordEn: 'wheelbarrow', translationHe: 'מריצה' },
        ],
        shortSentenceEn: 'I will have finished by six.',
        shortSentenceHe: 'אסיים עד שש.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'By next June, I will have finished school.',
          wrong: ['By next June, I will have finish school.', 'By next June, I will has finished school.'],
          explainHe: 'future perfect: will have + V3 (finished). אחרי will תמיד have, לא has.',
          hintHe: 'בדקו את have ואת צורת הפועל.',
        },
        story: {
          passageEn:
            'A science magazine asks experts about life in 2050. One expert predicts that by 2050, robots will have taken over many boring jobs. Another says that people will have found new kinds of work, especially in psychology and education, because people need a human touch.',
          passageHe:
            'מגזין מדע שואל מומחים על החיים בשנת 2050. מומחה אחד חוזה שעד 2050 רובוטים כבר יחליפו הרבה עבודות משעממות. מומחה אחר אומר שאנשים כבר ימצאו סוגים חדשים של עבודה, במיוחד בפסיכולוגיה ובחינוך, כי אנשים צריכים מגע אנושי.',
          questionEn: 'Which jobs will robots take over, according to the first expert?',
          questionHe: 'אילו עבודות רובוטים יחליפו, לפי המומחה הראשון?',
          correct: 'Many boring jobs.',
          wrong: ['Jobs in psychology.', 'Jobs in education.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'I will have finished my homework by eight.',
              wrong: ['I will have finish my homework by eight.'],
              explainHe: 'will have + V3: finished.',
              hintHe: 'באיזו צורה בא הפועל אחרי will have?',
            },
            story: {
              passageEn: 'Tom wants to make a fortune. He thinks that he will have saved a million shekels by the age of thirty.',
              passageHe: 'תום רוצה לעשות הון. הוא חושב שעד גיל שלושים הוא יחסוך מיליון שקלים.',
              questionEn: 'How much does Tom want to save?',
              questionHe: 'כמה תום רוצה לחסוך?',
              correct: 'A million shekels.',
              wrong: ['A thousand shekels.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['unemployed', 'psychology'],
              ['unemployed', 'psychology'],
              ['union', 'maker'],
              ['unemployed', 'psychology'],
              ['unemployed', 'maker'],
              ['unemployed', 'union'],
              ['unemployed', 'psychology'],
              ['unemployed', 'psychology'],
            ],
          },
          master: {
            sentenceEn: 'By the time we arrive, the movie will have started.',
            sentenceHe: 'עד שנגיע, הסרט כבר יתחיל.',
            decoys: ['has', 'starts'],
            voiceEn: 'By 2030, I will have chosen my profession.',
            voiceHe: 'עד 2030, אבחר את המקצוע שלי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'By Friday, the workers will have painted the whole building.',
              wrong: [
                'By Friday, the workers will have paint the whole building.',
                'By Friday, the workers will has painted the whole building.',
                'By Friday, the workers have will painted the whole building.',
              ],
              explainHe: 'future perfect: will have + V3 (painted), בסדר הזה.',
              hintEn: 'Check will have and painted.',
            },
            story: {
              passageEn:
                'Lior is sixteen and has a ten-year plan. By twenty-one, he will have finished his army service. By twenty-six, he will have studied psychology. His grandmother laughed when she saw the plan. "When I was your age, I was going to be a dancer," she said, "but life had other ideas."',
              passageHe: '',
              questionEn: 'What is Grandma\'s message to Lior?',
              questionHe: '',
              correct: 'Plans can change.',
              wrong: ['He should become a dancer.', 'He should not study psychology.', 'Ten years is too short.'],
            },
            storyHintEn: 'What happened to Grandma\'s plan?',
          },
        },
      },
    },
    {
      icon: '⏪',
      titleEn: 'I Was Going to…',
      titleHe: 'התכוונתי ל…',
      storyHookHe:
        'מה התכוונו לעשות, ומה באמת קרה? עתיד מנקודת מבט של העבר: was / were going to, ו-would: I thought that it would rain.',
      grammarTopic: 'Future in the past: was going to / would',
      skills: ['Future in the Past', 'was going to', 'would'],
      sentenceEn: 'We were going to fly to Rome, but the flight was canceled.',
      sentenceHe: 'התכוונו לטוס לרומא, אבל הטיסה בוטלה.',
      vocab: [
        ['about to', 'phrase', 'עומד ל...', '⏳', 'I was about to leave when the phone rang.', 'עמדתי לצאת כשהטלפון צלצל.'],
        ['see off', 'phrasal verb', 'ללוות (בפרידה)', '👋', 'We went to the airport to see off our cousins.', 'נסענו לשדה התעופה ללוות את בני הדודים שלנו.'],
        ['misunderstand', 'verb', 'להבין לא נכון', '🤔', 'I didn\'t want them to misunderstand the plan: we were going to meet at six, not seven.', 'לא רציתי שהם יבינו לא נכון את התוכנית: התכוונו להיפגש בשש, לא בשבע.'],
        ['get it wrong', 'phrase', 'לטעות', '❌', 'I was sure that I would get it wrong, but I got every answer right.', 'הייתי בטוח/ה שאטעה, אבל עניתי נכון על הכול.'],
        ['strangely enough', 'phrase', 'למרבה הפלא', '🤨', 'The forecast said that it would rain, but strangely enough the sun came out.', 'התחזית אמרה שירד גשם, אבל למרבה הפלא השמש יצאה.'],
        ['in actual fact', 'phrase', 'למעשה', '💡', 'We thought that the trip would be boring, but in actual fact it was great.', 'חשבנו שהטיול יהיה משעמם, אבל למעשה הוא היה נהדר.'],
        ['tired of', 'phrase', 'נמאס מ...', '😩', 'She was tired of waiting, so she was going to leave.', 'נמאס לה לחכות, אז היא התכוונה ללכת.'],
        ['pity', 'noun', 'חבל / רחמים', '😔', 'It was a pity that the concert was canceled. We were going to dance all night.', 'חבל שההופעה בוטלה. התכוונו לרקוד כל הלילה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'anchor', translationHe: 'עוגן' },
          { wordEn: 'thimble', translationHe: 'אצבעון' },
        ],
        shortSentenceEn: 'I was going to call you.',
        shortSentenceHe: 'התכוונתי להתקשר אליכם.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'I knew that you would understand.',
          wrong: ['I knew that you will understand.', 'I knew that you would understood.'],
          explainHe: 'עתיד מנקודת מבט של העבר: would + פועל בסיס (understand).',
          hintHe: 'המשפט בעבר (knew). מה בא במקום will?',
        },
        story: {
          passageEn:
            'Last summer, Shira was going to work at a summer camp. She was about to sign the contract when she got another offer: a job at a science museum. Strangely enough, she chose the museum, although she had always loved camps. In actual fact, she said later, it was the best summer of her life.',
          passageHe:
            'בקיץ שעבר שירה התכוונה לעבוד בקייטנה. היא עמדה לחתום על החוזה כשקיבלה הצעה אחרת: עבודה במוזיאון מדע. למרבה הפלא, היא בחרה במוזיאון, למרות שתמיד אהבה קייטנות. למעשה, היא אמרה אחר כך, זה היה הקיץ הכי טוב בחייה.',
          questionEn: 'Where did Shira work in the end?',
          questionHe: 'איפה שירה עבדה בסוף?',
          correct: 'At a science museum.',
          wrong: ['At a summer camp.', 'At a school.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'I was going to call you, but I forgot.',
              wrong: ['I was going to called you, but I forgot.'],
              explainHe: 'was going to + פועל בסיס: call.',
              hintHe: 'מה בא אחרי going to?',
            },
            story: {
              passageEn: 'It was a pity that it rained. We were going to have a picnic.',
              passageHe: 'חבל שירד גשם. התכוונו לעשות פיקניק.',
              questionEn: 'What were they going to do?',
              questionHe: 'מה הם התכוונו לעשות?',
              correct: 'Have a picnic.',
              wrong: ['Go swimming.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pity', 'in actual fact'],
              ['pity', 'tired of'],
              ['pity', 'about to'],
              ['in actual fact', 'about to'],
              ['tired of', 'pity'],
              ['tired of', 'see off'],
              ['pity', 'see off'],
              ['misunderstand', 'about to'],
            ],
          },
          master: {
            sentenceEn: 'She said that she would call me, but she never did.',
            sentenceHe: 'היא אמרה שהיא תתקשר אליי, אבל היא אף פעם לא התקשרה.',
            decoys: ['will', 'calls'],
            voiceEn: 'I was about to give up, but strangely enough I won.',
            voiceHe: 'עמדתי לוותר, אבל למרבה הפלא ניצחתי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'We thought that the bus would arrive soon.',
              wrong: [
                'We thought that the bus will arrive soon.',
                'We thought that the bus would arrives soon.',
                'We thought that the bus would to arrive soon.',
              ],
              explainHe: 'אחרי thought (עבר) בא would ופועל בסיס: would arrive.',
              hintEn: 'Check would and the verb.',
            },
            story: {
              passageEn:
                'In 1900, some writers imagined that by the year 2000, people would fly to work in small flying machines. Strangely enough, that never happened. In actual fact, most people still travel to work on the ground. Some experts say that the old predictions got the future of work wrong because they did not imagine the internet: today, many people work from home.',
              passageHe: '',
              questionEn: 'Why did the old predictions get it wrong, according to some experts?',
              questionHe: '',
              correct: 'They did not imagine the internet.',
              wrong: ['Planes were too expensive.', 'People were tired of cars.', 'Nobody wanted to fly.'],
            },
            storyHintEn: 'What did the old predictions not imagine?',
          },
        },
      },
    },
    {
      icon: '✉️',
      isBoss: true,
      titleEn: 'Boss: A Letter to My Future Self',
      titleHe: 'אתגר הבוס: מכתב לעצמי בעתיד',
      storyHookHe:
        'כתבו מכתב לעצמכם בעוד עשר שנים: מה כבר תעשו עד אז (will have), ומה חשבתם פעם שיקרה (would, was going to).',
      grammarTopic: 'Future perfect & future in the past: Review',
      skills: ['Future Perfect', 'Future in the Past', 'Review'],
      sentenceEn: 'In ten years, I will have traveled to at least five countries.',
      sentenceHe: 'בעוד עשר שנים, כבר אספיק לטייל בחמש מדינות לפחות.',
      vocab: [
        ['incredible', 'adjective', 'מדהים / לא ייאמן', '🤩', 'By then, I will have seen incredible places.', 'עד אז, כבר אראה מקומות מדהימים.'],
        ['enjoyable', 'adjective', 'מהנה', '😊', 'I hope that your job will be enjoyable.', 'אני מקווה שהעבודה שלכם תהיה מהנה.'],
        ['immigration', 'noun', 'עלייה / הגירה', '✈️', 'My grandparents told me that immigration to Israel was hard, but they never gave up.', 'סבא וסבתא שלי סיפרו לי שהעלייה לישראל הייתה קשה, אבל הם אף פעם לא ויתרו.'],
        ['mood', 'noun', 'מצב רוח', '🙂', 'If you are in a bad mood, read this letter again.', 'אם אתם במצב רוח רע, קראו את המכתב הזה שוב.'],
        ['regards', 'noun', 'בברכה / דרישת שלום', '💌', 'Best regards from your younger self!', 'בברכה, מכם מלפני כמה שנים!'],
        ['once in a while', 'phrase', 'מדי פעם', '🔁', 'I hope that you still call your old friends once in a while.', 'אני מקווה שאתם עדיין מתקשרים לחברים הישנים מדי פעם.'],
        ['or so', 'phrase', 'בערך', '🕰️', 'In ten years or so, you will have finished university.', 'בעוד עשר שנים בערך, כבר תסיימו את האוניברסיטה.'],
        ['occasional', 'adjective', 'מזדמן / מדי פעם', '🍬', 'I promised myself that I would have only an occasional piece of candy.', 'הבטחתי לעצמי שאוכל ממתק רק מדי פעם.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'hedgehog', translationHe: 'קיפוד' },
          { wordEn: 'cushion', translationHe: 'כרית ספה' },
        ],
        shortSentenceEn: 'I hope you are happy.',
        shortSentenceHe: 'אני מקווה שאתם שמחים.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'When I was ten, I thought that I would be a famous singer.',
          wrong: ['When I was ten, I thought that I will be a famous singer.', 'When I was ten, I thought that I would being a famous singer.'],
          explainHe: 'עתיד מנקודת מבט של העבר: would + פועל בסיס (be).',
          hintHe: 'המשפט בעבר. מה בא במקום will?',
        },
        story: {
          passageEn:
            'Dear future me, by the time you read this, you will have finished school. I hope that your life is enjoyable and that you still play the guitar once in a while. Grandpa says that his immigration from Ethiopia taught him to never give up. I hope you remember that. Best regards, me at sixteen.',
          passageHe:
            'מכתב לעצמי בעתיד: כשהמכתב הזה ייקרא, כבר אסיים את בית הספר. אני מקווה שהחיים שלי יהיו מהנים ושאמשיך לנגן בגיטרה מדי פעם. סבא אומר שהעלייה שלו מאתיופיה לימדה אותו לעולם לא לוותר. אני מקווה לזכור את זה. בברכה, אני בגיל שש עשרה.',
          questionEn: 'What did Grandpa learn from his immigration?',
          questionHe: 'מה סבא למד מהעלייה שלו?',
          correct: 'To never give up.',
          wrong: ['To play the guitar.', 'To write letters.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'By next year, I will have read this whole book.',
              wrong: ['By next year, I will have reading this whole book.'],
              explainHe: 'will have + V3. צורת ה-V3 של read נכתבת read (ונהגית red).',
              hintHe: 'איזו צורה של הפועל באה אחרי will have?',
            },
            story: {
              passageEn: 'Maya is in a good mood today. She thinks that the trip will be enjoyable.',
              passageHe: 'מאיה במצב רוח טוב היום. היא חושבת שהטיול יהיה מהנה.',
              questionEn: 'How does Maya feel today?',
              questionHe: 'איך מאיה מרגישה היום?',
              correct: 'In a good mood.',
              wrong: ['Tired and sad.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['regards', 'mood'],
              ['regards', 'or so'],
              ['enjoyable', 'or so'],
              ['regards', 'occasional'],
              ['mood', 'incredible'],
              ['incredible', 'enjoyable'],
              ['incredible', 'regards'],
              ['immigration', 'incredible'],
            ],
          },
          master: {
            sentenceEn: 'By the age of thirty, you will have found a job you love.',
            sentenceHe: 'עד גיל שלושים, כבר תמצאו עבודה שאתם אוהבים.',
            decoys: ['finds', 'would'],
            voiceEn: 'Once in a while, read this letter and smile.',
            voiceHe: 'מדי פעם, קראו את המכתב הזה וחייכו.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'By the time I am thirty, I will have visited Japan.',
              wrong: [
                'By the time I will be thirty, I will have visited Japan.',
                'By the time I am thirty, I will have visit Japan.',
                'By the time I am thirty, I will visited Japan.',
              ],
              explainHe: 'אחרי By the time בא הווה (I am), ובחלק השני will have + V3 (visited).',
              hintEn: 'Check am and will have visited.',
            },
            story: {
              passageEn:
                'When Noam was in high school, his class wrote letters to their future selves, and the teacher kept them for ten years or so. When the class met again, Noam opened his letter. He had written that he would be a famous soccer player. Today he is a physical therapist for a soccer team. "I was almost right," he laughed.',
              passageHe: '',
              questionEn: 'Why did Noam say that he was almost right?',
              questionHe: '',
              correct: 'He works with a soccer team, but not as a player.',
              wrong: ['He became a famous soccer player.', 'He lost his letter.', 'He never liked soccer.'],
            },
            storyHintEn: 'What is Noam\'s job now?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 11 unit (`../../registry.ts`) */
export const CORE_4_GRADE_11_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-11', [UNIT_CORE_4]);
