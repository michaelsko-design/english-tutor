import React, { useEffect, useState } from 'react';
import { APP_NAME } from '../../config/appInfo';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface ProPaymentReturnProps {
  theme: ThemeDefinition;
  isCancelled: boolean;
  /** The children's names once their entitlement shows this checkout's plan; null until then */
  activatedNames: readonly string[] | null;
  onDismiss: () => void;
}

/** The gateway's confirmation can take a little while; after this the parent is told it is still on its way */
const SLOW_CONFIRMATION_MS = 60_000;

/** "נועה, איתי ו-Dan": the hyphen keeps "ו" readable before any name, Hebrew or English */
function joinNamesHe(names: readonly string[]): string {
  if (names.length < 2) return names.join('');
  return `${names.slice(0, -1).join(', ')} ו-${names[names.length - 1]}`;
}

/** Back from the payment page: cancelled, still being confirmed, or Pro is on. */
export const ProPaymentReturn: React.FC<ProPaymentReturnProps> = ({ theme, isCancelled, activatedNames, onDismiss }) => {
  const [isSlow, setIsSlow] = useState(false);
  const isWaiting = !isCancelled && activatedNames === null;

  useEffect(() => {
    if (!isWaiting) return undefined;
    const timer = window.setTimeout(() => setIsSlow(true), SLOW_CONFIRMATION_MS);
    return () => window.clearTimeout(timer);
  }, [isWaiting]);

  let text: string;
  if (isCancelled) text = 'התשלום בוטל ולא בוצע חיוב. אפשר לנסות שוב בכל זמן.';
  else if (activatedNames) text = `תודה! ${APP_NAME} Pro פעיל עכשיו עבור ${joinNamesHe(activatedNames)}. הקבלה תישלח למייל.`;
  else if (isSlow) text = 'התשלום עדיין בבדיקה. אם חויבתם, Pro ייפתח תוך כמה דקות, אין צורך לשלם שוב.';
  else text = 'מאשרים את התשלום…';

  return (
    <section role="status" className={`p-4 rounded-3xl space-y-2 ${theme.cardBgClass}`} data-testid="pro-payment-return">
      <p className="text-sm font-extrabold">
        {activatedNames && '🎉 '}
        {text}
      </p>
      {(!isWaiting || isSlow) && (
        <button type="button" onClick={onDismiss} className={`min-h-11 px-4 rounded-2xl text-sm font-extrabold ${theme.secondaryBtnClass}`}>
          סגירה
        </button>
      )}
    </section>
  );
};
