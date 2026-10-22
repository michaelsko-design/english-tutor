import { assertEmulatorEnvironment, resetEmulators } from './support/emulator';

/** Refuses to run outside the emulators, then starts from empty Auth and Firestore. */
export default async function globalSetup(): Promise<void> {
  assertEmulatorEnvironment();
  await resetEmulators();
}
