/**
 * /api/owner-testers: early-tester management for the closed testing phase. Owner only.
 *   GET                                 -> { accessOpen, testers, invites }
 *   POST   { labels, cohort?, days? }   creates one single-use invite per label; answers like GET
 *   POST   { archiveFinished: true }    archives every used or expired invite (hidden from the list, kept in the database)
 *   DELETE { code }                     withdraws an unused invite; answers like GET
 *   DELETE { uid }                      locks a tester out (deletes allowed/{uid} and a comp entitlement)
 * Reads and writes `invites`, `allowed`, `config/access` and `entitlements` (admin only). The
 * redeeming side is /api/redeem-invite. Labels are aliases, never full names.
 */
import { randomInt } from 'node:crypto';
import { ConflictError, createFirestoreAdmin, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError } from './_lib/googleAdmin.js';
import { authenticateOwner } from './_lib/ownerRequest.js';
import { errorResponse, jsonResponse, readJsonBody, type ParentRequestDeps } from './_lib/parentRequest.js';

const MAX_BODY_BYTES = 4096;
const MAX_LABELS_PER_CALL = 20;
const MAX_LABEL_LENGTH = 40;
const MAX_COHORT_LENGTH = 30;
const DEFAULT_COHORT = 'tester';
const DEFAULT_DAYS = 14;
const MAX_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
/** Same alphabet and length as scripts/createInvite.mjs and CODE_PATTERN in api/redeem-invite.ts */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 10;
const CODE_PATTERN = /^[A-HJKMNP-Z2-9]{10}$/;
const UID_PATTERN = /^[A-Za-z0-9]{20,40}$/;
const MAX_CODE_ATTEMPTS = 3;
/** One Firestore commit takes at most 500 writes; a second press archives the rest */
const MAX_ARCHIVE_PER_CALL = 400;

export interface TesterEntry {
  uid: string;
  label: string;
  cohort: string;
  invitedAt: number;
  /** An account that was already in use before the gate (scripts/allowExisting.mjs) */
  isGrandfathered: boolean;
}

export interface InviteEntry {
  code: string;
  label: string;
  cohort: string;
  createdAt: number;
  expiresAt: number;
  status: 'open' | 'used' | 'expired';
}

export interface OwnerTestersView {
  accessOpen: boolean;
  /** Used or expired invites that were archived (hidden from `invites`) */
  archivedInvites: number;
  testers: TesterEntry[];
  invites: InviteEntry[];
}

export interface OwnerTestersDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: (...args: Parameters<typeof createFirestoreAdmin>) => FirestoreAdmin;
  randomIndex?: (limit: number) => number;
}

const str = (value: unknown, fallback: string): string => (typeof value === 'string' && value ? value : fallback);
const num = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0);

export function newInviteCode(randomIndex: (limit: number) => number = randomInt): string {
  return Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomIndex(CODE_ALPHABET.length)]).join('');
}

async function readView(admin: FirestoreAdmin, now: number): Promise<OwnerTestersView> {
  const [allowedRows, inviteRows, access] = await Promise.all([
    admin.listFieldsOf('allowed', ['label', 'cohort', 'invitedAt', 'grandfathered']),
    admin.listFieldsOf('invites', ['label', 'cohort', 'createdAt', 'expiresAt', 'usedByUid', 'archived']),
    admin.getDocument('config', 'access'),
  ]);
  const visibleInvites = inviteRows.filter(({ fields }) => fields.archived !== true);
  return {
    accessOpen: access?.fields.open === true,
    archivedInvites: inviteRows.length - visibleInvites.length,
    testers: allowedRows
      .map(({ id, fields }) => ({
        uid: id,
        label: str(fields.label, 'unlabeled'),
        cohort: str(fields.cohort, 'none'),
        invitedAt: num(fields.invitedAt),
        isGrandfathered: fields.grandfathered === true,
      }))
      .sort((a, b) => b.invitedAt - a.invitedAt),
    invites: visibleInvites
      .map(({ id, fields }): InviteEntry => {
        const expiresAt = num(fields.expiresAt);
        const isUsed = typeof fields.usedByUid === 'string' && fields.usedByUid !== '';
        return {
          code: id,
          label: str(fields.label, id),
          cohort: str(fields.cohort, DEFAULT_COHORT),
          createdAt: num(fields.createdAt),
          expiresAt,
          status: isUsed ? 'used' : expiresAt && expiresAt < now ? 'expired' : 'open',
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt),
  };
}

function parseLabels(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_LABELS_PER_CALL) return null;
  const labels = value.map((item) => (typeof item === 'string' ? item.trim() : ''));
  return labels.every((label) => label.length > 0 && label.length <= MAX_LABEL_LENGTH) ? labels : null;
}

async function createInvite(
  admin: FirestoreAdmin,
  invite: { label: string; cohort: string; createdAt: number; expiresAt: number },
  randomIndex: (limit: number) => number
): Promise<void> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      // exists:false makes a (very unlikely) code collision fail instead of replacing a live invite
      await admin.commit([
        {
          collection: 'invites',
          id: newInviteCode(randomIndex),
          fields: { ...invite, usedByUid: null },
          precondition: { exists: false },
        },
      ]);
      return;
    } catch (error) {
      if (!(error instanceof ConflictError) || attempt >= MAX_CODE_ATTEMPTS) throw error;
    }
  }
}

export async function handleOwnerTestersRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: OwnerTestersDeps = {}
): Promise<Response> {
  const owner = await authenticateOwner(request, env, deps);
  if (owner instanceof Response) return owner;
  const { account, projectId } = owner;
  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, randomIndex = randomInt } = deps;

  try {
    const admin = createAdmin(account, projectId, { fetchImpl });
    const view = async () => jsonResponse(200, { ...(await readView(admin, nowMs())) });
    if (request.method === 'GET') return await view();

    const body = await readJsonBody(request, MAX_BODY_BYTES);
    if (!body) return errorResponse(400, 'Bad request');

    if (request.method === 'DELETE') {
      if (typeof body.code === 'string' && CODE_PATTERN.test(body.code)) {
        const invite = await admin.getDocument('invites', body.code);
        if (invite && typeof invite.fields.usedByUid === 'string' && invite.fields.usedByUid) {
          return errorResponse(409, 'That invite was already used. Lock the tester out instead.');
        }
        await admin.deleteDocument('invites', body.code);
        return await view();
      }
      if (typeof body.uid === 'string' && UID_PATTERN.test(body.uid)) {
        const entitlement = await admin.getDocument('entitlements', body.uid);
        await admin.deleteDocument('allowed', body.uid);
        // A paid subscription is not ours to remove
        if (entitlement?.fields.source === 'comp') await admin.deleteDocument('entitlements', body.uid);
        return await view();
      }
      return errorResponse(400, 'Bad request');
    }

    if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
    if (body.archiveFinished === true) {
      const finished = (await readView(admin, nowMs())).invites.filter((invite) => invite.status !== 'open');
      if (finished.length > 0) {
        await admin.commit(
          finished.slice(0, MAX_ARCHIVE_PER_CALL).map((invite) => ({
            collection: 'invites',
            id: invite.code,
            fields: { archived: true },
            mergeFields: ['archived'],
          }))
        );
      }
      return await view();
    }
    const labels = parseLabels(body.labels);
    if (!labels) return errorResponse(400, `Enter 1 to ${MAX_LABELS_PER_CALL} aliases (up to ${MAX_LABEL_LENGTH} characters each)`);
    const cohort = typeof body.cohort === 'string' && body.cohort.trim() ? body.cohort.trim().slice(0, MAX_COHORT_LENGTH) : DEFAULT_COHORT;
    const days = typeof body.days === 'number' && Number.isInteger(body.days) && body.days >= 1 && body.days <= MAX_DAYS ? body.days : DEFAULT_DAYS;

    const now = nowMs();
    for (const label of labels) {
      await createInvite(admin, { label, cohort, createdAt: now, expiresAt: now + days * DAY_MS }, randomIndex);
    }
    return await view();
  } catch (error) {
    // Only a status is logged: never codes, labels, uids or keys
    console.error(`owner-testers: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not update the testers');
  }
}

export const GET = (request: Request): Promise<Response> => handleOwnerTestersRequest(request, process.env);
export const POST = GET;
export const DELETE = GET;
