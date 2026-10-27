import React, { useCallback, useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { auth } from '../../services/firebase';
import {
  PARENTS_CHANGED_EVENT,
  ParentInvite,
  ParentLink,
  buildParentMessageHe,
  buildParentUrl,
} from '../../data/parentLink';
import {
  createParentInvite,
  getActiveParentInvite,
  listParentsOfChild,
  unlinkParent,
  withdrawParentInvite,
} from '../../services/parentService';
import { formatShortDateHe } from '../../data/progressReport';
import { ShareTextActions } from '../ShareTextActions';

interface ParentLinkCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
}

interface ActiveInvite {
  code: string;
  invite: ParentInvite;
}

const buttonClass = 'w-full min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5';

function toDateStr(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Settings: the optional link to a parent. The learner makes a one-time code (or link) for a parent,
 * who opens it with their own Google account and then sees the weekly report. The app works the
 * same with no parent.
 */
export const ParentLinkCard: React.FC<ParentLinkCardProps> = ({ profile, theme }) => {
  const user = auth?.currentUser ?? null;
  const uid = user && !user.isAnonymous ? user.uid : null;
  const [active, setActive] = useState<ActiveInvite | null>(null);
  const [parents, setParents] = useState<ParentLink[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!uid) return;
    try {
      const [invite, links] = await Promise.all([getActiveParentInvite(uid), listParentsOfChild(uid)]);
      setActive(invite);
      setParents(links);
      window.dispatchEvent(new Event(PARENTS_CHANGED_EVENT));
    } catch {
      setErrorHe('לא הצלחנו לטעון את פרטי ההורים. כדאי לנסות שוב.');
    } finally {
      setIsLoaded(true);
    }
  }, [uid]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!uid) return null;

  const handleCreate = async () => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await createParentInvite(uid, profile.name, profile.equippedAvatarEmoji || theme.avatarEmoji);
    setIsBusy(false);
    if (result.ok) setActive(result.value);
    else setErrorHe(result.errorHe);
  };

  const handleWithdraw = async () => {
    setIsBusy(true);
    await withdrawParentInvite(uid);
    setActive(null);
    setIsBusy(false);
  };

  const handleUnlink = async (link: ParentLink) => {
    setIsBusy(true);
    setErrorHe(null);
    const result = await unlinkParent(link);
    if (result.ok) await refresh();
    else setErrorHe(result.errorHe);
    setIsBusy(false);
  };

  const url = active ? buildParentUrl(window.location.origin, active.code) : '';

  return (
    <div className="space-y-2" aria-label="הורים">
      <p className={`text-xs sm:text-sm font-bold ${theme.mutedTextClass}`}>
        לא חובה. הורה שמצטרף עם חשבון Google משלו רואה דוח שבועי של ההתקדמות, בלי לראות את שאר החשבון. האפליקציה עובדת
        אותו דבר גם בלי הורה מחובר.
      </p>

      {parents.map((link, index) => (
        <div key={link.parentUid} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
          <span className="text-xs sm:text-sm font-bold">
            הורה מחובר/ת {parents.length > 1 ? index + 1 : ''}
            {link.parentLabel && (
              <>
                {' '}
                (<bdi dir="ltr" lang="en">{link.parentLabel}</bdi>)
              </>
            )}{' '}
            · מאז {formatShortDateHe(link.linkedAt.slice(0, 10))}
          </span>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleUnlink(link)}
            className="min-h-11 px-3 rounded-xl text-xs font-extrabold border border-rose-500/50 text-rose-700 dark:text-rose-300"
          >
            ניתוק
          </button>
        </div>
      ))}

      {active ? (
        <div className="p-3.5 rounded-2xl border border-current/15 space-y-2.5">
          <p className="text-xs font-bold">קוד ההורים (תקף עד {formatShortDateHe(toDateStr(active.invite.expiresAtMs))}):</p>
          <p className="text-2xl font-black tracking-widest text-center" dir="ltr" lang="en">
            {active.code}
          </p>
          <ShareTextActions
            text={buildParentMessageHe(profile.name, profile.gender, active.code, url)}
            shareTitle="הצטרפות הורה"
            shareLabel="שליחה להורה"
            copyText={url}
            copyLabel="העתקת קישור"
            copiedLabel="הקישור הועתק ✓"
            copyFailedLabel="לא הצלחנו להעתיק. אפשר להעתיק את הקוד ידנית."
            theme={theme}
          />
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void handleWithdraw()}
            className={`${buttonClass} ${theme.secondaryBtnClass}`}
          >
            ביטול הקוד
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isBusy || !isLoaded}
          onClick={() => void handleCreate()}
          className={`${buttonClass} ${theme.secondaryBtnClass}`}
        >
          <Users className="w-4 h-4" aria-hidden="true" />
          {parents.length > 0 ? 'קוד להורה נוסף' : 'יצירת קוד להורה'}
        </button>
      )}

      {errorHe && (
        <p role="alert" className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
          {errorHe}
        </p>
      )}
    </div>
  );
};
