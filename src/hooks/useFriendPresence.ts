import { useEffect, useRef, useState } from 'react';
import { AuthUserSummary, LearnerProfile } from '../types/learner';
import {
  PublicProfile,
  buildPublicProfile,
  isFriendsHubEnabled,
  isSamePublicProfile,
  isUsernameSearchable,
  toDisplayName,
  withFriendCode,
} from '../data/friends';
import {
  ensureFriendIdentity,
  publishPublicProfile,
  removeLookupEntries,
  removePublicProfile,
} from '../services/friendsService';
import { toLocalDateStr } from '../utils/dates';

interface FriendPresenceOptions {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  /** True when the cloud profile has loaded, so a code already claimed on another device is known */
  isSynced: boolean;
  avatarEmoji: string;
  /** The latest profile, read after an await so a claimed code doesn't undo newer changes */
  getLatestProfile: () => LearnerProfile;
  onUpdateProfile: (updated: LearnerProfile) => void;
}

const CLAIM_RETRY_MS = 30_000;

/**
 * Feature 19: keeps what friends see in step with the profile. While the hub is on it claims the
 * learner's friend code (and username) and publishes the public summary whenever it changes;
 * when the learner turns the hub off, the summary and the lookup entries are removed.
 */
export function useFriendPresence({
  authUser,
  profile,
  isSynced,
  avatarEmoji,
  getLatestProfile,
  onUpdateProfile,
}: FriendPresenceOptions): void {
  const uid = authUser && !authUser.isAnonymous ? authUser.uid : null;
  const email = authUser?.email ?? null;
  // Saving the profile briefly shows "syncing", so the first sync is latched per account
  const [syncedUid, setSyncedUid] = useState<string | null>(null);
  useEffect(() => {
    if (isSynced && uid) setSyncedUid(uid);
  }, [isSynced, uid]);
  const isReady = Boolean(uid && profile.isOnboarded && syncedUid === uid);
  const isEnabled = isFriendsHubEnabled(profile);
  const isActive = isReady && isEnabled;
  const friendCode = profile.friendsHub?.friendCode;
  const displayName = toDisplayName(profile.name);
  const isSearchable = isUsernameSearchable(profile);
  const identityKey = `${uid}|${email}|${displayName}|${avatarEmoji}|${friendCode}|${isSearchable}`;

  const onUpdateRef = useRef(onUpdateProfile);
  onUpdateRef.current = onUpdateProfile;
  const getLatestRef = useRef(getLatestProfile);
  getLatestRef.current = getLatestProfile;
  const identityKeyRef = useRef(identityKey);
  identityKeyRef.current = identityKey;
  const isClaimingRef = useRef(false);
  const publishedRef = useRef<PublicProfile | null>(null);
  // Bumped to run the identity step again: after a failure, when back online, or when the name
  // or avatar changed while a claim was running
  const [identityTick, setIdentityTick] = useState(0);

  // Another account on this device publishes its own summary
  useEffect(() => {
    publishedRef.current = null;
  }, [uid]);

  useEffect(() => {
    const retry = () => setIdentityTick((t) => t + 1);
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, []);

  // Claim the friend code once, and keep the code's and username's name and avatar current
  useEffect(() => {
    if (!isActive || !uid || isClaimingRef.current) return;
    isClaimingRef.current = true;
    const startedKey = identityKey;
    let retryTimer: number | undefined;
    let isCancelled = false;
    ensureFriendIdentity({ uid, email, displayName, avatarEmoji }, friendCode, isSearchable)
      .then((result) => {
        if (!result.ok) {
          // Not after cleanup: the effect runs again on its own then
          if (!isCancelled) retryTimer = window.setTimeout(() => setIdentityTick((t) => t + 1), CLAIM_RETRY_MS);
          return;
        }
        const latest = getLatestRef.current();
        if (!latest.friendsHub?.friendCode) onUpdateRef.current(withFriendCode(latest, result.value, new Date()));
      })
      .finally(() => {
        isClaimingRef.current = false;
        if (identityKeyRef.current !== startedKey) setIdentityTick((t) => t + 1);
      });
    return () => {
      isCancelled = true;
      window.clearTimeout(retryTimer);
    };
    // identityKey covers uid, email, name, avatar, code and username search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, identityKey, identityTick]);

  const summary = buildPublicProfile(profile, avatarEmoji, toLocalDateStr(new Date()));
  const summaryKey = JSON.stringify(summary);

  // Publish the summary when it changes; a failed write is retried on the next change
  useEffect(() => {
    if (!isActive || !uid) return;
    const next = JSON.parse(summaryKey) as PublicProfile;
    if (isSamePublicProfile(publishedRef.current, next)) return;
    publishPublicProfile(uid, next).then((result) => {
      if (result.ok) publishedRef.current = next;
    });
  }, [isActive, uid, summaryKey]);

  // The hub was turned off: hide the summary from friends and stop the code and username finding the learner
  useEffect(() => {
    if (!isReady || !uid || isEnabled) return;
    publishedRef.current = null;
    removePublicProfile(uid);
    removeLookupEntries({ uid, email }, friendCode);
  }, [isReady, uid, email, isEnabled, friendCode]);
}
