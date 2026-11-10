import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNIT_SEASON2_1: HighSchoolUnitSpec = {
  ...packUnitNumbers('season2-1'),
  titleEn: 'Wishes, Regrets & If Only',
  titleHe: 'משאלות, חרטות ו-If only',
  subtitleHe: 'עונה 2: הבעת משאלות על ההווה ועל העבר (I wish / If only + Past Simple / Past Perfect)',
  badgeEmoji: '🌟',
  missions: [
    {
      icon: '💭',
      titleEn: 'Wishing for a Different Present',
      titleHe: 'משאלה להווה אחר',
      storyHookHe:
        'הרפתקת בונוס של עונה 2: איך מביעים רצון שהמצב עכשיו יהיה אחר? נלמד את המבנה I wish / If only + Past Simple, שמדבר על ההווה למרות שהפועל נראה כמו עבר.',
      grammarTopic: 'I wish / If only + Past Simple (wishes about the present)',
      skills: ['Wish Clauses', 'Expressing Desire', 'Character Analysis'],
      sentenceEn: 'Dana wishes she lived closer to the sea, but her family cannot move.',
      sentenceHe: 'דנה הייתה רוצה לגור קרוב יותר לים, אבל המשפחה שלה לא יכולה לעבור.',
      vocab: [
        [
          'yearn',
          'verb',
          'להשתוקק / לערוג',
          '💭',
          'Many teenagers yearn for more freedom and independence.',
          'בני נוער רבים משתוקקים ליותר חופש ועצמאות.',
        ],
        [
          'aspiration',
          'noun',
          'שאיפה / מטרה רחוקה',
          '🚀',
          'Her greatest aspiration is to design sustainable buildings.',
          'השאיפה הגדולה ביותר שלה היא לתכנן מבנים ירוקים.',
        ],
        [
          'envious',
          'adjective',
          'מקנא / קנאי',
          '👀',
          'He felt envious of his cousin\'s new apartment in Haifa.',
          'הוא הרגיש קנאה בדירה החדשה של בן דודו בחיפה.',
        ],
        [
          'circumstance',
          'noun',
          'נסיבה / מצב',
          '🧭',
          'We cannot always control the circumstances of our lives.',
          'איננו יכולים תמיד לשלוט בנסיבות חיינו.',
        ],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'neglect', translationHe: 'להזניח' },
          { wordEn: 'refuse', translationHe: 'לסרב' },
        ],
        shortSentenceEn: 'I wish I had wings.',
        shortSentenceHe: 'הלוואי שהיו לי כנפיים.',
        rule: {
          questionEn: 'Which sentence expresses a wish about the PRESENT correctly?',
          correct: 'I wish I knew the answer to this riddle.',
          wrong: ['I wish I know the answer to this riddle.', 'I wish I will know the answer to this riddle.'],
          explainHe:
            'משאלה על ההווה בנויה מ-I wish + Past Simple: I wish I knew. הפועל נראה כמו עבר, אבל המשמעות היא "הלוואי שידעתי עכשיו".',
          hintHe: 'משאלה על ההווה "זזה" זמן אחד אחורה. איזה פועל כתוב בצורת עבר, למרות שמדובר על עכשיו?',
        },
        story: {
          passageEn:
            'Noam is seventeen and lives in a small town in the Negev. He yearns to study film, but the nearest film school is three hours away. "If only there were a bus that left earlier," he often says. His aspiration keeps him busy: every weekend he edits short videos about his neighbors.',
          passageHe:
            'נועם בן שבע-עשרה וגר בעיירה קטנה בנגב. הוא משתוקק ללמוד קולנוע, אבל בית הספר לקולנוע הקרוב נמצא במרחק שלוש שעות. "הלוואי שהיה אוטובוס שיוצא מוקדם יותר," הוא אומר לעתים קרובות. השאיפה שלו מעסיקה אותו: בכל סוף שבוע הוא עורך סרטונים קצרים על השכנים שלו.',
          questionEn: 'What does Noam do every weekend?',
          questionHe: 'מה נועם עושה בכל סוף שבוע?',
          correct: 'He edits short videos about his neighbors.',
          wrong: ['He travels to the film school by bus.', 'He works in a cinema in the Negev.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is correct?',
              correct: 'I wish I had a bigger room.',
              wrong: ['I wish I have a bigger room.'],
              explainHe: 
                'כשמבטאים משאלה על ההווה אחרי I wish משתמשים בצורת עבר פשוט (had), גם אם מדובר בהווה.',
              hintHe: 'כדאי לבדוק באיזו צורה בא הפועל אחרי I wish.',
            },
            story: {
              passageEn: 
                'Noa lives in a small flat. She wishes she had a garden. She dreams of planting flowers.',
              passageHe: 'נועה גרה בדירה קטנה. היא מייחלת שתהיה לה גינה. היא חולמת לשתול פרחים.',
              questionEn: 'What does Noa wish for?',
              questionHe: 'מה נועה מייחלת לו?',
              correct: 'A garden of her own.',
              wrong: ['A new school.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['blame', 'scold'],
              ['complaint', 'frustration'],
              ['capable', 'tolerant'],
              ['warranty', 'ornament'],
            ],
          },
          master: {
            sentenceEn: 'Many teenagers wish they lived in a city where public transport ran all night.',
            sentenceHe: 'בני נוער רבים מייחלים לגור בעיר שבה התחבורה הציבורית פועלת כל הלילה.',
            decoys: ['live', 'runs'],
            voiceEn: 'I wish we had a faster train.',
            voiceHe: 'הלוואי שהייתה לנו רכבת מהירה יותר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I wish I owned a house near the beach.',
              wrong: [
                'I wish I own a house near the beach.',
                'I wish I will own a house near the beach.',
                'I wish I would owned a house near the beach.',
              ],
              explainHe: 
                'משאלה על ההווה: I wish + עבר פשוט (owned). אי אפשר להשתמש בהווה, ב-will, או ב-would עם עבר.',
              hintEn: 'Look at the verb form directly after I wish.',
            },
            story: {
              passageEn: 
                'Eitan\'s brother lives in Berlin and posts photos of snowy streets and quiet cafes. Eitan, who has never left the country, scrolls through them every evening. He often tells his mother that he wishes he had grown up somewhere with real seasons. His mother only smiles and reminds him that his brother recently asked about the sunsets in Tel Aviv. Eitan puts down his phone and looks out of the window. Outside, the sky is turning orange.',
              passageHe: '',
              questionEn: 'What is the mother trying to show Eitan?',
              questionHe: '',
              correct: 'Others also envy the life he has.',
              wrong: [
                'His brother is lonely in Berlin.',
                'He should move to Berlin at once.',
                'Snow is dangerous for children.',
              ],
            },
            storyHintEn: 'Think about what his brother asked about.',
          },
        },
      },
    },
    {
      icon: '⏪',
      titleEn: 'If Only I Had Known: Past Regrets',
      titleHe: 'אילו רק ידעתי: חרטות על העבר',
      storyHookHe:
        'לפעמים מסתכלים אחורה ומצטערים על בחירה. נלמד את המבנה I wish / If only + Past Perfect (had + V3) לתיאור חרטה על משהו שכבר קרה.',
      grammarTopic: 'I wish / If only + Past Perfect (regrets about the past)',
      skills: ['Wish Clauses', 'Expressing Regret', 'Third Conditional Review'],
      sentenceEn: 'If only the captain had checked the weather report before the voyage.',
      sentenceHe: 'אילו רק הקברניט היה בודק את תחזית מזג האוויר לפני ההפלגה.',
      vocab: [
        [
          'regret',
          'noun',
          'חרטה / צער על מעשה',
          '😢',
          'She has no regret about leaving the team.',
          'אין לה שום חרטה על כך שעזבה את הקבוצה.',
        ],
        [
          'hindsight',
          'noun',
          'חוכמה בדיעבד / מבט לאחור',
          '🔎',
          'In hindsight, the decision was clearly a mistake.',
          'במבט לאחור, ההחלטה הייתה בבירור טעות.',
        ],
        [
          'reckless',
          'adjective',
          'פזיז / חסר אחריות',
          '⚡',
          'Reckless driving causes many accidents on our roads.',
          'נהיגה פזיזה גורמת לתאונות רבות בכבישים שלנו.',
        ],
        [
          'reconcile',
          'verb',
          'להתפייס / ליישב מחלוקת',
          '🤝',
          'The two brothers finally reconciled after years of silence.',
          'שני האחים התפייסו לבסוף אחרי שנים של שתיקה.',
        ],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'foresight', translationHe: 'ראיית הנולד' },
          { wordEn: 'pride', translationHe: 'גאווה' },
        ],
        shortSentenceEn: 'If only I had listened.',
        shortSentenceHe: 'אילו רק הקשבתי.',
        rule: {
          questionEn: 'Which sentence expresses regret about the PAST correctly?',
          correct: 'I wish I had saved my work before the computer crashed.',
          wrong: [
            'I wish I saved my work before the computer crashed.',
            'I wish I would save my work before the computer crashed.',
          ],
          explainHe:
            'חרטה על העבר בנויה מ-I wish + Past Perfect (had + V3). המחשב כבר קרס, ולכן משתמשים ב-had saved.',
          hintHe: 'האירוע כבר קרה ואי אפשר לשנות אותו. כדאי לחפש את המבנה שזז זמן אחד אחורה מהעבר הפשוט.',
        },
        story: {
          passageEn:
            'Yael and her best friend argued about a school project and stopped talking for a whole year. In hindsight, the argument was about something very small. "I wish I had called her that same evening," Yael admits. Last month the two friends finally reconciled at a mutual friend\'s birthday party.',
          passageHe:
            'יעל והחברה הכי טובה שלה רבו על פרויקט בבית הספר והפסיקו לדבר שנה שלמה. במבט לאחור, הוויכוח היה על משהו קטן מאוד. "הלוואי שהייתי מתקשרת אליה באותו ערב," יעל מודה. בחודש שעבר שתי החברות התפייסו לבסוף במסיבת יום הולדת של חברה משותפת.',
          questionEn: 'Where did the two friends finally make peace?',
          questionHe: 'איפה שתי החברות השלימו לבסוף?',
          correct: 'At a mutual friend\'s birthday party.',
          wrong: ['In the school library after the project.', 'On the phone that same evening.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is correct?',
              correct: 'If only I had studied harder!',
              wrong: ['If only I have studied harder!'],
              explainHe: 'חרטה על העבר: If only + had + V3. אי אפשר להשתמש ב-have.',
              hintHe: 'כדאי לחשוב איזה פועל עזר מתאים לעבר.',
            },
            story: {
              passageEn: 
                'Gal left his phone on the bus. He ran after it, but it was too late. He wishes he had checked his bag.',
              passageHe: 
                'גל השאיר את הטלפון שלו באוטובוס. הוא רץ אחריו, אבל זה היה מאוחר מדי. הוא מצטער שלא בדק את התיק.',
              questionEn: 'Where did Gal leave his phone?',
              questionHe: 'איפה גל השאיר את הטלפון?',
              correct: 'On the bus.',
              wrong: ['At school.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['reward', 'permission'],
              ['advance', 'genius'],
              ['skilled', 'patient'],
              ['divorce', 'evacuate'],
            ],
          },
          master: {
            sentenceEn: 
              'If only the council had listened to the engineers before the old bridge collapsed.',
            sentenceHe: 'הלוואי שהמועצה הייתה מקשיבה למהנדסים לפני שהגשר הישן קרס.',
            decoys: ['has', 'listen'],
            voiceEn: 'I wish I had listened earlier.',
            voiceHe: 'הלוואי שהייתי מקשיב/ה קודם.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If only we had left before the storm began.',
              wrong: [
                'If only we have left before the storm began.',
                'If only we would leave before the storm began.',
                'If only we had leave before the storm began.',
              ],
              explainHe: 
                'חרטה על העבר: If only + had + V3 (had left). לא משתמשים ב-have, ב-would, או ב-V1 אחרי had.',
              hintEn: 'Look at the two words after If only we.',
            },
            story: {
              passageEn: 
                'For years, Hadas avoided speaking to her sister after a quarrel over their grandmother\'s house. When the old woman died, the relatives gathered, and the two sisters sat at opposite ends of the room. At the end of the evening, Hadas found a letter in the kitchen drawer, written in her grandmother\'s careful handwriting. It asked them only to share the garden and to remember the summers they had spent there. Hadas read it twice, then walked slowly across the room.',
              passageHe: '',
              questionEn: 'Why did Hadas walk across the room?',
              questionHe: '',
              correct: 'She decided to end the quarrel.',
              wrong: [
                'She needed to find the kitchen drawer.',
                'She hoped to sell the family house.',
                'Her sister had called her loudly.',
              ],
            },
            storyHintEn: 'Think about what the letter asked them to remember.',
          },
        },
      },
    },
    {
      icon: '🔮',
      isBoss: true,
      titleEn: 'Boss: The Three Wishes Unseen',
      titleHe: 'בוס: קטע Unseen של שלוש המשאלות',
      storyHookHe:
        'משימת בוס של עונה 2: סיפור עממי על שלוש משאלות שמתגשמות בדרך מפתיעה. עליכם להבחין בין משאלה על ההווה לחרטה על העבר ולענות על שאלות ברמת בגרות!',
      grammarTopic: 'Wish Clauses Synthesis (Present & Past)',
      skills: ['Wish Clauses Mastery', 'Folk Tale Analysis', 'Bagrut Unseen'],
      sentenceEn: 'The old fisherman wished he had asked for wisdom instead of gold.',
      sentenceHe: 'הדייג הזקן התחרט שלא ביקש חוכמה במקום זהב.',
      vocab: [
        [
          'grant',
          'verb',
          'להעניק / להגשים (משאלה)',
          '🎁',
          'The magic fish agreed to grant him three wishes.',
          'דג הקסמים הסכים להגשים לו שלוש משאלות.',
        ],
        [
          'nostalgia',
          'noun',
          'נוסטלגיה / געגוע לעבר',
          '📷',
          'Old family photos fill my grandfather with nostalgia.',
          'תמונות משפחתיות ישנות ממלאות את סבי בנוסטלגיה.',
        ],
        [
          'ambition',
          'noun',
          'שאפתנות / שאיפה',
          '🏔️',
          'Without ambition, talent alone rarely leads to success.',
          'בלי שאפתנות, כישרון לבדו רק לעתים רחוקות מוביל להצלחה.',
        ],
        [
          'sacrifice',
          'noun',
          'הקרבה / ויתור',
          '❤️',
          'Raising a family often requires personal sacrifice.',
          'גידול משפחה דורש לעתים קרובות הקרבה אישית.',
        ],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'deny', translationHe: 'לשלול / להכחיש' },
          { wordEn: 'borrow', translationHe: 'לשאול / ללוות' },
        ],
        shortSentenceEn: 'The fish granted three wishes.',
        shortSentenceHe: 'הדג הגשים שלוש משאלות.',
        rule: {
          questionEn: 'Which sentence is about the PAST, not the present?',
          correct: 'If only he had stayed in his village.',
          wrong: ['If only he stayed in his village.', 'If only he were in his village.'],
          explainHe:
            'had stayed הוא Past Perfect, ולכן המשאלה מדברת על העבר. stayed ו-were במשאלה מדברים על ההווה.',
          hintHe: 'שתי אפשרויות מדברות על עכשיו. איזו משתמשת בצורה של "עבר לפני העבר"?',
        },
        story: {
          passageEn:
            'In an old folk tale, a poor fisherman catches a golden fish that can speak. In return for its freedom, the fish grants him three wishes. First he asks for a palace, then for a mountain of gold. Lonely in his huge palace, he finally wishes he had stayed in his little hut with his friends.',
          passageHe:
            'בסיפור עם עתיק, דייג עני תופס דג זהב שיודע לדבר. בתמורה לחירותו, הדג מגשים לו שלוש משאלות. תחילה הוא מבקש ארמון, ואחר כך הר של זהב. בודד בארמון הענק שלו, הוא מתחרט לבסוף שלא נשאר בבקתה הקטנה שלו עם חבריו.',
          questionEn: 'Why does the fisherman feel regret at the end of the tale?',
          questionHe: 'למה הדייג מתחרט בסוף הסיפור?',
          correct: 'He is lonely in his huge palace.',
          wrong: ['The fish takes back the mountain of gold.', 'His hut is destroyed by a storm.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is correct?',
              correct: 'I wish I had never lost the key.',
              wrong: ['I wish I have never lost the key.'],
              explainHe: 'משאלה על העבר: I wish + had + V3.',
              hintHe: 'כדאי לבדוק: האם המשאלה על העבר או על ההווה?',
            },
            story: {
              passageEn: 
                'A girl found a magic lamp. She wished for a huge cake. But she wished she had asked for a friend.',
              passageHe: 'ילדה מצאה מנורת קסמים. היא ביקשה עוגה ענקית. אבל היא הצטערה שלא ביקשה חבר.',
              questionEn: 'What did the girl wish for first?',
              questionHe: 'מה הילדה ביקשה קודם?',
              correct: 'A huge cake.',
              wrong: ['A new bike.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['describe', 'withdraw'],
              ['equipment', 'evidence'],
              ['scenery', 'moisture'],
              ['inheritance', 'vacation'],
            ],
          },
          master: {
            sentenceEn: 
              'The poor woodcutter wished he had asked for happiness rather than a mountain of treasure.',
            sentenceHe: 'חוטב העצים העני הצטער שלא ביקש אושר במקום הר של אוצרות.',
            decoys: ['asks', 'wish'],
            voiceEn: 'He wishes he had been braver.',
            voiceHe: 'הוא מצטער שלא היה אמיץ יותר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'She wishes she had spent more time with her parents.',
              wrong: [
                'She wishes she spends more time with her parents.',
                'She wishes she would have spent more time with her parents.',
                'She wishes she had spend more time with her parents.',
              ],
              explainHe: 
                'משאלה על העבר: wishes + had + V3 (had spent). לא משתמשים בהווה, ב-would have, או ב-V1 אחרי had.',
              hintEn: 'Check the verb form after she wishes she.',
            },
            story: {
              passageEn: 
                'The king of a small valley was offered one wish by a passing traveler. After days of thought, he asked for the tallest tower in the world, so that every neighbor would admire him. The tower rose above the clouds, but its shadow covered the farms below, and the harvests failed. Hungry villagers climbed to his gate with empty baskets. The king looked at his magnificent view and found that he could no longer see a single green field.',
              passageHe: '',
              questionEn: 'What lesson does the story suggest?',
              questionHe: '',
              correct: 'Pride can bring unexpected harm.',
              wrong: [
                'Large towers always protect farmers.',
                'Travelers should never make offers.',
                'Kings must choose wishes quickly.',
              ],
            },
            storyHintEn: 'Think about who was affected by the shadow.',
          },
        },
      },
    },
  ],
};

const UNIT_SEASON2_2: HighSchoolUnitSpec = {
  ...packUnitNumbers('season2-2'),
  titleEn: 'Getting Things Done: The Causative',
  titleHe: 'לדאוג שיעשו בשבילנו: הגרם (Causative)',
  subtitleHe: 'עונה 2: have / get something done, שירותים, תיקונים וסיום העונה',
  badgeEmoji: '🛠️',
  missions: [
    {
      icon: '🏗️',
      titleEn: 'Have It Done: Services & Renovations',
      titleHe: 'Have it done: שירותים ושיפוצים',
      storyHookHe:
        'כשאנחנו לא עושים משהו בעצמנו אלא משלמים למישהו אחר שיעשה אותו, משתמשים בגרם (Causative): have + object + V3. נצא להרפתקת שיפוץ של דירה ישנה!',
      grammarTopic: 'Causative: have + object + V3',
      skills: ['Causative Have', 'Passive Voice Review', 'Everyday Services'],
      sentenceEn: 'The Levi family had their old kitchen renovated by a local company last spring.',
      sentenceHe: 'משפחת לוי שיפצה את המטבח הישן שלה בעזרת חברה מקומית באביב שעבר.',
      vocab: [
        [
          'renovate',
          'verb',
          'לשפץ / לחדש',
          '🏗️',
          'The city plans to renovate the old train station.',
          'העירייה מתכננת לשפץ את תחנת הרכבת הישנה.',
        ],
        [
          'technician',
          'noun',
          'טכנאי',
          '🛠️',
          'A technician came to fix the air conditioner.',
          'טכנאי הגיע לתקן את המזגן.',
        ],
        [
          'appliance',
          'noun',
          'מכשיר חשמלי ביתי',
          '🔌',
          'Modern kitchen appliances save a lot of electricity.',
          'מכשירי מטבח מודרניים חוסכים הרבה חשמל.',
        ],
        [
          'install',
          'verb',
          'להתקין',
          '🔧',
          'We need to install solar panels on the roof.',
          'אנחנו צריכים להתקין פאנלים סולאריים על הגג.',
        ],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'demolish', translationHe: 'להרוס' },
          { wordEn: 'abandon', translationHe: 'לנטוש' },
        ],
        shortSentenceEn: 'We had the roof repaired.',
        shortSentenceHe: 'תיקנו את הגג (בעזרת בעל מקצוע).',
        rule: {
          questionEn: 'Which sentence shows that someone ELSE did the work for Ron?',
          correct: 'Ron had his car washed at the station.',
          wrong: ['Ron washed his car at the station.', 'Ron had washed his car at the station.'],
          explainHe:
            'have + object + V3 (had his car washed) אומר שמישהו אחר עשה את העבודה בשביל רון. had washed his car הוא Past Perfect: רון עשה זאת בעצמו.',
          hintHe: 'במבנה גרימה (causative), החפץ בא לפני הפועל בצורת V3. בדקו איפה נמצא his car בכל משפט.',
        },
        story: {
          passageEn:
            'When Grandma Rivka bought an old apartment in Jaffa, nothing worked properly. She had the walls painted and the windows replaced in the first month. Then a technician installed new appliances in the kitchen. Today the apartment looks modern, but it still keeps its beautiful old arches.',
          passageHe:
            'כשסבתא רבקה קנתה דירה ישנה ביפו, שום דבר לא עבד כמו שצריך. בחודש הראשון היא דאגה שיצבעו את הקירות ויחליפו את החלונות. אחר כך טכנאי התקין מכשירים חדשים במטבח. היום הדירה נראית מודרנית, אבל היא עדיין שומרת על הקשתות הישנות והיפות שלה.',
          questionEn: 'What did the apartment keep after the renovation?',
          questionHe: 'על מה הדירה שמרה אחרי השיפוץ?',
          correct: 'Its beautiful old arches.',
          wrong: ['Its old kitchen appliances.', 'Its original windows.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is correct?',
              correct: 'We had the roof repaired last week.',
              wrong: ['We had the roof repair last week.'],
              explainHe: 'במבנה הסיבתי have + מושא + V3, הפועל בא בצורת V3 (repaired).',
              hintHe: 'כדאי לבדוק: מי עושה את התיקון, אנחנו או מישהו אחר?',
            },
            story: {
              passageEn: 
                'The washing machine broke. Dad called a technician. The technician fixed it in one hour.',
              passageHe: 'מכונת הכביסה התקלקלה. אבא התקשר לטכנאי. הטכנאי תיקן אותה בתוך שעה.',
              questionEn: 'Who fixed the washing machine?',
              questionHe: 'מי תיקן את מכונת הכביסה?',
              correct: 'A technician did.',
              wrong: ['Dad did.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['impress', 'scold'],
              ['sandwich', 'dictionary'],
              ['curtain', 'cupboard'],
              ['pronounce', 'inherit'],
            ],
          },
          master: {
            sentenceEn: 
              'We are having the whole apartment repainted by professionals before our relatives arrive next month.',
            sentenceHe: 
              'אנחנו נותנים לאנשי מקצוע לצבוע מחדש את כל הדירה לפני שהקרובים שלנו מגיעים בחודש הבא.',
            decoys: ['paint', 'repaints'],
            voiceEn: 'I had my laptop repaired yesterday.',
            voiceHe: 'תיקנו לי את המחשב הנייד אתמול.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'They had the windows cleaned by a local company.',
              wrong: [
                'They had the windows clean by a local company.',
                'They had cleaned the windows by a local company.',
                'They had the windows cleaning by a local company.',
              ],
              explainHe: 'במבנה have + מושא + V3, הפועל אחרי המושא הוא V3 (cleaned). לא V1, ולא V-ing.',
              hintEn: 'Look at the word right after the windows.',
            },
            story: {
              passageEn: 
                'When the Cohens bought their house, the electrician warned that the wiring was forty years old. They hesitated because the cost was high, so for months they used extension cords in every room. One evening a fuse burned out and half the street lost power. The next morning they called the company and arranged a complete replacement. Mrs Cohen later joked that the expensive visit had cost far less than the evening of darkness would have.',
              passageHe: '',
              questionEn: 'Why did the Cohens finally replace the wiring?',
              questionHe: '',
              correct: 'They saw that waiting was risky.',
              wrong: [
                'A neighbor offered them a discount.',
                'They wanted to sell the house soon.',
                'The extension cords were too short.',
              ],
            },
            storyHintEn: 'Think about what happened to the whole street.',
          },
        },
      },
    },
    {
      icon: '✂️',
      titleEn: 'Get It Done: Tailors, Portraits & Inspections',
      titleHe: 'Get it done: חייטים, דיוקנאות ובדיקות',
      storyHookHe:
        'בשפה מדוברת אומרים לעתים קרובות get + object + V3 במקום have. נלמד מתי משתמשים בו, ואיך משנים את הזמן דרך הפועל get עצמו (got, will get, is getting).',
      grammarTopic: 'Causative: get + object + V3 & tense changes',
      skills: ['Causative Get', 'Tense Control', 'Informal Register'],
      sentenceEn: 'Before the prom, Maya got her grandmother\'s dress altered by a skilled tailor.',
      sentenceHe: 'לפני הנשף, מאיה דאגה שחייט מיומן יתאים לה את השמלה של סבתה.',
      vocab: [
        [
          'alter',
          'verb',
          'לשנות / להתאים (בגד)',
          '✂️',
          'The new evidence may alter the result of the trial.',
          'הראיות החדשות עשויות לשנות את תוצאת המשפט.',
        ],
        [
          'tailor',
          'noun',
          'חייט',
          '🧵',
          'My uncle has worked as a tailor for forty years.',
          'הדוד שלי עובד כחייט כבר ארבעים שנה.',
        ],
        [
          'portrait',
          'noun',
          'דיוקן / תמונת פנים',
          '🖼️',
          'A famous artist painted a portrait of the queen.',
          'אמן מפורסם צייר דיוקן של המלכה.',
        ],
        [
          'inspect',
          'verb',
          'לבדוק / לפקח',
          '🔍',
          'Officials inspect every restaurant twice a year.',
          'פקחים בודקים כל מסעדה פעמיים בשנה.',
        ],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'preserve', translationHe: 'לשמר' },
          { wordEn: 'ignore', translationHe: 'להתעלם' },
        ],
        shortSentenceEn: 'She got her hair cut.',
        shortSentenceHe: 'היא הסתפרה (אצל ספר).',
        rule: {
          questionEn: 'Choose the correct FUTURE causative: "Next week we ____ the boiler checked."',
          correct: 'will get',
          wrong: ['got', 'are getting to'],
          explainHe:
            'במבנה גרימה (causative), הזמן משתנה רק בפועל get או have. Next week מראה עתיד, ולכן will get, ואחריו החפץ ו-V3 (the boiler checked).',
          hintHe: 'הביטוי Next week מראה מתי זה יקרה. רק הפועל הראשון משנה זמן; checked נשאר תמיד אותו דבר.',
        },
        story: {
          passageEn:
            'Every summer, the Cohen family gets a portrait taken at the same beach in Netanya. This year, however, the camera fell into the sand. Instead of buying a new one, they got it inspected at a small repair shop. The owner fixed it in one hour, and the family portrait was taken at sunset as usual.',
          passageHe:
            'בכל קיץ משפחת כהן מצטלמת לתמונה משפחתית באותו חוף בנתניה. אבל השנה המצלמה נפלה לחול. במקום לקנות מצלמה חדשה, הם דאגו שיבדקו אותה בחנות תיקונים קטנה. הבעלים תיקן אותה בתוך שעה, והתמונה המשפחתית צולמה בשקיעה כרגיל.',
          questionEn: 'What happened to the camera this year?',
          questionHe: 'מה קרה למצלמה השנה?',
          correct: 'It fell into the sand.',
          wrong: ['It was stolen on the beach.', 'It was left at home in Netanya.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is correct?',
              correct: 'She got her hair cut yesterday.',
              wrong: ['She got her hair cutting yesterday.'],
              explainHe: 'במבנה get + מושא + V3 הפועל בא בצורת V3 (cut), כי מישהו אחר עושה את הפעולה.',
              hintHe: 'כדאי לבדוק איזו צורה של הפועל מתאימה אחרי her hair.',
            },
            story: {
              passageEn: 'Tal needs a new suit. She goes to a tailor. The tailor shortens the sleeves.',
              passageHe: 'טל צריכה חליפה חדשה. היא הולכת לחייט. החייט מקצר את השרוולים.',
              questionEn: 'What does the tailor do?',
              questionHe: 'מה עושה החייט?',
              correct: 'He shortens the sleeves.',
              wrong: ['He washes the suit.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['decorate', 'sweeten'],
              ['collar', 'sleeve'],
              ['landscape', 'sculpture'],
              ['marry', 'inherit'],
            ],
          },
          master: {
            sentenceEn: 
              'Next week we are getting our wedding portraits taken by a famous local photographer.',
            sentenceHe: 'בשבוע הבא צלם מקומי מפורסם יצלם את תמונות החתונה שלנו.',
            decoys: ['take', 'taking'],
            voiceEn: 'She got her jacket altered.',
            voiceHe: 'היא נתנה את המעיל שלה לתיקון.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'He got his passport renewed at the embassy.',
              wrong: [
                'He got his passport renew at the embassy.',
                'He got renewed his passport at the embassy.',
                'He got his passport renewing at the embassy.',
              ],
              explainHe: 
                'המבנה הוא get + מושא + V3: his passport renewed. הפועל בא אחרי המושא ובצורת V3.',
              hintEn: 'Check the order and the form of the verb renew.',
            },
            story: {
              passageEn: 
                'Every spring, the town hired an inspector to examine the old stone bridge. For many years the reports were short and cheerful. This year, however, the inspector spent three days measuring cracks and photographing the foundations. He then asked the mayor to close the bridge to heavy vehicles until a structural engineer could examine it. The mayor sighed and said the delivery companies would complain, but she signed the order. Within a week, the first complaints arrived.',
              passageHe: '',
              questionEn: 'What does the mayor\'s decision show?',
              questionHe: '',
              correct: 'She valued safety over complaints.',
              wrong: [
                'She disliked the inspector\'s reports.',
                'She had not read the report.',
                'The bridge had been repaired already.',
              ],
            },
            storyHintEn: 'Notice that she signed although she expected complaints.',
          },
        },
      },
    },
    {
      icon: '🏆',
      isBoss: true,
      titleEn: 'Boss: Season Finale: The Wedding Planner Unseen',
      titleHe: 'בוס: גמר העונה — Unseen של מתכננת החתונות',
      storyHookHe:
        'גמר עונה 2! מתכננת אירועים דואגת שכל פרט בחתונה ייעשה בידי אנשי מקצוע. עליכם לזהות מי עשה מה, לשלב have ו-get בזמנים שונים ולפצח קטע Unseen מלא!',
      grammarTopic: 'Causative have / get Synthesis & Season Review',
      skills: ['Causative Mastery', 'Wish Clauses Review', 'Bagrut Unseen'],
      sentenceEn: 'Instead of cooking for two hundred guests, the couple had the meal prepared by caterers.',
      sentenceHe: 'במקום לבשל למאתיים אורחים, בני הזוג הזמינו את הארוחה מחברת קייטרינג.',
      vocab: [
        [
          'outsource',
          'verb',
          'להוציא למיקור חוץ / להעביר לגורם חיצוני',
          '📦',
          'Many companies outsource their customer service abroad.',
          'חברות רבות מוציאות את שירות הלקוחות שלהן למיקור חוץ בחו"ל.',
        ],
        [
          'convenience',
          'noun',
          'נוחות',
          '🛋️',
          'Online banking offers great convenience to busy people.',
          'בנקאות מקוונת מציעה נוחות רבה לאנשים עסוקים.',
        ],
        [
          'invoice',
          'noun',
          'חשבונית',
          '📄',
          'The plumber sent us an invoice for the repairs.',
          'השרברב שלח לנו חשבונית על התיקונים.',
        ],
        [
          'maintenance',
          'noun',
          'תחזוקה',
          '⚙️',
          'Regular maintenance keeps old buildings safe.',
          'תחזוקה קבועה שומרת על בטיחותם של בניינים ישנים.',
        ],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'volunteer', translationHe: 'להתנדב' },
          { wordEn: 'hesitate', translationHe: 'להסס' },
        ],
        shortSentenceEn: 'They had invitations printed.',
        shortSentenceHe: 'הם הדפיסו הזמנות (בבית דפוס).',
        rule: {
          questionEn: 'Which sentence is a correct causative in the Present Perfect?',
          correct: 'We have just had the invitations designed by an artist.',
          wrong: [
            'We have just the invitations had designed by an artist.',
            'We have just had designed the invitations by an artist.',
          ],
          explainHe:
            'במבנה גרימה (causative), הסדר קבוע: have/get בזמן הנכון (have had), אחריו החפץ (the invitations), ורק אז V3 (designed).',
          hintHe: 'בדקו את הסדר: הפועל שמראה זמן, אחריו הדבר שעליו עובדים, ובסוף הפועל בצורת V3.',
        },
        story: {
          passageEn:
            'Tamar runs a small wedding-planning business in the Galilee. She believes that couples should enjoy their wedding day, so she outsources almost every task. She has the flowers arranged by a local florist and gets the music played by a student band. At the end, every couple receives one clear invoice instead of twenty different bills.',
          passageHe:
            'תמר מנהלת עסק קטן לתכנון חתונות בגליל. היא מאמינה שזוגות צריכים ליהנות מיום החתונה שלהם, ולכן היא מעבירה כמעט כל משימה לאנשי מקצוע. היא דואגת שחנות פרחים מקומית תסדר את הפרחים ושלהקת סטודנטים תנגן את המוזיקה. בסוף, כל זוג מקבל חשבונית ברורה אחת במקום עשרים חשבונות שונים.',
          questionEn: 'What does every couple receive at the end?',
          questionHe: 'מה מקבל כל זוג בסוף?',
          correct: 'One clear invoice instead of twenty bills.',
          wrong: ['A free concert by a student band.', 'A discount from a local florist.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is correct?',
              correct: 'We had our car washed this morning.',
              wrong: ['We had our car wash this morning.'],
              explainHe: 'במבנה have + מושא + V3, הפועל בא בצורת V3 (washed).',
              hintHe: 'כדאי לבדוק את צורת הפועל אחרי our car.',
            },
            story: {
              passageEn: 
                'Mom has no time to cook. She orders dinner from a restaurant. Dinner arrives at the door.',
              passageHe: 'לאמא אין זמן לבשל. היא מזמינה ארוחת ערב ממסעדה. הארוחה מגיעה עד הדלת.',
              questionEn: 'Why does Mom order dinner?',
              questionHe: 'למה אמא מזמינה ארוחת ערב?',
              correct: 'She has no time to cook.',
              wrong: ['She loves washing dishes.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['compose', 'weigh'],
              ['obstacle', 'hardship'],
              ['anthem', 'ingredient'],
              ['weather', 'laughter'],
            ],
          },
          master: {
            sentenceEn: 
              'Busy families increasingly have their groceries delivered because shopping in person takes too much time.',
            sentenceHe: 
              'משפחות עסוקות מזמינות יותר ויותר מצרכים במשלוח הביתה כי קניות באופן אישי לוקחות יותר מדי זמן.',
            decoys: ['deliver', 'delivering'],
            voiceEn: 'We had the invoice checked twice.',
            voiceHe: 'נתנו לבדוק את החשבונית פעמיים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The firm had its accounts audited by an outside expert.',
              wrong: [
                'The firm had its accounts audit by an outside expert.',
                'The firm had audited its accounts by an outside expert.',
                'The firm had its accounts auditing by an outside expert.',
              ],
              explainHe: 
                'המבנה הסיבתי: had + מושא + V3 (accounts audited). אחרי המושא בא V3, ולא V1 או V-ing.',
              hintEn: 'Check the word that follows its accounts.',
            },
            story: {
              passageEn: 
                'A restaurant owner calculated that she spent twelve hours a week washing tablecloths. She was reluctant to hand the job to a laundry company, because she believed it would be expensive. After a trial month, she compared the invoice with the cost of detergent, electricity and the hours of staff time. To her surprise, the outside service was cheaper, and her staff finally had time to greet customers properly. She now recommends the idea to other owners.',
              passageHe: '',
              questionEn: 'Why did her opinion change?',
              questionHe: '',
              correct: 'The figures proved it was cheaper.',
              wrong: [
                'Her tablecloths were no longer needed.',
                'Her staff asked for longer hours.',
                'Detergent became much more expensive.',
              ],
            },
            storyHintEn: 'Think about what she compared after the trial month.',
          },
        },
      },
    },
  ],
};

/** The season2-1 pack's grade 11 unit (`../../registry.ts`) */
export const SEASON2_1_GRADE_11_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-11', [UNIT_SEASON2_1]);

/** The season2-2 pack's grade 11 unit (`../../registry.ts`) */
export const SEASON2_2_GRADE_11_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-11', [UNIT_SEASON2_2]);
