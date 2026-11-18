import React, { useEffect, useState } from 'react';
import { APP_NAME, LANDING_PAGE_PATH, PRIVACY_PAGE_PATH, TERMS_PAGE_PATH } from '../../config/appInfo';
import { MAX_PRO_SEATS, quoteProPrice, type BillingPeriod } from '../../config/proTier';
import type { ParentLink } from '../../data/parentLink';
import { buildExamHeadlineHe, pickExamLead, type ExamPitch } from '../../data/examPitch';
import { toLocalDateStr } from '../../utils/dates';
import { startProCheckout } from '../../services/proBillingService';
import { trackFunnel } from '../../services/analytics/funnel';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { formatShekels, PaymentMethodsNote } from './ProPlanPicker';

interface ProCheckoutPanelProps {
  theme: ThemeDefinition;
  period: BillingPeriod;
  /** The children who can get Pro now (no live plan, or the parent's own plan up for renewal) */
  eligibleChildren: readonly ParentLink[];
  /** Ticked when the panel opens */
  initialChildUids: readonly string[];
  /** Prefills the e-mail for the receipt */
  parentEmail: string | null;
  /** The Google account's name; prefills the payer's name when it is a full name */
  parentName?: string | null;
  /** Each child's coming exam or school lists (from the report snapshot); the headline leads with it */
  examByChild?: Readonly<Record<string, ExamPitch | null>>;
  onBack: () => void;
  /** Opens the payment page (a full page change) */
  onNavigate?: (url: string) => void;
}

/** First and last name, letters only (the gateway refuses other characters) */
const PAYER_NAME_PATTERN = /^\p{L}+(?:['-]\p{L}+)*(?: \p{L}+(?:['-]\p{L}+)*)+$/u;
const PAYER_PHONE_PATTERN = /^05\d{8}$/;

const fieldClass = 'mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none';
const buttonClass = 'min-h-11 px-4 rounded-2xl text-sm font-extrabold';

const RENEWAL_LINE_HE: Record<BillingPeriod, string> = {
  monthly: 'מתחדש כל חודש עד שמבטלים. אפשר לבטל בכל עת כאן בפורטל.',
  yearly: 'תשלום אחד לשנה. לא מתחדש מעצמו.',
};

/** Grow's terms (§13.1.5.11) allow retrying a failed recurring charge only with the payer's consent in advance */
const RETRY_CONSENT_HE = ' אם חיוב חודשי ייכשל, אני מסכים/ה שחברת התשלומים תנסה לחייב את הכרטיס שוב במשך עד 10 ימים.';

const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ');
const normalizePhone = (value: string) => value.replace(/[\s-]/g, '');

/** The Google name, when it would pass the name check; otherwise the parent types it */
const initialPayerName = (parentName: string | null | undefined): string => {
  const name = normalizeName(parentName ?? '');
  return PAYER_NAME_PATTERN.test(name) ? name : '';
};

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
  parentName,
  examByChild,
  onBack,
  onNavigate = (url) => window.location.assign(url),
}) => {
  const [selected, setSelected] = useState<string[]>(() =>
    initialChildUids.filter((uid) => eligibleChildren.some((c) => c.childUid === uid)).slice(0, MAX_PRO_SEATS)
  );
  const [payerName, setPayerName] = useState(() => initialPayerName(parentName));
  const [payerPhone, setPayerPhone] = useState('');
  const [payerEmail, setPayerEmail] = useState(parentEmail ?? '');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);
  const quote = quoteProPrice(selected.length, period);
  // Parents pay for a date: the soonest exam (or school lists) of the ticked children leads
  const examLead = pickExamLead(
    eligibleChildren
      .filter((child) => selected.includes(child.childUid))
      .map((child) => ({ name: child.childName, pitch: examByChild?.[child.childUid] ?? null }))
  );

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
    trackFunnel('pro_checkout_submit');
    setIsBusy(true);
    setErrorHe(null);
    const result = await startProCheckout({
      childUids: selected,
      period,
      payerName: normalizeName(payerName),
      payerPhone: normalizePhone(payerPhone),
      payerEmail: payerEmail.trim(),
      acceptedTerms: true,
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
      {examLead && (
        <p className="p-3 rounded-2xl bg-amber-400/15 text-sm font-extrabold">
          📅 {buildExamHeadlineHe(examLead.name, examLead.pitch, toLocalDateStr(new Date()))}
          {examLead.pitch.examDateStr ? ': תוכנית הכנה מלאה, עם סימולציה ותעודה.' : ', ועוד רשימות מילים.'}
        </p>
      )}

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
      <p className={`-mt-3 text-xs font-bold text-center ${theme.mutedTextClass}`}>{RENEWAL_LINE_HE[period]}</p>

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

      <label className={`flex items-start gap-2 p-2.5 rounded-2xl text-xs font-bold leading-relaxed ${theme.inputBgClass}`}>
        <input
          type="checkbox"
          checked={hasAcceptedTerms}
          onChange={(e) => setHasAcceptedTerms(e.target.checked)}
          className="w-5 h-5 shrink-0 mt-0.5"
        />
        <span>
          קראתי ואני מסכים/ה ל
          <a href={TERMS_PAGE_PATH} target="_blank" rel="noopener" className="underline">
            תנאי השימוש והמנוי
          </a>
          {' '}ול
          <a href={PRIVACY_PAGE_PATH} target="_blank" rel="noopener" className="underline">
            מדיניות הפרטיות
          </a>
          , ואני מעל גיל 18.
          {period === 'monthly' && RETRY_CONSENT_HE}
        </span>
      </label>

      {errorHe && (
        <p role="alert" className="text-sm font-extrabold text-rose-700 dark:text-rose-300">
          {errorHe}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={isBusy || !quote || !hasAcceptedTerms} className={`${buttonClass} flex-1 ${theme.primaryBtnClass} disabled:opacity-50`}>
          {isBusy ? 'פותחים את דף התשלום…' : 'המשך לתשלום'}
        </button>
        <button type="button" onClick={onBack} disabled={isBusy} className={`${buttonClass} ${theme.secondaryBtnClass}`}>
          חזרה
        </button>
      </div>

      <PaymentMethodsNote period={period} className={`text-center ${theme.mutedTextClass}`} />
      <p className={`text-xs font-bold text-center ${theme.mutedTextClass}`}>התשלום בדף המאובטח של חברת הסליקה.</p>
      <p className={`text-xs text-center ${theme.mutedTextClass}`}>
        <a href={`${LANDING_PAGE_PATH}#pricing`} target="_blank" rel="noopener" className="underline">
          כל המחירים, שאלות נפוצות ופרטי התקשרות
        </a>
      </p>
    </form>
  );
};
