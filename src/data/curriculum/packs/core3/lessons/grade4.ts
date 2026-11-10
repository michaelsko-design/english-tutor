import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 4 mini-lessons, by mission id. */
export const CORE_3_GRADE_4_LESSONS: LessonPack = {
  'g4-u23-m1': {
    titleHe: 'מחברים רעיונות: and, but, or 🔗',
    ideaHe:
      'אפשר לחבר שני משפטים למשפט אחד: and (וגם) לרעיונות דומים, but (אבל) לרעיונות הפוכים, ו-or (או) כשבוחרים אחד מהשניים.',
    pattern: '… , and … · … , but … · … or …?',
    examples: [
      { en: 'Ben is clever, and he is funny.', he: 'בן חכם, והוא מצחיק.', highlight: 'and', emoji: '🧠' },
      { en: 'I am tired, but I am happy.', he: 'אני עייף/ה, אבל אני שמח/ה.', highlight: 'but', emoji: '🙂' },
      { en: 'Do you want juice or water?', he: 'אתם רוצים מיץ או מים?', highlight: 'or', emoji: '🧃' },
    ],
    tipHe: 'לפני but שמים פסיק כשהוא מחבר שני משפטים שלמים: I like cats, but I don\'t like dogs.',
    quickTry: {
      promptHe: 'הרעיון השני הפוך מהראשון. מה מתאים?',
      questionEn: 'My brother is young, ____ he can read.',
      correct: 'but',
      wrong: 'or',
      explainHe: 'צעיר, ובכל זאת יודע לקרוא: אלה רעיונות הפוכים, ולכן but.',
    },
  },
  'g4-u23-m2': {
    titleHe: 'למה? כי… because 💭',
    ideaHe:
      'because (כי) נותן סיבה. הוא עונה על השאלה Why? (למה?). אחרי because בא משפט שלם עם נושא ופועל.',
    pattern: '… because + משפט שלם',
    examples: [
      { en: 'I am thirsty because it is hot.', he: 'אני צמא/ה כי חם.', highlight: 'because', emoji: '🥤' },
      { en: 'We laugh because the clown is funny.', he: 'אנחנו צוחקים כי הליצן מצחיק.', highlight: 'because', emoji: '😂' },
      { en: 'Take an umbrella because it is raining.', he: 'קחו מטרייה כי יורד גשם.', highlight: 'because', emoji: '☔' },
    ],
    tipHe: 'לא משאירים את because בלי משפט אחריו: because it is hot, ולא because hot.',
    quickTry: {
      promptHe: 'איזו מילה נותנת סיבה?',
      questionEn: 'Dana is happy ____ her friend is here.',
      correct: 'because',
      wrong: 'or',
      explainHe: 'החברה שלה כאן: זו הסיבה שדנה שמחה, ולכן because.',
    },
  },
};
