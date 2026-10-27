import { useEffect, useRef } from 'react';
import { AuthUserSummary, LearnerProfile } from '../types/learner';
import { ReminderFacts, syncReminder } from '../services/push/pushSubscription';

interface ReminderSyncOptions {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  /** True when the cloud profile has loaded */
  isSynced: boolean;
}

const SYNC_DELAY_MS = 15_000;

/** The streak facts the reminder cron needs, taken from the profile. */
export function getReminderFacts(profile: LearnerProfile): ReminderFacts {
  return {
    streakDays: profile.stats.streakDays,
    streakLastDateStr: profile.stats.streakLastDateStr,
    isShabbatObserver: profile.isShabbatObserver ?? true,
    gender: profile.gender,
  };
}

/**
 * Keeps the stored reminder facts in step with the profile, so the cron stops reminding once the
 * learner has practised. Does nothing when reminders are off (there is no document to update).
 */
export function useReminderSync({ authUser, profile, isSynced }: ReminderSyncOptions): void {
  const uid = authUser && !authUser.isAnonymous ? authUser.uid : null;
  const sentKeyRef = useRef<string | null>(null);
  const facts = getReminderFacts(profile);
  const key = JSON.stringify(facts);

  useEffect(() => {
    sentKeyRef.current = null;
  }, [uid]);

  useEffect(() => {
    if (!uid || !isSynced || !profile.isOnboarded || key === sentKeyRef.current) return undefined;
    const timer = window.setTimeout(() => {
      sentKeyRef.current = key;
      void syncReminder(uid, JSON.parse(key) as ReminderFacts);
    }, SYNC_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [uid, isSynced, profile.isOnboarded, key]);
}
