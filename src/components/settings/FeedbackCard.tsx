import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { MAX_FEEDBACK_LENGTH, sendFeedback, type FeedbackKind } from '../../services/feedbackService';

interface FeedbackCardProps {
  gradeId: string;
  theme: ThemeDefinition;
}

const KINDS: Array<{ kind: FeedbackKind; label: string }> = [
  { kind: 'problem', label: 'משהו לא עובד' },
  { kind: 'idea', label: 'רעיון' },
];

/** Settings: a short note to the team (closed testing). The text is stored with the grade and app version only. */
export const FeedbackCard: React.FC<FeedbackCardProps> = ({ gradeId, theme }) => {
  const [kind, setKind] = useState<FeedbackKind>('problem');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setStatus('sending');
    setError(null);
    const result = await sendFeedback({ kind, text, gradeId, screen: 'settings' });
    if (result.ok) {
      setText('');
      setStatus('sent');
      return;
    }
    setError(result.errorHe);
    setStatus('idle');
  };

  return (
    <div className="space-y-1.5">
      <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
        <MessageSquarePlus className="w-4 h-4" aria-hidden="true" />
        יש משהו לספר לנו?
      </span>
      <div className="flex gap-2" role="radiogroup" aria-label="סוג ההודעה">
        {KINDS.map((option) => (
          <button
            key={option.kind}
            type="button"
            role="radio"
            aria-checked={kind === option.kind}
            onClick={() => setKind(option.kind)}
            className={`min-h-11 flex-1 rounded-2xl p-2 text-xs sm:text-sm font-extrabold ${theme.secondaryBtnClass} ${kind === option.kind ? 'ring-2 ring-current' : ''}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value.slice(0, MAX_FEEDBACK_LENGTH));
          setStatus('idle');
        }}
        rows={3}
        aria-label="ההודעה שלכם"
        className="w-full rounded-2xl border border-current/20 bg-transparent p-2.5 text-sm"
      />
      <p className={`text-xs ${theme.mutedTextClass}`}>כדאי לא לכתוב שם מלא, טלפון או כתובת. ההודעה מגיעה אלינו עם הכיתה וגרסת האפליקציה בלבד.</p>
      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={status === 'sending' || text.trim() === ''}
        className={`min-h-11 w-full rounded-2xl p-2.5 text-xs sm:text-sm font-extrabold disabled:opacity-50 ${theme.secondaryBtnClass}`}
      >
        {status === 'sending' ? 'שולחים…' : 'שליחה'}
      </button>
      <p role="status" className="text-xs font-bold">
        {status === 'sent' ? 'תודה! קיבלנו.' : error}
      </p>
    </div>
  );
};
