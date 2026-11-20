import React, { useState } from 'react';
import type { ChildProStatus, OpenPlan } from '../../data/proPlanStatus';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { CancelQuote } from '../../services/proBillingService';
import { formatShekels } from './proPlanParts';
import { CancelPlanPanel } from './CancelPlanPanel';

interface ChildProSectionProps {
  childName: string;
  /** undefined while the entitlement loads */
  status: ChildProStatus | undefined;
  /** For a free child: the paying parent's plan with a seat for them */
  openPlan: OpenPlan | null;
  theme: ThemeDefinition;
  isBusy: boolean;
  /** A child who never had Pro can get one free Pro week, which the parent starts (api/pro-trial.ts) */
  canStartTrial: boolean;
  onStartTrial: () => void;
  onUpgrade: () => void;
  onRenew: () => void;
  onCancelRenewal: () => void;
  /** What cancelling gives back (null when it could not be loaded; the hook shows the error) */
  onLoadCancelQuote: () => Promise<CancelQuote | null>;
  onCancelWithRefund: () => void;
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
  canStartTrial,
  onStartTrial,
  onUpgrade,
  onRenew,
  onCancelRenewal,
  onLoadCancelQuote,
  onCancelWithRefund,
  onAddToPlan,
  onRemoveFromPlan,
}) => {
  const [confirming, setConfirming] = useState<'cancel' | 'remove' | 'add' | null>(null);
  const [quote, setQuote] = useState<CancelQuote | null>(null);
  if (status === undefined) return null;

  const openCancel = async () => {
    setQuote(null);
    setConfirming('cancel');
    const loaded = await onLoadCancelQuote();
    if (loaded) setQuote(loaded);
    else setConfirming(null);
  };

  if (status.kind === 'comp') {
    return (
      <p className="text-sm font-extrabold" data-testid="child-pro-status">
        <ProLabel /> פעיל (מתנה)
      </p>
    );
  }

  if (status.kind === 'trial') {
    return (
      <div className="space-y-2" data-testid="child-pro-status">
        <p className="text-sm font-extrabold">
          {status.hasEnded ? (
            <>
              שבוע ה-<bdi dir="ltr" lang="en">Pro</bdi> החינמי הסתיים ב-{formatDateHe(status.endsAt)}
            </>
          ) : (
            <>
              <ProLabel /> · שבוע חינם, עד {formatDateHe(status.endsAt)}
            </>
          )}
        </p>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
          {status.hasEnded ? 'החשבון חזר לחינמי, וכל ההתקדמות נשמרה.' : 'בסוף השבוע החשבון חוזר לחינמי לבד, בלי חיוב.'}
        </p>
        <button type="button" disabled={isBusy} onClick={onUpgrade} className={`${actionClass} w-full ${theme.primaryBtnClass}`}>
          שדרוג ל-<ProLabel />
        </button>
      </div>
    );
  }

  if (status.kind === 'free') {
    const nextMonthly = openPlan?.nextMonthlyAgorot ?? null;
    const addLabel =
      nextMonthly != null ? `הוספה למנוי שלי (${formatShekels(nextMonthly)} לחודש מהחיוב הבא)` : 'הוספה למנוי השנתי שלי';
    // A higher monthly charge is confirmed first (the server saves the confirmation)
    const onAddClick = () => (nextMonthly != null ? setConfirming('add') : onAddToPlan());
    return (
      <div className="space-y-2" data-testid="child-pro-status">
        <p className={`text-sm font-bold ${theme.mutedTextClass}`}>חשבון חינמי</p>
        {canStartTrial && (
          <div className={`p-2.5 rounded-2xl space-y-2 ${theme.inputBgClass}`}>
            <p className="text-xs sm:text-sm font-bold">
              שבוע <bdi dir="ltr" lang="en">Pro</bdi> חינם: 7 ימים, בלי כרטיס אשראי ובלי התחייבות. בסוף השבוע החשבון חוזר לחינמי לבד.
            </p>
            <button type="button" disabled={isBusy} onClick={onStartTrial} className={`${actionClass} w-full ${theme.primaryBtnClass}`}>
              {`שבוע Pro חינם ל${childName}`}
            </button>
          </div>
        )}
        {openPlan && confirming === 'add' && nextMonthly != null ? (
          <div className={`p-2.5 rounded-2xl space-y-2 ${theme.inputBgClass}`}>
            <p className="text-xs sm:text-sm font-bold">
              {`להוסיף את ${childName} למנוי? מהחיוב הבא החיוב החודשי בהוראת הקבע יהיה ${formatShekels(nextMonthly)}, עד שמבטלים.`}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isBusy}
                onClick={() => {
                  setConfirming(null);
                  onAddToPlan();
                }}
                className={`${actionClass} flex-1 ${theme.primaryBtnClass}`}
              >
                {`כן, להוסיף (${formatShekels(nextMonthly)} לחודש)`}
              </button>
              <button type="button" onClick={() => setConfirming(null)} className={`${actionClass} ${theme.secondaryBtnClass}`}>
                חזרה
              </button>
            </div>
          </div>
        ) : openPlan ? (
          <button type="button" disabled={isBusy} onClick={onAddClick} className={`${actionClass} w-full ${theme.secondaryBtnClass}`}>
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
      {confirming === 'cancel' && status.isPayer && (
        <CancelPlanPanel
          quote={quote}
          period={status.period}
          isRenewing={status.isRenewing}
          theme={theme}
          isBusy={isBusy}
          formatDate={formatDateHe}
          onCancelWithRefund={() => {
            setConfirming(null);
            onCancelWithRefund();
          }}
          onStopRenewal={() => {
            setConfirming(null);
            onCancelRenewal();
          }}
          onBack={() => setConfirming(null)}
        />
      )}
      {confirming === 'remove' && status.isPayer && (
        <div className={`p-2.5 rounded-2xl space-y-2 ${theme.inputBgClass}`}>
          <p className="text-xs sm:text-sm font-bold">
            {`להוציא את ${childName} מהמנוי? ל${childName} יישאר Pro לכל היותר עוד חודש, והמקום במנוי יתפנה.`}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => {
                setConfirming(null);
                onRemoveFromPlan();
              }}
              className={`${actionClass} flex-1 border border-rose-500/50 text-rose-700 dark:text-rose-300`}
            >
              כן, להוציא
            </button>
            <button type="button" onClick={() => setConfirming(null)} className={`${actionClass} ${theme.secondaryBtnClass}`}>
              חזרה
            </button>
          </div>
        </div>
      )}
      {!confirming && status.isPayer && !status.hasLeftPlan && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <button type="button" disabled={isBusy} onClick={() => void openCancel()} className={`${linkClass} ${theme.mutedTextClass}`}>
            {status.isRenewing ? 'ביטול החידוש או המנוי' : 'ביטול המנוי'}
          </button>
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
