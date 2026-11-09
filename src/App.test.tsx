import { useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE } from './data/defaultProfile';
import { makeProfile } from './test/fixtures';
import type { LearnerProfile } from './types/learner';
import { App } from './App';

const fb = vi.hoisted(() => ({ configured: true }));
const authState = vi.hoisted(() => ({
  callback: null as null | ((user: unknown) => Promise<void>),
  unsubscribeAuth: vi.fn(),
  unsubscribeSnapshot: vi.fn(),
  snapshotNext: null as null | ((snap: unknown) => void),
  snapshotError: null as null | (() => void),
}));
const cloud = vi.hoisted(() => ({
  migrate: vi.fn(),
  merge: vi.fn((local: unknown, cloudData: unknown) => ({ ...(local as object), ...(cloudData as object) })),
  buildLogin: vi.fn((fresh: unknown, cloudData: unknown) => ({ ...(fresh as object), ...(cloudData as object) })),
  save: vi.fn(),
}));
const queue = vi.hoisted(() => ({
  schedule: vi.fn(),
  flush: vi.fn(async () => undefined),
  hold: vi.fn(),
  release: vi.fn(),
  discard: vi.fn(),
}));
const tracker = vi.hoisted(() => ({ onSeconds: null as null | ((s: number) => void) }));
const account = vi.hoisted(() => ({ deleteAccount: vi.fn() }));
const signOut = vi.hoisted(() => vi.fn(async () => undefined));
const inviteCleared = vi.hoisted(() => vi.fn());

vi.mock('./services/firebase', () => ({
  get isFirebaseConfigured() {
    return fb.configured;
  },
  get auth() {
    return fb.configured ? { name: 'auth' } : null;
  },
  get db() {
    return fb.configured ? { name: 'db' } : null;
  },
  app: null,
  appCheck: null,
  googleProvider: null,
  getAppCheckToken: async () => null,
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, cb: (user: unknown) => Promise<void>) => {
    authState.callback = cb;
    return authState.unsubscribeAuth;
  },
  signOut,
}));
vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, ...path: string[]) => ({ path: path.join('/') }),
  onSnapshot: (_ref: unknown, next: (snap: unknown) => void, error: () => void) => {
    authState.snapshotNext = next;
    authState.snapshotError = error;
    return authState.unsubscribeSnapshot;
  },
}));
vi.mock('./services/cloudSync', () => ({
  buildLoginProfile: cloud.buildLogin,
  mergeLearnerProfiles: cloud.merge,
  migrateAndSyncProfileOnLogin: cloud.migrate,
  saveProfileToFirestore: cloud.save,
}));
vi.mock('./services/profileSaveQueue', () => ({ createProfileSaveQueue: () => queue }));
vi.mock('./services/accountService', () => ({ deleteAccount: account.deleteAccount }));
vi.mock('./hooks/useActiveTimeTracker', () => ({ useActiveTimeTracker: (cb: (s: number) => void) => void (tracker.onSeconds = cb) }));
vi.mock('./hooks/useFriendPresence', () => ({ useFriendPresence: () => undefined }));
vi.mock('./hooks/useReportSnapshotPublisher', () => ({ useReportSnapshotPublisher: () => undefined }));
vi.mock('./hooks/useReminderSync', () => ({ useReminderSync: () => undefined }));
vi.mock('./hooks/useStickerImageSync', () => ({ useStickerImageSync: () => undefined }));
vi.mock('./hooks/usePendingInvite', () => ({ usePendingInvite: () => ['INVITE1', inviteCleared] }));
vi.mock('./hooks/useProAccess', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./hooks/useProAccess')>();
  return { ...actual, useLearnerProAccess: () => ({ isPro: false, isGatingOn: false }) };
});

const btn = (name: string, onClick?: () => void) => (
  <button type="button" onClick={onClick}>
    {name}
  </button>
);

vi.mock('./components/DashboardView', () => ({
  DashboardView: (p: {
    profile: LearnerProfile;
    syncStatus: string;
    pendingInviteCode: string | null;
    onUpdateProfile: (p: LearnerProfile) => void;
    onEditOnboarding: () => void;
    onSignOut: () => Promise<void>;
    onInviteHandled: () => void;
    onFirstMissionDone?: (isFinished: boolean) => void;
  }) => (
    <div>
      <span>{`dashboard:${p.profile.name}:${p.syncStatus}:${p.pendingInviteCode}`}</span>
      {p.onFirstMissionDone && <span>first-mission-mode</span>}
      {p.onFirstMissionDone && btn('first-mission-finished', () => p.onFirstMissionDone?.(true))}
      {p.onFirstMissionDone && btn('first-mission-abandoned', () => p.onFirstMissionDone?.(false))}
      {btn('update-profile', () => p.onUpdateProfile({ ...p.profile, name: 'שינוי' }))}
      {btn('edit-profile', p.onEditOnboarding)}
      {btn('dash-sign-out', () => void p.onSignOut())}
      {btn('invite-handled', p.onInviteHandled)}
    </div>
  ),
}));
vi.mock('./components/AuthModal', () => ({
  AuthModal: (p: { isMandatory?: boolean; onSignOut: () => Promise<void> }) => <span>{`auth-gate:${p.isMandatory}`}</span>,
}));
vi.mock('./components/CloudLoadErrorScreen', () => ({
  CloudLoadErrorScreen: (p: { onRetry: () => void; onSignOut: () => void }) => (
    <div>
      {btn('retry-load', p.onRetry)}
      {btn('load-sign-out', p.onSignOut)}
    </div>
  ),
}));
vi.mock('./components/OnboardingView', () => ({
  OnboardingView: (p: { initialProfile: LearnerProfile; onComplete: (p: LearnerProfile) => void }) =>
    btn('finish-onboarding', () => p.onComplete({ ...p.initialProfile, name: 'חדשה', isOnboarded: true })),
}));
vi.mock('./components/settings/SettingsView', () => ({
  SettingsView: (p: { onClose: () => void; onSignOut: () => Promise<void>; onDeleteAccount: (code: string | undefined, pin: string) => Promise<{ ok: boolean }> }) => {
    const [deleted, setDeleted] = useState('none');
    return (
      <div>
        {btn('close-settings', p.onClose)}
        {btn('settings-sign-out', () => void p.onSignOut())}
        {btn('delete-account', () => void p.onDeleteAccount('K7MP2Q', '1234').then((r) => setDeleted(String(r.ok))))}
        <span>{`deleted:${deleted}`}</span>
      </div>
    );
  },
}));
vi.mock('./components/home/FirstLaunchGreeting', () => ({ FirstLaunchGreeting: (p: { onDone: () => void }) => btn('greeting-done', p.onDone) }));
vi.mock('./components/FirstLesson', () => ({
  FirstLesson: (p: { onDone: (isFinished: boolean) => void }) => (
    <div>
      {btn('lesson-done', () => p.onDone(true))}
      {btn('lesson-exit', () => p.onDone(false))}
    </div>
  ),
}));
vi.mock('./components/home/FirstWinScreen', () => ({ FirstWinScreen: (p: { onContinue: () => void }) => btn('first-win-continue', p.onContinue) }));

const USER = { uid: 'u1', displayName: 'נועה כהן', email: 'n@x.test', isAnonymous: false };
const ONBOARDED = () => makeProfile({ name: 'נועה', hasSeenWelcomeGiftModal: true });

const signIn = (user: unknown = USER) => act(async () => { await authState.callback!(user); });

beforeEach(() => {
  fb.configured = true;
  authState.callback = null;
  authState.snapshotNext = null;
  authState.snapshotError = null;
  [authState.unsubscribeAuth, authState.unsubscribeSnapshot, cloud.migrate, cloud.save, queue.schedule, queue.hold, queue.release, queue.discard, account.deleteAccount, signOut, inviteCleared].forEach((fn) => fn.mockClear());
  queue.flush.mockClear();
  cloud.migrate.mockResolvedValue(ONBOARDED());
  account.deleteAccount.mockResolvedValue({ ok: true });
  tracker.onSeconds = null;
  localStorage.clear();
  document.head.innerHTML = '<meta name="theme-color" content="#000000">';
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => vi.restoreAllMocks());

describe('App sign-in gate', () => {
  it('shows a connection check until Firebase reports who is signed in', () => {
    render(<App />);
    expect(screen.getByText('בודק חיבור לחשבון...')).toBeInTheDocument();
  });

  it('shows the mandatory sign-in when nobody is signed in, and forgets the local copy', async () => {
    localStorage.setItem('english_tutor_learner_profile_v2', JSON.stringify(ONBOARDED()));
    render(<App />);
    await signIn(null);
    expect(screen.getByText('auth-gate:true')).toBeInTheDocument();
    expect(localStorage.getItem('english_tutor_learner_profile_v2')).toBeNull();
  });

  it('goes straight to the sign-in when Firebase is not configured', () => {
    fb.configured = false;
    render(<App />);
    expect(screen.getByText('auth-gate:true')).toBeInTheDocument();
    expect(authState.callback).toBeNull();
  });
});

describe('App cloud load', () => {
  it('loads the cloud profile and opens the dashboard as synced, mirrored to local storage', async () => {
    render(<App />);
    await signIn();
    expect(await screen.findByText('dashboard:נועה:synced:INVITE1')).toBeInTheDocument();
    expect(cloud.migrate).toHaveBeenCalledWith('u1', expect.objectContaining({ name: 'נועה' }));
    expect(JSON.parse(localStorage.getItem('english_tutor_learner_profile_v2')!).name).toBe('נועה');
  });

  it('shows a retry screen when the first cloud read fails, never the onboarding', async () => {
    cloud.migrate.mockRejectedValueOnce({ code: 'unavailable' });
    render(<App />);
    await signIn();
    expect(screen.getByRole('button', { name: 'retry-load' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'finish-onboarding' })).not.toBeInTheDocument();
    await act(async () => {
      screen.getByRole('button', { name: 'retry-load' }).click();
    });
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
  });

  it('signs out from the retry screen after saving', async () => {
    cloud.migrate.mockRejectedValueOnce(new Error('offline'));
    render(<App />);
    await signIn();
    await act(async () => {
      screen.getByRole('button', { name: 'load-sign-out' }).click();
    });
    expect(queue.flush).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('ignores a slow load of an earlier sign-in once the account changed', async () => {
    let finishFirst: (p: LearnerProfile) => void = () => undefined;
    cloud.migrate.mockImplementationOnce(() => new Promise<LearnerProfile>((resolve) => { finishFirst = resolve; }));
    render(<App />);
    const first = authState.callback!(USER);
    await act(async () => {
      await authState.callback!(null);
    });
    await act(async () => {
      finishFirst(makeProfile({ name: 'ישנה', hasSeenWelcomeGiftModal: true }));
      await first;
    });
    expect(screen.getByText('auth-gate:true')).toBeInTheDocument();
    expect(screen.queryByText(/dashboard:ישנה/)).not.toBeInTheDocument();
  });

  it('starts a new account from a clean profile named after the Google display name', async () => {
    cloud.migrate.mockResolvedValue(makeProfile({ isOnboarded: false, name: 'נועה' }));
    render(<App />);
    await signIn();
    expect(cloud.migrate.mock.calls[0][1]).toMatchObject({ name: 'נועה', createdAt: new Date(0).toISOString() });
  });
});

describe('App live sync', () => {
  it('merges a later cloud snapshot and follows its pending-write state', async () => {
    render(<App />);
    await signIn();
    act(() => authState.snapshotNext!({ exists: () => true, data: () => ({ name: 'מהענן' }), metadata: { hasPendingWrites: true } }));
    expect(await screen.findByText('dashboard:מהענן:syncing:INVITE1')).toBeInTheDocument();
    expect(cloud.merge).toHaveBeenCalled();
    act(() => authState.snapshotNext!({ exists: () => true, data: () => ({ name: 'מהענן' }), metadata: { hasPendingWrites: false } }));
    expect(await screen.findByText('dashboard:מהענן:synced:INVITE1')).toBeInTheDocument();
  });

  it('ignores a snapshot of a missing document', async () => {
    render(<App />);
    await signIn();
    act(() => authState.snapshotNext!({ exists: () => false }));
    expect(screen.getByText('dashboard:נועה:synced:INVITE1')).toBeInTheDocument();
  });

  it('shows an offline error when the listener fails', async () => {
    render(<App />);
    await signIn();
    act(() => authState.snapshotError!());
    expect(await screen.findByText('dashboard:נועה:offline-error:INVITE1')).toBeInTheDocument();
  });

  it('accepts the first snapshot as the profile when the first read failed, then opens the dashboard', async () => {
    cloud.migrate.mockRejectedValueOnce(new Error('offline'));
    render(<App />);
    await signIn();
    act(() => authState.snapshotNext!({ exists: () => true, data: () => ({ name: 'חזרנו', isOnboarded: true, hasSeenWelcomeGiftModal: true }), metadata: { hasPendingWrites: false } }));
    expect(cloud.buildLogin).toHaveBeenCalled();
    expect(await screen.findByText(/^dashboard:חזרנו/)).toBeInTheDocument();
  });

  it('stops listening when it unmounts', async () => {
    const { unmount } = render(<App />);
    await signIn();
    unmount();
    expect(authState.unsubscribeSnapshot).toHaveBeenCalled();
    expect(authState.unsubscribeAuth).toHaveBeenCalled();
  });
});

describe('App saving', () => {
  it('stamps a local change and schedules one cloud save for the signed-in learner', async () => {
    const user = userEvent.setup();
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'update-profile' }));
    expect(queue.schedule).toHaveBeenCalledTimes(1);
    const [uid, saved] = queue.schedule.mock.calls[0] as [string, LearnerProfile];
    expect(uid).toBe('u1');
    expect(saved.name).toBe('שינוי');
    expect(Date.parse(saved.updatedAt ?? "")).toBeGreaterThan(0);
    expect(await screen.findByText(/^dashboard:שינוי/)).toBeInTheDocument();
  });

  it('never saves before the cloud profile has loaded', async () => {
    cloud.migrate.mockRejectedValueOnce(new Error('offline'));
    render(<App />);
    await signIn();
    act(() => tracker.onSeconds?.(30));
    expect(queue.schedule).not.toHaveBeenCalled();
  });

  it('logs the active seconds of a signed-in learner', async () => {
    render(<App />);
    await signIn();
    await screen.findByText(/^dashboard:/);
    act(() => tracker.onSeconds!(30));
    expect(queue.schedule).toHaveBeenCalledTimes(1);
    const saved = queue.schedule.mock.calls[0][1] as LearnerProfile;
    expect(JSON.stringify(saved.activityLog)).toContain('30');
  });

  it('sends waiting changes out when the page is hidden or closed', async () => {
    render(<App />);
    await signIn();
    queue.flush.mockClear();
    window.dispatchEvent(new Event('pagehide'));
    expect(queue.flush).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(queue.flush).toHaveBeenCalledTimes(2);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(queue.flush).toHaveBeenCalledTimes(2);
  });

  it('passes the invite code on and clears it when handled', async () => {
    const user = userEvent.setup();
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'invite-handled' }));
    expect(inviteCleared).toHaveBeenCalledTimes(1);
  });
});

describe('App screens', () => {
  it('opens the settings from the dashboard and comes back', async () => {
    const user = userEvent.setup();
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'edit-profile' }));
    await user.click(await screen.findByRole('button', { name: 'close-settings' }));
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
  });

  it('signs out after saving, from the dashboard and from the settings', async () => {
    const user = userEvent.setup();
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'dash-sign-out' }));
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
    await user.click(screen.getByRole('button', { name: 'edit-profile' }));
    await user.click(await screen.findByRole('button', { name: 'settings-sign-out' }));
    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(2));
    expect(queue.flush).toHaveBeenCalled();
  });

  it('deletes the account after saving and discards held saves on success', async () => {
    const user = userEvent.setup();
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'edit-profile' }));
    await user.click(await screen.findByRole('button', { name: 'delete-account' }));
    await waitFor(() => expect(queue.discard).toHaveBeenCalledTimes(1));
    expect(account.deleteAccount).toHaveBeenCalledWith('K7MP2Q', '1234');
    expect(queue.hold).toHaveBeenCalledTimes(1);
    expect(queue.release).not.toHaveBeenCalled();
  });

  it('lets saves go again when the deletion fails', async () => {
    account.deleteAccount.mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'edit-profile' }));
    await user.click(await screen.findByRole('button', { name: 'delete-account' }));
    await waitFor(() => expect(queue.release).toHaveBeenCalledTimes(1));
    expect(queue.discard).not.toHaveBeenCalled();
  });

  it('applies the learner’s theme to the page and the browser bar', async () => {
    render(<App />);
    await signIn();
    await screen.findByText(/^dashboard:/);
    expect(document.querySelector('meta[name="theme-color"]')!.getAttribute('content')).not.toBe('#000000');
  });
});

describe('App first launch', () => {
  it('walks a new grade 1-2 learner through onboarding, the welcome chest, the first lesson and the first win', async () => {
    const user = userEvent.setup();
    cloud.migrate.mockResolvedValue(makeProfile({ isOnboarded: false, name: '' }));
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'finish-onboarding' }));
    await user.click(await screen.findByRole('button', { name: 'greeting-done' }));
    expect(queue.schedule.mock.calls.some(([, p]) => (p as LearnerProfile).hasSeenWelcomeGiftModal)).toBe(true);
    // Grade 1: the letters lesson comes next, and finishing it starts the streak
    await user.click(await screen.findByRole('button', { name: 'lesson-done' }));
    expect(queue.schedule.mock.calls.some(([, p]) => (p as LearnerProfile).stats.streakDays === 1)).toBe(true);
    // The first win (celebration and the reminder ask), then the home screen: no tour, no placement test
    await user.click(await screen.findByRole('button', { name: 'first-win-continue' }));
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
    expect(screen.queryByText(/placement:/)).not.toBeInTheDocument();
  });

  it('leaving the lesson early earns no streak day and no first win', async () => {
    const user = userEvent.setup();
    cloud.migrate.mockResolvedValue(makeProfile({ isOnboarded: false, name: '' }));
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'finish-onboarding' }));
    await user.click(await screen.findByRole('button', { name: 'greeting-done' }));
    await user.click(await screen.findByRole('button', { name: 'lesson-exit' }));
    expect(queue.schedule.mock.calls.some(([, p]) => (p as LearnerProfile).stats.streakDays === 1)).toBe(false);
    expect(screen.queryByRole('button', { name: 'first-win-continue' })).not.toBeInTheDocument();
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
  });

  it('goes straight home after the chest for a learner who already played (no lesson, no mission, no tour)', async () => {
    const user = userEvent.setup();
    cloud.migrate.mockResolvedValue(
      makeProfile({ name: 'נועה', gradeId: 'grade-4', hasSeenWelcomeGiftModal: false, missionProgress: { 'g4-u1-m1': 2 } })
    );
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'greeting-done' }));
    expect(screen.queryByRole('button', { name: 'lesson-done' })).not.toBeInTheDocument();
    expect(screen.queryByText('first-mission-mode')).not.toBeInTheDocument();
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
  });

  it('starts a new grade 3+ learner on their first mission, then the first win, then home', async () => {
    const user = userEvent.setup();
    cloud.migrate.mockResolvedValue(makeProfile({ name: 'נועה', gradeId: 'grade-4', hasSeenWelcomeGiftModal: false, missionProgress: {} }));
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'greeting-done' }));
    expect(await screen.findByText('first-mission-mode')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'first-mission-finished' }));
    await user.click(await screen.findByRole('button', { name: 'first-win-continue' }));
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
    expect(screen.queryByText('first-mission-mode')).not.toBeInTheDocument();
  });

  it('goes home without a first win when the first mission was left', async () => {
    const user = userEvent.setup();
    cloud.migrate.mockResolvedValue(makeProfile({ name: 'נועה', gradeId: 'grade-4', hasSeenWelcomeGiftModal: false, missionProgress: {} }));
    render(<App />);
    await signIn();
    await user.click(await screen.findByRole('button', { name: 'greeting-done' }));
    await user.click(await screen.findByRole('button', { name: 'first-mission-abandoned' }));
    expect(screen.queryByRole('button', { name: 'first-win-continue' })).not.toBeInTheDocument();
    expect(await screen.findByText(/^dashboard:/)).toBeInTheDocument();
    expect(screen.queryByText('first-mission-mode')).not.toBeInTheDocument();
  });
});

describe('App local profile', () => {
  it('keeps unreadable saved text as a backup before it is replaced', async () => {
    localStorage.setItem('english_tutor_learner_profile_v2', '{broken');
    render(<App />);
    expect(localStorage.getItem('english_tutor_learner_profile_v2_corrupt')).toBe('{broken');
    await signIn(null);
  });

  it('starts from the default profile when nothing is saved', async () => {
    render(<App />);
    await signIn(null);
    expect(screen.getByText('auth-gate:true')).toBeInTheDocument();
    expect(DEFAULT_PROFILE.isOnboarded).toBe(false);
  });
});
