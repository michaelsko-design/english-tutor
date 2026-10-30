import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRoom } from '../../data/room';
import { getPlacedRoomEntries, placeRoomItemAt, turnRoomItem } from '../../data/roomPlacement';
import { makeProfile } from '../../test/fixtures';
import { AVATAR_HOME } from './roomLayout';
import { RoomScene } from './RoomScene';

const NOW = new Date('2026-10-29T10:00:00.000Z');

const profileWithSofa = () =>
  placeRoomItemAt(
    makeProfile({ unlockedRewardIds: ['room-sofa'], room: { ...getRoom(makeProfile()), placements: {} } }),
    'room-sofa',
    { x: 75, y: 88 },
    NOW
  );

function renderScene(profile: ReturnType<typeof makeProfile>, moveRequestKey: string | null = null) {
  return render(
    <RoomScene
      themeId="cozy-studio"
      avatarEmoji="🐶"
      entries={getPlacedRoomEntries(profile)}
      avatarPos={AVATAR_HOME}
      moveRequestKey={moveRequestKey}
      onTapEntry={() => undefined}
      onMoveEntry={() => undefined}
    />
  );
}

/** The picture an item's button shows. */
function pictureOf(name: string): string | null {
  return screen.getByRole('button', { name }).querySelector('img')?.getAttribute('src') ?? null;
}

describe('RoomScene turned items', () => {
  it('shows the right-wall sofa picture, and the left-wall picture once the sofa is turned to the other wall', () => {
    const profile = profileWithSofa();
    const { unmount } = renderScene(profile);
    expect(pictureOf('sofa · ספה')).toBe('/art/room/cozy-studio/room-sofa.webp');
    unmount();

    renderScene(turnRoomItem(profile, 'room-sofa', NOW));
    expect(pictureOf('sofa · ספה')).toBe('/art/room/cozy-studio/room-sofa-b.webp');
  });
});

describe('RoomScene moving the games book', () => {
  it('shows both the floor and the desk top as places for the book', () => {
    const { container } = renderScene(makeProfile(), 'object:games-book');
    expect(container.querySelectorAll('.border-dashed')).toHaveLength(2);
  });

  it('shows only the floor as a place for the bed', () => {
    const { container } = renderScene(makeProfile(), 'object:bed');
    expect(container.querySelectorAll('.border-dashed')).toHaveLength(1);
  });
});
