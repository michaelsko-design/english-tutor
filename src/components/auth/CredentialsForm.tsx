import React, { useId, useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { MIN_PIN_LENGTH } from '../../utils/username';
import { Button } from '../ui/Button';
import type { CredentialMode } from './credentialValidation';

interface CredentialsFormProps {
  mode: CredentialMode;
  theme: ThemeDefinition;
  isBusy: boolean;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  /** A new account only: offers another username made from the learner's name */
  onSuggestUsername?: () => void;
  onBack: () => void;
}

/** The two-field username + password form, for a new account or an existing one. */
export function CredentialsForm({
  mode,
  theme,
  isBusy,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onSuggestUsername,
  onBack,
}: CredentialsFormProps) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const usernameId = useId();
  const passwordId = useId();
  const isNew = mode === 'new';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 rounded-2xl space-y-3 ${theme.cardBgClass}`}>
      <h3 className="text-sm font-extrabold">{isNew ? '🆕 בוחרים שם משתמש וסיסמה' : '🔑 כניסה עם שם משתמש'}</h3>

      <div>
        <label htmlFor={usernameId} className="block text-xs font-bold mb-1">
          {isNew ? 'בחר שם משתמש (אותיות באנגלית בלבד ומספרים)' : 'שם משתמש'}
        </label>
        <input
          id={usernameId}
          type="text"
          dir="ltr"
          lang="en"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="noa12"
          className={`w-full px-3.5 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`}
        />
        {onSuggestUsername && (
          <button
            type="button"
            onClick={onSuggestUsername}
            className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold underline opacity-80 hover:opacity-100"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            שם אחר
          </button>
        )}
      </div>

      <div>
        <label htmlFor={passwordId} className="block text-xs font-bold mb-1">
          {isNew ? `בחר קוד סודי (${MIN_PIN_LENGTH} תווים לפחות)` : 'קוד סודי'}
        </label>
        <div className="relative">
          <input
            id={passwordId}
            type={isPasswordShown ? 'text' : 'password'}
            dir="ltr"
            lang="en"
            autoComplete={isNew ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={`w-full ps-3.5 pe-12 py-2.5 rounded-xl text-base font-bold outline-none ${theme.inputBgClass}`}
          />
          <button
            type="button"
            onClick={() => setIsPasswordShown((shown) => !shown)}
            aria-label={isPasswordShown ? 'הסתרת הסיסמה' : 'הצגת הסיסמה'}
            aria-pressed={isPasswordShown}
            className="absolute inset-y-0 right-0 w-11 flex items-center justify-center opacity-70 hover:opacity-100"
          >
            {isPasswordShown ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isNew && <p className="text-xs font-bold">💡 כדאי לרשום את שם המשתמש והסיסמה במקום שמור</p>}

      <Button theme={theme} size="lg" className="w-full" type="submit" disabled={isBusy}>
        {isNew ? 'יצירת חשבון 🚀' : 'כניסה'}
      </Button>

      {!isNew && (
        <p className={`text-xs ${theme.mutedTextClass}`}>
          שכחת את הסיסמה? הורה שמחובר לחשבון יכול לאפס אותה באזור ההורים.
        </p>
      )}

      <button type="button" onClick={onBack} className="text-xs font-bold underline opacity-80 hover:opacity-100">
        חזרה
      </button>
    </form>
  );
}
