import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { FirstLaunchGreeting } from './FirstLaunchGreeting';

vi.mock('../companion/Companion', () => ({ Companion: () => <span>companion</span>, preloadCompanion: vi.fn() }));

const onDone = vi.fn();

function setup(props: { gender?: 'girl' | 'boy'; name?: string; nextStep?: 'start' | 'lesson' | 'mission' } = {}) {
  render(<FirstLaunchGreeting theme={TEST_THEME} gender={props.gender ?? 'girl'} name={props.name ?? 'מיה'} welcomeGems={25} nextStep={props.nextStep} onDone={onDone} />);
  return userEvent.setup();
}

beforeEach(() => {
  onDone.mockClear();
});

describe('FirstLaunchGreeting', () => {
  it('greets the learner by name with the closed chest', () => {
    setup();
    expect(screen.getByText(/היי מיה! ברוכה הבאה/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'פתיחת תיבת המתנה' })).toBeEnabled();
  });

  it('uses a default title and masculine copy for a boy without a name', () => {
    setup({ gender: 'boy', name: '  ' });
    expect(screen.getByText(/היי אלוף! ברוך הבא/)).toBeInTheDocument();
    expect(screen.getByText(/הקש על התיבה/)).toBeInTheDocument();
  });

  it('opens the chest once and reveals the gems and the start button', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'פתיחת תיבת המתנה' }));
    expect(screen.getByRole('button', { name: 'התיבה נפתחה: 25 יהלומים' })).toBeDisabled();
    expect(screen.getByRole('heading', { name: /קיבלת 25/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /בואי נתחיל/ }));
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});

describe('FirstLaunchGreeting next step', () => {
  it.each([
    ['lesson', /נלמד אותיות/],
    ['mission', /משימה ראשונה/],
  ] as const)('leads into the %s', async (nextStep, label) => {
    const user = setup({ nextStep });
    await user.click(screen.getByRole('button', { name: 'פתיחת תיבת המתנה' }));
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });
});
