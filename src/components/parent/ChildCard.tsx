import React from 'react';
import { ChildGlance, ParentLink } from '../../data/parentLink';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface ChildCardProps {
  link: ParentLink;
  /** undefined while loading, null when the learner has no report yet */
  glance: ChildGlance | null | undefined;
  theme: ThemeDefinition;
  isBusy: boolean;
  isResetOpen: boolean;
  onOpenReport: () => void;
  onToggleReset: () => void;
  onUnlink: () => void;
  /** The child's Pro line (parent portal Pro), under the stats */
  proSection?: React.ReactNode;
  /** The PIN form, shown under the card while it is open */
  children?: React.ReactNode;
}

const actionClass = 'min-h-11 px-3 rounded-2xl text-sm font-extrabold';
const pillClass = 'px-2.5 py-1 rounded-xl bg-white/70 dark:bg-white/10 text-xs font-extrabold whitespace-nowrap';

function lastActiveHe(daysSince: number | null): string {
  if (daysSince === null) return 'עדיין לא התאמנ/ה';
  if (daysSince === 0) return 'היום';
  if (daysSince === 1) return 'אתמול';
  return `לפני ${daysSince} ימים`;
}

/** The one-line summary of a learner: streak, level, this week's practice days and the last practice. */
const GlanceLine: React.FC<{ glance: ChildGlance; theme: ThemeDefinition }> = ({ glance, theme }) => (
  <ul className="flex flex-wrap gap-1.5" aria-label="תמצית">
    <li className={pillClass}>🔥 {glance.streakDays > 0 ? `${glance.streakDays} ימים ברצף` : 'אין רצף'}</li>
    <li className={pillClass}>⭐ רמה {glance.level}</li>
    <li className={pillClass}>📅 השבוע: {glance.activeDaysThisWeek} ימים</li>
    <li className={`${pillClass} ${theme.mutedTextClass}`}>🕒 אחרון: {lastActiveHe(glance.daysSinceActive)}</li>
  </ul>
);

/** A paired learner: name and a stats line on top, the actions below (stacked, so it also fits a phone). */
export const ChildCard: React.FC<ChildCardProps> = ({
  link,
  glance,
  theme,
  isBusy,
  isResetOpen,
  onOpenReport,
  onToggleReset,
  onUnlink,
  proSection,
  children,
}) => (
  <div className="space-y-2">
    <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 space-y-3">
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 font-extrabold text-base">
          <span aria-hidden="true" className="text-2xl">
            {link.childAvatar}
          </span>
          {link.childName}
        </h3>
        {glance === undefined && (
          <p role="status" className={`text-xs font-bold ${theme.mutedTextClass}`}>
            טוענים…
          </p>
        )}
        {glance === null && (
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
            עוד אין נתונים. הם יופיעו אחרי שייכנסו לאפליקציה כשההורה מחובר.
          </p>
        )}
        {glance && <GlanceLine glance={glance} theme={theme} />}
        {proSection}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isBusy}
          onClick={onOpenReport}
          className={`${actionClass} col-span-2 ${theme.primaryBtnClass}`}
        >
          הדוח השבועי
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onToggleReset}
          aria-expanded={isResetOpen}
          className={`${actionClass} ${theme.secondaryBtnClass}`}
        >
          החלפת קוד סודי
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={onUnlink}
          className={`${actionClass} border border-rose-500/50 text-rose-700 dark:text-rose-300`}
        >
          ניתוק
        </button>
      </div>
    </div>
    {children}
  </div>
);
