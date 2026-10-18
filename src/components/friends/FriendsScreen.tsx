import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  FriendLink,
  FriendLookupEntry,
  MAX_FRIENDS,
  checkFriendRequest,
  toDisplayName,
} from '../../data/friends';
import { FriendsHubData } from '../../hooks/useFriendsHub';
import {
  FriendIdentity,
  ServiceResult,
  acceptFriendRequest,
  deleteFriendship,
  sendFriendRequest,
  sendReaction,
} from '../../services/friendsService';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { AddFriendPanel } from './AddFriendPanel';
import { FriendCard } from './FriendCard';
import { MyFriendCodePanel } from './MyFriendCodePanel';

interface FriendsScreenProps {
  profile: LearnerProfile;
  me: FriendIdentity;
  hub: FriendsHubData;
  theme: ThemeDefinition;
  initialInviteCode?: string;
  /** The latest failed contest action, shown with the other notices */
  contestErrorHe?: string | null;
  /** Extra content under each friend's stats (Phase 2: the daily contest) */
  renderFriendExtras?: (friend: FriendLink) => React.ReactNode;
  onClose: () => void;
}

type Notice = { tone: 'ok' | 'error'; textHe: string } | null;

/** Feature 19: the Friends Hub overlay: requests, friends, adding a friend and the invite code. */
export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  profile,
  me,
  hub,
  theme,
  initialInviteCode,
  contestErrorHe,
  renderFriendExtras,
  onClose,
}) => {
  const isGirl = profile.gender === 'girl';
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const { accepted, incoming, outgoing } = hub.friendships;
  const nowFriendsHe = (name: string) => `${isGirl ? 'את' : 'אתה'} ו${name} חברים עכשיו! 🎉`;

  const run = async (id: string, action: () => Promise<ServiceResult<void>>, okHe?: string) => {
    setBusyId(id);
    const result = await action();
    setBusyId(null);
    if (!result.ok) setNotice({ tone: 'error', textHe: result.errorHe });
    else if (okHe) setNotice({ tone: 'ok', textHe: okHe });
  };

  const handleSend = (target: FriendLookupEntry) => {
    const check = checkFriendRequest(hub.friendships, me.uid, target.uid);
    const name = toDisplayName(target.displayName);
    switch (check.kind) {
      case 'self':
        return setNotice({ tone: 'error', textHe: 'זה הקוד שלך 😊 צריך את הקוד של חבר או חברה.' });
      case 'already-friends':
        return setNotice({ tone: 'ok', textHe: `${name} כבר ברשימת החברים שלך.` });
      case 'already-sent':
        return setNotice({ tone: 'ok', textHe: `כבר שלחת בקשה ל${name}. מחכים לאישור.` });
      case 'too-many-friends':
        return setNotice({ tone: 'error', textHe: `אפשר עד ${MAX_FRIENDS} חברים.` });
      case 'too-many-requests':
        return setNotice({ tone: 'error', textHe: 'יש יותר מדי בקשות שמחכות לאישור. כדאי לחכות שיאשרו.' });
      case 'accept-incoming':
        return run(check.friendshipId, () => acceptFriendRequest(check.friendshipId), nowFriendsHe(name));
      case 'ok':
        return run(target.uid, () => sendFriendRequest(me, target), `הבקשה נשלחה ל${name}. החברות תתחיל אחרי שיאשרו.`);
    }
  };

  return (
    <ExamModalShell
      theme={theme}
      labelHe="מרכז החברים"
      onClose={onClose}
      maxWidthClass="max-w-2xl"
      header={<h2 className="font-extrabold text-base sm:text-lg">👫 מרכז החברים</h2>}
    >
      <div className="p-3 sm:p-5 space-y-4">
        <p className={`text-xs ${theme.mutedTextClass}`}>
          🛡️ חברים רואים רק את השם, הדמות וההתקדמות שלך. אין כאן צ׳אט, רק עידודים מוכנים מראש.
        </p>

        {notice && (
          <p
            role="status"
            className={`rounded-xl px-3 py-2 text-xs font-bold ${
              notice.tone === 'ok'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
            }`}
          >
            {notice.textHe}
          </p>
        )}
        {contestErrorHe && (
          <p role="alert" className="rounded-xl px-3 py-2 text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
            {contestErrorHe}
          </p>
        )}
        {hub.errorHe && (
          <p role="alert" className="rounded-xl px-3 py-2 text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300">
            {hub.errorHe}
          </p>
        )}

        {incoming.length > 0 && (
          <section aria-label="בקשות חברות" className="space-y-2">
            <h3 className="font-extrabold text-sm">📬 בקשות חברות ({incoming.length})</h3>
            <ul className="space-y-2">
              {incoming.map((request) => (
                <RequestRow key={request.friendshipId} request={request} theme={theme} textHe="רוצה להיות בקשר איתך">
                  <button
                    type="button"
                    disabled={busyId === request.friendshipId}
                    onClick={() =>
                      run(request.friendshipId, () => acceptFriendRequest(request.friendshipId), nowFriendsHe(request.fallbackName))
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 ${theme.primaryBtnClass} disabled:opacity-40`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {isGirl ? 'אשרי' : 'אשר'}
                  </button>
                  <button
                    type="button"
                    disabled={busyId === request.friendshipId}
                    onClick={() => run(request.friendshipId, () => deleteFriendship(request.friendshipId))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${theme.secondaryBtnClass} disabled:opacity-40`}
                  >
                    לא תודה
                  </button>
                </RequestRow>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="החברים שלי" className="space-y-2">
          <h3 className="font-extrabold text-sm">
            👫 החברים שלי ({accepted.length}/{MAX_FRIENDS})
          </h3>
          {hub.status === 'loading' && <p className={`text-xs ${theme.mutedTextClass}`}>טוען חברים...</p>}
          {hub.status === 'ready' && accepted.length === 0 && (
            <p className={`text-xs ${theme.mutedTextClass}`}>
              עדיין אין חברים ברשימה. {isGirl ? 'הוסיפי' : 'הוסף'} חבר או חברה עם קוד, או {isGirl ? 'שלחי' : 'שלח'} קישור הזמנה.
            </p>
          )}
          <ul className="grid sm:grid-cols-2 gap-2">
            {accepted.map((friend) => (
              <FriendCard
                key={friend.friendshipId}
                friend={friend}
                publicProfile={hub.profiles[friend.friendUid]}
                gender={profile.gender}
                theme={theme}
                isBusy={busyId === friend.friendshipId}
                onReact={(emoji) =>
                  run(friend.friendshipId, () => sendReaction(friend.friendshipId, me.uid, emoji), `העידוד ${emoji} נשלח!`)
                }
                onRemove={() => run(friend.friendshipId, () => deleteFriendship(friend.friendshipId))}
              >
                {renderFriendExtras?.(friend)}
              </FriendCard>
            ))}
          </ul>
        </section>

        <AddFriendPanel
          gender={profile.gender}
          theme={theme}
          initialQuery={initialInviteCode}
          isBusy={busyId !== null}
          onSend={handleSend}
        />

        {outgoing.length > 0 && (
          <section aria-label="ממתינים לאישור" className="space-y-2">
            <h3 className="font-extrabold text-sm">⏳ ממתינים לאישור</h3>
            <ul className="space-y-2">
              {outgoing.map((request) => (
                <RequestRow key={request.friendshipId} request={request} theme={theme} textHe="עוד לא אישרו">
                  <button
                    type="button"
                    disabled={busyId === request.friendshipId}
                    onClick={() => run(request.friendshipId, () => deleteFriendship(request.friendshipId))}
                    className={`p-1.5 rounded-xl ${theme.secondaryBtnClass} disabled:opacity-40`}
                    aria-label={`ביטול הבקשה ל${request.fallbackName}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </RequestRow>
              ))}
            </ul>
          </section>
        )}

        <MyFriendCodePanel
          friendCode={profile.friendsHub?.friendCode}
          displayName={me.displayName}
          gender={profile.gender}
          theme={theme}
        />
      </div>
    </ExamModalShell>
  );
};

interface RequestRowProps {
  request: FriendLink;
  theme: ThemeDefinition;
  textHe: string;
  children: React.ReactNode;
}

const RequestRow: React.FC<RequestRowProps> = ({ request, theme, textHe, children }) => (
  <li className={`rounded-2xl p-3 flex items-center gap-3 ${theme.cardBgClass}`}>
    <span className="text-2xl" aria-hidden="true">{request.fallbackAvatar}</span>
    <div className="flex-1 min-w-0">
      <p className="font-extrabold text-sm truncate" dir="auto">{request.fallbackName}</p>
      <p className={`text-xs ${theme.mutedTextClass}`}>{textHe}</p>
    </div>
    <div className="flex gap-1.5 shrink-0">{children}</div>
  </li>
);
