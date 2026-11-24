import { useEffect, useRef } from 'react';
import { AuthUserSummary, LearnerProfile } from '../types/learner';
import { ReminderFacts, syncReminder } from '../services/push/pushSubscription';
import { getLoadedGrade } from '../data/curriculum/loader';
import { getSuggestedMission } from '../data/milestones';
import { canPlayMission, getPlayableUnits, getProAccess, type ProAccess } from '../data/proGate';
import { getWaitingNewPackId } from '../data/contentPacks';
import { getReminderWaiting, getUsualReminderHour } from '../data/reminderWaiting';
import { toLocalDateStr } from '../utils/dates';

interface ReminderSyncOptions {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  /** True when the cloud profile has loaded */
  isSynced: boolean;
  proAccess: ProAccess;
}

const SYNC_DELAY_MS = 15_000;

/** The home screen's next mission, once the grade has loaded (the Play button's pick, never a Pro one). */
function getNextMission(profile: LearnerProfile, proAccess: ProAccess) {
  const grade = getLoadedGrade(profile.gradeId);
  if (!grade) return null;
  return getSuggestedMission(getPlayableUnits(grade.units, proAccess), profile.missionProgress || {}).mission ?? null;
}

/** A new pack in the learner's grade they can play and haven't started, once the grade has loaded. */
function getNewPackId(profile: LearnerProfile, proAccess: ProAccess, todayStr: string): string | null {
  const grade = getLoadedGrade(profile.gradeId);
  if (!grade) return null;
  const progress = profile.missionProgress || {};
  return getWaitingNewPackId(grade.units, progress, todayStr, (unit, missionId) => canPlayMission(unit, missionId, progress, proAccess));
}

/** The facts the reminder cron needs, taken from the profile: the streak, what waits and the usual play hour. */
export function getReminderFacts(profile: LearnerProfile, proAccess: ProAccess = getProAccess(false)): ReminderFacts {
  const todayStr = toLocalDateStr(new Date());
  return {
    ...getReminderWaiting(profile, getNextMission(profile, proAccess), getNewPackId(profile, proAccess, todayStr)),
    reminderHour: getUsualReminderHour(profile.activityLog, todayStr),
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
export function useReminderSync({ authUser, profile, isSynced, proAccess }: ReminderSyncOptions): void {
  const uid = authUser && !authUser.isAnonymous ? authUser.uid : null;
  const sentKeyRef = useRef<string | null>(null);
  const facts = getReminderFacts(profile, proAccess);
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
