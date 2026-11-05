import { buildMiddleSchoolGrade } from './builder';

/**
 * Grade 9 — Band III Entry & High School Transition:
 * Present Perfect review vs. Past Simple, Second Conditional (If + V2, would + base),
 * Contrast Connectors (Although, However, In contrast), Passive Voice (Present & Past Simple),
 * Relative Clauses (who, which, that), and High School Readiness.
 * 4 units × 3 missions = 12 missions (the 3rd mission of each unit is a Boss review).
 * Hebrew copy is gender-neutral (uses slash forms such as "בוחר/ת" and plural phrasing).
 */
export const grade9Curriculum = buildMiddleSchoolGrade('grade-9', [
  {
    titleEn: 'Unit 1: Future Innovators & Teen Podcast',
    titleHe: 'פרק 1: יזמים צעירים והפודקאסט העולמי',
    subtitleHe: 'Present Perfect מול Past Simple, שימוש ב-Since/For, Just ו-Already באולפן ההקלטות',
    badgeEmoji: '🚀',
    missions: [
      {
        icon: '🎙️',
        titleEn: 'Recording Our First Global Episode',
        titleHe: 'הקלטת הפרק הבינלאומי הראשון שלנו',
        storyHookHe: 'איך מתארים הישגים שכבר השגנו בחיים (Present Perfect) ומשתפים חוויות מול קהל מאזינים רחב?',
        grammarTopic: 'Present Perfect (Have/Has + V3) with Already & Just',
        skills: ['Present Perfect', 'Podcast Speaking', 'Innovation Vocab'],
        sentenceEn: 'We have already interviewed three young inventors this month!',
        sentenceHe: 'כבר ראיינו שלושה ממציאים צעירים החודש!',
        vocab: [
          ['opportunity', 'noun', 'הזדמנות', '🚪', 'This podcast gives teens an opportunity to speak.', 'הפודקאסט הזה נותן לבני נוער הזדמנות לדבר.'],
          ['confident', 'adjective', 'בעל/ת ביטחון עצמי', '🦁', 'Practice makes you feel more confident when speaking.', 'תרגול גורם לך להרגיש יותר בטוח/ה בעצמך בדיבור.'],
          ['achievement', 'noun', 'הישג', '🏆', 'Winning the robotics contest was a major achievement.', 'הזכייה בתחרות הרובוטיקה הייתה הישג משמעותי.'],
          ['interview', 'verb / noun', 'לראיין / ראיון', '🎤', 'Today we interview a sixteen-year-old developer.', 'היום אנחנו מראיינים מפתח בן שש עשרה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'disadvantage', translationHe: 'חיסרון' },
          ],
          shortSentenceEn: 'We have interviewed young inventors.',
          shortSentenceHe: 'ראיינו ממציאים צעירים.',
          rule: {
            questionEn: 'Which sentence correctly uses the Present Perfect with "already"?',
            correct: 'She has already finished editing the audio file.',
            wrong: [
              'She has already finish editing the audio file.',
              'She is already finished editing the audio file.',
            ],
            explainHe: 'ב-Present Perfect משתמשים ב-has/have ואחריו V3 (finished). לא משתמשים ב-is.',
            hintHe: 'Present Perfect בנוי מ-has / have ואחריו V3. האם is מתאים כאן?',
          },
          story: {
            passageEn:
              'Maya and her team host a weekly technology podcast for teens. Over the last four weeks, they have interviewed three young entrepreneurs from Israel, Sweden, and Canada. Each guest shared practical tips on coding and leadership. The show has already reached ten thousand active listeners.',
            passageHe:
              'מאיה והצוות שלה מנחים פודקאסט טכנולוגי שבועי לבני נוער. בארבעת השבועות האחרונים, הם ראיינו שלושה יזמים צעירים מישראל, שוודיה וקנדה. כל אורח חלק טיפים מעשיים על תכנות ומנהיגות. התוכנית כבר הגיעה לעשרת אלפים מאזינים פעילים.',
            questionEn: 'How many young entrepreneurs did the team interview?',
            questionHe: 'כמה יזמים צעירים ראיין הצוות?',
            correct: 'Three young entrepreneurs.',
            wrong: [
              'Ten young entrepreneurs.',
              'Only one local student.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Our teacher has just left the studio.',
                wrong: ['Our teacher have just left the studio.'],
                explainHe: 'עם נושא ביחיד (Our teacher) משתמשים ב-has: has just left.',
                hintHe: 'Our teacher הוא יחיד. איזה פועל עזר מתאים: has או have?',
              },
              story: {
                passageEn: 
                  'Noga has a small radio show. She has already talked to two singers. Today she meets a third one.',
                passageHe: 'לנוגה יש תוכנית רדיו קטנה. היא כבר דיברה עם שני זמרים. היום היא פוגשת זמר שלישי.',
                questionEn: 'How many singers has Noga already talked to?',
                questionHe: 'עם כמה זמרים נוגה כבר דיברה?',
                correct: 'Two singers.',
                wrong: ['Three singers.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['invention', 'accident'],
                ['annual', 'rural'],
                ['rehearsal', 'prediction'],
                ['edit', 'translate'],
              ],
            },
            master: {
              sentenceEn: 'My cousin has just won an important prize for her new podcast.',
              sentenceHe: 'בת הדוד שלי זכתה זה עתה בפרס חשוב על הפודקאסט החדש שלה.',
              decoys: ['have', 'win'],
              voiceEn: 'We have already finished the interview.',
              voiceHe: 'כבר סיימנו את הראיון.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The young host has already answered every question from listeners.',
                wrong: [
                  'The young host have already answered every question from listeners.',
                  'The young host has already answer every question from listeners.',
                  'The young host is already answered every question from listeners.',
                ],
                explainHe: 
                  'ב-Present Perfect משתמשים ב-has / have ואחריו V3. עם נושא ביחיד (the host) נשתמש ב-has, ואחריו answered.',
                hintEn: 'Check the helping verb and the form of the main verb.',
              },
              story: {
                passageEn: 
                  'Last month, Eitan was too nervous to speak in front of the class. His sister suggested that he start a small podcast from his bedroom. At first, only his grandmother listened. Since then, he has recorded forty episodes, and his school friends now ask him for advice before their presentations. Yesterday, he volunteered to lead the school assembly.',
                passageHe: '',
                questionEn: 'What can we understand about Eitan?',
                questionHe: '',
                correct: 'His confidence has grown through practice.',
                wrong: [
                  'He is still afraid to speak in public.',
                  'His grandmother is now his only listener in the world.',
                  'He stopped recording after a few weeks.',
                ],
              },
              storyHintEn: 'Think about how Eitan changed over time.',
            },
          },
        },
      },
      {
        icon: '🎧',
        titleEn: 'Soundtrack of Success: Edits & Deadlines',
        titleHe: 'פסקול של הצלחה: עריכות ולוחות זמנים',
        storyHookHe: 'ההקלטה הסתיימה ועכשיו הלחץ עולה בחדר העריכה! נלמד להשתמש ב-Since (מנקודת זמן) וב-For (למשך תקופת זמן).',
        grammarTopic: 'Present Perfect with Since and For',
        skills: ['Since vs. For', 'Production Vocab', 'Time Expressions'],
        sentenceEn: 'Our sound engineer has worked on this track for five hours without a break.',
        sentenceHe: 'טכנאי הקול שלנו עבד על הקטע הזה במשך חמש שעות ללא הפסקה.',
        vocab: [
          ['equipment', 'noun', 'ציוד', '🎛️', 'The studio bought high-quality audio equipment.', 'האולפן קנה ציוד אודיו באיכות גבוהה.'],
          ['broadcast', 'verb / noun', 'לשדר / שידור', '📡', 'The radio station broadcasts international news.', 'תחנת הרדיו משדרת חדשות בינלאומיות.'],
          ['production', 'noun', 'הפקה', '🎬', 'Digital music production requires creative vision.', 'הפקת מוזיקה דיגיטלית דורשת חזון יצירתי.'],
          ['listener', 'noun', 'מאזין / מאזינה', '🎧', 'Every listener can send questions via our app.', 'כל מאזין/ה יכול/ה לשלוח שאלות דרך האפליקציה שלנו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'passenger', translationHe: 'נוסע' },
            { wordEn: 'customer', translationHe: 'לקוח' },
          ],
          shortSentenceEn: 'He has worked for hours.',
          shortSentenceHe: 'הוא עבד במשך שעות.',
          rule: {
            questionEn: 'Choose the correct preposition: "I have known him _______ 2021."',
            correct: 'since',
            wrong: [
              'for',
              'during',
            ],
            explainHe: 'כאשר מציינים נקודת זמן ספציפית בעבר (כמו שנת 2021) משתמשים ב-since. המילה for משמשת למשך זמן (for three years).',
            hintHe: '2021 היא נקודה בזמן, לא משך זמן (כמו three years). איזו מילה מתאימה לנקודת התחלה?',
          },
          story: {
            passageEn:
              'Tal has managed the podcast soundboard since the beginning of eighth grade. Today he has been in the studio for six hours straight. He just completed mixing the background music. "The audio sounds crisp and ready for release," he told the producers.',
            passageHe:
              'טל מנהל את לוח הקול של הפודקאסט מאז תחילת כיתה ח׳. היום הוא נמצא באולפן במשך שש שעות רצופות. הוא בדיוק השלים את עריכת מוזיקת הרקע. "האודיו נשמע חד ומוכן להפצה," אמר למפיקים.',
            questionEn: 'Since when has Tal managed the podcast soundboard?',
            questionHe: 'ממתי טל מנהל את לוח הקול של הפודקאסט?',
            correct: 'Since the beginning of eighth grade.',
            wrong: [
              'Since yesterday morning.',
              'For only six days.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The band has played here for three hours.',
                wrong: ['The band has played here since three hours.'],
                explainHe: 
                  'three hours הוא משך זמן, ולכן משתמשים ב-for. since בא עם נקודת התחלה (since noon).',
                hintHe: 'three hours הוא משך של זמן או נקודה בזמן?',
              },
              story: {
                passageEn: 
                  'Roni has a radio show. She has worked at the station for two years. Her show starts at eight.',
                passageHe: 'לרוני יש תוכנית רדיו. היא עובדת בתחנה כבר שנתיים. התוכנית שלה מתחילה בשמונה.',
                questionEn: 'How long has Roni worked at the station?',
                questionHe: 'כמה זמן רוני עובדת בתחנה?',
                correct: 'For two years.',
                wrong: ['For two days.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['rehearsal', 'schedule'],
                ['forecast', 'subscribe'],
                ['consumption', 'storage'],
                ['microphone', 'episode'],
              ],
            },
            master: {
              sentenceEn: 'Our radio station has played the same famous song for three weeks.',
              sentenceHe: 'תחנת הרדיו שלנו משמיעה את אותו שיר מפורסם כבר שלושה שבועות.',
              decoys: ['ago', 'have'],
              voiceEn: 'He has lived here since January.',
              voiceHe: 'הוא גר כאן מאז ינואר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Dana has edited this podcast since early Monday morning.',
                wrong: [
                  'Dana has edited this podcast for early Monday morning.',
                  'Dana have edited this podcast since early Monday morning.',
                  'Dana has edit this podcast since early Monday morning.',
                ],
                explainHe: 
                  'since בא עם נקודת התחלה (Monday morning) ו-for עם משך זמן. וגם: Present Perfect = has / have + V3.',
                hintEn: 'Is Monday morning a point in time or a period?',
              },
              story: {
                passageEn: 
                  'The school radio team started broadcasting in September. For the first month, they used an old microphone that often broke. Then the principal bought new equipment, and the sound became clear. Since that day, more students have joined the team, and some teachers even listen during lunch. Next week, the team will interview a famous author.',
                passageHe: '',
                questionEn: 'What can we learn about the school radio?',
                questionHe: '',
                correct: 'It became more popular after the new equipment.',
                wrong: [
                  'It was more popular when the microphone was old.',
                  'Teachers refuse to listen to the programs.',
                  'The principal closed the radio team.',
                ],
              },
              storyHintEn: 'Compare the radio before and after the new equipment.',
            },
          },
        },
      },
      {
        icon: '🌟',
        isBoss: true,
        titleEn: 'Boss: Live Studio Broadcast Challenge',
        titleHe: 'אתגר הבוס: שידור חי מהאולפן',
        storyHookHe: 'אתגר בוס לפרק 1: שידור פודקאסט חי מול אלפי מאזינים! שילוב של Present Perfect, Past Simple ושאלות עומק.',
        grammarTopic: 'Review: Present Perfect & Past Simple in Media Production',
        skills: ['Boss Challenge', 'Media Fluency', 'Tense Switching'],
        sentenceEn: 'We have produced twelve episodes, but yesterday was our most inspiring live broadcast.',
        sentenceHe: 'הפקנו שנים עשר פרקים, אך אתמול היה השידור החי מעורר ההשראה ביותר שלנו.',
        vocab: [
          ['audience', 'noun', 'קהל מאזינים / צופים', '👥', 'The online audience submitted brilliant questions.', 'הקהל המקוון שלח שאלות מבריקות.'],
          ['professional', 'adjective', 'מקצועי / מקצועית', '💼', 'She gave a very professional presentation.', 'היא העבירה מצגת מקצועית מאוד.'],
          ['feedback', 'noun', 'משוב', '📝', 'Constructive feedback helps creators improve.', 'משוב בונה עוזר ליוצרים להשתפר.'],
          ['publish', 'verb', 'לפרסם / להוציא לאור', '📰', 'They will publish the interview on Monday.', 'הם יפרסמו את הראיון ביום שני.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'criticism', translationHe: 'ביקורת' },
            { wordEn: 'permission', translationHe: 'רשות' },
          ],
          shortSentenceEn: 'The audience asked great questions.',
          shortSentenceHe: 'הקהל שאל שאלות מעולות.',
          rule: {
            questionEn: 'Which sentence correctly distinguishes between a past time and an open timeframe?',
            correct: 'We have recorded three interviews this week, and we recorded one yesterday.',
            wrong: [
              'We recorded three interviews this week, and we have recorded one yesterday.',
              'We have recorded three interviews this week, and we have recorded one yesterday too.',
            ],
            explainHe: 'כשיש ציון זמן סגור בעבר (yesterday) חייבים Past Simple (recorded). כשהשבוע עוד נמשך (this week) נשתמש ב-Present Perfect.',
            hintHe: 'yesterday הוא זמן סגור בעבר (עבר פשוט), ו-this week עוד לא נגמר (Present Perfect). כדאי לבדוק כל חצי.',
          },
          story: {
            passageEn:
              'Last night, the Teen Innovators podcast went live for the first time. Over five thousand students joined the stream from around the globe. The guest, a seventeen-year-old climate activist, explained how green technology has evolved recently. After the episode ended, the hosts received overwhelmingly positive feedback from the worldwide audience.',
            passageHe:
              'אמש, הפודקאסט "יזמים צעירים" שודר בשידור חי בפעם הראשונה. מעל חמשת אלפים תלמידים הצטרפו לשידור מכל רחבי העולם. האורחת, פעילת אקלים בת שבע עשרה, הסבירה כיצד טכנולוגיה ירוקה התפתחה לאחרונה. לאחר סיום הפרק, המנחים קיבלו משוב חיובי באופן גורף מהקהל העולמי.',
            questionEn: 'What feedback did the podcast hosts receive after the live broadcast?',
            questionHe: 'איזה משוב קיבלו מנחי הפודקאסט לאחר השידור החי?',
            correct: 'Overwhelmingly positive feedback.',
            wrong: [
              'Negative reviews from teachers.',
              'No response from the listeners.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We met the singer yesterday.',
                wrong: ['We have met the singer yesterday.'],
                explainHe: 'עם yesterday (זמן סגור בעבר) משתמשים ב-Past Simple: met.',
                hintHe: 'yesterday הוא זמן שנגמר. איזה זמן מתאים לו?',
              },
              story: {
                passageEn: 
                  'Tomer made a video last night. Fifty people have watched it already. He is very happy.',
                passageHe: 'תומר הכין סרטון אמש. חמישים אנשים כבר צפו בו. הוא שמח מאוד.',
                questionEn: 'How many people have watched the video?',
                questionHe: 'כמה אנשים צפו בסרטון?',
                correct: 'Fifty people.',
                wrong: ['Five people.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['platform', 'episode'],
                ['fragile', 'seasonal'],
                ['equipment', 'software'],
                ['subscribe', 'predict'],
              ],
            },
            master: {
              sentenceEn: 'We recorded the episode last night but the host has not published it yet.',
              sentenceHe: 'הקלטנו את הפרק אמש אבל המנחה עדיין לא פרסם אותו.',
              decoys: ['did', 'ever'],
              voiceEn: 'She has never read a bad review.',
              voiceHe: 'היא מעולם לא קראה ביקורת רעה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Last week we published a new episode, and listeners have loved it.',
                wrong: [
                  'Last week we have published a new episode, and listeners have loved it.',
                  'Last week we published a new episode, and listeners has loved it.',
                  'Last week we published a new episode, and listeners have love it.',
                ],
                explainHe: 
                  'עם Last week (זמן סגור) משתמשים ב-Past Simple: published. ובחלק השני Present Perfect: have + V3, ועם רבים (listeners) נשתמש ב-have.',
                hintEn: 'One time word closes the past. Check each half separately.',
              },
              story: {
                passageEn: 
                  'Karen started her channel two years ago with only five viewers. Last summer she published a video about recycling, and a famous magazine shared it. Since then, thousands of people have subscribed. She still answers every comment herself, although her schedule has become very busy. Yesterday she announced that she wanted two students to help her edit.',
                passageHe: '',
                questionEn: 'Why does Karen probably want help from two students?',
                questionHe: '',
                correct: 'She has too much work to do alone.',
                wrong: [
                  'She has lost all her viewers.',
                  'The magazine asked her to stop.',
                  'She wants to close her channel next month.',
                ],
              },
              storyHintEn: 'Think about her busy schedule.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: The AI Revolution & Debate Club',
    titleHe: 'פרק 2: מהפכת הבינה המלאכותית ומועדון הדיבייט',
    subtitleHe: 'Second Conditional (If + Past Simple, would), מילות קישור של ניגוד ואתיקה דיגיטלית',
    badgeEmoji: '🤖',
    missions: [
      {
        icon: '💡',
        titleEn: 'Debating the Future: If We Built a Robot',
        titleHe: 'מדברים על העתיד: אילו בנינו רובוט',
        storyHookHe: 'מועדון הדיבייט של בית הספר דן בהשפעות ה-AI על העתיד! נלמד להביע דעה ולשער השערות היפותטיות בעזרת תנאי שני.',
        grammarTopic: 'Second Conditional (If + Past Simple, Would + Base Verb)',
        skills: ['Second Conditional', 'Debate Vocabulary', 'Hypothetical Thinking'],
        sentenceEn: 'If I had enough resources, I would develop an AI assistant for education.',
        sentenceHe: 'אילו היו לי מספיק משאבים, הייתי מפתח/ת עוזר בינה מלאכותית לחינוך.',
        vocab: [
          ['artificial', 'adjective', 'מלאכותי', '🤖', 'Artificial intelligence helps doctors diagnose diseases.', 'בינה מלאכותית עוזרת לרופאים לאבחן מחלות.'],
          ['influence', 'verb / noun', 'להשפיע / השפעה', '🌊', 'Technology has a deep influence on daily life.', 'לטכנולוגיה יש השפעה עמוקה על חיי היומיום.'],
          ['perspective', 'noun', 'נקודת מבט / השקפה', '👓', 'Travel opens your mind to new perspectives.', 'מסעות פותחים את המחשבה לנקודות מבט חדשות.'],
          ['debate', 'verb / noun', 'דיון / עימות / להתווכח', '🗣️', 'The students debate climate policies passionately.', 'התלמידים מתדיינים בלהט על מדיניות אקלים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'destruction', translationHe: 'הרס' },
            { wordEn: 'coincidence', translationHe: 'צירוף מקרים' },
          ],
          shortSentenceEn: 'I would build a robot.',
          shortSentenceHe: 'הייתי בונה רובוט.',
          rule: {
            questionEn: 'Which sentence correctly follows the Second Conditional?',
            correct: 'If we had a laboratory robot, we would finish experiments faster.',
            wrong: [
              'If we will have a laboratory robot, we would finish experiments faster.',
              'If we have a laboratory robot, we would finished experiments faster.',
            ],
            explainHe: 'בתנאי שני למצבים היפותטיים בהווה: בחלק ה-If משתמשים ב-Past Simple (had), ובחלק התוצאה ב-would + פועל מקור.',
            hintHe: 'תנאי שני הוא מצב דמיוני: אחרי If בא עבר פשוט, ובתוצאה would + פועל בסיסי.',
          },
          story: {
            passageEn:
              'In the weekly debate tournament, Yarden argued for assistive technology in hospitals. "If every senior citizen had a personal robotic companion, loneliness would decrease dramatically," she stated. Her opponent agreed that robotics offers great assistance, but warned about human contact.',
            passageHe:
              'בטורניר הדיבייט השבועי, ירדן טענה בעד טכנולוגיה מסייעת בבתי חולים. "אילו לכל אזרח ותיק היה מלווה רובוטי אישי, הבדידות הייתה פוחתת באופן דרמטי," הצהירה. יריבה הסכים שרובוטיקה מציעה עזרה נהדרת, אך הזהיר מפני אובדן מגע אנושי.',
            questionEn: 'What hypothetical benefit did Yarden mention in her argument?',
            questionHe: 'איזה יתרון היפותטי הזכירה ירדן בטיעון שלה?',
            correct: 'Loneliness would decrease dramatically.',
            wrong: [
              'Hospitals would close completely.',
              'Medicine would become free for all.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If I had a robot, I would clean my room.',
                wrong: ['If I have a robot, I would clean my room.'],
                explainHe: 
                  'בתנאי שני (מצב דמיוני) אחרי If בא Past Simple (had), ובתוצאה would + פועל מקור.',
                hintHe: 'מצב דמיוני: איזה זמן בא אחרי If?',
              },
              story: {
                passageEn: 
                  'Lior likes robots. He would like one at home. The robot would help him with his homework.',
                passageHe: 'ליאור אוהב רובוטים. הוא היה רוצה אחד בבית. הרובוט היה עוזר לו בשיעורי הבית.',
                questionEn: 'How would the robot help Lior?',
                questionHe: 'איך הרובוט היה עוזר לליאור?',
                correct: 'With his homework.',
                wrong: ['With his dinner.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['rural', 'seasonal'],
                ['solution', 'discovery'],
                ['souvenir', 'passport'],
                ['pollute', 'recycle'],
              ],
            },
            master: {
              sentenceEn: 'More students would study engineering if our school had a robotics lab.',
              sentenceHe: 'יותר תלמידים היו לומדים הנדסה אילו לבית הספר שלנו הייתה מעבדת רובוטיקה.',
              decoys: ['will', 'has'],
              voiceEn: 'I would ask the robot a question.',
              voiceHe: 'הייתי שואל/ת את הרובוט שאלה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If teenagers had more free time, they would invent amazing apps.',
                wrong: [
                  'If teenagers would have more free time, they would invent amazing apps.',
                  'If teenagers had more free time, they will invent amazing apps.',
                  'If teenagers have more free time, they would invent amazing apps.',
                ],
                explainHe: 
                  'בתנאי שני: If + Past Simple (had), ובתוצאה would + פועל מקור. אין would אחרי If ואין will בתוצאה.',
                hintEn: 'Check the verb after If and the verb in the result.',
              },
              story: {
                passageEn: 
                  'Noam is the captain of the debate team. Tomorrow he must argue that robots should not replace teachers. He prepared a strong speech, but his friend Shir disagrees. "If a robot taught our class, nobody would notice when a student feels sad," she said. Noam thought about her words for a long time and added a new paragraph to his speech.',
                passageHe: '',
                questionEn: 'What does Shir mean by her sentence?',
                questionHe: '',
                correct: 'Robots cannot notice feelings like teachers do.',
                wrong: [
                  'Robots are too expensive for most schools to buy.',
                  'Students always feel sad in class.',
                  'Teachers should not talk during lessons.',
                ],
              },
              storyHintEn: 'Think about what a robot cannot notice.',
            },
          },
        },
      },
      {
        icon: '⚖️',
        titleEn: 'Ethics in the Digital Age',
        titleHe: 'אתיקה בעידן הדיגיטלי',
        storyHookHe: 'האם מותר ל-AI לכתוב שירים או להחליט החלטות שיפוטיות? נלמד מילות קישור של ניגוד: Although, However ו-In contrast.',
        grammarTopic: 'Connectors of Contrast (Although, However, In contrast)',
        skills: ['Contrast Connectors', 'Ethics Vocab', 'Argument Structure'],
        sentenceEn: 'Although technology evolves rapidly, human empathy remains completely irreplaceable.',
        sentenceHe: 'למרות שהטכנולוגיה מתפתחת במהירות, אמפתיה אנושית נשארת בלתי ניתנת להחלפה.',
        vocab: [
          ['ethical', 'adjective', 'אתי / מוסרי', '⚖️', 'Engineers face difficult ethical decisions.', 'מהנדסים מתמודדים עם החלטות אתיות קשות.'],
          ['advantage', 'noun', 'יתרון', '➕', 'Fast processing speed is a great advantage of computers.', 'מהירות עיבוד גבוהה היא יתרון גדול של מחשבים.'],
          ['privacy', 'noun', 'פרטיות', '🔒', 'Protecting user privacy is essential for online safety.', 'הגנה על פרטיות המשתמש חיונית לבטיחות ברשת.'],
          ['technology', 'noun', 'טכנולוגיה', '💻', 'Modern technology connects people worldwide.', 'טכנולוגיה מודרנית מחברת אנשים ברחבי העולם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'punishment', translationHe: 'עונש' },
            { wordEn: 'celebration', translationHe: 'חגיגה' },
          ],
          shortSentenceEn: 'Human empathy remains irreplaceable.',
          shortSentenceHe: 'אמפתיה אנושית נשארת בלתי ניתנת להחלפה.',
          rule: {
            questionEn: 'Which sentence uses "although" with proper punctuation and grammar?',
            correct: 'Although the algorithm was fast, it made several factual mistakes.',
            wrong: [
              'Although the algorithm was fast, but it made several mistakes.',
              'The algorithm was fast, although it made not mistakes.',
            ],
            explainHe: 'כאשר פותחים משפט עם Although (למרות ש...), אין להוסיף את המילה but בחלק השני של המשפט.',
            hintHe: 'אחרי Although לא מוסיפים but. וגם כדאי לבדוק שהשלילה כתובה נכון.',
          },
          story: {
            passageEn:
              'The school ethics panel discussed generative software in modern education. "Although artificial intelligence can write coherent essays, it lacks personal emotional experience," argued Dan. "However, teachers can utilize it to design customized grammar drills for struggling pupils." The principal agreed that balance is essential.',
            passageHe:
              'פאנל האתיקה של בית הספר דן בתוכנות יוצרות בחינוך המודרני. "למרות שבינה מלאכותית יכולה לכתוב חיבורים קוהרנטיים, חסר לה ניסיון רגשי אישי," טען דן. "עם זאת, מורים יכולים לנצל אותה כדי לעצב תרגילי דקדוק מותאמים אישית לתלמידים מתקשים." המנהלת הסכימה שאיזון הוא חיוני.',
            questionEn: 'What key human quality does Dan claim artificial intelligence lacks?',
            questionHe: 'איזו תכונה אנושית מרכזית דן טוען שחסרה לבינה מלאכותית?',
            correct: 'Personal emotional experience.',
            wrong: [
              'Mathematical calculation power.',
              'Internet connectivity speed.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Although it was late, we kept working.',
                wrong: ['Although it was late, but we kept working.'],
                explainHe: 'אחרי Although לא מוסיפים but. המשפט כבר מביע ניגוד.',
                hintHe: 'כבר יש מילת ניגוד אחת במשפט. האם צריך עוד אחת?',
              },
              story: {
                passageEn: 'Maya has a new phone. It is fast. However, it is expensive.',
                passageHe: 'למאיה יש טלפון חדש. הוא מהיר. עם זאת, הוא יקר.',
                questionEn: 'What is the problem with the phone?',
                questionHe: 'מה הבעיה בטלפון?',
                correct: 'It is expensive.',
                wrong: ['It is slow.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['tropical', 'poetic'],
                ['cousin', 'accessory'],
                ['entertainment', 'popularity'],
                ['dentistry', 'carpentry'],
              ],
            },
            master: {
              sentenceEn: 
                'Although online shopping is convenient many people worry about the safety of their personal data.',
              sentenceHe: 
                'למרות שקניות מקוונות נוחות, אנשים רבים מודאגים מבטיחות הנתונים האישיים שלהם.',
              decoys: ['however', 'but'],
              voiceEn: 'The new phone is fast but expensive.',
              voiceHe: 'הטלפון החדש מהיר אבל יקר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Although the app is free, it collects a lot of personal information.',
                wrong: [
                  'Although the app is free, but it collects a lot of personal information.',
                  'Although the app is free, however it collects a lot of personal information.',
                  'Although the app free, it collects a lot of personal information.',
                ],
                explainHe: 
                  'אחרי Although לא מוסיפים but או however, ובחלק של Although חייב להיות פועל (is).',
                hintEn: 'Look for a double connector and a missing verb.',
              },
              story: {
                passageEn: 
                  'Grandfather refused to use a smartphone for years. He said that a paper map and a telephone were enough. Last winter, however, he got lost on the way to a clinic, and his neighbour helped him install a navigation app. Now he still prefers books to screens, although he checks the weather on his phone every morning with a proud smile.',
                passageHe: '',
                questionEn: 'Why did Grandfather start using a phone app?',
                questionHe: '',
                correct: 'Getting lost showed him a useful side of phones.',
                wrong: [
                  'His neighbour paid him to use one.',
                  'He decided that books are boring.',
                  'The doctor at the clinic forced him to buy a new phone.',
                ],
              },
              storyHintEn: 'Look for what happened last winter.',
            },
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: World Championship Teen Debate',
        titleHe: 'אתגר הבוס: אליפות הדיבייט העולמית לנוער',
        storyHookHe: 'אתגר בוס לפרק 2: גמר אליפות הדיבייט הבינלאומית! שליטה במבנה התנאי השני, מילות קישור רטוריות וטיעונים משכנעים.',
        grammarTopic: 'Review: Second Conditional & Advanced Rhetorical Argumentation',
        skills: ['Boss Challenge', 'Persuasion Skills', 'Debate Mastery'],
        sentenceEn: 'If society invested more in youth research, we would solve environmental crises much faster.',
        sentenceHe: 'אילו החברה הייתה משקיעה יותר במחקר נוער, היינו פותרים משברים סביבתיים הרבה יותר מהר.',
        vocab: [
          ['argument', 'noun', 'טיעון / נימוק', '💬', 'Her strong argument convinced the debate judges.', 'הטיעון החזק שלה שכנע את שופטי הדיבייט.'],
          ['convince', 'verb', 'לשכנע', '🤝', 'He managed to convince the committee with factual data.', 'הוא הצליח לשכנע את הוועדה בעזרת נתונים עובדתיים.'],
          ['challenge', 'noun', 'אתגר', '⛰️', 'Overcoming climate change is our greatest challenge.', 'התגברות על שינויי האקלים היא האתגר הגדול ביותר שלנו.'],
          ['statement', 'noun', 'הצהרה / אמירה', '📜', 'The team issued an official statement after the victory.', 'הקבוצה פרסמה הצהרה רשמית לאחר הניצחון.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hesitation', translationHe: 'היסוס' },
            { wordEn: 'confusion', translationHe: 'בלבול' },
          ],
          shortSentenceEn: 'We would solve crises faster.',
          shortSentenceHe: 'היינו פותרים משברים מהר יותר.',
          rule: {
            questionEn: 'Which sentence correctly expresses an unreal condition in the present?',
            correct: 'If governments supported young scientists, breakthroughs would emerge rapidly.',
            wrong: [
              'If governments would support young scientists, breakthroughs will emerge.',
              'If governments supported young scientists, breakthroughs emerge rapidly.',
            ],
            explainHe: 'בחלק התנאי: If + Past Simple (supported). בחלק התוצאה: would + פועל מקור (would emerge). אין להשתמש ב-would בחלק ה-If.',
            hintHe: 'מצב לא אמיתי בהווה: אחרי If עבר פשוט (בלי would), ובתוצאה would + פועל בסיסי.',
          },
          story: {
            passageEn:
              'In the international debate finals in London, twenty national youth teams debated future education. Maya took the podium to deliver her team summary statement. "If every high school had modern laboratories, thousands of students would discover breakthrough medical treatments," she declared passionately. Her structured arguments and clear counterpoints convinced the judges, earning her team the trophy.',
            passageHe:
              'בגמר הדיבייט הבינלאומי בלונדון, עשרים קבוצות נוער לאומיות דנו על עתיד החינוך. מאיה עלתה לדוכן הנואמים כדי למסור את הצהרת הסיכום של קבוצתה. "אילו לכל בית ספר תיכון היו מעבדות מודרניות, אלפי תלמידים היו מגלים טיפולים רפואיים פורצי דרך," הכריזה בלהט. טיעוניה המובנים ונקודות הנגד הברורות שלה שכנעו את השופטים, והביאו לקבוצתה את הגביע.',
            questionEn: 'What educational change did Maya propose to achieve medical breakthroughs?',
            questionHe: 'איזה שינוי חינוכי הציעה מאיה כדי להשיג פריצות דרך רפואיות?',
            correct: 'Modern laboratories in every high school.',
            wrong: [
              'Banning all computer usage in exams.',
              'Cancelling foreign language classes.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If I were a teacher, I would give less homework.',
                wrong: ['If I would be a teacher, I give less homework.'],
                explainHe: 
                  'בתנאי שני: אחרי If בא Past Simple (were), ובתוצאה would + פועל מקור. אין would אחרי If.',
                hintHe: 'מצב דמיוני: מה בא אחרי If, ומה בא אחרי would?',
              },
              story: {
                passageEn: 
                  'Yael is in the debate club. She has a good argument. Her friends listen and clap.',
                passageHe: 'יעל בחוג הדיבייט. יש לה טיעון טוב. החברים שלה מקשיבים ומוחאים כפיים.',
                questionEn: 'Who listens to Yael?',
                questionHe: 'מי מקשיב ליעל?',
                correct: 'Her friends.',
                wrong: ['Her parents.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['trophy', 'schedule'],
                ['punish', 'translate'],
                ['celebration', 'passport'],
                ['stadium', 'injury'],
              ],
            },
            master: {
              sentenceEn: 'If I were the school principal I would let students vote on every rule.',
              sentenceHe: 'אילו הייתי מנהל/ת בית הספר, הייתי נותן/ת לתלמידים להצביע על כל כלל.',
              decoys: ['will', 'voting'],
              voiceEn: 'We could win if we worked together.',
              voiceHe: 'היינו יכולים לנצח אילו היינו עובדים יחד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 
                  'If the judges asked harder questions, the debaters would prepare more carefully.',
                wrong: [
                  'If the judges would ask harder questions, the debaters would prepare more carefully.',
                  'If the judges asked harder questions, the debaters will prepare more carefully.',
                  'If the judges ask harder questions, the debaters would prepared more carefully.',
                ],
                explainHe: 
                  'תנאי שני: If + Past Simple (asked), ובתוצאה would + פועל בצורת מקור (prepare). אין would אחרי If.',
                hintEn: 'Check the verb forms on both sides of the comma.',
              },
              story: {
                passageEn: 
                  'Before the final round, Maya felt nervous because the other team had more experience. Her coach did not tell her to relax. Instead, he asked her to imagine the worst question the judges could ask, and to prepare one calm answer for it. When the round began, Maya recognised the first question at once and spoke clearly. The judges nodded and wrote notes.',
                passageHe: '',
                questionEn: 'Why did the coach ask Maya to imagine the worst question?',
                questionHe: '',
                correct: 'So she would feel ready for difficult moments.',
                wrong: [
                  'To make her more nervous before the round.',
                  'Because the judges had secretly told him the question.',
                  'He wanted her to stop preparing.',
                ],
              },
              storyHintEn: 'Think about how practice changes nerves.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Media Literacy & Passive Voice',
    titleHe: 'פרק 3: אוריינות תקשורת וסביל באנגלית',
    subtitleHe: 'Passive Voice בהווה ובעבר (is/are + V3, was/were + V3), בדיקת עובדות וחדשות',
    badgeEmoji: '📰',
    missions: [
      {
        icon: '📰',
        titleEn: 'How News Stories Are Created',
        titleHe: 'כיצד כתבות חדשות נוצרות',
        storyHookHe: 'מי כותב את החדשות ואיך בודקים עובדות? נלמד את צורת הסביל בהווה: כאשר הפעולה חשובה יותר ממי שעשה אותה.',
        grammarTopic: 'Present Simple Passive (am / is / are + V3)',
        skills: ['Present Passive', 'Journalism Vocab', 'Fact Checking'],
        sentenceEn: 'Articles are written by journalists and checked by senior editors before publishing.',
        sentenceHe: 'כתבות נכתבות על ידי עיתונאים ונבדקות על ידי עורכים בכירים לפני הפרסום.',
        vocab: [
          ['journalism', 'noun', 'עיתונות', '✍️', 'Honest journalism protects freedom of speech.', 'עיתונות ישרה שומרת על חופש הביטוי.'],
          ['article', 'noun', 'כתבה / מאמר', '📄', 'She published a fascinating article about astronomy.', 'היא פרסמה מאמר מרתק על אסטרונומיה.'],
          ['reliable', 'adjective', 'מהימן / אמין', '✅', 'Always verify that your sources are reliable.', 'ודאו תמיד שהמקורות שלכם אמינים.'],
          ['source', 'noun', 'מקור מידע', '🔍', 'The reporter protected his primary source.', 'הכתב הגן על מקור המידע העיקרי שלו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'gossip', translationHe: 'רכילות' },
            { wordEn: 'advertisement', translationHe: 'פרסומת' },
          ],
          shortSentenceEn: 'Articles are checked carefully.',
          shortSentenceHe: 'כתבות נבדקות בקפידה.',
          rule: {
            questionEn: 'Which sentence correctly uses the Present Simple Passive?',
            correct: 'Digital photographs are uploaded to the news server every minute.',
            wrong: [
              'Digital photographs is uploaded to the news server every minute.',
              'Digital photographs are upload to the news server every minute.',
            ],
            explainHe: 'עבור שמות עצם ברבים (photographs) משתמשים ב-are בתוספת פועל ב-V3 (uploaded).',
            hintHe: 'photographs הוא רבים. סביל בהווה בנוי מ-am / is / are + V3.',
          },
          story: {
            passageEn:
              'In modern newsrooms, hundreds of reports are processed every morning. Fact-checkers verify each claim against reliable government databases. Once the text is approved, videos are edited and captions are added. Finally, news items are broadcast simultaneously to millions of phones.',
            passageHe:
              'במערכות חדשות מודרניות, מאות דיווחים מעובדים מדי בוקר. בודקי עובדות מאמתים כל טענה מול מאגרי מידע ממשלתיים אמינים. ברגע שהטקסט מאושר, סרטונים נערכים וכתוביות מתווספות. לבסוף, מבזקי חדשות משודרים בו-זמנית למיליוני טלפונים.',
            questionEn: 'How are news claims verified before publication?',
            questionHe: 'כיצד מאמתים טענות חדשותיות לפני פרסומן?',
            correct: 'Against reliable government databases.',
            wrong: [
              'By voting on social media polls.',
              'They are never verified.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The news is watched by millions of viewers.',
                wrong: ['The news are watched by millions of viewers.'],
                explainHe: 'news הוא שם עצם ביחיד, ולכן is + V3: is watched.',
                hintHe: 'news נחשב ליחיד. איזה פועל be מתאים: is או are?',
              },
              story: {
                passageEn: 
                  'A newspaper is printed every morning. The papers are sent to shops. People buy them on their way to work.',
                passageHe: 'עיתון מודפס בכל בוקר. העיתונים נשלחים לחנויות. אנשים קונים אותם בדרך לעבודה.',
                questionEn: 'Where are the papers sent?',
                questionHe: 'לאן נשלחים העיתונים?',
                correct: 'To shops.',
                wrong: ['To schools.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['gardening', 'tourism'],
                ['telescope', 'planet'],
                ['flexible', 'comfortable'],
                ['headline', 'deadline'],
              ],
            },
            master: {
              sentenceEn: 
                'Local news stories are collected by young reporters and published on the school website.',
              sentenceHe: 'חדשות מקומיות נאספות על ידי כתבים צעירים ומתפרסמות באתר בית הספר.',
              decoys: ['is', 'collect'],
              voiceEn: 'The website is updated every day.',
              voiceHe: 'האתר מתעדכן בכל יום.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Photos are checked carefully before they are added to the article.',
                wrong: [
                  'Photos is checked carefully before they are added to the article.',
                  'Photos are been checked carefully before they are added to the article.',
                  'Photos are checked carefully before they added to the article.',
                ],
                explainHe: 
                  'סביל בהווה: am / is / are + V3. עם Photos (רבים) משתמשים ב-are, ואחריו checked. גם החלק השני צריך are added.',
                hintEn: 'Check each half for the helping verb.',
              },
              story: {
                passageEn: 
                  'At a small local newspaper, every story goes through three steps. First, a reporter is sent to gather facts and speak to witnesses. Then an editor reads the text and removes anything that cannot be proved. Finally, the story is published only after the lawyer has approved it. Readers often complain that the paper is slow, but its articles are rarely wrong.',
                passageHe: '',
                questionEn: 'Why are the articles of this newspaper rarely wrong?',
                questionHe: '',
                correct: 'Every story is checked before it appears.',
                wrong: [
                  'Readers write all the articles themselves.',
                  'The lawyer is the only reporter.',
                  'It publishes stories before editors read them.',
                ],
              },
              storyHintEn: 'Look at the three steps in the process.',
            },
          },
        },
      },
      {
        icon: '💡',
        titleEn: 'Famous Inventions That Changed History',
        titleHe: 'המצאות מפורסמות ששינו את ההיסטוריה',
        storyHookHe: 'הטלפון, הדפוס והחשמל שינו את חיינו. נלמד איך לתאר אירועים היסטוריים בסביל בעבר: was / were + V3!',
        grammarTopic: 'Past Simple Passive (was / were + V3)',
        skills: ['Past Passive', 'History Vocab', 'Historical Science'],
        sentenceEn: 'The first modern telephone was invented by Alexander Graham Bell in 1876.',
        sentenceHe: 'הטלפון המודרני הראשון הומצא על ידי אלכסנדר גרהם בל בשנת 1876.',
        vocab: [
          ['invention', 'noun', 'המצאה', '💡', 'The printing press was a groundbreaking invention.', 'מכבש הדפוס היה המצאה פורצת דרך.'],
          ['discover', 'verb', 'לגלות', '🧭', 'Scientists discovered penicillin by accident.', 'מדענים גילו את הפניצילין במקרה.'],
          ['patent', 'noun', 'פטנט / זכות המצאה', '📜', 'Edison held more than one thousand patents.', 'לאדיסון היו רשומים למעלה מאלף פטנטים.'],
          ['historical', 'adjective', 'היסטורי', '🏛️', 'The museum displays unique historical artifacts.', 'המוזיאון מציג פריטים היסטוריים ייחודיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'superstition', translationHe: 'אמונה טפלה' },
          ],
          shortSentenceEn: 'The telephone was invented.',
          shortSentenceHe: 'הטלפון הומצא.',
          rule: {
            questionEn: 'Which sentence correctly forms the Past Simple Passive?',
            correct: 'The printing press was built in Germany in the fifteenth century.',
            wrong: [
              'The printing press were built in Germany in the fifteenth century.',
              'The printing press was build in Germany in the fifteenth century.',
            ],
            explainHe: 'עבור יחיד (the printing press) משתמשים ב-was + V3 (built). הצורה were מתאימה לרבים בלבד.',
            hintHe: 'the printing press הוא יחיד. סביל בעבר בנוי מ-was / were + V3 של build.',
          },
          story: {
            passageEn:
              'In 1876, the first telephone call was made in Boston. Wires were connected between two adjoining rooms, and the famous words were heard clearly. Within twenty years, thousands of telephone lines were installed across major cities, transforming global communication forever.',
            passageHe:
              'בשנת 1876 בוצעה שיחת הטלפון הראשונה בבוסטון. חוטים חוברו בין שני חדרים סמוכים, והמילים המפורסמות נשמעו בבירור. תוך עשרים שנה הותקנו אלפי קווי טלפון ברחבי ערים מרכזיות, והתקשורת העולמית השתנתה לנצח.',
            questionEn: 'When was the first telephone call made?',
            questionHe: 'מתי בוצעה שיחת הטלפון הראשונה?',
            correct: 'In 1876 in Boston.',
            wrong: [
              'In 1999 on a mobile network.',
              'Hundreds of years before writing.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The old bridge was built in 1950.',
                wrong: ['The old bridge were built in 1950.'],
                explainHe: 'the old bridge הוא יחיד, ולכן was + V3: was built.',
                hintHe: 'bridge הוא יחיד. איזה פועל be בעבר מתאים?',
              },
              story: {
                passageEn: 
                  'The first plane was built in 1903. Two brothers made it. It flew for only a few seconds.',
                passageHe: 'המטוס הראשון נבנה ב-1903. שני אחים בנו אותו. הוא טס רק כמה שניות.',
                questionEn: 'How long did it fly?',
                questionHe: 'כמה זמן הוא טס?',
                correct: 'A few seconds.',
                wrong: ['A few hours.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['tradition', 'decoration'],
                ['repair', 'inherit'],
                ['laboratory', 'factory'],
                ['hungry', 'sleepy'],
              ],
            },
            master: {
              sentenceEn: 'The first photograph was taken in France nearly two hundred years ago.',
              sentenceHe: 'התצלום הראשון צולם בצרפת לפני כמעט מאתיים שנה.',
              decoys: ['take', 'were'],
              voiceEn: 'The new bridge was opened yesterday.',
              voiceHe: 'הגשר החדש נפתח אתמול.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Penicillin was discovered by accident in a laboratory in London.',
                wrong: [
                  'Penicillin were discovered by accident in a laboratory in London.',
                  'Penicillin was discover by accident in a laboratory in London.',
                  'Penicillin discovered by accident in a laboratory in London.',
                ],
                explainHe: 
                  'סביל בעבר: was / were + V3. עם Penicillin (יחיד) נשתמש ב-was, ואחריו discovered.',
                hintEn: 'Check the helping verb and the verb ending.',
              },
              story: {
                passageEn: 
                  'For centuries, scribes copied books by hand, so only rich families could afford them. Then, in the fifteenth century, movable metal letters were used to print pages quickly. Within fifty years, millions of books were produced across Europe. Ordinary people began to learn to read, and new ideas travelled faster than ever before.',
                passageHe: '',
                questionEn: 'What was the most important result of the new printing method?',
                questionHe: '',
                correct: 'Ordinary people gained access to knowledge.',
                wrong: [
                  'Scribes became richer than before the printing press.',
                  'Books were copied slower by hand.',
                  'Only rich families bought books.',
                ],
              },
              storyHintEn: 'Think about who could read books afterwards.',
            },
          },
        },
      },
      {
        icon: '🔍',
        isBoss: true,
        titleEn: 'Boss: Investigative Journalism Report',
        titleHe: 'אתגר הבוס: תחקיר עיתונאי חוקר',
        storyHookHe: 'אתגר בוס לפרק 3: חשיפת האמת מאחורי ידיעה חדשותית! שליטה מלאה בסביל בהווה ובעבר, בדיקת מקורות ואוריינות דיגיטלית.',
        grammarTopic: 'Review: Passive Voice in Investigative Journalism',
        skills: ['Boss Challenge', 'Passive Mastery', 'Critical Media Analysis'],
        sentenceEn: 'The confidential documents were leaked online, but the facts were verified by honest researchers.',
        sentenceHe: 'המסמכים הסודיים הודלפו לרשת, אך העובדות אומתו על ידי חוקרים ישרים.',
        vocab: [
          ['headline', 'noun', 'כותרת ראשית', '📰', 'The bold headline grabbed the attention of readers.', 'הכותרת המודגשת משכה את תשומת לב הקוראים.'],
          ['report', 'noun / verb', 'דיווח / לדווח', '📑', 'The environmental report was published yesterday.', 'הדו"ח הסביבתי פורסם אתמול.'],
          ['document', 'noun', 'מסמך', '📄', 'Important historical documents are preserved in vaults.', 'מסמכים היסטוריים חשובים נשמרים בכספות.'],
          ['truth', 'noun', 'אמת', '🕊️', 'Courageous reporters always seek the objective truth.', 'כתבים אמיצים תמיד מחפשים את האמת האובייקטיבית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'rumor', translationHe: 'שמועה' },
            { wordEn: 'deception', translationHe: 'הטעיה' },
          ],
          shortSentenceEn: 'The facts were verified.',
          shortSentenceHe: 'העובדות אומתו.',
          rule: {
            questionEn: 'Which passive sentence correctly changes: "Reporters checked the facts yesterday"?',
            correct: 'The facts were checked by reporters yesterday.',
            wrong: [
              'The facts was checked by reporters yesterday.',
              'The facts are checked by reporters yesterday.',
            ],
            explainHe: 'המילה facts היא ברבים ועבר (yesterday), ולכן נשתמש ב-were checked.',
            hintHe: 'facts הוא רבים, ו-yesterday זה עבר. איזו צורה של be מתאימה לרבים בעבר?',
          },
          story: {
            passageEn:
              'A viral story about a secret underwater city was shared by millions on social media last week. However, when the images were examined by marine archaeologists, inconsistencies were immediately detected. The images were generated by computer software rather than captured by underwater cameras. A detailed correction report was published by news agencies to inform the public.',
            passageHe:
              'סיפור ויראלי על עיר תת-ימית סודית שותף על ידי מיליונים ברשתות החברתיות בשבוע שעבר. אולם, כאשר התמונות נבדקו על ידי ארכיאולוגים ימיים, אי-התאמות זוהו מיד. התמונות נוצרו על ידי תוכנת מחשב ולא נלכדו במצלמות תת-ימיות. דו"ח תיקון מפורט פורסם על ידי סוכנויות הידיעות כדי ליידע את הציבור.',
            questionEn: 'How were the viral underwater city images actually created?',
            questionHe: 'כיצד נוצרו בפועל תמונות העיר התת-ימית הוויראליות?',
            correct: 'They were generated by computer software.',
            wrong: [
              'They were photographed by deep-sea divers.',
              'They were painted on ancient papyrus.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The story was written by a student.',
                wrong: ['The story were written by a student.'],
                explainHe: 'the story הוא יחיד, ולכן was + V3: was written.',
                hintHe: 'story הוא יחיד. איזו צורה של be מתאימה בעבר?',
              },
              story: {
                passageEn: 
                  'A reporter wrote a story about our school. It was printed in the newspaper. Many people read it.',
                passageHe: 'כתב כתב סיפור על בית הספר שלנו. הוא הודפס בעיתון. אנשים רבים קראו אותו.',
                questionEn: 'Where was the story printed?',
                questionHe: 'איפה הסיפור הודפס?',
                correct: 'In the newspaper.',
                wrong: ['In a book.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['deadline', 'subscription'],
                ['disaster', 'landscape'],
                ['battle', 'election'],
                ['rumour', 'profit'],
              ],
            },
            master: {
              sentenceEn: 
                'The shocking photo was shared online yesterday but was later proved false by experts.',
              sentenceHe: 'התמונה המזעזעת שותפה ברשת אתמול אבל הוכחה מאוחר יותר כשקרית על ידי מומחים.',
              decoys: ['were', 'prove'],
              voiceEn: 'The mistake was corrected quickly.',
              voiceHe: 'הטעות תוקנה במהירות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The documents were examined by experts before the story was published.',
                wrong: [
                  'The documents was examined by experts before the story was published.',
                  'The documents were been examined by experts before the story was published.',
                  'The documents were examined by experts before the story published.',
                ],
                explainHe: 
                  'סביל בעבר: was / were + V3. documents הוא רבים (were examined), ו-the story was published צריך את was.',
                hintEn: 'Check the helping verb in both halves.',
              },
              story: {
                passageEn: 
                  'A famous newspaper once printed a dramatic headline about a missing treasure. Thousands of readers were excited, and tourists were sent to the island by travel agencies. Weeks later, a small local paper checked the original document and found that it was misread. The editor of the famous paper wrote a short apology, but many readers had already lost money.',
                passageHe: '',
                questionEn: 'What lesson does the story teach?',
                questionHe: '',
                correct: 'Facts should be checked before news is shared.',
                wrong: [
                  'Famous papers never make mistakes in their headlines.',
                  'Tourists should avoid all islands.',
                  'Local papers are always wrong.',
                ],
              },
              storyHintEn: 'Think about what the famous paper forgot to do.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Global Citizens & High School Countdown',
    titleHe: 'פרק 4: אזרחי העולם והמעבר לתיכון',
    subtitleHe: 'פסוקיות זיקה (who, which, that), סקירת משפטי תנאי ואוצר מילים ברמת Band III',
    badgeEmoji: '🎓',
    missions: [
      {
        icon: '🌍',
        titleEn: 'Leaders Who Inspire Us',
        titleHe: 'מנהיגים שמעניקים לנו השראה',
        storyHookHe: 'מי הם האנשים ששינו את העולם לטובה? נלמד לחבר משפטים מורכבים בעזרת כינויי זיקה: Who לבני אדם, ו-Which / That לחפצים ורעיונות.',
        grammarTopic: 'Relative Clauses (Who, Which, That)',
        skills: ['Relative Pronouns', 'Leadership Vocab', 'Complex Sentences'],
        sentenceEn: 'We admire leaders who fight for equality and make a lasting difference.',
        sentenceHe: 'אנחנו מעריצים מנהיגים שנלחמים למען שוויון ויוצרים שינוי בר-קיימא.',
        vocab: [
          ['equality', 'noun', 'שוויון', '⚖️', 'Education is the foundation of gender equality.', 'חינוך הוא הבסיס לשוויון מגדרי.'],
          ['inspiring', 'adjective', 'מעורר השראה', '🌟', 'She delivered an inspiring message to the youth.', 'היא העבירה מסר מעורר השראה לנוער.'],
          ['impact', 'noun', 'השפעה', '💥', 'Community volunteers have a positive impact.', 'למתנדבים בקהילה יש השפעה חיובית.'],
          ['contribution', 'noun', 'תרומה', '🎁', 'His scientific contribution saved thousands of lives.', 'תרומתו המדעית הצילה אלפי חיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'rebellion', translationHe: 'מרד' },
            { wordEn: 'struggle', translationHe: 'מאבק' },
          ],
          shortSentenceEn: 'Leaders fight for equality.',
          shortSentenceHe: 'מנהיגים נלחמים למען שוויון.',
          rule: {
            questionEn: 'Which relative pronoun correctly refers to a person?',
            correct: 'The student who won the scholarship studies medicine.',
            wrong: [
              'The student which won the scholarship studies medicine.',
              'The student where won the scholarship studies medicine.',
            ],
            explainHe: 'כאשר מתייחסים לבני אדם (the student) משתמשים ב-who (או that). המילה which משמשת רק לחפצים ובעלי חיים.',
            hintHe: 'the student הוא אדם. איזה כינוי זיקה מתאים לאנשים, ולא לחפצים או למקומות?',
          },
          story: {
            passageEn:
              'Throughout human history, change has been championed by individuals who refused to accept injustice. Leaders like Nelson Mandela and Malala Yousafzai demonstrated that persistence creates profound impact. Their courage inspires millions of students who believe in education and equality.',
            passageHe:
              'לאורך ההיסטוריה האנושית, שינוי הובל על ידי אנשים שסירבו לקבל חוסר צדק. מנהיגים כמו נלסון מנדלה ומלאלה יוספזאי הוכיחו שהתמדה מייצרת השפעה עמוקה. האומץ שלהם מעניק השראה למיליוני תלמידים שמאמינים בחינוך ובשוויון.',
            questionEn: 'Who is inspired by courageous leaders in the text?',
            questionHe: 'מי מקבל השראה ממנהיגים אמיצים לפי הטקסט?',
            correct: 'Millions of students who believe in education.',
            wrong: [
              'Only professional politicians.',
              'Nobody reads about history anymore.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The teacher who helped us is kind.',
                wrong: ['The teacher which helped us is kind.'],
                explainHe: 'לאנשים משתמשים ב-who. which מתאים לחפצים ולבעלי חיים.',
                hintHe: 'teacher הוא אדם. איזו מילה מתאימה לאנשים?',
              },
              story: {
                passageEn: 
                  'Mr Levi is a teacher who loves science. He has a lab that is full of plants. Students love his lessons.',
                passageHe: 
                  'מר לוי הוא מורה שאוהב מדע. יש לו מעבדה מלאה בצמחים. התלמידים אוהבים את השיעורים שלו.',
                questionEn: 'What does Mr Levi love?',
                questionHe: 'מה מר לוי אוהב?',
                correct: 'Science.',
                wrong: ['Football.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['furniture', 'weather'],
                ['edible', 'oval'],
                ['salary', 'deadline'],
                ['complaint', 'scandal'],
              ],
            },
            master: {
              sentenceEn: 
                'The scientist who discovered the new medicine received an award that honored her courage.',
              sentenceHe: 'המדענית שגילתה את התרופה החדשה קיבלה פרס שהוקיר את אומץ ליבה.',
              decoys: ['where', 'whose'],
              voiceEn: 'I know a girl who loves robots.',
              voiceHe: 'אני מכיר/ה ילדה שאוהבת רובוטים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Nelson Mandela was a leader who spent many years in prison.',
                wrong: [
                  'Nelson Mandela was a leader which spent many years in prison.',
                  'Nelson Mandela was a leader who spend many years in prison.',
                  'Nelson Mandela was a leader where spent many years in prison.',
                ],
                explainHe: 
                  'למנהיג (אדם) משתמשים ב-who, ואחריו פועל ביחיד בעבר (spent). which ו-where אינם מתאימים לאדם.',
                hintEn: 'Which word links to a person? Check the verb too.',
              },
              story: {
                passageEn: 
                  'When Hana was twelve, her village had no library. She collected old books that her neighbours no longer needed and kept them in a spare room. Soon children who had never enjoyed reading came every afternoon. Today the room has three hundred books, and Hana, who is now a teacher, says that one small idea can change a whole community.',
                passageHe: '',
                questionEn: 'What does the story suggest about Hana?',
                questionHe: '',
                correct: 'Her small action made a lasting difference.',
                wrong: [
                  'She was paid by the village to open a library.',
                  'Her neighbours disliked the old books.',
                  'She stopped reading when she grew up.',
                ],
              },
              storyHintEn: 'Think about what happened after Hana started.',
            },
          },
        },
      },
      {
        icon: '📚',
        titleEn: 'Choosing Our High School Majors',
        titleHe: 'בוחרים מגמות לתיכון',
        storyHookHe: 'המעבר לתיכון מתקרב בצעדי ענק! ביוטכנולוגיה, אמנות, מחשבים או פיזיקה? נתרגל תנאים וקבלת החלטות לעתיד.',
        grammarTopic: 'Conditionals Synthesis (Zero, First, and Second Conditional)',
        skills: ['Conditionals Review', 'High School Majors', 'Decision Making'],
        sentenceEn: 'If you choose computer science, you will build applications that solve real problems.',
        sentenceHe: 'אם תבחרו במדעי המחשב, תבנו יישומים שפותרים בעיות אמיתיות.',
        vocab: [
          ['academic', 'adjective', 'אקדמי / לימודי', '🎓', 'High school offers rigorous academic programs.', 'בית הספר התיכון מציע תוכניות אקדמיות מאתגרות.'],
          ['curriculum', 'noun', 'תוכנית לימודים', '📖', 'The curriculum includes literature, science, and history.', 'תוכנית הלימודים כוללת ספרות, מדע והיסטוריה.'],
          ['ambition', 'noun', 'שאיפה / אמביציה', '🚀', 'Her ambition is to become an aerospace engineer.', 'שאיפתה היא להפוך למהנדסת אווירוחלל.'],
          ['career', 'noun', 'קריירה / מסלול מקצועי', '💼', 'Choosing a major is the first step toward a career.', 'בחירת מגמה היא הצעד הראשון לקראת קריירה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'vacation', translationHe: 'חופשה' },
            { wordEn: 'hobby', translationHe: 'תחביב' },
          ],
          shortSentenceEn: 'You will build applications.',
          shortSentenceHe: 'אתם תבנו יישומים.',
          rule: {
            questionEn: 'Which sentence correctly expresses a realistic future choice?',
            correct: 'If I study physics, I will prepare for university engineering.',
            wrong: [
              'If I will study physics, I will prepare for university engineering.',
              'If I study physics, I prepared for university engineering.',
            ],
            explainHe: 'בתנאי ראשון (First Conditional) לחלק התנאי נכנס הווה פשוט (study) ולחלק התוצאה will + מקור.',
            hintHe: 'בתנאי ראשון: אחרי If הווה פשוט (בלי will), ובתוצאה will + פועל בסיסי.',
          },
          story: {
            passageEn:
              'Ninth graders met with high school counselors to discuss their academic majors. Liam wants to explore biotechnology because he loves biology. "If you take advanced chemistry, you will develop strong laboratory skills," explained the advisor. Liam felt excited about the upcoming challenges of high school.',
            passageHe:
              'תלמידי כיתה ט׳ נפגשו עם יועצי התיכון כדי לדון במגמות הלימוד שלהם. ליאם רוצה לחקור ביוטכנולוגיה כי הוא אוהב ביולוגיה. "אם תלמד כימיה מוגברת, תפתח מיומנויות מעבדה חזקות," הסביר היועץ. ליאם הרגיש נרגש לקראת האתגרים הקרובים בתיכון.',
            questionEn: 'Why does Liam want to choose the biotechnology major?',
            questionHe: 'מדוע ליאם רוצה לבחור במגמת ביוטכנולוגיה?',
            correct: 'Because he loves biology.',
            wrong: [
              'Because his parents forced him.',
              'Because it has no exams.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If Dan practices daily, he will play better.',
                wrong: ['If Dan will practice daily, he plays better.'],
                explainHe: 'בתנאי ראשון: אחרי If בא Present Simple (practices), ובתוצאה will + פועל מקור.',
                hintHe: 'מצב אפשרי בעתיד: מה בא אחרי If, ומה בא אחרי will?',
              },
              story: {
                passageEn: 
                  'Tamar wants to be a doctor. She studies hard every day. If she gets good grades, she will go to medical school.',
                passageHe: 
                  'תמר רוצה להיות רופאה. היא לומדת קשה בכל יום. אם היא תקבל ציונים טובים, היא תלך ללימודי רפואה.',
                questionEn: 'What will Tamar do if she gets good grades?',
                questionHe: 'מה תמר תעשה אם תקבל ציונים טובים?',
                correct: 'Go to medical school.',
                wrong: ['Go on a long trip.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['tropical', 'rural'],
                ['cafeteria', 'uniform'],
                ['regret', 'salary'],
                ['retirement', 'vacation'],
              ],
            },
            master: {
              sentenceEn: 'If I could study abroad I would choose marine biology at a famous university.',
              sentenceHe: 'אילו יכולתי ללמוד בחו״ל הייתי בוחר/ת בביולוגיה ימית באוניברסיטה מפורסמת.',
              decoys: ['will', 'can'],
              voiceEn: 'If I pass the exam I will celebrate.',
              voiceHe: 'אם אעבור את הבחינה אחגוג.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If she works hard this year, she will get into a good program.',
                wrong: [
                  'If she will work hard this year, she will get into a good program.',
                  'If she worked hard this year, she will get into a good program.',
                  'If she works hard this year, she would gets into a good program.',
                ],
                explainHe: 
                  'תנאי ראשון: If + Present Simple (works), ובתוצאה will + פועל מקור (get). אין will אחרי If.',
                hintEn: 'Check the tense after If and after will.',
              },
              story: {
                passageEn: 
                  'Eden loves both painting and mathematics, and she cannot decide which major to choose. Her father says that art is only a hobby. Her aunt, an architect, tells a different story: if Eden studies design, she will use drawing and geometry every single day. After visiting the office, Eden stopped worrying and began to collect information about architecture programs.',
                passageHe: '',
                questionEn: 'Why did Eden stop worrying after visiting her aunt?',
                questionHe: '',
                correct: 'She found a career that mixes both interests.',
                wrong: [
                  'Her aunt promised to pay for all her university studies.',
                  'She decided to give up painting.',
                  'Her father changed his mind about math.',
                ],
              },
              storyHintEn: 'Think about what architecture needs from Eden.',
            },
          },
        },
      },
      {
        icon: '🎉',
        isBoss: true,
        titleEn: 'Boss: Graduation Gala & High School Ready',
        titleHe: 'אתגר הבוס: נשף הסיום ומוכנים לתיכון',
        storyHookHe: 'אתגר מסכם ענק לחטיבת הביניים: סיום כיתה ט׳ והמעבר לחטיבה העליונה! הוכיחו שליטה בכל אוצר המילים והמבנים של Band II ו-Band III.',
        grammarTopic: 'Comprehensive Middle School Mastery Review',
        skills: ['Boss Challenge', 'Band III Readiness', 'High School Transition'],
        sentenceEn: 'Having completed junior high school, we are fully prepared for the exciting challenges ahead.',
        sentenceHe: 'לאחר שסיימנו את חטיבת הביניים, אנחנו מוכנים לחלוטין לאתגרים המרגשים שלפנינו.',
        vocab: [
          ['graduation', 'noun', 'סיום לימודים / טקס סיום', '🎓', 'Family and friends attended the festive graduation.', 'משפחה וחברים השתתפו בטקס הסיום החגיגי.'],
          ['capability', 'noun', 'יכולת / כושר', '💪', 'Every student has the capability to excel in English.', 'לכל תלמיד/ה יש היכולת להצטיין באנגלית.'],
          ['future', 'noun', 'עתיד', '🌅', 'Hard work today builds a successful future.', 'עבודה קשה היום בונה עתיד מוצלח.'],
          ['celebrate', 'verb', 'לחגוג', '🎊', 'We celebrate three years of friendship and growth.', 'אנחנו חוגגים שלוש שנים של חברות וצמיחה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disappointment', translationHe: 'אכזבה' },
            { wordEn: 'regret', translationHe: 'חרטה' },
          ],
          shortSentenceEn: 'We are prepared for challenges.',
          shortSentenceHe: 'אנחנו מוכנים לאתגרים.',
          rule: {
            questionEn: 'Which sentence demonstrates proper Band III formal English structure?',
            correct: 'Students who show dedication will succeed in advanced high school courses.',
            wrong: [
              'Students which shows dedication will succeed in advanced high school courses.',
              'Students who shows dedication will succeed in advanced high school courses.',
            ],
            explainHe: 'עבור רבים (Students) כינוי הזיקה לבני אדם הוא who והפועל בלשון רבים הוא show (ללא s).',
            hintHe: 'Students הם אנשים ברבים: צריך כינוי זיקה לאנשים, ופועל שמתאים לרבים (בלי s).',
          },
          story: {
            passageEn:
              'The junior high graduation ceremony began as music echoed through the hall. Three years of projects, debates, sports tournaments, and exams culminated in this memorable evening. Standing on the stage, the student representative reminded everyone: "We have learned together, we have supported one another through challenges, and we are stepping into high school with confidence and curiosity."',
            passageHe:
              'טקס הסיום של חטיבת הביניים החל כאשר מוזיקה הדהדה באולם. שלוש שנים של פרויקטים, דיבייטים, טורנירי ספורט ומבחנים הגיעו לשיאם בערב בלתי נשכח זה. בעומדו על הבמה, נציג התלמידים הזכיר לכולם: "למדנו יחד, תמכנו זה בזה באתגרים, ואנחנו צועדים אל התיכון עם ביטחון וסקרנות."',
            questionEn: 'With what mindset are the students entering high school?',
            questionHe: 'עם איזו גישה נכנסים התלמידים לבית הספר התיכון?',
            correct: 'With confidence and curiosity.',
            wrong: [
              'With fear and sadness.',
              'Without any preparation.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We have finished ninth grade.',
                wrong: ['We has finished ninth grade.'],
                explainHe: 'עם We משתמשים ב-have: We have finished.',
                hintHe: 'We הוא רבים. איזה פועל עזר מתאים: has או have?',
              },
              story: {
                passageEn: 
                  'Today is the last day of school. The students wear nice clothes. They take photos and eat cake.',
                passageHe: 
                  'היום הוא היום האחרון בבית הספר. התלמידים לובשים בגדים יפים. הם מצטלמים ואוכלים עוגה.',
                questionEn: 'What do the students eat?',
                questionHe: 'מה התלמידים אוכלים?',
                correct: 'Cake.',
                wrong: ['Pizza.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['exam', 'lecture'],
                ['schedule', 'uniform'],
                ['childhood', 'memory'],
                ['postpone', 'cancel'],
              ],
            },
            master: {
              sentenceEn: 
                'Students who work hard now will have more options when they finish high school.',
              sentenceHe: 'לתלמידים שעובדים קשה עכשיו יהיו יותר אפשרויות כשיסיימו את התיכון.',
              decoys: ['which', 'had'],
              voiceEn: 'We have grown a lot this year.',
              voiceHe: 'גדלנו המון השנה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The teacher who helped us most will attend the graduation party.',
                wrong: [
                  'The teacher which helped us most will attend the graduation party.',
                  'The teacher who helped us most will attends the graduation party.',
                  'The teacher who help us most will attend the graduation party.',
                ],
                explainHe: 
                  'לאדם משתמשים ב-who. אחרי will בא פועל מקור (attend), ו-helped בעבר מתאים לסיפור על עזרה שכבר קרתה.',
                hintEn: 'Check the linking word and the verbs.',
              },
              story: {
                passageEn: 
                  'On the last day of ninth grade, Itay found a letter that he had written to himself in seventh grade. He had promised to join the football team and to stop being shy. He read it twice and smiled, because he had done both things, and he had also made friends who would be with him next year at the same high school. He put the letter in his bag to keep for the future.',
                passageHe: '',
                questionEn: 'How does Itay feel about his three years at school?',
                questionHe: '',
                correct: 'He is proud of how much he has changed.',
                wrong: [
                  'He is sorry he joined the football team.',
                  'He wants to repeat seventh grade.',
                  'He is afraid of meeting new friends.',
                ],
              },
              storyHintEn: 'Think about why Itay smiled.',
            },
          },
        },
      },
    ],
  },
]);
