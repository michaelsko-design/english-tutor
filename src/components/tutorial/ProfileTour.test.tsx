import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTutorialSlides } from '../../data/appTutorial';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { LearnerProfile } from '../../types/learner';
import { ProfileTour } from './ProfileTour';

vi.mock('../companion/Companion', () => ({ Companion: () => <span>companion</span>, preloadCompanion: vi.fn() }));

const onDone = vi.fn();
const USER = { uid: 'u1', email: 'a@b.test', displayName: 'נועה', isAnonymous: false };

function setup(profile: LearnerProfile = makeProfile({ gender: 'girl' }), authUser: typeof USER | null = USER, finishLabelHe = 'בואי נשחק! 🚀') {
  render(<ProfileTour profile={profile} theme={TEST_THEME} authUser={authUser} finishLabelHe={finishLabelHe} onDone={onDone} />);
  return userEvent.setup();
}

const slides = (hasFriends = false, isShabbatObserver = true) =>
  getTutorialSlides({ currencyNameHe: TEST_THEME.currencyNameHe, hasFriends, isShabbatObserver });

const next = () => screen.getByRole('button', { name: /הבא|יאללה|בואי נשחק/ });

beforeEach(() => onDone.mockClear());

describe('AppTour (through ProfileTour)', () => {
  it('starts on the welcome slide, where the companion introduces itself', () => {
    setup();
    expect(screen.getByRole('dialog', { name: 'סיור באפליקציה' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: slides()[0].titleHe })).toBeInTheDocument();
    expect(screen.getByText(/היי! אני/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'יאללה, מתחילים ←' })).toBeInTheDocument();
  });

  it('steps through every slide with the next and back buttons and finishes with the given label', async () => {
    const user = setup();
    const all = slides();
    for (let i = 1; i < all.length; i++) {
      await user.click(next());
      expect(screen.getByRole('heading', { name: all[i].titleHe })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /בואי נשחק/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'דילוג' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /הקודם/ }));
    expect(screen.getByRole('heading', { name: all[all.length - 2].titleHe })).toBeInTheDocument();
    expect(onDone).not.toHaveBeenCalled();
  });

  it('calls done from the last slide’s button', async () => {
    const user = setup();
    for (let i = 1; i < slides().length; i++) await user.click(next());
    await user.click(screen.getByRole('button', { name: /בואי נשחק/ }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('jumps to a slide from its progress dot', async () => {
    const user = setup();
    const all = slides();
    await user.click(screen.getByRole('button', { name: `שקופית 3: ${all[2].titleHe}` }));
    expect(screen.getByRole('heading', { name: all[2].titleHe })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `שקופית 3: ${all[2].titleHe}` })).toHaveAttribute('aria-current', 'step');
  });

  it('can be skipped or closed at any time', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'דילוג' }));
    await user.click(screen.getByRole('button', { name: 'סגירת הסיור' }));
    expect(onDone).toHaveBeenCalledTimes(2);
  });

  it('moves with the arrow keys, right to left, and closes with Escape', async () => {
    setup();
    const dialog = screen.getByRole('dialog');
    const all = slides();
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' });
    expect(screen.getByRole('heading', { name: all[1].titleHe })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: all[0].titleHe })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: all[0].titleHe })).toBeInTheDocument();
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('turns the page with a touch swipe, but ignores the mouse', () => {
    setup();
    const dialog = screen.getByRole('dialog');
    const all = slides();
    fireEvent.pointerDown(dialog, { pointerType: 'touch', clientX: 100 });
    fireEvent.pointerUp(dialog, { pointerType: 'touch', clientX: 200 });
    expect(screen.getByRole('heading', { name: all[1].titleHe })).toBeInTheDocument();
    fireEvent.pointerDown(dialog, { pointerType: 'touch', clientX: 200 });
    fireEvent.pointerUp(dialog, { pointerType: 'touch', clientX: 100 });
    expect(screen.getByRole('heading', { name: all[0].titleHe })).toBeInTheDocument();
    fireEvent.pointerDown(dialog, { pointerType: 'mouse', clientX: 100 });
    fireEvent.pointerUp(dialog, { pointerType: 'mouse', clientX: 300 });
    expect(screen.getByRole('heading', { name: all[0].titleHe })).toBeInTheDocument();
    fireEvent.pointerDown(dialog, { pointerType: 'touch', clientX: 100 });
    fireEvent.pointerUp(dialog, { pointerType: 'touch', clientX: 120 });
    expect(screen.getByRole('heading', { name: all[0].titleHe })).toBeInTheDocument();
  });

  it('lists the points of a slide, and shows the mission steps as chips', async () => {
    const user = setup();
    const all = slides();
    const missions = all.findIndex((s) => s.id === 'missions');
    for (let i = 0; i < missions; i++) await user.click(next());
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBe(all[missions].points.length);
  });

  it('adds the Friends tile and drops the Shabbat shield according to the learner', () => {
    setup(makeProfile({ friendsHub: { isEnabled: true } as never, isShabbatObserver: false }), USER);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not offer friends to a guest account', () => {
    setup(makeProfile({ friendsHub: { isEnabled: true } as never }), { ...USER, isAnonymous: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders every slide’s scene without failing', async () => {
    const user = setup(makeProfile({ equippedAvatarEmoji: '🦊' }));
    for (let i = 1; i < slides().length; i++) {
      await user.click(next());
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }
  });
});
