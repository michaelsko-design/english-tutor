import { useCallback, useState } from 'react';
import { parseInviteParam } from '../data/friends';

const PENDING_INVITE_KEY = 'english_tutor_pending_friend_invite';

function readPendingInvite(): string | null {
  try {
    const fromUrl = parseInviteParam(window.location.search);
    if (fromUrl) {
      // Keep it through sign-in and onboarding, and take it out of the address bar
      sessionStorage.setItem(PENDING_INVITE_KEY, fromUrl);
      const url = new URL(window.location.href);
      url.searchParams.delete('invite');
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      return fromUrl;
    }
    return sessionStorage.getItem(PENDING_INVITE_KEY);
  } catch {
    return null;
  }
}

/**
 * Feature 19: the friend code from an invite link (`/?invite=CODE`), kept until the Friends Hub
 * has shown it to the learner.
 */
export function usePendingInvite(): [string | null, () => void] {
  const [code, setCode] = useState<string | null>(readPendingInvite);
  const clear = useCallback(() => {
    try {
      sessionStorage.removeItem(PENDING_INVITE_KEY);
    } catch {
      // ignore storage errors
    }
    setCode(null);
  }, []);
  return [code, clear];
}
