import React, { useRef, useState } from 'react';
import { APP_NAME, SUPPORT_WHATSAPP_NUMBER } from '../../config/appInfo';
import { MAX_PRO_SEATS, quoteProPrice, type BillingPeriod } from '../../config/proTier';
import type { ThemeDefinition } from '../../themes/themeRegistry';

export interface ProPlanChoice {
  children: number;
  period: BillingPeriod;
}

interface ProPlanPickerProps {
  theme: ThemeDefinition;
  /** The counter starts here (e.g. the number of linked children), kept within 1–4 */
  initialChildren?: number;
  /** Shows the continue button; left out until checkout is wired to the portal */
  onContinue?: (choice: ProPlanChoice) => void;
}

const MORE_KIDS_MESSAGE_HE = `היי, אני מעוניין/ת במנוי ל-${APP_NAME} עבור יותר מ-4 ילדים. אשמח לקבל פרטים על חבילה מורחבת!`;

const segmentClass = 'flex-1 min-h-11 px-3 rounded-2xl text-sm font-extrabold transition-colors';
const stepperClass = 'w-11 h-11 rounded-2xl text-xl font-black disabled:opacity-40';

/** A click-to-chat link with the message filled in (wa.me with our number, or a chat picker without one). */
export function buildWhatsAppChatUrl(phoneDigits: string, message: string): string {
  return `https://wa.me/${phoneDigits.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Shekels from agorot: whole shekels for charges, agorot kept for per-month figures. */
function shekels(agorot: number, hasAgorot = false): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: hasAgorot ? 2 : 0,
    maximumFractionDigits: hasAgorot ? 2 : 0,
  }).format(Math.round(agorot) / 100);
}

const clampChildren = (children: number) => Math.min(MAX_PRO_SEATS, Math.max(1, Math.round(children)));

const childrenLabelHe = (children: number) => (children === 1 ? 'ילד אחד' : `${children} ילדים`);

/**
 * The parent's Pro plan picker (docs/feature-pro-tier.md, "Pricing and seats"): the billing period,
 * a 1–4 children counter, and a price box that follows both. Parents only; learners never see prices.
 */
export const ProPlanPicker: React.FC<ProPlanPickerProps> = ({ theme, initialChildren = 1, onContinue }) => {
  const [period, setPeriod] = useState<BillingPeriod>('yearly');
  const [children, setChildren] = useState(() => clampChildren(initialChildren));
  const [isMoreKidsHighlighted, setIsMoreKidsHighlighted] = useState(false);
  const moreKidsRef = useRef<HTMLAnchorElement>(null);
  const quote = quoteProPrice(children, period);
  if (!quote) return null;

  const handleAdd = () => {
    if (children < MAX_PRO_SEATS) {
      setChildren(children + 1);
      return;
    }
    // Past the top of the counter, point to the WhatsApp option instead
    setIsMoreKidsHighlighted(true);
    moreKidsRef.current?.focus();
  };

  const handleRemove = () => {
    setIsMoreKidsHighlighted(false);
    setChildren(Math.max(1, children - 1));
  };

  const periodButton = (value: BillingPeriod, label: React.ReactNode) => (
    <button
      type="button"
      role="radio"
      aria-checked={period === value}
      onClick={() => setPeriod(value)}
      className={`${segmentClass} ${period === value ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
    >
      {label}
    </button>
  );

  return (
    <section className={`p-4 rounded-3xl space-y-4 ${theme.cardBgClass}`} aria-labelledby="pro-plan-title">
      <h2 id="pro-plan-title" className="text-base font-extrabold">
        מנוי <bdi dir="ltr" lang="en">{APP_NAME} Pro</bdi>
      </h2>

      <div role="radiogroup" aria-label="תדירות התשלום" className="flex gap-2">
        {periodButton('monthly', 'חודשי')}
        {periodButton(
          'yearly',
          <>
            שנתי <span className="text-xs font-bold">(3 חודשים מתנה)</span>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button type="button" onClick={handleRemove} disabled={children === 1} aria-label="פחות ילדים" className={`${stepperClass} ${theme.secondaryBtnClass}`}>
          −
        </button>
        <p className="min-w-28 text-center text-lg font-black" aria-live="polite">
          {childrenLabelHe(children)}
        </p>
        <button type="button" onClick={handleAdd} aria-label="עוד ילד" className={`${stepperClass} ${theme.secondaryBtnClass}`}>
          +
        </button>
      </div>

      <div className={`p-4 rounded-2xl text-center space-y-1 ${theme.inputBgClass}`} aria-live="polite" data-testid="pro-price-box">
        <p className="text-3xl font-black">
          {shekels(quote.chargeAgorot)}
          <span className="text-base font-extrabold"> {period === 'yearly' ? 'לשנה' : 'לחודש'}</span>
        </p>
        {period === 'yearly' && <p className="text-sm font-bold">כ-{shekels(quote.perMonthAgorot, true)} לחודש</p>}
        {children > 1 && (
          <p className={`text-sm font-bold ${theme.mutedTextClass}`}>כ-{shekels(quote.perChildMonthAgorot, true)} לחודש לכל ילד</p>
        )}
        <p className={`text-sm font-extrabold ${theme.accentTextClass}`}>
          {period === 'yearly'
            ? `חוסכים ${shekels(quote.yearlySavingsAgorot)} בשנה לעומת תשלום חודשי`
            : `במנוי שנתי חוסכים ${shekels(quote.yearlySavingsAgorot)} בשנה`}
        </p>
      </div>

      <a
        ref={moreKidsRef}
        href={buildWhatsAppChatUrl(SUPPORT_WHATSAPP_NUMBER, MORE_KIDS_MESSAGE_HE)}
        target="_blank"
        rel="noopener noreferrer"
        className={`block min-h-11 px-3 py-2.5 rounded-2xl text-center text-sm font-bold ${theme.secondaryBtnClass} ${
          isMoreKidsHighlighted ? 'ring-4 ring-emerald-400' : ''
        }`}
      >
        צריכים מנוי ליותר מ-4 ילדים? דברו איתנו בוואטסאפ 💬
      </a>

      {onContinue && (
        <button
          type="button"
          onClick={() => onContinue({ children, period })}
          className={`w-full min-h-11 px-4 rounded-2xl text-sm font-extrabold ${theme.primaryBtnClass}`}
        >
          המשך לתשלום
        </button>
      )}

      <p className={`text-xs font-bold text-center ${theme.mutedTextClass}`}>
        התחברות אחת להורה עם פרופיל נפרד לכל ילד • אפשר לבטל בכל עת
      </p>
    </section>
  );
};
