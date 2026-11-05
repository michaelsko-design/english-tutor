import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppErrorBoundary } from './AppErrorBoundary';

vi.mock('./companion/Companion', () => ({ Companion: () => <span>companion</span> }));

let shouldThrow = true;
const Bomb = () => {
  if (shouldThrow) throw new Error('boom');
  return <p>הכול תקין</p>;
};

beforeEach(() => {
  shouldThrow = true;
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => vi.restoreAllMocks());

describe('AppErrorBoundary', () => {
  it('renders its children when nothing fails', () => {
    shouldThrow = false;
    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>
    );
    expect(screen.getByText('הכול תקין')).toBeInTheDocument();
  });

  it('shows a friendly screen on a render error and logs it', () => {
    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('אופס, משהו השתבש');
    expect(console.error).toHaveBeenCalled();
  });

  it('tries again and shows the children once the error is gone', async () => {
    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>
    );
    shouldThrow = false;
    await userEvent.setup().click(screen.getByRole('button', { name: 'ננסה שוב' }));
    expect(screen.getByText('הכול תקין')).toBeInTheDocument();
  });

  it('survives a broken stored profile when picking the theme', () => {
    localStorage.setItem('english_tutor_learner_profile_v2', '{not json');
    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    localStorage.clear();
  });
});
