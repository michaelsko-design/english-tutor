import { SUPPORTED_GRADES, type GradeId, type LearnerGender } from '../types/learner';

/**
 * What a new learner told us on the sign-in screen (name, gender, grade, a parent's consent)
 * before their account existed. Once the account is created and its cloud profile loaded, `App`
 * takes it and saves it as the onboarded profile. It is also kept in this tab's sessionStorage,
 * because redeeming an invite code reloads the page between the sign-up and the profile load.
 */
export interface SignupDraft {
  readonly name: string;
  readonly gender: LearnerGender;
  readonly gradeId: GradeId;
  /**
   * The consent box was ticked: under 13 a parent agreed to the terms and the privacy notice, from 13
   * the learner did, with the parents' knowledge (the box is required at every age)
   */
  readonly hasParentConsent: boolean;
}

export const SIGNUP_DRAFT_STORAGE_KEY = 'english_tutor_signup_draft';
const MAX_NAME_LENGTH = 100;

let pending: SignupDraft | null = null;

function readStored(): SignupDraft | null {
  try {
    const raw = sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY);
    return raw ? parseSignupDraft(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeStored(draft: SignupDraft | null): void {
  try {
    if (draft) sessionStorage.setItem(SIGNUP_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    else sessionStorage.removeItem(SIGNUP_DRAFT_STORAGE_KEY);
  } catch {
    // No storage (private mode, tests): the in-memory copy still covers sign-ups without a reload
  }
}

/** A stored draft, checked field by field: anything malformed is dropped */
export function parseSignupDraft(value: unknown): SignupDraft | null {
  if (!value || typeof value !== 'object') return null;
  const { name, gender, gradeId, hasParentConsent } = value as Record<string, unknown>;
  if (typeof name !== 'string' || !name.trim() || name.length > MAX_NAME_LENGTH) return null;
  if (gender !== 'girl' && gender !== 'boy') return null;
  if (typeof gradeId !== 'string' || !SUPPORTED_GRADES.some((grade) => grade.id === gradeId)) return null;
  if (typeof hasParentConsent !== 'boolean') return null;
  return { name, gender, gradeId: gradeId as GradeId, hasParentConsent };
}

export function setSignupDraft(draft: SignupDraft): void {
  pending = draft;
  writeStored(draft);
}

/** The waiting draft, once: a second call finds nothing */
export function takeSignupDraft(): SignupDraft | null {
  const draft = pending ?? readStored();
  clearSignupDraft();
  return draft;
}

export function clearSignupDraft(): void {
  pending = null;
  writeStored(null);
}
