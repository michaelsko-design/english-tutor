import { isValidStickerImage } from './stickerImageRules';

/**
 * The pictures of drawn stickers, by sticker id. The profile only keeps ids and names; the
 * pictures live in `learners/{uid}/stickers/{id}` (services/stickerImages.ts) and are mirrored
 * here, and to localStorage so guests and offline starts still show them.
 */

export const STICKER_IMAGES_STORAGE_KEY = 'english_tutor_sticker_images';

type Listener = () => void;

let images: Readonly<Record<string, string>> = readMirror();
const listeners = new Set<Listener>();

function readMirror(): Record<string, string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STICKER_IMAGES_STORAGE_KEY) || '{}');
    if (!parsed || typeof parsed !== 'object') return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string' && isValidStickerImage(entry[1])
      )
    );
  } catch {
    return {};
  }
}

function setImages(next: Record<string, string>): void {
  images = next;
  try {
    localStorage.setItem(STICKER_IMAGES_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full or unavailable: the pictures still work for this session
  }
  listeners.forEach((listener) => listener());
}

export function subscribeStickerImages(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The same object until a picture changes, so it works with useSyncExternalStore. */
export function getStickerImages(): Readonly<Record<string, string>> {
  return images;
}

export function getStickerImage(stickerId: string): string | undefined {
  return images[stickerId];
}

/** Puts pictures in the store (ignoring invalid ones). */
export function rememberStickerImages(entries: Readonly<Record<string, string>>): void {
  const valid = Object.entries(entries).filter(([id, url]) => isValidStickerImage(url) && images[id] !== url);
  if (valid.length > 0) setImages({ ...images, ...Object.fromEntries(valid) });
}

export function forgetStickerImages(stickerIds: readonly string[]): void {
  const doomed = new Set(stickerIds.filter((id) => id in images));
  if (doomed.size === 0) return;
  setImages(Object.fromEntries(Object.entries(images).filter(([id]) => !doomed.has(id))));
}

/** Clears every picture (signing out, so the next account doesn't see them). */
export function clearStickerImages(): void {
  if (Object.keys(images).length > 0) setImages({});
}
