import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { OwnerStats } from '../../services/ownerStatsService';
import { evaluateGates } from '../../data/successGates';
import { ConversionFunnelCard } from './ConversionFunnelCard';
import { SuccessGatesCard, gatePercent } from './SuccessGatesCard';

type Conversion = NonNullable<OwnerStats['conversion']>;
type Counts = Conversion['segments'][number]['totals'];

const counts = (overrides: Partial<Counts> = {}): Counts => ({
  signedUp: 0,
  activated: 0,
  reachedWall: 0,
  askSent: 0,
  parentLinked: 0,
  checkoutStarted: 0,
  paid: 0,
  day30Eligible: 0,
  activeDay30: 0,
  cancelled: 0,
  ...overrides,
});

const GATE_COUNTS = {
  signedUp: 100,
  activated: 35,
  activatedMature: 30,
  wallInWindow: 6,
  reachedWall: 10,
  askSent: 5,
  paidAfterAsk: 0,
  paidActivated: 0,
  cancelBase: 0,
  cancelledRecently: 0,
};

const conversion: Conversion = {
  segments: [
    { src: 'all', totals: counts({ signedUp: 100, activated: 35, paid: 2 }), cohorts: [{ weekStart: '2026-12-13', ...counts({ signedUp: 100, activated: 35 }) }] },
    { src: 'landing', totals: counts({ signedUp: 40, activated: 20 }), cohorts: [{ weekStart: '2026-12-13', ...counts({ signedUp: 40 }) }] },
  ],
  wallByGrade: [{ gradeId: 'grade-4', learners: 3, medianDays: 12 }],
  visitsBySource: [{ src: 'landing', gate_view: 80, signup_done: 40 }],
  parentLinkOpens: { all: 7, pro: 3 },
  gates: evaluateGates(GATE_COUNTS),
};

describe('SuccessGatesCard', () => {
  it('shows each gate with its rate, status in words and sample', () => {
    render(<SuccessGatesCard gates={conversion.gates} />);
    const tiles = screen.getAllByRole('listitem');
    expect(tiles).toHaveLength(6);
    expect(tiles[0]).toHaveAttribute('data-status', 'green');
    expect(within(tiles[0]).getByText('35%')).toBeInTheDocument();
    expect(within(tiles[0]).getByText('On target')).toBeInTheDocument();
    expect(within(tiles[0]).getByText('35 of 100')).toBeInTheDocument();
    // 6 of 30 = 20%, under the 40% target and with no rethink line
    expect(tiles[1]).toHaveAttribute('data-status', 'red');
    expect(tiles[3]).toHaveAttribute('data-status', 'no-data');
    expect(within(tiles[3]).getByText('Not enough data')).toBeInTheDocument();
  });

  it('formats small rates with one decimal', () => {
    expect(gatePercent(0.08)).toBe('8%');
    expect(gatePercent(0.015)).toBe('1.5%');
  });
});

describe('ConversionFunnelCard', () => {
  it('shows the steps for all sources, then for the chosen one', async () => {
    render(<ConversionFunnelCard conversion={conversion} />);
    const signedUp = () => screen.getByText('Signed up', { selector: 'span' }).closest('li') as HTMLElement;
    expect(within(signedUp()).getByText('100')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText('Source'), 'landing');
    expect(within(signedUp()).getByText('40')).toBeInTheDocument();
  });

  it('shows the weekly table, days to the wall and the visits per link tag', () => {
    render(<ConversionFunnelCard conversion={conversion} />);
    expect(screen.getByRole('rowheader', { name: '12-13' })).toBeInTheDocument();
    expect(screen.getByText('Grade 4')).toBeInTheDocument();
    expect(screen.getByText(/median 12 days/)).toBeInTheDocument();
    expect(screen.getByText(/80 saw sign-in · 40 created an account/)).toBeInTheDocument();
    expect(screen.getByText(/Parent links opened \(page loads, all sources\): 7, of them from a Pro ask: 3/)).toBeInTheDocument();
  });
});
