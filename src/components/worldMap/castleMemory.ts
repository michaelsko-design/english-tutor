/**
 * Which Boss castles this device has already seen open (Feature 26), so the opening animation
 * plays once, when the star gate is first met. Device only, not synced: on another device the
 * castle simply opens once more.
 */
const STORAGE_KEY = 'english_tutor_opened_castles_v1';
/** Enough for every Boss of every grade */
const MAX_REMEMBERED = 100;

function readOpened(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function hasSeenCastleOpen(missionId: string): boolean {
  return readOpened().includes(missionId);
}

export function rememberCastleOpen(missionId: string): void {
  try {
    const opened = readOpened().filter((id) => id !== missionId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...opened, missionId].slice(-MAX_REMEMBERED)));
  } catch {
    // Storage blocked (private mode): the castle may open again next visit, which is harmless
  }
}
