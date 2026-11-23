import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 8 unit (Band II): an introduction to reported speech as the Ministry's Band II
 * descriptor has it, said (that) … with the pronoun changed (no tense shift required), told + person (to do sth) and asked whether…, about news and interviews, with
 * Band II Core I words the app never taught or taught only later. Example Hebrew addresses the
 * learner in the plural; hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_4: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'News & Interviews',
  titleHe: 'חדשות וראיונות',
  subtitleHe: 'עונה 4: מוסרים מה אחרים אמרו עם said, told ו-asked',
  badgeEmoji: '📰',
  missions: [
    {
      icon: '🎤',
      titleEn: 'He Said That…',
      titleHe: 'הוא אמר ש…',
      storyHookHe:
        'הכתבים חוזרים מהשטח! כשמספרים מה מישהו אמר, אומרים said (that) … ומחליפים את הגוף: "My team is ready" → He said that his team is ready.',
      grammarTopic: 'Reported speech: said (that) + pronoun change',
      skills: ['said that', 'Reported Speech', 'News'],
      sentenceEn: 'The reporter said that the game was very exciting.',
      sentenceHe: 'הכתב אמר שהמשחק היה מרגש מאוד.',
      vocab: [
        ['admit', 'verb', 'להודות (בטעות)', '🙋', 'He didn\'t want to admit that he was wrong, but he said sorry.', 'הוא לא רצה להודות שהוא טעה, אבל הוא אמר סליחה.'],
        ['apology', 'noun', 'התנצלות', '🙏', 'The company said that it was sending an apology to every customer.', 'החברה אמרה שהיא שולחת התנצלות לכל לקוח.'],
        ['explanation', 'noun', 'הסבר', '💬', 'The reporter said that there was no explanation for the noise.', 'הכתב אמר שאין הסבר לרעש.'],
        ['situation', 'noun', 'מצב', '🌍', 'The minister said that the situation is getting better.', 'השר אמר שהמצב משתפר.'],
        ['recent', 'adjective', 'שנערך לאחרונה / אחרון', '📰', 'In a recent interview, the singer said that she loves Israel.', 'בראיון שנערך לאחרונה, הזמרת אמרה שהיא אוהבת את ישראל.'],
        ['as you know', 'phrase', 'כפי שאתם יודעים', '🧠', 'The coach said, "The final, as you know, is on Sunday."', 'המאמן אמר: "הגמר, כפי שאתם יודעים, ביום ראשון."'],
        ['hardly ever', 'phrase', 'כמעט אף פעם', '🐢', 'My grandfather said that he hardly ever watched TV as a child.', 'סבא שלי אמר שכמעט אף פעם לא צפה בטלוויזיה כשהיה ילד.'],
        ['the day after tomorrow', 'phrase', 'מחרתיים', '📆', 'The news said that it would rain the day after tomorrow.', 'בחדשות אמרו שירד גשם מחרתיים.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'goat', translationHe: 'עז' },
          { wordEn: 'ladder', translationHe: 'סולם' },
        ],
        shortSentenceEn: 'She said she was tired.',
        shortSentenceHe: 'היא אמרה שהיא עייפה.',
        rule: {
          questionEn: 'Dan said, "I am thirsty." How do we report it?',
          correct: 'Dan said that he was thirsty.',
          wrong: ['Dan said that I was thirsty.', 'Dan said me that he was thirsty.'],
          explainHe: 'בדיבור עקיף I הופך ל-he. אחרי said לא בא me.',
          hintHe: 'בדקו את הגוף ואת המילה שאחרי said.',
        },
        story: {
          passageEn:
            'Yesterday a TV reporter visited our school. She talked to the principal, and the principal said that the new library was almost ready. Then the reporter asked some students about it. Lia said that in the past she hardly ever read books, but now she wanted to read more.',
          passageHe:
            'אתמול כתבת טלוויזיה ביקרה בבית הספר שלנו. היא דיברה עם המנהלת, והמנהלת אמרה שהספרייה החדשה כמעט מוכנה. אחר כך הכתבת שאלה כמה תלמידים על זה. ליה אמרה שקודם היא כמעט אף פעם לא קראה ספרים, אבל עכשיו היא רוצה לקרוא יותר.',
          questionEn: 'What did the principal say?',
          questionHe: 'מה אמרה המנהלת?',
          correct: 'The new library was almost ready.',
          wrong: ['The school was closing.', 'Lia read a lot of books.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Noa said, "I like pizza." Which is right?',
              correct: 'Noa said that she likes pizza.',
              wrong: ['Noa said that I like pizza.'],
              explainHe: 'ה-I של נועה הופך ל-she.',
              hintHe: 'מי זו "אני" במשפט של נועה?',
            },
            story: {
              passageEn: 'The weatherman said that it would be hot the day after tomorrow.',
              passageHe: 'החזאי אמר שיהיה חם מחרתיים.',
              questionEn: 'When will it be hot?',
              questionHe: 'מתי יהיה חם?',
              correct: 'The day after tomorrow.',
              wrong: ['Tonight.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['situation', 'recent'],
              ['admit', 'recent'],
              ['admit', 'hardly ever'],
              ['admit', 'recent'],
              ['admit', 'apology'],
              ['hardly ever', 'the day after tomorrow'],
              ['situation', 'apology'],
              ['apology', 'recent'],
            ],
          },
          master: {
            sentenceEn: 'The scientist said that the situation in the ocean is serious.',
            sentenceHe: 'המדענית אמרה שהמצב באוקיינוס חמור.',
            decoys: ['tell', 'told'],
            voiceEn: 'My teacher said that the test was the day after tomorrow.',
            voiceHe: 'המורה שלי אמרה שהמבחן מחרתיים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The players said that they were ready.',
              wrong: [
                'The players said that we were ready.',
                'The players said that they was ready.',
                'The players said them that they were ready.',
              ],
              explainHe: 'השחקנים מדברים על עצמם, אז they; עם they אומרים were; ואחרי said לא בא them.',
              hintEn: 'Check they, were and said.',
            },
            story: {
              passageEn:
                'Last week a famous chef was on a radio show. He said that he hardly ever cooked at home. The host asked why. The chef laughed and said that his wife was a better cook than he was. He admitted that he only made toast on weekends!',
              passageHe: '',
              questionEn: 'Why doesn\'t the chef cook much at home?',
              questionHe: '',
              correct: 'He said that his wife was a better cook.',
              wrong: ['He said he had no kitchen.', 'He said he hated cooking.', 'He said he worked every weekend.'],
            },
            storyHintEn: 'What did the chef say about his wife?',
          },
        },
      },
    },
    {
      icon: '📢',
      titleEn: 'She Told Me to…',
      titleHe: 'היא אמרה לי ל…',
      storyHookHe:
        'מה ביקשו מאיתנו? told בא תמיד עם אדם: She told me that…, He told us to wait. ושאלת כן/לא מוסרים עם asked whether…',
      grammarTopic: 'Reported speech: told + person (to) / asked whether',
      skills: ['told sb to', 'asked whether', 'Instructions'],
      sentenceEn: 'The doctor told me to drink more water.',
      sentenceHe: 'הרופא אמר לי לשתות יותר מים.',
      vocab: [
        ['supposed to', 'phrase', 'אמור ל...', '📋', 'The coach told us that we were supposed to be there at eight.', 'המאמן אמר לנו שאנחנו אמורים להיות שם בשמונה.'],
        ['watch out', 'phrase', 'להיזהר', '⚠️', 'Mom told me to watch out for cars.', 'אמא אמרה לי להיזהר ממכוניות.'],
        ['that\'s all right', 'phrase', 'זה בסדר', '👌', 'When I said sorry, she smiled and said, "That\'s all right."', 'כשאמרתי סליחה, היא חייכה ואמרה: "זה בסדר."'],
        ['in case of', 'phrase', 'במקרה של', '🛑', 'The guard told us to use the stairs in case of fire.', 'השומר אמר לנו להשתמש במדרגות במקרה של שריפה.'],
        ['take an exam', 'phrase', 'להיבחן / לגשת למבחן', '📝', 'The teacher told us that we would take an exam in June.', 'המורה אמרה לנו שניבחן ביוני.'],
        ['trust', 'verb', 'לסמוך על', '🤝', 'Grandma told me to trust my feelings.', 'סבתא אמרה לי לסמוך על התחושות שלי.'],
        ['whether', 'conjunction', 'האם / אם', '❓', 'The reporter asked the police whether the road was open.', 'הכתב שאל את המשטרה אם הכביש פתוח.'],
        ['pleased', 'adjective', 'מרוצה', '😊', 'The mayor told reporters that she was pleased with the new park.', 'ראש העיר אמרה לעיתונאים שהיא מרוצה מהפארק החדש.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'tractor', translationHe: 'טרקטור' },
          { wordEn: 'feather', translationHe: 'נוצה' },
        ],
        shortSentenceEn: 'She told me to wait.',
        shortSentenceHe: 'היא אמרה לי לחכות.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'The teacher told us to be quiet.',
          wrong: ['The teacher told to us be quiet.', 'The teacher said us to be quiet.'],
          explainHe: 'אחרי told בא האדם בלי to (told us), ואחר כך to ופועל. עם said לא בא us.',
          hintHe: 'מה בא מיד אחרי told, ומה אחרי said?',
        },
        story: {
          passageEn:
            'Before the school trip, our teacher told us to bring two bottles of water. She also told us to watch out for snakes on the path. In case of an emergency, we were supposed to call her immediately. At the end of the day, she said that she was very pleased with us.',
          passageHe:
            'לפני הטיול השנתי, המורה שלנו אמרה לנו להביא שני בקבוקי מים. היא גם אמרה לנו להיזהר מנחשים בשביל. במקרה חירום היינו אמורים להתקשר אליה מיד. בסוף היום היא אמרה שהיא מרוצה מאוד מאיתנו.',
          questionEn: 'What did the teacher tell them to bring?',
          questionHe: 'מה המורה אמרה להם להביא?',
          correct: 'Two bottles of water.',
          wrong: ['A map of the path.', 'Their phones.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Mom said to Ben, "Close the door." Which is right?',
              correct: 'Mom told Ben to close the door.',
              wrong: ['Mom told Ben close the door.'],
              explainHe: 'told, אחריו האדם, ואז to ופועל.',
              hintHe: 'מה חסר לפני close?',
            },
            story: {
              passageEn: 'Dad told me to watch out on my bike. So I wore my helmet.',
              passageHe: 'אבא אמר לי להיזהר על האופניים. אז חבשתי קסדה.',
              questionEn: 'What did I wear?',
              questionHe: 'מה חבשתי?',
              correct: 'My helmet.',
              wrong: ['My hat.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pleased', 'trust'],
              ['whether', 'pleased'],
              ['whether', 'take an exam'],
              ['whether', 'trust'],
              ['whether', 'pleased'],
              ['whether', 'pleased'],
              ['trust', 'pleased'],
              ['whether', 'trust'],
            ],
          },
          master: {
            sentenceEn: 'The pilot told the passengers to stay in their seats.',
            sentenceHe: 'הטייס אמר לנוסעים להישאר במושבים שלהם.',
            decoys: ['said', 'stays'],
            voiceEn: 'The coach told us that we were supposed to rest.',
            voiceHe: 'המאמן אמר לנו שאנחנו אמורים לנוח.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'She told me that she was busy.',
              wrong: ['She told that she was busy.', 'She told to me that she was busy.', 'She said me that she was busy.'],
              explainHe: 'אחרי told חייב לבוא אדם (told me), בלי to. עם said לא בא me.',
              hintEn: 'Check told, me and said.',
            },
            story: {
              passageEn:
                'Before his first big job interview, Roy was nervous. His older sister told him to trust himself and to speak slowly. She also told him that it was okay to ask whether he could think for a moment. After the interview, the manager called Roy and told him that he had gotten the job.',
              passageHe: '',
              questionEn: 'How did Roy\'s sister help him?',
              questionHe: '',
              correct: 'She gave him advice before the interview.',
              wrong: ['She went to the interview with him.', 'She called the manager.', 'She wrote his answers.'],
            },
            storyHintEn: 'What did his sister tell him to do?',
          },
        },
      },
    },
    {
      icon: '📣',
      isBoss: true,
      titleEn: 'Boss: The School News',
      titleHe: 'אתגר הבוס: עיתון בית הספר',
      storyHookHe: 'אתם הכתבים של עיתון בית הספר! מסרו מה אמרו המרואיינים עם said, told ו-asked.',
      grammarTopic: 'Reported speech: Review',
      skills: ['said / told', 'asked whether', 'Review'],
      sentenceEn: 'Our editor told us to write a story about the school play.',
      sentenceHe: 'העורכת שלנו אמרה לנו לכתוב כתבה על ההצגה של בית הספר.',
      vocab: [
        ['performance', 'noun', 'הופעה', '🎭', 'The principal said that the class performance was wonderful.', 'המנהלת אמרה שההופעה של הכיתה הייתה נפלאה.'],
        ['organization', 'noun', 'ארגון', '🏛️', 'The reporter said that the organization helped families in need.', 'הכתב אמר שהארגון עזר למשפחות נזקקות.'],
        ['opportunity', 'noun', 'הזדמנות', '🚪', 'The coach told us that this was a great opportunity.', 'המאמן אמר לנו שזו הזדמנות מצוינת.'],
        ['role', 'noun', 'תפקיד', '🎬', 'Maya told me that she got the main role in the play.', 'מאיה סיפרה לי שהיא קיבלה את התפקיד הראשי בהצגה.'],
        ['duty', 'noun', 'חובה / תורנות', '📋', 'The teacher told us that it was our duty to help new students.', 'המורה אמרה לנו שזו החובה שלנו לעזור לתלמידים חדשים.'],
        ['level', 'noun', 'רמה', '📈', 'The examiner said that my English level was high.', 'הבוחן אמר שרמת האנגלית שלי גבוהה.'],
        ['total', 'adjective', 'כולל / סך הכול', '🧮', 'The article said that the total cost was two million shekels.', 'בכתבה נאמר שהעלות הכוללת הייתה שני מיליון שקלים.'],
        ['mostly', 'adverb', 'בעיקר', '📊', 'The students said that they mostly used phones for music.', 'התלמידים אמרו שהם משתמשים בטלפונים בעיקר למוזיקה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'toothbrush', translationHe: 'מברשת שיניים' },
          { wordEn: 'cucumber', translationHe: 'מלפפון' },
        ],
        shortSentenceEn: 'He said it was fun.',
        shortSentenceHe: 'הוא אמר שזה היה כיף.',
        rule: {
          questionEn: 'Maya said, "My team is winning." Which is right?',
          correct: 'Maya said that her team is winning.',
          wrong: ['Maya said that my team is winning.', 'Maya told that her team is winning.'],
          explainHe: 'ה-my של מאיה הופך ל-her. אחרי told חייב לבוא אדם.',
          hintHe: 'בדקו את her ואת said או told.',
        },
        story: {
          passageEn:
            'This month, the school newspaper interviewed the drama teacher. She said that the end-of-year performance had forty students in total. She told the reporters that every student had a role, mostly in groups. She also said that it was a great opportunity for shy students.',
          passageHe:
            'החודש העיתון של בית הספר ראיין את המורה לתיאטרון. היא אמרה שבהופעת סוף השנה משתתפים בסך הכול ארבעים תלמידים. היא אמרה לכתבים שלכל תלמיד יש תפקיד, בעיקר בקבוצות. היא גם אמרה שזו הזדמנות מצוינת לתלמידים ביישנים.',
          questionEn: 'How many students were in the performance?',
          questionHe: 'כמה תלמידים השתתפו בהופעה?',
          correct: 'Forty.',
          wrong: ['Fourteen.', 'Four.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'She told me that she was happy.',
              wrong: ['She said me that she was happy.'],
              explainHe: 'אחרי told בא אדם (me). אחרי said לא.',
              hintHe: 'איזה פועל יכול לבוא עם me?',
            },
            story: {
              passageEn: 'The reporter told us that the organization planted a total of 500 trees.',
              passageHe: 'הכתבת אמרה לנו שהארגון שתל בסך הכול 500 עצים.',
              questionEn: 'How many trees did they plant?',
              questionHe: 'כמה עצים הם שתלו?',
              correct: '500.',
              wrong: ['50.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['mostly', 'pleased'],
              ['mostly', 'pleased'],
              ['mostly', 'pleased'],
              ['mostly', 'pleased'],
              ['mostly', 'total'],
              ['mostly', 'opportunity'],
              ['mostly', 'role'],
              ['total', 'role'],
            ],
          },
          master: {
            sentenceEn: 'The director told the actors that the performance was a success.',
            sentenceHe: 'הבמאי אמר לשחקנים שההופעה הייתה הצלחה.',
            decoys: ['said', 'says'],
            voiceEn: 'She said that it was a great opportunity.',
            voiceHe: 'היא אמרה שזו הייתה הזדמנות מצוינת.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The reporter asked whether the event was free.',
              wrong: [
                'The reporter asked whether was the event free.',
                'The reporter asked that the event was free.',
                'The reporter told whether the event was free.',
              ],
              explainHe: 'בשאלה עקיפה: asked whether, ואחריו נושא ופועל בסדר רגיל (the event was).',
              hintEn: 'Check asked, whether and the word order.',
            },
            story: {
              passageEn:
                'Last year, the student council started an organization that collects old books. In a recent interview, its leader said that they mostly gave the books to hospitals. She told the newspaper that the total was 3,000 books. She also said that the best part was the thank-you letters that they got from children.',
              passageHe: '',
              questionEn: 'What did the leader say was the best part?',
              questionHe: '',
              correct: 'The thank-you letters from children.',
              wrong: ['Collecting 3,000 books.', 'The interview with the newspaper.', 'Visiting the hospitals.'],
            },
            storyHintEn: 'Read the last sentence.',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 8 unit (`../../registry.ts`) */
export const CORE_4_GRADE_8_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-8', [UNIT_CORE_4]);
