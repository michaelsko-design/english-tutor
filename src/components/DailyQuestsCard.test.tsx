import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDailyQuests } from '../data/rewardShop';
import { TEST_THEME } from '../test/fixtures';
import { toLocalDateStr } from '../utils/dates';
import { DailyQuestsCard } from './DailyQuestsCard';

const onClaimQuest = vi.fn();
const quests = getDailyQuests('girl');
const todayStr = toLocalDateStr(new Date());

const counters = (over: Partial<{ missionsCompletedToday: number; voiceWordsPracticedToday: number; threeStarMissionsToday: number }> = {}) => ({
  dateStr: todayStr,
  missionsCompletedToday: 0,
  voiceWordsPracticedToday: 0,
  threeStarMissionsToday: 0,
  ...over,
});

function setup(props: { counters?: ReturnType<typeof counters>; claimed?: string[]; activeDates?: string[]; isShabbatObserver?: boolean; gender?: 'girl' | 'boy' } = {}) {
  render(
    <DailyQuestsCard
      streakDays={3}
      activeDates={props.activeDates ?? []}
      dailyCounters={props.counters ?? counters()}
      claimedQuestIds={props.claimed ?? []}
      gender={props.gender ?? 'girl'}
      theme={TEST_THEME}
      isShabbatObserver={props.isShabbatObserver}
      onClaimQuest={onClaimQuest}
    />
  );
  return userEvent.setup();
}

beforeEach(() => onClaimQuest.mockClear());

describe('DailyQuestsCard', () => {
  it('lists every quest with its progress and the streak', () => {
    setup();
    for (const quest of quests) expect(screen.getByText(quest.titleHe)).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(`^0/${quests[0].targetCount}$`)).length).toBeGreaterThan(0);
    expect(screen.getByText('רצף שבועי (3 ימים)')).toBeInTheDocument();
  });

  it('offers a claim button for a finished quest and claims it', async () => {
    const quest = quests[0];
    const user = setup({ counters: counters({ missionsCompletedToday: quest.targetCount, voiceWordsPracticedToday: 99, threeStarMissionsToday: 99 }) });
    const claim = screen.getAllByRole('button', { name: new RegExp(`\\+${quest.rewardDiamonds}`) })[0];
    await user.click(claim);
    expect(onClaimQuest).toHaveBeenCalledTimes(1);
  });

  it('shows a claimed quest as collected, without a claim button', () => {
    setup({
      counters: counters({ missionsCompletedToday: 99, voiceWordsPracticedToday: 99, threeStarMissionsToday: 99 }),
      claimed: quests.map((q) => q.id),
    });
    expect(screen.getAllByText('נאסף')).toHaveLength(quests.length);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('marks today as a learning day once a mission is done', () => {
    setup({ counters: counters({ missionsCompletedToday: 1 }) });
    expect(screen.getAllByLabelText('יום למידה').length).toBeGreaterThan(0);
  });

  it('protects Friday and Saturday for a Shabbat observer', () => {
    setup({ isShabbatObserver: true });
    expect(screen.getByText('שבת שמורה')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/יום מוגן|יום למידה/).length).toBeGreaterThan(0);
  });

  it('shows no protection for a learner who does not observe Shabbat', () => {
    setup({ isShabbatObserver: false });
    expect(screen.queryByText('שבת שמורה')).not.toBeInTheDocument();
    expect(screen.getByText(/השלימו משימה קצרה מדי יום/)).toBeInTheDocument();
  });
});
