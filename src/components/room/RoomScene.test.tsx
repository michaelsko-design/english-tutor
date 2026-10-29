import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRoom } from '../../data/room';
import { getPlacedRoomEntries, placeRoomItemAt, toggleRoomItemFlip } from '../../data/roomPlacement';
import { makeProfile } from '../../test/fixtures';
import { AVATAR_HOME } from './roomLayout';
import { RoomScene } from './RoomScene';

const NOW = new Date('2026-10-29T10:00:00.000Z');

const profileWithSofa = () =>
  placeRoomItemAt(
    makeProfile({ unlockedRewardIds: ['room-sofa'], room: { ...getRoom(makeProfile()), placements: {} } }),
    'room-sofa',
    { x: 40, y: 85 },
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

/** The element that mirrors the item's picture: the first child of the item button's picture box. */
function mirrorOf(name: string): HTMLElement | null {
  const button = screen.getByRole('button', { name });
  return button.querySelector<HTMLElement>('[style*="scaleX"]');
}

describe('RoomScene turned items', () => {
  it('draws a turned sofa mirrored and an untouched one as it is', () => {
    const profile = profileWithSofa();
    const { unmount } = renderScene(profile);
    expect(mirrorOf('sofa · ספה')).toBeNull();
    unmount();

    renderScene(toggleRoomItemFlip(profile, 'room-sofa', NOW));
    expect(mirrorOf('sofa · ספה')).not.toBeNull();
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
