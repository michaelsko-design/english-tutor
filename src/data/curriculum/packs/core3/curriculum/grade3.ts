import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 3 unit: yes/no questions with Do you like…? and Do you have…? and the short
 * answers (Yes, I do / No, I don't), with Pre-Band I words the app never taught. Example Hebrew
 * uses slash forms ("אוהב/ת"); hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_3: ElementaryUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Do You Like…? Do You Have…?',
  titleHe: 'שואלים שאלות: אוהבים? יש לכם?',
  subtitleHe: 'עונה 3: שואלים Do you like…? ו-Do you have…? ועונים Yes, I do או No, I don\'t',
  badgeEmoji: '❓',
  missions: [
    {
      icon: '🐾',
      titleEn: 'Do You Like Pets?',
      titleHe: 'אוהבים חיות מחמד?',
      storyHookHe: 'מה החברים אוהבים? נלמד לשאול Do you like…? ולענות Yes, I do או No, I don\'t.',
      grammarTopic: 'Do you like …? Yes, I do. / No, I don\'t.',
      skills: ['Questions', 'Do you like…?', 'Yes, I do / No, I don\'t'],
      sentenceEn: 'Do you like my new pet?',
      sentenceHe: 'אתם אוהבים את חיית המחמד החדשה שלי?',
      vocab: [
        ['pet', 'noun', 'חיית מחמד', '🐾', 'My pet is a little white cat.', 'חיית המחמד שלי היא חתולה לבנה קטנה.'],
        ['soft', 'adjective', 'רך', '🧸', 'My teddy bear is very soft.', 'הדובי שלי רך מאוד.'],
        ['fun', 'noun', 'כיף', '🎉', 'Swimming is fun!', 'לשחות זה כיף!'],
        ['yes', 'adverb', 'כן', '👍', 'Yes, I do. I like dogs.', 'כן. אני אוהב/ת כלבים.'],
        ['no', 'adverb', 'לא', '🙅', 'No, I don\'t. I like cats.', 'לא. אני אוהב/ת חתולים.'],
        ['film star', 'noun', 'כוכב קולנוע', '🎞️', 'My mom likes this film star.', 'אמא שלי אוהבת את כוכב הקולנוע הזה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'bus', translationHe: 'אוטובוס' },
          { wordEn: 'chair', translationHe: 'כיסא' },
        ],
        shortSentenceEn: 'I like my pet.',
        shortSentenceHe: 'אני אוהב/ת את חיית המחמד שלי.',
        rule: {
          questionEn: 'Which question is correct?',
          correct: 'Do you like cats?',
          wrong: ['You like do cats?', 'Do you likes cats?'],
          explainHe: 'שאלה כזאת מתחילה ב-Do: Do you like…? ואחרי Do הפועל בא בלי s.',
          hintHe: 'במה מתחילה השאלה? ומה קורה לפועל שאחריה?',
        },
        story: {
          passageEn:
            'Ron has a pet dog. The dog is soft and fun. Ron asks Maya, Do you like dogs? Maya says, Yes, I do! Ron asks, Do you like snakes? Maya says, No, I don\'t!',
          passageHe:
            'לרון יש כלב. הכלב רך וכיפי. רון שואל את מאיה: את אוהבת כלבים? מאיה אומרת: כן! רון שואל: את אוהבת נחשים? מאיה אומרת: לא!',
          questionEn: 'What pet does Ron have?',
          questionHe: 'איזו חיית מחמד יש לרון?',
          correct: 'a dog',
          wrong: ['a cat', 'a snake'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'You like apples. Someone asks, Do you like apples? What do you say?',
              correct: 'Yes, I do.',
              wrong: ['Yes, I like.'],
              explainHe: 'על שאלה עם Do עונים בקצרה: Yes, I do או No, I don\'t.',
              hintHe: 'איזו מילה מהשאלה חוזרת בתשובה?',
            },
            story: {
              passageEn: 'I have a pet cat. Her name is Mitzi. She is soft and white.',
              passageHe: 'יש לי חתולה. קוראים לה מיצי. היא רכה ולבנה.',
              questionEn: 'What color is Mitzi?',
              questionHe: 'באיזה צבע מיצי?',
              correct: 'white',
              wrong: ['black'],
            },
          },
          challenger: {
            clozeWrong: [
              ['sun', 'milk'],
              ['run', 'table'],
              ['chair', 'sleep'],
              ['blue', 'table'],
              ['green', 'apple'],
              ['eat', 'happy'],
            ],
          },
          master: {
            sentenceEn: 'Do you like dogs, or do you like cats?',
            sentenceHe: 'אתם אוהבים כלבים, או שאתם אוהבים חתולים?',
            decoys: ['likes', 'does'],
            voiceEn: 'No, I don\'t like snakes.',
            voiceHe: 'לא, אני לא אוהב/ת נחשים.',
            errorFix: {
              questionEn: 'Which question has no mistake?',
              correct: 'Do you like soft toys?',
              wrong: ['Do you likes soft toys?', 'You do like soft toys?', 'Do like you soft toys?'],
              explainHe: 'השאלה מתחילה ב-Do, אחר כך you, ואז like בלי s.',
              hintEn: 'Check the first word and like.',
            },
            story: {
              passageEn:
                'Gal and Shir want a pet. Gal asks, Do you like dogs? Shir says, No, I don\'t. Dogs are too big and loud. Do you like cats? Gal says, Yes, I do! So they get a soft little cat.',
              passageHe: '',
              questionEn: 'Why do they get a cat and not a dog?',
              questionHe: '',
              correct: 'Shir does not like dogs.',
              wrong: ['Gal does not like cats.', 'Cats are big and loud.', 'They have a dog at home.'],
            },
            storyHintEn: 'What does Shir say about dogs?',
          },
        },
      },
    },
    {
      icon: '🥅',
      titleEn: 'Do You Have a Net?',
      titleHe: 'יש לכם רשת?',
      storyHookHe: 'יוצאים לשחק! נלמד לשאול Do you have…? (יש לך…?) ולענות Yes, I do או No, I don\'t.',
      grammarTopic: 'Do you have …? Yes, I do. / No, I don\'t.',
      skills: ['Questions', 'Do you have…?', 'have'],
      sentenceEn: 'Do you have a ball at home?',
      sentenceHe: 'יש לכם כדור בבית?',
      vocab: [
        ['net', 'noun', 'רשת', '🥅', 'The ball is in the net!', 'הכדור ברשת!'],
        ['both', 'pronoun', 'שניהם / שנינו', '👯', 'We both have a red bike.', 'לשנינו יש אופניים אדומים.'],
        ['cut', 'verb', 'לגזור / לחתוך', '✂️', 'I cut the paper with scissors.', 'אני גוזר/ת את הנייר במספריים.'],
        ['at home', 'phrase', 'בבית', '🫖', 'I have a cat at home.', 'יש לי חתול בבית.'],
        ['today', 'adverb', 'היום', '📆', 'Do you have English today?', 'יש לכם אנגלית היום?'],
        ['hot', 'adjective', 'חם', '🔥', 'The soup is very hot.', 'המרק חם מאוד.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'tree', translationHe: 'עץ' },
          { wordEn: 'fish', translationHe: 'דג' },
        ],
        shortSentenceEn: 'I have a net.',
        shortSentenceHe: 'יש לי רשת.',
        rule: {
          questionEn: 'Which question is correct?',
          correct: 'Do you have a pencil?',
          wrong: ['Do you has a pencil?', 'You have do a pencil?'],
          explainHe: 'שואלים Do you have…? אחרי Do you בא have, לא has.',
          hintHe: 'מה בא אחרי Do you: have או has? ובמה מתחילה השאלה?',
        },
        story: {
          passageEn:
            'Tal and Ido play football. Tal asks, Do you have a ball? Ido says, Yes, I do. Ido asks, Do you have a net? Tal says, No, I don\'t. They play with the ball and two bags.',
          passageHe:
            'טל ועידו משחקים כדורגל. טל שואל: יש לך כדור? עידו אומר: כן. עידו שואל: יש לך רשת? טל אומר: לא. הם משחקים עם הכדור ושני תיקים.',
          questionEn: 'Who has a ball?',
          questionHe: 'למי יש כדור?',
          correct: 'Ido',
          wrong: ['Tal', 'the teacher'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which question is right?',
              correct: 'Do you have a cat?',
              wrong: ['Do you has a cat?'],
              explainHe: 'אחרי Do you בא have.',
              hintHe: 'have או has?',
            },
            story: {
              passageEn: 'It is hot today. Dan and Lea both have hats. They play at home.',
              passageHe: 'היום חם. לדן וללאה יש כובעים. הם משחקים בבית.',
              questionEn: 'Where do Dan and Lea play?',
              questionHe: 'איפה דן ולאה משחקים?',
              correct: 'at home',
              wrong: ['at school'],
            },
          },
          challenger: {
            clozeWrong: [
              ['sing', 'happy'],
              ['milk', 'sing'],
              ['sleep', 'happy'],
              ['eat', 'sing'],
              ['eat', 'happy'],
              ['run', 'chair'],
            ],
          },
          master: {
            sentenceEn: 'Do you both have your books today?',
            sentenceHe: 'יש לשניכם את הספרים שלכם היום?',
            decoys: ['has', 'does'],
            voiceEn: 'No, I don\'t have a net.',
            voiceHe: 'לא, אין לי רשת.',
            errorFix: {
              questionEn: 'Which question has no mistake?',
              correct: 'Do you have a hot drink?',
              wrong: ['Do you has a hot drink?', 'Do you have a drink hot?', 'Have you do a hot drink?'],
              explainHe: 'שואלים Do you have…? והמילה שמתארת (hot) באה לפני הדבר: a hot drink.',
              hintEn: 'Check have and where hot goes.',
            },
            story: {
              passageEn:
                'It is a hot day at the beach. Omer and Dana want to play ball. Omer asks, Do you have a net? Dana says, No, I don\'t, but I have a long rope. They put the rope between two chairs and play.',
              passageHe: '',
              questionEn: 'What do they use as a net?',
              questionHe: '',
              correct: 'a rope',
              wrong: ['a big towel', 'two school bags', 'a sun hat'],
            },
            storyHintEn: 'What does Dana have?',
          },
        },
      },
    },
    {
      icon: '🎤',
      isBoss: true,
      titleEn: 'Boss: The Question Game',
      titleHe: 'אתגר הבוס: משחק השאלות',
      storyHookHe: 'משחק שאלות בכיתה! הראו שאתם יודעים לשאול Do you like…? ו-Do you have…? ולענות נכון.',
      grammarTopic: 'Do you like / Do you have? & Review',
      skills: ['Do you like…?', 'Do you have…?', 'Review'],
      sentenceEn: 'Do you know my best friend?',
      sentenceHe: 'אתם מכירים את החבר הכי טוב שלי?',
      vocab: [
        ['Do you know', 'phrase', 'אתם מכירים…? / אתם יודעים…?', '🤓', 'Do you know my teacher?', 'אתם מכירים את המורה שלי?'],
        ['What color is your', 'phrase', 'באיזה צבע ה… שלכם?', '🟧', 'What color is your bag?', 'באיזה צבע התיק שלכם?'],
        ['best', 'adjective', 'הכי טוב', '🏆', 'Ron is my best friend.', 'רון הוא החבר הכי טוב שלי.'],
        ['fan', 'noun', 'אוהד / מעריץ', '🎽', 'My dad is a big fan of football.', 'אבא שלי אוהד גדול של כדורגל.'],
        ['end', 'noun', 'סוף', '🔚', 'This is the end of the game.', 'זה סוף המשחק.'],
        ['from', 'preposition', 'מ...', '🛫', 'I am from Israel.', 'אני מישראל.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'egg', translationHe: 'ביצה' },
          { wordEn: 'rain', translationHe: 'גשם' },
        ],
        shortSentenceEn: 'Do you know Dan?',
        shortSentenceHe: 'אתם מכירים את דן?',
        rule: {
          questionEn: 'You have no dog. Someone asks, Do you have a dog? Which answer is correct?',
          correct: 'No, I don\'t. I have a cat.',
          wrong: ['No, I doesn\'t. I have a cat.', 'No, I am not. I have a cat.'],
          explainHe: 'על שאלה עם Do you…? עונים בקצרה: Yes, I do או No, I don\'t.',
          hintHe: 'השאלה מתחילה ב-Do. מה חוזר בתשובה?',
        },
        story: {
          passageEn:
            'Our class plays a question game. Noa asks Ben, Do you like football? Ben says, Yes, I do. I am a big fan! Noa asks, Do you have a ball? Ben says, No, I don\'t.',
          passageHe:
            'הכיתה שלנו משחקת משחק שאלות. נועה שואלת את בן: אתה אוהב כדורגל? בן אומר: כן. אני אוהד גדול! נועה שואלת: יש לך כדור? בן אומר: לא.',
          questionEn: 'Does Ben have a ball?',
          questionHe: 'יש לבן כדור?',
          correct: 'No, he has no ball.',
          wrong: ['Yes, a red ball.', 'Yes, two balls.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which question is right?',
              correct: 'Do you know Maya?',
              wrong: ['You know do Maya?'],
              explainHe: 'שאלה כזאת מתחילה ב-Do.',
              hintHe: 'במה מתחילה השאלה?',
            },
            story: {
              passageEn: 'I am from Israel. My best friend is Ron. He is a big fan of cars.',
              passageHe: 'אני מישראל. החבר הכי טוב שלי הוא רון. הוא אוהב מאוד מכוניות.',
              questionEn: 'Who is my best friend?',
              questionHe: 'מי החבר הכי טוב שלי?',
              correct: 'Ron',
              wrong: ['Dan'],
            },
          },
          challenger: {
            clozeWrong: [
              ['happy', 'table'],
              ['run', 'eat'],
              ['eat', 'under'],
              ['sing', 'green'],
              ['eat', 'happy'],
              ['and', 'but'],
            ],
          },
          master: {
            sentenceEn: 'What color is your new bike?',
            sentenceHe: 'באיזה צבע האופניים החדשים שלכם?',
            decoys: ['are', 'colors'],
            voiceEn: 'Do you know the end of the story?',
            voiceHe: 'אתם יודעים את סוף הסיפור?',
            errorFix: {
              questionEn: 'Which question has no mistake?',
              correct: 'Do you have a big bag?',
              wrong: ['Do you has a big bag?', 'You do have a big bag?', 'Does you have a big bag?'],
              explainHe: 'שאלה עם you מתחילה ב-Do, ואחרי Do you בא have: Do you have…?',
              hintEn: 'Check do or does, and have or has.',
            },
            story: {
              passageEn:
                'A new girl comes to our class. Her name is Emma, and she is from England. I ask her, Do you like football? She says, Yes, I do! At the end of the day, Emma and I play football. Now she is my friend.',
              passageHe: '',
              questionEn: 'Why do Emma and I play football?',
              questionHe: '',
              correct: 'We both like football.',
              wrong: ['Emma is from Israel.', 'Emma does not like football.', 'It is the end of the game.'],
            },
            storyHintEn: 'What does Emma say about football?',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 3 unit (`../../registry.ts`) */
export const CORE_3_GRADE_3_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-3', [UNIT_CORE_3]);
