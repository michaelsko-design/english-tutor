import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGradeCurriculum } from '../../data/curriculum/loader';
import { addDays, buildExamPlan, getUnitOptions, toLocalDateStr } from '../../data/examPrep';
import { TEST_THEME } from '../../test/fixtures';
import type { ExamPrepPlan } from '../../types/learner';
import { ExamPrepPlanView } from './ExamPrepPlanView';

const canOpen = vi.hoisted(() => ({ value: true }));
const openProUpsell = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/useProAccess', () => ({ useProAccess: () => ({ isPro: false, isGatingOn: false }) }));
vi.mock('../../data/proGate', () => ({ canOpenExamDay: () => canOpen.value }));
vi.mock('../pro/proUpsellContext', () => ({ useOpenProUpsell: () => openProUpsell }));

const today = toLocalDateStr(new Date());
const fns = { onStartDay: vi.fn(), onShowCertificate: vi.fn(), onNewPlan: vi.fn(), onArchive: vi.fn(), onClose: vi.fn() };

function makePlan(daysAhead = 4, extra: Partial<ExamPrepPlan> = {}): ExamPrepPlan {
  return {
    ...buildExamPlan({
      gradeId: 'grade-3',
      examDateStr: addDays(today, daysAhead),
      unitNumbers: [getUnitOptions('grade-3')[0].unitNumber],
      skills: ['vocabulary', 'grammar'],
      todayStr: today,
      isShabbatObserver: false,
      createdAt: new Date().toISOString(),
    }),
    ...extra,
  };
}

function setup(plan: ExamPrepPlan, gender: 'girl' | 'boy' = 'girl', todayStr = today) {
  render(<ExamPrepPlanView plan={plan} gender={gender} theme={TEST_THEME} todayStr={todayStr} {...fns} />);
  return userEvent.setup();
}

beforeAll(async () => {
  await loadGradeCurriculum('grade-3');
});

beforeEach(() => {
  canOpen.value = true;
  Object.values(fns).forEach((fn) => fn.mockClear());
  openProUpsell.mockClear();
});

describe('ExamPrepPlanView', () => {
  it('shows the countdown, the chosen units and skills, and the progress', () => {
    setup(makePlan(4));
    expect(screen.getByRole('heading', { name: 'עוד 4 ימים למבחן' })).toBeInTheDocument();
    expect(screen.getByText(/יחידה \d+/)).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'התקדמות בתוכנית' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('counts down to tomorrow', () => {
    setup({ ...makePlan(4), examDateStr: addDays(today, 1) });
    expect(screen.getByRole('heading', { name: 'המבחן מחר!' })).toBeInTheDocument();
  });

  it('says the exam is today', () => {
    setup({ ...makePlan(4), examDateStr: today });
    expect(screen.getByRole('heading', { name: /המבחן היום/ })).toBeInTheDocument();
  });

  it('offers to finish and remove the plan once the exam has passed', () => {
    setup({ ...makePlan(4), examDateStr: addDays(today, -1) });
    expect(screen.getByRole('heading', { name: 'המבחן כבר עבר' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'סיום והסרת התוכנית' })).toBeInTheDocument();
  });

  it('starts today’s session', async () => {
    const user = setup(makePlan(4));
    await user.click(screen.getAllByRole('button', { name: /^התחילי$/ })[0]);
    expect(fns.onStartDay).toHaveBeenCalledTimes(1);
  });

  it('locks days that have not come and the mock exam before the practice is done', () => {
    setup(makePlan(4));
    expect(screen.getAllByText('בקרוב').length).toBeGreaterThan(0);
    expect(screen.getByText('אחרי התרגולים')).toBeInTheDocument();
  });

  it('lets a finished day be practised again, showing its score', async () => {
    const plan = makePlan(4);
    const days = plan.days.map((d, i) => (i === 0 ? { ...d, completedAt: '2026-11-05T10:00:00.000Z', scorePercent: 80 } : d));
    const user = setup({ ...plan, days });
    expect(screen.getByText('80%')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /תרגלי שוב/ }));
    expect(fns.onStartDay).toHaveBeenCalledWith(plan.days[0].dayIndex);
  });

  it('uses masculine copy for a boy', () => {
    setup(makePlan(4), 'boy');
    expect(screen.getAllByRole('button', { name: /^התחל$/ }).length).toBeGreaterThan(0);
  });

  it('shows the Pro button instead of the start button on a day Pro unlocks', async () => {
    canOpen.value = false;
    const user = setup(makePlan(4));
    const list = screen.getByRole('list');
    const proButtons = within(list).getAllByRole('button', { name: /זמין ב-Pro/ });
    await user.click(proButtons[0]);
    expect(openProUpsell).toHaveBeenCalledWith('exam');
    expect(fns.onStartDay).not.toHaveBeenCalled();
  });

  it('shows the certificate button once earned, and the best mock score before', async () => {
    const earned = setup({ ...makePlan(4), certificateEarnedAt: '2026-11-05T10:00:00.000Z' });
    await earned.click(screen.getByRole('button', { name: /לתעודה שלך/ }));
    expect(fns.onShowCertificate).toHaveBeenCalledTimes(1);
  });

  it('shows the best simulation score and the score needed for the certificate', () => {
    setup({ ...makePlan(4), bestMockScore: 70 });
    expect(screen.getByText(/הציון הכי טוב בסימולציה/)).toBeInTheDocument();
  });

  it('plans a new exam and removes the plan', async () => {
    const user = setup(makePlan(4));
    await user.click(screen.getByRole('button', { name: /תכנון מבחן חדש/ }));
    await user.click(screen.getByRole('button', { name: 'הסרת התוכנית' }));
    expect(fns.onNewPlan).toHaveBeenCalledTimes(1);
    expect(fns.onArchive).toHaveBeenCalledTimes(1);
  });

  it('closes', async () => {
    const user = setup(makePlan(4));
    await user.click(screen.getByRole('button', { name: /סגירה|סגור/ }));
    expect(fns.onClose).toHaveBeenCalledTimes(1);
  });
});
