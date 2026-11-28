// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { clearSignupDraft, parseSignupDraft, setSignupDraft, SIGNUP_DRAFT_STORAGE_KEY, takeSignupDraft } from './signupDraft';

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

describe('signupDraft across a reload (an invite code reloads the page after sign-up)', () => {
  afterEach(clearSignupDraft);

  it('is read back from this tab\'s sessionStorage once the in-memory copy is gone', () => {
    sessionStorage.setItem(SIGNUP_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    expect(takeSignupDraft()).toEqual(draft);
    expect(sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY)).toBeNull();
    expect(takeSignupDraft()).toBeNull();
  });

  it('is stored when set and removed when cleared', () => {
    setSignupDraft(draft);
    expect(JSON.parse(sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY) ?? 'null')).toEqual(draft);
    clearSignupDraft();
    expect(sessionStorage.getItem(SIGNUP_DRAFT_STORAGE_KEY)).toBeNull();
  });

  it('drops a malformed stored draft', () => {
    sessionStorage.setItem(SIGNUP_DRAFT_STORAGE_KEY, '{not json');
    expect(takeSignupDraft()).toBeNull();
    expect(parseSignupDraft({ ...draft, gender: 'x' })).toBeNull();
    expect(parseSignupDraft({ ...draft, gradeId: 'grade-13' })).toBeNull();
    expect(parseSignupDraft({ ...draft, name: '  ' })).toBeNull();
    expect(parseSignupDraft({ ...draft, hasParentConsent: 'yes' })).toBeNull();
    expect(parseSignupDraft(null)).toBeNull();
  });
});
