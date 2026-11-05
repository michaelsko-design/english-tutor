import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { AuthUserSummary, CloudSyncStatus, LearnerProfile } from '../../types/learner';
import { HomeHud, shouldShowSyncButton } from './HomeHud';

vi.mock('../hud/SoundToggle', () => ({ SoundToggle: () => <span>sound-toggle</span> }));

const USER: AuthUserSummary = { uid: 'u1', email: 'noa.cohen@x.test', displayName: 'נועה כהן', isAnonymous: false };
const fns = {
  onOpenStats: vi.fn(),
  onOpenQuests: vi.fn(),
  onOpenShop: vi.fn(),
  onOpenVault: vi.fn(),
  onOpenAuth: vi.fn(),
  onOpenTour: vi.fn(),
  onEditProfile: vi.fn(),
};

function setup(props: { profile?: LearnerProfile; authUser?: AuthUserSummary | null; syncStatus?: CloudSyncStatus } = {}) {
  render(
    <HomeHud
      profile={props.profile ?? makeProfile({ name: 'נועה' })}
      theme={TEST_THEME}
      avatarEmoji="🦊"
      authUser={props.authUser === undefined ? USER : props.authUser}
      syncStatus={props.syncStatus ?? 'synced'}
      {...fns}
    />
  );
  return userEvent.setup();
}

beforeEach(() => Object.values(fns).forEach((fn) => fn.mockClear()));

describe('shouldShowSyncButton', () => {
  it('shows only when something needs the learner', () => {
    expect(shouldShowSyncButton('synced', USER)).toBe(false);
    expect(shouldShowSyncButton('syncing', USER)).toBe(false);
    expect(shouldShowSyncButton('offline-error', USER)).toBe(true);
    expect(shouldShowSyncButton('local-only', null)).toBe(true);
    expect(shouldShowSyncButton('synced', { ...USER, isAnonymous: true })).toBe(true);
  });
});

describe('HomeHud', () => {
  it('opens the stats from the avatar, the quests from the flame and the shop from the gems', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /פתיחת הנתונים שלי/ }));
    await user.click(screen.getByRole('button', { name: /ימי רצף\. פתיחת האתגרים/ }));
    await user.click(screen.getByRole('button', { name: new RegExp(`${TEST_THEME.currencyNameHe}\\. פתיחת החנות`) }));
    expect(fns.onOpenStats).toHaveBeenCalledTimes(1);
    expect(fns.onOpenQuests).toHaveBeenCalledTimes(1);
    expect(fns.onOpenShop).toHaveBeenCalledTimes(1);
  });

  it('opens the tour, the vault, the shop shortcut and the profile', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /סיור באפליקציה/ }));
    await user.click(screen.getByRole('button', { name: /מאגר מילים/ }));
    await user.click(screen.getByRole('button', { name: 'חנות' }));
    await user.click(screen.getByRole('button', { name: 'פרופיל והגדרות' }));
    expect(fns.onOpenTour).toHaveBeenCalledTimes(1);
    expect(fns.onOpenVault).toHaveBeenCalledTimes(1);
    expect(fns.onOpenShop).toHaveBeenCalledTimes(1);
    expect(fns.onEditProfile).toHaveBeenCalledTimes(1);
  });

  it('shows the learner’s name, or the app name without one', () => {
    setup({ profile: makeProfile({ name: 'נועה' }) });
    expect(screen.getByText('נועה')).toBeInTheDocument();
  });

  it('falls back to the app name when the learner has none', () => {
    setup({ profile: makeProfile({ name: '' }) });
    expect(screen.queryByText('נועה')).not.toBeInTheDocument();
  });

  it('hides the cloud button when everything is saved', () => {
    setup();
    expect(screen.queryByRole('button', { name: 'סנכרון ענן וחשבון' })).not.toBeInTheDocument();
  });

  it('shows the cloud button with the first name when sync failed and opens sign-in', async () => {
    const user = setup({ syncStatus: 'offline-error' });
    const button = screen.getByRole('button', { name: 'סנכרון ענן וחשבון' });
    expect(button).toHaveTextContent('נועה');
    await user.click(button);
    expect(fns.onOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('labels a guest account', () => {
    setup({ authUser: { ...USER, isAnonymous: true }, syncStatus: 'synced' });
    expect(screen.getByRole('button', { name: 'סנכרון ענן וחשבון' })).toHaveTextContent('ענן אורח');
  });

  it('labels a signed-out device as local only', () => {
    setup({ authUser: null, syncStatus: 'local-only' });
    expect(screen.getByRole('button', { name: 'סנכרון ענן וחשבון' })).toHaveTextContent('סנכרון');
  });

  it('shows the cloud button for every state that needs attention', () => {
    setup({ authUser: { ...USER, isAnonymous: true }, syncStatus: 'syncing' });
    expect(screen.getByRole('button', { name: 'סנכרון ענן וחשבון' })).toBeInTheDocument();
  });

  it('shows the username of a kid account', () => {
    setup({ authUser: { ...USER, email: 'noa12@peachnote.tutor.local' }, syncStatus: 'offline-error' });
    expect(screen.getByRole('button', { name: 'סנכרון ענן וחשבון' })).toHaveTextContent('noa12');
  });

  it('falls back to the email name, then the profile name', () => {
    setup({ authUser: { ...USER, displayName: null }, syncStatus: 'offline-error' });
    expect(screen.getByRole('button', { name: 'סנכרון ענן וחשבון' })).toHaveTextContent('noa.cohen');
  });

  it('falls back to the learner’s own name for an account with nothing else', () => {
    setup({ authUser: { ...USER, displayName: null, email: null }, syncStatus: 'offline-error', profile: makeProfile({ name: 'דנה' }) });
    expect(screen.getByRole('button', { name: 'סנכרון ענן וחשבון' })).toHaveTextContent('דנה');
  });
});
