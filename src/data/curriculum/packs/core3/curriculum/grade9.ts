import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 9 unit (Band II): a topic unit about identity that recycles the grade's
 * relative clauses (who / which / that / where), with Band II words the app never taught or only
 * showed; its Boss mixes in Band II review. Example Hebrew addresses the learner in the plural;
 * hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_3: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Identity',
  titleHe: 'זהות',
  subtitleHe: 'עונה 3: מה הופך אותנו למי שאנחנו? מתארים אנשים, דברים ומקומות עם who, which, that ו-where',
  badgeEmoji: '🪪',
  missions: [
    {
      icon: '🧬',
      titleEn: 'The Person Who I Am',
      titleHe: 'האדם שאני',
      storyHookHe:
        'כל אחד מאיתנו מיוחד. נכין כרטיס זהות אישי ונתאר אנשים עם who ו-that: a teenager who loves music.',
      grammarTopic: 'Relative clauses review: who / that for people',
      skills: ['Relative Clauses (who / that)', 'Describing People', 'Personal Details'],
      sentenceEn: 'My cousin is a shy teenager who loves drawing and music.',
      sentenceHe: 'בן הדוד שלי הוא נער ביישן שאוהב ציור ומוזיקה.',
      vocab: [
        ['nationality', 'noun', 'לאום / אזרחות', '🛂', 'People who live in Israel can have more than one nationality.', 'לאנשים שגרים בישראל יכולה להיות יותר מאזרחות אחת.'],
        ['date of birth', 'noun', 'תאריך לידה', '🎂', 'The girl who sits next to me has the same date of birth as me.', 'לילדה שיושבת לידי יש אותו תאריך לידה כמו שלי.'],
        ['personal', 'adjective', 'אישי', '🔐', 'A diary is a personal book that you do not show to anyone.', 'יומן הוא ספר אישי שלא מראים לאף אחד.'],
        ['likes and dislikes', 'noun', 'מה שאוהבים ומה שלא אוהבים', '👍', 'On the first day, we wrote about our likes and dislikes.', 'ביום הראשון כתבנו על מה שאנחנו אוהבים ומה שאנחנו לא אוהבים.'],
        ['teenager', 'noun', 'נער / נערה (בגיל ההתבגרות)', '🧑', 'My brother is a teenager who spends hours on his phone.', 'אחי הוא נער שמבלה שעות בטלפון שלו.'],
        ['shy', 'adjective', 'ביישן / ביישנית', '🙈', 'Shira is a shy girl who speaks very quietly.', 'שירה היא ילדה ביישנית שמדברת בשקט רב.'],
        ['similar', 'adjective', 'דומה', '👯', 'My sister and I look similar, but we are very different people.', 'אחותי ואני נראות דומות, אבל אנחנו אנשים שונים מאוד.'],
        ['selfie', 'noun', 'סלפי', '🤳', 'This is a selfie that I took on my birthday.', 'זה סלפי שצילמתי ביום ההולדת שלי.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'bulldozer', translationHe: 'דחפור' },
          { wordEn: 'sneeze', translationHe: 'עיטוש' },
        ],
        shortSentenceEn: 'She is a girl who loves art.',
        shortSentenceHe: 'היא ילדה שאוהבת אמנות.',
        rule: {
          questionEn: 'Complete: "The boy ____ sits next to me is very shy."',
          correct: 'who',
          wrong: ['which', 'where'],
          explainHe: 'מדברים על אדם (the boy), ולכן who. which בא עם דברים ובעלי חיים, ו-where עם מקומות.',
          hintHe: 'על מה מדבר החלק הזה של המשפט: על אדם, על דבר או על מקום?',
        },
        story: {
          passageEn:
            'On the first day of school, our new teacher gave us a personal card. We wrote our date of birth, our likes and dislikes and one thing that makes us special. I sat next to a shy boy who wrote very slowly. Later, I saw that we have the same birthday and similar hobbies. Now he is a friend who knows all my secrets.',
          passageHe:
            'ביום הראשון ללימודים, המורה החדשה שלנו נתנה לנו כרטיס אישי. כתבנו את תאריך הלידה שלנו, מה שאנחנו אוהבים ומה שלא, ודבר אחד שהופך אותנו למיוחדים. ישבתי ליד ילד ביישן שכתב לאט מאוד. אחר כך ראיתי שיש לנו אותו יום הולדת ותחביבים דומים. היום הוא חבר שיודע את כל הסודות שלי.',
          questionEn: 'What do the two children have in common?',
          questionHe: 'מה משותף לשני הילדים?',
          correct: 'The same birthday.',
          wrong: ['The same teacher at home.', 'The same family name.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'I have a friend who lives in Haifa.',
              wrong: ['I have a friend which lives in Haifa.'],
              explainHe: 'friend הוא אדם, ולכן who.',
              hintHe: 'האם friend הוא אדם או דבר?',
            },
            story: {
              passageEn: 'Tal is a teenager who loves music. He plays the guitar. His sister is shy.',
              passageHe: 'טל הוא נער שאוהב מוזיקה. הוא מנגן בגיטרה. אחותו ביישנית.',
              questionEn: 'What does Tal play?',
              questionHe: 'במה טל מנגן?',
              correct: 'The guitar.',
              wrong: ['The piano.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['thunder', 'sunrise'],
              ['traffic light', 'thunderstorm'],
              ['hungry', 'loud'],
              ['fall asleep', 'very quickly'],
              ['sandwich', 'cloud'],
              ['wooden', 'rainy'],
              ['hundred', 'because'],
              ['thunder', 'headache'],
            ],
          },
          master: {
            sentenceEn: 'The selfie that I posted yesterday shows the town where my grandparents were born.',
            sentenceHe: 'הסלפי שהעליתי אתמול מראה את העיירה שבה נולדו סבא וסבתא שלי.',
            decoys: ['who', 'which'],
            voiceEn: 'My grandmother is a woman who never stops learning.',
            voiceHe: 'סבתא שלי היא אישה שאף פעם לא מפסיקה ללמוד.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The teenager who won the prize is my neighbor.',
              wrong: [
                'The teenager which won the prize is my neighbor.',
                'The teenager who he won the prize is my neighbor.',
                'The teenager who won the prize he is my neighbor.',
              ],
              explainHe: 'teenager הוא אדם, ולכן who. אחרי who לא חוזרים על he, כי who כבר מחליף אותו.',
              hintEn: 'Check the relative word and any extra pronouns.',
            },
            story: {
              passageEn:
                "Maya was born in Ethiopia and moved to Israel when she was ten. At first, she felt like two different people: the girl who spoke Amharic at home and the shy student who said nothing in class. Then a teacher asked her to tell the class about the city where she was born. Maya brought photos and her grandmother's injera. Her classmates asked many questions, and for the first time she felt that both parts of her were welcome.",
              passageHe: '',
              questionEn: 'How did Maya feel at the end?',
              questionHe: '',
              correct: 'Accepted for who she is.',
              wrong: ['Sorry that she moved to Israel.', "Shy about her grandmother's food.", 'Angry with her classmates.'],
            },
            storyHintEn: 'How did her classmates react to her story?',
          },
        },
      },
    },
    {
      icon: '🏘️',
      titleEn: 'Places That Feel Like Home',
      titleHe: 'מקומות שמרגישים כמו בית',
      storyHookHe:
        'זהות היא גם המקום, השפה והמסורת שלנו. נתאר דברים ומקומות עם which, that ו-where: the town where my family lives.',
      grammarTopic: 'Relative clauses review: which / that / where for things and places',
      skills: ['Relative Clauses (which / that / where)', 'Community & Culture', 'Belonging'],
      sentenceEn: 'Jaffa is a city where people of every religion feel at home.',
      sentenceHe: 'יפו היא עיר שבה אנשים מכל דת מרגישים בבית.',
      vocab: [
        ['religion', 'noun', 'דת', '🕊️', 'In Jerusalem, there are holy places of more than one religion.', 'בירושלים יש מקומות קדושים של יותר מדת אחת.'],
        ['feel at home', 'phrase', 'להרגיש בבית', '🏠', 'Our neighbors are so kind that we feel at home here.', 'השכנים שלנו כל כך נחמדים שאנחנו מרגישים כאן בבית.'],
        ['originally', 'adverb', 'במקור', '🌱', 'My grandparents are originally from Morocco.', 'סבא וסבתא שלי הם במקור ממרוקו.'],
        ['accept', 'verb', 'לקבל (אנשים או רעיון)', '🤝', 'A good team accepts players who are different.', 'קבוצה טובה מקבלת שחקנים שהם שונים.'],
        ['keep in touch', 'phrase', 'לשמור על קשר', '📞', 'We moved to Eilat, but we keep in touch with our old friends.', 'עברנו לאילת, אבל אנחנו שומרים על קשר עם החברים הישנים שלנו.'],
        ['society', 'noun', 'חברה (ציבור)', '👥', 'Israeli society is made up of people who came from many countries.', 'החברה הישראלית מורכבת מאנשים שהגיעו מהרבה ארצות.'],
        ['nowadays', 'adverb', 'בימינו', '📱', 'Nowadays, many families speak two languages at home.', 'בימינו, הרבה משפחות מדברות שתי שפות בבית.'],
        ['in general', 'phrase', 'באופן כללי', '🌐', 'In general, people who travel a lot learn languages easily.', 'באופן כללי, אנשים שמטיילים הרבה לומדים שפות בקלות.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'lawnmower', translationHe: 'מכסחת דשא' },
          { wordEn: 'chimney', translationHe: 'ארובה' },
        ],
        shortSentenceEn: 'This is the town where we live.',
        shortSentenceHe: 'זו העיירה שבה אנחנו גרים.',
        rule: {
          questionEn: 'Complete: "Hanukkah is a holiday ____ is celebrated with candles."',
          correct: 'which',
          wrong: ['who', 'where'],
          explainHe: 'מדברים על דבר (a holiday), ולכן which (או that). who בא עם אנשים, ו-where עם מקומות.',
          hintHe: 'האם החלק הזה מתאר אדם, דבר או מקום?',
        },
        story: {
          passageEn:
            'My family is originally from Iraq, but I was born in Ramat Gan. At home, my grandmother still cooks the food that she ate as a child, and she tells stories about the city where she grew up. Nowadays, we live in a neighborhood where people come from many countries. In general, we feel at home here, and we keep in touch with our cousins in London on video calls.',
          passageHe:
            'המשפחה שלי היא במקור מעיראק, אבל אני נולדתי ברמת גן. בבית, סבתא שלי עדיין מבשלת את האוכל שהיא אכלה בילדותה, ומספרת סיפורים על העיר שבה היא גדלה. בימינו אנחנו גרים בשכונה שבה אנשים באים מהרבה ארצות. באופן כללי אנחנו מרגישים כאן בבית, ואנחנו שומרים על קשר עם בני הדודים שלנו בלונדון בשיחות וידאו.',
          questionEn: 'Where do the cousins live?',
          questionHe: 'איפה גרים בני הדודים?',
          correct: 'In London.',
          wrong: ['In Ramat Gan.', 'In a city in Iraq.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'This is the book that I love.',
              wrong: ['This is the book who I love.'],
              explainHe: 'book הוא דבר, ולכן that (או which), לא who.',
              hintHe: 'האם book הוא אדם או דבר?',
            },
            story: {
              passageEn: 'Ben lives in a small town. It is a town where everyone knows him. He feels at home there.',
              passageHe: 'בן גר בעיירה קטנה. זו עיירה שבה כולם מכירים אותו. הוא מרגיש שם בבית.',
              questionEn: 'Where does Ben live?',
              questionHe: 'איפה בן גר?',
              correct: 'In a small town.',
              wrong: ['In a big city.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pillow', 'headache'],
              ['get rid of', 'look forward to'],
              ['loudly', 'tomorrow'],
              ['sleep', 'arrive'],
              ['very much', 'next door'],
              ['weather', 'breakfast'],
              ['last year', 'long ago'],
              ['last night', 'next week'],
            ],
          },
          master: {
            sentenceEn: 'Nowadays, many teenagers keep in touch with relatives who live abroad.',
            sentenceHe: 'בימינו, הרבה בני נוער שומרים על קשר עם קרובי משפחה שגרים בחו״ל.',
            decoys: ['which', 'where'],
            voiceEn: 'This is the village where my father grew up.',
            voiceHe: 'זה הכפר שבו אבא שלי גדל.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The song that we sing on Friday nights is very old.',
              wrong: [
                'The song who we sing on Friday nights is very old.',
                'The song that we sing it on Friday nights is very old.',
                'The song where we sing on Friday nights is very old.',
              ],
              explainHe: 'song הוא דבר, ולכן that או which. אחרי that לא חוזרים על it, כי that כבר מחליף אותו.',
              hintEn: 'Check the relative word and any extra words.',
            },
            story: {
              passageEn:
                'Every summer, Daniel spends a month with his grandparents on a moshav in the Galilee. In Tel Aviv, he is just another student, but on the moshav everyone knows the family and says hello to him by name. His grandfather teaches him songs that only the old people still remember. Daniel always thought these visits were boring. This year, he recorded his grandfather singing and shared the songs with his class, and he realized how much the moshav is part of him.',
              passageHe: '',
              questionEn: 'What changed for Daniel this year?',
              questionHe: '',
              correct: 'He saw the moshav as part of him.',
              wrong: ['He moved to the moshav for good.', 'He stopped visiting his grandparents.', 'He learned to sing in a choir.'],
            },
            storyHintEn: 'Compare what Daniel thought before and this year.',
          },
        },
      },
    },
    {
      icon: '🧭',
      isBoss: true,
      titleEn: 'Boss: My Identity Project',
      titleHe: 'אתגר הבוס: פרויקט הזהות שלי',
      storyHookHe:
        'הגיע הזמן להציג את פרויקט הזהות! הראו שאתם יודעים לתאר אנשים, דברים ומקומות עם who, which, that ו-where, ולהביע דעה.',
      grammarTopic: 'Unit Boss: Relative Clauses & Band II Review',
      skills: ['Boss Review', 'Relative Clauses', 'Giving Opinions'],
      sentenceEn: 'In my opinion, happiness is something that money cannot buy.',
      sentenceHe: 'לדעתי, אושר הוא משהו שכסף לא יכול לקנות.',
      vocab: [
        ['opinion', 'noun', 'דעה', '💬', 'In my opinion, everyone should learn a second language.', 'לדעתי, כל אחד צריך ללמוד שפה שנייה.'],
        ['private', 'adjective', 'פרטי', '🔒', "My diary is private, so please don't read it.", 'היומן שלי פרטי, אז בבקשה אל תקראו בו.'],
        ['happiness', 'noun', 'אושר', '😊', 'For my grandfather, happiness is a big family dinner.', 'בשביל סבא שלי, אושר הוא ארוחת ערב משפחתית גדולה.'],
        ['reality', 'noun', 'מציאות', '🌍', 'Online, people look perfect, but reality is different.', 'ברשת אנשים נראים מושלמים, אבל המציאות שונה.'],
        ['expectation', 'noun', 'ציפייה', '🎯', 'My parents have high expectations of me.', 'להורים שלי יש ציפיות גבוהות ממני.'],
        ['persuade', 'verb', 'לשכנע', '🗣️', 'My friend persuaded me to join the drama club.', 'החבר שלי שכנע אותי להצטרף לחוג הדרמה.'],
        ['human', 'noun', 'בן אדם / אנושי', '🧑', 'Every human needs friends who understand them.', 'כל בן אדם צריך חברים שמבינים אותו.'],
        ['to be honest', 'phrase', 'למען האמת', '😅', 'To be honest, the test was easier than we expected.', 'למען האמת, המבחן היה קל יותר ממה שציפינו.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'tractor', translationHe: 'טרקטור' },
          { wordEn: 'stapler', translationHe: 'שדכן' },
        ],
        shortSentenceEn: 'This is my opinion.',
        shortSentenceHe: 'זו הדעה שלי.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'The people who live next door are originally from Brazil.',
          wrong: [
            'The people which live next door are originally from Brazil.',
            'The people who lives next door are originally from Brazil.',
          ],
          explainHe: 'people הם אנשים, ולכן who. people הם רבים, ולכן הפועל אחרי who בלי s.',
          hintHe: 'בדקו את מילת הזיקה ואת הפועל שאחריה: על כמה אנשים מדברים?',
        },
        story: {
          passageEn:
            'For the identity project, Noam interviewed his grandmother, who came to Israel from Argentina in 1975. She told him about the expectations that she had and about the reality that she found. Life was hard at first, but in her opinion it was the right choice. To be honest, Noam did not want to do the project, but now he says it was the most interesting homework that he has ever done.',
          passageHe:
            'לפרויקט הזהות, נועם ראיין את סבתא שלו, שעלתה לישראל מארגנטינה ב-1975. היא סיפרה לו על הציפיות שהיו לה ועל המציאות שמצאה. בהתחלה החיים היו קשים, אבל לדעתה זו הייתה הבחירה הנכונה. למען האמת, נועם לא רצה לעשות את הפרויקט, אבל עכשיו הוא אומר שאלה שיעורי הבית הכי מעניינים שהוא עשה אי פעם.',
          questionEn: "Where did Noam's grandmother come from?",
          questionHe: 'מאיפה הגיעה הסבתא של נועם?',
          correct: 'Argentina.',
          wrong: ['Brazil.', 'Spain.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'He has a phone that takes great selfies.',
              wrong: ['He has a phone who takes great selfies.'],
              explainHe: 'phone הוא דבר, ולכן that, לא who.',
              hintHe: 'האם phone הוא אדם או דבר?',
            },
            story: {
              passageEn: 'Rona has a private diary. She writes about her day. Her brother wants to read it. She says no!',
              passageHe: 'לרונה יש יומן פרטי. היא כותבת על היום שלה. אחיה רוצה לקרוא בו. היא אומרת לא!',
              questionEn: 'Who wants to read the diary?',
              questionHe: 'מי רוצה לקרוא ביומן?',
              correct: 'Her brother.',
              wrong: ['Her mother.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['sneeze', 'umbrella'],
              ['delicious', 'rainy'],
              ['traffic', 'thunder'],
              ['breakfast', 'spaghetti'],
              ['ceiling', 'mountain'],
              ['arrive', 'disappear'],
              ['table', 'rock'],
              ['good night', 'happy birthday'],
            ],
          },
          master: {
            sentenceEn: 'To be honest, the friends who know me best are the ones that I met at camp.',
            sentenceHe: 'למען האמת, החברים שמכירים אותי הכי טוב הם אלה שפגשתי במחנה.',
            decoys: ['which', 'whose'],
            voiceEn: 'In my opinion, every human is special.',
            voiceHe: 'לדעתי, כל בן אדם מיוחד.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The photos that I keep on my phone are private.',
              wrong: [
                'The photos who I keep on my phone are private.',
                'The photos that I keep them on my phone are private.',
                'The photos that I keep on my phone is private.',
              ],
              explainHe: 'photos הן דברים, ולכן that. אחרי that לא חוזרים על them. photos הן ברבים, ולכן are.',
              hintEn: 'Check the relative word, extra pronouns and is / are.',
            },
            story: {
              passageEn:
                'Shira has thousands of followers who watch her videos every day. In her videos, her life looks perfect: beautiful clothes, delicious food and a room that is always clean. One evening, she posted a different video. She showed her messy room and talked about the pressure that she feels to look happy all the time. Some followers left, but hundreds of teenagers wrote to thank her. "To be honest," one girl wrote, "this is the first video of yours that made me feel better about myself."',
              passageHe: '',
              questionEn: 'Why did many teenagers thank Shira?',
              questionHe: '',
              correct: 'She showed them her real life.',
              wrong: ['She gave them free clothes.', 'She cleaned her room in the video.', 'She stopped posting videos for good.'],
            },
            storyHintEn: 'What was different about the new video?',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 9 unit (`../../registry.ts`) */
export const CORE_3_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', [UNIT_CORE_3]);
