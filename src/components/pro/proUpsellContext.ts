import { createContext, useContext } from 'react';
import type { LearnerGender } from '../../types/learner';
import type { ProAskFocus } from '../../data/proAsk';
import type { ExamPitch } from '../../data/examPitch';

/** What brought the learner to the Pro sheet; it leads with that (the same list the stored ask remembers, data/proAsk.ts) */
export type ProUpsellFocus = ProAskFocus;

export interface ProAskLearner {
  uid: string;
  name: string;
  gender: LearnerGender;
  avatarEmoji: string;
  /** A guest account must be saved first: Pro attaches to an account a guest can lose */
  isGuest: boolean;
  /** A coming exam or school word lists: the sheet and the message lead with it (data/examPitch.ts) */
  exam?: ExamPitch | null;
}

/** Opens the Pro sheet from anywhere under the home screen (DashboardView renders it) */
export const ProUpsellContext = createContext<(focus: ProUpsellFocus) => void>(() => undefined);

export function useOpenProUpsell(): (focus: ProUpsellFocus) => void {
  return useContext(ProUpsellContext);
}
