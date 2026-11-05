import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CurriculumUnit, MissionNode } from '../data/curriculum';
import { loadGradeCurriculum } from '../data/curriculum/loader';
import { TEST_THEME } from '../test/fixtures';
import { MissionMap } from './MissionMap';

const proState = vi.hoisted(() => ({ isPro: false, isGatingOn: false }));
const openProUpsell = vi.hoisted(() => vi.fn());
vi.mock('../hooks/useProAccess', () => ({ useProAccess: () => ({ ...proState }) }));
vi.mock('./pro/proUpsellContext', () => ({ useOpenProUpsell: () => openProUpsell }));

let units: CurriculumUnit[] = [];
const onStartMission = vi.fn();
const scrollTo = vi.fn();

beforeAll(async () => {
  units = (await loadGradeCurriculum('grade-3')).units.slice(0, 1);
});

beforeEach(() => {
  proState.isPro = false;
  proState.isGatingOn = false;
  onStartMission.mockClear();
  openProUpsell.mockClear();
  scrollTo.mockClear();
  Element.prototype.scrollTo = scrollTo as never;
});

function setup(progress: Record<string, number> = {}, extra: { focusRequest?: { missionId: string; requestId: number } } = {}) {
  const view = render(
    <MissionMap
      units={units}
      missionProgress={progress}
      selectedTier="explorer"
      theme={TEST_THEME}
      gender="girl"
      onStartMission={onStartMission}
      onSpeakEnglish={vi.fn()}
      focusRequest={extra.focusRequest ?? null}
    />
  );
  return { ...view, user: userEvent.setup() };
}

const firstMission = (): MissionNode => units[0].missions[0];

describe('MissionMap', () => {
  it('shows the map with a stop for the first mission, marked as next', () => {
    setup();
    expect(screen.getByRole('region', { name: 'מפת העולם והמשימות' })).toBeInTheDocument();
    const stop = screen.getByRole('button', { name: new RegExp(`משימה 1.1.*המשימה הבאה`) });
    expect(stop).toBeInTheDocument();
  });

  it('scrolls the map to the current mission on open and on the locate button', async () => {
    const { user } = setup();
    expect(scrollTo).toHaveBeenCalled();
    scrollTo.mockClear();
    await user.click(screen.getByRole('button', { name: /למשימה הבאה/ }));
    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('opens a mission sheet from a stop and starts the mission', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /משימה 1.1.*המשימה הבאה/ }));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: /התחילי את המשימה/ }));
    expect(onStartMission).toHaveBeenCalledWith(expect.objectContaining({ id: firstMission().id }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the sheet again', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /משימה 1.1.*המשימה הבאה/ }));
    await user.click(await screen.findByRole('button', { name: 'סגירה' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows earned stars on a finished mission', () => {
    setup({ [firstMission().id]: 3 });
    expect(screen.getByRole('button', { name: /משימה 1.1.*3 מתוך 3 כוכבים/ })).toBeInTheDocument();
  });

  it('scrolls to the mission a new-pack card asked for', () => {
    setup({}, { focusRequest: { missionId: firstMission().id, requestId: 1 } });
    expect(scrollTo).toHaveBeenCalled();
  });
});
