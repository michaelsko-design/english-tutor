import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 4 mini-lessons, by mission id. */
export const CORE_4_GRADE_4_LESSONS: LessonPack = {
  'g4-u24-m1': {
    titleHe: 'מה קורה עכשיו? am / is / are + ing 🌧️',
    ideaHe:
      'כשמשהו קורה ממש עכשיו, משתמשים ב-am / is / are ובפועל עם ing בסוף: I am reading, It is raining, They are playing. שימו לב לאיות: make → making, sit → sitting.',
    pattern: 'I am …ing · he / she / it is …ing · we / you / they are …ing',
    examples: [
      { en: 'I am drinking hot cocoa.', he: 'אני שותה שוקו חם.', highlight: 'am drinking', emoji: '☕' },
      { en: 'The wind is blowing.', he: 'הרוח נושבת.', highlight: 'is blowing', emoji: '💨' },
      { en: 'The kids are making a snowman.', he: 'הילדים בונים איש שלג.', highlight: 'are making', emoji: '⛄' },
    ],
    quickTry: {
      promptHe: 'תסתכלו מהחלון: יורד שלג ❄️. איך אומרים את זה?',
      correct: 'It is snowing.',
      wrong: 'It snowing.',
      explainHe: 'it ואחריו is, ואז הפועל עם ing: It is snowing.',
    },
  },
  'g4-u24-m2': {
    titleHe: 'שאלות על עכשיו: Is it…? Are you…? 🌀',
    ideaHe:
      'בשאלה על מה שקורה עכשיו, am / is / are עוברים להתחלה: Is it raining? Are you coming? אפשר גם לשאול What are you doing? ועונים בקצרה: Yes, it is. / No, it isn\'t.',
    pattern: 'Is it …ing? · Yes, it is. / No, it isn\'t. · What are you doing?',
    examples: [
      { en: 'Is the sun shining?', he: 'השמש זורחת?', highlight: 'Is', emoji: '☀️' },
      { en: 'Are they wearing coats?', he: 'הם לובשים מעילים?', highlight: 'Are', emoji: '🧥' },
      { en: 'What is Grandpa doing?', he: 'מה סבא עושה?', highlight: 'What is', emoji: '👴' },
    ],
    quickTry: {
      promptHe: 'רוצים לדעת אם יורד גשם עכשיו. איך שואלים?',
      correct: 'Is it raining now?',
      wrong: 'Does it raining now?',
      explainHe: 'שאלה על עכשיו מתחילה ב-Is, והפועל עם ing: Is it raining?',
    },
  },
};
