import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadGradeCurriculum } from '../../data/curriculum/loader';
import { addDays, buildExamPlan, getUnitOptions, toLocalDateStr } from '../../data/examPrep';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ExamPrepHub } from './ExamPrepHub';

const proState = vi.hoisted(() => ({ isPro: false, isGatingOn: false }));
const openProUpsell = vi.hoisted(() => vi.fn());
const canOpen = vi.hoisted(() => ({ value: true }));

vi.mock('../../hooks/useProAccess', () => ({ useProAccess: () => ({ ...proState }) }));
vi.mock('../../data/proGate', () => ({ canOpenExamDay: () => canOpen.value }));
vi.mock('../pro/proUpsellContext', () => ({ useOpenProUpsell: () => openProUpsell }));

const stub = (name: string, prop: string) => ({
  [name]: ({ onClose }: { onClose: () => void }) => (
    <button type="button" onClick={onClose}>
      {prop}
    </button>
  ),
});
vi.mock('./ExamPrepSetup', () => stub('ExamPrepSetup', 'setup-stub'));
vi.mock('./ExamPrepPlanView', () => stub('ExamPrepPlanView', 'plan-stub'));
vi.mock('./ExamReadyCertificate', () => stub('ExamReadyCertificate', 'certificate-stub'));
vi.mock('./ExamSessionRunner', () => stub('ExamSessionRunner', 'session-stub'));

const today = toLocalDateStr(new Date());

function makePlan() {
  return buildExamPlan({
    gradeId: 'grade-3',
    examDateStr: addDays(today, 6),
    unitNumbers: [getUnitOptions('grade-3')[0].unitNumber],
    skills: ['vocabulary', 'grammar'],
    todayStr: today,
    isShabbatObserver: false,
    createdAt: new Date().toISOString(),
  });
}

const onUpdateProfile = vi.fn();

beforeAll(async () => {
  await loadGradeCurriculum('grade-3');
});

function setup(withPlan: boolean) {
  const profile = makeProfile(withPlan ? { examPrep: makePlan() } : {});
  render(<ExamPrepHub profile={profile} theme={TEST_THEME} onUpdateProfile={onUpdateProfile} onSpeakEnglish={vi.fn()} />);
  return userEvent.setup();
}

const tile = () => screen.getByRole('button', { name: /^הכנה למבחן/ });

beforeEach(() => {
  proState.isPro = false;
  proState.isGatingOn = false;
  canOpen.value = true;
  onUpdateProfile.mockClear();
  openProUpsell.mockClear();
});

describe('ExamPrepHub', () => {
  it('without a plan: the card invites a new plan and opens the setup', async () => {
    const user = setup(false);
    await user.click(tile());
    expect(screen.getByText(/יש לך מבחן באנגלית בקרוב/)).toBeInTheDocument();
    await user.click(within(screen.getByRole('region', { name: 'הכנה למבחן' })).getByRole('button'));
    expect(await screen.findByRole('button', { name: 'setup-stub' })).toBeInTheDocument();
  });

  it('with a plan: the tile is marked when today has a session, and the plan opens', async () => {
    const user = setup(true);
    expect(tile()).toHaveAccessibleName(/תרגול של היום מחכה/);
    await user.click(tile());
    const open = screen.getAllByRole('button').find((b) => /לתוכנית|התוכנית|כל השלבים/.test(b.textContent ?? ''));
    expect(open).toBeDefined();
    await user.click(open!);
    expect(await screen.findByRole('button', { name: 'plan-stub' })).toBeInTheDocument();
  });

  it('starts today’s session from the card', async () => {
    const user = setup(true);
    await user.click(tile());
    const start = within(screen.getByRole('region', { name: 'הכנה למבחן' })).getAllByRole('button')[0];
    expect(start).toBeDefined();
    await user.click(start!);
    expect(await screen.findByRole('button', { name: 'session-stub' })).toBeInTheDocument();
  });

  it('sends the learner to the Pro sheet when the day is locked', async () => {
    canOpen.value = false;
    const user = setup(true);
    await user.click(tile());
    const start = within(screen.getByRole('region', { name: 'הכנה למבחן' })).getAllByRole('button')[0];
    await user.click(start!);
    expect(openProUpsell).toHaveBeenCalledWith('exam');
    expect(screen.queryByRole('button', { name: 'session-stub' })).not.toBeInTheDocument();
  });
});
