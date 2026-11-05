import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ContestDoc, ContestResult } from '../../data/contests';
import { TEST_THEME } from '../../test/fixtures';
import { ContestPanel } from './ContestPanel';

const NOW = new Date('2026-11-05T12:00:00.000Z');
const ME = 'me';
const FRIEND = 'friend';
const FUTURE = NOW.getTime() + 3_600_000;
const PAST = NOW.getTime() - 3_600_000;

const result = (correctCount: number, timeMs = 60_000): ContestResult => ({
  correctCount,
  totalCount: 10,
  timeMs,
  finishedAt: '2026-11-05T10:00:00.000Z',
});

const makeContest = (overrides: Partial<ContestDoc> = {}): ContestDoc => ({
  id: 'c1',
  uids: [ME, FRIEND],
  createdBy: ME,
  creatorName: 'נועה',
  inviteeName: 'דנה',
  dateStr: '2026-11-05',
  expiresAtMs: FUTURE,
  seed: 1,
  unitNumber: 1,
  status: 'invited',
  createdAt: '2026-11-05T08:00:00.000Z',
  ...overrides,
});

const onInvite = vi.fn();
const onRespond = vi.fn();
const onPlay = vi.fn();

function setup(contest: ContestDoc | undefined, extra: { record?: { wins: number; losses: number; ties: number }; diamondsEarned?: number; gender?: 'girl' | 'boy'; isBusy?: boolean } = {}) {
  render(
    <ContestPanel
      contest={contest}
      myUid={ME}
      friendName="דנה"
      record={extra.record ?? { wins: 0, losses: 0, ties: 0 }}
      diamondsEarned={extra.diamondsEarned}
      gender={extra.gender ?? 'girl'}
      theme={TEST_THEME}
      now={NOW}
      isBusy={extra.isBusy ?? false}
      onInvite={onInvite}
      onRespond={onRespond}
      onPlay={onPlay}
    />
  );
  return userEvent.setup();
}

beforeEach(() => {
  onInvite.mockClear();
  onRespond.mockClear();
  onPlay.mockClear();
});

describe('ContestPanel', () => {
  it('invites to a contest when there is none today', async () => {
    const user = setup(undefined);
    await user.click(screen.getByRole('button', { name: 'הזמיני לאתגר יומי' }));
    expect(onInvite).toHaveBeenCalledTimes(1);
  });

  it('uses masculine copy and disables the invite while busy', () => {
    setup(undefined, { gender: 'boy', isBusy: true });
    expect(screen.getByRole('button', { name: 'הזמן לאתגר יומי' })).toBeDisabled();
  });

  it('accepts or declines an invitation from the friend', async () => {
    const user = setup(makeContest({ createdBy: FRIEND }));
    expect(screen.getByText(/קיבלת הזמנה לאתגר מדנה/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'קבלי ושחקי' }));
    await user.click(screen.getByRole('button', { name: 'לא היום' }));
    expect(onRespond.mock.calls).toEqual([[true], [false]]);
  });

  it('lets the creator play, noting that the invitation was sent', async () => {
    const user = setup(makeContest());
    expect(screen.getByText(/ההזמנה נשלחה לדנה/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /שחקי עכשיו/ }));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('says the contest was accepted for the creator', () => {
    setup(makeContest({ status: 'accepted' }));
    expect(screen.getByText(/האתגר אושר!/)).toBeInTheDocument();
  });

  it('shows my score while waiting for the friend', () => {
    setup(makeContest({ results: { [ME]: result(7) } }));
    expect(screen.getByText(/התוצאה שלך: 7\/10/)).toBeInTheDocument();
  });

  it('reports a missed and a declined contest', () => {
    setup(makeContest({ expiresAtMs: PAST }));
    expect(screen.getByText(/נגמר לפני ששיחקת/)).toBeInTheDocument();
  });

  it('reports a declined contest', () => {
    setup(makeContest({ status: 'declined' }));
    expect(screen.getByText(/האתגר של היום בוטל/)).toBeInTheDocument();
  });

  it('shows a win with both scores, the diamonds and the record', () => {
    setup(makeContest({ status: 'accepted', results: { [ME]: result(9), [FRIEND]: result(6) } }), {
      diamondsEarned: 5,
      record: { wins: 3, losses: 1, ties: 2 },
    });
    expect(screen.getByText(/^ניצחון!/)).toBeInTheDocument();
    expect(screen.getByText(/את: 90% · דנה: 60% · \+5/)).toBeInTheDocument();
    expect(screen.getByText(/המאזן מול דנה/)).toBeInTheDocument();
  });

  it('shows a loss, a tie and a missed friend', () => {
    setup(makeContest({ status: 'accepted', results: { [ME]: result(5), [FRIEND]: result(8) } }));
    expect(screen.getByText(/הפעם הניצחון הלך לדנה/)).toBeInTheDocument();
  });

  it('shows a tie', () => {
    setup(makeContest({ status: 'accepted', results: { [ME]: result(8), [FRIEND]: result(8) } }));
    expect(screen.getByText(/^תיקו!/)).toBeInTheDocument();
  });

  it('shows that the friend missed the contest', () => {
    setup(makeContest({ status: 'accepted', expiresAtMs: PAST, results: { [ME]: { ...result(8), finishedAt: '2026-11-05T09:00:00.000Z' } } }));
    expect(screen.getByText(/נגמר בלי תוצאה מדנה/)).toBeInTheDocument();
  });
});
