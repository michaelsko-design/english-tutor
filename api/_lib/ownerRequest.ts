/**
 * Shared by the owner-only functions (stats, test-account list): only the owner's Google account
 * (`OWNER_UID`) passes, and the service account must be configured.
 */
import { parseServiceAccount, type ServiceAccount } from './googleAdmin.js';
import {
  authenticateParent,
  errorResponse,
  firebaseProjectId,
  type ParentRequestDeps,
} from './parentRequest.js';
import { safeEqual } from './payments/provider.js';

export interface OwnerCaller {
  account: ServiceAccount;
  projectId: string;
}

/** The service account and project when the caller is the owner, or the error response to send. */
export async function authenticateOwner(
  request: Request,
  env: Record<string, string | undefined>,
  deps: ParentRequestDeps = {}
): Promise<OwnerCaller | Response> {
  const ownerUid = env.OWNER_UID;
  if (!ownerUid) return errorResponse(503, 'The owner dashboard is not configured');
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;
  if (!safeEqual(caller.parentUid, ownerUid)) return errorResponse(403, 'Owner only');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'The owner dashboard is not configured');
  return { account, projectId: firebaseProjectId(env) };
}
