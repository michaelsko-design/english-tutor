import React, { useEffect, useState } from 'react';
import { APP_NAME } from '../../config/appInfo';
import { MAX_PRO_SEATS, quoteProPrice, type BillingPeriod } from '../../config/proTier';
import type { ParentLink } from '../../data/parentLink';
import { startProCheckout } from '../../services/proBillingService';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { formatShekels } from './ProPlanPicker';

interface ProCheckoutPanelProps {
  theme: ThemeDefinition;
  period: BillingPeriod;
  /** The children who can get Pro now (no live plan, or the parent's own plan up for renewal) */
  eligibleChildren: readonly ParentLink[];
  /** Ticked when the panel opens */
  initialChildUids: readonly string[];
  /** Prefills the e-mail for the receipt */
  parentEmail: string | null;
  onBack: () => void;
  /** Opens the payment page (a full page change) */
  onNavigate?: (url: string) => void;
}

/** First and last name, letters only (the gateway refuses other characters) */
const PAYER_NAME_PATTERN = /^\p{L}+(?:['-]\p{L}+)*(?: \p{L}+(?:['-]\p{L}+)*)+$/u;
const PAYER_PHONE_PATTERN = /^05\d{8}$/;

const fieldClass = 'mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none';
const buttonClass = 'min-h-11 px-4 rounded-2xl text-sm font-extrabold';

const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ');
const normalizePhone = (value: string) => value.replace(/[\s-]/g, '');

/**
 * The step after the plan picker: which children get Pro, the payer's details for the gateway and
 * the receipt, and "continue to payment", which opens the gateway's own payment page.
 */
export const ProCheckoutPanel: React.FC<ProCheckoutPanelProps> = ({
  theme,
  period,
  eligibleChildren,
  initialChildUids,
  parentEmail,
  onBack,
  onNavigate = (url) => window.location.assign(url),
}) => {
  const [selected, setSelected] = useState<string[]>(() =>
    initialChildUids.filter((uid) => eligibleChildren.some((c) => c.childUid === uid)).slice(0, MAX_PRO_SEATS)
  );
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState(parentEmail ?? '');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);
  const quote = quoteProPrice(selected.length, period);

  // Back from the payment page, the browser may restore this page as it was: busy
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsBusy(false);
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const toggle = (uid: string) => {
    setErrorHe(null);
    setSelected((prev) => (prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!quote) {
      setErrorHe(`אפשר לבחור בין ילד אחד ל-${MAX_PRO_SEATS} ילדים.`);
      return;
    }
    if (!PAYER_NAME_PATTERN.test(normalizeName(payerName))) {
      setErrorHe('כדאי לכתוב שם פרטי ושם משפחה, באותיות בלבד.');
      return;
    }
    if (!PAYER_PHONE_PATTERN.test(normalizePhone(payerPhone))) {
      setErrorHe('כדאי לכתוב מספר נייד ישראלי, למשל 0501234567.');
      return;
    }
    setIsBusy(true);
    setErrorHe(null);
    const result = await startProCheckout({
      childUids: selected,
      period,
      payerName: normalizeName(payerName),
      payerPhone: normalizePhone(payerPhone),
      payerEmail: payerEmail.trim(),
    });
    if (result.ok) {
      onNavigate(result.value);
      return;
    }
    setIsBusy(false);
    setErrorHe(result.errorHe);
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className={`p-4 rounded-3xl space-y-4 ${theme.cardBgClass}`} aria-labelledby="pro-checkout-title">
      <h2 id="pro-checkout-title" className="text-base font-extrabold">
        תשלום על <bdi dir="ltr" lang="en">{APP_NAME} Pro</bdi>
      </h2>

      <fieldset className="space-y-2">
        <legend className="text-sm font-extrabold">למי המנוי?</legend>
        {eligibleChildren.length === 0 && (
          <p className={`text-sm font-bold ${theme.mutedTextClass}`}>לכל הילדים המחוברים כבר יש Pro.</p>
        )}
        {eligibleChildren.map((child) => (
          <label key={child.childUid} className={`flex items-center gap-2 p-2.5 rounded-2xl text-sm font-bold ${theme.inputBgClass}`}>
            <input
              type="checkbox"
              checked={selected.includes(child.childUid)}
              onChange={() => toggle(child.childUid)}
              className="w-5 h-5 shrink-0"
            />
            <span aria-hidden="true">{child.childAvatar}</span>
            {child.childName}
          </label>
        ))}
      </fieldset>

      <p className="text-center text-lg font-black" aria-live="polite" data-testid="pro-checkout-total">
        {quote ? `${formatShekels(quote.chargeAgorot)} ${period === 'yearly' ? 'לשנה' : 'לחודש'}` : 'בחרו לפחות ילד אחד'}
      </p>

      <label className="block text-sm font-bold">
        שם מלא של המשלם/ת
        <input type="text" autoComplete="name" value={payerName} onChange={(e) => setPayerName(e.target.value)} className={`${fieldClass} ${theme.inputBgClass}`} />
      </label>
      <label className="block text-sm font-bold">
        טלפון נייד
        <input
          type="tel"
          inputMode="tel"
          dir="ltr"
          autoComplete="tel-national"
          value={payerPhone}
          onChange={(e) => setPayerPhone(e.target.value)}
          className={`${fieldClass} ${theme.inputBgClass}`}
        />
      </label>
      <label className="block text-sm font-bold">
        אימייל לקבלה (לא חובה)
        <input
          type="email"
          dir="ltr"
          autoComplete="email"
          value={payerEmail}
          onChange={(e) => setPayerEmail(e.target.value)}
          className={`${fieldClass} ${theme.inputBgClass}`}
        />
      </label>

      {errorHe && (
        <p role="alert" className="text-sm font-extrabold text-rose-700 dark:text-rose-300">
          {errorHe}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={isBusy || !quote} className={`${buttonClass} flex-1 ${theme.primaryBtnClass} disabled:opacity-50`}>
          {isBusy ? 'פותחים את דף התשלום…' : 'המשך לתשלום'}
        </button>
        <button type="button" onClick={onBack} disabled={isBusy} className={`${buttonClass} ${theme.secondaryBtnClass}`}>
          חזרה
        </button>
      </div>

      <p className={`text-xs font-bold text-center ${theme.mutedTextClass}`}>
        {period === 'monthly' ? 'חיוב חודשי, אפשר לבטל בכל עת.' : 'תשלום אחד לשנה, בלי חידוש אוטומטי.'} התשלום בדף המאובטח של חברת הסליקה.
      </p>
    </form>
  );
};
