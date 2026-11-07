import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OwnerTestersView } from '../../services/ownerTestersService';

const service = vi.hoisted(() => ({
  fetchTesters: vi.fn(),
  createInvites: vi.fn(),
  withdrawInvite: vi.fn(),
  lockOutTester: vi.fn(),
  inviteLink: (origin: string, code: string) => `${origin}/?access=${code}`,
}));
vi.mock('../../services/ownerTestersService', () => service);

import { EarlyTestersCard, parseAliases } from './EarlyTestersCard';

const view = (overrides: Partial<OwnerTestersView> = {}): OwnerTestersView => ({ accessOpen: false, testers: [], invites: [], ...overrides });

beforeEach(() => {
  service.fetchTesters.mockReset().mockResolvedValue({ ok: true, view: view() });
  service.createInvites.mockReset();
  service.withdrawInvite.mockReset();
  service.lockOutTester.mockReset();
});

describe('parseAliases', () => {
  it('splits on lines and commas and drops blanks', () => {
    expect(parseAliases(' noa, dana\n\n kid-3 ')).toEqual(['noa', 'dana', 'kid-3']);
  });
});

describe('EarlyTestersCard', () => {
  it('says access is closed and nothing is invited yet', async () => {
    render(<EarlyTestersCard />);
    expect(await screen.findByText(/Access is closed/)).toBeInTheDocument();
    expect(screen.getByText('No invites yet.')).toBeInTheDocument();
  });

  it('warns loudly when access is open', async () => {
    service.fetchTesters.mockResolvedValue({ ok: true, view: view({ accessOpen: true }) });
    render(<EarlyTestersCard />);
    expect(await screen.findByText(/Access is OPEN/)).toBeInTheDocument();
  });

  it('creates invites for the typed aliases with cohort and days', async () => {
    const user = userEvent.setup();
    service.createInvites.mockResolvedValue({
      ok: true,
      view: view({ invites: [{ code: 'ABCDEFGH23', label: 'noa', cohort: 'tester', createdAt: 1, expiresAt: Date.now() + 1e9, status: 'open' }] }),
    });
    render(<EarlyTestersCard />);
    await user.type(await screen.findByLabelText('Aliases, one per line'), 'noa{Enter}dana');
    await user.click(screen.getByRole('button', { name: /Create invites/ }));
    expect(service.createInvites).toHaveBeenCalledWith(['noa', 'dana'], 'tester', 14);
    expect(await screen.findByRole('button', { name: 'Copy link for noa' })).toBeInTheDocument();
  });

  it('shows the server message when creating fails', async () => {
    const user = userEvent.setup();
    service.createInvites.mockResolvedValue({ ok: false, message: 'Could not update the testers' });
    render(<EarlyTestersCard />);
    await user.type(await screen.findByLabelText('Aliases, one per line'), 'noa');
    await user.click(screen.getByRole('button', { name: /Create invites/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not update the testers');
  });

  it('locks a tester out only after the owner confirms', async () => {
    const user = userEvent.setup();
    service.fetchTesters.mockResolvedValue({
      ok: true,
      view: view({ testers: [{ uid: 'u1', label: 'noa', cohort: 'tester', invitedAt: 1, isGrandfathered: false }] }),
    });
    service.lockOutTester.mockResolvedValue({ ok: true, view: view() });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    render(<EarlyTestersCard />);
    const button = await screen.findByRole('button', { name: 'Lock noa out' });
    await user.click(button);
    expect(service.lockOutTester).not.toHaveBeenCalled();
    await user.click(button);
    expect(service.lockOutTester).toHaveBeenCalledWith('u1');
    confirm.mockRestore();
  });

  it('does not offer copy or withdraw for a used invite', async () => {
    service.fetchTesters.mockResolvedValue({
      ok: true,
      view: view({ invites: [{ code: 'ABCDEFGH23', label: 'noa', cohort: 'tester', createdAt: 1, expiresAt: 2, status: 'used' }] }),
    });
    render(<EarlyTestersCard />);
    expect(await screen.findByText('used')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Copy link/ })).toBeNull();
  });
});
