import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 4 unit (Band I): the present continuous for what is happening now
 * (It is raining, We are playing) and its questions (Is it snowing? Are you coming?), about
 * weather and seasons, with Band I words the app never taught or taught only later. Example
 * Hebrew uses slash forms for "I"; "you" is plural; hints and explanations are gender-neutral
 * plural. Word emoji reuse drawn pictures until the unit's own are drawn.
 */
const UNIT_CORE_4: ElementaryUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Weather & Seasons',
  titleHe: 'מזג אוויר ועונות',
  subtitleHe: 'עונה 4: מה קורה עכשיו? It is raining, We are playing, Is it snowing?',
  badgeEmoji: '☂️',
  missions: [
    {
      icon: '🌧️',
      titleEn: 'What Is Happening Now?',
      titleHe: 'מה קורה עכשיו?',
      storyHookHe: 'תסתכלו מהחלון! נלמד לספר מה קורה ממש עכשיו: It is raining, We are playing (am / is / are + ing).',
      grammarTopic: 'Present continuous: am / is / are + -ing',
      skills: ['Present Continuous', 'Weather', 'Now'],
      sentenceEn: 'It is raining, so we are playing inside together.',
      sentenceHe: 'יורד גשם, אז אנחנו משחקים ביחד בפנים.',
      vocab: [
        ['dry', 'adjective', 'יבש', '🏜️', 'The towel is dry now, so I am putting it away.', 'המגבת יבשה עכשיו, אז אני מחזיר/ה אותה למקום.'],
        ['heavy', 'adjective', 'כבד / חזק (גשם)', '🌧️', 'It is raining, and the rain is very heavy.', 'יורד גשם, והגשם חזק מאוד.'],
        ['afternoon', 'noun', 'אחר הצהריים', '🌤️', 'This afternoon we are playing in the park.', 'אחר הצהריים אנחנו משחקים בפארק.'],
        ['watch', 'verb', 'לצפות / להסתכל', '📺', 'Come and watch! The sun is going down.', 'בואו לצפות! השמש שוקעת.'],
        ['wait a minute', 'phrase', 'רגע אחד', '⏲️', 'Wait a minute! I am putting on my coat.', 'רגע אחד! אני לובש/ת את המעיל.'],
        ['together', 'adverb', 'ביחד', '👯', 'My brother and I are building a snowman together.', 'אחי ואני בונים ביחד איש שלג.'],
        ['slowly', 'adverb', 'לאט', '🐢', 'The snow is falling slowly.', 'השלג יורד לאט.'],
        ['early', 'adverb', 'מוקדם', '🌅', 'It is early, and the sun is coming up.', 'מוקדם, והשמש עולה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'pencil', translationHe: 'עיפרון' },
          { wordEn: 'kitchen', translationHe: 'מטבח' },
        ],
        shortSentenceEn: 'We are playing together.',
        shortSentenceHe: 'אנחנו משחקים ביחד.',
        rule: {
          questionEn: 'Look outside! What is happening now?',
          correct: 'It is raining.',
          wrong: ['It rain now.', 'It are raining.'],
          explainHe: 'משהו שקורה עכשיו: am / is / are ואחריו פועל עם ing: It is raining.',
          hintHe: 'מה קורה ממש עכשיו? בדקו שלא חסרה מילה לפני הפועל, ושהפועל נגמר ב-ing.',
        },
        story: {
          passageEn:
            'It is a cold afternoon. The rain is heavy, so Gil and his sister are playing inside together. Gil is building a tower, and his sister is drawing a rainbow. Mom is watching them and smiling.',
          passageHe:
            'זה אחר צהריים קר. הגשם חזק, אז גיל ואחותו משחקים ביחד בבית. גיל בונה מגדל, ואחותו מציירת קשת. אמא מסתכלת עליהם ומחייכת.',
          questionEn: 'What is Gil\'s sister doing?',
          questionHe: 'מה אחותו של גיל עושה?',
          correct: 'drawing a rainbow',
          wrong: ['building a tower', 'watching TV'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is about now?',
              correct: 'I am reading a book.',
              wrong: ['I read a book every day.'],
              explainHe: 'am ו-reading אומרים מה קורה עכשיו.',
              hintHe: 'חפשו am ו-ing.',
            },
            story: {
              passageEn: 'It is early. Dana is eating breakfast. The sun is coming up.',
              passageHe: 'מוקדם. דנה אוכלת ארוחת בוקר. השמש עולה.',
              questionEn: 'What is Dana eating?',
              questionHe: 'מה דנה אוכלת?',
              correct: 'breakfast',
              wrong: ['dinner'],
            },
          },
          challenger: {
            clozeWrong: [
              ['slowly', 'together'],
              ['together', 'afternoon'],
              ['dry', 'slowly'],
              ['heavy', 'dry'],
              ['Good night', 'Happy birthday'],
              ['heavy', 'dry'],
              ['dry', 'afternoon'],
              ['together', 'slowly'],
            ],
          },
          master: {
            sentenceEn: 'The children are playing outside, but the grass is not dry.',
            sentenceHe: 'הילדים משחקים בחוץ, אבל הדשא לא יבש.',
            decoys: ['was', 'play'],
            voiceEn: 'We are waiting for the rain to stop.',
            voiceHe: 'אנחנו מחכים שהגשם ייפסק.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'My friends are playing in the snow.',
              wrong: ['My friends is playing in the snow.', 'My friends are play in the snow.', 'My friends playing in the snow.'],
              explainHe: 'עם friends (הם) אומרים are, והפועל מקבל ing: are playing.',
              hintEn: 'Check are and -ing.',
            },
            story: {
              passageEn:
                'It is Sunday afternoon, and the sky is dark. Noa is riding her bike home slowly. Suddenly it is raining very hard. Noa doesn\'t stop, because her house is near. When she gets home, Dad is waiting at the door with a dry towel.',
              passageHe: '',
              questionEn: 'Why is Dad waiting with a towel?',
              questionHe: '',
              correct: 'Noa is wet from the rain.',
              wrong: ['Noa is going to swim.', 'Dad is going to the beach.', 'The towel is wet.'],
            },
            storyHintEn: 'What is the weather like on the way home?',
          },
        },
      },
    },
    {
      icon: '🌀',
      titleEn: 'Is It Snowing?',
      titleHe: 'יורד שלג?',
      storyHookHe: 'מה קורה בחוץ? נלמד לשאול על עכשיו: Is it snowing? Are you coming? What are you doing?',
      grammarTopic: 'Present continuous questions: Is it …ing? Are you …ing?',
      skills: ['Present Continuous Questions', 'Weather', 'Asking'],
      sentenceEn: 'Is it raining, or is it snowing?',
      sentenceHe: 'יורד גשם או יורד שלג?',
      vocab: [
        ['evening', 'noun', 'ערב', '🌇', 'What are you doing this evening?', 'מה אתם עושים הערב?'],
        ['storm', 'noun', 'סערה', '🌀', 'Is a storm coming? The sky is very dark.', 'סערה מתקרבת? השמיים חשוכים מאוד.'],
        ['sometimes', 'adverb', 'לפעמים', '🌈', 'It sometimes rains in spring, and today it is raining.', 'לפעמים יורד גשם באביב, והיום יורד גשם.'],
        ['soon', 'adverb', 'בקרוב / עוד מעט', '⏳', 'Is the bus coming soon?', 'האוטובוס מגיע בקרוב?'],
        ['close', 'verb', 'לסגור', '🪟', 'Can you close the window? It is snowing!', 'אפשר לסגור את החלון? יורד שלג!'],
        ['bring', 'verb', 'להביא', '☂️', 'Please bring your coat. It is getting cold.', 'הביאו את המעיל, בבקשה. מתחיל להיות קר.'],
        ['easily', 'adverb', 'בקלות', '🪁', 'The kite is flying easily in the wind.', 'העפיפון עף בקלות ברוח.'],
        ['answer', 'verb', 'לענות', '☎️', 'Can you answer the phone? I am cooking.', 'אפשר לענות לטלפון? אני מבשל/ת.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'banana', translationHe: 'בננה' },
          { wordEn: 'sock', translationHe: 'גרב' },
        ],
        shortSentenceEn: 'Are you coming soon?',
        shortSentenceHe: 'אתם באים בקרוב?',
        rule: {
          questionEn: 'You want to know about Dan now. Which question is right?',
          correct: 'Is Dan sleeping?',
          wrong: ['Does Dan sleeping?', 'Is Dan sleep?'],
          explainHe: 'שאלה על עכשיו: is בהתחלה, ואחר כך הפועל עם ing: Is Dan sleeping?',
          hintHe: 'מה בא בהתחלה, ומה בסוף הפועל?',
        },
        story: {
          passageEn:
            'It is evening. Lior is looking out of the window. Is a storm coming? The wind is strong, and the trees are moving. Lior closes the window and asks Mom, "Are we staying home tonight?" Mom says, "Yes, we are."',
          passageHe:
            'ערב. ליאור מסתכל מהחלון. סערה מתקרבת? הרוח חזקה, והעצים זזים. ליאור סוגר את החלון ושואל את אמא: אנחנו נשארים בבית הלילה? אמא אומרת: כן.',
          questionEn: 'What does Lior close?',
          questionHe: 'מה ליאור סוגר?',
          correct: 'the window',
          wrong: ['the door', 'his book'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'It is cold and white outside. What do you ask?',
              correct: 'Is it snowing?',
              wrong: ['Snowing it is?'],
              explainHe: 'בשאלה is בא ראשון: Is it snowing?',
              hintHe: 'מה בא ראשון בשאלה?',
            },
            story: {
              passageEn: 'Look! The sky is dark. A storm is coming soon.',
              passageHe: 'תראו! השמיים חשוכים. סערה מגיעה בקרוב.',
              questionEn: 'What is coming?',
              questionHe: 'מה מגיע?',
              correct: 'a storm',
              wrong: ['the sun'],
            },
          },
          challenger: {
            clozeWrong: [
              ['easily', 'soon'],
              ['close', 'easily'],
              ['storm', 'evening'],
              ['storm', 'evening'],
              ['soon', 'easily'],
              ['soon', 'sometimes'],
              ['storm', 'evening'],
              ['evening', 'soon'],
            ],
          },
          master: {
            sentenceEn: 'Is your dad driving home in the storm?',
            sentenceHe: 'אבא שלכם נוסע הביתה בסערה?',
            decoys: ['Are', 'drive'],
            voiceEn: 'Are you bringing a coat today?',
            voiceHe: 'אתם מביאים מעיל היום?',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Are they waiting for the bus?',
              wrong: ['Is they waiting for the bus?', 'Are they wait for the bus?', 'Are waiting they for the bus?'],
              explainHe: 'עם they שואלים Are, אחר כך they, ואז הפועל עם ing: Are they waiting…?',
              hintEn: 'Check Are, the word order and -ing.',
            },
            story: {
              passageEn:
                'It is evening, and a storm is coming. Grandpa calls Maya. "Are you all at home?" he asks. Maya says, "Yes, we are." Dad is closing the windows, and Mom is bringing candles. Grandpa says, "Good! Stay inside, and call me in the morning."',
              passageHe: '',
              questionEn: 'Why does Grandpa call Maya?',
              questionHe: '',
              correct: 'He wants to know they are safe at home.',
              wrong: ['He wants some candles.', 'He is closing the windows.', 'He wants to come for dinner.'],
            },
            storyHintEn: 'What does Grandpa ask first?',
          },
        },
      },
    },
    {
      icon: '📰',
      isBoss: true,
      titleEn: 'Boss: The Weather Report',
      titleHe: 'אתגר הבוס: תחזית מזג האוויר',
      storyHookHe: 'אתם מגישי התחזית! ספרו מה קורה עכשיו בכל הארץ, ושאלו מה קורה אצל אחרים.',
      grammarTopic: 'Present continuous & questions: Review',
      skills: ['Present Continuous', 'Questions', 'Review'],
      sentenceEn: 'Hello! It is raining in the north today.',
      sentenceHe: 'שלום! היום יורד גשם בצפון.',
      vocab: [
        ['tomorrow', 'adverb', 'מחר', '📆', 'We can play in the snow tomorrow.', 'אנחנו יכולים לשחק בשלג מחר.'],
        ['travel', 'verb', 'לנסוע / לטייל', '🧳', 'We like to travel in the spring.', 'אנחנו אוהבים לטייל באביב.'],
        ['drive', 'verb', 'לנהוג', '🚗', 'Dad, please drive slowly in the rain.', 'אבא, סע לאט בגשם, בבקשה.'],
        ['everything', 'pronoun', 'הכול', '🧺', 'The snow is white, and everything looks new.', 'השלג לבן, והכול נראה חדש.'],
        ['nobody', 'pronoun', 'אף אחד', '🙈', 'Nobody is playing outside in this storm.', 'אף אחד לא משחק בחוץ בסערה הזאת.'],
        ['think', 'verb', 'לחשוב', '🤔', 'I think it is raining in the north.', 'אני חושב/ת שיורד גשם בצפון.'],
        ['finish', 'verb', 'לסיים', '🏁', 'We can play when we finish our homework.', 'אפשר לשחק כשנסיים את שיעורי הבית.'],
        ['learn', 'verb', 'ללמוד', '📚', 'We are learning about the seasons, and I want to learn more.', 'אנחנו לומדים על עונות השנה, ואני רוצה ללמוד עוד.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'shoe', translationHe: 'נעל' },
          { wordEn: 'cake', translationHe: 'עוגה' },
        ],
        shortSentenceEn: 'Nobody is outside.',
        shortSentenceHe: 'אף אחד לא בחוץ.',
        rule: {
          questionEn: 'Which sentence is right?',
          correct: 'Look! It is snowing on the mountain.',
          wrong: ['Look! It snowing on the mountain.', 'Look! It snows on the mountain now.'],
          explainHe: 'מה שקורה עכשיו (Look!): is ואחריו snowing.',
          hintHe: 'Look! אומר שזה קורה עכשיו. בדקו שלא חסרה מילה לפני snowing.',
        },
        story: {
          passageEn:
            'Here is the weather report. Today it is raining in the north, and it is very windy. In the south, everything is dry and the sun is shining. In the north, the rain is stopping now, so you can travel soon. Please drive slowly!',
          passageHe:
            'הנה תחזית מזג האוויר. היום יורד גשם בצפון, ויש רוח חזקה. בדרום הכול יבש והשמש זורחת. בצפון הגשם נפסק עכשיו, אז בקרוב אפשר לנסוע. סעו לאט, בבקשה!',
          questionEn: 'Where is the sun shining today?',
          questionHe: 'איפה השמש זורחת היום?',
          correct: 'in the south',
          wrong: ['in the north', 'everywhere'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Mom is in the car. What is she doing?',
              correct: 'She is driving.',
              wrong: ['She driving.'],
              explainHe: 'she ואחריו is, ואז driving.',
              hintHe: 'מה חסר בין she ל-driving?',
            },
            story: {
              passageEn: 'Today we are learning about rain. Our teacher is showing us pictures of a storm.',
              passageHe: 'היום אנחנו לומדים על גשם. המורה מראה לנו תמונות של סערה.',
              questionEn: 'What are they learning about today?',
              questionHe: 'על מה הם לומדים היום?',
              correct: 'rain',
              wrong: ['snow'],
            },
          },
          challenger: {
            clozeWrong: [
              ['nobody', 'everything'],
              ['nobody', 'tomorrow'],
              ['everything', 'tomorrow'],
              ['travel', 'drive'],
              ['Tomorrow', 'Think'],
              ['drive', 'nobody'],
              ['travel', 'nobody'],
              ['tomorrow', 'nobody'],
            ],
          },
          master: {
            sentenceEn: 'Nobody is driving because the storm is very strong.',
            sentenceHe: 'אף אחד לא נוהג כי הסערה חזקה מאוד.',
            decoys: ['are', 'drive'],
            voiceEn: 'Today we are traveling to the beach.',
            voiceHe: 'היום אנחנו נוסעים לים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I think the rain is stopping now.',
              wrong: ['I think the rain are stopping now.', 'I thinking the rain is stopping now.', 'I think the rain is stop now.'],
              explainHe: 'עם rain אומרים is, ומה שקורה עכשיו מקבל ing: is stopping. הפועל think נשאר בלי ing.',
              hintEn: 'Check is, -ing and think.',
            },
            story: {
              passageEn:
                'Every morning, Yael watches the weather report before school. Today the report says, "It is sunny now, but a storm is coming in the afternoon." Yael thinks for a minute. Then she puts her raincoat in her bag. At three o\'clock the storm comes, so Yael puts on her raincoat. Everything is wet, but Yael is dry.',
              passageHe: '',
              questionEn: 'Why is Yael dry at three o\'clock?',
              questionHe: '',
              correct: 'She is wearing her raincoat.',
              wrong: ['The storm is not coming.', 'She is at home all day.', 'Her mom drives her home.'],
            },
            storyHintEn: 'What does Yael put on at three o\'clock?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 4 unit (`../../registry.ts`) */
export const CORE_4_GRADE_4_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-4', [UNIT_CORE_4]);
