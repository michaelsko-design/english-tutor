import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CURRICULUM_BY_GRADE } from '../../test/curriculum';
import { getMapStopStates, MapStop } from '../../data/worldMap';
import { TEST_THEME } from '../../test/fixtures';
import { MissionSheet } from './MissionSheet';
import { WORLD_MAP_STYLES } from './worldMapStyles';

const [firstUnitStops] = getMapStopStates(CURRICULUM_BY_GRADE['grade-1'].units, {});
const toStop = (index: number): MapStop => ({ state: firstUnitStops[index], position: { x: 0.5, y: 0.5 } });

function renderSheet(stop: MapStop) {
  const handlers = { onStart: vi.fn(), onClose: vi.fn(), onSelectTier: vi.fn() };
  render(
    <MissionSheet
      stop={stop}
      previousTitleHe={firstUnitStops[0].mission.titleHe}
      tier="explorer"
      theme={TEST_THEME}
      style={WORLD_MAP_STYLES['cozy-studio']}
      gender="girl"
      onSpeakEnglish={() => {}}
      {...handlers}
    />
  );
  return handlers;
}

describe('MissionSheet', () => {
  it('an open mission starts from its play button', async () => {
    const user = userEvent.setup();
    const { onStart } = renderSheet(toStop(0));

    expect(screen.getByRole('dialog')).toHaveAccessibleName(/.+/);
    await user.click(screen.getByRole('button', { name: /התחילי את המשימה/ }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('changes the tier from the tier buttons', async () => {
    const user = userEvent.setup();
    const { onSelectTier } = renderSheet(toStop(0));

    await user.click(screen.getByRole('button', { name: /מצוינות והעשרה/ }));

    expect(onSelectTier).toHaveBeenCalledWith('master');
  });

  it('a locked mission explains why and has no play button', () => {
    expect(firstUnitStops[1].status).toBe('locked');
    const { onStart } = renderSheet(toStop(1));

    expect(screen.getByText(/סיימי קודם את המשימה/)).toHaveTextContent(firstUnitStops[0].mission.titleHe);
    expect(screen.queryByRole('button', { name: /התחילי את המשימה/ })).not.toBeInTheDocument();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const { onClose } = renderSheet(toStop(0));

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
