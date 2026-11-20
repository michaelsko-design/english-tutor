import React from 'react';
import type { BillingPeriod } from '../../config/proTier';
import { PRIVACY_CONTACT_EMAIL, SUPPORT_PHONE_DISPLAY } from '../../config/appInfo';
import type { CancelQuote } from '../../services/proBillingService';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { formatShekels } from './proPlanParts';

interface CancelPlanPanelProps {
  /** null while the quote loads */
  quote: CancelQuote | null;
  period: BillingPeriod;
  /** A monthly plan that will charge again */
  isRenewing: boolean;
  theme: ThemeDefinition;
  isBusy: boolean;
  formatDate: (ms: number) => string;
  onCancelWithRefund: () => void;
  onStopRenewal: () => void;
  onBack: () => void;
}

const actionClass = 'min-h-11 px-3 rounded-2xl text-sm font-extrabold';
const dangerClass = `${actionClass} border border-rose-500/50 text-rose-700 dark:text-rose-300`;

/** What cancelling gives back, in the parent's words (terms §9, /refunds/) */
function explainHe(quote: CancelQuote, period: BillingPeriod, formatDate: (ms: number) => string): string {
  const until = formatDate(quote.accessUntil);
  const refund = formatShekels(quote.refundAgorot);
  switch (quote.mode) {
    case 'full_refund':
      return `ביטול בתוך 14 יום מהתשלום: יוחזר לכם כל הסכום, ${refund}, בתוך 14 יום. Pro ייסגר עכשיו, וכל ההתקדמות נשמרת.`;
    case 'yearly_prorata':
      return quote.refundAgorot > 0
        ? `ביטול המנוי השנתי: יוחזרו לכם ${refund} (הסכום ששולם, פחות המחיר החודשי הרגיל לכל חודש שהתחיל), בתוך 14 יום. Pro נשאר פעיל עד ${until}.`
        : `לפי מדיניות הביטולים, מהחודש התשיעי של מנוי שנתי אין סכום להחזר. Pro נשאר פעיל עד ${until}, והמנוי לא מתחדש מעצמו.`;
    case 'monthly_end':
      return `לבטל את החידוש? לא יהיו חיובים נוספים, וכל הילדים במנוי ימשיכו עם Pro עד ${until}.`;
    default:
      return period === 'monthly'
        ? `החידוש כבר בוטל, ואין במנוי סכום להחזר. Pro נשאר עד ${until}.`
        : 'אין במנוי הזה מה לבטל או להחזיר.';
  }
}

/** The paying parent's cancellation choices for one plan: the refund it gives, or stopping the renewal. */
export const CancelPlanPanel: React.FC<CancelPlanPanelProps> = ({
  quote,
  period,
  isRenewing,
  theme,
  isBusy,
  formatDate,
  onCancelWithRefund,
  onStopRenewal,
  onBack,
}) => {
  const hasRefund = quote !== null && (quote.mode === 'full_refund' || quote.mode === 'yearly_prorata') && quote.refundAgorot > 0;
  const canStopRenewal = quote !== null && isRenewing && (quote.mode === 'monthly_end' || quote.mode === 'full_refund');
  const refundLabel = quote?.mode === 'full_refund' ? 'ביטול והחזר מלא' : `ביטול והחזר של ${formatShekels(quote?.refundAgorot ?? 0)}`;
  const stopLabel = quote?.mode === 'full_refund' ? 'רק לבטל את החידוש, בלי החזר' : 'כן, לבטל את החידוש';
  return (
    <div className={`p-2.5 rounded-2xl space-y-2 ${theme.inputBgClass}`} data-testid="cancel-plan-panel">
      <p className="text-xs sm:text-sm font-bold" role="status">
        {quote ? explainHe(quote, period, formatDate) : 'בודקים מה מגיע לכם…'}
      </p>
      <div className="flex flex-wrap gap-2">
        {hasRefund && (
          <button type="button" disabled={isBusy} onClick={onCancelWithRefund} className={`${dangerClass} flex-1`}>
            {refundLabel}
          </button>
        )}
        {canStopRenewal && (
          <button type="button" disabled={isBusy} onClick={onStopRenewal} className={`${dangerClass} flex-1`}>
            {stopLabel}
          </button>
        )}
        <button type="button" onClick={onBack} className={`${actionClass} ${theme.secondaryBtnClass}`}>
          חזרה
        </button>
      </div>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        אפשר לבטל גם באימייל <bdi dir="ltr">{PRIVACY_CONTACT_EMAIL}</bdi> או בטלפון <bdi dir="ltr">{SUPPORT_PHONE_DISPLAY}</bdi>.{' '}
        <a href="/refunds/" target="_blank" rel="noopener" className="underline font-bold">
          מדיניות שירות וביטולים
        </a>
      </p>
    </div>
  );
};
