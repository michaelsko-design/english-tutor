import React, { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import { buildInviteMessageHe, buildInviteUrl } from '../../data/friends';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface MyFriendCodePanelProps {
  friendCode: string | undefined;
  displayName: string;
  gender: LearnerGender;
  theme: ThemeDefinition;
}

type ShareStatus = 'idle' | 'copied' | 'copy-failed';

/** Feature 19: the learner's friend code, with an invite link for WhatsApp or any messaging app. */
export const MyFriendCodePanel: React.FC<MyFriendCodePanelProps> = ({ friendCode, displayName, gender, theme }) => {
  const isGirl = gender === 'girl';
  const [status, setStatus] = useState<ShareStatus>('idle');

  if (!friendCode) {
    return (
      <section className={`rounded-2xl p-3 sm:p-4 ${theme.cardBgClass}`} aria-label="קוד החבר שלי">
        <p className={`text-xs ${theme.mutedTextClass}`}>מכינים לך קוד חבר... (צריך חיבור לאינטרנט)</p>
      </section>
    );
  }

  const inviteUrl = buildInviteUrl(window.location.origin, friendCode);
  const message = buildInviteMessageHe(displayName, gender, friendCode, inviteUrl);
  const canNativeShare = typeof navigator.share === 'function';

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('copy-failed');
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: 'הזמנה לחברות', text: message });
    } catch (error) {
      // Closing the share sheet is not an error; anything else falls back to copying
      if ((error as DOMException)?.name !== 'AbortError') copy(message);
    }
  };

  return (
    <section className={`rounded-2xl p-3 sm:p-4 space-y-3 ${theme.cardBgClass}`} aria-label="קוד החבר שלי">
      <h3 className="font-extrabold text-sm sm:text-base">🎟️ קוד החבר שלי</h3>
      <p
        className={`text-center text-2xl sm:text-3xl font-black tracking-[0.3em] py-2 rounded-xl ${theme.inputBgClass}`}
        dir="ltr"
        aria-label={`קוד החבר: ${friendCode.split('').join(' ')}`}
      >
        {friendCode}
      </p>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        {isGirl ? 'שלחי' : 'שלח'} את הקוד או את קישור ההזמנה לחברים שכבר לומדים באפליקציה. חברות נוצרת רק אחרי ששני הצדדים מאשרים.
      </p>
      <div className="flex flex-wrap gap-2">
        {canNativeShare ? (
          <button
            type="button"
            onClick={share}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 ${theme.primaryBtnClass}`}
          >
            <Share2 className="w-4 h-4" />
            שיתוף הזמנה
          </button>
        ) : (
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 ${theme.primaryBtnClass}`}
          >
            <Share2 className="w-4 h-4" />
            שליחה בוואטסאפ
          </a>
        )}
        <button
          type="button"
          onClick={() => copy(inviteUrl)}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-sm flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <Copy className="w-4 h-4" />
          העתקת קישור
        </button>
      </div>
      <p className="text-xs font-bold min-h-[1rem]" aria-live="polite">
        {status === 'copied' && <span className="text-emerald-600 dark:text-emerald-300">הקישור הועתק ✓</span>}
        {status === 'copy-failed' && (
          <span className="text-rose-600 dark:text-rose-300">לא הצלחנו להעתיק. אפשר להעתיק את הקוד ידנית.</span>
        )}
      </p>
    </section>
  );
};
