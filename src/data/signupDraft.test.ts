import { afterEach, describe, expect, it } from 'vitest';
import { clearSignupDraft, setSignupDraft, takeSignupDraft } from './signupDraft';

const draft = { name: 'נועה', gender: 'girl', gradeId: 'grade-4', hasParentConsent: true } as const;

describe('signupDraft', () => {
  afterEach(clearSignupDraft);

  it('hands the draft over once, then it is gone', () => {
    setSignupDraft(draft);
    expect(takeSignupDraft()).toEqual(draft);
    expect(takeSignupDraft()).toBeNull();
  });

  it('is empty until a sign-up sets it', () => {
    expect(takeSignupDraft()).toBeNull();
  });

  it('can be cleared without being used', () => {
    setSignupDraft(draft);
    clearSignupDraft();
    expect(takeSignupDraft()).toBeNull();
  });
});
