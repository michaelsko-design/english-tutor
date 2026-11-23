import type { ActivityLogEntry, LearnerProfile } from '../types/learner';
import { addDays } from '../utils/dates';
import type { MissionNode } from './curriculum/types';
import { QUICK_REVIEW_MIN_WORDS, getWaitingMissedWords } from './missedWords';
import {
  DEFAULT_REMINDER_HOUR,
  MISSION_HOOK_MAX_LENGTH,
  REMINDER_HINTS,
  REMINDER_HOURS,
  type ReminderHint,
  type ReminderHour,
} from './reminderSchedule';
import { ROOM_STARTER_ITEM_IDS, getUnplacedRoomItems } from './room';

/** How far back the usual play hour looks, so a new routine (a new school year) wins soon */
export const USUAL_HOUR_DAYS = 28;

function clampToReminderHours(hour: number): ReminderHour {
  const first = REMINDER_HOURS[0];
  const last = REMINDER_HOURS[REMINDER_HOURS.length - 1];
  return Math.min(Math.max(hour, first), last) as ReminderHour;
}

/**
 * The hour the reminder comes: the hour the learner most often finished a session in over the last
 * 4 weeks, kept inside the reminder hours (after school, before evening), or 15:00 with no history.
 * The learner does not pick it. A tie goes to the earlier hour.
 */
export function getUsualReminderHour(log: readonly ActivityLogEntry[] | undefined, todayStr: string): ReminderHour {
  const oldestDay = addDays(todayStr, -(USUAL_HOUR_DAYS - 1));
  const counts = new Map<ReminderHour, number>();
  (log ?? [])
    .filter((entry) => entry.dateStr >= oldestDay && entry.dateStr <= todayStr)
    .forEach((entry) =>
      Object.entries(entry.sessionHours ?? {}).forEach(([hour, sessions]) => {
        const hourNumber = Number(hour);
        if (!Number.isInteger(hourNumber) || !(sessions > 0)) return;
        const slot = clampToReminderHours(hourNumber);
        counts.set(slot, (counts.get(slot) || 0) + sessions);
      })
    );
  let best: ReminderHour = DEFAULT_REMINDER_HOUR;
  let bestCount = 0;
  REMINDER_HOURS.forEach((hour) => {
    const count = counts.get(hour) || 0;
    if (count > bestCount) {
      best = hour;
      bestCount = count;
    }
  });
  return best;
}

export interface ReminderWaiting {
  waitingHints: ReminderHint[];
  nextMissionHookHe?: string;
}

/** What waits for the learner now: missed words to review, a room item to place, the next mission. */
export function getReminderWaiting(profile: LearnerProfile, nextMission: Pick<MissionNode, 'storyHookHe'> | null): ReminderWaiting {
  const hook = nextMission?.storyHookHe.trim();
  const nextMissionHookHe = hook && hook.length <= MISSION_HOOK_MAX_LENGTH ? hook : undefined;
  const waitingHints = REMINDER_HINTS.filter((hint) => {
    if (hint === 'quick-review') return getWaitingMissedWords(profile.missedWords).length >= QUICK_REVIEW_MIN_WORDS;
    // An item the learner earned or bought, not the starter plant every room begins with
    if (hint === 'room-item') return getUnplacedRoomItems(profile).some((item) => !ROOM_STARTER_ITEM_IDS.includes(item.id));
    return nextMission !== null;
  });
  return { waitingHints, ...(nextMissionHookHe ? { nextMissionHookHe } : {}) };
}
