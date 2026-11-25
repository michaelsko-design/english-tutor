import { describe, expect, it, vi } from 'vitest';
import { createCloudClient, parseCloudConfig } from './reviewCloudClient';

describe('parseCloudConfig', () => {
  it('is null until both values are set', () => {
    expect(parseCloudConfig({})).toBeNull();
    expect(parseCloudConfig({ HEBREW_REVIEW_URL: 'https://x.dev' })).toBeNull();
  });

  it('drops a trailing slash', () => {
    expect(parseCloudConfig({ HEBREW_REVIEW_URL: 'https://x.dev/', HEBREW_REVIEW_TOKEN: 't' })).toEqual({ url: 'https://x.dev', token: 't' });
  });

  it('refuses plain http except on this PC', () => {
    expect(() => parseCloudConfig({ HEBREW_REVIEW_URL: 'http://x.dev', HEBREW_REVIEW_TOKEN: 't' })).toThrow('https');
    expect(parseCloudConfig({ HEBREW_REVIEW_URL: 'http://localhost:8787', HEBREW_REVIEW_TOKEN: 't' })).not.toBeNull();
  });
});

describe('createCloudClient', () => {
  const config = { url: 'https://x.dev', token: 'secret' };

  it('sends the token and clears a long list in batches', async () => {
    const send = vi.fn(async () => new Response('{"ok":true}'));
    const refs = Array.from({ length: 1001 }, (_, i) => ({ key: `k${i}`, markedAt: '2026-11-25T10:00:00.000Z' }));
    await createCloudClient(config, send).clearInbox(refs);
    expect(send).toHaveBeenCalledTimes(3);
    expect(send).toHaveBeenCalledWith('https://x.dev/api/inbox/clear', expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer secret' }) }));
  });

  it('says what the page answered when it refuses', async () => {
    const send = vi.fn(async () => new Response('{}', { status: 401 }));
    await expect(createCloudClient(config, send).getInbox()).rejects.toThrow('401');
  });
});
