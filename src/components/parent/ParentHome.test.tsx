import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ParentLink } from '../../data/parentLink';
import { TEST_THEME } from '../../test/fixtures';
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

const USER = { uid: 'parent-1' } as User;
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
    await user.click(screen.getByRole('button', { name: 'אישור החיבור' }));

    expect(parentService.claimParentCode).toHaveBeenCalledWith('parent-1', 'ABCD2345');
    expect(await screen.findByRole('status')).toHaveTextContent('מחובר/ת');
    expect(await screen.findByRole('button', { name: 'הדוח השבועי' })).toBeInTheDocument();
  });

  it('shows the error for a code that is not found', async () => {
    parentService.previewParentCode.mockResolvedValue({ ok: false, errorHe: 'הקוד לא נמצא או שפג תוקפו.' });
    renderHome('ABCD2345');

    expect(await screen.findByRole('alert')).toHaveTextContent('הקוד לא נמצא');
    expect(screen.queryByRole('button', { name: 'אישור החיבור' })).not.toBeInTheDocument();
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
