import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRoom } from '../../data/room';
import { getPlacedRoomEntries } from '../../data/roomPlacement';
import { makeProfile } from '../../test/fixtures';
import { AVATAR_HOME } from './roomLayout';
import { RoomScene } from './RoomScene';

const travelProfile = () => makeProfile({ themeId: 'travel-journal' });

function renderScene(profile: ReturnType<typeof makeProfile>, moveRequestKey: string | null = null) {
  return render(
    <RoomScene
      themeId="travel-journal"
      avatarEmoji="🐶"
      entries={getPlacedRoomEntries(profile)}
      avatarPos={AVATAR_HOME}
      moveRequestKey={moveRequestKey}
      onTapEntry={() => undefined}
      onMoveEntry={() => undefined}
    />
  );
}

describe('RoomScene moving the games book', () => {
  it('shows both the floor and the desk top as places for the book', () => {
    const { container } = renderScene(travelProfile(), 'object:games-book');
    expect(container.querySelectorAll('[data-zone]')).toHaveLength(2);
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
