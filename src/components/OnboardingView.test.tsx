import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { OnboardingView } from './OnboardingView';

vi.mock('./companion/Companion', () => ({ preloadCompanion: vi.fn() }));
vi.mock('../hooks/useProAccess', () => ({ useProAccess: () => ({ isPro: false }) }));

function setup(initial = { ...DEFAULT_PROFILE, name: '' }) {
  const onComplete = vi.fn();
  render(<OnboardingView initialProfile={initial} onComplete={onComplete} />);
  return { onComplete, user: userEvent.setup() };
}

const submit = () => screen.getByRole('button', { name: /יאללה|שמירה וכניסה/ });
const gradeChip = (label: string) => screen.getByRole('button', { name: label });

describe('OnboardingView', () => {
  it('asks for a name before starting', async () => {
    const { onComplete, user } = setup();
    await user.click(submit());
    expect(screen.getByText(/כתבי את השם שלך/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('asks only for name, gender and grade: no age, theme or Shabbat fields', () => {
    setup();
    expect(screen.queryByLabelText('גיל')).not.toBeInTheDocument();
    expect(screen.queryByText(/שבת/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /בת/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /בן/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { pressed: undefined }).length).toBeGreaterThan(12);
  });

  it('saves the chosen grade and derives the age from it', async () => {
    const { onComplete, user } = setup({ ...DEFAULT_PROFILE, name: '' });
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'מיה');
    await user.click(gradeChip('כיתה י׳'));
    await user.click(submit());
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toMatchObject({
      name: 'מיה',
      gradeId: 'grade-10',
      age: 15,
      isOnboarded: true,
    });
  });

  it('keeps the gender the learner picks', async () => {
    const { onComplete, user } = setup({ ...DEFAULT_PROFILE, name: '', gender: 'girl' });
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'דן');
    await user.click(screen.getByRole('button', { name: /בן/ }));
    await user.click(gradeChip('כיתה ט׳'));
    await user.click(submit());
    expect(onComplete.mock.calls[0][0]).toMatchObject({ gender: 'boy' });
  });

  it('needs a parent to agree to the privacy notice in grades 1-7 (under 13)', async () => {
    const { onComplete, user } = setup();
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'מיה');
    await user.click(gradeChip('כיתה ד׳'));
    await user.click(submit());
    expect(screen.getByText(/מתחת לגיל 13/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('checkbox'));
    await user.click(submit());
    expect(onComplete.mock.calls[0][0]).toMatchObject({ gradeId: 'grade-4', age: 9 });
  });

  it('opens the privacy notice from the consent box', async () => {
    const { user } = setup();
    await user.click(gradeChip('כיתה ב׳'));
    await user.click(screen.getByRole('button', { name: 'מדיניות הפרטיות' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows no consent box from grade 8 (age 13)', async () => {
    const { user } = setup({ ...DEFAULT_PROFILE, name: 'דן' });
    await user.click(gradeChip('כיתה ח׳'));
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
