import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import { PARENTS_CHANGED_EVENT, ParentLink } from '../../data/parentLink';
import { formatShortDateHe } from '../../data/progressReport';
import { listParentsOfChild, unlinkParent } from '../../services/parentService';
import { ParentNotice, findParentNotices, markParentNoticeSeen, readSeenParents } from './parentNotices';

interface ParentNoticeCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
}

function describeNotice({ kind, link }: ParentNotice): string {
  const who = link.parentLabel ? `הורה (${link.parentLabel})` : 'הורה';
  if (kind === 'linked') return `${who} חובר לחשבון הזה ויכול לראות את הדוח השבועי.`;
  const when = link.pinResetAt ? ` ב-${formatShortDateHe(link.pinResetAt.slice(0, 10))}` : '';
  return `${who} החליף את הקוד הסודי של החשבון${when}. אם זה לא צפוי, אפשר לנתק אותו כאן ואז להחליף קוד בהגדרות.`;
}

/**
 * Tells the learner when a parent joined the account or reset its PIN, so a link made by mistake,
 * or by someone who is not a parent, is noticed. Each notice shows until it is closed on this device.
 */
export const ParentNoticeCard: React.FC<ParentNoticeCardProps> = ({ profile, theme }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const [notices, setNotices] = useState<ParentNotice[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!uid || !profile.isOnboarded) return undefined;
    let isCancelled = false;
    listParentsOfChild(uid)
      .then((links) => {
        if (!isCancelled) setNotices(findParentNotices(links, readSeenParents(uid)));
      })
      .catch(() => {
        // Offline or no access: no notice, and it shows at the next visit
      });
    return () => {
      isCancelled = true;
    };
  }, [uid, profile.isOnboarded]);

  if (!uid || notices.length === 0) return null;

  const drop = (link: ParentLink) => setNotices((current) => current.filter((n) => n.link.parentUid !== link.parentUid));

  const acknowledge = (link: ParentLink) => {
    markParentNoticeSeen(uid, link);
    drop(link);
  };

  const unlink = async (link: ParentLink) => {
    setIsBusy(true);
    const result = await unlinkParent(link);
    setIsBusy(false);
    if (!result.ok) return;
    window.dispatchEvent(new Event(PARENTS_CHANGED_EVENT));
    drop(link);
  };

  return (
    <section aria-label="עדכון על הורה מחובר" className="space-y-2">
      {notices.map((notice) => (
        <div
          key={notice.link.parentUid}
          role="status"
          className={`rounded-2xl px-3.5 py-3 space-y-2 ring-2 ${notice.kind === 'pin-reset' ? 'ring-amber-400/70' : 'ring-sky-300/60'} ${theme.cardBgClass}`}
        >
          <p className="flex items-start gap-2 text-sm font-bold">
            <ShieldAlert className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{describeNotice(notice)}</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => acknowledge(notice.link)}
              className={`min-h-11 px-4 rounded-2xl text-sm font-extrabold ${theme.primaryBtnClass}`}
            >
              הבנתי
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={() => void unlink(notice.link)}
              className="min-h-11 px-4 rounded-2xl text-sm font-extrabold border border-rose-500/50 text-rose-700 dark:text-rose-300"
            >
              ניתוק ההורה
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};
