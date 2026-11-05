import type { LearnerProfile, ProficiencyTier } from '../types/learner';

/** Best stars (0–3) a learner earned in each tier of each mission. */
export type MissionTierStars = Record<string, Partial<Record<ProficiencyTier, number>>>;

export type MissionLadder = Record<ProficiencyTier, number>;

export const TIER_ORDER: readonly ProficiencyTier[] = ['explorer', 'challenger', 'master'];

/** Diamonds paid once, the first time a mission is cleared at a tier. */
export const FIRST_TIER_CLEAR_DIAMONDS: Record<ProficiencyTier, number> = {
  explorer: 3,
  challenger: 8,
  master: 15,
};

const MAX_STARS = 3;

function clampStars(stars: number): number {
  return Math.max(0, Math.min(MAX_STARS, Math.trunc(Number(stars) || 0)));
}

export function recordTierStars(
  tierStars: MissionTierStars | undefined,
  missionId: string,
  tier: ProficiencyTier,
  stars: number
): { tierStars: MissionTierStars; isFirstClear: boolean } {
  const current = tierStars ?? {};
  const previous = clampStars(current[missionId]?.[tier] ?? 0);
  const next = Math.max(previous, clampStars(stars));
  return {
    isFirstClear: previous === 0 && next > 0,
    tierStars: { ...current, [missionId]: { ...current[missionId], [tier]: next } },
  };
}

/** Two devices' tier stars joined by the highest stars per mission and tier. */
export function mergeTierStars(a: MissionTierStars | undefined, b: MissionTierStars | undefined): MissionTierStars {
  const merged: MissionTierStars = {};
  for (const source of [a ?? {}, b ?? {}]) {
    for (const [missionId, tiers] of Object.entries(source)) {
      const cell = { ...merged[missionId] };
      for (const tier of TIER_ORDER) {
        const stars = clampStars(tiers[tier] ?? 0);
        if (tiers[tier] !== undefined) cell[tier] = Math.max(cell[tier] ?? 0, stars);
      }
      merged[missionId] = cell;
    }
  }
  return merged;
}

type LadderProfile = Pick<LearnerProfile, 'missionProgress' | 'preferredTier'> & {
  missionTierStars?: MissionTierStars;
};

/**
 * A mission's stars per tier. A profile from before tiers were tracked has only the mission's
 * best stars; those are credited to the tier the learner prefers and to every tier below it.
 */
export function getMissionLadder(profile: LadderProfile, missionId: string): MissionLadder {
  const ladder: MissionLadder = { explorer: 0, challenger: 0, master: 0 };
  const tracked = profile.missionTierStars?.[missionId];
  if (tracked) {
    for (const tier of TIER_ORDER) ladder[tier] = clampStars(tracked[tier] ?? 0);
    return ladder;
  }
  const legacyStars = clampStars(profile.missionProgress?.[missionId] ?? 0);
  if (legacyStars > 0) {
    const preferredIndex = TIER_ORDER.indexOf(profile.preferredTier ?? 'explorer');
    TIER_ORDER.slice(0, Math.max(0, preferredIndex) + 1).forEach((tier) => {
      ladder[tier] = legacyStars;
    });
  }
  return ladder;
}

/**
 * The tier to suggest next: the first one never played (new questions), else the first without
 * three stars, or null when all three are mastered.
 */
export function getNextTier(ladder: MissionLadder): ProficiencyTier | null {
  return (
    TIER_ORDER.find((tier) => ladder[tier] === 0) ?? TIER_ORDER.find((tier) => ladder[tier] < MAX_STARS) ?? null
  );
}

export function hasMasterTrophy(ladder: MissionLadder): boolean {
  return ladder.master >= MAX_STARS;
}

/** How many missions carry the Master trophy. */
export function countMasterTrophies(profile: LadderProfile, missionIds: readonly string[]): number {
  return missionIds.filter((id) => hasMasterTrophy(getMissionLadder(profile, id))).length;
}
