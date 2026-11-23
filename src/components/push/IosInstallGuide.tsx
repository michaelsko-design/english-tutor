import React from 'react';
import { PlusSquare, Share, Smartphone } from 'lucide-react';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface IosInstallGuideProps {
  theme: ThemeDefinition;
  /** A heading for the steps; leave it out where the surrounding card already says what they are for */
  title?: string;
}

interface InstallStep {
  Icon: typeof Share;
  textHe: React.ReactNode;
}

const STEPS: InstallStep[] = [
  { Icon: Share, textHe: 'לוחצים על כפתור השיתוף בדפדפן (ריבוע עם חץ למעלה).' },
  {
    Icon: PlusSquare,
    textHe: (
      <>
        בוחרים <bdi dir="ltr" lang="en">Add to Home Screen</bdi> (הוספה למסך הבית).
      </>
    ),
  },
  { Icon: Smartphone, textHe: 'פותחים את האפליקציה מהסמל החדש במסך הבית, ומפעילים שם את התזכורת.' },
];

/**
 * iPhone and iPad allow web push only for an app added to the Home Screen (getReminderSupport()
 * returns 'needs-install'), so this shows the three steps. Plain numbered text with lucide icons
 * (no Apple screenshots), so a screen reader reads every step. Gender-neutral plural, like hints.
 */
export const IosInstallGuide: React.FC<IosInstallGuideProps> = ({ theme, title }) => (
  <div className="space-y-2 text-start">
    {title && <h3 className="font-extrabold text-sm">{title}</h3>}
    <ol className="space-y-2" aria-label="שלבי ההוספה למסך הבית">
      {STEPS.map(({ Icon, textHe }, index) => (
        <li key={index} className="flex items-start gap-2.5">
          <span
            className="shrink-0 w-7 h-7 rounded-full bg-pink-500 text-white text-xs font-extrabold inline-flex items-center justify-center"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p className={`text-xs sm:text-sm font-bold ${theme.mutedTextClass}`}>{textHe}</p>
        </li>
      ))}
    </ol>
  </div>
);
