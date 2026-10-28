import React, { useState } from 'react';
import type { ChildProStatus, OpenPlan } from '../../data/proPlanStatus';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { formatShekels } from './ProPlanPicker';

interface ChildProSectionProps {
  childName: string;
  /** undefined while the entitlement loads */
  status: ChildProStatus | undefined;
  /** For a free child: the paying parent's plan with a seat for them */
  openPlan: OpenPlan | null;
  theme: ThemeDefinition;
  isBusy: boolean;
  onUpgrade: () => void;
  onRenew: () => void;
  onCancelRenewal: () => void;
  onAddToPlan: () => void;
  onRemoveFromPlan: () => void;
}

const actionClass = 'min-h-11 px-3 rounded-2xl text-sm font-extrabold';
const linkClass = 'text-xs font-bold underline';

export function formatDateHe(ms: number): string {
  return new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(ms);
}

const ProLabel = () => (
  <>
    👑 <bdi dir="ltr" lang="en">Pro</bdi>
  </>
);

function planLineHe(status: Extract<ChildProStatus, { kind: 'plan' }>): string {
  const date = formatDateHe(status.periodEnd);
  if (status.isRenewing) return `מנוי חודשי, מתחדש ב-${date}`;
  if (status.hasLeftPlan) return `יצא/ה מהמנוי, בתוקף עד ${date}`;
  return status.period === 'yearly' ? `מנוי שנתי, בתוקף עד ${date}` : `המנוי בוטל, בתוקף עד ${date}`;
}

/** A child's Pro line in the parent portal: the plan, and the paying parent's controls. */
export const ChildProSection: React.FC<ChildProSectionProps> = ({
  childName,
  status,
  openPlan,
  theme,
  isBusy,
  onUpgrade,
  onRenew,
  onCancelRenewal,
  onAddToPlan,
  onRemoveFromPlan,
}) => {
  const [confirming, setConfirming] = useState<'cancel' | 'remove' | null>(null);
  if (status === undefined) return null;

  if (status.kind === 'comp') {
    return (
      <p className="text-sm font-extrabold" data-testid="child-pro-status">
        <ProLabel /> פעיל (מתנה)
      </p>
    );
  }

  if (status.kind === 'free') {
    const addLabel =
      openPlan?.nextMonthlyAgorot != null
        ? `הוספה למנוי שלי (${formatShekels(openPlan.nextMonthlyAgorot)} לחודש מהחיוב הבא)`
        : 'הוספה למנוי השנתי שלי';
    return (
      <div className="space-y-2" data-testid="child-pro-status">
        <p className={`text-sm font-bold ${theme.mutedTextClass}`}>חשבון חינמי</p>
        {openPlan ? (
          <button type="button" disabled={isBusy} onClick={onAddToPlan} className={`${actionClass} w-full ${theme.secondaryBtnClass}`}>
            {addLabel}
          </button>
        ) : (
          <button type="button" disabled={isBusy} onClick={onUpgrade} className={`${actionClass} w-full ${theme.secondaryBtnClass}`}>
            שדרוג ל-<ProLabel />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2" data-testid="child-pro-status">
      <p className="text-sm font-extrabold">
        <ProLabel /> פעיל · <span className="font-bold">{planLineHe(status)}</span>
      </p>
      {status.isPastDue && (
        <p role="alert" className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
          החיוב האחרון לא עבר. כדאי לבדוק את אמצעי התשלום.
        </p>
      )}
      {!status.isPayer && <p className={`text-xs font-bold ${theme.mutedTextClass}`}>את המנוי מנהל ההורה ששילם עליו.</p>}
      {status.shouldOfferRenewal && (
        <div className="p-2.5 rounded-2xl bg-amber-400/20 border-2 border-amber-400 space-y-2">
          <p className="text-xs sm:text-sm font-bold">המנוי השנתי מסתיים ב-{formatDateHe(status.periodEnd)} ולא מתחדש לבד.</p>
          <button type="button" disabled={isBusy} onClick={onRenew} className={`${actionClass} w-full ${theme.primaryBtnClass}`}>
            חידוש לשנה נוספת
          </button>
        </div>
      )}
      {confirming && status.isPayer && (
        <div className={`p-2.5 rounded-2xl space-y-2 ${theme.inputBgClass}`}>
          <p className="text-xs sm:text-sm font-bold">
            {confirming === 'cancel'
              ? `לבטל את החידוש? לא יהיו חיובים נוספים, וכל הילדים במנוי ימשיכו עם Pro עד ${formatDateHe(status.periodEnd)}.`
              : `להוציא את ${childName} מהמנוי? ל${childName} יישאר Pro לכל היותר עוד חודש, והמקום במנוי יתפנה.`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setConfirming(null);
                if (confirming === 'cancel') onCancelRenewal();
                else onRemoveFromPlan();
              }}
              className={`${actionClass} flex-1 border border-rose-500/50 text-rose-700 dark:text-rose-300`}
            >
              {confirming === 'cancel' ? 'כן, לבטל את החידוש' : 'כן, להוציא'}
            </button>
            <button type="button" onClick={() => setConfirming(null)} className={`${actionClass} ${theme.secondaryBtnClass}`}>
              חזרה
            </button>
          </div>
        </div>
      )}
      {!confirming && status.isPayer && (status.isRenewing || status.canRemove) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {status.isRenewing && (
            <button type="button" disabled={isBusy} onClick={() => setConfirming('cancel')} className={`${linkClass} ${theme.mutedTextClass}`}>
              ביטול החידוש
            </button>
          )}
          {status.canRemove && (
            <button type="button" disabled={isBusy} onClick={() => setConfirming('remove')} className={`${linkClass} ${theme.mutedTextClass}`}>
              הוצאה מהמנוי
            </button>
          )}
        </div>
      )}
    </div>
  );
};
