import React, { useState } from 'react';
import type { AccountResult } from '../../services/accountService';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface DeleteParentAccountProps {
  theme: ThemeDefinition;
  /** This parent pays for a monthly plan that will charge again: it must be cancelled first. Null: still checking */
  hasRenewingPlan: boolean | null;
  onDelete: () => Promise<AccountResult>;
}

const buttonClass = 'min-h-11 px-4 rounded-2xl text-sm font-extrabold';

/**
 * The parent deletes the parent account (privacy notice; legal audit PRIV-10). The children's
 * accounts stay; a renewing plan is cancelled first so no charge runs on after the account is gone.
 */
export const DeleteParentAccount: React.FC<DeleteParentAccountProps> = ({ theme, hasRenewingPlan, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await onDelete();
    // On success the portal signs out and this card goes away
    if (!result.ok) {
      setIsBusy(false);
      setErrorHe(result.errorHe);
    }
  };

  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)} className={`${buttonClass} w-full ${theme.mutedTextClass} underline`}>
        מחיקת חשבון ההורה
      </button>
    );
  }

  return (
    <section className={`p-4 rounded-3xl space-y-3 ${theme.cardBgClass}`} aria-labelledby="delete-parent-title">
      <h2 id="delete-parent-title" className="text-base font-extrabold">
        מחיקת חשבון ההורה
      </h2>
      <p className="text-sm">
        נמחקים החיבורים לילדים, הכניסה עם Google לפורטל וכל המידע של חשבון ההורה. החשבונות של הילדים וההתקדמות שלהם נשארים.
        רשומות תשלום נשמרות כפי שחוקי המס דורשים, עם מזהה החשבון בלבד. אי אפשר לבטל את המחיקה.
      </p>
      {hasRenewingPlan === null && <p role="status" className="text-sm">בודקים את המנויים…</p>}
      {hasRenewingPlan ? (
        <p role="alert" className="text-sm font-bold">
          יש מנוי חודשי שמתחדש. קודם צריך לבטל את החידוש (בכרטיס של הילד/ה למעלה), ואז אפשר למחוק את החשבון.
        </p>
      ) : (
        hasRenewingPlan === false && <p className={`text-sm ${theme.mutedTextClass}`}>לפני המחיקה Google יבקש לאשר שזה החשבון שלכם.</p>
      )}
      {errorHe && (
        <p role="alert" className="text-sm font-bold">
          {errorHe}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleDelete()}
          disabled={isBusy || hasRenewingPlan !== false}
          className={`${buttonClass} ${theme.primaryBtnClass} disabled:opacity-50`}
        >
          {isBusy ? 'מוחקים…' : 'מחיקה לצמיתות'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setErrorHe(null);
          }}
          disabled={isBusy}
          className={`${buttonClass} ${theme.secondaryBtnClass}`}
        >
          ביטול
        </button>
      </div>
    </section>
  );
};
