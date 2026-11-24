/**
 * Who gets a streak reminder right now. Pure functions so the daily cron can be tested without a
 * clock or a network. Times are Israel time: the learner's timezone is not stored.
 */
import { isStreakProtectedDay } from '../../src/data/streak.js';
import { addDays } from '../../src/utils/dates.js';
import type { ReminderKind } from '../../src/data/reminderMessage.js';
import { DEFAULT_REMINDER_HOUR, type ReminderHint } from '../../src/data/reminderSchedule.js';
import { CONTENT_PACKS, RELEASED_CONTENT_PACKS } from '../../src/data/curriculum/packs/registry.js';
import { isReleaseNew } from '../../src/data/curriculum/packs/newWindow.js';
import type { ContentPackId, ReleasedPack } from '../../src/data/curriculum/packs/types.js';

// The text lives in src so the app's ask screen previews the same message
export { buildReminderMessage, type ReminderKind, type ReminderMessage } from '../../src/data/reminderMessage.js';

export const REMINDER_TIME_ZONE = 'Asia/Jerusalem';

// The browsers' push services. The endpoint comes from the learner's own Firestore document, so the
// cron only posts to these hosts (firestore.rules has the same list): never to a URL a user typed in.
const PUSH_SERVICE_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /^updates\.push\.services\.mozilla\.com$/,
  /^web\.push\.apple\.com$/,
  /^[a-z0-9-]+\.notify\.windows\.com$/,
];

/** True for an https endpoint on a known browser push service (no port, no user info). */
export function isPushServiceEndpoint(endpoint: string): boolean {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.port !== '' || url.username !== '' || url.password !== '') return false;
  return PUSH_SERVICE_HOSTS.some((host) => host.test(url.hostname));
}

export interface ReminderSubscriber {
  id: string;
  streakDays: number;
  streakLastDateStr?: string;
  isShabbatObserver: boolean;
  gender?: 'girl' | 'boy';
  /** The Israel hour the learner chose; the default hour when none */
  reminderHour?: number;
  waitingHints?: ReminderHint[];
  nextMissionHookHe?: string;
  /** The new pack the app found waiting (`new-pack` hint) */
  newPackId?: string;
  /** When the app last wrote the document (ISO) */
  updatedAt?: string;
}

const isPackId = (id: string): id is ContentPackId => id in CONTENT_PACKS;

/**
 * The new pack to name, if any: the one the app synced, or, for a learner whose app has not written
 * since a pack shipped (so it never saw it), a free pack new today that every grade gets. Pro packs
 * are left to the app, which knows who is Pro.
 */
export function getReminderNewPackId(
  subscriber: Pick<ReminderSubscriber, 'waitingHints' | 'newPackId' | 'updatedAt'>,
  todayStr: string,
  released: readonly ReleasedPack[] = RELEASED_CONTENT_PACKS
): ContentPackId | undefined {
  if (subscriber.waitingHints?.includes('new-pack') && subscriber.newPackId && isPackId(subscriber.newPackId)) {
    return subscriber.newPackId;
  }
  const lastWriteDay = subscriber.updatedAt?.slice(0, 10);
  if (!lastWriteDay) return undefined;
  const unseen = released.find(
    (release) =>
      release.access === 'free' &&
      CONTENT_PACKS[release.id].grades === undefined &&
      isReleaseNew(release, todayStr) &&
      lastWriteDay < release.releasedAt
  );
  return unseen?.id;
}

/** The Hebrew title the `new-pack` reminder names */
export function getPackTitleHe(packId: ContentPackId): string {
  return CONTENT_PACKS[packId].titleHe;
}

/** The calendar day (YYYY-MM-DD) in Israel at the given instant. */
export function getIsraelToday(nowMs: number): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REMINDER_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(nowMs));
  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** The hour (0-23) in Israel at the given instant. */
export function getIsraelHour(nowMs: number): number {
  const hour = new Intl.DateTimeFormat('en-GB', { timeZone: REMINDER_TIME_ZONE, hour: '2-digit', hourCycle: 'h23' }).format(
    new Date(nowMs)
  );
  return Number(hour);
}

/** True when this run's Israel hour is the learner's reminder hour. */
export function isReminderHourNow(subscriber: Pick<ReminderSubscriber, 'reminderHour'>, israelHour: number): boolean {
  return (subscriber.reminderHour ?? DEFAULT_REMINDER_HOUR) === israelHour;
}

/** True when every day between the last practice and today needed no session (Shabbat for observers). */
function isStreakAlive(lastDateStr: string, todayStr: string, isShabbatObserver: boolean): boolean {
  for (let day = addDays(lastDateStr, 1); day < todayStr; day = addDays(day, 1)) {
    if (!isStreakProtectedDay(day, isShabbatObserver)) return false;
  }
  return true;
}

/** A reminder goes out every day, unless the learner already practised today or it is Friday/Shabbat for an observer. */
export function isReminderDue(subscriber: ReminderSubscriber, todayStr: string): boolean {
  if (subscriber.streakLastDateStr && subscriber.streakLastDateStr >= todayStr) return false;
  return !isStreakProtectedDay(todayStr, subscriber.isShabbatObserver);
}

/** 'streak' while the streak is alive and can still be saved today, otherwise 'comeback'. */
export function getReminderKind(subscriber: ReminderSubscriber, todayStr: string): ReminderKind {
  const { streakDays, streakLastDateStr, isShabbatObserver } = subscriber;
  return streakDays >= 1 && streakLastDateStr && isStreakAlive(streakLastDateStr, todayStr, isShabbatObserver)
    ? 'streak'
    : 'comeback';
}
