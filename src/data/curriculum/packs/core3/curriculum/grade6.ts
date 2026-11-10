import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 6 unit (Band I): adverbs of manner, the -ly ones (quickly, carefully) and the
 * special ones (well, hard, fast), about sports and competitions, with Band I words the app never
 * taught or taught only later. Example Hebrew uses slash forms ("צריך/ה"); hints and explanations
 * are gender-neutral plural.
 */
const UNIT_CORE_3: ElementaryUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Sports & Competitions',
  titleHe: 'ספורט ותחרויות',
  subtitleHe: 'עונה 3: מתארים איך עושים משהו עם תוארי פועל: quickly, carefully, well',
  badgeEmoji: '🏆',
  missions: [
    {
      icon: '🏃',
      titleEn: 'Run Quickly, Throw Carefully',
      titleHe: 'רצים מהר, זורקים בזהירות',
      storyHookHe: 'יום ספורט בבית הספר! נלמד לתאר איך עושים משהו: quick → quickly, careful → carefully.',
      grammarTopic: 'Adverbs of manner (-ly adverbs: quickly, carefully)',
      skills: ['Adverbs of manner', '-ly', 'Sports'],
      sentenceEn: 'Run quickly, but throw the ball carefully.',
      sentenceHe: 'רוצו מהר, אבל זרקו את הכדור בזהירות.',
      vocab: [
        ['quick', 'adjective', 'מהיר', '⚡', 'Dana is a quick runner.', 'דנה היא רצה מהירה.'],
        ['careful', 'adjective', 'זהיר', '🦺', 'Be careful! The floor is wet.', 'היזהרו! הרצפה רטובה.'],
        ['slowly', 'adverb', 'לאט', '🐢', 'The old man walks slowly.', 'האיש הזקן הולך לאט.'],
        ['easily', 'adverb', 'בקלות', '😌', 'Ron wins the race easily.', 'רון מנצח במרוץ בקלות.'],
        ['throw', 'verb', 'לזרוק', '🥏', 'Throw the ball to me!', 'זרקו לי את הכדור!'],
        ['catch', 'verb', 'לתפוס', '🧤', 'Can you catch the ball with one hand?', 'אתם יכולים לתפוס את הכדור ביד אחת?'],
        ['follow', 'verb', 'ללכת אחרי / לעקוב', '👣', 'Follow me to the field!', 'בואו אחריי למגרש!'],
        ['the middle', 'noun', 'האמצע', '🔘', 'Stand in the middle of the circle.', 'עמדו באמצע המעגל.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'pillow', translationHe: 'כרית' },
          { wordEn: 'soup', translationHe: 'מרק' },
        ],
        shortSentenceEn: 'She runs quickly.',
        shortSentenceHe: 'היא רצה מהר.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'Tom runs quickly in the race.',
          wrong: ['Tom runs quick in the race.', 'Tom runs quicly in the race.'],
          explainHe: 'כדי לתאר איך עושים משהו מוסיפים ly לתואר: quick → quickly. המילה באה אחרי הפועל.',
          hintHe: 'המילה מתארת איך הוא רץ. מה מוסיפים ל-quick, ואיך כותבים את זה?',
        },
        story: {
          passageEn:
            'It is sports day. Noa runs quickly and wins the race easily. Then the children throw and catch balls. Ben catches every ball, because he moves carefully. At the end, the teacher says, "Follow me to the middle of the field for the prizes!"',
          passageHe:
            'זה יום ספורט. נועה רצה מהר ומנצחת במרוץ בקלות. אחר כך הילדים זורקים ותופסים כדורים. בן תופס כל כדור, כי הוא זז בזהירות. בסוף המורה אומרת: "בואו אחריי לאמצע המגרש לקבל פרסים!"',
          questionEn: 'Who wins the race?',
          questionHe: 'מי מנצח במרוץ?',
          correct: 'Noa',
          wrong: ['Ben', 'the teacher'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'How does the turtle walk? Which is right?',
              correct: 'The turtle walks slowly.',
              wrong: ['The turtle walks slows.'],
              explainHe: 'slowly (לאט) מתאר איך הצב הולך.',
              hintHe: 'איזו מילה נגמרת ב-ly?',
            },
            story: {
              passageEn: 'Gal can catch the ball easily. He throws it to Dan. Dan catches it, too!',
              passageHe: 'גל תופס את הכדור בקלות. הוא זורק אותו לדן. גם דן תופס אותו!',
              questionEn: 'Who throws the ball to Dan?',
              questionHe: 'מי זורק את הכדור לדן?',
              correct: 'Gal',
              wrong: ['Dan'],
            },
          },
          challenger: {
            clozeWrong: [
              ['eat', 'under'],
              ['chair', 'eat'],
              ['table', 'green'],
              ['apple', 'sing'],
              ['happy', 'table'],
              ['green', 'window'],
              ['tall', 'apple'],
              ['very fast', 'go home'],
            ],
          },
          master: {
            sentenceEn: 'In the egg race, we walk slowly and carefully.',
            sentenceHe: 'במרוץ הביצים, אנחנו הולכים לאט ובזהירות.',
            decoys: ['quick', 'runs'],
            voiceEn: 'Follow me quickly to the middle!',
            voiceHe: 'בואו אחריי מהר לאמצע!',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'She throws the ball carefully.',
              wrong: ['She throws the ball careful.', 'She throw the ball carefully.', 'She throws carefully the ball.'],
              explainHe: 'carefully מתאר איך היא זורקת, ובא אחרי הדבר שזורקים: throws the ball carefully. עם she מוסיפים s לפועל.',
              hintEn: 'Check the verb, the -ly word and where it goes.',
            },
            story: {
              passageEn:
                'In the egg-and-spoon race, Lior runs very quickly, but his egg falls after ten steps. Shani walks slowly and carefully, and she holds her spoon with two hands. The other children laugh at her, but she does not stop. In the end, Shani is the only one with an egg on her spoon, and she wins.',
              passageHe: '',
              questionEn: 'Why does Shani win the race?',
              questionHe: '',
              correct: 'She is slow but careful.',
              wrong: ['She runs faster than Lior.', 'The others laugh at her.', 'She has two spoons.'],
            },
            storyHintEn: 'What happens to the eggs of the others?',
          },
        },
      },
    },
    {
      icon: '🥇',
      titleEn: 'Play Well, Train Hard',
      titleHe: 'משחקים טוב, מתאמנים קשה',
      storyHookHe: 'יש תוארי פועל מיוחדים: good → well, ו-hard ו-fast לא משתנים. נלמד אותם בתחרות כדורסל!',
      grammarTopic: 'Adverbs of manner: well, hard, fast',
      skills: ['Adverbs of manner', 'well / hard / fast', 'Competitions'],
      sentenceEn: 'Our team plays well because we practice hard.',
      sentenceHe: 'הקבוצה שלנו משחקת טוב כי אנחנו מתאמנים קשה.',
      vocab: [
        ['well', 'adverb', 'היטב / טוב', '👏', 'Maya sings very well.', 'מאיה שרה טוב מאוד.'],
        ['hard', 'adverb', 'קשה / במאמץ', '💪', 'Dan works hard every day.', 'דן עובד קשה כל יום.'],
        ['wonderful', 'adjective', 'נפלא', '🤩', 'What a wonderful game!', 'איזה משחק נפלא!'],
        ['not bad', 'phrase', 'לא רע', '😐', 'Not bad! You can do it better next time.', 'לא רע! בפעם הבאה תצליחו עוד יותר.'],
        ['almost', 'adverb', 'כמעט', '⛳', 'The game is almost over.', 'המשחק כמעט נגמר.'],
        ['step', 'noun', 'צעד', '🦶', 'Take one step to the left.', 'עשו צעד אחד שמאלה.'],
        ['side', 'noun', 'צד', '🟨', 'Our fans sit on this side of the field.', 'האוהדים שלנו יושבים בצד הזה של המגרש.'],
        ['exactly', 'adverb', 'בדיוק', '💯', "The game begins at exactly four o'clock.", 'המשחק מתחיל בדיוק בארבע.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'onion', translationHe: 'בצל' },
          { wordEn: 'lamp', translationHe: 'מנורה' },
        ],
        shortSentenceEn: 'He plays well.',
        shortSentenceHe: 'הוא משחק טוב.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'Lia plays tennis very well.',
          wrong: ['Lia plays tennis very good.', 'Lia plays tennis very goodly.'],
          explainHe: 'good הוא תואר של שם עצם (a good player). כדי לתאר איך משחקים אומרים well: plays well.',
          hintHe: 'המילה מתארת איך היא משחקת. מה תואר הפועל של good?',
        },
        story: {
          passageEn:
            'Our class has a basketball competition. Our team trains hard every day. In the game, Omer plays well, and he scores almost every time. At the end, the score is 20 to 18. "What a wonderful game!" says our coach.',
          passageHe:
            'בכיתה שלנו יש תחרות כדורסל. הקבוצה שלנו מתאמנת קשה כל יום. במשחק עומר משחק טוב, והוא קולע כמעט בכל פעם. בסוף התוצאה היא 20 ל-18. "איזה משחק נפלא!" אומר המאמן שלנו.',
          questionEn: 'What is the score at the end?',
          questionHe: 'מה התוצאה בסוף?',
          correct: '20 to 18',
          wrong: ['10 to 8', '20 to 20'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'She swims well.',
              wrong: ['She swims good.'],
              explainHe: 'כדי לתאר איך היא שוחה אומרים well (טוב), לא good.',
              hintHe: 'איזו מילה מתארת פעולה?',
            },
            story: {
              passageEn: 'Ben trains hard. He can run fast. Today he wins a wonderful prize.',
              passageHe: 'בן מתאמן קשה. הוא יכול לרוץ מהר. היום הוא זוכה בפרס נפלא.',
              questionEn: 'How does Ben train?',
              questionHe: 'איך בן מתאמן?',
              correct: 'hard',
              wrong: ['slowly'],
            },
          },
          challenger: {
            clozeWrong: [
              ['table', 'apple'],
              ['green', 'chair'],
              ['eat', 'under'],
              ['good night', 'happy birthday'],
              ['apple', 'swim'],
              ['happy', 'green'],
              ['sing', 'blue'],
              ['table', 'happy'],
            ],
          },
          master: {
            sentenceEn: 'The game was not bad, but we can play much better.',
            sentenceHe: 'המשחק לא היה רע, אבל אנחנו יכולים לשחק הרבה יותר טוב.',
            decoys: ['good', 'well'],
            voiceEn: 'Take one step to the side, exactly like me.',
            voiceHe: 'עשו צעד אחד הצידה, בדיוק כמוני.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'They work hard, and they play fast.',
              wrong: [
                'They work hardly, and they play fast.',
                'They work hard, and they play fastly.',
                'They work hard, and they plays fast.',
              ],
              explainHe: 'hard ו-fast נשארים אותו דבר גם כתוארי פועל, בלי ly: work hard, play fast. (hardly היא מילה אחרת: כמעט לא.)',
              hintEn: 'Some adverbs have no -ly.',
            },
            story: {
              passageEn:
                'Before the big race, Adi is nervous. Her legs feel heavy, and she almost goes home. Her coach says, "You train hard every week. Just run well and enjoy it." Adi runs her best race. She is not first, but she is third, and her time is better than ever. She jumps up and down with a big smile.',
              passageHe: '',
              questionEn: 'How does Adi feel at the end?',
              questionHe: '',
              correct: 'Happy with her race.',
              wrong: ['Sad about third place.', 'Nervous and tired.', 'Angry with her coach.'],
            },
            storyHintEn: 'Look at what Adi does at the end.',
          },
        },
      },
    },
    {
      icon: '🏅',
      isBoss: true,
      titleEn: 'Boss: The Big Competition',
      titleHe: 'אתגר הבוס: התחרות הגדולה',
      storyHookHe: 'הגמר הגדול מתחיל! הראו שאתם יודעים לתאר איך כל אחד משחק: quickly, carefully, well ו-hard.',
      grammarTopic: 'Adverbs of manner & Review',
      skills: ['Adverbs of manner', '-ly / well / hard', 'Review'],
      sentenceEn: 'She swims across the pool quickly and easily.',
      sentenceHe: 'היא שוחה לרוחב הבריכה מהר ובקלות.',
      vocab: [
        ['Olympic Games', 'noun', 'המשחקים האולימפיים', '🏟️', 'One day I will swim in the Olympic Games.', 'יום אחד אשחה במשחקים האולימפיים.'],
        ['come along', 'verb', 'להצטרף / לבוא', '🧑‍🤝‍🧑', 'We are going to the game. Do you want to come along?', 'אנחנו הולכים למשחק. רוצים להצטרף?'],
        ['hang on', 'phrase', 'רגע / חכו', '🤚', 'Hang on! I need my shoes.', 'רגע! אני צריך/ה את הנעליים שלי.'],
        ['a while', 'phrase', 'זמן מה', '🕥', "Let's rest for a while.", 'בואו ננוח לזמן מה.'],
        ['across', 'preposition', 'לרוחב / מעבר ל…', '🌉', 'We walk across the bridge to the stadium.', 'אנחנו חוצים את הגשר אל האצטדיון.'],
        ['push', 'verb', 'לדחוף', '🫸', "Don't push other players!", 'אל תדחפו שחקנים אחרים!'],
        ['enough', 'determiner', 'מספיק', '🛑', 'We have enough players for a team.', 'יש לנו מספיק שחקנים לקבוצה.'],
        ['special', 'adjective', 'מיוחד', '🌟', 'Today is a special day for our team.', 'היום הוא יום מיוחד לקבוצה שלנו.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'pillow', translationHe: 'כרית' },
          { wordEn: 'carrot', translationHe: 'גזר' },
        ],
        shortSentenceEn: 'We have enough players.',
        shortSentenceHe: 'יש לנו מספיק שחקנים.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'Please cross the road carefully.',
          wrong: ['Please cross the road careful.', 'Please cross carefully the road.'],
          explainHe: 'carefully מתאר איך עושים. הוא בא אחרי הפועל והדבר: cross the road carefully.',
          hintHe: 'בדקו את סוף המילה ואת המקום שלה במשפט.',
        },
        story: {
          passageEn:
            'Our school has a special sports day. First, we swim across the pool. Dana swims quickly, and I swim slowly. Then we rest for a while. In the last race, nobody pushes, and everybody runs well. "Not bad!" says the coach. "Maybe one day you will be in the Olympic Games!"',
          passageHe:
            'בבית הספר שלנו יש יום ספורט מיוחד. קודם אנחנו שוחים לרוחב הבריכה. דנה שוחה מהר, ואני שוחה לאט. אחר כך אנחנו נחים לזמן מה. במרוץ האחרון אף אחד לא דוחף, וכולם רצים טוב. "לא רע!" אומר המאמן. "אולי יום אחד תהיו במשחקים האולימפיים!"',
          questionEn: 'Who swims quickly?',
          questionHe: 'מי שוחה מהר?',
          correct: 'Dana',
          wrong: ['the coach', 'nobody'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'He walks carefully.',
              wrong: ['He walks careful.'],
              explainHe: 'carefully (בזהירות) מתאר איך הוא הולך.',
              hintHe: 'איזו מילה מתארת איך הוא הולך?',
            },
            story: {
              passageEn: 'Hang on! The game is not over. We have enough time. Shai kicks the ball well. Goal!',
              passageHe: 'רגע! המשחק לא נגמר. יש לנו מספיק זמן. שי בועט בכדור טוב. גול!',
              questionEn: 'Who kicks the ball?',
              questionHe: 'מי בועט בכדור?',
              correct: 'Shai',
              wrong: ['the coach'],
            },
          },
          challenger: {
            clozeWrong: [
              ['happy birthday', 'go home'],
              ['good night', 'thank you'],
              ['happy birthday', 'good night'],
              ['very tall', 'the apple'],
              ['happy', 'table'],
              ['green', 'window'],
              ['under', 'sleep'],
              ['eat', 'under'],
            ],
          },
          master: {
            sentenceEn: 'The players walk across the field slowly, and the fans clap loudly.',
            sentenceHe: 'השחקנים הולכים לרוחב המגרש לאט, והאוהדים מוחאים כפיים בקול.',
            decoys: ['slow', 'loud'],
            voiceEn: 'Hang on, we will rest for a while.',
            voiceHe: 'רגע, אנחנו ננוח לזמן מה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Our team played well and won easily.',
              wrong: [
                'Our team played good and won easily.',
                'Our team played well and won easy.',
                'Our team well played and won easily.',
              ],
              explainHe: 'תוארי פועל מתארים איך, ובאים אחרי הפועל: played well (לא good), won easily (easy → easily).',
              hintEn: 'Check the words that say how.',
            },
            story: {
              passageEn:
                'At the school Olympic Games, our class is last after the first two races. Before the relay race, our teacher says, "Don\'t run too quickly at the start. Pass the stick carefully." Everybody listens. We pass the stick perfectly, and the other teams drop it twice. We win the relay, and the whole class jumps and shouts happily.',
              passageHe: '',
              questionEn: 'Why does our class win the relay?',
              questionHe: '',
              correct: 'We pass the stick carefully.',
              wrong: ['We start very quickly.', 'The other teams stop running.', 'We are first after two races.'],
            },
            storyHintEn: 'What does the teacher tell the class?',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 6 unit (`../../registry.ts`) */
export const CORE_3_GRADE_6_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-6', [UNIT_CORE_3]);
