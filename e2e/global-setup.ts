import { assertEmulatorEnvironment, resetEmulators, setAccessOpen } from './support/emulator';

/** Refuses to run outside the emulators, then starts from empty Auth and Firestore. */
export default async function globalSetup(): Promise<void> {
  assertEmulatorEnvironment();
  await resetEmulators();
  // Access is open for every spec but early-testers.spec.ts, which closes it and reopens it itself
  await setAccessOpen(true);
  await warmDevServer();
}

/** The dev server compiles on demand: load the page once so the first spec doesn't pay for it. */
async function warmDevServer(): Promise<void> {
  const baseUrl = process.env.E2E_BASE_URL ?? 'http://localhost:5175';
  const response = await fetch(baseUrl, { signal: AbortSignal.timeout(WARMUP_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`dev server warm-up failed: ${baseUrl} answered ${response.status}`);
  await response.text();
}

const WARMUP_TIMEOUT_MS = 60_000;
