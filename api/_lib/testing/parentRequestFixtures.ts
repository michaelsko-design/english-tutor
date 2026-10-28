/** Request helpers shared by the parent-facing functions' tests. */
import { vi } from 'vitest';

export const SERVICE_ACCOUNT_JSON = JSON.stringify({ client_email: 'svc@p.iam', private_key: 'unused-in-these-tests' });

export function idToken(uid: string, provider = 'google.com'): string {
  const payload = Buffer.from(JSON.stringify({ sub: uid, firebase: { sign_in_provider: provider } })).toString('base64url');
  return `header.${payload}.signature`;
}

export function parentRequest(path: string, body: unknown, uid = 'parent1', provider = 'google.com'): Request {
  return new Request(`https://app.test${path}`, {
    method: 'POST',
    headers: { 'X-Firebase-Token': idToken(uid, provider) },
    body: JSON.stringify(body),
  });
}

/** A fetch that answers the parentLinks reads: 200 for the linked pairs, 404 otherwise. */
export function linksFetch(linked: string[]) {
  return vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async (url) => {
    const match = /parentLinks\/([^?]+)/.exec(String(url));
    return new Response('{}', { status: match && linked.includes(match[1]) ? 200 : 404 });
  });
}
