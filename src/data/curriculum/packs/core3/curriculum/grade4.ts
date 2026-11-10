import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 4 unit (Band I): joining two ideas with and / but / or (coordinated clauses)
 * and giving a reason with because (subordinated clauses), about friends and feelings, with
 * Band I words the app never taught or taught only later. Example Hebrew uses slash forms
 * ("אוהב/ת"); hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_3: ElementaryUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Friends & Feelings',
  titleHe: 'חברים ורגשות',
  subtitleHe: 'עונה 3: מחברים רעיונות עם and, but ו-or, ונותנים סיבה עם because',
  badgeEmoji: '💛',
  missions: [
    {
      icon: '👫',
      titleEn: 'My Friends: and, but, or',
      titleHe: 'החברים שלי: and, but, or',
      storyHookHe: 'נכיר את החברים בכיתה! נלמד לחבר שני רעיונות במשפט אחד עם and (וגם), but (אבל) ו-or (או).',
      grammarTopic: 'and / but / or (coordinated clauses)',
      skills: ['and / but / or', 'Joining Sentences', 'Friends'],
      sentenceEn: 'Noa is young, but she is very clever.',
      sentenceHe: 'נועה צעירה, אבל היא חכמה מאוד.',
      vocab: [
        ['first name', 'noun', 'שם פרטי', '🪪', 'Her first name is Maya, and she is nine.', 'השם הפרטי שלה הוא מאיה, והיא בת תשע.'],
        ['clever', 'adjective', 'חכם / נבון', '🧠', 'Ben is clever, and he helps me with math.', 'בן חכם, והוא עוזר לי בחשבון.'],
        ['young', 'adjective', 'צעיר', '🧒', 'My cousin is young, but he can read.', 'בן הדוד שלי צעיר, אבל הוא כבר יודע לקרוא.'],
        ['all right', 'phrase', 'בסדר', '🙂', 'I fell, but I am all right.', 'נפלתי, אבל אני בסדר.'],
        ['anybody', 'pronoun', 'מישהו (בשאלה)', '🤷', 'Is anybody in the classroom?', 'יש מישהו בכיתה?'],
        ['as well', 'phrase', 'גם', '🐱', 'Noa has a dog, and she has a cat as well.', 'לנועה יש כלב, ויש לה גם חתול.'],
        ['hey', 'interjection', 'היי', '👋', 'Hey, Dan! Do you want to play?', 'היי, דן! אתה רוצה לשחק?'],
        ['conversation', 'noun', 'שיחה', '💬', 'We have a long conversation on the phone.', 'יש לנו שיחה ארוכה בטלפון.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'carrot', translationHe: 'גזר' },
          { wordEn: 'bridge', translationHe: 'גשר' },
        ],
        shortSentenceEn: 'Dan is young and clever.',
        shortSentenceHe: 'דן צעיר וחכם.',
        rule: {
          questionEn: 'Gal likes football. He does not like tennis. Which sentence is correct?',
          correct: 'Gal likes football, but he does not like tennis.',
          wrong: ['Gal likes football, or he does not like tennis.', 'Gal likes football, and but he does not like tennis.'],
          explainHe: 'but (אבל) מחבר שני רעיונות הפוכים: אחד "כן" ואחד "לא". לפני but שמים פסיק.',
          hintHe: 'הרעיון השני הפוך מהראשון. איזו מילה מחברת רעיונות הפוכים?',
        },
        story: {
          passageEn:
            'Maya has a new friend. Her first name is Lia. Lia is young, but she is very clever. After school, they have a long conversation. "Do you want to play ball or draw?" Maya asks. Lia says, "Let\'s draw!"',
          passageHe:
            'למאיה יש חברה חדשה. השם הפרטי שלה הוא ליה. ליה צעירה, אבל היא חכמה מאוד. אחרי בית הספר יש להן שיחה ארוכה. "את רוצה לשחק בכדור או לצייר?" שואלת מאיה. ליה אומרת: "בואי נצייר!"',
          questionEn: 'What does Lia want to do?',
          questionHe: 'מה ליה רוצה לעשות?',
          correct: 'draw',
          wrong: ['play ball', 'read a book'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'You have a cat. You have a dog, too. Which is right?',
              correct: 'I have a cat and a dog.',
              wrong: ['I have a cat but a dog.'],
              explainHe: 'and (וגם) מחבר שני דברים דומים: גם חתול וגם כלב.',
              hintHe: 'יש לכם גם חתול וגם כלב. איזו מילה מחברת אותם?',
            },
            story: {
              passageEn: 'Hey! My first name is Omer. I am young, but I can swim.',
              passageHe: 'היי! השם הפרטי שלי הוא עומר. אני צעיר, אבל אני יודע לשחות.',
              questionEn: "What is the boy's first name?",
              questionHe: 'מה השם הפרטי של הילד?',
              correct: 'Omer',
              wrong: ['Dan'],
            },
          },
          challenger: {
            clozeWrong: [
              ['green door', 'big table'],
              ['window', 'sleep'],
              ['spoon', 'jump'],
              ['thank you', 'excuse me'],
              ['swim', 'yesterday'],
              ['last night', 'thank you'],
              ['table', 'green'],
              ['chair', 'river'],
            ],
          },
          master: {
            sentenceEn: 'Do you want to play a game, or do you want to talk?',
            sentenceHe: 'את/ה רוצה לשחק משחק, או שאת/ה רוצה לדבר?',
            decoys: ['but', 'plays'],
            voiceEn: 'Are you all right, or are you sad?',
            voiceHe: 'את/ה בסדר, או שאת/ה עצוב/ה?',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: "I like apples, but I don't like pears.",
              wrong: [
                "I like apples, but I doesn't like pears.",
                "I like apples, or I don't like pears.",
                "I like apples but, I don't like pears.",
              ],
              explainHe: 'but מחבר רעיון של "כן" ורעיון של "לא". הפסיק בא לפני but, ועם I אומרים don\'t.',
              hintEn: "Check the joining word, the comma and don't.",
            },
            story: {
              passageEn:
                'Ido and Ben are best friends, but they are very different. Ido likes football and loud music. Ben likes books, and he is very clever at chess. On Friday, Ido asks, "Do you want to play football or chess?" Ben smiles. "How about both? Football first, and then chess!"',
              passageHe: '',
              questionEn: 'What do the boys do on Friday?',
              questionHe: '',
              correct: 'Football, then chess.',
              wrong: ['Only chess at home.', 'They read new books.', 'They listen to music.'],
            },
            storyHintEn: 'Read what Ben says at the end.',
          },
        },
      },
    },
    {
      icon: '💭',
      titleEn: 'Why? Because…',
      titleHe: 'למה? כי… (because)',
      storyHookHe: 'למה אנחנו שמחים, עייפים או רעבים? נלמד לתת סיבה עם because (כי).',
      grammarTopic: 'because (giving a reason)',
      skills: ['because', 'Why Questions', 'Feelings'],
      sentenceEn: 'We laugh because the movie is funny.',
      sentenceHe: 'אנחנו צוחקים כי הסרט מצחיק.',
      vocab: [
        ['hungry', 'adjective', 'רעב', '🍽️', 'I am hungry because it is lunch time.', 'אני רעב/ה כי זה זמן ארוחת צהריים.'],
        ['laugh', 'verb', 'לצחוק', '😂', "We laugh at Dad's funny jokes.", 'אנחנו צוחקים מהבדיחות המצחיקות של אבא.'],
        ['enjoy', 'verb', 'ליהנות', '🥳', 'I enjoy the party because my friends are here.', 'אני נהנה/ית מהמסיבה כי החברים שלי כאן.'],
        ['lie', 'verb', 'לשקר', '🙈', 'It is not nice to lie to a friend.', 'זה לא יפה לשקר לחבר.'],
        ['once', 'adverb', 'פעם אחת', '🗓️', 'I see my grandma once a week.', 'אני רואה את סבתא פעם בשבוע.'],
        ['how about', 'phrase', 'מה דעתך על…?', '🤔', 'I am bored. How about a game?', 'משעמם לי. מה דעתך על משחק?'],
        ["don't forget", 'phrase', 'אל תשכחו', '📌', "Don't forget your hat, because it is hot.", 'אל תשכחו את הכובע, כי חם.'],
        ['anywhere', 'adverb', 'בשום מקום / בכל מקום', '🔍', "I can't find my pen anywhere.", 'אני לא מוצא/ת את העט שלי בשום מקום.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'window', translationHe: 'חלון' },
          { wordEn: 'sock', translationHe: 'גרב' },
        ],
        shortSentenceEn: 'I laugh because it is funny.',
        shortSentenceHe: 'אני צוחק/ת כי זה מצחיק.',
        rule: {
          questionEn: 'Why is Dana happy? Her friend is here. Which sentence is correct?',
          correct: 'Dana is happy because her friend is here.',
          wrong: ['Dana is happy but her friend is here.', 'Dana is happy because her friend here.'],
          explainHe: 'because (כי) נותן סיבה. אחרי because בא משפט שלם עם פועל: her friend is here.',
          hintHe: 'איזו מילה נותנת סיבה? ובדקו שיש פועל אחרי המילה הזאת.',
        },
        story: {
          passageEn:
            'Ron is sad today. His friends ask, "Why are you sad?" Ron says, "I am sad because I can\'t find my ball anywhere." Then his friend Gal laughs. "Look! It is under your chair!"',
          passageHe:
            'רון עצוב היום. החברים שלו שואלים: "למה אתה עצוב?" רון אומר: "אני עצוב כי אני לא מוצא את הכדור שלי בשום מקום." ואז החבר שלו גל צוחק. "תראה! הוא מתחת לכיסא שלך!"',
          questionEn: 'Why is Ron sad?',
          questionHe: 'למה רון עצוב?',
          correct: "He can't find his ball.",
          wrong: ['He is very hungry.', 'His friend laughs at him.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence gives a reason?',
              correct: 'I am happy because it is my birthday.',
              wrong: ['I am happy or it is my birthday.'],
              explainHe: 'because (כי) אומר למה. הסיבה כאן: יום הולדת.',
              hintHe: 'איזו מילה עונה על השאלה "למה?"',
            },
            story: {
              passageEn: 'Lea is hungry because it is late. Mom gives her a big sandwich. Now Lea is happy.',
              passageHe: 'לאה רעבה כי מאוחר. אמא נותנת לה כריך גדול. עכשיו לאה שמחה.',
              questionEn: 'Why is Lea hungry?',
              questionHe: 'למה לאה רעבה?',
              correct: 'It is late.',
              wrong: ['It is hot.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['table', 'run'],
              ['chair', 'green'],
              ['window', 'yellow'],
              ['spoon', 'tall'],
              ['table', 'sing'],
              ['thank you', 'good night'],
              ['good morning', 'excuse me'],
              ['banana', 'swim'],
            ],
          },
          master: {
            sentenceEn: "We can't play outside because it is raining.",
            sentenceHe: 'אנחנו לא יכולים לשחק בחוץ כי יורד גשם.',
            decoys: ['but', 'rains'],
            voiceEn: "Don't forget your coat, because it is cold.",
            voiceHe: 'אל תשכחו את המעיל, כי קר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I am tired because I go to bed late.',
              wrong: [
                'I am tired because go to bed late.',
                'I am tired because I goes to bed late.',
                'I am tired because of I go to bed late.',
              ],
              explainHe: 'אחרי because בא משפט שלם עם נושא ופועל: because I go to bed late. עם I הפועל בא בלי s.',
              hintEn: 'Look at the words after because.',
            },
            story: {
              passageEn:
                'Shira does not enjoy her birthday party. Everybody is laughing and eating cake, but Shira sits alone. Her grandma asks her what is wrong. Shira says, "Tamar is not here, because she is sick." Grandma takes the phone, and they call Tamar together. Now Shira is smiling.',
              passageHe: '',
              questionEn: 'Why is Shira smiling at the end?',
              questionHe: '',
              correct: 'She talks to Tamar.',
              wrong: ['She gets a big present.', 'Tamar comes to the party.', 'She eats the birthday cake.'],
            },
            storyHintEn: 'What do Grandma and Shira do?',
          },
        },
      },
    },
    {
      icon: '🤝',
      isBoss: true,
      titleEn: 'Boss: Friends Forever',
      titleHe: 'אתגר הבוס: חברים לתמיד',
      storyHookHe: 'יום החברות בבית הספר! הראו שאתם יודעים לחבר רעיונות עם and, but ו-or ולתת סיבה עם because.',
      grammarTopic: 'and / but / or + because & Review',
      skills: ['and / but / or', 'because', 'Review'],
      sentenceEn: 'I often meet my friends, but today I am busy.',
      sentenceHe: 'אני נפגש/ת עם החברים שלי לעיתים קרובות, אבל היום אני עסוק/ה.',
      vocab: [
        ['group', 'noun', 'קבוצה', '👥', 'We work in a group of four.', 'אנחנו עובדים בקבוצה של ארבעה.'],
        ['often', 'adverb', 'לעיתים קרובות', '🔁', 'We often play together after school.', 'אנחנו משחקים יחד לעיתים קרובות אחרי בית הספר.'],
        ['the rest', 'noun', 'השאר', '🍰', 'I eat one piece, and you eat the rest.', 'אני אוכל/ת חתיכה אחת, ואתם אוכלים את השאר.'],
        ['age', 'noun', 'גיל', '🎂', 'Ben and I are the same age.', 'בן ואני באותו גיל.'],
        ['busy', 'adjective', 'עסוק', '📋', "I can't play now because I am busy.", 'אני לא יכול/ה לשחק עכשיו כי אני עסוק/ה.'],
        ['meet', 'verb', 'לפגוש / להיפגש', '🤗', 'I meet my friends at the park.', 'אני נפגש/ת עם החברים שלי בפארק.'],
        ['nice', 'adjective', 'נחמד', '😊', 'Our new teacher is very nice.', 'המורה החדשה שלנו נחמדה מאוד.'],
        ['someone', 'pronoun', 'מישהו', '🧍', 'Someone is at the door.', 'מישהו ליד הדלת.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'onion', translationHe: 'בצל' },
          { wordEn: 'pillow', translationHe: 'כרית' },
        ],
        shortSentenceEn: 'We are the same age.',
        shortSentenceHe: 'אנחנו באותו גיל.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: "I can't come because I am busy.",
          wrong: ["I can't come but I am busy.", "I can't come because I busy."],
          explainHe: 'because נותן את הסיבה, ואחריו בא משפט שלם עם am: because I am busy.',
          hintHe: 'איזו מילה אומרת למה? ובדקו שיש פועל אחרי I.',
        },
        story: {
          passageEn:
            'Our class works in groups. Dana is in my group. She is my age, and she is very nice. I am busy with the pictures, and Dana writes the words. Our teacher says, "Great work!"',
          passageHe:
            'הכיתה שלנו עובדת בקבוצות. דנה בקבוצה שלי. היא בגיל שלי, והיא נחמדה מאוד. אני עסוק/ה בציורים, ודנה כותבת את המילים. המורה שלנו אומרת: "עבודה מצוינת!"',
          questionEn: 'What does Dana do?',
          questionHe: 'מה דנה עושה?',
          correct: 'She writes the words.',
          wrong: ['She draws the pictures.', 'She talks to the teacher.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'You can have tea. You can have milk. Which is right?',
              correct: 'Do you want tea or milk?',
              wrong: ['Do you want tea but milk?'],
              explainHe: 'or (או) נותן בחירה: תה או חלב.',
              hintHe: 'צריך לבחור אחד משני הדברים. איזו מילה מתאימה?',
            },
            story: {
              passageEn: 'Someone is at the door. It is Tal! We often play after school. Today we play ball.',
              passageHe: 'מישהו ליד הדלת. זה טל! אנחנו משחקים הרבה אחרי בית הספר. היום אנחנו משחקים בכדור.',
              questionEn: 'Who is at the door?',
              questionHe: 'מי ליד הדלת?',
              correct: 'Tal',
              wrong: ['Grandma'],
            },
          },
          challenger: {
            clozeWrong: [
              ['jump', 'green'],
              ['table', 'apple'],
              ['very happy', 'go home'],
              ['swim', 'under'],
              ['table', 'swim'],
              ['green', 'chair'],
              ['run', 'book'],
              ['sing', 'green'],
            ],
          },
          master: {
            sentenceEn: 'My group is nice, but we are often very busy.',
            sentenceHe: 'הקבוצה שלי נחמדה, אבל אנחנו לעיתים קרובות עסוקים מאוד.',
            decoys: ['because', 'or'],
            voiceEn: 'We meet at the park because it is sunny.',
            voiceHe: 'אנחנו נפגשים בפארק כי יש שמש.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'You can stay, or you can go home.',
              wrong: [
                'You can stay, or you can goes home.',
                'You can stay or, you can go home.',
                'You can stays, or you can go home.',
              ],
              explainHe: 'or נותן בחירה בין שני דברים. אחרי can הפועל בא בלי s, והפסיק בא לפני or.',
              hintEn: 'Check the verbs after can and the comma.',
            },
            story: {
              passageEn:
                'Noam is new in our class, and he does not know anybody. At break, he sits alone because he is shy. Then someone sits next to him. It is Yael, and she is his age. "Do you like football or basketball?" she asks. Noam smiles. "Both!" At the end of the day, they walk home together.',
              passageHe: '',
              questionEn: 'Why does Noam sit alone at first?',
              questionHe: '',
              correct: 'He is new and shy.',
              wrong: ['He does not like Yael.', 'He is busy with homework.', 'He wants to play football.'],
            },
            storyHintEn: 'Read the first two sentences.',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 4 unit (`../../registry.ts`) */
export const CORE_3_GRADE_4_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-4', [UNIT_CORE_3]);
