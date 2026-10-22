/**
 * Content packs whose home card this device has closed or opened, so the card shows once.
 * Device only, not synced: on another device the card simply shows once more.
 */
const STORAGE_KEY = 'english_tutor_seen_packs_v1';
/** Far more than the packs that will ever ship */
const MAX_REMEMBERED = 50;

export function readSeenPacks(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberSeenPack(packId: string): void {
  try {
    const seen = readSeenPacks().filter((id) => id !== packId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, packId].slice(-MAX_REMEMBERED)));
  } catch {
    // Storage blocked (private mode): the card may show again next visit, which is harmless
  }
}
