import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MissionNode } from '../../data/curriculum';
import { TEST_THEME } from '../../test/fixtures';
import { HomeHero } from './HomeHero';

const art = vi.hoisted(() => ({ status: 'loaded' as 'loaded' | 'error' | 'loading' }));
vi.mock('../../hooks/useArtStatus', () => ({ useArtStatus: () => art.status }));
vi.mock('../companion/Companion', () => ({ Companion: ({ size }: { size: number }) => <span>{`companion:${size}`}</span> }));

const MISSION = { unitNumber: 2, missionNumber: 3, titleHe: 'משימה לבדיקה', titleEn: 'A test mission', estimatedMinutes: 6 } as unknown as MissionNode;
const onPlay = vi.fn();

function setup(props: { gender?: 'girl' | 'boy'; bossGate?: { missing: number } | null } = {}) {
  render(
    <HomeHero
      theme={TEST_THEME}
      gender={props.gender ?? 'girl'}
      greetingHe="היי נועה!"
      mission={MISSION}
      bossGate={(props.bossGate ?? null) as never}
      xpReward={40}
      diamondReward={5}
      onPlay={onPlay}
    />
  );
  return userEvent.setup();
}

function stubMatchMedia(isWide: boolean) {
  const listeners: (() => void)[] = [];
  const query = {
    matches: isWide,
    addEventListener: (_: string, fn: () => void) => listeners.push(fn),
    removeEventListener: vi.fn(),
  };
  window.matchMedia = vi.fn(() => query) as never;
  return { query, fire: () => listeners.forEach((fn) => fn()) };
}

beforeEach(() => {
  art.status = 'loaded';
  onPlay.mockClear();
  stubMatchMedia(false);
});

describe('HomeHero', () => {
  it('shows the greeting, today’s mission with its reward and plays it', async () => {
    const user = setup();
    expect(screen.getByText('היי נועה!')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'משימה לבדיקה' })).toBeInTheDocument();
    expect(screen.getByText('Mission 2.3: A test mission')).toBeInTheDocument();
    expect(screen.getByText(/6 דק׳/)).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('shows the home picture once it has loaded', () => {
    setup();
    expect(document.querySelector('img[aria-hidden="true"]')).not.toBeNull();
  });

  it('falls back to the card gradient without the picture', () => {
    art.status = 'error';
    setup();
    expect(document.querySelector('img[aria-hidden="true"]')).toBeNull();
  });

  it('asks to improve the mission that opens the boss, in the learner’s gender', () => {
    setup({ bossGate: { missing: 2 }, gender: 'boy' });
    expect(screen.getByText(/שפר את המשימה הזו · עוד 2/)).toBeInTheDocument();
  });

  it('shows no boss note otherwise', () => {
    setup();
    expect(screen.queryByText(/לפתיחת משימת הבוס/)).not.toBeInTheDocument();
  });

  it('draws a bigger companion on a wide screen and follows a size change', () => {
    const media = stubMatchMedia(true);
    setup();
    expect(screen.getByText('companion:156')).toBeInTheDocument();
    media.query.matches = false;
    media.fire();
  });

  it('uses the phone size on a narrow screen', () => {
    setup();
    expect(screen.getByText('companion:108')).toBeInTheDocument();
  });
});
