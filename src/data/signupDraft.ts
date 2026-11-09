import type { GradeId, LearnerGender } from '../types/learner';

/**
 * What a new learner told us on the sign-in screen (name, gender, grade, a parent's consent)
 * before their account existed. It lives in memory only: once the account is created and its
 * cloud profile loaded, `App` takes it and saves it as the onboarded profile.
 */
export interface SignupDraft {
  readonly name: string;
  readonly gender: LearnerGender;
  readonly gradeId: GradeId;
  readonly hasParentConsent: boolean;
}

let pending: SignupDraft | null = null;

export function setSignupDraft(draft: SignupDraft): void {
  pending = draft;
}

/** The waiting draft, once: a second call finds nothing */
export function takeSignupDraft(): SignupDraft | null {
  const draft = pending;
  pending = null;
  return draft;
}

export function clearSignupDraft(): void {
  pending = null;
}
