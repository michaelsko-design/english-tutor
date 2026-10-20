/**
 * Verifies a Firebase App Check token (sent by the web app in the X-Firebase-AppCheck header), which
 * shows the request came from the real app and not a script that only has the public API key.
 * Checks: an RS256 signature by one of App Check's current keys, issued by this project's App Check
 * and addressed to the project (by number) in `aud`.
 */
import { createRs256Verifier, type VerifierDeps } from './firebaseToken.js';

const APP_CHECK_JWKS_URL = 'https://firebaseappcheck.googleapis.com/v1/jwks';

export function createAppCheckTokenVerifier(deps: VerifierDeps = {}) {
  const verifiers = new Map<string, (token: string) => Promise<boolean>>();
  return async function verifyAppCheckToken(token: string, projectNumber: string): Promise<boolean> {
    let verify = verifiers.get(projectNumber);
    if (!verify) {
      verify = createRs256Verifier({
        ...deps,
        jwksUrl: APP_CHECK_JWKS_URL,
        hasValidClaims: (payload) =>
          payload.iss === `https://firebaseappcheck.googleapis.com/${projectNumber}` &&
          Array.isArray(payload.aud) &&
          payload.aud.includes(`projects/${projectNumber}`),
      });
      verifiers.set(projectNumber, verify);
    }
    return verify(token);
  };
}

export const verifyAppCheckToken = createAppCheckTokenVerifier();
