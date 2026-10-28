import { createContext, useContext } from 'react';
import type { LearnerGender } from '../../types/learner';

/** What brought the learner to the Pro sheet; it leads with that */
export type ProUpsellFocus = 'missions' | 'exam' | 'lists' | 'themes';

export interface ProAskLearner {
  uid: string;
  name: string;
  gender: LearnerGender;
  avatarEmoji: string;
  /** A guest account must be saved first: Pro attaches to an account a guest can lose */
  isGuest: boolean;
}

/** Opens the Pro sheet from anywhere under the home screen (DashboardView renders it) */
export const ProUpsellContext = createContext<(focus: ProUpsellFocus) => void>(() => undefined);

export function useOpenProUpsell(): (focus: ProUpsellFocus) => void {
  return useContext(ProUpsellContext);
}
