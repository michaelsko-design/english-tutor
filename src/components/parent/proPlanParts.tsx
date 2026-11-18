import React from 'react';
import type { BillingPeriod, ProPriceQuote } from '../../config/proTier';
import type { ThemeDefinition } from '../../themes/themeRegistry';

/** A click-to-chat link with the message filled in (wa.me with our number, or a chat picker without one). */
export function buildWhatsAppChatUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Shekels from agorot: whole shekels for charges, agorot kept for per-month figures. */
export function formatShekels(agorot: number, hasAgorot = false): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: hasAgorot ? 2 : 0,
    maximumFractionDigits: hasAgorot ? 2 : 0,
  }).format(Math.round(agorot) / 100);
}

/**
 * Recurring charges (הוראת קבע) are card only at Grow (terms §13.2.2, §13.4.2, §13.5.2):
 * Bit and the wallets work only for the one yearly payment.
 */
export const PaymentMethodsNote: React.FC<{ period: BillingPeriod; className?: string }> = ({ period, className = '' }) => (
  <p className={`text-xs font-bold ${className}`}>
    {period === 'monthly' ? (
      'תשלום בכרטיס אשראי בלבד'
    ) : (
      <>
        תשלום ב-<bdi dir="ltr" lang="en">Bit</bdi>, <bdi dir="ltr" lang="en">Apple Pay</bdi>,{' '}
        <bdi dir="ltr" lang="en">Google Pay</bdi> או בכרטיס אשראי
      </>
    )}
  </p>
);

/** How each plan renews, under the total */
export const RENEWAL_LINE_HE: Readonly<Record<BillingPeriod, string>> = {
  monthly: 'מתחדש כל חודש עד שמבטלים. אפשר לבטל בכל עת כאן בפורטל.',
  yearly: 'תשלום אחד לשנה. לא מתחדש מעצמו.',
};

const childrenTotalHe = (children: number) => (children === 1 ? 'סה״כ לילד אחד' : `סה״כ ל-${children} ילדים`);

interface ProPriceBoxProps {
  theme: ThemeDefinition;
  period: BillingPeriod;
  childCount: number;
  /** Null when no plan covers the count (none ticked, or past the seat limit) */
  quote: ProPriceQuote | null;
}

/** The charge for the ticked children and period, what it comes to a month, and what yearly saves */
export const ProPriceBox: React.FC<ProPriceBoxProps> = ({ theme, period, childCount, quote }) => (
  <div className={`p-4 rounded-2xl text-center space-y-1 ${theme.inputBgClass}`} aria-live="polite" data-testid="pro-price-box">
    {quote ? (
      <>
        <p className={`text-sm font-extrabold ${theme.mutedTextClass}`}>{childrenTotalHe(childCount)}</p>
        <p className="text-3xl font-black" data-testid="pro-checkout-total">
          {formatShekels(quote.chargeAgorot)}
          <span className="text-base font-extrabold"> {period === 'yearly' ? 'לשנה' : 'לחודש'}</span>
        </p>
        {period === 'yearly' && <p className="text-sm font-bold">כ-{formatShekels(quote.perMonthAgorot, true)} לחודש</p>}
        {childCount > 1 && (
          <p className={`text-sm font-bold ${theme.mutedTextClass}`}>כ-{formatShekels(quote.perChildMonthAgorot, true)} לחודש לכל ילד</p>
        )}
        <p className={`text-sm font-extrabold ${theme.accentTextClass}`}>
          {period === 'yearly'
            ? `חוסכים ${formatShekels(quote.yearlySavingsAgorot)} בשנה לעומת תשלום חודשי`
            : `במנוי שנתי חוסכים ${formatShekels(quote.yearlySavingsAgorot)} בשנה`}
        </p>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>{RENEWAL_LINE_HE[period]}</p>
      </>
    ) : (
      <p className="text-lg font-black" data-testid="pro-checkout-total">
        בחרו לפחות ילד אחד
      </p>
    )}
    <PaymentMethodsNote period={period} className={theme.mutedTextClass} />
  </div>
);
