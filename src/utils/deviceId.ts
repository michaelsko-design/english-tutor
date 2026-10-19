/**
 * A random id for this browser, kept in localStorage, that names this device's entry in the
 * diamond ledger (data/diamondLedger.ts). Without storage it lasts for the visit.
 */

const DEVICE_ID_KEY = 'english_tutor_device_id';

let memoryId: string | null = null;

function createId(): string {
  return `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}

export function getDeviceId(): string {
  try {
    const stored = localStorage.getItem(DEVICE_ID_KEY);
    if (stored) return stored;
    const id = memoryId ?? createId();
    localStorage.setItem(DEVICE_ID_KEY, id);
    memoryId = id;
    return id;
  } catch {
    memoryId = memoryId ?? createId();
    return memoryId;
  }
}
