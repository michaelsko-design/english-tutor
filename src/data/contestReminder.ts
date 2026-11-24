/**
 * The daily reminder's friend-contest hint (retention audit follow-up): the cron reads the learner's
 * contests on the server (api/streak-reminder.ts) and names a contest that waits for the learner's
 * turn. Kept free of the curriculum so the cron stays small; the rules of a contest are in
 * data/contests.ts. The push never names the friend: it shows on a lock screen.
 */

/** The fields of a `contests/{pairId}_{dateStr}` document the reminder needs, as read on the server */
export interface ContestReminderFields {
  uids?: unknown;
  status?: unknown;
  expiresAtMs?: unknown;
  results?: unknown;
}

/** True when the contest is still open and the learner hasn't played it yet. */
export function isContestWaitingFor(contest: ContestReminderFields, uid: string, nowMs: number): boolean {
  if (!Array.isArray(contest.uids) || !contest.uids.includes(uid)) return false;
  if (contest.status === 'declined') return false;
  if (typeof contest.expiresAtMs !== 'number' || nowMs >= contest.expiresAtMs) return false;
  const results = typeof contest.results === 'object' && contest.results !== null ? (contest.results as Record<string, unknown>) : {};
  return results[uid] === undefined;
}
