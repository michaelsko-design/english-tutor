import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TestUserEntry } from '../../services/ownerTestUsersService';

const service = vi.hoisted(() => ({ fetchTestUsers: vi.fn(), addTestUser: vi.fn(), removeTestUser: vi.fn() }));
vi.mock('../../services/ownerTestUsersService', () => service);

import { TestAccountsCard } from './TestAccountsCard';

const entry = (uid: string, label: string): TestUserEntry => ({ uid, label, addedAt: 1 });

beforeEach(() => {
  service.fetchTestUsers.mockReset().mockResolvedValue({ ok: true, users: [] });
  service.addTestUser.mockReset();
  service.removeTestUser.mockReset();
});

describe('TestAccountsCard', () => {
  it('says every account is counted while the list is empty', async () => {
    render(<TestAccountsCard onChanged={() => {}} />);
    expect(await screen.findByText(/No test accounts yet/)).toBeInTheDocument();
  });

  it('lists the saved test accounts', async () => {
    service.fetchTestUsers.mockResolvedValue({ ok: true, users: [entry('u1', 'noa-test'), entry('u2', 'me@gmail.com')] });
    render(<TestAccountsCard onChanged={() => {}} />);
    expect(await screen.findByText('noa-test')).toBeInTheDocument();
    expect(screen.getByText('me@gmail.com')).toBeInTheDocument();
  });

  it('adds an account, clears the box and tells the dashboard to reload its numbers', async () => {
    const user = userEvent.setup();
    const onChanged = vi.fn();
    service.addTestUser.mockResolvedValue({ ok: true, users: [entry('u1', 'noa-test')] });
    render(<TestAccountsCard onChanged={onChanged} />);

    await user.type(await screen.findByLabelText('Username, email or uid'), '  noa-test ');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(service.addTestUser).toHaveBeenCalledWith('noa-test');
    expect(await screen.findByText('noa-test')).toBeInTheDocument();
    expect(screen.getByLabelText('Username, email or uid')).toHaveValue('');
    expect(onChanged).toHaveBeenCalledTimes(1);
  });

  it('shows the server message and keeps the text when the account is not found', async () => {
    const user = userEvent.setup();
    const onChanged = vi.fn();
    service.addTestUser.mockResolvedValue({ ok: false, message: 'No account found with that username, email or uid' });
    render(<TestAccountsCard onChanged={onChanged} />);

    await user.type(await screen.findByLabelText('Username, email or uid'), 'ghost');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No account found');
    expect(screen.getByLabelText('Username, email or uid')).toHaveValue('ghost');
    expect(onChanged).not.toHaveBeenCalled();
  });

  it('does not submit an empty box', async () => {
    render(<TestAccountsCard onChanged={() => {}} />);
    await screen.findByText(/No test accounts yet/);
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('removes an account so it is counted again', async () => {
    const user = userEvent.setup();
    const onChanged = vi.fn();
    service.fetchTestUsers.mockResolvedValue({ ok: true, users: [entry('u1', 'noa-test')] });
    service.removeTestUser.mockResolvedValue({ ok: true, users: [] });
    render(<TestAccountsCard onChanged={onChanged} />);

    await user.click(await screen.findByRole('button', { name: 'Count noa-test again' }));

    expect(service.removeTestUser).toHaveBeenCalledWith('u1');
    await waitFor(() => expect(screen.getByText(/No test accounts yet/)).toBeInTheDocument());
    expect(onChanged).toHaveBeenCalledTimes(1);
  });

  it('shows how many test accounts there are', async () => {
    service.fetchTestUsers.mockResolvedValue({ ok: true, users: [entry('u1', 'a'), entry('u2', 'b'), entry('u3', 'c')] });
    render(<TestAccountsCard onChanged={() => {}} />);
    expect(await screen.findByRole('heading', { name: 'Test accounts 3' })).toBeInTheDocument();
  });
});
