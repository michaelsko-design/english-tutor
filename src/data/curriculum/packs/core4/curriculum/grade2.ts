import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 2 unit: home and address (Where do you live? I live in… My address is…) and
 * counting (How many? There are…), with Pre-Band I words the app never taught or taught only
 * later. Example Hebrew uses slash forms for "I" ("גר/ה"); "you" is plural; hints and
 * explanations are gender-neutral plural. Word emoji reuse drawn pictures until the unit's own
 * pictures are drawn.
 */
const UNIT_CORE_4: ElementaryUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Where Do You Live?',
  titleHe: 'איפה אתם גרים?',
  subtitleHe: 'עונה 4: הבית, הכתובת והמספרים: Where do you live? How many?',
  badgeEmoji: '🏘️',
  missions: [
    {
      icon: '📍',
      titleEn: 'My Address',
      titleHe: 'הכתובת שלי',
      storyHookHe:
        'איפה כולם גרים? נלמד לשאול Where do you live? (איפה אתם גרים?), לענות I live in… ולהגיד את הכתובת שלנו.',
      grammarTopic: 'Where do you live? I live in … / My address is …',
      skills: ['Home & address', 'Where do you live?', 'next to / in front of'],
      sentenceEn: 'I live in a big house next to the park.',
      sentenceHe: 'אני גר/ה בבית גדול ליד הפארק.',
      vocab: [
        ['Where do you live?', 'phrase', 'איפה אתם גרים?', '❔', 'Where do you live? I live in Holon.', 'איפה אתם גרים? אני גר/ה בחולון.'],
        ['I live in', 'phrase', 'אני גר/ה ב...', '🏘️', 'I live in Haifa with my family.', 'אני גר/ה בחיפה עם המשפחה שלי.'],
        ['My address is', 'phrase', 'הכתובת שלי היא...', '✉️', 'My address is 5 Rose Street.', 'הכתובת שלי היא רחוב הוורדים 5.'],
        ['next to', 'preposition', 'ליד', '📍', 'The park is next to my house.', 'הפארק ליד הבית שלי.'],
        ['in front of', 'preposition', 'מול / לפני', '🏪', 'The tree is in front of the shop.', 'העץ נמצא מול החנות.'],
        ['send', 'verb', 'לשלוח', '📮', 'I send a letter to Grandma.', 'אני שולח/ת מכתב לסבתא.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'jump', translationHe: 'לקפוץ' },
          { wordEn: 'banana', translationHe: 'בננה' },
        ],
        shortSentenceEn: 'I live next to Dan.',
        shortSentenceHe: 'אני גר/ה ליד דן.',
        rule: {
          questionEn: 'A friend asks, "Where do you live?" What do you say?',
          correct: 'I live in Haifa.',
          wrong: ['I in Haifa live.', 'I am seven.'],
          explainHe: 'על השאלה Where do you live? עונים I live in … (אני גר/ה ב...).',
          hintHe: 'איזו תשובה אומרת איפה גרים, ובאיזו מהן המילים בסדר הנכון?',
        },
        story: {
          passageEn:
            'Noa is new in class. Tom asks, "Where do you live?" Noa says, "I live in a white house next to the park." Tom says, "I live next to the park too!"',
          passageHe:
            'נועה חדשה בכיתה. תום שואל: איפה את גרה? נועה אומרת: אני גרה בבית לבן ליד הפארק. תום אומר: גם אני גר ליד הפארק!',
          questionEn: 'Where is Noa\'s house?',
          questionHe: 'איפה הבית של נועה?',
          correct: 'next to the park',
          wrong: ['next to the zoo', 'in the school'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one asks about a home?',
              correct: 'Where do you live, Noa?',
              wrong: ['How old are you, Noa?'],
              explainHe: 'Where do you live? פירושו "איפה אתם גרים?".',
              hintHe: 'איזו שאלה שואלת על הבית?',
            },
            story: {
              passageEn: 'Ben lives in a small house. His house is next to a big tree.',
              passageHe: 'בן גר בבית קטן. הבית שלו ליד עץ גדול.',
              questionEn: 'What is next to Ben\'s house?',
              questionHe: 'מה נמצא ליד הבית של בן?',
              correct: 'a big tree',
              wrong: ['a big shop'],
            },
          },
          challenger: {
            clozeWrong: [
              ['How old are you?', 'What is this?'],
              ['I am', 'I like to'],
              ['My name is', 'I am'],
              ['happy', 'green'],
              ['sleep', 'eat'],
              ['sleep', 'am'],
            ],
          },
          master: {
            sentenceEn: 'We live in a small house next to the school.',
            sentenceHe: 'אנחנו גרים בבית קטן ליד בית הספר.',
            decoys: ['lives', 'on'],
            voiceEn: 'I live next to my grandma.',
            voiceHe: 'אני גר/ה ליד סבתא שלי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I live in a big city.',
              wrong: ['I lives in a big city.', 'I live on a big city.', 'I in live a big city.'],
              explainHe: 'אחרי I בא live (לא lives), ועם עיר אומרים in.',
              hintEn: 'Check live and in.',
            },
            story: {
              passageEn:
                'Lior wants to send a card to Grandpa. He asks Mom, "What is Grandpa\'s address?" Mom says, "9 Palm Street."',
              passageHe: '',
              questionEn: 'Why does Lior ask Mom?',
              questionHe: '',
              correct: 'He wants Grandpa\'s address.',
              wrong: ['He wants a new card.', 'He lives with Grandpa.', 'Mom is at the shop.'],
            },
            storyHintEn: 'What does Lior need to write on the card?',
          },
        },
      },
    },
    {
      icon: '🎲',
      titleEn: 'How Many?',
      titleHe: 'כמה יש?',
      storyHookHe: 'בואו נספור! נלמד לשאול how many (כמה), לענות there are (יש) ולחשב עם plus (ועוד).',
      grammarTopic: 'How many …? There are …',
      skills: ['Numbers', 'How many?', 'There are…'],
      sentenceEn: 'There are a lot of books in my room.',
      sentenceHe: 'יש הרבה ספרים בחדר שלי.',
      vocab: [
        ['how many', 'phrase', 'כמה', '🤔', 'Dan, how many cats do you have?', 'דן, כמה חתולים יש לך?'],
        ['there are', 'phrase', 'יש (כמה דברים)', '🐑', 'In my room there are two beds.', 'בחדר שלי יש שתי מיטות.'],
        ['plus', 'preposition', 'ועוד', '✋', 'Two plus two is four.', 'שתיים ועוד שתיים זה ארבע.'],
        ['half', 'noun', 'חצי', '🍰', 'Mom gives me half of the cake.', 'אמא נותנת לי חצי מהעוגה.'],
        ['a few', 'phrase', 'מעט / כמה (לא הרבה)', '🍪', 'I have a few cookies in my bag.', 'יש לי כמה עוגיות בתיק.'],
        ['a lot of', 'phrase', 'הרבה', '🎈', 'We have a lot of balloons at the party.', 'יש לנו הרבה בלונים במסיבה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'run', translationHe: 'לרוץ' },
          { wordEn: 'hat', translationHe: 'כובע' },
        ],
        shortSentenceEn: 'Two plus two is four.',
        shortSentenceHe: 'שתיים ועוד שתיים זה ארבע.',
        rule: {
          questionEn: 'Four balls. Which sentence is right?',
          correct: 'There are four balls.',
          wrong: ['There is four balls.', 'There are four ball.'],
          explainHe: 'עם כמה דברים אומרים There are, והשם מקבל s בסוף: four balls.',
          hintHe: 'בדקו את are ואת ה-s בסוף המילה.',
        },
        story: {
          passageEn:
            'Maya has a party. There are a lot of balloons. There are five red balloons and two blue balloons. How many balloons are there? Seven!',
          passageHe:
            'למאיה יש מסיבה. יש הרבה בלונים. יש חמישה בלונים אדומים ושני בלונים כחולים. כמה בלונים יש? שבעה!',
          questionEn: 'How many red balloons are there?',
          questionHe: 'כמה בלונים אדומים יש?',
          correct: 'five',
          wrong: ['two', 'seven'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'What is two plus one?',
              correct: 'three',
              wrong: ['five'],
              explainHe: 'plus פירושו "ועוד": שתיים ועוד אחת זה שלוש.',
              hintHe: 'ספרו: שתיים ועוד אחת.',
            },
            story: {
              passageEn: 'Tom has a few pencils. He has three pencils in his bag.',
              passageHe: 'לתום יש כמה עפרונות. יש לו שלושה עפרונות בתיק.',
              questionEn: 'How many pencils does Tom have?',
              questionHe: 'כמה עפרונות יש לתום?',
              correct: 'three',
              wrong: ['ten'],
            },
          },
          challenger: {
            clozeWrong: [
              ['how old', 'where'],
              ['there is', 'I am'],
              ['in', 'red'],
              ['happy', 'under'],
              ['under', 'much'],
              ['much', 'under'],
            ],
          },
          master: {
            sentenceEn: 'How many pencils are there in your bag?',
            sentenceHe: 'כמה עפרונות יש בתיק שלכם?',
            decoys: ['is', 'much'],
            voiceEn: 'There are a few apples on the table.',
            voiceHe: 'יש כמה תפוחים על השולחן.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There are six eggs in the box.',
              wrong: ['There is six eggs in the box.', 'There are six egg in the box.', 'There are in the box six eggs.'],
              explainHe: 'עם כמה דברים אומרים There are, והשם ברבים (eggs). המילים in the box באות בסוף.',
              hintEn: 'Check are, eggs and the word order.',
            },
            story: {
              passageEn:
                'Ben and Dana have a pizza. Ben eats half of it. Dana eats the other half. Then Dad comes home. There is no pizza for Dad!',
              passageHe: '',
              questionEn: 'Why is there no pizza for Dad?',
              questionHe: '',
              correct: 'Ben and Dana eat it.',
              wrong: ['Dad does not like pizza.', 'The pizza is in the shop.', 'There are a lot of pizzas.'],
            },
            storyHintEn: 'Who eats the pizza?',
          },
        },
      },
    },
    {
      icon: '🏡',
      isBoss: true,
      titleEn: 'Boss: Welcome to My Home',
      titleHe: 'אתגר הבוס: ברוכים הבאים לבית שלי',
      storyHookHe: 'בואו לבקר! הראו שאתם יודעים לספר איפה גרים, מי גר בבית, ולספור כמה יש.',
      grammarTopic: 'Home, address & numbers: Review',
      skills: ['Where do you live?', 'There are…', 'Review'],
      sentenceEn: 'Come in! My mom and dad are in the kitchen.',
      sentenceHe: 'היכנסו! אמא ואבא שלי במטבח.',
      vocab: [
        ['kid', 'noun', 'ילד / ילדה', '🧒', 'The kid in the red hat is my brother.', 'הילד עם הכובע האדום הוא אח שלי.'],
        ['help', 'verb', 'לעזור', '🙌', 'I help Dad in the kitchen.', 'אני עוזר/ת לאבא במטבח.'],
        ['Who has', 'phrase', 'למי יש...?', '🙋', 'Who has a red pen?', 'למי יש עט אדום?'],
        ['I feel well', 'phrase', 'אני מרגיש/ה טוב', '😌', 'Thank you, I feel well today.', 'תודה, אני מרגיש/ה טוב היום.'],
        ['mom', 'noun', 'אמא', '👩', 'My mom is in the garden.', 'אמא שלי בגינה.'],
        ['dad', 'noun', 'אבא', '👨', 'My dad can cook.', 'אבא שלי יודע לבשל.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'bird', translationHe: 'ציפור' },
          { wordEn: 'fly', translationHe: 'לעוף' },
        ],
        shortSentenceEn: 'I help my mom.',
        shortSentenceHe: 'אני עוזר/ת לאמא שלי.',
        rule: {
          questionEn: 'Welcome to my home! Three kids live here. Which sentence is right?',
          correct: 'There are three kids in my family.',
          wrong: ['There is three kids in my family.', 'There are three kid in my family.'],
          explainHe: 'עם כמה דברים אומרים There are, והשם ברבים: three kids.',
          hintHe: 'בדקו את are ואת ה-s בסוף המילה.',
        },
        story: {
          passageEn:
            'Welcome to Noa\'s home! Noa lives next to the park. There are four kids in her family. Noa helps her mom and dad. Who has a dog? Noa has a dog!',
          passageHe:
            'ברוכים הבאים לבית של נועה! נועה גרה ליד הפארק. במשפחה שלה יש ארבעה ילדים. נועה עוזרת לאמא ולאבא שלה. למי יש כלב? לנועה יש כלב!',
          questionEn: 'How many kids are in Noa\'s family?',
          questionHe: 'כמה ילדים יש במשפחה של נועה?',
          correct: 'four',
          wrong: ['two', 'six'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Mom has a lot of work in the kitchen. What do you say?',
              correct: 'Can I help you, Mom?',
              wrong: ['Good night, Mom!'],
              explainHe: 'Can I help you? פירושו "אפשר לעזור?".',
              hintHe: 'איך מציעים עזרה?',
            },
            story: {
              passageEn: 'Dad is in the garden. Tom helps Dad. They plant a tree.',
              passageHe: 'אבא בגינה. תום עוזר לאבא. הם שותלים עץ.',
              questionEn: 'Who helps Dad?',
              questionHe: 'מי עוזר לאבא?',
              correct: 'Tom',
              wrong: ['Mom'],
            },
          },
          challenger: {
            clozeWrong: [
              ['happy', 'run'],
              ['am', 'sleep'],
              ['Where', 'How many'],
              ['I am', 'I live in'],
              ['happy', 'sleep'],
              ['red', 'under'],
            ],
          },
          master: {
            sentenceEn: 'Who has a pencil? I can help you.',
            sentenceHe: 'למי יש עיפרון? אני יכול/ה לעזור לכם.',
            decoys: ['have', 'is'],
            voiceEn: 'My mom and dad help me.',
            voiceHe: 'אמא ואבא שלי עוזרים לי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I help my dad with the box.',
              wrong: ['I helps my dad with the box.', 'Me help my dad with the box.', 'I help my dad the box with.'],
              explainHe: 'אחרי I בא help בלי s, המשפט מתחיל ב-I (לא Me), ו-with בא לפני the box.',
              hintEn: 'Check I, help and the word order.',
            },
            story: {
              passageEn:
                'Dana has a new home. There are a lot of boxes. Her mom and dad can\'t move the big box. Three kids come and help.',
              passageHe: '',
              questionEn: 'Why do the kids come?',
              questionHe: '',
              correct: 'They help Dana\'s family.',
              wrong: ['They want a new box.', 'They live in Dana\'s room.', 'Dana has a party.'],
            },
            storyHintEn: 'What can\'t Mom and Dad do?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 2 unit (`../../registry.ts`) */
export const CORE_4_GRADE_2_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-2', [UNIT_CORE_4]);
