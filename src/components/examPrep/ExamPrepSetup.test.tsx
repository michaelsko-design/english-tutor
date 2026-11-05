import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGradeCurriculum } from '../../data/curriculum/loader';
import { EXAM_SKILLS, addDays, getUnitOptions, toLocalDateStr } from '../../data/examPrep';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { ExamPrepPlan, LearnerProfile } from '../../types/learner';
import { ExamPrepSetup } from './ExamPrepSetup';

const forced = vi.hoisted(() => ({ status: null as null | 'loading' | 'error', retry: vi.fn() }));
vi.mock('../../hooks/useGradeCurricula', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../hooks/useGradeCurricula')>();
  return {
    ...actual,
    useGradeCurriculum: (gradeId: string) => (forced.status ? { status: forced.status, retry: forced.retry } : actual.useGradeCurriculum(gradeId as never)),
  };
});

const today = toLocalDateStr(new Date());
const onCreate = vi.fn();
const onClose = vi.fn();

beforeAll(async () => {
  await loadGradeCurriculum('grade-3');
});

beforeEach(() => {
  forced.status = null;
  forced.retry.mockClear();
  onCreate.mockClear();
  onClose.mockClear();
});

function setup(overrides: Partial<LearnerProfile> = {}) {
  render(<ExamPrepSetup profile={makeProfile({ gradeId: 'grade-3', gender: 'girl', ...overrides })} theme={TEST_THEME} onCreate={onCreate} onClose={onClose} />);
  return userEvent.setup();
}

const build = () => screen.getByRole('button', { name: /בניית התוכנית שלי/ });
const setDate = (value: string) => fireEvent.change(document.getElementById('exam-date') as HTMLInputElement, { target: { value } });
const firstUnit = () => screen.getAllByRole('button', { name: /^.*יחידה \d+:/ })[0];

describe('ExamPrepSetup', () => {
  it('previews the plan for the default date and needs a unit before it can be built', () => {
    setup();
    expect(screen.getByText(/ימי תרגול \+ סימולציית מבחן ביום האחרון/)).toBeInTheDocument();
    expect(build()).toBeDisabled();
  });

  it('lists the grade’s units and enables building once one is picked', async () => {
    const user = setup();
    const units = getUnitOptions('grade-3');
    expect(screen.getAllByRole('button', { name: /יחידה \d+:/ })).toHaveLength(units.length);
    await user.click(firstUnit());
    expect(firstUnit()).toHaveAttribute('aria-pressed', 'true');
    expect(build()).toBeEnabled();
    await user.click(firstUnit());
    expect(build()).toBeDisabled();
  });

  it('turns skills on and off, and cannot build without a skill', async () => {
    const user = setup();
    await user.click(firstUnit());
    const skillButtons = EXAM_SKILLS.map((_, i) => screen.getAllByRole('button', { pressed: true }).filter((b) => !/יחידה/.test(b.textContent ?? ''))[i]);
    expect(skillButtons.length).toBe(EXAM_SKILLS.length);
    for (const button of skillButtons) await user.click(button);
    expect(build()).toBeDisabled();
  });

  it('builds the plan with the chosen date, unit and skills', async () => {
    const user = setup();
    await user.click(firstUnit());
    await user.click(build());
    expect(onCreate).toHaveBeenCalledTimes(1);
    const plan = onCreate.mock.calls[0][0] as ExamPrepPlan;
    expect(plan.gradeId).toBe('grade-3');
    expect(plan.examDateStr).toBe(addDays(today, 4));
    expect(plan.unitNumbers).toEqual([getUnitOptions('grade-3')[0].unitNumber]);
  });

  it('offers a one-day crash course for an exam today', async () => {
    const user = setup({ isShabbatObserver: false });
    setDate(today);
    expect(screen.getByText(/קורס בזק ליום אחד/)).toBeInTheDocument();
    await user.click(firstUnit());
    expect(build()).toBeEnabled();
  });

  it('refuses a date in the past', () => {
    setup();
    setDate(addDays(today, -2));
    expect(screen.getByText(/אפשר לבחור תאריך מהיום ועד/)).toBeInTheDocument();
    expect(build()).toBeDisabled();
  });

  it('warns that a new plan replaces the current one', () => {
    setup({ examPrep: { archivedAt: undefined } as never });
    expect(screen.getByText(/התוכנית החדשה תחליף/)).toBeInTheDocument();
  });

  it('does not warn when the current plan was archived', () => {
    setup({ examPrep: { archivedAt: '2026-11-01T00:00:00.000Z' } as never });
    expect(screen.queryByText(/התוכנית החדשה תחליף/)).not.toBeInTheDocument();
  });

  it('uses masculine copy for a boy', () => {
    setup({ gender: 'boy' });
    expect(screen.getByText(/בוא נתכונן/)).toBeInTheDocument();
  });

  it('shows a loading note while the units load', () => {
    forced.status = 'loading';
    setup();
    expect(screen.getByText('טוענים את היחידות…')).toBeInTheDocument();
  });

  it('offers a retry when the units failed to load', async () => {
    forced.status = 'error';
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'נסו שוב' }));
    expect(forced.retry).toHaveBeenCalledTimes(1);
  });
});
