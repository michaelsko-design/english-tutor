import { buildElementaryGrade } from './builder';

/**
 * Grade 6 — Band I (Foundation) completion and bridge to Band II: Present Simple review,
 * Present Progressive intro, was/were and common past verbs, comparatives, Wh-questions,
 * digital vocabulary, school subjects and holidays. 4 units × 3 missions (the 3rd mission
 * of each unit is a Boss review). Hebrew copy is gender-neutral (slash forms / plural).
 */
export const grade6Curriculum = buildElementaryGrade('grade-6', [
  {
    titleEn: 'Unit 1: After-School Creators Club',
    titleHe: 'פרק 1: מועדון היוצרים אחרי בית הספר',
    subtitleHe: 'Present Simple, תחביבים, שעות וימים בשבוע',
    badgeEmoji: '🎨',
    missions: [
      {
        icon: '🎶',
        titleEn: 'Our Weekly Hobby Club',
        titleHe: 'מועדון התחביבים השבועי שלנו',
        storyHookHe: 'מה אתם אוהבים לעשות אחרי הלימודים? נלמד לספר על תחביבים, נגינה ופעילויות!',
        grammarTopic: 'Present Simple & Hobbies',
        skills: ['Present Simple', 'Hobbies Vocab', 'Voice Practice'],
        sentenceEn: 'We usually paint and listen to music on Tuesdays.',
        sentenceHe: 'אנחנו בדרך כלל מציירים ומאזינים למוזיקה בימי שלישי.',
        vocab: [
          ['instrument', 'noun', 'כלי נגינה', '🎸', 'Do you play a musical instrument?', 'האם אתם מנגנים בכלי נגינה?'],
          ['together', 'adverb', 'ביחד', '🤝', 'We walk home together every day.', 'אנחנו הולכים הביתה ביחד כל יום.'],
          ['practice', 'verb / noun', 'להתאמן / תרגול', '🔁', 'Practice makes progress in English.', 'תרגול מוביל להתקדמות באנגלית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sandwich', translationHe: 'כריך' },
            { wordEn: 'window', translationHe: 'חלון' },
          ],
          shortSentenceEn: 'We practice together.',
          shortSentenceHe: 'אנחנו מתאמנים ביחד.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'My sister plays the guitar.',
            wrong: ['My sister play the guitar.', 'My sister playing the guitar.'],
            explainHe: 'ב-Present Simple עם he / she / it (גוף שלישי יחיד) מוסיפים s לפועל: My sister plays.',
            hintHe: 'my sister היא she. איזו סיומת מקבל הפועל ב-Present Simple עם she?',
          },
          story: {
            passageEn:
              'Dana goes to the hobby club on Tuesdays. She plays the guitar with her friends. They practice together for one hour. Then they eat fruit and talk.',
            passageHe:
              'דנה הולכת למועדון התחביבים בימי שלישי. היא מנגנת בגיטרה עם החברים שלה. הם מתאמנים ביחד במשך שעה. אחר כך הם אוכלים פירות ומשוחחים.',
            questionEn: 'What does Dana play?',
            questionHe: 'במה דנה מנגנת?',
            correct: 'the guitar',
            wrong: ['the piano', 'the drums'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'My brother plays the drums.',
                wrong: ['My brother play the drums.'],
                explainHe: 'עם he / she / it (כמו my brother) מוסיפים s לפועל: plays.',
                hintHe: 'שימו לב לסוף הפועל אחרי my brother.',
              },
              story: {
                passageEn: 'Ben has a violin. He plays it after school. He likes the music.',
                passageHe: 'לבן יש כינור. הוא מנגן בו אחרי בית הספר. הוא אוהב את המוזיקה.',
                questionEn: 'What does Ben play?',
                questionHe: 'במה בן מנגן?',
                correct: 'a violin',
                wrong: ['a piano'],
              },
            },
            challenger: {
              clozeWrong: [
                ['teacher', 'balloon'],
                ['never', 'yesterday'],
                ['breakfast', 'weather'],
              ],
            },
            master: {
              sentenceEn: 'My sister practices the violin with her friends every Thursday.',
              sentenceHe: 'אחותי מתאמנת בכינור עם החברות שלה בכל יום חמישי.',
              decoys: ['practice', 'their'],
              voiceEn: 'We play music together after school.',
              voiceHe: 'אנחנו מנגנים מוזיקה ביחד אחרי בית הספר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Our teacher plays the piano every day.',
                wrong: [
                  'Our teacher play the piano every day.',
                  'Our teacher plays every day the piano.',
                  'Our teacher is plays the piano every day.',
                ],
                explainHe: 
                  'עם our teacher (he / she) מוסיפים s לפועל ולא משתמשים ב-is. גם הסדר חשוב: פועל, מה מנגנים, ורק בסוף מתי.',
                hintEn: 'Check the verb after teacher and the word order.',
              },
              story: {
                passageEn: 
                  'Dana is late for the club today. Usually she arrives at four, but this time the bus is stuck in traffic. Her friends are already tuning their guitars and the teacher keeps looking at the door. Suddenly Dana runs in with her guitar and a big smile.',
                passageHe: '',
                questionEn: 'Why does the teacher keep looking at the door?',
                questionHe: '',
                correct: 'She is waiting for Dana to come.',
                wrong: [
                  'She wants the lesson to end.',
                  'She is looking for a lost guitar.',
                  'She is angry at the friends.',
                ],
              },
              storyHintEn: 'Who is missing from the club?',
            },
          },
        },
      },
      {
        icon: '♟️',
        titleEn: 'Do You Like Chess?',
        titleHe: 'האם אתם אוהבים שחמט?',
        storyHookHe: 'במועדון יש משחקים, ציור ומוזיקה. בואו נשאל שאלות על תחביבים עם Do ו-Does!',
        grammarTopic: 'Do / Does Questions',
        skills: ['Do / Does', 'Hobby Questions', 'Club Vocabulary'],
        sentenceEn: 'Does your brother play chess at the club?',
        sentenceHe: 'האם אחיך משחק שחמט במועדון?',
        vocab: [
          ['chess', 'noun', 'שחמט', '♟️', 'My grandfather teaches me chess.', 'סבא שלי מלמד אותי שחמט.'],
          ['hobby', 'noun', 'תחביב', '🎯', 'Drawing is my favorite hobby.', 'ציור הוא התחביב האהוב עליי.'],
          ['club', 'noun', 'חוג / מועדון', '👥', 'The art club starts at four.', 'חוג האמנות מתחיל בארבע.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ladder', translationHe: 'סולם' },
            { wordEn: 'envelope', translationHe: 'מעטפה' },
          ],
          shortSentenceEn: 'Do you play chess?',
          shortSentenceHe: 'האם אתם משחקים שחמט?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Does he play chess?',
            wrong: ['Do he play chess?', 'Does he plays chess?'],
            explainHe: 'עם he / she / it שואלים עם Does, ואחרי Does הפועל חוזר לצורתו הבסיסית בלי s: Does he play?',
            hintHe: 'עם he שואלים עם פועל העזר של גוף שלישי, ואחריו הפועל בלי סיומת.',
          },
          story: {
            passageEn:
              'Omer has a new hobby. He plays chess at the club on Mondays. He does not play on Fridays. Omer likes the club and his friends.',
            passageHe:
              'לעומר יש תחביב חדש. הוא משחק שחמט במועדון בימי שני. הוא לא משחק בימי שישי. עומר אוהב את המועדון ואת החברים שלו.',
            questionEn: 'When does Omer play chess?',
            questionHe: 'מתי עומר משחק שחמט?',
            correct: 'on Mondays',
            wrong: ['on Fridays', 'on Sundays'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which question is right?',
                correct: 'Does she like art?',
                wrong: ['Do she like art?'],
                explainHe: 'עם she שואלים עם Does.',
                hintHe: 'שימו לב: she הוא גוף שלישי יחיד.',
              },
              story: {
                passageEn: 'Ron likes chess. He plays with his dad. They play on Friday.',
                passageHe: 'רון אוהב שחמט. הוא משחק עם אבא שלו. הם משחקים ביום שישי.',
                questionEn: 'Who does Ron play with?',
                questionHe: 'עם מי רון משחק?',
                correct: 'his dad',
                wrong: ['his sister'],
              },
            },
            challenger: {
              clozeWrong: [
                ['window', 'banana'],
                ['doctor', 'ladder'],
                ['pocket', 'spoon'],
              ],
            },
            master: {
              sentenceEn: 'My uncle does not play chess on Sundays.',
              sentenceHe: 'הדוד שלי לא משחק שחמט בימי ראשון.',
              decoys: ['do', 'plays'],
              voiceEn: 'I like the chess club.',
              voiceHe: 'אני אוהב/ת את מועדון השחמט.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Does your friend like the club?',
                wrong: [
                  'Do your friend like the club?',
                  'Does your friend likes the club?',
                  'Does like your friend the club?',
                ],
                explainHe: 
                  'עם your friend (he / she) שואלים עם Does, והפועל אחריו בלי s. הסדר: Does + נושא + פועל.',
                hintEn: 'Look at the first word and the verb ending.',
              },
              story: {
                passageEn: 
                  'Omer wants to join a new club, but he is shy. His friend Lior goes to a chess club on Mondays. Omer asks if the club has many children. Lior says there are only six, so everyone knows everyone. Omer decides to visit next Monday.',
                passageHe: '',
                questionEn: 'Why does Omer decide to visit the club?',
                questionHe: '',
                correct: 'He learns that the club is small and friendly.',
                wrong: [
                  'He wants to meet a teacher on Wednesday.',
                  'He already plays chess very well.',
                  'Lior says the club is closed on Mondays and Fridays.',
                ],
              },
              storyHintEn: 'How does Omer feel before he asks?',
            },
          },
        },
      },
      {
        icon: '🗓️',
        isBoss: true,
        titleEn: 'Boss: Club Week Review',
        titleHe: 'אתגר הבוס: שבוע במועדון',
        storyHookHe: 'המועדון עמוס השבוע! הראו שאתם יודעים לתכנן שבוע שלם עם Present Simple, ימים ושעות.',
        grammarTopic: 'Present Simple Review & Time Prepositions',
        skills: ['Present Simple Review', 'Days & Times', 'Reading'],
        sentenceEn: 'We usually check the calendar before the club starts.',
        sentenceHe: 'אנחנו בדרך כלל בודקים את לוח השנה לפני שהחוג מתחיל.',
        vocab: [
          ['calendar', 'noun', 'לוח שנה', '🗓️', 'The calendar is on the wall.', 'לוח השנה תלוי על הקיר.'],
          ['usually', 'adverb', 'בדרך כלל', '🔁', 'We usually eat lunch at noon.', 'אנחנו בדרך כלל אוכלים ארוחת צהריים בצהריים.'],
          ['sometimes', 'adverb', 'לפעמים', '🌤️', 'Sometimes I read before bed.', 'לפעמים אני קורא/ת לפני השינה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bottle', translationHe: 'בקבוק' },
            { wordEn: 'jacket', translationHe: 'מעיל' },
          ],
          shortSentenceEn: 'I check the calendar.',
          shortSentenceHe: 'אני בודק/ת את לוח השנה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She usually walks to the club.',
            wrong: ['She walks usually to the club.', 'She usually walk to the club.'],
            explainHe: 'מילות תדירות כמו usually באות לפני הפועל הראשי, ועם she הפועל מקבל s: She usually walks.',
            hintHe: 'מילת תדירות (usually) באה לפני הפועל הראשי, ועם she הפועל מקבל סיומת.',
          },
          story: {
            passageEn:
              'Noa looks at the calendar every Sunday. On Monday she usually paints at the club. On Tuesday she sometimes plays chess. On Wednesday she swims with her team. Noa loves her busy week.',
            passageHe:
              'נועה מסתכלת בלוח השנה בכל יום ראשון. ביום שני היא בדרך כלל מציירת במועדון. ביום שלישי היא לפעמים משחקת שחמט. ביום רביעי היא שוחה עם הקבוצה שלה. נועה אוהבת את השבוע העמוס שלה.',
            questionEn: 'What does Noa usually do on Monday?',
            questionHe: 'מה נועה בדרך כלל עושה ביום שני?',
            correct: 'She paints at the club.',
            wrong: ['She swims with her team.', 'She plays chess.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'He usually walks to school.',
                wrong: ['He walks usually to school.'],
                explainHe: 'מילת תדירות כמו usually באה לפני הפועל הראשי.',
                hintHe: 'שימו לב איפה עומדת המילה usually.',
              },
              story: {
                passageEn: 'Mia has a calendar. It is on her wall. On Sunday she paints.',
                passageHe: 'למיה יש לוח שנה. הוא תלוי על הקיר שלה. ביום ראשון היא מציירת.',
                questionEn: 'Where is the calendar?',
                questionHe: 'איפה לוח השנה?',
                correct: 'on the wall',
                wrong: ['in the bag'],
              },
            },
            challenger: {
              clozeWrong: [
                ['teacher', 'sandwich'],
                ['yesterday', 'tomorrow'],
                ['under', 'bigger'],
              ],
            },
            master: {
              sentenceEn: 'On Fridays my brother sometimes checks the calendar before dinner.',
              sentenceHe: 'בימי שישי אחי לפעמים בודק את לוח השנה לפני ארוחת הערב.',
              decoys: ['check', 'sometime'],
              voiceEn: 'She usually plays chess on Tuesdays.',
              voiceHe: 'היא בדרך כלל משחקת שחמט בימי שלישי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'My brother usually walks to the club.',
                wrong: [
                  'My brother walks usually to the club.',
                  'My brother usually walk to the club.',
                  'My brother usually is walks to the club.',
                ],
                explainHe: 'מילת תדירות כמו usually באה לפני הפועל הראשי, ועם he הפועל מקבל s בלי is.',
                hintEn: 'Check where usually stands and the verb ending.',
              },
              story: {
                passageEn: 
                  'Every Sunday Noa writes her week in the calendar. This week there is a problem: the chess game and the swimming lesson are both on Wednesday at four. Noa cannot go to both. She thinks for a minute, then she moves the chess game to Thursday. Now her week is ready.',
                passageHe: '',
                questionEn: 'Why does Noa move the chess game to Thursday?',
                questionHe: '',
                correct: 'Two activities are at the same time.',
                wrong: [
                  'She is tired of playing chess.',
                  'The swimming lesson is cancelled.',
                  'Thursday is a holiday and school is closed.',
                ],
              },
              storyHintEn: 'What happens on Wednesday at four?',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Junior High Countdown & Digital Skills',
    titleHe: 'פרק 2: ספירה לאחור לחטיבה ועולם דיגיטלי',
    subtitleHe: 'Present Progressive (am/is/are + -ing) מול Present Simple, וטכנולוגיה יומיומית',
    badgeEmoji: '💻',
    missions: [
      {
        icon: '📱',
        titleEn: 'Sending a Quick Voice Note',
        titleHe: 'שולחים הודעה קולית מהירה',
        storyHookHe:
          'מתכוננים לעלייה לחטיבת הביניים! נלמד להבדיל בין פעולה שקורית ברגע זה (now) לבין שגרה קבועה.',
        grammarTopic: 'Present Simple vs. Present Progressive Intro',
        skills: ['Simple vs. Progressive', 'Digital Vocab', 'Voice Messaging'],
        sentenceEn: 'Right now, Dan is recording a fun video for his classmates.',
        sentenceHe: 'ברגע זה, דן מקליט סרטון מהנה לחבריו לכיתה.',
        vocab: [
          ['message', 'noun', 'הודעה', '💬', 'Did you receive my voice message?', 'האם קיבלתם את ההודעה הקולית שלי?'],
          ['record', 'verb', 'להקליט', '🎙️', 'We record English stories for school.', 'אנחנו מקליטים סיפורים באנגלית לבית הספר.'],
          ['prepare', 'verb', 'להתכונן / להכין', '🎒', 'The students prepare for middle school.', 'התלמידים מתכוננים לחטיבת הביניים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'blanket', translationHe: 'שמיכה' },
            { wordEn: 'carrot', translationHe: 'גזר' },
          ],
          shortSentenceEn: 'Dan is recording a message.',
          shortSentenceHe: 'דן מקליט הודעה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Maya is drawing right now.',
            wrong: ['Maya draws right now.', 'Maya drawing right now.'],
            explainHe:
              'כשהפעולה קורית ברגע זה (right now) משתמשים ב-am / is / are + פועל עם ing: Maya is drawing.',
            hintHe: 'right now זה ממש עכשיו. לפעולה שקורית עכשיו צריך גם צורה של be וגם פועל עם ing.',
          },
          story: {
            passageEn:
              'Dan is in his room. He usually does his homework at five. Right now he is recording a voice message. He is sending it to his friend.',
            passageHe:
              'דן נמצא בחדר שלו. הוא בדרך כלל עושה שיעורי בית בחמש. ברגע זה הוא מקליט הודעה קולית. הוא שולח אותה לחבר שלו.',
            questionEn: 'What is Dan doing right now?',
            questionHe: 'מה דן עושה ברגע זה?',
            correct: 'recording a message',
            wrong: ['doing his homework', 'riding a bike'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The boy is singing now.',
                wrong: ['The boy singing now.'],
                explainHe: 'פעולה ברגע זה צריכה צורה של be ופועל עם ing: is singing.',
                hintHe: 'שימו לב: חסרה מילה לפני הפועל עם ing.',
              },
              story: {
                passageEn: 'Dan has a phone. He is sending a message. The message is for his mom.',
                passageHe: 'לדן יש טלפון. הוא שולח הודעה. ההודעה היא לאמא שלו.',
                questionEn: 'Who is the message for?',
                questionHe: 'למי ההודעה?',
                correct: 'his mom',
                wrong: ['his teacher'],
              },
            },
            challenger: {
              clozeWrong: [
                ['bicycle', 'pencil'],
                ['wash', 'cook'],
                ['paint', 'swim'],
              ],
            },
            master: {
              sentenceEn: 'Now my cousin is recording a funny message for school.',
              sentenceHe: 'עכשיו בן דודי מקליט הודעה מצחיקה לבית הספר.',
              decoys: ['record', 'are'],
              voiceEn: 'He is sending a message to Dad.',
              voiceHe: 'הוא שולח הודעה לאבא.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'My friend is preparing a short video now.',
                wrong: [
                  'My friend preparing a short video now.',
                  'My friend is prepare a short video now.',
                  'My friend are preparing a short video now.',
                ],
                explainHe: 'ב-Present Progressive צריך צורה נכונה של be (is עם my friend) ופועל עם ing.',
                hintEn: 'Look at be and the ending of the verb.',
              },
              story: {
                passageEn: 
                  'Dan wants to send a voice message to his grandmother, who lives far away. He tries three times, but his little dog keeps barking in the background. Finally Dan closes the door of his room and tries again. This time the message is clear, and he presses send with a smile.',
                passageHe: '',
                questionEn: 'Why does Dan close the door of his room?',
                questionHe: '',
                correct: 'He wants a quiet place to record.',
                wrong: [
                  'He is afraid of his grandmother.',
                  'He wants to play with his dog.',
                  'He is tired and wants to go to sleep.',
                ],
              },
              storyHintEn: 'What does the dog do while he records?',
            },
          },
        },
      },
      {
        icon: '💻',
        titleEn: 'My Laptop and My Password',
        titleHe: 'המחשב הנייד והסיסמה שלי',
        storyHookHe: 'כולנו משתמשים במחשבים ובאתרים! נלמד לדבר על מה שקורה עכשיו מול המסך.',
        grammarTopic: 'Present Progressive & Technology Words',
        skills: ['am / is / are + -ing', 'Technology Vocab', 'Reading'],
        sentenceEn: 'My sister is using the laptop in the living room.',
        sentenceHe: 'אחותי משתמשת במחשב הנייד בסלון.',
        vocab: [
          ['laptop', 'noun', 'מחשב נייד', '💻', 'I carry my laptop in my bag.', 'אני נושא/ת את המחשב הנייד בתיק.'],
          ['password', 'noun', 'סיסמה', '🔑', 'Never share your password.', 'לעולם אל תשתפו את הסיסמה.'],
          ['website', 'noun', 'אתר אינטרנט', '🌐', 'This website has fun games.', 'באתר הזה יש משחקים כיפיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
            { wordEn: 'bicycle', translationHe: 'אופניים' },
          ],
          shortSentenceEn: 'She is using a laptop.',
          shortSentenceHe: 'היא משתמשת במחשב נייד.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'They are using the laptop now.',
            wrong: ['They using the laptop now.', 'They are use the laptop now.'],
            explainHe: 'חייבים להשתמש ב-am / is / are וגם בפועל עם ing: They are using. אי אפשר לדלג על are.',
            hintHe: 'פעולה שקורית עכשיו צריכה שני חלקים: צורה של be ופועל עם ing.',
          },
          story: {
            passageEn:
              'Tom is using a laptop in his room. He is looking for a website about space. First he types his password. Then he reads about the moon.',
            passageHe:
              'תום משתמש במחשב נייד בחדר שלו. הוא מחפש אתר על החלל. קודם הוא מקליד את הסיסמה שלו. אחר כך הוא קורא על הירח.',
            questionEn: 'What is Tom looking for?',
            questionHe: 'מה תום מחפש?',
            correct: 'a website about space',
            wrong: ['a game about animals', 'a video about sports'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'My mom is using the phone.',
                wrong: ['My mom using the phone.'],
                explainHe: 'חייבים am / is / are וגם פועל עם ing: is using.',
                hintHe: 'פעולה שקורית עכשיו צריכה שני חלקים.',
              },
              story: {
                passageEn: 'Tom has a laptop. He is on a website. The website is about cats.',
                passageHe: 'לתום יש מחשב נייד. הוא נמצא באתר. האתר הוא על חתולים.',
                questionEn: 'What is the website about?',
                questionHe: 'על מה האתר?',
                correct: 'cats',
                wrong: ['dogs'],
              },
            },
            challenger: {
              clozeWrong: [
                ['uncle', 'river'],
                ['weather', 'ceiling'],
                ['sandwich', 'shoe'],
              ],
            },
            master: {
              sentenceEn: 'My sister is typing a new password on her laptop.',
              sentenceHe: 'אחותי מקלידה סיסמה חדשה במחשב הנייד שלה.',
              decoys: ['type', 'are'],
              voiceEn: 'He is looking at a website.',
              voiceHe: 'הוא מסתכל על אתר אינטרנט.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Our teacher is opening the website now.',
                wrong: [
                  'Our teacher opening the website now.',
                  'Our teacher are opening the website now.',
                  'Our teacher is open the website now.',
                ],
                explainHe: 
                  'ב-Present Progressive משתמשים ב-am / is / are ופועל עם ing. עם our teacher אומרים is opening.',
                hintEn: 'Look at be and the verb ending.',
              },
              story: {
                passageEn: 
                  'Tom finds a great website about robots. He wants to make an account, so he needs a password. He types the name of his dog, but the website says the password is too easy. Tom smiles and adds three numbers and a capital letter. Now the website says okay.',
                passageHe: '',
                questionEn: 'Why does the website say no to the first password?',
                questionHe: '',
                correct: 'The password is too easy to guess.',
                wrong: [
                  'The password is too long.',
                  'Tom types it on the wrong website.',
                  'Tom forgets his laptop at home today.',
                ],
              },
              storyHintEn: 'What did Tom use as his first password?',
            },
          },
        },
      },
      {
        icon: '🎧',
        isBoss: true,
        titleEn: 'Boss: Digital Day Review',
        titleHe: 'אתגר הבוס: יום דיגיטלי',
        storyHookHe: 'היום כל הכיתה לומדת מהבית! שלבו בין שגרה (Present Simple) לבין מה שקורה עכשיו (Present Progressive).',
        grammarTopic: 'Present Simple vs. Present Progressive Review',
        skills: ['Simple vs. Progressive', 'Digital Vocab', 'Reading'],
        sentenceEn: 'Today the class is learning online with headphones and a screen.',
        sentenceHe: 'היום הכיתה לומדת באופן מקוון עם אוזניות ומסך.',
        vocab: [
          ['headphones', 'noun', 'אוזניות', '🎧', 'I wear headphones when I study.', 'אני שם/ה אוזניות כשאני לומד/ת.'],
          ['screen', 'noun', 'מסך', '🖥️', 'The screen is big and bright.', 'המסך גדול ובהיר.'],
          ['online', 'adverb', 'באופן מקוון / ברשת', '🌐', 'We meet our teacher online.', 'אנחנו נפגשים עם המורה ברשת.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'spoon', translationHe: 'כף' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'I wear my headphones.',
          shortSentenceHe: 'אני שם/ה את האוזניות שלי.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Every day I read, but now I am watching a video.',
            wrong: [
              'Every day I am read, but now I watch a video.',
              'Every day I reading, but now I watching a video.',
            ],
            explainHe:
              'שגרה (every day) מבטאים ב-Present Simple: I read. פעולה ברגע זה (now) מבטאים ב-am / is / are + ing: I am watching.',
            hintHe: 'every day זו שגרה (Present Simple), ו-now זה עכשיו (be + ing). כדאי לבדוק כל חלק בנפרד.',
          },
          story: {
            passageEn:
              'Today the school is closed. Yael is learning online at home. She is wearing headphones and looking at the screen. Usually she walks to school with her friends. Today she is happy to see her teacher on the screen.',
            passageHe:
              'היום בית הספר סגור. יעל לומדת מהבית באופן מקוון. היא חובשת אוזניות ומסתכלת על המסך. בדרך כלל היא הולכת לבית הספר עם החברים שלה. היום היא שמחה לראות את המורה שלה על המסך.',
            questionEn: 'How is Yael learning today?',
            questionHe: 'איך יעל לומדת היום?',
            correct: 'online at home',
            wrong: ['in the classroom', 'on a bus'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Right now she is wearing headphones.',
                wrong: ['Right now she wears headphones.'],
                explainHe: 'right now = ממש עכשיו, ולכן is wearing.',
                hintHe: 'המילים right now מראות שזה קורה עכשיו.',
              },
              story: {
                passageEn: 'It is Monday. Noam is at home. He is on a screen with his class.',
                passageHe: 'יום שני. נועם בבית. הוא מול מסך עם הכיתה שלו.',
                questionEn: 'Where is Noam?',
                questionHe: 'איפה נועם?',
                correct: 'at home',
                wrong: ['at school'],
              },
            },
            challenger: {
              clozeWrong: [
                ['mountains', 'homework'],
                ['Tuesday', 'hunger'],
                ['purple', 'banana'],
              ],
            },
            master: {
              sentenceEn: 'Dana usually walks to school but today she is online.',
              sentenceHe: 'דנה בדרך כלל הולכת לבית הספר אבל היום היא ברשת.',
              decoys: ['walk', 'are'],
              voiceEn: 'My brother wears headphones every night.',
              voiceHe: 'אחי חובש אוזניות בכל לילה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Every day I read, but now I am writing.',
                wrong: [
                  'Every day I am read, but now I writing.',
                  'Every day I reading, but now I am write.',
                  'Every day I read, but now I write.',
                ],
                explainHe: 'שגרה (every day) = Present Simple, ופעולה ברגע זה (now) = am / is / are + ing.',
                hintEn: 'Match every day and now with the right tense.',
              },
              story: {
                passageEn: 
                  'Yael is online with her class. Her little brother is playing loudly in the next room, so she cannot hear the teacher. Yael puts on her headphones and turns up the sound. A minute later she writes in the chat that now it is much better.',
                passageHe: '',
                questionEn: 'Why does Yael put on her headphones?',
                questionHe: '',
                correct: 'She cannot hear the teacher well.',
                wrong: [
                  'She wants to listen to music.',
                  'Her brother asks her to.',
                  'The screen is too bright for her eyes.',
                ],
              },
              storyHintEn: 'Who is making a noise?',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Last Weekend & Holiday Memories',
    titleHe: 'פרק 3: סוף השבוע שעבר וזיכרונות מהחגים',
    subtitleHe: 'was / were, פעלים נפוצים בעבר, חגים וטיולים',
    badgeEmoji: '🎆',
    missions: [
      {
        icon: '🏖️',
        titleEn: 'Where Were You Last Weekend?',
        titleHe: 'איפה הייתם בסוף השבוע שעבר?',
        storyHookHe: 'מכונת הזמן יוצאת לדרך! נספר איפה היינו אתמול ובסוף השבוע שעבר עם was ו-were.',
        grammarTopic: 'Past Simple of "to be": was / were',
        skills: ['was / were', 'Past Time Words', 'Voice Practice'],
        sentenceEn: 'Last weekend we were at the beach with my cousins.',
        sentenceHe: 'בסוף השבוע שעבר היינו בחוף הים עם בני הדודים שלי.',
        vocab: [
          ['beach', 'noun', 'חוף ים', '🏖️', 'The beach is hot in summer.', 'חוף הים חם בקיץ.'],
          ['yesterday', 'adverb', 'אתמול', '📅', 'Yesterday was a sunny day.', 'אתמול היה יום שמשי.'],
          ['weekend', 'noun', 'סוף שבוע', '🎉', 'We relax on the weekend.', 'אנחנו נחים בסוף השבוע.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'kitchen', translationHe: 'מטבח' },
            { wordEn: 'museum', translationHe: 'מוזיאון' },
          ],
          shortSentenceEn: 'I was at the beach.',
          shortSentenceHe: 'הייתי בחוף הים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We were at the beach yesterday.',
            wrong: ['We was at the beach yesterday.', 'We are at the beach yesterday.'],
            explainHe: 'בצורת העבר של הפועל be: was עם I / he / she / it, ו-were עם we / you / they. אתמול זה עבר, לכן אומרים were.',
            hintHe: 'yesterday זה עבר. עם we, איזו צורת עבר של be מתאימה (לא was)?',
          },
          story: {
            passageEn:
              'Last Saturday Eli and his family were at the beach. The water was warm. His cousins were there too. Eli was very tired in the evening.',
            passageHe:
              'בשבת שעברה אלי והמשפחה שלו היו בחוף הים. המים היו חמימים. גם בני הדודים שלו היו שם. בערב אלי היה עייף מאוד.',
            questionEn: "Where was Eli's family last Saturday?",
            questionHe: 'איפה הייתה המשפחה של אלי בשבת שעברה?',
            correct: 'at the beach',
            wrong: ['at the museum', 'at school'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'They were at home.',
                wrong: ['They was at home.'],
                explainHe: 'עם we / you / they משתמשים ב-were בעבר.',
                hintHe: 'בדקו איזו צורת be מתאימה ל-they.',
              },
              story: {
                passageEn: 'Last weekend Rami was at the beach. The sea was blue. He was happy.',
                passageHe: 'בסוף השבוע שעבר רמי היה בחוף הים. הים היה כחול. הוא היה שמח.',
                questionEn: 'How was the sea?',
                questionHe: 'איך היה הים?',
                correct: 'blue',
                wrong: ['green'],
              },
            },
            challenger: {
              clozeWrong: [
                ['elephant', 'pencil'],
                ['tomorrow', 'never'],
                ['ceiling', 'pocket'],
              ],
            },
            master: {
              sentenceEn: 'My cousins were at the zoo with their class yesterday.',
              sentenceHe: 'בני הדודים שלי היו בגן החיות עם הכיתה שלהם אתמול.',
              decoys: ['was', 'are'],
              voiceEn: 'The sea was warm and blue.',
              voiceHe: 'הים היה חמים וכחול.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'My sister was at home last night.',
                wrong: [
                  'My sister were at home last night.',
                  'My sister is at home last night.',
                  'My sister be at home last night.',
                ],
                explainHe: 
                  'last night הוא עבר. עם I / he / she / it משתמשים ב-was, ועם we / you / they ב-were.',
                hintEn: 'Check the time word and the form of be.',
              },
              story: {
                passageEn: 
                  'Last weekend Eli and his friends were at the beach. The morning was sunny, but at noon the sky became grey and the wind was strong. Nobody swam. They sat under a big umbrella and ate sandwiches. In the evening Eli said it was still a great day.',
                passageHe: '',
                questionEn: 'Why did nobody swim at noon?',
                questionHe: '',
                correct: 'The weather changed and became windy.',
                wrong: ['They were all very tired.', 'The sea was too warm.', 'They forgot their swimming clothes at home.'],
              },
              storyHintEn: 'What happened to the sky at noon?',
            },
          },
        },
      },
      {
        icon: '🎇',
        titleEn: 'Holiday Fireworks',
        titleHe: 'זיקוקים בחג',
        storyHookHe: 'החג היה מרגש! נספר מה עשינו בחג עם פעלים בעבר כמו visited ו-watched.',
        grammarTopic: 'Past Simple: Regular Verbs (-ed)',
        skills: ['Past Simple -ed', 'Holiday Vocab', 'Speaking'],
        sentenceEn: 'On the holiday we visited our grandparents and watched fireworks.',
        sentenceHe: 'בחג ביקרנו את סבא וסבתא שלנו וצפינו בזיקוקים.',
        vocab: [
          ['fireworks', 'noun', 'זיקוקים', '🎆', 'The fireworks are bright and loud.', 'הזיקוקים בוהקים ורועשים.'],
          ['grandparents', 'noun', 'סבא וסבתא', '👵', 'My grandparents live in Haifa.', 'סבא וסבתא שלי גרים בחיפה.'],
          ['visit', 'verb', 'לבקר', '🏠', 'We visit our cousins every year.', 'אנחנו מבקרים את בני הדודים בכל שנה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sandals', translationHe: 'סנדלים' },
            { wordEn: 'carrots', translationHe: 'גזרים' },
          ],
          shortSentenceEn: 'We watched the fireworks.',
          shortSentenceHe: 'צפינו בזיקוקים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We visited our grandparents yesterday.',
            wrong: ['We visit our grandparents yesterday.', 'We visiting our grandparents yesterday.'],
            explainHe: 'כדי לדבר על העבר מוסיפים ed לפועל רגיל: visit הופך ל-visited. המילה yesterday מרמזת על עבר.',
            hintHe: 'yesterday מרמזת על עבר. מה מוסיפים לסוף של פועל רגיל בעבר?',
          },
          story: {
            passageEn:
              'On Independence Day Rina visited her grandparents. They ate dinner outside. At night the family watched fireworks. Rina loved the colorful sky.',
            passageHe:
              'ביום העצמאות רינה ביקרה את סבא וסבתא שלה. הם אכלו ארוחת ערב בחוץ. בלילה המשפחה צפתה בזיקוקים. רינה אהבה את השמיים הצבעוניים.',
            questionEn: 'What did the family watch at night?',
            questionHe: 'במה המשפחה צפתה בלילה?',
            correct: 'fireworks',
            wrong: ['a movie', 'a football game'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Yesterday Dan visited his aunt.',
                wrong: ['Yesterday Dan visit his aunt.'],
                explainHe: 'yesterday הוא עבר, ולפועל רגיל מוסיפים ed: visited.',
                hintHe: 'שימו לב לסוף הפועל.',
              },
              story: {
                passageEn: 'Noa visited her grandparents. They ate soup. Then they played cards.',
                passageHe: 'נועה ביקרה את סבא וסבתא שלה. הם אכלו מרק. אחר כך הם שיחקו בקלפים.',
                questionEn: 'What did they play?',
                questionHe: 'במה הם שיחקו?',
                correct: 'cards',
                wrong: ['football'],
              },
            },
            challenger: {
              clozeWrong: [
                ['pillows', 'carrots'],
                ['pencils', 'shoes'],
                ['paint', 'repair'],
              ],
            },
            master: {
              sentenceEn: 'Last Friday my aunt visited us and brought cake.',
              sentenceHe: 'ביום שישי שעבר הדודה שלי ביקרה אצלנו והביאה עוגה.',
              decoys: ['visit', 'bringed'],
              voiceEn: 'We ate dinner with our grandparents.',
              voiceHe: 'אכלנו ארוחת ערב עם סבא וסבתא.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'On Saturday we visited our uncle.',
                wrong: [
                  'On Saturday we visit our uncle.',
                  'On Saturday we visiting our uncle.',
                  'On Saturday we visitted our uncle.',
                ],
                explainHe: 'בעבר של פועל רגיל מוסיפים ed (visited), בלי ing ובלי להכפיל אות.',
                hintEn: 'Check the time word and the end of visit.',
              },
              story: {
                passageEn: 
                  'Rina watched the fireworks with her grandparents. Her little cousin covered his ears and hid behind his grandfather. Rina laughed, but then she remembered her first fireworks night, when she was also afraid. She sat next to her cousin and held his hand until the show ended.',
                passageHe: '',
                questionEn: 'Why did Rina sit next to her cousin?',
                questionHe: '',
                correct: 'She understood that he felt afraid.',
                wrong: [
                  'She wanted to see the fireworks better.',
                  'She was angry at her grandfather.',
                  'She wanted to go home early.',
                ],
              },
              storyHintEn: 'How did Rina feel on her first big night?',
            },
          },
        },
      },
      {
        icon: '🎭',
        isBoss: true,
        titleEn: 'Boss: Purim Party Memories',
        titleHe: 'אתגר הבוס: זיכרונות ממסיבת פורים',
        storyHookHe: 'פורים היה כאן לפני רגע! הראו שאתם יודעים לספר על מסיבה בעבר עם was, were ופעלים נוספים.',
        grammarTopic: 'Past Simple Review: was / were & Past Verbs',
        skills: ['was / were', 'Past Verbs', 'Reading'],
        sentenceEn: 'Last Purim my friends were at a party in funny costumes.',
        sentenceHe: 'בפורים שעבר החברים שלי היו במסיבה בתחפושות מצחיקות.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🎭', 'My costume is red and gold.', 'התחפושת שלי אדומה וזהובה.'],
          ['doughnut', 'noun', 'סופגנייה', '🍩', 'I ate a sweet doughnut.', 'אכלתי סופגנייה מתוקה.'],
          ['party', 'noun', 'מסיבה', '🥳', 'The party was fun.', 'המסיבה הייתה כיפית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bucket', translationHe: 'דלי' },
            { wordEn: 'ticket', translationHe: 'כרטיס' },
          ],
          shortSentenceEn: 'I wore a costume.',
          shortSentenceHe: 'לבשתי תחפושת.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Last Purim I wore a funny costume.',
            wrong: ['Last Purim I wear a funny costume.', 'Last Purim I wearing a funny costume.'],
            explainHe: 'פורים שעבר הוא זמן עבר. לפועל לא רגיל wear יש צורת עבר מיוחדת: wore.',
            hintHe: 'Last Purim זה עבר. wear הוא פועל לא רגיל, עם צורת עבר מיוחדת (בלי ed).',
          },
          story: {
            passageEn:
              'Last Purim was great. Noam wore a funny costume. His friends were at his house for a party. They ate doughnuts and played games. Everyone was happy.',
            passageHe:
              'פורים שעבר היה נהדר. נועם לבש תחפושת מצחיקה. החברים שלו היו אצלו בבית למסיבה. הם אכלו סופגניות ושיחקו במשחקים. כולם היו שמחים.',
            questionEn: "Where were Noam's friends?",
            questionHe: 'איפה היו החברים של נועם?',
            correct: 'at his house',
            wrong: ['at the beach', 'at school'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Last night I ate a doughnut.',
                wrong: ['Last night I eated a doughnut.'],
                explainHe: 'eat הוא פועל לא רגיל: בעבר ate, לא eated.',
                hintHe: 'last night הוא עבר. האם eat הוא פועל רגיל?',
              },
              story: {
                passageEn: 'Dina wore a red costume. It was a clown costume. Her friends laughed.',
                passageHe: 'דינה לבשה תחפושת אדומה. זו הייתה תחפושת של ליצן. החברים שלה צחקו.',
                questionEn: 'What costume did Dina wear?',
                questionHe: 'איזו תחפושת דינה לבשה?',
                correct: 'a clown',
                wrong: ['a king'],
              },
            },
            challenger: {
              clozeWrong: [
                ['sadness', 'Tuesday'],
                ['pillow', 'shoe'],
                ['ladder', 'envelope'],
              ],
            },
            master: {
              sentenceEn: 'My brother wore a funny hat at the party.',
              sentenceHe: 'אחי חבש כובע מצחיק במסיבה.',
              decoys: ['wear', 'were'],
              voiceEn: 'We danced and sang at the party.',
              voiceHe: 'רקדנו ושרנו במסיבה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Last year I wore a green costume.',
                wrong: [
                  'Last year I weared a green costume.',
                  'Last year I wear a green costume.',
                  'Last year I wearing a green costume.',
                ],
                explainHe: 'last year הוא עבר. wear הוא פועל לא רגיל, ובעבר הוא wore.',
                hintEn: 'Is wear a regular verb in the past?',
              },
              story: {
                passageEn: 
                  'Noam wanted to be a pirate for Purim, but his costume was not ready. His mom could not find the hat. Ten minutes before the party, Noam found an old black scarf and a paper sword. He tied the scarf on his head. At the party everybody said his pirate costume was the best.',
                passageHe: '',
                questionEn: 'Why did Noam use an old scarf and a paper sword?',
                questionHe: '',
                correct: 'The real costume was not ready in time.',
                wrong: [
                  'He wanted to be a doctor instead.',
                  'Noam was too tired to dress up for the party.',
                  'His friends gave him the things.',
                ],
              },
              storyHintEn: 'What was not ready before the party?',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Bigger, Better, Ready for Grade 7!',
    titleHe: 'פרק 4: גדולים יותר, טובים יותר, מוכנים לכיתה ז׳!',
    subtitleHe: 'השוואות (bigger, more interesting), מקצועות לימוד, שאלות Wh וסיכום Band I',
    badgeEmoji: '🚀',
    missions: [
      {
        icon: '🐘',
        titleEn: 'Who Is Bigger? Who Is Faster?',
        titleHe: 'מי גדול יותר? מי מהיר יותר?',
        storyHookHe: 'בואו נשווה חיות וחברים! נלמד להגיד bigger, faster ו-than.',
        grammarTopic: 'Comparatives with -er',
        skills: ['Comparatives -er', 'Animal Vocab', 'Voice Practice'],
        sentenceEn: 'An elephant is bigger than a horse.',
        sentenceHe: 'פיל גדול יותר מסוס.',
        vocab: [
          ['elephant', 'noun', 'פיל', '🐘', 'The elephant drinks a lot of water.', 'הפיל שותה הרבה מים.'],
          ['bigger', 'adjective', 'גדול יותר', '📏', 'My bag is bigger than yours.', 'התיק שלי גדול יותר משלך.'],
          ['faster', 'adjective', 'מהיר יותר', '🏃', 'A cheetah is faster than a dog.', 'ברדלס מהיר יותר מכלב.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'butterfly', translationHe: 'פרפר' },
            { wordEn: 'rabbit', translationHe: 'ארנב' },
          ],
          shortSentenceEn: 'A horse is faster.',
          shortSentenceHe: 'סוס מהיר יותר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'An elephant is bigger than a horse.',
            wrong: ['An elephant is biggest than a horse.', 'An elephant is more big than a horse.'],
            explainHe: 'בשם תואר קצר מוסיפים er כדי להשוות: big הופך ל-bigger (עם g כפולה), ואחריו בא than.',
            hintHe: 'משווים שני דברים (than). לתואר קצר כמו big מוסיפים סיומת, ולפעמים מכפילים אות.',
          },
          story: {
            passageEn:
              "Dan has a small dog and Maya has a big dog. Maya's dog is bigger than Dan's dog. But Dan's dog is faster than Maya's dog. Both dogs love the park.",
            passageHe:
              'לדן יש כלב קטן ולמאיה יש כלב גדול. הכלב של מאיה גדול יותר מהכלב של דן. אבל הכלב של דן מהיר יותר מהכלב של מאיה. שני הכלבים אוהבים את הפארק.',
            questionEn: 'Which dog is faster?',
            questionHe: 'איזה כלב מהיר יותר?',
            correct: "Dan's dog",
            wrong: ["Maya's dog", 'the cat'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'A rabbit is smaller than a dog.',
                wrong: ['A rabbit is more small than a dog.'],
                explainHe: 'בתואר קצר מוסיפים er ואחריו than: smaller.',
                hintHe: 'האם small הוא תואר קצר או ארוך?',
              },
              story: {
                passageEn: 'A turtle is slow. A rabbit is fast. The rabbit is faster than the turtle.',
                passageHe: 'צב הוא איטי. ארנב הוא מהיר. הארנב מהיר יותר מהצב.',
                questionEn: 'Who is faster?',
                questionHe: 'מי מהיר יותר?',
                correct: 'the rabbit',
                wrong: ['the turtle'],
              },
            },
            challenger: {
              clozeWrong: [
                ['stone', 'chair'],
                ['biggest', 'tallest'],
                ['fastest', 'slowest'],
              ],
            },
            master: {
              sentenceEn: 'A cheetah is smaller than a lion but faster.',
              sentenceHe: 'ברדלס קטן יותר מאריה אבל מהיר יותר.',
              decoys: ['smallest', 'more'],
              voiceEn: 'My brother is taller than me.',
              voiceHe: 'אחי גבוה ממני.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'A horse is taller than a goat.',
                wrong: [
                  'A horse is tallest than a goat.',
                  'A horse is more tall than a goat.',
                  'A horse is taller then a goat.',
                ],
                explainHe: 'בתואר קצר מוסיפים er ואחריו than (לא then, לא most ולא more).',
                hintEn: 'Check the adjective ending and the word after it.',
              },
              story: {
                passageEn: 
                  'Two rabbits race in the park. They start together. Tom is bigger, so everyone thinks he is faster. But Tim is smaller and lighter, and he runs with a big smile. At the end Tim reaches the tree first. The children clap and learn that bigger is not always faster.',
                passageHe: '',
                questionEn: 'Why does Tim win the race?',
                questionHe: '',
                correct: 'He is lighter and quicker than Tom.',
                wrong: [
                  'He is much bigger and stronger than Tom.',
                  'He starts the race much earlier.',
                  'The children carry him to the tree.',
                ],
              },
              storyHintEn: 'Who is smaller and lighter?',
            },
          },
        },
      },
      {
        icon: '🔬',
        titleEn: 'Which Subject Is More Interesting?',
        titleHe: 'איזה מקצוע מעניין יותר?',
        storyHookHe: 'בקרוב בכיתה ז׳ יהיו מקצועות חדשים! נשווה מקצועות עם more interesting ו-more difficult.',
        grammarTopic: 'Comparatives with more + adjective',
        skills: ['more + Adjective', 'School Subjects', 'Reading'],
        sentenceEn: 'Science is more interesting than history for me.',
        sentenceHe: 'מדעים מעניינים יותר מהיסטוריה בשבילי.',
        vocab: [
          ['science', 'noun', 'מדעים', '🔬', 'We do experiments in science.', 'אנחנו עושים ניסויים במדעים.'],
          ['history', 'noun', 'היסטוריה', '🏛️', 'History tells stories about the past.', 'היסטוריה מספרת סיפורים על העבר.'],
          ['interesting', 'adjective', 'מעניין', '🤔', 'This book is very interesting.', 'הספר הזה מעניין מאוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bakery', translationHe: 'מאפייה' },
            { wordEn: 'airport', translationHe: 'שדה תעופה' },
          ],
          shortSentenceEn: 'Science is more interesting.',
          shortSentenceHe: 'מדעים מעניינים יותר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Math is more difficult than art.',
            wrong: ['Math is difficulter than art.', 'Math is most difficult than art.'],
            explainHe: 'בשמות תואר ארוכים (difficult, interesting) לא מוסיפים er אלא שמים more לפני התואר, ואחריו than.',
            hintHe: 'difficult הוא תואר ארוך: לא מוסיפים לו סיומת אלא מילה לפניו. ו-most שמור ל-הכי.',
          },
          story: {
            passageEn:
              'Lia has two favorite subjects. She thinks science is more interesting than history. In science class she does experiments with her friends. In history class she only reads the book. Lia wants to be a scientist.',
            passageHe:
              'לליה יש שני מקצועות אהובים. היא חושבת שמדעים מעניינים יותר מהיסטוריה. בשיעור מדעים היא עושה ניסויים עם החברים. בשיעור היסטוריה היא רק קוראת בספר. ליה רוצה להיות מדענית.',
            questionEn: 'Which subject is more interesting for Lia?',
            questionHe: 'איזה מקצוע מעניין יותר בעיני ליה?',
            correct: 'science',
            wrong: ['history', 'math'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'This book is more interesting than that book.',
                wrong: ['This book is interestinger than that book.'],
                explainHe: 'בתואר ארוך כמו interesting שמים more לפניו ואחריו than.',
                hintHe: 'האם interesting הוא תואר קצר?',
              },
              story: {
                passageEn: 
                  'Lia likes science. She likes experiments. Her book about space is very interesting.',
                passageHe: 'ליה אוהבת מדעים. היא אוהבת ניסויים. הספר שלה על החלל מעניין מאוד.',
                questionEn: 'What is her space book like?',
                questionHe: 'איך הספר שלה על החלל?',
                correct: 'interesting',
                wrong: ['boring'],
              },
            },
            challenger: {
              clozeWrong: [
                ['window', 'breakfast'],
                ['pillow', 'lunch'],
                ['hungry', 'thirsty'],
              ],
            },
            master: {
              sentenceEn: 'For me English is more important than art.',
              sentenceHe: 'בשבילי אנגלית חשובה יותר מאמנות.',
              decoys: ['importanter', 'most'],
              voiceEn: 'This lesson is very interesting.',
              voiceHe: 'השיעור הזה מעניין מאוד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Science is more exciting than sports.',
                wrong: [
                  'Science is excitinger than sports.',
                  'Science is the most exciting than sports.',
                  'Science more is exciting than sports.',
                ],
                explainHe: 
                  'בתואר ארוך (exciting) שמים more לפניו ואחריו than. לא מוסיפים er ולא משתמשים ב-most.',
                hintEn: 'Is exciting a short or a long adjective?',
              },
              story: {
                passageEn: 
                  'Tomer must choose a school club. He loves animals, so he looks at the nature club. But his best friend joins the robot club, and Tomer sees them building a small robot dog. It walks, barks and wags its tail. Tomer thinks for a minute and then writes his name on the robot list.',
                passageHe: '',
                questionEn: 'Why does Tomer write his name on the robot list?',
                questionHe: '',
                correct: 'The robot dog seems more exciting to him.',
                wrong: [
                  'He does not like animals at all.',
                  'The nature club is closed for the whole week.',
                  'His best friend asks him to leave.',
                ],
              },
              storyHintEn: 'What does the robot dog do?',
            },
          },
        },
      },
      {
        icon: '🎒',
        isBoss: true,
        titleEn: 'Boss: Ready for Grade 7',
        titleHe: 'אתגר הבוס: מוכנים לכיתה ז׳',
        storyHookHe: 'הגענו לאתגר האחרון של Band I! שאלו שאלות עם How many ו-Why וענו עם because.',
        grammarTopic: 'Wh-Questions: How many / How much / Why',
        skills: ['How many / How much', 'Why & Because', 'Band I Review'],
        sentenceEn: 'How many notebooks are in your backpack today?',
        sentenceHe: 'כמה מחברות יש בתיק שלכם היום?',
        vocab: [
          ['backpack', 'noun', 'תיק גב', '🎒', 'My backpack is blue and heavy.', 'תיק הגב שלי כחול וכבד.'],
          ['notebook', 'noun', 'מחברת', '📓', 'I write new words in my notebook.', 'אני כותב/ת מילים חדשות במחברת.'],
          ['because', 'conjunction', 'כי / בגלל ש', '💡', 'I am happy because it is Friday.', 'אני שמח/ה כי היום יום שישי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sofa', translationHe: 'ספה' },
            { wordEn: 'fence', translationHe: 'גדר' },
          ],
          shortSentenceEn: 'How many notebooks are there?',
          shortSentenceHe: 'כמה מחברות יש?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'How many books are in the bag?',
            wrong: ['How much books are in the bag?', 'How many book are in the bag?'],
            explainHe: 'עם עצמים שאפשר לספור משתמשים ב-How many ובשם עצם ברבים: books. ל-How much משתמשים עם דברים שלא סופרים, כמו water.',
            hintHe: 'אפשר לספור ספרים? לדברים שסופרים יש מילת שאלה מיוחדת, ושם העצם צריך להיות ברבים.',
          },
          story: {
            passageEn:
              'Tal is ready for Grade 7. Her backpack is heavy because it has five notebooks. It also has three pens and a lunch box. Tal asks her teacher how many books she needs. The teacher says only two.',
            passageHe:
              'טל מוכנה לכיתה ז׳. התיק שלה כבד כי יש בו חמש מחברות. יש בו גם שלושה עטים וקופסת אוכל. טל שואלת את המורה כמה ספרים היא צריכה. המורה אומר שרק שניים.',
            questionEn: "Why is Tal's backpack heavy?",
            questionHe: 'למה התיק של טל כבד?',
            correct: 'Because it has five notebooks.',
            wrong: ['Because it has a big laptop.', 'Because it has ten balls.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which question is right?',
                correct: 'How many pens do you have?',
                wrong: ['How much pens do you have?'],
                explainHe: 'עם דברים שסופרים משתמשים ב-How many.',
                hintHe: 'אפשר לספור עטים? בחרו את מילת השאלה לפי זה.',
              },
              story: {
                passageEn: 'Ben has a backpack. It has three books. It is very heavy.',
                passageHe: 'לבן יש תיק גב. יש בו שלושה ספרים. הוא כבד מאוד.',
                questionEn: 'How many books are in the backpack?',
                questionHe: 'כמה ספרים יש בתיק הגב?',
                correct: 'three',
                wrong: ['five'],
              },
            },
            challenger: {
              clozeWrong: [
                ['weekend', 'happiness'],
                ['mountain', 'refrigerator'],
                ['or', 'than'],
              ],
            },
            master: {
              sentenceEn: 'I have two notebooks because I need them for science.',
              sentenceHe: 'יש לי שתי מחברות כי אני צריך/ה אותן למדעים.',
              decoys: ['much', 'why'],
              voiceEn: 'There are four pens in my bag.',
              voiceHe: 'יש ארבעה עטים בתיק שלי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'How many apples are in the basket?',
                wrong: [
                  'How much apples are in the basket?',
                  'How many apple are in the big basket?',
                  'How many apples is in the basket?',
                ],
                explainHe: 
                  'עם דברים שסופרים: How many + שם עצם ברבים + are. How much רק לדברים שלא סופרים.',
                hintEn: 'Can you count apples? Check the noun ending.',
              },
              story: {
                passageEn: 
                  'Tal packs her backpack for the school trip. She puts in two bottles of water because the day will be hot. She also takes a hat but leaves her heavy dictionary at home. Her teacher smiles when Tal opens the bag. Everything fits and the bag is light.',
                passageHe: '',
                questionEn: 'Why does Tal put two bottles of water in her bag?',
                questionHe: '',
                correct: 'The weather will be hot.',
                wrong: [
                  'She is always thirsty at school.',
                  'Her teacher asks for water.',
                  'The bag is too light.',
                ],
              },
              storyHintEn: 'What will the day be like?',
            },
          },
        },
      },
    ],
  },
]);
