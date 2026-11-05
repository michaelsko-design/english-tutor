import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { LearnerProfile } from '../../types/learner';
import { RoomScreen } from './RoomScreen';

vi.mock('../../utils/motion', () => ({ prefersReducedMotion: () => true }));
vi.mock('../../hooks/useStickerImages', () => ({ useStickerImages: () => undefined }));

const btn = (name: string, onClick?: () => void) => (
  <button type="button" onClick={onClick}>
    {name}
  </button>
);

vi.mock('./RoomScene', () => ({
  RoomScene: (p: {
    entries: { key: string }[];
    bubble: { textEn: string; textHe: string } | null;
    placingKind: string | null;
    onPlaceAt: (pt: { x: number; y: number }) => void;
    onTapEntry: (key: string) => void;
    onMoveEntry: (key: string, pt: { x: number; y: number }) => void;
    onMoveRequestHandled: () => void;
    moveRequestKey: string | null;
    onTapFixed: (piece: unknown) => void;
  }) => (
    <div>
      {p.entries.map((e) => btn(`entry:${e.key}`, () => p.onTapEntry(e.key)))}
      {btn('tap-desk', () => p.onTapFixed({ id: 'desk', standAt: { x: 40, y: 70 }, bubbleAt: { x: 40, y: 50 } }))}
      {btn('tap-bed', () => p.onTapFixed({ id: 'bed', standAt: { x: 20, y: 70 }, bubbleAt: { x: 20, y: 50 } }))}
      {btn('tap-wardrobe', () => p.onTapFixed({ id: 'wardrobe', standAt: { x: 80, y: 70 }, bubbleAt: { x: 80, y: 50 } }))}
      {btn('place-at', () => p.onPlaceAt({ x: 50, y: 80 }))}
      {btn('move-first', () => p.entries[0] && p.onMoveEntry(p.entries[0].key, { x: 30, y: 85 }))}
      {btn('move-handled', p.onMoveRequestHandled)}
      <span>{`placing:${p.placingKind ?? 'none'}`}</span>
      <span>{`move-request:${p.moveRequestKey ?? 'none'}`}</span>
      {p.bubble && <span>{`bubble:${p.bubble.textEn}|${p.bubble.textHe}`}</span>}
    </div>
  ),
}));
vi.mock('./RoomInventory', () => ({
  RoomInventory: (p: { selectedItemId: string | null; onSelectItem: (id: string) => void }) => (
    <div>
      {btn('select-plant', () => p.onSelectItem('room-plant'))}
      <span>{`selected:${p.selectedItemId ?? 'none'}`}</span>
    </div>
  ),
}));
vi.mock('./NameItemPanel', () => ({
  NameItemPanel: (p: { onNamed: () => void; onCancel: () => void }) => (
    <div>
      {btn('name-done', p.onNamed)}
      {btn('name-cancel', p.onCancel)}
    </div>
  ),
}));
const panel = (label: string) => (p: { onClose: () => void }) => (
  <div>
    <span>{`panel:${label}`}</span>
    {btn(`close-${label}`, p.onClose)}
  </div>
);
vi.mock('./WardrobePanel', () => ({ WardrobePanel: (p: { onClose: () => void }) => panel('wardrobe')(p) }));
vi.mock('./DreamJournalPanel', () => ({ DreamJournalPanel: (p: { onClose: () => void }) => panel('journal')(p) }));
vi.mock('./games/GamesBookPanel', () => ({ GamesBookPanel: (p: { onClose: () => void }) => panel('games')(p) }));
vi.mock('./PhonePanel', () => ({ PhonePanel: (p: { onClose: () => void }) => panel('phone')(p) }));
vi.mock('./stickers/StickerStudioPanel', () => ({
  StickerStudioPanel: (p: { onClose: () => void; onPlaceSticker: (id: string) => void; onOpenShop: () => void }) => (
    <div>
      <span>panel:stickers</span>
      {btn('place-sticker', () => p.onPlaceSticker('room-star'))}
      {btn('studio-shop', p.onOpenShop)}
      {btn('close-stickers', p.onClose)}
    </div>
  ),
}));
vi.mock('./StickersLockedSheet', () => ({
  StickersLockedSheet: (p: { onOpenShop: () => void; onClose: () => void }) => (
    <div>
      <span>stickers-locked</span>
      {btn('locked-shop', p.onOpenShop)}
      {btn('locked-close', p.onClose)}
    </div>
  ),
}));

const onUpdateProfile = vi.fn();
const onSpeakEnglish = vi.fn();
const onOpenShop = vi.fn();
const onClose = vi.fn();

const withPlant = (extra: Partial<LearnerProfile> = {}) =>
  makeProfile({
    room: { placements: { k1: 'room-plant' }, positions: { k1: { x: 50, y: 85 } }, namedItemIds: [], updatedAt: '' },
    ...extra,
  } as Partial<LearnerProfile>);

function setup(profile: LearnerProfile = makeProfile({ gender: 'girl' })) {
  render(
    <RoomScreen
      profile={profile}
      theme={TEST_THEME}
      avatarEmoji="🦊"
      onUpdateProfile={onUpdateProfile}
      onSpeakEnglish={onSpeakEnglish}
      onOpenShop={onOpenShop}
      onClose={onClose}
    />
  );
  return userEvent.setup();
}

const click = (user: ReturnType<typeof userEvent.setup>, name: string | RegExp) => user.click(screen.getByRole('button', { name }));

beforeEach(() => {
  [onUpdateProfile, onSpeakEnglish, onOpenShop, onClose].forEach((fn) => fn.mockClear());
  Element.prototype.scrollIntoView = vi.fn();
});

describe('RoomScreen furniture and panels', () => {
  it('opens the wardrobe panel after the avatar walks to it, and closes it', async () => {
    const user = setup();
    await click(user, 'tap-wardrobe');
    expect(await screen.findByText('panel:wardrobe')).toBeInTheDocument();
    expect(screen.getByText(/bubble:wardrobe/)).toBeInTheDocument();
    await click(user, 'close-wardrobe');
    expect(screen.queryByText('panel:wardrobe')).not.toBeInTheDocument();
  });

  it('opens the dream journal from the bed', async () => {
    const user = setup();
    await click(user, 'tap-bed');
    expect(await screen.findByText('panel:journal')).toBeInTheDocument();
  });

  it('shows the desk name without a panel', async () => {
    const user = setup();
    await click(user, 'tap-desk');
    expect(await screen.findByText('bubble:desk|שולחן')).toBeInTheDocument();
  });

  it('opens the phone and games panels from their room objects', async () => {
    const user = setup();
    await click(user, 'entry:object:phone');
    expect(await screen.findByText('panel:phone')).toBeInTheDocument();
    await click(user, 'entry:object:games-book');
    expect(await screen.findByText('panel:games')).toBeInTheDocument();
  });
});

describe('RoomScreen placing and naming items', () => {
  it('selects an inventory item, names it at the chosen spot and places it', async () => {
    const user = setup();
    await click(user, 'select-plant');
    expect(screen.getByText(/עציץ — בחרי מקום מהבהב/)).toBeInTheDocument();
    expect(screen.getByText('placing:floor')).toBeInTheDocument();
    await click(user, 'place-at');
    await screen.findByRole('button', { name: 'name-done' });
    await click(user, 'name-done');
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent(/plant בחדר!/);
  });

  it('uses masculine copy for a boy and deselects on a second tap', async () => {
    const user = setup(makeProfile({ gender: 'boy' }));
    await click(user, 'select-plant');
    expect(screen.getByText(/עציץ — בחר מקום מהבהב/)).toBeInTheDocument();
    await click(user, 'select-plant');
    expect(screen.getByText('selected:none')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('cancels naming and returns to the inventory', async () => {
    const user = setup();
    await click(user, 'select-plant');
    await click(user, 'place-at');
    await user.click(await screen.findByRole('button', { name: 'name-cancel' }));
    expect(screen.getByRole('button', { name: 'select-plant' })).toBeInTheDocument();
  });

  it('does nothing when a spot is tapped with no item chosen', async () => {
    const user = setup();
    await click(user, 'place-at');
    expect(screen.queryByRole('button', { name: 'name-done' })).not.toBeInTheDocument();
  });
});

describe('RoomScreen placed items', () => {
  it('reads a placed item aloud and shows its name bubble, then offers move and remove', async () => {
    const user = setup(withPlant());
    await click(user, 'entry:k1');
    expect(await screen.findByText(/bubble:plant\|עציץ/)).toBeInTheDocument();
    expect(onSpeakEnglish).toHaveBeenCalledWith('plant', 0.9);
    expect(screen.getByRole('button', { name: /הזזה \(plant\)/ })).toBeInTheDocument();
  });

  it('starts a keyboard move and hands the request back when it is done', async () => {
    const user = setup(withPlant());
    await click(user, 'entry:k1');
    await user.click(await screen.findByRole('button', { name: /הזזה/ }));
    expect(screen.getByText('move-request:k1')).toBeInTheDocument();
    await click(user, 'move-handled');
    expect(screen.getByText('move-request:none')).toBeInTheDocument();
  });

  it('returns a placed item to the box', async () => {
    const user = setup(withPlant());
    await click(user, 'entry:k1');
    await user.click(await screen.findByRole('button', { name: /החזרה לארגז/ }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(onUpdateProfile.mock.calls[0][0].room.placements).toEqual({});
    expect(screen.getByRole('status')).toHaveTextContent('חזר לארגז הפריטים');
  });

  it('moves an item by dragging it and says so', async () => {
    const user = setup(withPlant());
    await click(user, 'move-first');
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('הוזז');
  });
});

describe('RoomScreen stickers and the shop', () => {
  it('explains that stickers are locked while the album is empty, and goes to the shop', async () => {
    const user = setup();
    await click(user, /מדבקות/);
    expect(screen.getByText('stickers-locked')).toBeInTheDocument();
    await click(user, 'locked-shop');
    expect(onOpenShop).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('stickers-locked')).not.toBeInTheDocument();
  });

  it('closes the locked-stickers hint', async () => {
    const user = setup();
    await click(user, /מדבקות/);
    await click(user, 'locked-close');
    expect(screen.queryByText('stickers-locked')).not.toBeInTheDocument();
  });

  it('opens the sticker studio when the album has stickers and places one from it', async () => {
    const user = setup(makeProfile({ unlockedRewardIds: ['room-star'] }));
    await click(user, /מדבקות/);
    expect(screen.getByText('panel:stickers')).toBeInTheDocument();
    await click(user, 'place-sticker');
    expect(screen.queryByText('panel:stickers')).not.toBeInTheDocument();
    expect(screen.getByText('selected:room-star')).toBeInTheDocument();
  });

  it('opens the shop for a new avatar and passes the close through', async () => {
    const user = setup();
    await click(user, 'החלפת אווטאר');
    expect(onOpenShop).toHaveBeenCalledTimes(1);
  });
});
