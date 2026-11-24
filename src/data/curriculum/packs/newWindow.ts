import { daysBetween } from '../../../utils/dates';
import type { ReleasedPack } from './types';

/** How long a released pack's units show "חדש!" on the map and the home card is offered */
export const NEW_PACK_DAYS = 14;

/**
 * True when a released pack is new on this local day: from `releasedAt` through its `newUntil` day
 * when it has one, else for `NEW_PACK_DAYS` days. Imports only dates, so the reminder cron uses it too.
 */
export function isReleaseNew(release: Pick<ReleasedPack, 'releasedAt' | 'newUntil'>, todayStr: string): boolean {
  const age = daysBetween(release.releasedAt, todayStr);
  if (age < 0) return false;
  if (release.newUntil !== undefined) return daysBetween(todayStr, release.newUntil) >= 0;
  return age < NEW_PACK_DAYS;
}
