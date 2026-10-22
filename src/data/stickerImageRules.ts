/** A real 96px drawing is about 4–15 KB; 12 at the cap stay far below Firestore's 1 MiB per doc. */
export const MAX_STICKER_DATA_URL_LENGTH = 30_000;
export const PNG_DATA_URL_PREFIX = 'data:image/png;base64,';

export function isValidStickerImage(dataUrl: string): boolean {
  return dataUrl.startsWith(PNG_DATA_URL_PREFIX) && dataUrl.length <= MAX_STICKER_DATA_URL_LENGTH;
}
