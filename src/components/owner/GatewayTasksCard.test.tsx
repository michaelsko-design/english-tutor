import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GatewayTask } from '../../services/ownerGatewayTasksService';

const service = vi.hoisted(() => ({ markGatewayTaskDone: vi.fn() }));
vi.mock('../../services/ownerGatewayTasksService', () => service);

import { GatewayTasksCard } from './GatewayTasksCard';

const NOW = Date.UTC(2026, 10, 13, 12);
const HOUR = 60 * 60 * 1000;

const task = (overrides: Partial<GatewayTask> = {}): GatewayTask => ({
  id: 'sub1_cancel', kind: 'cancel', subscriptionId: 'sub1', amountAgorot: 0, dueAt: Date.UTC(2026, 10, 20), note: 'Cancel the standing order in Grow',
  payerName: 'ישראל ישראלי', payerPhone: '0501234567', payerEmail: '', createdAt: NOW - HOUR, doneAt: 0, ...overrides,
});

beforeEach(() => {
  service.markGatewayTaskDone.mockReset();
});

describe('GatewayTasksCard', () => {
  it('says there is nothing to do when no task is open', () => {
    render(<GatewayTasksCard tasks={[]} nowMs={NOW} />);
    expect(screen.getByText('Nothing to do in Grow.')).toBeInTheDocument();
  });

  it('shows what to do, for whom and by when', () => {
    render(<GatewayTasksCard tasks={[task(), task({ id: 'sub2_amount', kind: 'amount', amountAgorot: 8900 })]} nowMs={NOW} />);
    expect(screen.getByText('Cancel the standing order')).toBeInTheDocument();
    expect(screen.getByText(/Change the standing order amount/)).toHaveTextContent('₪89');
    expect(screen.getAllByText('0501234567')[0].closest('a')).toHaveAttribute('href', 'tel:0501234567');
    expect(screen.getAllByText(/before 20 Nov/)).toHaveLength(2);
  });

  it('names a standing order that is about to run out', () => {
    render(<GatewayTasksCard tasks={[task({ id: 'sub1_extend_1', kind: 'extend', note: 'The standing order has one charge left: add 12 more charges to it in Grow' })]} nowMs={NOW} />);
    expect(screen.getByText(/Extend the standing order/)).toBeInTheDocument();
    expect(screen.getByText(/add 12 more charges/)).toBeInTheDocument();
  });

  it('flags tasks open for more than a day', () => {
    render(<GatewayTasksCard tasks={[task({ createdAt: NOW - 30 * HOUR })]} nowMs={NOW} />);
    expect(screen.getByText(/1 open for more than a day/)).toBeInTheDocument();
  });

  it('closes a task when the owner presses Done', async () => {
    const user = userEvent.setup();
    service.markGatewayTaskDone.mockResolvedValue({ ok: true, tasks: [] });
    render(<GatewayTasksCard tasks={[task()]} nowMs={NOW} />);

    await user.click(screen.getByRole('button', { name: /Done: Cancel the standing order/ }));

    expect(service.markGatewayTaskDone).toHaveBeenCalledWith('sub1_cancel');
    expect(await screen.findByText('Nothing to do in Grow.')).toBeInTheDocument();
  });

  it('keeps the task and shows the message when saving fails', async () => {
    const user = userEvent.setup();
    service.markGatewayTaskDone.mockResolvedValue({ ok: false, message: 'No connection.' });
    render(<GatewayTasksCard tasks={[task()]} nowMs={NOW} />);

    await user.click(screen.getByRole('button', { name: /Done:/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No connection.');
    expect(screen.getByText('Cancel the standing order')).toBeInTheDocument();
  });
});
