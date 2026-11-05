import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LearnerProfile } from '../types/learner';

const mocks = vi.hoisted(() => ({
  clearStickerImages: vi.fn(),
  setStickerOwner: vi.fn(),
  unwatch: vi.fn(),
  watchStickerImages: vi.fn(),
  removeStickerImages: vi.fn(),
  migrateLegacyStickerImages: vi.fn(),
  legacy: {} as Record<string, string>,
}));

vi.mock('../data/stickerImageStore', () => ({ clearStickerImages: mocks.clearStickerImages }));
vi.mock('../data/stickers', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../data/stickers')>()),
  getLegacyStickerImages: () => mocks.legacy,
}));
vi.mock('../services/stickerImages', () => ({
  migrateLegacyStickerImages: mocks.migrateLegacyStickerImages,
  removeStickerImages: mocks.removeStickerImages,
  setStickerOwner: mocks.setStickerOwner,
  watchStickerImages: mocks.watchStickerImages,
}));

const { useStickerImageSync } = await import('./useStickerImageSync');

function profileWith(stickers: Array<Record<string, unknown>> | undefined): LearnerProfile {
  return { room: stickers ? { drawnStickers: stickers } : undefined } as unknown as LearnerProfile;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.legacy = {};
  mocks.watchStickerImages.mockReturnValue(mocks.unwatch);
  mocks.removeStickerImages.mockResolvedValue(undefined);
  mocks.migrateLegacyStickerImages.mockResolvedValue([]);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

describe('useStickerImageSync', () => {
  it('clears the pictures while the cloud profile has not loaded or nobody is signed in', () => {
    renderHook(() =>
      useStickerImageSync({ uid: 'u1', isReady: false, profile: profileWith([]), getLatestProfile: vi.fn(), onUpdateProfile: vi.fn() })
    );
    expect(mocks.clearStickerImages).toHaveBeenCalled();
    expect(mocks.watchStickerImages).not.toHaveBeenCalled();
  });

  it('follows the pictures for the account, reports a failing watch, and stops on unmount', () => {
    const { unmount } = renderHook(() =>
      useStickerImageSync({ uid: 'u1', isReady: true, profile: profileWith([]), getLatestProfile: vi.fn(), onUpdateProfile: vi.fn() })
    );
    expect(mocks.setStickerOwner).toHaveBeenCalledWith('u1');
    const onError = mocks.watchStickerImages.mock.calls[0][1] as (e: unknown) => void;
    onError({ code: 'permission-denied' });
    expect(console.warn).toHaveBeenCalledWith('Following sticker pictures failed:', 'permission-denied');
    unmount();
    expect(mocks.unwatch).toHaveBeenCalled();
    expect(mocks.setStickerOwner).toHaveBeenLastCalledWith(undefined);
  });

  it('deletes the pictures of archived stickers and warns when that fails', async () => {
    mocks.removeStickerImages.mockRejectedValueOnce(new Error('offline'));
    const profile = profileWith([{ id: 'a', archivedAt: '2026-01-01' }, { id: 'b' }]);
    renderHook(() => useStickerImageSync({ uid: 'u1', isReady: true, profile, getLatestProfile: vi.fn(), onUpdateProfile: vi.fn() }));
    expect(mocks.removeStickerImages).toHaveBeenCalledWith(['a']);
    await flush();
    expect(console.warn).toHaveBeenCalledWith('Deleting sticker pictures failed:', expect.any(Error));
  });

  it('moves pictures still inline in the profile out of it', async () => {
    mocks.legacy = { a: 'data:a' };
    mocks.migrateLegacyStickerImages.mockResolvedValue(['a']);
    const latest = profileWith([{ id: 'a', imageDataUrl: 'data:a', createdAt: 5 }, { id: 'b', imageDataUrl: 'data:b' }]);
    const onUpdateProfile = vi.fn();
    renderHook(() =>
      useStickerImageSync({ uid: 'u1', isReady: true, profile: latest, getLatestProfile: () => latest, onUpdateProfile })
    );
    expect(mocks.migrateLegacyStickerImages).toHaveBeenCalledWith('u1', { a: 'data:a' }, { a: 5, b: undefined });
    await flush();
    const updated = onUpdateProfile.mock.calls[0][0] as LearnerProfile;
    expect(updated.room?.drawnStickers?.[0]).not.toHaveProperty('imageDataUrl');
    expect(updated.room?.drawnStickers?.[1]).toHaveProperty('imageDataUrl', 'data:b');
  });

  it('does not update the profile when the latest one has no stickers left', async () => {
    mocks.legacy = { a: 'data:a' };
    mocks.migrateLegacyStickerImages.mockResolvedValue(['a']);
    const onUpdateProfile = vi.fn();
    renderHook(() =>
      useStickerImageSync({
        uid: 'u1',
        isReady: true,
        profile: profileWith([{ id: 'a' }]),
        getLatestProfile: () => profileWith(undefined),
        onUpdateProfile,
      })
    );
    await flush();
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('warns and lets the move be retried when it fails', async () => {
    mocks.legacy = { a: 'data:a' };
    mocks.migrateLegacyStickerImages.mockRejectedValueOnce(new Error('offline'));
    const profile = profileWith([{ id: 'a' }]);
    const props = { uid: 'u1', isReady: true, profile, getLatestProfile: () => profile, onUpdateProfile: vi.fn() };
    const { rerender } = renderHook((p) => useStickerImageSync(p), { initialProps: props });
    await flush();
    expect(console.warn).toHaveBeenCalledWith('Moving sticker pictures failed:', expect.any(Error));
    rerender({ ...props, profile: profileWith([{ id: 'a' }]) });
    expect(mocks.migrateLegacyStickerImages).toHaveBeenCalledTimes(2);
  });
});
