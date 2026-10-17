import { useEffect, useMemo, useState } from 'react';
import {
  ClassifiedFriendships,
  FriendshipDoc,
  PublicProfile,
  classifyFriendships,
} from '../data/friends';
import { ContestDoc, getContestLookbackDateStr } from '../data/contests';
import { subscribeContests, subscribeFriendships, subscribePublicProfile } from '../services/friendsService';

export type FriendsHubStatus = 'off' | 'loading' | 'ready' | 'error';

export interface FriendsHubData {
  status: FriendsHubStatus;
  friendships: ClassifiedFriendships;
  /** Friend uid -> public profile; null when that friend turned the hub off */
  profiles: Record<string, PublicProfile | null>;
  errorHe: string | null;
  /** Contests from the last few days, with friends and former friends */
  contests: ContestDoc[];
}

const EMPTY: ClassifiedFriendships = { accepted: [], incoming: [], outgoing: [] };

/**
 * Feature 19: live friendships and friends' public profiles. Listens only while `uid` is set,
 * i.e. the hub is on and the learner is signed in with a real (not guest) account.
 */
export function useFriendsHub(uid: string | null): FriendsHubData {
  const [docs, setDocs] = useState<FriendshipDoc[]>([]);
  const [status, setStatus] = useState<FriendsHubStatus>(uid ? 'loading' : 'off');
  const [errorHe, setErrorHe] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Record<string, PublicProfile | null>>({});
  const [contests, setContests] = useState<ContestDoc[]>([]);
  const [contestsErrorHe, setContestsErrorHe] = useState<string | null>(null);

  useEffect(() => {
    setContests([]);
    setContestsErrorHe(null);
    if (!uid) return;
    return subscribeContests(
      uid,
      getContestLookbackDateStr(new Date()),
      (next) => {
        setContests(next);
        setContestsErrorHe(null);
      },
      setContestsErrorHe
    );
  }, [uid]);

  useEffect(() => {
    setDocs([]);
    setProfiles({});
    setErrorHe(null);
    if (!uid) {
      setStatus('off');
      return;
    }
    setStatus('loading');
    return subscribeFriendships(
      uid,
      (next) => {
        setDocs(next);
        setStatus('ready');
        setErrorHe(null);
      },
      (message) => {
        setErrorHe(message);
        setStatus('error');
      }
    );
  }, [uid]);

  const friendships = useMemo(() => (uid ? classifyFriendships(docs, uid) : EMPTY), [docs, uid]);
  // A stable key, so the profile listeners restart only when the friend list itself changes
  const friendUidsKey = friendships.accepted.map((f) => f.friendUid).sort().join(',');

  useEffect(() => {
    if (!friendUidsKey) return;
    const friendUids = friendUidsKey.split(',');
    setProfiles((current) =>
      Object.fromEntries(Object.entries(current).filter(([friendUid]) => friendUids.includes(friendUid)))
    );
    const unsubscribers = friendUids.map((friendUid) =>
      subscribePublicProfile(friendUid, (profile) =>
        setProfiles((current) => ({ ...current, [friendUid]: profile }))
      )
    );
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [friendUidsKey]);

  return { status, friendships, profiles, errorHe: errorHe || contestsErrorHe, contests };
}
