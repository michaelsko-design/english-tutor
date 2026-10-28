import React, { useState } from 'react';
import { paymentReturnUrl } from '../../data/parentProRoute';
import { payMockCheckout } from '../../services/proBillingService';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface MockPaymentPageProps {
  checkoutId: string;
  theme: ThemeDefinition;
  onNavigate?: (url: string) => void;
}

const buttonClass = 'min-h-11 px-4 rounded-2xl text-sm font-extrabold';

/**
 * The stand-in gateway's payment page (emulator runs only, PAYMENT_PROVIDER=mock): pay or cancel,
 * then back to the portal as the real gateway would send the parent.
 */
export const MockPaymentPage: React.FC<MockPaymentPageProps> = ({ checkoutId, theme, onNavigate = (url) => window.location.assign(url) }) => {
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  const handlePay = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await payMockCheckout(checkoutId);
    if (result.ok) {
      onNavigate(paymentReturnUrl(checkoutId));
      return;
    }
    setIsBusy(false);
    setErrorHe(result.errorHe);
  };

  return (
    <section className={`p-4 rounded-3xl space-y-3 border-4 border-dashed border-amber-400 ${theme.cardBgClass}`} aria-label="דף תשלום לבדיקה">
      <h2 className="text-base font-extrabold">דף תשלום לבדיקה</h2>
      <p className="text-sm font-bold">זה לא דף תשלום אמיתי ואין כאן חיוב. הוא מופיע רק בהרצה מקומית.</p>
      {errorHe && (
        <p role="alert" className="text-sm font-extrabold text-rose-700 dark:text-rose-300">
          {errorHe}
        </p>
      )}
      <div className="flex gap-2">
        <button type="button" disabled={isBusy} onClick={() => void handlePay()} className={`${buttonClass} flex-1 ${theme.primaryBtnClass}`}>
          תשלום לבדיקה
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onNavigate(paymentReturnUrl(checkoutId, true))}
          className={`${buttonClass} ${theme.secondaryBtnClass}`}
        >
          ביטול
        </button>
      </div>
    </section>
  );
};
