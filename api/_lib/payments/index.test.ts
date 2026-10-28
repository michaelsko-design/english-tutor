import { describe, expect, it } from 'vitest';
import { createPaymentProvider } from './index';

const GROW = { GROW_USER_ID: 'u', GROW_RECURRING_PAGE_CODE: 'r', GROW_REGULAR_PAGE_CODE: 'g' };

describe('createPaymentProvider', () => {
  it('builds Grow only when it is configured', () => {
    expect(createPaymentProvider({ PAYMENT_PROVIDER: 'grow', ...GROW })?.id).toBe('grow');
    expect(createPaymentProvider({ PAYMENT_PROVIDER: 'grow' })).toBeNull();
  });

  it('allows the mock gateway on local runs against a demo project only', () => {
    const demo = { PAYMENT_PROVIDER: 'mock', FIREBASE_PROJECT_ID: 'demo-english-vibe' };
    expect(createPaymentProvider(demo)?.id).toBe('mock');
    expect(createPaymentProvider({ PAYMENT_PROVIDER: 'mock' })).toBeNull();
    expect(createPaymentProvider({ PAYMENT_PROVIDER: 'mock', FIREBASE_PROJECT_ID: 'english-tutor-il-7' })).toBeNull();
    expect(createPaymentProvider({ ...demo, VERCEL_ENV: 'preview' })).toBeNull();
    expect(createPaymentProvider({ ...demo, VERCEL_ENV: 'production' })).toBeNull();
  });

  it('has no gateway without PAYMENT_PROVIDER', () => {
    expect(createPaymentProvider(GROW)).toBeNull();
  });
});
