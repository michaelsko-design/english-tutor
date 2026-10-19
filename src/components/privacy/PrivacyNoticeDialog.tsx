import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { APP_NAME, PRIVACY_CONTACT_EMAIL } from '../../config/appInfo';

interface PrivacyNoticeDialogProps {
  theme: ThemeDefinition;
  onClose: () => void;
}

const SECTIONS: { titleHe: string; bodyHe: string[] }[] = [
  {
    titleHe: 'מה נשמר',
    bodyHe: [
      'שם פרטי, גיל, מגדר (לפנייה נכונה בעברית), כיתה, ערכת הנושא וקול ההקראה.',
      'ההתקדמות: כוכבים, נקודות, יהלומים, רצף, יומן פעילות של 12 השבועות האחרונים, רשימות מילים, חלומות, ציורים ופריטי החדר.',
      'שם משתמש או חשבון Google שבהם נכנסים. הקוד הסודי נשמר אצל Google Firebase ולא אצלנו.',
    ],
  },
  {
    titleHe: 'איפה זה נשמר',
    bodyHe: [
      'בשירות Google Firebase (ההתקדמות נשמרת בשרתים באירופה), ועותק במכשיר עצמו כדי שהאפליקציה תעבוד גם בלי אינטרנט.',
      'הקראה באנגלית מגיעה משירות Microsoft Azure; נשלח אליו רק הטקסט האנגלי שמוקרא, בלי פרטים על הלומד/ת.',
      'זיהוי הדיבור בתרגילי ההגייה נעשה על ידי הדפדפן (Google או Apple), לפי ההגדרות של המכשיר.',
    ],
  },
  {
    titleHe: 'מה חברים רואים',
    bodyHe: [
      'רק אם מרכז החברים פעיל: שם פרטי, דמות, רמה, רצף, כוכבים ומספר משימות. אין צ׳אט ואין טקסט חופשי.',
      'מתחת לגיל 13 מרכז החברים כבוי עד שהורה מפעיל אותו בהגדרות.',
    ],
  },
  {
    titleHe: 'מה לא עושים',
    bodyHe: ['אין פרסומות, אין מכירה או העברה של מידע, ואין מעקב אחרי הלומד/ת מחוץ לאפליקציה.'],
  },
  {
    titleHe: 'הזכויות שלכם',
    bodyHe: [
      'בהגדרות אפשר להוריד את כל הנתונים כקובץ, ולמחוק את החשבון ואת כל המידע שלו לצמיתות.',
      `לשאלות ובקשות: ${PRIVACY_CONTACT_EMAIL}`,
    ],
  },
];

/** The privacy notice for parents and learners, opened from the sign-in screen and the settings. */
export const PrivacyNoticeDialog: React.FC<PrivacyNoticeDialogProps> = ({ theme, onClose }) => (
  <ExamModalShell
    theme={theme}
    labelHe="פרטיות ומידע"
    onClose={onClose}
    header={<h2 className="font-extrabold text-base sm:text-lg">🔒 פרטיות ומידע</h2>}
  >
    <div className="p-4 sm:p-5 space-y-4 text-sm">
      <p className={theme.mutedTextClass}>
        <bdi>{APP_NAME}</bdi> היא אפליקציה ללימוד אנגלית לילדים ולבני נוער. כאן מוסבר איזה מידע נשמר, למה ואיך מוחקים אותו.
      </p>
      {SECTIONS.map((section) => (
        <section key={section.titleHe} className="space-y-1.5">
          <h3 className="font-extrabold">{section.titleHe}</h3>
          <ul className="list-disc ps-5 space-y-1">
            {section.bodyHe.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  </ExamModalShell>
);
