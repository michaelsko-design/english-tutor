import { LearnerGender } from '../types/learner';

/**
 * Returns gender-inflected Hebrew strings so the app speaks naturally
 * to a female ("בת") or male ("בן") student throughout all screens.
 */
export function getHebrewCopy(gender: LearnerGender, name: string) {
  const isGirl = gender === 'girl';
  const cleanName = name.trim() || (isGirl ? 'אלופה' : 'אלוף');

  return {
    welcomeTitle: isGirl
      ? `ברוכה הבאה, ${cleanName}! איזה כיף שחזרת ✨`
      : `ברוך הבא, ${cleanName}! איזה כיף שחזרת ✨`,
    onboardingSubtitle: isGirl
      ? 'בואי נכיר אותך כדי שנתאים את המשימות, הקול והאתגרים בדיוק בשבילך!'
      : 'בוא נכיר אותך כדי שנתאים את המשימות, הקול והאתגרים בדיוק בשבילך!',
    readyForMission: isGirl
      ? `${cleanName}, מוכנה למשימה היומית שלך?`
      : `${cleanName}, מוכן למשימה היומית שלך?`,
    chooseTierPrompt: isGirl
      ? 'בחרי את רמת הקושי למשימה של היום:'
      : 'בחר את רמת הקושי למשימה של היום:',
    startMissionCta: isGirl
      ? 'התחילי משימה בלחיצה אחת'
      : 'התחל משימה בלחיצה אחת',
    championBadge: isGirl ? 'אלופת האנגלית' : 'אלוף האנגלית',
    youLearnedWords: (count: number) =>
      isGirl ? `למדת כבר ${count} מילים חדשות!` : `למדת כבר ${count} מילים חדשות!`,
    keepStreakAlive: isGirl
      ? 'שמרי על הרצף היומי שלך וקבלי יהלומים כפולים!'
      : 'שמור על הרצף היומי שלך וקבל יהלומים כפולים!',
    pronunciationPrompt: isGirl
      ? 'הקשיבי למשפט ואז הקליטי את עצמך קוראת אותו בקול:'
      : 'הקשב למשפט ואז הקלט את עצמך קורא אותו בקול:',
    cloudSyncModalSubtitle: isGirl
      ? 'התחברי כדי שהכוכבים, היהלומים והרצף שלך יישמרו בענן ויסתנכרנו בין הטלפון למחשב!'
      : 'התחבר כדי שהכוכבים, היהלומים והרצף שלך יישמרו בענן ויסתנכרנו בין הטלפון למחשב!',
    loggedInAs: (label: string) =>
      isGirl ? `מחוברת בתור ${label}` : `מחובר בתור ${label}`,
    localGuestTapToSync: isGirl
      ? 'שמור במכשיר (לחצי לסנכרון ☁️)'
      : 'שמור במכשיר (לחץ לסנכרון ☁️)',
  };
}
