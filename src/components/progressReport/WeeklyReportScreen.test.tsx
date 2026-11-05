import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGradeCurriculum } from '../../data/curriculum/loader';
import { toLocalDateStr } from '../../data/examPrep';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { WeeklyReportScreen } from './WeeklyReportScreen';

const curricula = vi.hoisted(() => ({ status: 'ready' as 'ready' | 'loading' | 'error', retry: vi.fn() }));
vi.mock('../../hooks/useGradeCurricula', () => ({ useGradeCurricula: () => curricula }));

const today = toLocalDateStr(new Date());
const onClose = vi.fn();
const onSpeakEnglish = vi.fn();

beforeAll(async () => {
  await loadGradeCurriculum('grade-1');
});

function setup() {
  render(<WeeklyReportScreen profile={makeProfile({})} theme={TEST_THEME} todayStr={today} onSpeakEnglish={onSpeakEnglish} onClose={onClose} />);
  return userEvent.setup();
}

beforeEach(() => {
  curricula.status = 'ready';
  curricula.retry.mockClear();
  onClose.mockClear();
});

describe('WeeklyReportScreen', () => {
  it('shows a loading note while the curriculum loads', () => {
    curricula.status = 'loading';
    setup();
    expect(screen.getByRole('status')).toHaveTextContent('טוענים את הדוח');
  });

  it('offers a retry when loading failed', async () => {
    curricula.status = 'error';
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'נסו שוב' }));
    expect(curricula.retry).toHaveBeenCalledTimes(1);
  });

  it('shows the report for this week with its sections and the share actions', () => {
    setup();
    expect(screen.getByText('השבוע')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'השבוע' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'התקדמות כללית' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'שיתוף הדוח' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/עוד אין מילים חדשות השבוע/)).toBeInTheDocument();
  });

  it('cannot go to a later week than this one', () => {
    setup();
    expect(screen.getByRole('button', { name: 'השבוע הבא' })).toBeDisabled();
  });
});
