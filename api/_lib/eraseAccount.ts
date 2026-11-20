/**
 * Server-side account erasure, with the service account.
 *  - eraseServerRecords: the part only the server can delete (usage counters, feedback notes, the
 *    reminder log, the friend-request counter, the redeemed invite, access record, comp entitlement),
 *    as the privacy notice promises. Shared by /api/erase-account-data (the learner deleting themself)
 *    and the owner's full removal. A paid subscription's entitlement stays (tax records, payments).
 *  - eraseLearnerData: everything the learner owns in Firestore (mirrors `deleteLearnerData` in
 *    src/services/accountService.ts), for the owner removing a tester who cannot do it themself.
 */
import type { FirestoreAdmin, PlainDocument } from './firestoreAdmin.js';

const SHARED_COLLECTIONS = ['friendships', 'contests'] as const;

const idsOf = (rows: PlainDocument[]): string[] => rows.map((row) => row.id);

async function deleteAll(admin: FirestoreAdmin, collection: string, ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => admin.deleteDocument(collection, id)));
}

export async function eraseServerRecords(admin: FirestoreAdmin, uid: string): Promise<void> {
  const [counters, struggles, notes, reminders, invites, entitlement] = await Promise.all([
    admin.queryDocuments('analyticsDaily', 'uid', uid),
    admin.queryDocuments('missionStruggle', 'uid', uid),
    admin.queryDocuments('feedback', 'uid', uid),
    admin.queryDocuments('reminderSends', 'uid', uid),
    // A deleted invite can't be redeemed again (unknown code)
    admin.queryDocuments('invites', 'usedByUid', uid),
    admin.getDocument('entitlements', uid),
  ]);
  const isPaid = entitlement?.fields.source === 'subscription';
  await Promise.all([
    deleteAll(admin, 'analyticsDaily', idsOf(counters)),
    deleteAll(admin, 'missionStruggle', idsOf(struggles)),
    deleteAll(admin, 'feedback', idsOf(notes)),
    deleteAll(admin, 'reminderSends', idsOf(reminders)),
    deleteAll(admin, 'invites', idsOf(invites)),
    admin.deleteDocument('friendRequestCounts', uid),
    admin.deleteDocument('allowed', uid),
    // Where the account came from (the `?src=` tag)
    admin.deleteDocument('signups', uid),
    ...(isPaid ? [] : [admin.deleteDocument('entitlements', uid)]),
  ]);
}

/** The documents the learner owns or shares with friends and parents, sticker pictures included. */
export async function eraseLearnerData(admin: FirestoreAdmin, uid: string): Promise<void> {
  const [shared, codes, usernames, links, invites, stickers] = await Promise.all([
    Promise.all(SHARED_COLLECTIONS.map(async (name) => ({ name, rows: await admin.queryArrayContains(name, 'uids', uid) }))),
    admin.queryDocuments('friendCodes', 'uid', uid),
    admin.queryDocuments('usernames', 'uid', uid),
    admin.queryDocuments('parentLinks', 'childUid', uid),
    admin.queryDocuments('parentInvites', 'childUid', uid),
    admin.listDocuments(`learners/${uid}/stickers`),
  ]);
  await Promise.all([
    ...shared.map(({ name, rows }) => deleteAll(admin, name, idsOf(rows))),
    deleteAll(admin, 'friendCodes', idsOf(codes)),
    deleteAll(admin, 'usernames', idsOf(usernames)),
    deleteAll(admin, 'parentLinks', idsOf(links)),
    deleteAll(admin, 'parentInvites', idsOf(invites)),
    deleteAll(admin, `learners/${uid}/stickers`, idsOf(stickers)),
  ]);
  // Last, so a half-finished run still finds the owner records and can simply be repeated
  await Promise.all([
    admin.deleteDocument('friendCodeOwners', uid),
    admin.deleteDocument('publicProfiles', uid),
    admin.deleteDocument('reportSnapshots', uid),
    admin.deleteDocument('pushSubscriptions', uid),
    admin.deleteDocument('learners', uid),
  ]);
}
