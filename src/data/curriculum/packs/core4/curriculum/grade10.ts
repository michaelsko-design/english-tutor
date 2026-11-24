import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 10 unit (Band III): the conditional imperative (If you see smoke, call 101)
 * and coordinating conjunctions (and, but, or, so, yet), about safety and first aid, with Band
 * III Core I (4-point) words the app never had. Example Hebrew addresses the learner in the
 * plural; hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_4: HighSchoolUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Safety & First Aid',
  titleHe: 'בטיחות ועזרה ראשונה',
  subtitleHe: 'עונה 4: מה עושים אם…? נותנים הוראות עם If + ציווי, ומחברים רעיונות עם and, but, or, so ו-yet',
  badgeEmoji: '🩺',
  missions: [
    {
      icon: '🦺',
      titleEn: 'If You Get Hurt, Stay Calm',
      titleHe: 'אם נפגעים, נשארים רגועים',
      storyHookHe:
        'מה עושים כשמשהו קורה? נלמד לתת הוראות בטיחות: If + הווה, ואחר כך פועל בציווי: If you see lightning, go inside.',
      grammarTopic: 'Conditional imperative: If + present, imperative',
      skills: ['If + imperative', 'Safety Instructions', 'First Aid'],
      sentenceEn: 'If someone faints, lay them down and call 101.',
      sentenceHe: 'אם מישהו מתעלף, השכיבו אותו והתקשרו ל-101.',
      vocab: [
        ['lightning', 'noun', 'ברק', '⚡', 'If you see lightning, get inside a building.', 'אם אתם רואים ברק, היכנסו לבניין.'],
        ['slip', 'verb', 'להחליק', '🧊', 'If the floor is wet, walk slowly so you don\'t slip.', 'אם הרצפה רטובה, לכו לאט כדי שלא תחליקו.'],
        ['explode', 'verb', 'להתפוצץ', '💥', 'If there is a fire near a gas cylinder, stay far away, because it can explode.', 'אם יש שריפה ליד בלון גז, התרחקו ממנו, כי הוא יכול להתפוצץ.'],
        ['get worse', 'phrase', 'להחמיר', '📉', 'If you don\'t rest, the injury may get worse.', 'אם לא תנוחו, הפציעה עלולה להחמיר.'],
        ['loose', 'adjective', 'רופף / משוחרר', '🔩', 'If a step is loose, don\'t stand on it.', 'אם מדרגה רופפת, אל תעמדו עליה.'],
        ['uncomfortable', 'adjective', 'לא נוח', '😣', 'If your helmet is uncomfortable, ask for a different size.', 'אם הקסדה לא נוחה לכם, בקשו מידה אחרת.'],
        ['any minute now', 'phrase', 'בכל רגע', '⏰', 'Stay calm. The ambulance will arrive any minute now.', 'הישארו רגועים. האמבולנס יגיע בכל רגע.'],
        ['specialist', 'noun', 'מומחה / רופא מומחה', '🩺', 'If the pain doesn\'t stop, see a specialist.', 'אם הכאב לא נפסק, לכו לרופא מומחה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'violin', translationHe: 'כינור' },
          { wordEn: 'pillow', translationHe: 'כרית' },
        ],
        shortSentenceEn: 'If you get hurt, stay calm.',
        shortSentenceHe: 'אם נפגעים, הישארו רגועים.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'If you burn your hand, put it under cold water.',
          wrong: ['If you will burn your hand, put it under cold water.', 'If you burn your hand, you putting it under cold water.'],
          explainHe: 'תנאי עם הוראה: If + הווה, ואחר כך פועל בציווי (put), בלי will.',
          hintHe: 'מה בא אחרי If, ואיך נראית ההוראה?',
        },
        story: {
          passageEn:
            'Last summer, Itamar slipped on a wet rock during a hike and hurt his ankle. His friend, who had taken a first aid course, knew what to do. "If it hurts, don\'t walk on it," she said. She held a cold pack wrapped in a towel on his ankle and called his parents. A specialist later said that it was not broken.',
          passageHe:
            'בקיץ שעבר איתמר החליק על סלע רטוב בטיול ונפגע בקרסול. החברה שלו, שעברה קורס עזרה ראשונה, ידעה מה לעשות. "אם זה כואב, אל תדרוך עליו," היא אמרה. היא החזיקה על הקרסול שלו שקית קירור עטופה במגבת והתקשרה להורים שלו. מאוחר יותר רופא מומחה אמר שהוא לא שבור.',
          questionEn: 'What did the specialist say?',
          questionHe: 'מה אמר הרופא המומחה?',
          correct: 'The ankle was not broken.',
          wrong: ['Itamar must stop hiking.', 'The rock was dangerous.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'If you see lightning, go inside.',
              wrong: ['If you see lightning, going inside.'],
              explainHe: 'אחרי חלק ה-If באה הוראה בציווי: go inside.',
              hintHe: 'איך נראית הוראה באנגלית?',
            },
            story: {
              passageEn: 'Dana felt sick on the boat. The captain told her to look at the horizon and breathe slowly.',
              passageHe: 'לדנה היה רע בסירה. הקפטן אמר לה להסתכל על קו האופק ולנשום לאט.',
              questionEn: 'Where was Dana?',
              questionHe: 'איפה הייתה דנה?',
              correct: 'On a boat.',
              wrong: ['On a bus.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['uncomfortable', 'loose'],
              ['lightning', 'specialist'],
              ['loose', 'specialist'],
              ['lightning', 'specialist'],
              ['explode', 'specialist'],
              ['explode', 'lightning'],
              ['explode', 'specialist'],
              ['loose', 'explode'],
            ],
          },
          master: {
            sentenceEn: 'If the cut is deep, press on it and go to the hospital.',
            sentenceHe: 'אם החתך עמוק, לחצו עליו וסעו לבית החולים.',
            decoys: ['will', 'pressing'],
            voiceEn: 'If you feel dizzy, sit down and drink some water.',
            voiceHe: 'אם אתם מרגישים סחרחורת, שבו ושתו קצת מים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If you smell gas, open the windows and leave the house.',
              wrong: [
                'If you will smell gas, open the windows and leave the house.',
                'If you smell gas, opening the windows and leave the house.',
                'If you smell gas, you open the windows and leaving the house.',
              ],
              explainHe: 'If + הווה (smell), ואחר כך הוראות בציווי: open… and leave…',
              hintEn: 'Check the verb after If and the instructions.',
            },
            story: {
              passageEn:
                'During a winter storm, the lights in Gal\'s building went out. His little sister was scared. Gal remembered what his teacher had said: "If the power goes off, don\'t put candles near curtains." He found a flashlight instead and told his sister a story. About an hour later, the lights came back.',
              passageHe: '',
              questionEn: 'Why did Gal use a flashlight?',
              questionHe: '',
              correct: 'He knew candles near curtains could be dangerous.',
              wrong: ['His sister asked for one.', 'There were no candles at home.', 'The teacher gave it to him.'],
            },
            storyHintEn: 'What had his teacher said?',
          },
        },
      },
    },
    {
      icon: '🔥',
      titleEn: 'Stay Calm, or Call for Help',
      titleHe: 'הישארו רגועים, או קראו לעזרה',
      storyHookHe:
        'במצב חירום חשוב להבין את הקשר בין הרעיונות: and מוסיף, but ו-yet מנגידים, so מראה תוצאה, ו-or נותן אפשרות.',
      grammarTopic: 'Coordinating conjunctions: and, but, or, so, yet',
      skills: ['Coordinating Conjunctions', 'Emergencies', 'Cause and Result'],
      sentenceEn: 'The road was icy, so the driver slowed down.',
      sentenceHe: 'הכביש היה קפוא, אז הנהג האט.',
      vocab: [
        ['in charge', 'phrase', 'אחראי', '🧑‍✈️', 'Noa was in charge of the first aid kit, so she checked it every week.', 'נועה הייתה אחראית על ערכת העזרה הראשונה, אז היא בדקה אותה כל שבוע.'],
        ['complicated', 'adjective', 'מסובך', '🧩', 'The instructions were complicated, but the nurse explained them clearly.', 'ההוראות היו מסובכות, אבל האחות הסבירה אותן בבהירות.'],
        ['probable', 'adjective', 'סביר / צפוי', '📊', 'It is probable that it will rain tomorrow, so take a raincoat.', 'סביר שירד גשם מחר, אז קחו מעיל גשם.'],
        ['not until', 'phrase', 'לא לפני ש...', '⏳', 'Leave the building, and do not go back in, not until a firefighter says it is safe.', 'צאו מהבניין, ואל תחזרו פנימה, לא לפני שכבאי אומר שזה בטוח.'],
        ['naturally', 'adverb', 'כמובן / באופן טבעי', '🌿', 'The children were scared, so naturally they cried.', 'הילדים פחדו, אז כמובן שהם בכו.'],
        ['get in touch', 'phrase', 'ליצור קשר', '📞', 'If you get lost, get in touch with your group leader.', 'אם תלכו לאיבוד, צרו קשר עם מדריך הקבוצה.'],
        ['all of a sudden', 'phrase', 'פתאום', '💥', 'We were swimming, and all of a sudden a big wave came.', 'שחינו, ופתאום הגיע גל גדול.'],
        ['in connection with', 'phrase', 'בקשר ל...', '🔗', 'The police called me in connection with the accident, so I told them what I saw.', 'המשטרה התקשרה אליי בקשר לתאונה, אז סיפרתי להם מה ראיתי.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'carpet', translationHe: 'שטיח' },
          { wordEn: 'saucer', translationHe: 'תחתית' },
        ],
        shortSentenceEn: 'Stay calm, or call for help.',
        shortSentenceHe: 'הישארו רגועים, או קראו לעזרה.',
        rule: {
          questionEn: 'It was raining heavily. The game continued. Which sentence joins the ideas correctly?',
          correct: 'It was raining heavily, yet the game continued.',
          wrong: ['It was raining heavily, so the game continued.', 'It was raining heavily, or the game continued.'],
          explainHe: 'yet (ובכל זאת) מחבר רעיונות שעומדים בניגוד: גשם חזק, ובכל זאת המשחק נמשך. so מראה תוצאה, ו-or אפשרות.',
          hintHe: 'האם החלק השני הוא תוצאה, ניגוד או אפשרות?',
        },
        story: {
          passageEn:
            'A fire alarm went off at the mall, and all of a sudden everyone started to run. A young guard was in charge of the exit. She stayed calm, so people listened to her. The alarm was false, yet she said that it was good practice.',
          passageHe:
            'אזעקת אש נשמעה בקניון, ופתאום כולם התחילו לרוץ. שומרת צעירה הייתה אחראית על היציאה. היא נשארה רגועה, אז אנשים הקשיבו לה. האזעקה הייתה שגויה, ובכל זאת היא אמרה שהתרגול היה מועיל.',
          questionEn: 'Why did people listen to the guard?',
          questionHe: 'למה אנשים הקשיבו לשומרת?',
          correct: 'She stayed calm.',
          wrong: ['She was very loud.', 'She ran first.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which word shows a result? I was tired, ___ I went to bed.',
              correct: 'so',
              wrong: ['but'],
              explainHe: 'so (אז / לכן) מראה תוצאה.',
              hintHe: 'הלכתי לישון בגלל העייפות. איזו מילה מתאימה?',
            },
            story: {
              passageEn: 'The lifeguard was in charge of the beach. He saw a big wave, so he blew his whistle.',
              passageHe: 'המציל היה אחראי על החוף. הוא ראה גל גדול, אז הוא שרק במשרוקית.',
              questionEn: 'What did the lifeguard see?',
              questionHe: 'מה המציל ראה?',
              correct: 'A big wave.',
              wrong: ['A shark.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['probable', 'naturally'],
              ['in charge', 'not until'],
              ['in charge', 'get in touch'],
              ['naturally', 'probable'],
              ['probable', 'complicated'],
              ['in charge', 'probable'],
              ['complicated', 'in charge'],
              ['naturally', 'all of a sudden'],
            ],
          },
          master: {
            sentenceEn: 'The first aid kit was small, yet it had everything we needed.',
            sentenceHe: 'ערכת העזרה הראשונה הייתה קטנה, ובכל זאת היה בה כל מה שהיינו צריכים.',
            decoys: ['so', 'have'],
            voiceEn: 'He can\'t stand up, so stay with him and call an ambulance.',
            voiceHe: 'הוא לא יכול לעמוד, אז הישארו איתו והתקשרו לאמבולנס.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The water was deep, so we stayed near the shore.',
              wrong: [
                'The water was deep so, we stayed near the shore.',
                'The water deep, so we stayed near the shore.',
                'The water was deep, so we was staying near the shore.',
              ],
              explainHe: 'הפסיק בא לפני so (לא אחריו), בחלק הראשון צריך was, ועם we אומרים were.',
              hintEn: 'Check the comma, was and were.',
            },
            story: {
              passageEn:
                'Maayan was in charge of her younger brother at the park. All of a sudden, he fell off the slide and started to cry. His knee was bleeding, but the cut was small. Maayan washed it with water, and then she got in touch with their mother. Naturally, their mother was worried, yet she was proud of Maayan.',
              passageHe: '',
              questionEn: 'Why was their mother proud of Maayan?',
              questionHe: '',
              correct: 'Maayan took good care of her brother.',
              wrong: ['Maayan stopped him from falling.', 'Maayan called an ambulance.', 'The cut was very small.'],
            },
            storyHintEn: 'What did Maayan do after her brother fell?',
          },
        },
      },
    },
    {
      icon: '📋',
      isBoss: true,
      titleEn: 'Boss: The First Aid Course',
      titleHe: 'אתגר הבוס: קורס עזרה ראשונה',
      storyHookHe: 'סיימתם את הקורס! תנו הוראות עם If + ציווי, וחברו רעיונות עם and, but, or, so ו-yet.',
      grammarTopic: 'Conditional imperative & conjunctions: Review',
      skills: ['If + imperative', 'Conjunctions', 'Review'],
      sentenceEn: 'If you find someone hurt, stay calm and call for help.',
      sentenceHe: 'אם אתם מוצאים מישהו פצוע, הישארו רגועים וקראו לעזרה.',
      vocab: [
        ['get rid of', 'phrase', 'להיפטר מ...', '🗑️', 'If medicine is old, get rid of it safely.', 'אם תרופה ישנה, היפטרו ממנה בצורה בטוחה.'],
        ['use up', 'phrasal verb', 'לגמור / לנצל עד הסוף', '🩹', 'If you use up the bandages, buy new ones.', 'אם תגמרו את התחבושות, קנו חדשות.'],
        ['underneath', 'preposition', 'מתחת ל...', '⬇️', 'The first aid kit is underneath the sink.', 'ערכת העזרה הראשונה נמצאת מתחת לכיור.'],
        ['sweep', 'verb', 'לטאטא', '🧹', 'If a glass breaks, sweep the floor carefully.', 'אם כוס נשברת, טאטאו את הרצפה בזהירות.'],
        ['trash', 'noun', 'פח / זבל', '🚮', 'Put the broken glass in the trash, but wrap it in paper first.', 'שימו את הזכוכית השבורה בפח, אבל עטפו אותה קודם בנייר.'],
        ['mineral water', 'noun', 'מים מינרליים', '💧', 'On a hot day, carry a bottle of mineral water, or you may feel weak.', 'ביום חם, קחו בקבוק מים מינרליים, אחרת אתם עלולים להרגיש חלשים.'],
        ['nasty', 'adjective', 'קשה / מגעיל', '🤕', 'He had a nasty cut, so we cleaned it and covered it.', 'היה לו חתך קשה, אז ניקינו אותו וכיסינו אותו.'],
        ['queue', 'noun', 'תור', '👥', 'There was a long queue at the clinic, yet the nurses worked fast.', 'היה תור ארוך במרפאה, ובכל זאת האחיות עבדו מהר.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'lantern', translationHe: 'פנס' },
          { wordEn: 'tortoise', translationHe: 'צב' },
        ],
        shortSentenceEn: 'Sweep the floor, please.',
        shortSentenceHe: 'טאטאו את הרצפה, בבקשה.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'If the burn is small, cool it with water, but do not use ice.',
          wrong: [
            'If the burn will be small, cool it with water, but do not use ice.',
            'If the burn is small, cool it with water, but you not use ice.',
          ],
          explainHe: 'If + הווה (is), הוראה בציווי, ו-but מחבר הוראה הפוכה בשלילה: do not use.',
          hintHe: 'בדקו את הפועל אחרי If ואת ההוראה בשלילה.',
        },
        story: {
          passageEn:
            'This year, our class took a first aid course. The instructor showed us a kit that was kept underneath the teacher\'s desk. She said, "If you use up something in the kit, tell me, and I will replace it." Then she explained how to clean a nasty cut, so everyone practiced on a doll.',
          passageHe:
            'השנה הכיתה שלנו עברה קורס עזרה ראשונה. המדריכה הראתה לנו ערכה ששמורה מתחת לשולחן של המורה. היא אמרה: "אם תגמרו משהו בערכה, תגידו לי, ואני אחליף אותו." אחר כך היא הסבירה איך לנקות חתך קשה, אז כולם התאמנו על בובה.',
          questionEn: 'Where was the kit?',
          questionHe: 'איפה הייתה הערכה?',
          correct: 'Underneath the teacher\'s desk.',
          wrong: ['In the trash.', 'On the wall.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'A glass broke on the kitchen floor. What should you do?',
              correct: 'Sweep the floor carefully.',
              wrong: ['Walk on the glass.'],
              explainHe: 'sweep פירושו "לטאטא".',
              hintHe: 'איך מנקים זכוכית מהרצפה?',
            },
            story: {
              passageEn: 'It was very hot, so Dad gave us mineral water. We drank it all.',
              passageHe: 'היה חם מאוד, אז אבא נתן לנו מים מינרליים. שתינו הכול.',
              questionEn: 'What did Dad give them?',
              questionHe: 'מה אבא נתן להם?',
              correct: 'Mineral water.',
              wrong: ['Juice.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['underneath', 'nasty'],
              ['underneath', 'nasty'],
              ['sweep', 'nasty'],
              ['underneath', 'queue'],
              ['sweep', 'underneath'],
              ['sweep', 'underneath'],
              ['sweep', 'underneath'],
              ['sweep', 'underneath'],
            ],
          },
          master: {
            sentenceEn: 'The cut looked nasty, yet it healed in a week.',
            sentenceHe: 'החתך נראה קשה, ובכל זאת הוא החלים תוך שבוע.',
            decoys: ['so', 'heals'],
            voiceEn: 'If you use up the bandages, tell the teacher.',
            voiceHe: 'אם תגמרו את התחבושות, ספרו למורה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'If you see broken glass, sweep it up and throw it in the trash.',
              wrong: [
                'If you will see broken glass, sweep it up and throw it in the trash.',
                'If you see broken glass, sweeping it up and throw it in the trash.',
                'If you see broken glass, sweep up it and throw it in the trash.',
              ],
              explainHe: 'If + הווה, הוראות בציווי (sweep, throw), ו-it בא בין sweep ל-up.',
              hintEn: 'Check the verbs and where it goes.',
            },
            story: {
              passageEn:
                'At the end of the course, each student got a small first aid kit. Two weeks later, Omer\'s grandmother cut her finger in the kitchen. Omer knew exactly what to do: he washed the cut, put on a bandage and got rid of the broken plate. Grandma said that the course was the best gift Omer had ever gotten.',
              passageHe: '',
              questionEn: 'Why did Grandma say the course was a great gift?',
              questionHe: '',
              correct: 'It taught Omer how to help her.',
              wrong: ['Omer got a free kit.', 'She took the course too.', 'It was cheap.'],
            },
            storyHintEn: 'What did Omer do when Grandma cut her finger?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 10 unit (`../../registry.ts`) */
export const CORE_4_GRADE_10_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-10', [UNIT_CORE_4]);
