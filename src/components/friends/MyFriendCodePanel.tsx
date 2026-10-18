import React from 'react';
import { buildInviteMessageHe, buildInviteUrl } from '../../data/friends';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ShareTextActions } from '../ShareTextActions';

interface MyFriendCodePanelProps {
  friendCode: string | undefined;
  displayName: string;
  gender: LearnerGender;
  theme: ThemeDefinition;
}

/** Feature 19: the learner's friend code, with an invite link for WhatsApp or any messaging app. */
export const MyFriendCodePanel: React.FC<MyFriendCodePanelProps> = ({ friendCode, displayName, gender, theme }) => {
  const isGirl = gender === 'girl';

  if (!friendCode) {
    return (
      <section className={`rounded-2xl p-3 sm:p-4 ${theme.cardBgClass}`} aria-label="קוד החבר שלי">
        <p className={`text-xs ${theme.mutedTextClass}`}>מכינים לך קוד חבר... (צריך חיבור לאינטרנט)</p>
      </section>
    );
  }

  const inviteUrl = buildInviteUrl(window.location.origin, friendCode);
  const message = buildInviteMessageHe(displayName, gender, friendCode, inviteUrl);

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
      <ShareTextActions
        text={message}
        shareTitle="הזמנה לחברות"
        shareLabel="שיתוף הזמנה"
        copyText={inviteUrl}
        copyLabel="העתקת קישור"
        copiedLabel="הקישור הועתק ✓"
        copyFailedLabel="לא הצלחנו להעתיק. אפשר להעתיק את הקוד ידנית."
        theme={theme}
      />
    </section>
  );
};
