import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RemoveTesterDialog } from './RemoveTesterDialog';

function setup(isBusy = false) {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  render(<RemoveTesterDialog expected="noa" kind="alias" isBusy={isBusy} onConfirm={onConfirm} onCancel={onCancel} />);
  return { onConfirm, onCancel, deleteButton: screen.getByRole('button', { name: 'Delete forever' }) };
}

describe('RemoveTesterDialog', () => {
  it('warns that the sign-in and all data are deleted for good, with Cancel focused', () => {
    setup();
    expect(screen.getByRole('alertdialog')).toHaveTextContent(/cannot be undone/);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  });

  it('keeps Delete forever disabled until the exact alias is typed', async () => {
    const user = userEvent.setup();
    const { onConfirm, deleteButton } = setup();
    expect(deleteButton).toBeDisabled();
    const input = screen.getByLabelText(/Type noa to confirm/);
    await user.type(input, 'no');
    expect(deleteButton).toBeDisabled();
    await user.type(input, 'x');
    expect(deleteButton).toBeDisabled();
    await user.clear(input);
    await user.type(input, 'noa');
    expect(deleteButton).toBeEnabled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirms once with the typed text, and Enter in the field alone never deletes before it matches', async () => {
    const user = userEvent.setup();
    const { onConfirm } = setup();
    const input = screen.getByLabelText(/Type noa to confirm/);
    await user.type(input, 'wrong{Enter}');
    expect(onConfirm).not.toHaveBeenCalled();
    await user.clear(input);
    await user.type(input, 'noa');
    await user.click(screen.getByRole('button', { name: 'Delete forever' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith('noa');
  });

  it('cancels with the button or Escape without deleting', async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = setup();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('cannot be confirmed while a request is running', async () => {
    const user = userEvent.setup();
    const { deleteButton } = setup(true);
    await user.type(screen.getByLabelText(/Type noa to confirm/), 'noa');
    expect(deleteButton).toBeDisabled();
  });
});
