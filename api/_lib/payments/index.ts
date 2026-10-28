/**
 * Picks the payment gateway from PAYMENT_PROVIDER: `grow`, or `mock` on local runs against a
 * `demo-` (emulator) project only. Vercel Preview and a local run with the live service account both
 * write to the live Firebase project, where a mock would hand out real Pro.
 */
import { createGrowProvider, readGrowConfig } from './grow.js';
import { createMockProvider } from './mock.js';
import type { PaymentProvider } from './provider.js';

export function createPaymentProvider(env: Record<string, string | undefined>, fetchImpl: typeof fetch = fetch): PaymentProvider | null {
  if (env.PAYMENT_PROVIDER === 'grow') {
    const config = readGrowConfig(env);
    return config ? createGrowProvider(config, fetchImpl) : null;
  }
  const isDemoProject = (env.FIREBASE_PROJECT_ID ?? '').startsWith('demo-');
  if (env.PAYMENT_PROVIDER === 'mock' && !env.VERCEL_ENV && isDemoProject) return createMockProvider();
  return null;
}
