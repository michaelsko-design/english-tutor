import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { isValidStickerImage } from '../data/stickerImageRules';
import {
  forgetStickerImages,
  getStickerImages,
  rememberStickerImages,
} from '../data/stickerImageStore';

/**
 * Firestore side of the drawn-sticker pictures: `learners/{uid}/stickers/{id}` holds
 * `{ imageDataUrl, createdAt }`, one document per picture, so a picture doesn't travel with every
 * profile save. The in-memory store (data/stickerImageStore.ts) is what the screens read.
 */

const LEARNERS_COLLECTION = 'learners';
const STICKERS_COLLECTION = 'stickers';

/** The signed-in learner whose pictures the app saves (set by App on sign-in and sign-out). */
let ownerUid: string | undefined;

export function setStickerOwner(uid: string | undefined): void {
  ownerUid = uid;
}

function stickersRef(uid: string) {
  return collection(db!, LEARNERS_COLLECTION, uid, STICKERS_COLLECTION);
}

function stickerRef(uid: string, stickerId: string) {
  return doc(db!, LEARNERS_COLLECTION, uid, STICKERS_COLLECTION, stickerId);
}

/** Saves a picture: in the store at once, then in Firestore when signed in. */
export async function saveStickerImage(
  stickerId: string,
  imageDataUrl: string,
  createdAt: string
): Promise<void> {
  rememberStickerImages({ [stickerId]: imageDataUrl });
  if (!ownerUid || !db) return;
  await setDoc(stickerRef(ownerUid, stickerId), { imageDataUrl, createdAt });
}

export async function deleteStickerImage(stickerId: string): Promise<void> {
  forgetStickerImages([stickerId]);
  if (!ownerUid || !db) return;
  await deleteDoc(stickerRef(ownerUid, stickerId));
}

/** Follows the learner's pictures in Firestore and keeps the store in step. */
export function watchStickerImages(uid: string, onError: (error: unknown) => void): () => void {
  if (!db) return () => undefined;
  return onSnapshot(
    stickersRef(uid),
    (snapshot) => {
      const added: Record<string, string> = {};
      const removed: string[] = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          removed.push(change.doc.id);
          return;
        }
        const url: unknown = change.doc.data().imageDataUrl;
        if (typeof url === 'string' && isValidStickerImage(url)) added[change.doc.id] = url;
      });
      rememberStickerImages(added);
      forgetStickerImages(removed);
    },
    onError
  );
}

/** Every picture of the learner, for the data export. */
export async function loadAllStickerImages(uid: string | undefined): Promise<Record<string, string>> {
  const result: Record<string, string> = { ...getStickerImages() };
  if (!uid || !db) return result;
  const snapshot = await getDocs(stickersRef(uid));
  snapshot.docs.forEach((d) => {
    const url: unknown = d.data().imageDataUrl;
    if (typeof url === 'string') result[d.id] = url;
  });
  return result;
}

/** Deletes every picture document of the learner (account deletion). */
export async function deleteAllStickerImages(uid: string): Promise<void> {
  if (!db) return;
  const snapshot = await getDocs(stickersRef(uid));
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
}

/**
 * Removes the pictures of deleted stickers (archived on this or another device, e.g. by a merge
 * that kept only the newest), from the store and from Firestore. Pictures of ids the profile
 * doesn't know yet are left alone: they may belong to a sticker whose profile change hasn't synced.
 */
export async function removeStickerImages(stickerIds: readonly string[]): Promise<void> {
  const present = stickerIds.filter((id) => id in getStickerImages());
  if (present.length === 0) return;
  forgetStickerImages(present);
  if (!ownerUid || !db) return;
  const uid = ownerUid;
  await Promise.all(present.map((id) => deleteDoc(stickerRef(uid, id))));
}

/**
 * Uploads pictures still inline in the profile (saved before the move). Resolves with the ids
 * that are now safe in Firestore, so the caller can strip them from the profile.
 */
export async function migrateLegacyStickerImages(
  uid: string,
  legacy: Readonly<Record<string, string>>,
  createdAtById: Readonly<Record<string, string>>
): Promise<string[]> {
  rememberStickerImages(legacy);
  const done = await Promise.all(
    Object.entries(legacy).map(async ([id, url]) => {
      await setDoc(stickerRef(uid, id), { imageDataUrl: url, createdAt: createdAtById[id] ?? new Date().toISOString() });
      return id;
    })
  );
  return done;
}
