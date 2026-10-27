import { ParentLink } from '../../data/parentLink';

/**
 * What the learner has already been told about their paired parents, on this device only. A parent
 * who joined, or who reset the PIN, shows once as a notice until the learner closes it.
 */
export interface SeenParents {
  /** Parents already announced */
  linked: string[];
  /** The latest PIN reset time announced, per parent */
  resets: Record<string, string>;
}

export interface ParentNotice {
  kind: 'linked' | 'pin-reset';
  link: ParentLink;
}

const keyFor = (uid: string) => `english_tutor_parent_notices_seen_${uid}`;
const EMPTY: SeenParents = { linked: [], resets: {} };

export function readSeenParents(uid: string): SeenParents {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(keyFor(uid)) ?? 'null') as Partial<SeenParents> | null;
    return { linked: parsed?.linked ?? [], resets: parsed?.resets ?? {} };
  } catch {
    return EMPTY;
  }
}

function writeSeenParents(uid: string, seen: SeenParents): void {
  try {
    window.localStorage.setItem(keyFor(uid), JSON.stringify(seen));
  } catch {
    // Storage blocked (private mode): the notice may show again next visit, which is harmless
  }
}

/** One notice per parent: a new PIN reset first, else a parent who has not been announced yet. */
export function findParentNotices(links: readonly ParentLink[], seen: SeenParents): ParentNotice[] {
  return links.flatMap((link): ParentNotice[] => {
    if (link.pinResetAt && link.pinResetAt !== seen.resets[link.parentUid]) return [{ kind: 'pin-reset', link }];
    if (!seen.linked.includes(link.parentUid)) return [{ kind: 'linked', link }];
    return [];
  });
}

/** Marks the parent's join and latest reset as seen. */
export function markParentNoticeSeen(uid: string, link: ParentLink): void {
  const seen = readSeenParents(uid);
  writeSeenParents(uid, {
    linked: seen.linked.includes(link.parentUid) ? seen.linked : [...seen.linked, link.parentUid],
    resets: link.pinResetAt ? { ...seen.resets, [link.parentUid]: link.pinResetAt } : seen.resets,
  });
}
