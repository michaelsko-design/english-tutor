import { assertEmulatorEnvironment, resetEmulators, setAccessOpen } from './support/emulator';

/** Refuses to run outside the emulators, then starts from empty Auth and Firestore. */
export default async function globalSetup(): Promise<void> {
  assertEmulatorEnvironment();
  await resetEmulators();
  // Access is open for every spec but early-testers.spec.ts, which closes it and reopens it itself
  await setAccessOpen(true);
}
