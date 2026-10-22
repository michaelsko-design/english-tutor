import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { THEME_REGISTRY, ThemeDefinition } from '../themes/themeRegistry';
import { LearnerProfile } from '../types/learner';

export const TEST_THEME: ThemeDefinition = THEME_REGISTRY['cozy-studio'];

/** An onboarded learner, with any fields the test needs changed */
export function makeProfile(overrides: Partial<LearnerProfile> = {}): LearnerProfile {
  return {
    ...DEFAULT_PROFILE,
    isOnboarded: true,
    name: 'נועה',
    gradeId: 'grade-1',
    ...overrides,
    stats: { ...DEFAULT_PROFILE.stats, ...overrides.stats },
  };
}
