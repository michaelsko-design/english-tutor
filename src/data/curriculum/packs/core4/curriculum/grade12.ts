import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 12 unit (Band III): ethics, recycling Band III grammar for discussion and
 * debate: second and third conditionals (If you found…, would you…?) and the passive with modals
 * (should be banned, must be kept, will be announced), with Band III Core I (4-point) words the
 * app never had. Example Hebrew addresses the learner in the plural; hints and explanations are
 * gender-neutral plural.
 */
const UNIT_CORE_4: HighSchoolUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Ethics',
  titleHe: 'אתיקה: מה נכון לעשות?',
  subtitleHe: 'עונה 4: דנים בשאלות של מוסר עם תנאי דמיוני, וסביל עם should be ו-must be',
  badgeEmoji: '⚖️',
  missions: [
    {
      icon: '🤔',
      titleEn: 'Is It Fair?',
      titleHe: 'זה הוגן?',
      storyHookHe:
        'מה הייתם עושים במצב קשה? בשאלות של מוסר משתמשים בתנאי דמיוני: If you found a wallet, would you return it?',
      grammarTopic: 'Second conditional for moral dilemmas: If + past, would + verb',
      skills: ['Second Conditional', 'Moral Dilemmas', 'Giving Opinions'],
      sentenceEn: 'If you found a lost phone, would you return it to its owner?',
      sentenceHe: 'אם הייתם מוצאים טלפון אבוד, הייתם מחזירים אותו לבעלים שלו?',
      vocab: [
        ['dishonest', 'adjective', 'לא ישר / לא הגון', '🤥', 'It would be dishonest to copy a friend\'s essay.', 'זה יהיה לא הגון להעתיק חיבור של חבר.'],
        ['selfish', 'adjective', 'אנוכי', '🙅', 'If you took the last piece without asking, people would think you were selfish.', 'אם הייתם לוקחים את החתיכה האחרונה בלי לשאול, אנשים היו חושבים שאתם אנוכיים.'],
        ['rude', 'adjective', 'גס רוח / לא מנומס', '😠', 'It is rude to check your phone while someone is talking to you.', 'לא מנומס לבדוק את הטלפון כשמישהו מדבר איתכם.'],
        ['insult', 'verb', 'להעליב', '💢', 'If you insult someone online, you should apologize in public.', 'אם אתם מעליבים מישהו ברשת, אתם צריכים להתנצל בפומבי.'],
        ['annoy', 'verb', 'להרגיז / להציק', '😤', 'Loud music late at night can annoy the neighbors.', 'מוזיקה רועשת בשעות הלילה המאוחרות יכולה להרגיז את השכנים.'],
        ['Who cares?', 'phrase', 'למי אכפת?', '🤷', 'Some people say, "Who cares? It\'s only a small lie."', 'יש אנשים שאומרים: למי אכפת? זה רק שקר קטן.'],
        ['not at all', 'phrase', 'בכלל לא', '🙅', 'Cheating is not at all the same as getting help.', 'העתקה היא בכלל לא אותו דבר כמו לקבל עזרה.'],
        ['some kind of', 'phrase', 'סוג של', '❓', 'If you returned a lost wallet, would you expect some kind of reward?', 'אם הייתם מחזירים ארנק אבוד, הייתם מצפים לסוג של פרס?'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'parachute', translationHe: 'מצנח' },
          { wordEn: 'oyster', translationHe: 'צדפה' },
        ],
        shortSentenceEn: 'It would be wrong to lie.',
        shortSentenceHe: 'זה יהיה לא נכון לשקר.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'If I saw someone cheating, I would tell the teacher.',
          wrong: ['If I saw someone cheating, I will tell the teacher.', 'If I would see someone cheating, I would tell the teacher.'],
          explainHe: 'תנאי דמיוני: If + עבר (saw), ובחלק השני would + פועל.',
          hintHe: 'בדקו את הפועל אחרי If ואת would.',
        },
        story: {
          passageEn:
            'A group of students found a mistake in their test: the teacher had given them extra points. Some said, "Who cares? It\'s not our fault." But Yael thought that keeping the points would be dishonest. She told the teacher, and she was so impressed that she thanked the whole class.',
          passageHe:
            'קבוצת תלמידים מצאה טעות במבחן שלהם: המורה נתנה להם נקודות נוספות. כמה מהם אמרו: "למי אכפת? זו לא אשמתנו." אבל יעל חשבה שלהשאיר את הנקודות יהיה לא הגון. היא סיפרה למורה, והיא כל כך התרשמה שהיא הודתה לכל הכיתה.',
          questionEn: 'What did Yael think?',
          questionHe: 'מה יעל חשבה?',
          correct: 'Keeping the points would be dishonest.',
          wrong: ['The teacher was rude.', 'The test was too easy.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'A boy pushes in front of everyone in line. What is he?',
              correct: 'He is rude.',
              wrong: ['He is kind.'],
              explainHe: 'rude פירושו "גס רוח".',
              hintHe: 'איך קוראים להתנהגות כזאת?',
            },
            story: {
              passageEn: 'Dan took the last cookie and didn\'t share it. His sister said, "That\'s so selfish!"',
              passageHe: 'דן לקח את העוגייה האחרונה ולא חלק אותה. אחותו אמרה: "זה כל כך אנוכי!"',
              questionEn: 'What did Dan take?',
              questionHe: 'מה דן לקח?',
              correct: 'The last cookie.',
              wrong: ['The last apple.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['insult', 'annoy'],
              ['insult', 'some kind of'],
              ['annoy', 'insult'],
              ['rude', 'selfish'],
              ['rude', 'dishonest'],
              ['Not at all', 'Some kind of'],
              ['some kind of', 'selfish'],
              ['not at all', 'rude'],
            ],
          },
          master: {
            sentenceEn: 'Would you tell a friend the truth if it hurt their feelings?',
            sentenceHe: 'הייתם אומרים לחבר את האמת אם היא הייתה פוגעת ברגשות שלו?',
            decoys: ['hurts', 'telling'],
            voiceEn: 'It is rude to interrupt people, and it can annoy them.',
            voiceHe: 'לא מנומס להפריע לאנשים, וזה יכול להרגיז אותם.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If I were you, I would apologize to her.',
              wrong: ['If I were you, I will apologize to her.', 'If I were you, I apologize to her.', 'If I were you, I would apologized to her.'],
              explainHe: 'עצה בתנאי דמיוני: If I were you, I would + פועל בסיס (apologize).',
              hintEn: 'Check would and the verb.',
            },
            story: {
              passageEn:
                'Tamar was sixteen when she found a bag full of money on a park bench. Some of her friends said that she should keep it, because nobody would know. Tamar took the bag to the police instead. A week later, the owner, an old man, got in touch with her to say thank you. He said that she had saved his rent money.',
              passageHe: '',
              questionEn: 'Why was the money so important to the old man?',
              questionHe: '',
              correct: 'It was his rent money.',
              wrong: ['It was a gift for his grandson.', 'It belonged to the police.', 'He wanted to give it away.'],
            },
            storyHintEn: 'Read the last sentence.',
          },
        },
      },
    },
    {
      icon: '🛑',
      titleEn: 'Should It Be Allowed?',
      titleHe: 'האם צריך לאסור את זה?',
      storyHookHe:
        'מה צריך לאסור, ומה צריך להגן עליו? בדיון על חוקים משתמשים בסביל עם מילות עזר: should be banned, must be protected, can be given.',
      grammarTopic: 'Passive with modals: should / must / can be + past participle',
      skills: ['Modal Passive', 'Rules and Laws', 'Debate'],
      sentenceEn: 'Plastic bags should be banned in supermarkets.',
      sentenceHe: 'צריך לאסור שקיות ניילון בסופרמרקטים.',
      vocab: [
        ['weapon', 'noun', 'נשק', '⚔️', 'A weapon should never be left where children can find it.', 'אסור בשום מקרה להשאיר נשק במקום שבו ילדים יכולים למצוא אותו.'],
        ['clothing', 'noun', 'ביגוד', '👕', 'Old clothing can be given to people in need.', 'אפשר לתת ביגוד ישן לאנשים נזקקים.'],
        ['membership', 'noun', 'חברות (במועדון) / מנוי', '🎟️', 'Should gym membership be free for teenagers?', 'האם מנוי לחדר כושר צריך להיות בחינם לבני נוער?'],
        ['penalty', 'noun', 'עונש / קנס', '⚖️', 'A heavy penalty should be given to people who throw trash in parks.', 'צריך לתת עונש כבד לאנשים שזורקים זבל בפארקים.'],
        ['give away', 'phrasal verb', 'לתת בחינם / למסור', '🎁', 'Shops should give away food that they cannot sell.', 'חנויות צריכות לתת בחינם אוכל שהן לא יכולות למכור.'],
        ['that kind of thing', 'phrase', 'דברים כאלה', '📦', 'Phones, games and that kind of thing should not be used in class.', 'טלפונים, משחקים ודברים כאלה –אסור להשתמש בהם בכיתה.'],
        ['bring up', 'phrasal verb', 'לגדל (ילדים)', '👪', 'It is not easy to bring up children in a big city.', 'לא קל לגדל ילדים בעיר גדולה.'],
        ['altogether', 'adverb', 'לגמרי', '🛑', 'Some people think that plastic bags should be banned altogether.', 'יש אנשים שחושבים שצריך לאסור לגמרי שקיות ניילון.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'harbor', translationHe: 'נמל' },
          { wordEn: 'saddle', translationHe: 'אוכף' },
        ],
        shortSentenceEn: 'Phones must be turned off.',
        shortSentenceHe: 'חובה לכבות את הטלפונים.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'Wild animals should be protected by law.',
          wrong: ['Wild animals should protected by law.', 'Wild animals should be protect by law.'],
          explainHe: 'סביל עם מילת עזר: should be + V3 (protected).',
          hintHe: 'בדקו את be ואת צורת הפועל.',
        },
        story: {
          passageEn:
            'The student council debated a new rule: should phones be banned altogether during school hours? Some students said that phones were used for learning. Others said that games, social media and that kind of thing caused problems. In the end, they agreed that phones must be kept in bags during lessons, but they can be used at breaks.',
          passageHe:
            'מועצת התלמידים התווכחה על חוק חדש: האם צריך לאסור לגמרי טלפונים בשעות הלימודים? כמה תלמידים אמרו שמשתמשים בטלפונים ללמידה. אחרים אמרו שמשחקים, רשתות חברתיות ודברים כאלה גורמים לבעיות. בסוף הם הסכימו שבזמן השיעורים חובה לשמור את הטלפונים בתיקים, אבל מותר להשתמש בהם בהפסקות.',
          questionEn: 'What did the council decide?',
          questionHe: 'מה החליטה המועצה?',
          correct: 'Phones stay in bags during lessons.',
          wrong: ['Phones are banned all day.', 'Phones can be used in lessons.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'The park must be kept clean.',
              wrong: ['The park must kept clean.'],
              explainHe: 'must be + V3: must be kept.',
              hintHe: 'מה חסר בין must ל-kept?',
            },
            story: {
              passageEn: 'Our school collects old clothing. It is given to families who need it.',
              passageHe: 'בית הספר שלנו אוסף ביגוד ישן. הוא ניתן למשפחות שצריכות אותו.',
              questionEn: 'Who gets the clothing?',
              questionHe: 'מי מקבל את הביגוד?',
              correct: 'Families who need it.',
              wrong: ['The teachers.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['altogether', 'give away'],
              ['altogether', 'bring up'],
              ['altogether', 'give away'],
              ['altogether', 'bring up'],
              ['membership', 'altogether'],
              ['altogether', 'penalty'],
              ['altogether', 'membership'],
              ['clothing', 'bring up'],
            ],
          },
          master: {
            sentenceEn: 'Old clothes should be given away, not thrown in the trash.',
            sentenceHe: 'צריך למסור בגדים ישנים, ולא לזרוק אותם לפח.',
            decoys: ['gave', 'throw'],
            voiceEn: 'Should teenagers be allowed to vote?',
            voiceHe: 'האם צריך לאפשר לבני נוער להצביע?',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Smoking should not be allowed near schools.',
              wrong: [
                'Smoking should not allowed near schools.',
                'Smoking should not be allow near schools.',
                'Smoking should be not allowed near schools.',
              ],
              explainHe: 'סביל בשלילה: should not be + V3 (allowed). המילה not באה מיד אחרי should.',
              hintEn: 'Check not, be and allowed.',
            },
            story: {
              passageEn:
                'In some countries, food that big supermarkets cannot sell must be given away to charities, and a penalty must be paid if it is thrown out. Supporters say that this law helps families in need. Others think that it is hard for charities to collect and store so much food. Either way, less food is wasted.',
              passageHe: '',
              questionEn: 'Why do some people think the law is hard to follow?',
              questionHe: '',
              correct: 'Charities may not be able to collect and store all the food.',
              wrong: ['Families in need do not want the food.', 'The penalty is too small.', 'Small shops sell more food.'],
            },
            storyHintEn: 'Who has to collect the food?',
          },
        },
      },
    },
    {
      icon: '🎤',
      isBoss: true,
      titleEn: 'Boss: The Ethics Debate',
      titleHe: 'אתגר הבוס: הוויכוח על אתיקה',
      storyHookHe: 'הוויכוח מתחיל! הציגו עמדה עם תנאי דמיוני וסביל, והקשיבו לצד השני.',
      grammarTopic: 'Conditionals & modal passive: Review',
      skills: ['Conditionals', 'Passive', 'Review'],
      sentenceEn: 'If our team lost the debate, we would still be proud.',
      sentenceHe: 'אם הקבוצה שלנו הייתה מפסידה בוויכוח, עדיין היינו גאים.',
      vocab: [
        ['defeat', 'noun', 'הפסד / תבוסה', '🏳️', 'After the defeat, the coach said that the team should be proud anyway.', 'אחרי ההפסד, המאמן אמר שהקבוצה צריכה להיות גאה בכל מקרה.'],
        ['fool', 'noun', 'טיפש', '🤡', 'Only a fool would believe everything they read online.', 'רק טיפש היה מאמין לכל מה שכתוב ברשת.'],
        ['do a good job', 'phrase', 'לעשות עבודה טובה', '👍', 'If we work together, we will do a good job.', 'אם נעבוד יחד, נעשה עבודה טובה.'],
        ['dreadful', 'adjective', 'נורא / איום', '😱', 'The food in the hotel was dreadful, but the people who worked there were kind.', 'האוכל במלון היה נורא, אבל האנשים שעבדו שם היו נחמדים.'],
        ['just about', 'adverb', 'כמעט', '⛳', 'The judges said that our argument was just about perfect.', 'השופטים אמרו שהטיעון שלנו היה כמעט מושלם.'],
        ['that\'s it', 'phrase', 'זהו / וזה הכול', '✅', 'You have two minutes to speak, and that\'s it.', 'יש לכם שתי דקות לדבר, וזהו.'],
        ['Don\'t ask me!', 'phrase', 'אל תשאלו אותי!', '🤷', 'Why was the debate canceled? Don\'t ask me!', 'למה הוויכוח בוטל? אל תשאלו אותי!'],
        ['gentleman', 'noun', 'ג׳נטלמן', '🎩', 'He was a real gentleman: he let the other team speak first.', 'הוא היה ג׳נטלמן אמיתי: הוא נתן לקבוצה השנייה לדבר ראשונה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'ostrich', translationHe: 'יען' },
          { wordEn: 'scarecrow', translationHe: 'דחליל' },
        ],
        shortSentenceEn: 'You did a good job.',
        shortSentenceHe: 'עשיתם עבודה טובה.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'The winners will be announced after the debate.',
          wrong: ['The winners will announced after the debate.', 'The winners will be announce after the debate.'],
          explainHe: 'סביל בעתיד: will be + V3 (announced).',
          hintHe: 'בדקו את be ואת צורת הפועל.',
        },
        story: {
          passageEn:
            'Our school held an ethics debate: Should zoos be closed? Our team said that animals should be protected in the wild, not kept in cages. The other team argued that without zoos, some animals would die out. We lost, yet the judges said that both teams had done a good job. The other team\'s captain was a real gentleman and shook our hands.',
          passageHe:
            'בבית הספר שלנו נערך ויכוח בנושא אתיקה: האם צריך לסגור גני חיות? הקבוצה שלנו אמרה שצריך להגן על בעלי חיים בטבע, ולא להחזיק אותם בכלובים. הקבוצה השנייה טענה שבלי גני חיות כמה מינים ייכחדו. הפסדנו, ובכל זאת השופטים אמרו ששתי הקבוצות עשו עבודה טובה. הקפטן של הקבוצה השנייה היה ג׳נטלמן אמיתי ולחץ לנו את הידיים.',
          questionEn: 'What was the debate about?',
          questionHe: 'על מה היה הוויכוח?',
          correct: 'Whether zoos should be closed.',
          wrong: ['Whether phones should be banned.', 'Whether tests should be easier.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Your friend asks a hard question, and you have no idea. What do you say?',
              correct: 'Don\'t ask me!',
              wrong: ['Good luck!'],
              explainHe: 'Don\'t ask me! פירושו "אל תשאלו אותי!": אין לי מושג.',
              hintHe: 'מה אומרים כשאין לנו מושג?',
            },
            story: {
              passageEn: 'The weather was dreadful, so the trip was canceled. We stayed at school.',
              passageHe: 'מזג האוויר היה נורא, אז הטיול בוטל. נשארנו בבית הספר.',
              questionEn: 'Why was the trip canceled?',
              questionHe: 'למה הטיול בוטל?',
              correct: 'The weather was dreadful.',
              wrong: ['The bus broke down.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['dreadful', 'just about'],
              ['dreadful', 'just about'],
              ['just about', 'dreadful'],
              ['gentleman', 'defeat'],
              ['gentleman', 'fool'],
              ['gentleman', 'defeat'],
              ['Just about', 'Gentleman'],
              ['dreadful', 'just about'],
            ],
          },
          master: {
            sentenceEn: 'Every speaker must be given the same amount of time.',
            sentenceHe: 'חובה לתת לכל דובר ודוברת אותו זמן בדיוק.',
            decoys: ['gave', 'are'],
            voiceEn: 'If I were the judge, I would listen to both teams.',
            voiceHe: 'אם הייתי השופט/ת, הייתי מקשיב/ה לשתי הקבוצות.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If the team had prepared more, it would have won.',
              wrong: [
                'If the team would have prepared more, it would have won.',
                'If the team had prepared more, it will have won.',
                'If the team had prepare more, it would have won.',
              ],
              explainHe: 'תנאי על העבר (מסוג שלישי): If + had + V3, ובחלק השני would have + V3.',
              hintEn: 'Check had prepared and would have.',
            },
            story: {
              passageEn:
                'In a famous experiment, researchers left thousands of wallets in cities around the world. Most people expected that wallets with money would be kept. Instead, wallets with more money were returned more often. The results surprised just about everyone, and they showed that people can be more honest than we think.',
              passageHe: '',
              questionEn: 'What surprised people about the results?',
              questionHe: '',
              correct: 'Wallets with more money were returned more often.',
              wrong: ['Nobody returned the wallets.', 'All the wallets were stolen.', 'Only cheap wallets were kept.'],
            },
            storyHintEn: 'What happened to the wallets with more money?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 12 unit (`../../registry.ts`) */
export const CORE_4_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', [UNIT_CORE_4]);
