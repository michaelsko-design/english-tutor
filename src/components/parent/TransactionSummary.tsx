import React from 'react';
import {
  APP_NAME,
  BUSINESS_OWNER_HE,
  CANCEL_PAGE_PATH,
  PRIVACY_CONTACT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  TERMS_PAGE_PATH,
} from '../../config/appInfo';
import { proPriceAgorot, type BillingPeriod } from '../../config/proTier';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { formatShekels } from './proPlanParts';

/** The plan just bought, as the portal sees it on the children's entitlements */
export interface PaidPlan {
  period: BillingPeriod;
  seats: number;
  /** Pro until (ms): the next charge on a monthly plan, the end of the year on a yearly one */
  periodEnd: number;
}

interface TransactionSummaryProps {
  plan: PaidPlan;
  childNames: readonly string[];
  theme: ThemeDefinition;
  formatDate: (ms: number) => string;
  /** The family's one full refund within 14 days is still open; false: already used; null: not known yet */
  hasFullRefund?: boolean | null;
}

function priceLineHe(plan: PaidPlan, formatDate: (ms: number) => string): string {
  const amount = proPriceAgorot(plan.seats, plan.period);
  const price = amount === null ? '' : formatShekels(amount);
  return plan.period === 'monthly'
    ? `${price} לחודש (פטור ממע״מ), בכרטיס אשראי בהוראת קבע. מתחדש כל חודש באותו סכום עד שמבטלים; החיוב הבא ב-${formatDate(plan.periodEnd)}. אם חיוב נכשל, חברת התשלומים תנסה שוב במשך עד 10 ימים.`
    : `${price} לשנה (פטור ממע״מ), תשלום אחד. המנוי לא מתחדש מעצמו ומסתיים ב-${formatDate(plan.periodEnd)}.`;
}

function cancelLineHe(plan: PaidPlan, hasFullRefund: boolean | null): string {
  const monthly = proPriceAgorot(plan.seats, 'monthly');
  const rate = monthly === null ? 'המחיר החודשי הרגיל ביום הרכישה' : `${formatShekels(monthly)} (המחיר החודשי הרגיל ביום הרכישה, או המחיר באותו יום אם ירד)`;
  const rule =
    plan.period === 'monthly'
      ? 'אפשר לבטל בכל עת: לא יהיו חיובים נוספים, ו-Pro נשאר עד סוף החודש ששולם (ולפי בקשה, סיום בתוך 3 ימי עסקים עם החזר יחסי).'
      : `יוחזר הסכום ששולם פחות ${rate} לכל חודש שהתחיל.`;
  const refundLine =
    hasFullRefund === false
      ? `ההחזר המלא בתוך 14 יום ניתן פעם אחת לכל משפחה, וכבר נוצל. לכן ${plan.period === 'monthly' ? rule : `בביטול ${rule}`}`
      : `ביטול בתוך 14 יום מהיום: החזר מלא, פעם אחת לכל משפחה. אחר כך ${rule}`;
  return `${refundLine} אזרח ותיק, אדם עם מוגבלות ועולה חדש רשאים לבטל בתוך 4 חודשים כשהעסקה כללה שיחה איתנו.`;
}

/**
 * The written summary of the purchase and the cancellation rights, shown right after payment so the
 * parent can save or print it (Consumer Protection Law §14ג(ב)–(ג); legal audit MISS-03).
 */
export const TransactionSummary: React.FC<TransactionSummaryProps> = ({ plan, childNames, theme, formatDate, hasFullRefund = null }) => (
  <article className={`p-3 rounded-2xl space-y-2 text-xs sm:text-sm ${theme.inputBgClass}`} aria-labelledby="transaction-summary-title" data-testid="transaction-summary">
    <h3 id="transaction-summary-title" className="text-sm font-extrabold">
      סיכום עסקה ופרטי ביטול
    </h3>
    <p className="font-bold">
      <bdi dir="ltr" lang="en">{APP_NAME} Pro</bdi>, {plan.period === 'monthly' ? 'מנוי חודשי' : 'מנוי שנתי'} עבור {childNames.join(', ')}: כל היחידות
      והבוסים, הכנה מלאה למבחן, עד 10 רשימות מילים פעילות, וכל ערכות העיצוב והדמויות.
    </p>
    <p>{priceLineHe(plan, formatDate)}</p>
    <p>{cancelLineHe(plan, hasFullRefund)}</p>
    <p>
      דרכי ביטול: בפורטל ההורים, בעמוד{' '}
      <a href={CANCEL_PAGE_PATH} target="_blank" rel="noopener" className="underline font-bold">
        ביטול עסקה
      </a>
      , באימייל <bdi dir="ltr">{PRIVACY_CONTACT_EMAIL}</bdi>, בטלפון <bdi dir="ltr">{SUPPORT_PHONE_DISPLAY}</bdi>, או בדואר רשום.
    </p>
    <p className={theme.mutedTextClass}>
      העוסק: {BUSINESS_OWNER_HE}. התנאים המלאים:{' '}
      <a href={TERMS_PAGE_PATH} target="_blank" rel="noopener" className="underline">
        תנאי השימוש והמנוי
      </a>
      . הקבלה נשלחת לאימייל שמסרתם בתשלום.
    </p>
    <button type="button" onClick={() => window.print()} className={`min-h-11 px-4 rounded-2xl text-sm font-extrabold print:hidden ${theme.secondaryBtnClass}`}>
      שמירה או הדפסה
    </button>
  </article>
);
