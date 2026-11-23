import { CurriculumUnit, MissionNode } from './curriculum';
import { getSuggestedMission } from './milestones';

/**
 * After this many missions in one local day the victory screen closes the day kindly instead of
 * offering another mission: a healthy stopping point for children (no endless "one more").
 */
export const DAILY_STOP_MISSIONS = 3;

export type VictoryNextStep =
  | { kind: 'next'; mission: MissionNode; isReplay: boolean }
  | { kind: 'rest' }
  | { kind: 'none' };

export interface VictoryNextStepInput {
  /** The units the learner may play (Pro units already filtered out) */
  units: CurriculumUnit[];
  /** Mission stars including the mission just finished */
  progressAfter: Record<string, number>;
  /** Missions finished today including the one just finished */
  missionsTodayAfter: number;
  /** The learner's very first mission: the first-win screen follows, so no next step */
  isFirstMission: boolean;
}

/** What the mission victory screen offers next: the next mission, a "done for today", or nothing. */
export function getVictoryNextStep(input: VictoryNextStepInput): VictoryNextStep {
  const { units, progressAfter, missionsTodayAfter, isFirstMission } = input;
  if (isFirstMission) return { kind: 'none' };
  if (missionsTodayAfter >= DAILY_STOP_MISSIONS) return { kind: 'rest' };

  const allMissions = units.flatMap((unit) => unit.missions);
  const hasUnstarted = allMissions.some((mission) => (progressAfter[mission.id] || 0) === 0);
  if (!hasUnstarted) return { kind: 'none' };

  const { mission } = getSuggestedMission(units, progressAfter);
  return { kind: 'next', mission, isReplay: (progressAfter[mission.id] || 0) > 0 };
}
