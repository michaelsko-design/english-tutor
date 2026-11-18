import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { dismissAskResend, getUnansweredAsk, hasAskedToday, type ProAskFocus } from '../../data/proAsk';
import { toLocalDateStr } from '../../utils/dates';
import { Button } from '../ui/Button';

interface ProAskReminderCardProps {
  uid: string;
  theme: ThemeDefinition;
  /** Pro is already on (or the app is not gated), so there is nothing to ask for */
  hasPro: boolean;
  /** Opens the ask sheet again, with the same focus as the first ask */
  onResend: (focus: ProAskFocus) => void;
}

/**
 * A parent did not answer a Pro ask: 48 hours later, a one-tap way to send it again (a new link, since
 * the old pairing code has expired). At most two resends per ask, never on a day an ask was already
 * sent, and closable. Per device, like the ask itself.
 */
export const ProAskReminderCard: React.FC<ProAskReminderCardProps> = ({ uid, theme, hasPro, onResend }) => {
  const [isClosed, setIsClosed] = useState(false);
  const nowMs = Date.now();
  const ask = getUnansweredAsk(uid, nowMs, hasPro);
  if (isClosed || !ask || hasAskedToday(uid, toLocalDateStr(new Date(nowMs)))) return null;

  const close = () => {
    dismissAskResend(uid, nowMs);
    setIsClosed(true);
  };

  return (
    <section
      aria-label="לשלוח שוב להורים"
      className={`relative rounded-2xl px-3.5 py-3 flex items-center gap-3 ring-2 ring-amber-300/60 ${theme.cardBgClass}`}
    >
      <MessageCircle className="w-7 h-7 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0 space-y-0.5">
        <h2 className="font-extrabold text-sm">ההורים עוד לא ראו את הבקשה?</h2>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>אפשר לשלוח להם שוב, עם קישור חדש.</p>
      </div>
      <Button
        theme={theme}
        size="sm"
        className="shrink-0"
        onClick={() => {
          setIsClosed(true);
          onResend(ask.focus);
        }}
      >
        לשלוח שוב
      </Button>
      <button
        type="button"
        onClick={close}
        aria-label="סגירה"
        className="min-w-11 min-h-11 -my-2 -ml-2 inline-flex items-center justify-center rounded-xl shrink-0 hover:bg-black/5 dark:hover:bg-white/10"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </section>
  );
};
