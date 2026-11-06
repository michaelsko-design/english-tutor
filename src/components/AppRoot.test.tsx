import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

type AuthListener = (user: unknown) => void;
const firebase = vi.hoisted(() => ({ listener: null as null | ((user: unknown) => void) }));

vi.mock('../services/firebase', () => ({ auth: {}, isFirebaseConfigured: true }));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, listener: AuthListener) => {
    firebase.listener = listener;
    return () => {};
  },
}));
vi.mock('../App', () => ({ default: () => <div>learner app</div> }));
vi.mock('./parent/ParentPortal', () => ({ ParentPortal: () => <div>parent area</div> }));
vi.mock('./owner/OwnerDashboard', () => ({ OwnerDashboard: () => <div>owner dashboard</div> }));
vi.mock('../services/accountService', () => ({
  getAccountKind: (user: { kind: string }) => user.kind,
}));

const parentService = vi.hoisted(() => ({ hasLearnerProfile: vi.fn(), isParentAccount: vi.fn() }));
vi.mock('../services/parentService', () => parentService);

import { AppRoot } from './AppRoot';

const googleUser = { uid: 'g1', isAnonymous: false, kind: 'google' };

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  firebase.listener = null;
  parentService.hasLearnerProfile.mockReset().mockResolvedValue(false);
  parentService.isParentAccount.mockReset().mockResolvedValue(false);
});

describe('AppRoot', () => {
  it('opens the parent area for a Google parent account with no learner profile', async () => {
    parentService.isParentAccount.mockResolvedValue(true);
    render(<AppRoot />);
    firebase.listener?.(googleUser);

    expect(await screen.findByText('parent area')).toBeInTheDocument();
    expect(window.localStorage.getItem('english_tutor_account_role_g1')).toBe('parent');
  });

  it('opens the app for a Google learner, and remembers it', async () => {
    parentService.hasLearnerProfile.mockResolvedValue(true);
    render(<AppRoot />);
    firebase.listener?.(googleUser);

    expect(await screen.findByText('learner app')).toBeInTheDocument();
    expect(window.localStorage.getItem('english_tutor_account_role_g1')).toBe('learner');
  });

  it('opens the app without any lookup for signed-out visitors, guests and PIN accounts', async () => {
    render(<AppRoot />);
    firebase.listener?.({ uid: 'x', isAnonymous: false, kind: 'password' });

    expect(await screen.findByText('learner app')).toBeInTheDocument();
    expect(parentService.hasLearnerProfile).not.toHaveBeenCalled();
  });

  it('opens the app when the check fails, such as offline', async () => {
    parentService.hasLearnerProfile.mockRejectedValue(new Error('offline'));
    render(<AppRoot />);
    firebase.listener?.(googleUser);

    expect(await screen.findByText('learner app')).toBeInTheDocument();
  });

  it('uses the remembered role without asking Firestore', async () => {
    window.localStorage.setItem('english_tutor_account_role_g1', 'parent');
    render(<AppRoot />);
    firebase.listener?.(googleUser);

    expect(await screen.findByText('parent area')).toBeInTheDocument();
    expect(parentService.hasLearnerProfile).not.toHaveBeenCalled();
  });

  it('opens the parent area straight away for the /?parent link', () => {
    window.history.replaceState(null, '', '/?parent=ABCD2345');
    render(<AppRoot />);

    expect(screen.getByText('parent area')).toBeInTheDocument();
  });

  it.each(['/?owner', '/owner/', '/owner'])('opens the owner dashboard for %s', async (url) => {
    window.history.replaceState(null, '', url);
    render(<AppRoot />);

    expect(await screen.findByText('owner dashboard')).toBeInTheDocument();
    expect(firebase.listener).toBeNull();
  });

  it('does not treat other /owner-like paths as the dashboard', () => {
    window.history.replaceState(null, '', '/owners');
    render(<AppRoot />);

    expect(screen.queryByText('owner dashboard')).not.toBeInTheDocument();
  });
});
