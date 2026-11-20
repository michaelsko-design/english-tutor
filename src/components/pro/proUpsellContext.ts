import { createContext, useContext } from 'react';
import type { LearnerGender } from '../../types/learner';
import type { ProAskFocus } from '../../data/proAsk';

/** The locked Pro part that opened the parents' info (data/proAsk.ts) */
export type ProUpsellFocus = ProAskFocus;

export interface ProAskLearner {
  uid: string;
  name: string;
  gender: LearnerGender;
  avatarEmoji: string;
  /** A guest account must be saved first: Pro attaches to an account a guest can lose */
  isGuest: boolean;
}

/** Opens the parents' info sheet from anywhere under the home screen (DashboardView renders it) */
export const ProUpsellContext = createContext<(focus: ProUpsellFocus) => void>(() => undefined);

export function useOpenProUpsell(): (focus: ProUpsellFocus) => void {
  return useContext(ProUpsellContext);
}
