import { describe, expect, it, vi } from 'vitest';
import { createEmulatorFetch, handleDevPaymentsRequest, verifyEmulatorToken } from './devPaymentsApi';

const PROJECT = 'demo-english-vibe';

function token(claims: Record<string, unknown>): string {
  const part = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${part({ alg: 'none' })}.${part(claims)}.`;
}

const validClaims = () => ({
  aud: PROJECT,
  iss: `https://securetoken.google.com/${PROJECT}`,
  sub: 'parent1',
  exp: Math.floor(Date.now() / 1000) + 600,
});

describe('verifyEmulatorToken', () => {
  it("accepts an emulator token for the project and refuses others'", async () => {
    expect(await verifyEmulatorToken(token(validClaims()), PROJECT)).toBe(true);
    expect(await verifyEmulatorToken(token({ ...validClaims(), aud: 'english-tutor-il-7' }), PROJECT)).toBe(false);
    expect(await verifyEmulatorToken(token({ ...validClaims(), exp: 1 }), PROJECT)).toBe(false);
    expect(await verifyEmulatorToken('not-a-token', PROJECT)).toBe(false);
  });
});

describe('createEmulatorFetch', () => {
  it('sends Firestore to the emulator, answers the token request, and refuses any other host', async () => {
    const real = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}'));
    const emulatorFetch = createEmulatorFetch('http://127.0.0.1:8080');

    await emulatorFetch('https://firestore.googleapis.com/v1/projects/demo-x/databases/(default)/documents/a/b');
    expect(real).toHaveBeenCalledWith('http://127.0.0.1:8080/v1/projects/demo-x/databases/(default)/documents/a/b', undefined);
    expect(await (await emulatorFetch('https://oauth2.googleapis.com/token')).json()).toMatchObject({ access_token: 'owner' });
    await expect(emulatorFetch('https://sandbox.meshulam.co.il/api')).rejects.toThrow(/refusing/);
    real.mockRestore();
  });
});

describe('handleDevPaymentsRequest', () => {
  it('runs only against a local emulator and a demo project', async () => {
    const request = () => new Request('http://localhost/api/checkout', { method: 'POST', body: '{}' });
    expect((await handleDevPaymentsRequest('/api/checkout', request(), { firestoreOrigin: 'https://firestore.googleapis.com', projectId: PROJECT }))?.status).toBe(503);
    expect((await handleDevPaymentsRequest('/api/checkout', request(), { firestoreOrigin: 'http://127.0.0.1:8080', projectId: 'english-tutor-il-7' }))?.status).toBe(503);
  });

  it('leaves other paths alone and checks the stand-in payment body', async () => {
    const config = { firestoreOrigin: 'http://127.0.0.1:8080', projectId: PROJECT };
    expect(await handleDevPaymentsRequest('/api/tts', new Request('http://localhost/api/tts'), config)).toBeNull();
    const badPay = new Request('http://localhost/api/mock-pay', { method: 'POST', body: JSON.stringify({ checkoutId: '../x' }) });
    expect((await handleDevPaymentsRequest('/api/mock-pay', badPay, config))?.status).toBe(400);
  });
});
