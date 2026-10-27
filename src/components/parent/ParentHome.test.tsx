import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ParentLink } from '../../data/parentLink';
import { TEST_THEME } from '../../test/fixtures';
import { toLocalDateStr } from '../../utils/dates';
import { ParentHome } from './ParentHome';

const parentService = vi.hoisted(() => ({
  listChildrenOfParent: vi.fn(),
  previewParentCode: vi.fn(),
  claimParentCode: vi.fn(),
  loadReportSnapshot: vi.fn(),
  unlinkParent: vi.fn(),
  resetChildPin: vi.fn(),
}));
vi.mock('../../services/parentService', () => parentService);
vi.mock('../progressReport/WeeklyReportScreen', () => ({
  WeeklyReportScreen: ({ profile }: { profile: { name: string } }) => <div role="dialog">דוח של {profile.name}</div>,
}));

const USER = { uid: 'parent-1', email: 'parent@example.com' } as User;
const LINK: ParentLink = {
  parentUid: 'parent-1', childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', inviteCode: 'ABCD2345',
  linkedAt: '2026-03-04T10:00:00.000Z',
};
const SNAPSHOT = {
  name: 'נועה', gender: 'girl', gradeId: 'grade-7', preferredTier: 'explorer', isShabbatObserver: true,
  stats: { level: 2, streakDays: 1 }, missionProgress: {}, activityLog: [], updatedAt: '2026-03-04T10:00:00.000Z',
};

function renderHome(initialCode: string | null = null) {
  render(<ParentHome user={USER} theme={TEST_THEME} initialCode={initialCode} onSignOut={vi.fn()} />);
}

beforeEach(() => {
  Object.values(parentService).forEach((fn) => fn.mockReset());
  parentService.listChildrenOfParent.mockResolvedValue([]);
});

describe('ParentHome', () => {
  it('explains how to connect when there is no learner yet', async () => {
    renderHome();

    expect(await screen.findByText(/עוד לא חובר אף לומד/)).toBeInTheDocument();
  });

  it('shows whose code it is and connects only after the parent confirms', async () => {
    const user = userEvent.setup();
    parentService.previewParentCode.mockResolvedValue({
      ok: true,
      value: { childName: 'נועה', childAvatar: '🐱', childUid: 'child-1', expiresAtMs: 1 },
    });
    parentService.claimParentCode.mockResolvedValue({ ok: true, value: LINK });
    parentService.listChildrenOfParent.mockResolvedValueOnce([]).mockResolvedValue([LINK]);
    renderHome('ABCD2345');

    expect(await screen.findByText(/לחבר את/)).toHaveTextContent('נועה');
    expect(parentService.claimParentCode).not.toHaveBeenCalled();
    // The parent must first say they are the child's parent or guardian
    expect(screen.getByRole('button', { name: 'אישור החיבור' })).toBeDisabled();
    await user.click(screen.getByRole('checkbox', { name: /ההורה או האפוטרופוס/ }));
    await user.click(screen.getByRole('button', { name: 'אישור החיבור' }));

    expect(parentService.claimParentCode).toHaveBeenCalledWith('parent-1', 'ABCD2345', expect.any(Date), 'p***@example.com');
    expect(await screen.findByRole('status')).toHaveTextContent('מחובר/ת');
    expect(await screen.findByRole('button', { name: 'הדוח השבועי' })).toBeInTheDocument();
  });

  it('shows the error for a code that is not found', async () => {
    parentService.previewParentCode.mockResolvedValue({ ok: false, errorHe: 'הקוד לא נמצא או שפג תוקפו.' });
    renderHome('ABCD2345');

    expect(await screen.findByRole('alert')).toHaveTextContent('הקוד לא נמצא');
    expect(screen.queryByRole('button', { name: 'אישור החיבור' })).not.toBeInTheDocument();
  });

  it('shows a stats line on each learner card, without opening the report', async () => {
    parentService.listChildrenOfParent.mockResolvedValue([LINK]);
    parentService.loadReportSnapshot.mockResolvedValue({
      ...SNAPSHOT,
      stats: { level: 4, streakDays: 6, streakLastDateStr: toLocalDateStr(new Date()) },
      activityLog: [{ dateStr: toLocalDateStr(new Date()), sessions: 2 }],
    });
    renderHome();

    const line = await screen.findByRole('list', { name: 'תמצית' });
    expect(line).toHaveTextContent('6 ימים ברצף');
    expect(line).toHaveTextContent('רמה 4');
    expect(line).toHaveTextContent('אחרון: היום');
  });

  it('says there is no data yet for a learner without a snapshot', async () => {
    parentService.listChildrenOfParent.mockResolvedValue([LINK]);
    parentService.loadReportSnapshot.mockResolvedValue(null);
    renderHome();

    expect(await screen.findByText(/עוד אין נתונים/)).toBeInTheDocument();
  });

  it('opens the weekly report from the learner snapshot', async () => {
    const user = userEvent.setup();
    parentService.listChildrenOfParent.mockResolvedValue([LINK]);
    parentService.loadReportSnapshot.mockResolvedValue(SNAPSHOT);
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'הדוח השבועי' }));

    expect(await screen.findByRole('dialog')).toHaveTextContent('דוח של נועה');
  });

  it('says so when the learner has no report yet', async () => {
    const user = userEvent.setup();
    parentService.listChildrenOfParent.mockResolvedValue([LINK]);
    parentService.loadReportSnapshot.mockResolvedValue(null);
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'הדוח השבועי' }));

    expect(await screen.findByRole('status')).toHaveTextContent('עדיין אין דוח');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('sets a new PIN for a learner after the parent types it twice', async () => {
    const user = userEvent.setup();
    parentService.listChildrenOfParent.mockResolvedValue([LINK]);
    parentService.resetChildPin.mockResolvedValue({ ok: true, value: undefined });
    renderHome();

    await user.click(await screen.findByRole('button', { name: 'החלפת קוד סודי' }));
    await user.type(screen.getByLabelText('הקוד החדש:'), '246810');
    await user.type(screen.getByLabelText('שוב, לאישור:'), '246810');
    await user.click(screen.getByRole('button', { name: 'החלפת הקוד' }));

    expect(parentService.resetChildPin).toHaveBeenCalledWith('child-1', '246810');
    expect(await screen.findByRole('status')).toHaveTextContent('הקוד הסודי של נועה הוחלף');
  });
});
