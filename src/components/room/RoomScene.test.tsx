import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRoom } from '../../data/room';
import { getPlacedRoomEntries, placeRoomItemAt, turnRoomItem } from '../../data/roomPlacement';
import { makeProfile } from '../../test/fixtures';
import { AVATAR_HOME } from './roomLayout';
import { RoomScene } from './RoomScene';

const NOW = new Date('2026-10-29T10:00:00.000Z');

/** A room whose furniture is movable (not drawn into the room picture). */
const focusProfile = () => makeProfile({ themeId: 'focus-desk' });

const profileWithSofa = () =>
  placeRoomItemAt(
    makeProfile({ themeId: 'focus-desk', unlockedRewardIds: ['room-sofa'], room: { ...getRoom(makeProfile()), placements: {} } }),
    'room-sofa',
    { x: 75, y: 88 },
    NOW
  );

function renderScene(profile: ReturnType<typeof makeProfile>, moveRequestKey: string | null = null) {
  return render(
    <RoomScene
      themeId="focus-desk"
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
    expect(pictureOf('sofa · ספה')).toBe('/art/room/focus-desk/room-sofa.webp');
    unmount();

    renderScene(turnRoomItem(profile, 'room-sofa', NOW));
    expect(pictureOf('sofa · ספה')).toBe('/art/room/focus-desk/room-sofa-b.webp');
  });
});

describe('RoomScene moving the games book', () => {
  it('shows both the floor and the desk top as places for the book', () => {
    const { container } = renderScene(focusProfile(), 'object:games-book');
    expect(container.querySelectorAll('[data-zone]')).toHaveLength(2);
  });

  it('shows only the floor as a place for the bed', () => {
    const { container } = renderScene(focusProfile(), 'object:bed');
    expect(container.querySelectorAll('[data-zone]')).toHaveLength(1);
  });

  it('outlines a corner room floor along its baseboard, down to the bottom of the picture', () => {
    const { container } = renderScene(focusProfile(), 'object:bed');
    const outline = container.querySelector('[data-zone="floor"] polygon')?.getAttribute('points') ?? '';
    const points = outline.split(' ').map((pair) => pair.split(',').map(Number));
    expect(points.length).toBeGreaterThan(10);
    expect(points[points.length - 1]).toEqual([0, 100]);
    // the baseboard is highest at the corner, so the outline is not a level line
    const ys = points.slice(0, -2).map(([, y]) => y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(5);
  });
});

describe('RoomScene with the furniture drawn into the room picture', () => {
  const starlight = () => makeProfile({ themeId: 'starlight-rpg', room: { ...getRoom(makeProfile()), placements: {} } });

  it('shows tap areas for the drawn bed, wardrobe and desk, and no pictures or move buttons for them', () => {
    const tapped: string[] = [];
    render(
      <RoomScene
        themeId="starlight-rpg"
        avatarEmoji="🐶"
        entries={getPlacedRoomEntries(starlight())}
        avatarPos={AVATAR_HOME}
        onTapEntry={() => undefined}
        onTapFixed={(piece) => tapped.push(piece.id)}
      />
    );
    screen.getByRole('button', { name: 'bed · מיטה' }).click();
    screen.getByRole('button', { name: 'wardrobe · ארון' }).click();
    screen.getByRole('button', { name: 'desk · שולחן' }).click();
    expect(tapped).toEqual(['bed', 'wardrobe', 'desk']);
    expect(document.querySelectorAll('img[src*="object-bed"], img[src*="object-desk"], img[src*="furniture-shelf"]')).toHaveLength(0);
  });

  it('draws no tap areas in the preview picture (no handlers)', () => {
    const { container } = render(
      <RoomScene themeId="starlight-rpg" avatarEmoji="🐶" entries={getPlacedRoomEntries(starlight())} avatarPos={AVATAR_HOME} />
    );
    expect(container.querySelectorAll('[data-fixed]')).toHaveLength(0);
  });
});
