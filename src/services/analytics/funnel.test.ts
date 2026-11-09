import { describe, expect, it, vi } from 'vitest';
import { trackFunnel } from './funnel';

const okFetch = () => vi.fn(async () => new Response(null, { status: 204 })) as unknown as typeof fetch;

describe('trackFunnel', () => {
  it('posts the step once, however often it is reported', () => {
    const send = okFetch();
    trackFunnel('gate_view', send, true);
    trackFunnel('gate_view', send, true);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('/api/funnel', expect.objectContaining({ method: 'POST', body: JSON.stringify({ event: 'gate_view' }) }));
  });

  it('does nothing when analytics are off', () => {
    const send = okFetch();
    trackFunnel('signup_started', send, false);
    expect(send).not.toHaveBeenCalled();
  });

  it('never throws when the network fails', async () => {
    const send = vi.fn(async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;
    expect(() => trackFunnel('signup_done', send, true)).not.toThrow();
    await Promise.resolve();
  });
});
