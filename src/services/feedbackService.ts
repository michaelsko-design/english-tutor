import { addDoc, collection } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { toLocalDateStr } from '../utils/dates';
import { APP_VERSION } from './analytics';

/** "Report a problem / idea" notes from early testers (collection `feedback`, rules cap the text at 500) */
export const FEEDBACK_COLLECTION = 'feedback';
export const MAX_FEEDBACK_LENGTH = 500;

export type FeedbackKind = 'problem' | 'idea';

export interface FeedbackInput {
  kind: FeedbackKind;
  text: string;
  gradeId: string;
  screen: string;
}

export type FeedbackResult = { ok: true } | { ok: false; errorHe: string };

const EMPTY_HE = 'כדאי לכתוב כמה מילים לפני השליחה.';
const FAILED_HE = 'לא הצלחנו לשלוח. כדאי לנסות שוב בעוד רגע.';

/** Trimmed text, or null when nothing is left to send */
export function cleanFeedbackText(raw: string): string | null {
  const text = raw.trim().slice(0, MAX_FEEDBACK_LENGTH);
  return text ? text : null;
}

export async function sendFeedback(input: FeedbackInput): Promise<FeedbackResult> {
  const text = cleanFeedbackText(input.text);
  if (!text) return { ok: false, errorHe: EMPTY_HE };
  const user = auth?.currentUser;
  if (!isFirebaseConfigured || !db || !user) return { ok: false, errorHe: FAILED_HE };
  try {
    await addDoc(collection(db, FEEDBACK_COLLECTION), {
      uid: user.uid,
      day: toLocalDateStr(new Date()),
      kind: input.kind,
      text,
      gradeId: input.gradeId || 'unknown',
      screen: input.screen,
      appVersion: APP_VERSION,
    });
    return { ok: true };
  } catch {
    return { ok: false, errorHe: FAILED_HE };
  }
}
