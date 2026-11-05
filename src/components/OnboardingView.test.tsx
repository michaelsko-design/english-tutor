import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { OnboardingView } from './OnboardingView';

vi.mock('./companion/Companion', () => ({ preloadCompanion: vi.fn() }));
vi.mock('../hooks/useProAccess', () => ({ useProAccess: () => ({ isPro: false }) }));

function setup(initial = { ...DEFAULT_PROFILE, name: '', age: 12 }) {
  const onComplete = vi.fn();
  render(<OnboardingView initialProfile={initial} onComplete={onComplete} />);
  return { onComplete, user: userEvent.setup() };
}

const submit = () => screen.getByRole('button', { name: /שמירה וכניסה/ });

describe('OnboardingView', () => {
  it('asks for a name before starting', async () => {
    const { onComplete, user } = setup();
    await user.click(submit());
    expect(screen.getByText(/כתבי את השם שלך/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('saves the profile once a name is typed', async () => {
    const { onComplete, user } = setup({ ...DEFAULT_PROFILE, name: '', age: 14 });
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'מיה');
    await user.click(submit());
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({ name: 'מיה', age: 14, isOnboarded: true });
  });

  it('needs a parent to agree to the privacy notice under 13', async () => {
    const { onComplete, user } = setup();
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'מיה');
    await user.selectOptions(screen.getByLabelText('גיל'), '9');
    await user.click(submit());
    expect(screen.getByText(/מתחת לגיל 13/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('checkbox'));
    await user.click(submit());
    expect(onComplete.mock.calls[0][0]).toMatchObject({ age: 9 });
  });

  it('opens the privacy notice and shows no consent box from age 13', async () => {
    const { user } = setup({ ...DEFAULT_PROFILE, name: '', age: 9 });
    await user.click(screen.getByRole('button', { name: 'מדיניות הפרטיות' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows no consent box for a learner of 13 or older', () => {
    setup({ ...DEFAULT_PROFILE, name: 'דן', age: 14 });
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
