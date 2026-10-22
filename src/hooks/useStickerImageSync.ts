import { useEffect, useRef } from 'react';
import { getLegacyStickerImages, withoutStickerImage } from '../data/stickers';
import { clearStickerImages } from '../data/stickerImageStore';
import { LearnerProfile } from '../types/learner';
import {
  migrateLegacyStickerImages,
  removeStickerImages,
  setStickerOwner,
  watchStickerImages,
} from '../services/stickerImages';

interface StickerImageSyncOptions {
  uid: string | undefined;
  /** The cloud profile has loaded, so pictures may be read and written */
  isReady: boolean;
  profile: LearnerProfile;
  getLatestProfile: () => LearnerProfile;
  onUpdateProfile: (updated: LearnerProfile) => void;
}

function warn(message: string, error: unknown): void {
  console.warn(message, (error as { code?: string })?.code ?? error);
}

/**
 * Keeps the drawn-sticker pictures (learners/{uid}/stickers) in step with the profile: follows
 * them, moves pictures still inline in an older profile out of it, and deletes the pictures of
 * stickers the profile has archived.
 */
export function useStickerImageSync({
  uid,
  isReady,
  profile,
  getLatestProfile,
  onUpdateProfile,
}: StickerImageSyncOptions): void {
  const migratingIdsRef = useRef(new Set<string>());
  const activeUid = isReady ? uid : undefined;

  useEffect(() => {
    if (!activeUid) {
      clearStickerImages();
      return undefined;
    }
    setStickerOwner(activeUid);
    const unwatch = watchStickerImages(activeUid, (error) => warn('Following sticker pictures failed:', error));
    return () => {
      unwatch();
      setStickerOwner(undefined);
    };
  }, [activeUid]);

  const stickers = profile.room?.drawnStickers;
  useEffect(() => {
    if (!activeUid || !stickers) return;

    const archivedIds = stickers.filter((s) => s.archivedAt).map((s) => s.id);
    removeStickerImages(archivedIds).catch((e) => warn('Deleting sticker pictures failed:', e));

    const legacy = Object.fromEntries(
      Object.entries(getLegacyStickerImages(profile)).filter(([id]) => !migratingIdsRef.current.has(id))
    );
    const ids = Object.keys(legacy);
    if (ids.length === 0) return;
    ids.forEach((id) => migratingIdsRef.current.add(id));
    const createdAtById = Object.fromEntries(stickers.map((s) => [s.id, s.createdAt]));
    migrateLegacyStickerImages(activeUid, legacy, createdAtById)
      .then((moved) => {
        const latest = getLatestProfile();
        const room = latest.room;
        if (!room?.drawnStickers) return;
        const movedIds = new Set(moved);
        onUpdateProfile({
          ...latest,
          room: {
            ...room,
            drawnStickers: room.drawnStickers.map((s) => (movedIds.has(s.id) ? withoutStickerImage(s) : s)),
          },
        });
      })
      .catch((e) => {
        ids.forEach((id) => migratingIdsRef.current.delete(id));
        warn('Moving sticker pictures failed:', e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs when the stickers or account change
  }, [activeUid, stickers]);
}
