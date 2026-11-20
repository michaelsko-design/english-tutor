import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { DeleteParentAccount } from './DeleteParentAccount';

describe('DeleteParentAccount', () => {
  it('explains what is deleted and deletes only after the parent confirms', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn(async () => ({ ok: true as const }));
    render(<DeleteParentAccount theme={TEST_THEME} hasRenewingPlan={false} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'מחיקת חשבון ההורה' }));
    expect(screen.getByRole('region', { name: 'מחיקת חשבון ההורה' })).toHaveTextContent('החשבונות של הילדים וההתקדמות שלהם נשארים');
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'מחיקה לצמיתות' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('asks to cancel a renewing plan first, and will not delete until then', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn(async () => ({ ok: true as const }));
    render(<DeleteParentAccount theme={TEST_THEME} hasRenewingPlan onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'מחיקת חשבון ההורה' }));
    expect(screen.getByRole('alert')).toHaveTextContent('קודם צריך לבטל את החידוש');
    expect(screen.getByRole('button', { name: 'מחיקה לצמיתות' })).toBeDisabled();
  });

  it('waits for the plans to load before it can delete', async () => {
    const user = userEvent.setup();
    render(<DeleteParentAccount theme={TEST_THEME} hasRenewingPlan={null} onDelete={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'מחיקת חשבון ההורה' }));
    expect(screen.getByRole('status')).toHaveTextContent('בודקים את המנויים');
    expect(screen.getByRole('button', { name: 'מחיקה לצמיתות' })).toBeDisabled();
  });

  it('shows the error and lets the parent try again or close', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn(async () => ({ ok: false as const, errorHe: 'החלון נסגר לפני סיום הפעולה.' }));
    render(<DeleteParentAccount theme={TEST_THEME} hasRenewingPlan={false} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: 'מחיקת חשבון ההורה' }));
    await user.click(screen.getByRole('button', { name: 'מחיקה לצמיתות' }));
    expect(screen.getByRole('alert')).toHaveTextContent('החלון נסגר');
    expect(screen.getByRole('button', { name: 'מחיקה לצמיתות' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'ביטול' }));
    expect(screen.queryByRole('region', { name: 'מחיקת חשבון ההורה' })).not.toBeInTheDocument();
  });
});
