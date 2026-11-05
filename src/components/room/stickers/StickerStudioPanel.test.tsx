import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STICKER_PASS_ID } from '../../../data/stickers';
import { makeProfile, TEST_THEME } from '../../../test/fixtures';
import type { LearnerProfile } from '../../../types/learner';
import { StickerStudioPanel } from './StickerStudioPanel';

const deleteStickerImage = vi.hoisted(() => vi.fn());
vi.mock('../../../services/stickerImages', () => ({ deleteStickerImage }));
vi.mock('../../../hooks/useStickerImages', () => ({ useStickerImages: () => undefined }));
vi.mock('../ItemIcon', () => ({ ItemIcon: () => <span>icon</span> }));
vi.mock('./StickerDrawPanel', () => ({
  StickerDrawPanel: (p: { onDone: () => void }) => (
    <button type="button" onClick={p.onDone}>
      draw-done
    </button>
  ),
}));

const onUpdateProfile = vi.fn();
const onPlaceSticker = vi.fn();
const onOpenShop = vi.fn();
const onClose = vi.fn();

const DRAWN = { id: 'drawn-1', nameEn: 'happy sun', createdAt: '2026-11-01T00:00:00.000Z' };

function profileWith(extra: Partial<LearnerProfile> = {}, room: Record<string, unknown> = {}) {
  return makeProfile({
    unlockedRewardIds: ['room-star'],
    room: { placements: {}, namedItemIds: [], updatedAt: '', ...room },
    ...extra,
  } as Partial<LearnerProfile>);
}

function setup(profile: LearnerProfile = profileWith()) {
  render(
    <StickerStudioPanel
      profile={profile}
      theme={TEST_THEME}
      onUpdateProfile={onUpdateProfile}
      onSpeakEnglish={vi.fn()}
      onPlaceSticker={onPlaceSticker}
      onOpenShop={onOpenShop}
      onClose={onClose}
    />
  );
  return userEvent.setup();
}

const lastUpdate = (): LearnerProfile => onUpdateProfile.mock.calls[onUpdateProfile.mock.calls.length - 1][0];

beforeEach(() => {
  [onUpdateProfile, onPlaceSticker, onOpenShop, onClose, deleteStickerImage].forEach((fn) => fn.mockReset());
  deleteStickerImage.mockResolvedValue(undefined);
});

describe('StickerStudioPanel', () => {
  it('says there are no stickers yet for an empty album', () => {
    setup(makeProfile({}));
    expect(screen.getByText(/עוד אין מדבקות/)).toBeInTheDocument();
  });

  it('shows the album and starts placing a sticker on the board', async () => {
    const user = setup();
    expect(screen.getByText('כוכב')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ללוח/ }));
    expect(onPlaceSticker).toHaveBeenCalledWith('room-star');
  });

  it('marks a sticker that is already on the board', () => {
    setup(profileWith({}, { placements: { board1: 'room-star' } }));
    expect(screen.getByRole('button', { name: /על הלוח/ })).toBeInTheDocument();
  });

  it('makes a sticker the app background and removes it again', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /רקע/ }));
    expect(lastUpdate().room?.backgroundStickerId).toBe('room-star');
  });

  it('offers to remove the background that is showing', async () => {
    const user = setup(profileWith({}, { backgroundStickerId: 'room-star' }));
    expect(screen.getByRole('button', { name: /✓ רקע|רקע/, pressed: true })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'הסרת הרקע' }));
    expect(lastUpdate().room?.backgroundStickerId ?? null).toBeNull();
  });

  it('points to the shop when the sticker pass is missing', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /לחנות/ }));
    expect(onOpenShop).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: /ציור מדבקה חדשה/ })).not.toBeInTheDocument();
  });

  it('opens the drawing panel with the pass and comes back to the album', async () => {
    const user = setup(profileWith({ unlockedRewardIds: ['room-star', STICKER_PASS_ID] }));
    await user.click(screen.getByRole('button', { name: /ציור מדבקה חדשה \(0\/12\)/ }));
    await user.click(screen.getByRole('button', { name: 'draw-done' }));
    expect(screen.getByRole('button', { name: /ציור מדבקה חדשה/ })).toBeInTheDocument();
  });

  it('asks before deleting a drawing, then deletes it and its picture', async () => {
    const user = setup(profileWith({ unlockedRewardIds: [STICKER_PASS_ID] }, { drawnStickers: [DRAWN] }));
    await user.click(screen.getByRole('button', { name: 'מחיקת happy sun' }));
    await user.click(screen.getByRole('button', { name: 'למחוק?' }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(deleteStickerImage).toHaveBeenCalledWith('drawn-1');
  });

  it('forgets the delete confirmation when focus leaves it', async () => {
    const user = setup(profileWith({ unlockedRewardIds: [STICKER_PASS_ID] }, { drawnStickers: [DRAWN] }));
    await user.click(screen.getByRole('button', { name: 'מחיקת happy sun' }));
    screen.getByRole('button', { name: 'למחוק?' }).focus();
    await user.tab();
    expect(screen.queryByRole('button', { name: 'למחוק?' })).not.toBeInTheDocument();
  });

  it('still deletes when removing the picture fails', async () => {
    deleteStickerImage.mockRejectedValue({ code: 'unavailable' });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const user = setup(profileWith({ unlockedRewardIds: [STICKER_PASS_ID] }, { drawnStickers: [DRAWN] }));
    await user.click(screen.getByRole('button', { name: 'מחיקת happy sun' }));
    await user.click(screen.getByRole('button', { name: 'למחוק?' }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
  });

  it('closes through the panel frame', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'חזרה לחדר' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
