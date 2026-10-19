import React, { Suspense, useEffect, useRef, useState } from 'react';
import { FriendLink, isFriendsHubEnabled, toDisplayName } from '../../data/friends';
import {
  ContestResult,
  applyContestFinish,
  applyDecidedContests,
  createContest,
  findTodaysContest,
  getContestState,
  getRecordAgainst,
  scoreContestAnswers,
} from '../../data/contests';
import { useFriendsHub } from '../../hooks/useFriendsHub';
import {
  FriendIdentity,
  createContestDoc,
  respondToContest,
  submitContestResult,
} from '../../services/friendsService';
import { AuthUserSummary, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

import { ContestPanel } from './ContestPanel';
import { ContestRunner } from './ContestRunner';

import { DockTile } from '../home/DockTile';
import { lazyNamed } from '../../utils/lazyNamed';
import { ScreenLoading } from '../ScreenLoading';

const FriendsScreen = lazyNamed(() => import('./FriendsScreen'), 'FriendsScreen');
const ContestResultView = lazyNamed(() => import('./ContestResultView'), 'ContestResultView');

interface FriendsHubProps {
  profile: LearnerProfile;
  authUser: AuthUserSummary | null;
  theme: ThemeDefinition;
  avatarEmoji: string;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** A friend code from an invite link, waiting to be shown */
  pendingInviteCode: string | null;
  onInviteHandled: () => void;
}

type HubView =
  | { kind: 'closed' }
  | { kind: 'hub' }
  | { kind: 'contest'; contestId: string; friendName: string; runId: number }
  | {
      kind: 'contest-result';
      result: ContestResult;
      friendName: string;
      isSaving: boolean;
      xpEarned: number | null;
      isFullReward: boolean;
      errorHe: string | null;
    };

/** Screen-reader text for the tile's dot: waiting friend requests and contest invites. */
function describeNewsHe(requests: number, contestInvites: number): string {
  const parts: string[] = [];
  if (requests > 0) parts.push(requests === 1 ? 'בקשת חברות אחת מחכה' : `${requests} בקשות חברות מחכות`);
  if (contestInvites > 0) parts.push(contestInvites === 1 ? 'הזמנה לאתגר מחכה' : `${contestInvites} הזמנות לאתגר מחכות`);
  return parts.join(', ');
}

/**
 * Feature 19: the Friends Hub home dock tile (Feature 27), with a dot for waiting requests and
 * contest invites, plus the hub overlay. Hidden when turned off or for guest accounts.
 */
export const FriendsHub: React.FC<FriendsHubProps> = ({
  profile,
  authUser,
  theme,
  avatarEmoji,
  onUpdateProfile,
  onSpeakEnglish,
  pendingInviteCode,
  onInviteHandled,
}) => {
  const isEnabled = isFriendsHubEnabled(profile);
  const isRealAccount = Boolean(authUser && !authUser.isAnonymous);
  const myUid = isEnabled && isRealAccount && authUser ? authUser.uid : null;
  const hub = useFriendsHub(myUid);
  const [view, setView] = useState<HubView>({ kind: 'closed' });
  const [inviteCode, setInviteCode] = useState<string | undefined>(undefined);
  const [busyFriendUid, setBusyFriendUid] = useState<string | null>(null);
  const [contestErrorHe, setContestErrorHe] = useState<string | null>(null);
  // Read after an await, so a reward is added to the latest profile
  const profileRef = useRef(profile);
  profileRef.current = profile;

  // An invite link opens the hub with the inviter's code filled in
  useEffect(() => {
    if (!pendingInviteCode || !isEnabled || !isRealAccount) return;
    setInviteCode(pendingInviteCode);
    setView({ kind: 'hub' });
    onInviteHandled();
  }, [pendingInviteCode, isEnabled, isRealAccount, onInviteHandled]);

  // Record decided contests and give their diamonds, once each
  useEffect(() => {
    if (!myUid || hub.contests.length === 0) return;
    const updated = applyDecidedContests(profile, hub.contests, myUid, new Date());
    if (updated !== profile) onUpdateProfile(updated);
  }, [hub.contests, profile, myUid, onUpdateProfile]);

  // Off in the settings, or a guest account (the hub needs a permanent one): no tile
  if (!isEnabled || !authUser || !myUid) return null;

  const me: FriendIdentity = {
    uid: myUid,
    email: authUser.email,
    displayName: toDisplayName(profile.name),
    avatarEmoji,
  };
  const now = new Date();
  const { accepted, incoming } = hub.friendships;
  const friendUids = new Set(accepted.map((f) => f.friendUid));
  const contestInvites = hub.contests.filter(
    (c) => c.uids.some((uid) => friendUids.has(uid)) && getContestState(c, myUid, now) === 'invited-me'
  ).length;
  const friendNameOf = (friend: FriendLink) => hub.profiles[friend.friendUid]?.displayName || friend.fallbackName;

  const handleInvite = async (friend: FriendLink) => {
    if (findTodaysContest(hub.contests, myUid, friend.friendUid, new Date())) return;
    setBusyFriendUid(friend.friendUid);
    setContestErrorHe(null);
    const friendName = friendNameOf(friend);
    const contest = createContest(me, { uid: friend.friendUid, displayName: friendName }, new Date());
    const result = await createContestDoc(contest);
    setBusyFriendUid(null);
    if (!result.ok) setContestErrorHe(result.errorHe);
  };

  const handleRespond = async (friend: FriendLink, contestId: string, isAccepted: boolean) => {
    setBusyFriendUid(friend.friendUid);
    setContestErrorHe(null);
    const result = await respondToContest(contestId, isAccepted);
    setBusyFriendUid(null);
    if (!result.ok) setContestErrorHe(result.errorHe);
    else if (isAccepted) openContest(contestId, friendNameOf(friend));
  };

  const openContest = (contestId: string, friendName: string) => {
    // The invite code was used when the hub opened; don't search it again on the way back
    setInviteCode(undefined);
    setView({ kind: 'contest', contestId, friendName, runId: Date.now() });
  };

  const handleFinishContest = async (contestId: string, friendName: string, answers: boolean[], timeMs: number) => {
    const finishedAt = new Date();
    const contestResult = scoreContestAnswers(answers, timeMs, finishedAt);
    const resultView = { kind: 'contest-result' as const, result: contestResult, friendName };
    // Leaving the runner right away also stops a second submit
    setView({ ...resultView, isSaving: true, xpEarned: null, isFullReward: false, errorHe: null });
    const saved = await submitContestResult(contestId, myUid, contestResult);
    if (!saved.ok) {
      const contest = hub.contests.find((c) => c.id === contestId);
      const isPastMidnight = Boolean(contest && finishedAt.getTime() >= contest.expiresAtMs);
      const errorHe = isPastMidnight ? 'האתגר נגמר בחצות, לכן התוצאה לא נשמרה.' : saved.errorHe;
      setView({ ...resultView, isSaving: false, xpEarned: null, isFullReward: false, errorHe });
      return;
    }
    const reward = applyContestFinish(profileRef.current, finishedAt);
    onUpdateProfile(reward.profile);
    setView({ ...resultView, isSaving: false, xpEarned: reward.xpEarned, isFullReward: reward.isFullReward, errorHe: null });
  };

  const renderContest = (friend: FriendLink) => {
    const contest = findTodaysContest(hub.contests, myUid, friend.friendUid, now);
    const friendName = friendNameOf(friend);
    const recorded = contest && profile.friendsHub?.contestHistory?.find((r) => r.contestId === contest.id);
    return (
      <ContestPanel
        contest={contest}
        myUid={myUid}
        friendName={friendName}
        record={getRecordAgainst(profile.friendsHub?.contestHistory, friend.friendUid)}
        diamondsEarned={recorded ? recorded.diamondsEarned : undefined}
        gender={profile.gender}
        theme={theme}
        now={now}
        isBusy={busyFriendUid === friend.friendUid}
        onInvite={() => handleInvite(friend)}
        onRespond={(isAccepted) => contest && handleRespond(friend, contest.id, isAccepted)}
        onPlay={() => contest && openContest(contest.id, friendName)}
      />
    );
  };

  const activeContest = view.kind === 'contest' ? hub.contests.find((c) => c.id === view.contestId) : undefined;

  return (
    <>
      <DockTile
        emoji="👫"
        labelHe="חברים"
        theme={theme}
        onClick={() => setView({ kind: 'hub' })}
        hasNews={incoming.length + contestInvites > 0}
        newsLabelHe={describeNewsHe(incoming.length, contestInvites)}
      />

      {view.kind === 'hub' && (
        <Suspense fallback={<ScreenLoading />}>
          <FriendsScreen
            profile={profile}
            me={me}
            hub={hub}
            theme={theme}
            initialInviteCode={inviteCode}
            contestErrorHe={contestErrorHe}
            renderFriendExtras={renderContest}
            onClose={() => {
              setView({ kind: 'closed' });
              setInviteCode(undefined);
              setContestErrorHe(null);
            }}
          />
        </Suspense>
      )}

      {view.kind === 'contest' && activeContest && (
        <ContestRunner
          key={view.runId}
          contest={activeContest}
          friendName={view.friendName}
          profile={profile}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
          onFinish={(answers, timeMs) => handleFinishContest(activeContest.id, view.friendName, answers, timeMs)}
          onClose={() => setView({ kind: 'hub' })}
        />
      )}

      {view.kind === 'contest-result' && (
        <Suspense fallback={<ScreenLoading />}>
          <ContestResultView
            result={view.result}
            friendName={view.friendName}
            isSaving={view.isSaving}
            xpEarned={view.xpEarned}
            isFullReward={view.isFullReward}
            errorHe={view.errorHe}
            theme={theme}
            onDone={() => setView({ kind: 'hub' })}
          />
        </Suspense>
      )}
    </>
  );
};
