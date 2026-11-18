import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../test/fixtures';
import type { PlacementResult } from '../types/learner';
import { PlacementResultCard } from './PlacementResultCard';

const firebase = vi.hoisted(() => ({ auth: { currentUser: { uid: 'child-1', isAnonymous: false } as { uid: string; isAnonymous: boolean } | null } }));
vi.mock('../services/firebase', () => ({ auth: firebase.auth, isFirebaseConfigured: true, getAppCheckToken: async () => null }));

const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../services/analytics', () => analytics);

const parents = vi.hoisted(() => ({ listParentsOfChild: vi.fn(), createParentInvite: vi.fn() }));
vi.mock('../services/parentService', () => parents);

const RESULT: PlacementResult = {
  completedAt: '2026-11-18T10:00:00.000Z',
  estimatedGradeId: 'grade-4',
  recommendedGradeId: 'grade-4',
  recommendedTier: 'challenger',
  correctCount: 12,
  totalQuestions: 15,
};

beforeEach(() => {
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  analytics.trackEvent.mockReset();
  parents.listParentsOfChild.mockReset().mockResolvedValue([]);
  parents.createParentInvite.mockReset().mockResolvedValue({ ok: true, value: { code: 'ABC123', invite: {} } });
  Object.defineProperty(navigator, 'share', { value: vi.fn().mockResolvedValue(undefined), configurable: true });
});

function renderCard(canShareWithParent: boolean) {
  render(
    <PlacementResultCard
      result={RESULT}
      profile={makeProfile({ name: 'נועה', gradeId: 'grade-4', preferredTier: 'challenger' })}
      theme={TEST_THEME}
      isFirstTest={false}
      canShareWithParent={canShareWithParent}
      onFinish={vi.fn()}
    />
  );
  return userEvent.setup();
}

describe('PlacementResultCard parent share', () => {
  it('sends the level to a parent with the parent link', async () => {
    const user = renderCard(true);
    await user.click(screen.getByRole('button', { name: 'להראות להורים את הרמה שלי' }));
    await user.click(await screen.findByRole('button', { name: 'שליחה להורים' }));

    expect(navigator.share).toHaveBeenCalledWith(
      expect.objectContaining({ text: expect.stringMatching(/נועה עשתה מבחן רמה[\s\S]*ABC123/) })
    );
    expect(analytics.trackEvent).toHaveBeenCalledWith('placement_shared');
  });

  it('does not make a parent code until the learner asks', () => {
    renderCard(true);
    expect(parents.createParentInvite).not.toHaveBeenCalled();
  });

  it('is not offered during onboarding', () => {
    renderCard(false);
    expect(screen.queryByRole('button', { name: 'להראות להורים את הרמה שלי' })).not.toBeInTheDocument();
  });

  it('is not offered to an old guest account', () => {
    firebase.auth.currentUser = { uid: 'guest', isAnonymous: true };
    renderCard(true);
    expect(screen.queryByRole('button', { name: 'להראות להורים את הרמה שלי' })).not.toBeInTheDocument();
  });
});
