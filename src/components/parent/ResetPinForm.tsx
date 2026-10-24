import React, { useState } from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { resetChildPin } from '../../services/parentService';
import { MIN_PIN_LENGTH } from '../../utils/username';

interface ResetPinFormProps {
  childUid: string;
  childName: string;
  theme: ThemeDefinition;
  onDone: (message: string) => void;
  onCancel: () => void;
}

/** A parent types a new sign-in PIN for a paired learner who forgot theirs. */
export const ResetPinForm: React.FC<ResetPinFormProps> = ({ childUid, childName, theme, onDone, onCancel }) => {
  const [pin, setPin] = useState('');
  const [again, setAgain] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  const mismatch = again.length > 0 && pin !== again;
  const canSave = pin.trim().length >= MIN_PIN_LENGTH && pin === again && !isBusy;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSave) return;
    setIsBusy(true);
    setErrorHe(null);
    const result = await resetChildPin(childUid, pin);
    setIsBusy(false);
    if (result.ok) onDone(`הקוד הסודי של ${childName} הוחלף. אפשר להיכנס איתו עכשיו.`);
    else setErrorHe(result.errorHe);
  };

  const inputClass = `mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`;

  return (
    <form onSubmit={handleSubmit} className="p-3 rounded-2xl border border-current/15 space-y-2.5">
      <p className="text-xs font-bold">קוד סודי חדש ל{childName} (לפחות 6 תווים). אחרי ההחלפה הקוד הקודם לא יעבוד.</p>
      <label className="block text-xs font-bold">
        הקוד החדש:
        <input type="password" dir="ltr" lang="en" autoComplete="new-password" value={pin} onChange={(e) => setPin(e.target.value)} className={inputClass} />
      </label>
      <label className="block text-xs font-bold">
        שוב, לאישור:
        <input type="password" dir="ltr" lang="en" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} className={inputClass} />
      </label>
      {mismatch && <p className="text-xs font-extrabold text-rose-700 dark:text-rose-300">שני הקודים לא זהים.</p>}
      {errorHe && (
        <p role="alert" className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
          {errorHe}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!canSave}
          className={`flex-1 min-h-11 rounded-2xl text-sm font-extrabold disabled:opacity-50 ${theme.primaryBtnClass}`}
        >
          {isBusy ? 'מחליפים…' : 'החלפת הקוד'}
        </button>
        <button type="button" onClick={onCancel} className={`min-h-11 px-4 rounded-2xl text-sm font-extrabold ${theme.secondaryBtnClass}`}>
          ביטול
        </button>
      </div>
    </form>
  );
};
