import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Core-plus ("Season 2") grade 5 units: possessives (my / his / her, 's, whose) with family words,
 * then cooking with some / any and countable / uncountable nouns. They build on units 1–4
 * (be, have / has, Present Simple). The cooking Boss is the grade's new finale.
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Family Tree & Whose Is It?',
    titleHe: 'עץ המשפחה ושל מי זה?',
    subtitleHe: "עונה 2: בני משפחה, my / his / her / their ו-’s (Dana's bag)",
    badgeEmoji: '👪',
    missions: [
      {
        icon: '🌳',
        titleEn: 'My Family Tree',
        titleHe: 'עץ המשפחה שלי',
        storyHookHe: 'עונה 2 מתחילה! בונים עץ משפחה ומספרים מי זה מי עם my, his, her ו-their.',
        grammarTopic: 'Possessive Adjectives (my / his / her / their)',
        skills: ['Family Words', 'my / his / her', 'Voice Practice'],
        sentenceEn: 'My aunt lives in Haifa with her two cats.',
        sentenceHe: 'הדודה שלי גרה בחיפה עם שני החתולים שלה.',
        vocab: [
          ['aunt', 'noun', 'דודה', '👩', 'My aunt teaches music at a school.', 'הדודה שלי מלמדת מוזיקה בבית ספר.'],
          ['uncle', 'noun', 'דוד', '🧔', 'Our uncle has a big red truck.', 'לדוד שלנו יש משאית אדומה גדולה.'],
          ['cousin', 'noun', 'בן דוד / בת דודה', '🧒', 'My cousin is ten years old.', 'בן הדוד שלי בן עשר.'],
          ['twins', 'noun', 'תאומים', '👫', 'The twins have the same birthday.', 'לתאומים יש אותו יום הולדת.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'teacher', translationHe: 'מורה' },
            { wordEn: 'doctor', translationHe: 'רופא' },
          ],
          shortSentenceEn: 'This is my aunt.',
          shortSentenceHe: 'זו הדודה שלי.',
          rule: {
            questionEn: 'Noa has a cousin. Which sentence is correct?',
            correct: 'Her cousin is funny.',
            wrong: ['His cousin is funny.', 'She cousin is funny.'],
            explainHe: 'נועה היא בת, ולכן אומרים her (שלה). his זה "שלו", ו-she זה "היא" ולא "שלה".',
            hintHe: 'נועה היא בת. איזו מילה אומרת "שלה"? שימו לב: she זה "היא".',
          },
          story: {
            passageEn:
              'Maya has a big family. Her uncle Avi has twins, Tom and Gal. They are her cousins. Their dog is called Bamba. Maya visits them every Friday.',
            passageHe:
              'למאיה יש משפחה גדולה. לדוד שלה אבי יש תאומים, תום וגל. הם בני הדודים שלה. הכלב שלהם נקרא במבה. מאיה מבקרת אותם בכל יום שישי.',
            questionEn: 'What is the name of their dog?',
            questionHe: 'איך קוראים לכלב שלהם?',
            correct: 'Bamba',
            wrong: ['Tom', 'Gal'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Dan has an uncle. Which one is right?',
                correct: 'His uncle is tall.',
                wrong: ['He uncle is tall.'],
                explainHe: 'דן הוא בן, ולכן אומרים his (שלו). he פירושו "הוא".',
                hintHe: 'איזו מילה אומרת "שלו": he או his?',
              },
              story: {
                passageEn: 'Lia has an aunt. Her aunt is a nurse. Her aunt has two cats.',
                passageHe: 'לליה יש דודה. הדודה שלה היא אחות. לדודה שלה יש שני חתולים.',
                questionEn: 'What does her aunt have?',
                questionHe: 'מה יש לדודה שלה?',
                correct: 'two cats',
                wrong: ['two dogs'],
              },
            },
            challenger: {
              clozeWrong: [
                ['table', 'pencil'],
                ['window', 'pencil'],
                ['carrot', 'window'],
                ['rivers', 'windows'],
              ],
            },
            master: {
              sentenceEn: 'Our uncle and his twin sons live near us.',
              sentenceHe: 'הדוד שלנו ושני בניו התאומים גרים קרוב אלינו.',
              decoys: ['hers', 'lives'],
              voiceEn: 'Her aunt has a big blue car.',
              voiceHe: 'לדודה שלה יש מכונית כחולה גדולה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Noa takes her cousin to the park.',
                wrong: ['Noa takes she cousin to the park.', 'Noa takes hers cousin to the park.', 'Noa take her cousin to the park.'],
                explainHe: 'her אומר "שלה" ובא לפני שם העצם. she זה "היא", ועם Noa (she) הפועל מקבל s.',
                hintEn: 'Check the word before cousin and the verb ending.',
              },
              story: {
                passageEn: 'Avi shows a photo of his family at a party. In the middle, two boys wear the same blue shirt and make the same funny face. Avi says they are his cousins, but nobody can tell them apart. Even their mother sometimes uses the wrong name.',
                passageHe: '',
                questionEn: 'Why can nobody tell the two boys apart?',
                questionHe: '',
                correct: 'They are twins and look the same.',
                wrong: ['They are far from the camera.', 'They wear very different clothes.', 'They have different mothers.'],
              },
              storyHintEn: 'Look at their shirts and faces.',
            },
          },
        },
      },
      {
        icon: '🔍',
        titleEn: 'Whose Is It? Lost and Found',
        titleHe: 'של מי זה? פינת האבדות',
        storyHookHe: 'בפינת האבדות של בית הספר מחכים חפצים לבעלים שלהם! נגלה של מי כל דבר עם Whose ועם ’s.',
        grammarTopic: "Possessive 's & Whose",
        skills: ["Possessive 's", 'Whose Questions', 'Reading'],
        sentenceEn: "This is Dana's umbrella and that is Ben's scarf.",
        sentenceHe: 'זו המטרייה של דנה וזה הצעיף של בן.',
        vocab: [
          ['whose', 'question word', 'של מי', '❓', 'Whose pencil is on the floor?', 'של מי העיפרון שעל הרצפה?'],
          ['umbrella', 'noun', 'מטרייה', '☂️', 'I have a yellow umbrella.', 'יש לי מטרייה צהובה.'],
          ['scarf', 'noun', 'צעיף', '🧣', 'My scarf is long and warm.', 'הצעיף שלי ארוך וחם.'],
          ['glasses', 'noun', 'משקפיים', '👓', "Grandpa can't read without his glasses.", 'סבא לא יכול לקרוא בלי המשקפיים שלו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'pillow', translationHe: 'כרית' },
            { wordEn: 'kitchen', translationHe: 'מטבח' },
          ],
          shortSentenceEn: "It is Dana's scarf.",
          shortSentenceHe: 'זה הצעיף של דנה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "This is Ron's umbrella.",
            wrong: ['This is Rons umbrella.', 'This is Ron umbrella.'],
            explainHe: 'כדי להגיד של מי משהו מוסיפים לשם ’s: Ron’s umbrella = המטרייה של רון. בלי הגרש, Rons נשמע כמו רבים.',
            hintHe: 'כדי להגיד "של רון" מוסיפים משהו לשם עצמו: גרש ואות אחת.',
          },
          story: {
            passageEn:
              "The lost and found box is full. There is a blue scarf, a red umbrella and old glasses. The scarf is Yoni's. The umbrella is Shira's. Nobody knows whose glasses they are.",
            passageHe:
              'קופסת האבדות מלאה. יש בה צעיף כחול, מטרייה אדומה ומשקפיים ישנים. הצעיף של יוני. המטרייה של שירה. אף אחד לא יודע של מי המשקפיים.',
            questionEn: 'Whose is the red umbrella?',
            questionHe: 'של מי המטרייה האדומה?',
            correct: "Shira's",
            wrong: ["Yoni's", "the teacher's"],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: "It is Dana's bag.",
                wrong: ['It is Danas bag.'],
                explainHe: 'כדי להגיד "של דנה" מוסיפים ’s לשם: Dana’s.',
                hintHe: 'כדי להגיד "של דנה" מוסיפים משהו לסוף השם.',
              },
              story: {
                passageEn: 'It is raining. Ben has a yellow umbrella. It is very big.',
                passageHe: 'יורד גשם. לבן יש מטרייה צהובה. היא גדולה מאוד.',
                questionEn: "What color is Ben's umbrella?",
                questionHe: 'באיזה צבע המטרייה של בן?',
                correct: 'yellow',
                wrong: ['green'],
              },
            },
            challenger: {
              clozeWrong: [
                ['Where', 'When'],
                ['river', 'tomorrow'],
                ['teacher', 'school'],
                ['dinner', 'weekend'],
              ],
            },
            master: {
              sentenceEn: 'The red scarf on the chair belongs to Maya.',
              sentenceHe: 'הצעיף האדום שעל הכיסא שייך למאיה.',
              decoys: ['whose', 'blue'],
              voiceEn: 'Whose glasses are on the table?',
              voiceHe: 'של מי המשקפיים שעל השולחן?',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: "This is Yossi's blue umbrella.",
                wrong: ['This is Yossis blue umbrella.', 'This is Yossi blue umbrella.', "This is Yossi's umbrella blue."],
                explainHe: 'כדי להגיד "של יוסי" מוסיפים ’s לשם, והתואר blue בא לפני שם העצם.',
                hintEn: 'Look at the end of the name and the word order.',
              },
              story: {
                passageEn: 'After the school trip, the teacher finds a bag on the bus. Inside there are a green scarf and a notebook with horse drawings on every page. Noa smiles and says she knows the owner. Her little sister loves horses and always forgets her things on buses.',
                passageHe: '',
                questionEn: 'Whose bag does Noa think it is?',
                questionHe: '',
                correct: "Her sister's bag.",
                wrong: ["Her teacher's bag.", "Her mother's bag.", "Her friend's bag."],
              },
              storyHintEn: 'Think about the drawings in the notebook.',
            },
          },
        },
      },
      {
        icon: '🧺',
        isBoss: true,
        titleEn: 'Boss: The Big Family Picnic',
        titleHe: 'אתגר הבוס: הפיקניק המשפחתי הגדול',
        storyHookHe: 'כל המשפחה נפגשת בפארק! הראו שאתם יודעים לספר של מי כל דבר עם my, his, her, their ו-’s.',
        grammarTopic: "Review: Possessives (my / his / her & 's)",
        skills: ['Review', "Possessives & 's", 'Reading'],
        sentenceEn: 'My niece takes a photo of her baby brother.',
        sentenceHe: 'האחיינית שלי מצלמת תמונה של אחיה התינוק.',
        vocab: [
          ['niece', 'noun', 'אחיינית', '👧', 'My niece loves to draw animals.', 'האחיינית שלי אוהבת לצייר חיות.'],
          ['nephew', 'noun', 'אחיין', '👦', 'Her nephew plays football every day.', 'האחיין שלה משחק כדורגל כל יום.'],
          ['baby', 'noun', 'תינוק / תינוקת', '👶', 'The baby sleeps in the afternoon.', 'התינוק ישן אחר הצהריים.'],
          ['photo', 'noun', 'תמונה / צילום', '📷', 'This photo is from my birthday.', 'התמונה הזאת היא מיום ההולדת שלי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'garden', translationHe: 'גינה' },
            { wordEn: 'pencil', translationHe: 'עיפרון' },
          ],
          shortSentenceEn: 'Look at their photo.',
          shortSentenceHe: 'תסתכלו על התמונה שלהם.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "The twins love their grandma's cake.",
            wrong: ["The twins love they grandma's cake.", 'The twins love their grandmas cake.'],
            explainHe: 'their אומר "שלהם" (they זה רק "הם"), ו-grandma’s עם גרש ו-s אומר "של סבתא".',
            hintHe: 'בדקו שני דברים: איזו מילה אומרת "שלהם", ואיך כותבים "של סבתא".',
          },
          story: {
            passageEn:
              'On Saturday the whole family has a picnic in the park. Aunt Rina brings her famous cake. Uncle Moshe plays with his baby son. My cousins take photos with their new camera. Everyone is happy.',
            passageHe:
              'בשבת כל המשפחה עושה פיקניק בפארק. הדודה רינה מביאה את העוגה המפורסמת שלה. הדוד משה משחק עם הבן התינוק שלו. בני הדודים שלי מצלמים תמונות עם המצלמה החדשה שלהם. כולם שמחים.',
            questionEn: 'Who brings a cake?',
            questionHe: 'מי מביא/ה עוגה?',
            correct: 'Aunt Rina',
            wrong: ['Uncle Moshe', 'the cousins'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: 'This is their dog.',
                wrong: ['This is they dog.'],
                explainHe: 'their אומר "שלהם". they פירושו "הם".',
                hintHe: 'איזו מילה אומרת "שלהם": they או their?',
              },
              story: {
                passageEn: 'Mia has a baby brother. His name is Ido. He is one year old.',
                passageHe: 'למיה יש אח תינוק. קוראים לו עידו. הוא בן שנה.',
                questionEn: 'How old is Ido?',
                questionHe: 'בן כמה עידו?',
                correct: 'one year old',
                wrong: ['two years old'],
              },
            },
            challenger: {
              clozeWrong: [
                ['table', 'window'],
                ['pencil', 'carrot'],
                ['window', 'river'],
                ['river', 'mountain'],
              ],
            },
            master: {
              sentenceEn: 'Their nephew holds the baby while I take photos.',
              sentenceHe: 'האחיין שלהם מחזיק את התינוק בזמן שאני מצלם/ת תמונות.',
              decoys: ['hers', 'them'],
              voiceEn: 'My niece has a pink camera.',
              voiceHe: 'לאחיינית שלי יש מצלמה ורודה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: "The baby holds her mother's hand.",
                wrong: ["The baby holds she mother's hand.", 'The baby holds her mothers hand.', "The baby hold her mother's hand."],
                explainHe: 'her אומר "שלה", הגרש ב-mother’s מראה "של אמא", ועם the baby (she) הפועל מקבל s.',
                hintEn: 'Check the word before mother and the verb.',
              },
              story: {
                passageEn: 'At the picnic, my niece wants a photo with every person in the family. My uncle holds the camera, but his hands shake and every photo is blurry. Then my nephew has an idea. He puts the camera on a rock and presses a button. At last, everyone is in the picture.',
                passageHe: '',
                questionEn: 'Why does the nephew put the camera on a rock?',
                questionHe: '',
                correct: 'So everyone can be in the photo.',
                wrong: ['The camera is too heavy for him.', 'He wants to take a photo of rocks.', 'The baby wants to sleep on it.'],
              },
              storyHintEn: 'Who is missing from the photos?',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Cooking Club: Some & Any',
    titleHe: 'מועדון הבישול: Some ו-Any',
    subtitleHe: 'עונה 2: מתכונים, some / any, דברים שסופרים ושלא סופרים – והגמר החדש של כיתה ה׳!',
    badgeEmoji: '🍲',
    missions: [
      {
        icon: '🥚',
        titleEn: "Let's Bake a Cake",
        titleHe: 'בואו נאפה עוגה!',
        storyHookHe: 'נכנסים למטבח של מועדון הבישול! נבדוק מה יש לנו עם some ומה אין לנו עם any.',
        grammarTopic: 'Some / Any',
        skills: ['Kitchen Words', 'Some / Any', 'Voice Practice'],
        sentenceEn: "We have some flour, but we don't have any sugar.",
        sentenceHe: 'יש לנו קצת קמח, אבל אין לנו סוכר בכלל.',
        vocab: [
          ['flour', 'noun', 'קמח', '🌾', 'We need flour for the pizza dough.', 'אנחנו צריכים קמח לבצק של הפיצה.'],
          ['sugar', 'noun', 'סוכר', '🍬', 'I drink tea without sugar.', 'אני שותה תה בלי סוכר.'],
          ['bowl', 'noun', 'קערה', '🥣', 'Put the eggs in a big bowl.', 'שימו את הביצים בקערה גדולה.'],
          ['oven', 'noun', 'תנור', '🔥', 'The oven is very hot.', 'התנור חם מאוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ladder', translationHe: 'סולם' },
            { wordEn: 'sock', translationHe: 'גרב' },
          ],
          shortSentenceEn: 'We have some flour.',
          shortSentenceHe: 'יש לנו קצת קמח.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "We don't have any eggs.",
            wrong: ["We don't have some eggs.", "We doesn't have any eggs."],
            explainHe: 'במשפט חיובי אומרים some, ובשלילה ובשאלה אומרים any. עם we אומרים don’t: We don’t have any eggs.',
            hintHe: 'זה משפט שלילה, ובשלילה יש מילה אחרת מזו שבמשפט חיובי. בדקו גם את צורת השלילה עם we.',
          },
          story: {
            passageEn:
              "Noa and her dad want to bake a cake. They have some flour and some eggs. But there isn't any sugar in the kitchen. Dad goes to the shop. Then they put the cake in the oven.",
            passageHe:
              'נועה ואבא שלה רוצים לאפות עוגה. יש להם קצת קמח וכמה ביצים. אבל אין סוכר במטבח. אבא הולך לחנות. אחר כך הם מכניסים את העוגה לתנור.',
            questionEn: 'What is missing in the kitchen?',
            questionHe: 'מה חסר במטבח?',
            correct: 'sugar',
            wrong: ['flour', 'eggs'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: 'We have some eggs.',
                wrong: ['We have any eggs.'],
                explainHe: 'במשפט חיובי אומרים some.',
                hintHe: 'זה משפט חיובי, בלי המילה not. איזו מילה מתאימה לו?',
              },
              story: {
                passageEn: 'Dad has a bowl. There is flour in the bowl. He makes a cake.',
                passageHe: 'לאבא יש קערה. יש קמח בקערה. הוא מכין עוגה.',
                questionEn: 'What is in the bowl?',
                questionHe: 'מה יש בקערה?',
                correct: 'flour',
                wrong: ['sugar'],
              },
            },
            challenger: {
              clozeWrong: [
                ['sand', 'stones'],
                ['shoes', 'books'],
                ['fork', 'knife'],
                ['snow', 'ice'],
              ],
            },
            master: {
              sentenceEn: 'Mom puts some flour and two eggs in a bowl.',
              sentenceHe: 'אמא שמה קצת קמח ושתי ביצים בקערה.',
              decoys: ['any', 'egg'],
              voiceEn: 'The sugar is in the blue box.',
              voiceHe: 'הסוכר בקופסה הכחולה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: "There isn't any milk in the fridge.",
                wrong: ["There isn't some milk in the fridge.", "There aren't any milk in the fridge.", "There isn't any milks in the fridge."],
                explainHe: 'בשלילה אומרים any. milk הוא דבר שלא סופרים, ולכן is ובלי s.',
                hintEn: 'Check some or any, and the verb be.',
              },
              story: {
                passageEn: 'Dana wants to bake a cake for her dad. She opens the cupboard and sees the flour, but the sugar box is empty. She looks at the clock. The shop is open for ten more minutes. Dana puts on her shoes and runs out of the door.',
                passageHe: '',
                questionEn: 'Why does Dana run out of the door?',
                questionHe: '',
                correct: 'She needs sugar before the shop closes.',
                wrong: ['She sees that the oven is too hot.', 'She wants to buy some more flour.', 'Her dad calls her to the shop.'],
              },
              storyHintEn: 'What is missing from the cupboard?',
            },
          },
        },
      },
      {
        icon: '🧀',
        titleEn: 'Pizza Night: Count It or Not?',
        titleHe: 'ערב פיצה: סופרים או לא?',
        storyHookHe: 'מכינים פיצה! עגבנייה אחת, שלוש עגבניות... אבל גבינה לא סופרים. נלמד מתי אומרים a ומתי some.',
        grammarTopic: 'Countable & Uncountable Nouns (a / an / some)',
        skills: ['Food Words', 'Countable / Uncountable', 'Reading'],
        sentenceEn: 'I need an onion, two tomatoes and some cheese.',
        sentenceHe: 'אני צריך/ה בצל, שתי עגבניות וקצת גבינה.',
        vocab: [
          ['cheese', 'noun', 'גבינה', '🧀', 'This cheese is soft and white.', 'הגבינה הזאת רכה ולבנה.'],
          ['tomato', 'noun', 'עגבנייה', '🍅', 'A tomato is red and round.', 'עגבנייה היא אדומה ועגולה.'],
          ['onion', 'noun', 'בצל', '🧅', 'There is an onion in the salad.', 'יש בצל בסלט.'],
          ['carrot', 'noun', 'גזר', '🥕', 'The carrot is orange and long.', 'הגזר כתום וארוך.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'shoe', translationHe: 'נעל' },
            { wordEn: 'chair', translationHe: 'כיסא' },
          ],
          shortSentenceEn: 'I need some cheese.',
          shortSentenceHe: 'אני צריך/ה קצת גבינה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I want some cheese on my pizza.',
            wrong: ['I want a cheese on my pizza.', 'I want cheeses on my pizza.'],
            explainHe: 'cheese הוא דבר שלא סופרים (uncountable), ולכן לא אומרים a cheese ולא cheeses.',
            hintHe: 'האם אפשר לספור גבינה? לפני דבר שלא סופרים לא שמים a, וגם לא מוסיפים לו s.',
          },
          story: {
            passageEn:
              "Tonight Ben makes pizza with his grandpa. They put tomato sauce and some cheese on the dough. Ben cuts an onion. Grandpa adds two carrots to the salad. The pizza is ready at seven o'clock.",
            passageHe:
              'הערב בן מכין פיצה עם סבא שלו. הם שמים רוטב עגבניות וקצת גבינה על הבצק. בן חותך בצל. סבא מוסיף שני גזרים לסלט. הפיצה מוכנה בשעה שבע.',
            questionEn: 'What does Ben cut?',
            questionHe: 'מה בן חותך?',
            correct: 'an onion',
            wrong: ['two carrots', 'some cheese'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: 'We need an onion.',
                wrong: ['We need a onion.'],
                explainHe: 'לפני מילה שמתחילה בצליל תנועה (onion) אומרים an.',
                hintHe: 'onion מתחילה בצליל של תנועה. איזו מילה מתאימה לפניה?',
              },
              story: {
                passageEn: 'Ben has a red tomato. He cuts the tomato. He puts it on the pizza.',
                passageHe: 'לבן יש עגבנייה אדומה. הוא חותך את העגבנייה. הוא שם אותה על הפיצה.',
                questionEn: 'Where does Ben put the tomato?',
                questionHe: 'איפה בן שם את העגבנייה?',
                correct: 'on the pizza',
                wrong: ['in the soup'],
              },
            },
            challenger: {
              clozeWrong: [
                ['night', 'idea'],
                ['idea', 'song'],
                ['elephant', 'umbrella'],
                ['week', 'lesson'],
              ],
            },
            master: {
              sentenceEn: 'We put some cheese and an onion on the pizza.',
              sentenceHe: 'אנחנו שמים קצת גבינה ובצל על הפיצה.',
              decoys: ['a', 'cheeses'],
              voiceEn: 'Dad cuts the carrots for the soup.',
              voiceHe: 'אבא חותך את הגזרים למרק.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'I need two carrots and some cheese.',
                wrong: ['I need two carrot and some cheese.', 'I need two carrots and a cheese.', 'I need two carrots and some cheeses.'],
                explainHe: 'אחרי two שם העצם מקבל s (carrots), ואת cheese לא סופרים: some cheese.',
                hintEn: 'Check the noun after two and the word cheese.',
              },
              story: {
                passageEn: 'Tomer wants to make a salad, but the fridge is almost empty. There is one onion and a lot of cheese, but there are no tomatoes. He asks his sister to bring some from the shop. She comes back with a smile and a big red bag. Tomer starts to cut.',
                passageHe: '',
                questionEn: 'Why does Tomer ask his sister to go to the shop?',
                questionHe: '',
                correct: 'The salad has no tomatoes yet.',
                wrong: ['He needs more cheese now.', 'He has too many onions.', 'The fridge is full of food.'],
              },
              storyHintEn: 'What is missing from the fridge?',
            },
          },
        },
      },
      {
        icon: '🍝',
        isBoss: true,
        titleEn: 'Boss: The Great Chef Finale',
        titleHe: 'אתגר הבוס: גמר השפים הגדול',
        storyHookHe: 'זה הגמר של עונה 2! מכינים ארוחה ענקית. הראו שאתם יודעים some, any, a ו-an.',
        grammarTopic: 'Review: Some / Any & Countable / Uncountable',
        skills: ['Review', 'Some / Any', 'Reading'],
        sentenceEn: 'Is there any chocolate for the pancakes?',
        sentenceHe: 'יש שוקולד לפנקייקים?',
        vocab: [
          ['recipe', 'noun', 'מתכון', '📜', 'This recipe is from my grandma.', 'המתכון הזה מסבתא שלי.'],
          ['soup', 'noun', 'מרק', '🍲', 'Hot soup is great in winter.', 'מרק חם נהדר בחורף.'],
          ['pancake', 'noun', 'פנקייק / לביבה', '🥞', 'I eat a pancake with honey.', 'אני אוכל/ת פנקייק עם דבש.'],
          ['chocolate', 'noun', 'שוקולד', '🍫', 'We have some dark chocolate.', 'יש לנו קצת שוקולד מריר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bridge', translationHe: 'גשר' },
            { wordEn: 'ruler', translationHe: 'סרגל' },
          ],
          shortSentenceEn: 'Is there any soup?',
          shortSentenceHe: 'יש מרק?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Are there any pancakes on the plate?',
            wrong: ['Is there any pancakes on the plate?', 'Are there some pancake on the plate?'],
            explainHe: 'בשאלה משתמשים ב-any. pancakes הם רבים, ולכן Are there any pancakes?',
            hintHe: 'pancakes הם רבים. בדקו איזו צורה של be מתאימה לרבים, ואיזו מילה באה בשאלה.',
          },
          story: {
            passageEn:
              "The cooking club has a big final today. Every team gets a recipe. Lia's team makes tomato soup. Omer's team makes pancakes, but there isn't any chocolate. They use some honey. The teacher loves both dishes.",
            passageHe:
              'למועדון הבישול יש היום גמר גדול. כל קבוצה מקבלת מתכון. הקבוצה של ליה מכינה מרק עגבניות. הקבוצה של עומר מכינה פנקייקים, אבל אין שוקולד. הם משתמשים בקצת דבש. המורה אוהב/ת את שתי המנות.',
            questionEn: "What does Lia's team make?",
            questionHe: 'מה מכינה הקבוצה של ליה?',
            correct: 'tomato soup',
            wrong: ['pancakes', 'pizza'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: "I don't have any soup.",
                wrong: ["I don't have some soup."],
                explainHe: 'בשלילה אומרים any.',
                hintHe: 'זה משפט שלילה (don’t). איזו מילה מתאימה בשלילה?',
              },
              story: {
                passageEn: 'Lia reads a recipe. She needs milk, eggs and flour. She makes pancakes.',
                passageHe: 'ליה קוראת מתכון. היא צריכה חלב, ביצים וקמח. היא מכינה פנקייקים.',
                questionEn: 'What does Lia make?',
                questionHe: 'מה ליה מכינה?',
                correct: 'pancakes',
                wrong: ['soup'],
              },
            },
            challenger: {
              clozeWrong: [
                ['mountain', 'river'],
                ['ice', 'snow'],
                ['pillow', 'sandal'],
                ['chair', 'sofa'],
              ],
            },
            master: {
              sentenceEn: 'My grandma makes tomato soup and some fresh pancakes.',
              sentenceHe: 'סבתא שלי מכינה מרק עגבניות וכמה פנקייקים טריים.',
              decoys: ['any', 'pancake'],
              voiceEn: 'I do not have any more honey.',
              voiceHe: 'אין לי עוד דבש.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Are there any eggs in the bowl?',
                wrong: ['Is there any eggs in the bowl?', 'Are there some eggs in the bowl?', 'Are there any egg in the bowl?'],
                explainHe: 'eggs הם רבים ולכן Are there, בשאלה אומרים any, ושם העצם מקבל s.',
                hintEn: 'Check the verb be, some or any, and the noun.',
              },
              story: {
                passageEn: 'Today the cooking club has a hot soup contest. Omer adds a lot of salt because he thinks it makes the soup better. The judges taste it and quickly drink a glass of water. Omer tastes it too and laughs. Next time he will use only a little salt.',
                passageHe: '',
                questionEn: 'Why do the judges drink water?',
                questionHe: '',
                correct: 'The soup tastes too salty.',
                wrong: ['The soup is much too cold.', 'The soup has no taste at all.', 'They are ready for more soup.'],
              },
              storyHintEn: 'What does Omer add to the soup?',
            },
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', UNITS);
