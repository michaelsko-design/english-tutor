/**
 * The list of lines the phone page reads. A clip is listed only when the object in the clips bucket is
 * byte for byte the file on this PC, so a mark made on the phone is always about the PC's audio.
 */
import { parseListenerGender } from '../../src/services/tts/ttsText';
import { byWalkOrder, type CutLine, type ReviewCatalog } from './hebrewReviewCatalog';
import { REVIEW_GROUPS } from './hebrewReviewOrder';
import { MAX_NOTE_LENGTH, REVIEW_REASONS } from './reviewMarks';
import type { LinePart } from './wholeLines';

export interface SnapshotLine {
  spoken: string;
  listener: CutLine['listener'];
  /** Bucket paths of the clips, in the order the app plays them. */
  parts: string[];
}

export interface SnapshotItem {
  key: string;
  spoken: string;
  /** The text without niqqud, when it differs: what the search box matches. */
  plain?: string;
  gender?: 'girl' | 'boy';
  speed: string;
  group: string;
  where: string;
  fp: string;
  path: string;
  /** A new take waits on the PC, to be compared there. */
  hasTake: boolean;
  lines?: SnapshotLine[];
}

export interface Snapshot {
  version: 1;
  generatedAt: string;
  clipBaseUrl: string;
  groups: string[];
  reasons: readonly string[];
  maxNote: number;
  items: SnapshotItem[];
}

export interface SnapshotSources {
  catalog: ReviewCatalog;
  clipBaseUrl: string;
  inspect(voice: LinePart['voice'], key: string): { fp: string; md5: string } | null;
  objectPath(voice: LinePart['voice'], key: string): string;
  /** Bucket path → ETag (the MD5 of a single-part upload). */
  remoteEtags: ReadonlyMap<string, string>;
  hasTake(key: string): boolean;
}

export interface SkippedClips {
  /** No clip on this PC. */
  missing: number;
  /** Not in the bucket, or the bucket has another take: upload first. */
  notUploaded: number;
  /** Whole lines with such a part. */
  lines: number;
}

function withoutSortFields(listed: SnapshotItem & { rank: number; text: string }): SnapshotItem {
  const item: SnapshotItem & { rank?: number; text?: string } = { ...listed };
  delete item.rank;
  delete item.text;
  return item;
}

export function buildSnapshot(sources: SnapshotSources): { snapshot: Snapshot; skipped: SkippedClips } {
  const { catalog, inspect, objectPath, remoteEtags, hasTake } = sources;
  const cache = new Map<string, ReturnType<SnapshotSources['inspect']>>();
  /** Each clip file is read once, however many lines it is part of. */
  const look = (voice: LinePart['voice'], key: string) => {
    const path = objectPath(voice, key);
    if (!cache.has(path)) cache.set(path, inspect(voice, key));
    const local = cache.get(path) ?? null;
    return { local, url: local && remoteEtags.get(path) === local.md5 ? `${path}?fp=${local.fp}` : null };
  };

  const skipped = { missing: 0, notUploaded: 0, lines: 0 };
  const listed: (SnapshotItem & { rank: number; text: string })[] = [];
  for (const phrase of catalog.phrases) {
    const { local, url } = look('he', phrase.key);
    if (!local || !url) {
      skipped[local ? 'notUploaded' : 'missing'] += 1;
      continue;
    }
    const { spoken, group, where, rank, lines } = catalog.describe(phrase);
    const { gender, text: plain } = parseListenerGender(phrase.text);
    const heardIn = lines?.flatMap((line) => {
      const urls = line.parts.map((part) => look(part.voice, part.key).url);
      if (urls.every((partUrl): partUrl is string => partUrl !== null)) return [{ spoken: line.spoken, listener: line.listener, parts: urls }];
      skipped.lines += 1;
      return [];
    });
    listed.push({
      key: phrase.key,
      spoken,
      ...(plain !== spoken && { plain }),
      ...(gender && { gender }),
      speed: phrase.speed,
      group,
      where,
      fp: local.fp,
      path: url,
      hasTake: hasTake(phrase.key),
      ...(heardIn && { lines: heardIn }),
      rank,
      text: phrase.text,
    });
  }

  const snapshot: Snapshot = {
    version: 1,
    generatedAt: new Date().toISOString(),
    clipBaseUrl: sources.clipBaseUrl.replace(/\/+$/, ''),
    groups: [...REVIEW_GROUPS, 'opener'],
    reasons: REVIEW_REASONS,
    maxNote: MAX_NOTE_LENGTH,
    items: listed.sort(byWalkOrder).map(withoutSortFields),
  };
  return { snapshot, skipped };
}
