import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 5 mini-lessons, by mission id. */
export const CORE_4_GRADE_5_LESSONS: LessonPack = {
  'g5-u24-m1': {
    titleHe: 'תוכניות: going to 🗓️',
    ideaHe:
      'כשמספרים על תוכנית לעתיד, משתמשים ב-am / is / are ואחריו going to ופועל: I am going to swim (אני הולך/ת לשחות). בשלילה not בא אחרי am / is / are: They are not going to…',
    pattern: 'I am going to … · he / she is going to … · we / they are going to …',
    examples: [
      { en: 'I am going to read a comic.', he: 'אני הולך/ת לקרוא קומיקס.', highlight: 'am going to', emoji: '📘' },
      { en: 'She is going to bake a cake.', he: 'היא הולכת לאפות עוגה.', highlight: 'is going to', emoji: '🍰' },
      { en: 'They are not going to ride bikes.', he: 'הם לא הולכים לרכוב על אופניים.', highlight: 'are not going to', emoji: '🚲' },
    ],
    quickTry: {
      promptHe: 'מחר אתם מתכננים לשחק טניס 🎾. איך אומרים?',
      correct: 'I am going to play tennis.',
      wrong: 'I going to play tennis.',
      explainHe: 'לא שוכחים את am: I am going to play.',
    },
  },
  'g5-u24-m2': {
    titleHe: 'שואלים על תוכניות: Are you going to…? 🤷',
    ideaHe:
      'בשאלה is / are עוברים להתחלה: Are you going to come? Is he going to swim? וגם אחרי מילת שאלה: What are you going to do? עונים בקצרה: Yes, I am. / No, I\'m not.',
    pattern: 'Are you going to …? — Yes, I am. / No, I\'m not.',
    examples: [
      { en: 'What are you going to eat?', he: 'מה אתם הולכים לאכול?', highlight: 'What are you going to', emoji: '🍽️' },
      { en: 'Is Dana going to sing?', he: 'דנה הולכת לשיר?', highlight: 'Is Dana going to', emoji: '🎤' },
      { en: 'No, she isn\'t.', he: 'לא, היא לא.', highlight: 'isn\'t', emoji: '🙅' },
    ],
    quickTry: {
      promptHe: 'שואלים: Is Tom going to come? ותום כן בא. מה עונים?',
      correct: 'Yes, he is.',
      wrong: 'Yes, he does.',
      explainHe: 'על Is Tom…? עונים עם is: Yes, he is.',
    },
  },
};
