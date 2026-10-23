import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 10 mini-lessons, by mission id. The Bosses get their unit's recap. */
export const HOLIDAYS_GRADE_10_LESSONS: LessonPack = {
  'g10-u31-m1': {
    titleHe: 'מה עושים בחג? סביל בהווה 🍯',
    ideaHe: 'בסביל בהווה הפעולה במרכז, ולא מי שעושה אותה: am / is / are ואחריו V3. זה מתאים מאוד לתיאור מנהגים.',
    pattern: 'is / are + V3',
    examples: [
      { en: 'Honey cake is served after the meal.', he: 'מגישים עוגת דבש אחרי הארוחה.', highlight: 'is served' },
      { en: 'Holiday cards are sent to friends.', he: 'שולחים כרטיסי ברכה לחברים.', highlight: 'are sent' },
      { en: 'The shofar is blown in the synagogue.', he: 'תוקעים בשופר בבית הכנסת.', highlight: 'is blown' },
    ],
    tipHe: 'בעברית אומרים "מגישים עוגה". באנגלית: Cake is served.',
    quickTry: {
      promptHe: 'is או are?',
      questionEn: 'Sweet dishes ____ prepared for the new year.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'dishes ברבים, ולכן are.',
    },
  },
  'g10-u31-m2': {
    titleHe: 'who, which או whose? 🌿',
    ideaHe: 'פסוקית זיקה מוסיפה מידע על שם עצם: who לאנשים, which / that לדברים, ו-whose כשמשהו שייך למישהו.',
    pattern: 'who · which / that · whose + noun',
    examples: [
      { en: 'The guests who came late sat near the door.', he: 'האורחים שהגיעו באיחור ישבו ליד הדלת.', highlight: 'who came late' },
      { en: 'We ate the cake that Grandma baked.', he: 'אכלנו את העוגה שסבתא אפתה.', highlight: 'that Grandma baked' },
      { en: 'I met a boy whose father builds boats.', he: 'פגשתי ילד שאבא שלו בונה סירות.', highlight: 'whose father' },
    ],
    tipHe: 'אחרי whose בא תמיד שם עצם: whose father, whose sukkah.',
    quickTry: {
      promptHe: 'איזו מילת זיקה מתאימה?',
      questionEn: 'This is the lamp ____ lights up our sukkah.',
      correct: 'which',
      wrong: 'who',
      explainHe: 'lamp הוא דבר ולא אדם, ולכן which.',
    },
  },
  'g10-u32-m1': {
    titleHe: 'מה נעשה? סביל בעבר 🌱',
    ideaHe: 'בסביל בעבר משתמשים ב-was / were ואחריו V3. מי שעשה את הפעולה מופיע אחרי by, אם הוא חשוב.',
    pattern: 'was / were + V3 (+ by …)',
    examples: [
      { en: 'The costumes were sewn by our grandmother.', he: 'את התחפושות תפרה סבתא שלנו.', highlight: 'were sewn' },
      { en: 'A new park was opened last spring.', he: 'פארק חדש נפתח באביב שעבר.', highlight: 'was opened' },
      { en: 'The letters were written in English.', he: 'המכתבים נכתבו באנגלית.', highlight: 'were written' },
    ],
    tipHe: 'בסביל בעבר לא משתמשים ב-did: Was it opened, ולא Did it opened.',
    quickTry: {
      promptHe: 'מה בא אחרי were?',
      questionEn: 'The prizes were ____ at the end of the party.',
      correct: 'given',
      wrong: 'gave',
      explainHe: 'אחרי were בא V3: given.',
    },
  },
  'g10-u32-m2': {
    titleHe: 'מידע נוסף בין פסיקים 🎆',
    ideaHe:
      'פסוקית בין פסיקים מוסיפה מידע על משהו שכבר ידוע. משתמשים בה ב-who או ב-which, אף פעם לא ב-that, ואפשר לשלב בה גם סביל.',
    pattern: ', which / who … ,',
    examples: [
      { en: 'Jerusalem, which is built on hills, is very old.', he: 'ירושלים, שבנויה על גבעות, עתיקה מאוד.', highlight: 'which is built' },
      { en: 'My aunt, who lives in Eilat, visits every spring.', he: 'הדודה שלי, שגרה באילת, מבקרת בכל אביב.', highlight: 'who lives in Eilat' },
      { en: 'The matzah, which was baked yesterday, is still crispy.', he: 'המצה, שנאפתה אתמול, עדיין פריכה.', highlight: 'which was baked' },
    ],
    tipHe: 'אחרי פסיק לא כותבים that: Jerusalem, which..., ולא Jerusalem, that...',
    quickTry: {
      promptHe: 'which או that?',
      questionEn: 'The Seder plate, ____ is on the table, has six symbols.',
      correct: 'which',
      wrong: 'that',
      explainHe: 'בפסוקית בין פסיקים לא משתמשים ב-that, ולכן which.',
    },
  },
};
