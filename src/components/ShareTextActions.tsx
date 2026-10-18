import React, { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { ThemeDefinition } from '../themes/themeRegistry';

interface ShareTextActionsProps {
  /** The message sent through the share sheet or WhatsApp */
  text: string;
  shareTitle: string;
  shareLabel: string;
  /** What the copy button copies; defaults to the message */
  copyText?: string;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
  theme: ThemeDefinition;
}

type ShareStatus = 'idle' | 'copied' | 'copy-failed';

/**
 * Shares a text with the native share sheet, or a WhatsApp link where there is none,
 * plus a copy button. Used by the friend invite and the weekly progress report.
 */
export const ShareTextActions: React.FC<ShareTextActionsProps> = ({
  text,
  shareTitle,
  shareLabel,
  copyText,
  copyLabel,
  copiedLabel,
  copyFailedLabel,
  theme,
}) => {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const canNativeShare = typeof navigator.share === 'function';

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus('copied');
    } catch {
      setStatus('copy-failed');
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: shareTitle, text });
    } catch (error) {
      // Closing the share sheet is not an error; anything else falls back to copying
      if ((error as DOMException)?.name !== 'AbortError') copy(text);
    }
  };

  const buttonClass = 'px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5';

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {canNativeShare ? (
          <button type="button" onClick={share} className={`${buttonClass} ${theme.primaryBtnClass}`}>
            <Share2 className="w-4 h-4" />
            {shareLabel}
          </button>
        ) : (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass} ${theme.primaryBtnClass}`}
          >
            <Share2 className="w-4 h-4" />
            שליחה בוואטסאפ
          </a>
        )}
        <button
          type="button"
          onClick={() => copy(copyText ?? text)}
          className={`${buttonClass} ${theme.secondaryBtnClass}`}
        >
          <Copy className="w-4 h-4" />
          {copyLabel}
        </button>
      </div>
      <p className="text-xs font-bold min-h-[1rem]" aria-live="polite">
        {status === 'copied' && <span className="text-emerald-600 dark:text-emerald-300">{copiedLabel}</span>}
        {status === 'copy-failed' && <span className="text-rose-600 dark:text-rose-300">{copyFailedLabel}</span>}
      </p>
    </>
  );
};
