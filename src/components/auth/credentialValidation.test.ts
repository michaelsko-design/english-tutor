import { describe, expect, it } from 'vitest';
import {
  PASSWORD_TOO_SHORT_HE,
  credentialErrorHe,
  USERNAME_ENGLISH_ONLY_HE,
  USERNAME_REQUIRED_HE,
  validateCredentials,
} from './credentialValidation';

describe('validateCredentials', () => {
  it('accepts an English username and a long enough password', () => {
    expect(validateCredentials('new', 'Noa12', '246810')).toBeNull();
    expect(validateCredentials('existing', '  noa.k_1 ', '246810')).toBeNull();
  });

  it('asks for a username when it is empty', () => {
    expect(validateCredentials('new', '   ', '246810')).toBe(USERNAME_REQUIRED_HE);
  });

  it('refuses a Hebrew username instead of silently changing it', () => {
    expect(validateCredentials('new', 'נועה', '246810')).toBe(USERNAME_ENGLISH_ONLY_HE);
    expect(validateCredentials('existing', 'noaנ', '246810')).toBe(USERNAME_ENGLISH_ONLY_HE);
  });

  it('refuses a username with a space', () => {
    expect(validateCredentials('new', 'noa cohen', '246810')).toBe(USERNAME_ENGLISH_ONLY_HE);
  });

  it('accepts an email only when signing in to an existing account', () => {
    expect(validateCredentials('existing', 'noa@example.com', '246810')).toBeNull();
    expect(validateCredentials('new', 'noa@example.com', '246810')).toBe(USERNAME_ENGLISH_ONLY_HE);
  });

  it('refuses a password shorter than six characters', () => {
    expect(validateCredentials('new', 'noa12', '123')).toBe(PASSWORD_TOO_SHORT_HE);
    expect(validateCredentials('existing', 'noa12', '  12345  ')).toBe(PASSWORD_TOO_SHORT_HE);
  });
});

describe('credentialErrorHe', () => {
  it.each([
    ['auth/wrong-password', /לא נכונים/],
    ['auth/user-not-found', /לא נכונים/],
    ['auth/weak-password', /לפחות/],
    ['auth/network-request-failed', /אינטרנט/],
    ['auth/too-many-requests', /יותר מדי ניסיונות/],
    ['auth/something-new', /משהו השתבש/],
  ])('explains %s', (code, expected) => {
    expect(credentialErrorHe(code)).toMatch(expected);
  });
});
