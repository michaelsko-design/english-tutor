/**
 * The shape of a Hebrew clip review mark, and of a mark made on the phone that waits for the PC (the
 * inbox). Pure: the review Worker (reviewWorker/worker.ts) and the PC scripts both use it.
 */
export type ReviewStatus = 'good' | 'regenerate';

/** Why a clip was marked for regenerate; chosen on the review page. */
export const REVIEW_REASONS = ['wrong-gender', 'english-accent', 'mispronounced', 'letter-name', 'cut-off', 'too-fast', 'too-slow', 'noise', 'bad-wording'] as const;
export type ReviewReason = (typeof REVIEW_REASONS)[number];
export const MAX_NOTE_LENGTH = 300;
/** The most items one request may add to or clear from the inbox. */
export const MAX_INBOX_BATCH = 500;

export interface ReviewEntry {
  status: ReviewStatus;
  reasons?: readonly ReviewReason[];
  note?: string;
  /** Fingerprint of the clip file when it was judged. */
  fp: string;
  at: string;
  /** When it was judged, to the millisecond (marks made before the phone page have only `at`). */
  markedAt?: string;
}

export type ReviewState = Readonly<Record<string, ReviewEntry>>;

export interface InboxItem {
  key: string;
  /** null: the mark was taken back. */
  entry: ReviewEntry | null;
  /** Fingerprint of the clip that was heard. */
  fp: string;
  markedAt: string;
}

const KEY_PATTERN = /^[a-z0-9]{1,24}$/;
const FINGERPRINT_PATTERN = /^\d{1,10}-[0-9a-f]{16}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function asRecord(value: unknown, what: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error(`Bad ${what}.`);
  return value as Record<string, unknown>;
}

function asText(value: unknown, pattern: RegExp, what: string): string {
  if (typeof value !== 'string' || !pattern.test(value)) throw new Error(`Bad ${what}.`);
  return value;
}

export function parseEntry(value: unknown): ReviewEntry {
  const raw = asRecord(value, 'mark');
  const { status, reasons, note, markedAt } = raw;
  if (status !== 'good' && status !== 'regenerate') throw new Error('Bad status.');
  if (reasons !== undefined && !(Array.isArray(reasons) && reasons.every((reason) => REVIEW_REASONS.includes(reason as ReviewReason)))) {
    throw new Error('Bad reason.');
  }
  if (note !== undefined && (typeof note !== 'string' || note.length > MAX_NOTE_LENGTH)) throw new Error('Bad note.');
  return {
    status,
    ...(reasons !== undefined && { reasons: reasons as ReviewReason[] }),
    ...(note !== undefined && { note }),
    fp: asText(raw.fp, FINGERPRINT_PATTERN, 'fingerprint'),
    at: asText(raw.at, DATE_PATTERN, 'date'),
    ...(markedAt !== undefined && { markedAt: asText(markedAt, TIME_PATTERN, 'time') }),
  };
}

export function parseState(value: unknown): ReviewState {
  return Object.fromEntries(
    Object.entries(asRecord(value, 'marks')).map(([key, entry]) => [asText(key, KEY_PATTERN, 'key'), parseEntry(entry)]),
  );
}

/** The key and time of an inbox item: what it takes to clear it. */
export function parseInboxRef(value: unknown): Pick<InboxItem, 'key' | 'markedAt'> {
  const raw = asRecord(value, 'item');
  return { key: asText(raw.key, KEY_PATTERN, 'key'), markedAt: asText(raw.markedAt, TIME_PATTERN, 'time') };
}

function parseInboxItem(value: unknown): InboxItem {
  const raw = asRecord(value, 'item');
  const fp = asText(raw.fp, FINGERPRINT_PATTERN, 'fingerprint');
  const entry = raw.entry === null ? null : parseEntry(raw.entry);
  if (entry && entry.fp !== fp) throw new Error('The mark is for other audio.');
  return { ...parseInboxRef(raw), fp, entry };
}

export function parseInboxItems(value: unknown): InboxItem[] {
  if (!Array.isArray(value)) throw new Error('Bad items.');
  return value.map(parseInboxItem);
}

/** When a mark was made; the older marks, with a date only, count from the start of that day. */
export const markTime = (entry: ReviewEntry): string => entry.markedAt ?? `${entry.at}T00:00:00.000Z`;

export function withEntry(state: ReviewState, key: string, entry: ReviewEntry | null): ReviewState {
  const rest = Object.fromEntries(Object.entries(state).filter(([existing]) => existing !== key));
  return entry ? { ...rest, [key]: entry } : rest;
}

/** What every device shows: the PC's marks with the waiting phone marks that are newer laid over them. */
export function overlayInbox(state: ReviewState, items: readonly InboxItem[]): ReviewState {
  const next: Record<string, ReviewEntry> = { ...state };
  for (const { key, entry, markedAt } of items) {
    const current = next[key];
    if (current && markTime(current) >= markedAt) continue;
    if (entry) next[key] = entry;
    else delete next[key];
  }
  return next;
}
