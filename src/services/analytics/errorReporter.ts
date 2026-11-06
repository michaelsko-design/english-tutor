import { doc, increment, serverTimestamp, setDoc, type Firestore } from 'firebase/firestore';
import { CLIENT_ERRORS_COLLECTION } from './events';

const MAX_MESSAGE_LENGTH = 200;
const MAX_STACK_LENGTH = 600;
/** One session reports at most this many distinct errors, so a crash loop can't flood Firestore */
export const MAX_REPORTS_PER_SESSION = 10;

/** Strips anything that could identify a person: URLs, emails, long digit runs (ids, phones) */
export function scrubErrorText(text: string, maxLength: number): string {
  return text
    .replace(/https?:\/\/\S+/gi, '<url>')
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '<email>')
    .replace(/\d{6,}/g, '<n>')
    .slice(0, maxLength);
}

/** A short stable id for the error kind (djb2 over message + first stack line) */
export function errorKey(message: string, stack: string): string {
  const source = `${message}|${stack.split('\n')[1] ?? ''}`;
  let hash = 5381;
  for (let i = 0; i < source.length; i += 1) hash = ((hash << 5) + hash + source.charCodeAt(i)) >>> 0;
  return hash.toString(36);
}

interface ErrorReporterDeps {
  getDb: () => Firestore | null;
  getUid: () => string | null;
  today: () => string;
  appVersion: string;
}

export function createErrorReporter(deps: ErrorReporterDeps) {
  const seen = new Set<string>();

  return async function reportError(error: unknown, source: 'render' | 'window' | 'promise'): Promise<void> {
    const db = deps.getDb();
    // Only signed-in sessions can write (firestore.rules)
    if (!db || !deps.getUid()) return;
    const raw = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error');
    const message = scrubErrorText(raw.message || 'Unknown error', MAX_MESSAGE_LENGTH);
    const stack = scrubErrorText(raw.stack ?? '', MAX_STACK_LENGTH);
    const key = errorKey(message, raw.stack ?? '');
    if (seen.has(key) || seen.size >= MAX_REPORTS_PER_SESSION) return;
    seen.add(key);
    try {
      await setDoc(
        doc(db, CLIENT_ERRORS_COLLECTION, `${deps.today()}_${key}`),
        { day: deps.today(), message, stack, source, appVersion: deps.appVersion, count: increment(1), lastSeen: serverTimestamp() },
        { merge: true }
      );
    } catch {
      // Reporting must never throw into the code that is already failing
    }
  };
}
