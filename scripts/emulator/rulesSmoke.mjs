/**
 * Checks firestore.rules against the local emulators with real client calls:
 * `npm run emulators`, then `node scripts/emulator/rulesSmoke.mjs`.
 * Uses the two emulator test accounts (see .claude/test-user-emulator.md); never the live project.
 */
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  connectFirestoreEmulator, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc, writeBatch,
} from 'firebase/firestore';

const PIN = process.env.EMU_PIN || 'emu-test-1234';
const results = [];

function app(name) {
  const a = initializeApp({ apiKey: 'demo-api-key', projectId: 'demo-english-vibe' }, name);
  const auth = getAuth(a);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  const db = getFirestore(a);
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  return { auth, db };
}

async function expect(label, shouldPass, action) {
  try {
    await action();
    results.push([shouldPass ? 'PASS' : 'FAIL', label, shouldPass ? '' : 'was allowed']);
  } catch (error) {
    results.push([shouldPass ? 'FAIL' : 'PASS', label, shouldPass ? error.code || error.message : '']);
  }
}

const today = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

const a = app('a');
const b = app('b');
const ua = (await signInWithEmailAndPassword(a.auth, 'emutest@peachnote.tutor.local', PIN)).user;
const ub = (await signInWithEmailAndPassword(b.auth, 'emutest2@peachnote.tutor.local', PIN)).user;
const pairId = [ua.uid, ub.uid].sort().join('_');

// A's public profile (a request must match it)
await setDoc(doc(a.db, 'publicProfiles', ua.uid), {
  displayName: 'Noa', avatarEmoji: '🐱', level: 1, streakDays: 0, stars: 0, missionsCompleted: 0,
  updatedAt: new Date().toISOString(),
});
// Clean up from an earlier run
await deleteDoc(doc(a.db, 'friendships', pairId)).catch(() => {});

const request = {
  uids: [ua.uid, ub.uid], requesterUid: ua.uid, requesterName: 'Noa', requesterAvatar: '🐱',
  addresseeName: 'Ido', addresseeAvatar: '🐶', status: 'pending', createdAt: new Date().toISOString(),
};
const counterRef = doc(a.db, 'friendRequestCounts', ua.uid);

await expect('friend request without raising the daily counter is denied', false, () =>
  setDoc(doc(a.db, 'friendships', pairId), request));

const counter = await getDoc(counterRef);
const current = counter.exists() ? counter.data() : null;
const nextCount = current && current.dateStr === today ? current.count + 1 : 1;
if (nextCount > 10) {
  results.push(['SKIP', 'daily limit already reached in the emulator today', '']);
} else {
  await expect('friend request with the counter raised by one is allowed', true, async () => {
    const batch = writeBatch(a.db);
    batch.set(doc(a.db, 'friendships', pairId), request);
    batch.set(counterRef, { dateStr: today, count: nextCount });
    await batch.commit();
  });
  await expect('the counter cannot be reset to 1', false, () =>
    setDoc(counterRef, { dateStr: today, count: 1 }));
  await expect('the counter cannot jump past 10', false, () => setDoc(counterRef, { dateStr: today, count: 11 }));
  await expect('the counter cannot be deleted', false, () => deleteDoc(counterRef));
}

await expect('the other learner can delete the friendship (account deletion)', true, () =>
  deleteDoc(doc(b.db, 'friendships', pairId)));
await expect('the owner can delete their friend-code record', true, () =>
  deleteDoc(doc(a.db, 'friendCodeOwners', ua.uid)));
await expect('someone else cannot delete a learner profile', false, () => deleteDoc(doc(b.db, 'learners', ua.uid)));

const publicProfile = (stars) => ({
  displayName: 'Noa', avatarEmoji: '🐱', level: 1, streakDays: 0, stars, missionsCompleted: 0,
  updatedAt: new Date().toISOString(),
});
await expect('a public profile with possible stars is allowed', true, () =>
  setDoc(doc(a.db, 'publicProfiles', ua.uid), publicProfile(432)));
await expect('a public profile with impossible stars is denied', false, () =>
  setDoc(doc(a.db, 'publicProfiles', ua.uid), publicProfile(5000)));

const png = (size) => 'data:image/png;base64,' + 'A'.repeat(size);
const stickerDoc = (imageDataUrl) => ({ imageDataUrl, createdAt: new Date().toISOString() });
const stickerRef = (db, uid) => doc(db, 'learners', uid, 'stickers', 'drawn-1');
await expect('a learner can save their own sticker picture', true, () =>
  setDoc(stickerRef(a.db, ua.uid), stickerDoc(png(1000))));
await expect('a learner can read their own sticker picture', true, () => getDoc(stickerRef(a.db, ua.uid)));
await expect('someone else cannot read a sticker picture', false, () => getDoc(stickerRef(b.db, ua.uid)));
await expect('someone else cannot write a sticker picture', false, () =>
  setDoc(stickerRef(b.db, ua.uid), stickerDoc(png(1000))));
await expect('a sticker picture that is not a PNG is denied', false, () =>
  setDoc(stickerRef(a.db, ua.uid), stickerDoc('data:text/html;base64,AAAA')));
await expect('an oversized sticker picture is denied', false, () =>
  setDoc(stickerRef(a.db, ua.uid), stickerDoc(png(40000))));
await expect('a sticker picture with extra fields is denied', false, () =>
  setDoc(stickerRef(a.db, ua.uid), { ...stickerDoc(png(1000)), note: 'x' }));
await expect('a learner can delete their own sticker picture', true, () => deleteDoc(stickerRef(a.db, ua.uid)));

// Parents: A is the learner, B the parent (clean up from an earlier run first)
const CODE = 'ABCD2345';
const linkId = `${ub.uid}_${ua.uid}`;
const invite = (overrides = {}) => ({
  childUid: ua.uid, childName: 'Noa', childAvatar: '🐱', expiresAtMs: Date.now() + 24 * 3600 * 1000, ...overrides,
});
const linkData = (overrides = {}) => ({
  parentUid: ub.uid, childUid: ua.uid, childName: 'Noa', childAvatar: '🐱', inviteCode: CODE,
  linkedAt: new Date().toISOString(), ...overrides,
});
const snapshot = (overrides = {}) => ({
  name: 'Noa', gender: 'girl', gradeId: 'grade-7', preferredTier: 'explorer', isShabbatObserver: true,
  stats: { level: 2, streakDays: 1 }, missionProgress: { 'g7-u1-m1': 3 }, activityLog: [],
  updatedAt: new Date().toISOString(), ...overrides,
});
const claim = (db, overrides) => {
  const batch = writeBatch(db);
  batch.set(doc(db, 'parentLinks', linkId), linkData(overrides));
  batch.delete(doc(db, 'parentInvites', CODE));
  return batch.commit();
};
await deleteDoc(doc(b.db, 'parentLinks', linkId)).catch(() => {});
await deleteDoc(doc(a.db, 'parentInvites', CODE)).catch(() => {});
await deleteDoc(doc(a.db, 'reportSnapshots', ua.uid)).catch(() => {});

await expect('a parent code naming another learner is denied', false, () =>
  setDoc(doc(a.db, 'parentInvites', CODE), invite({ childUid: ub.uid })));
await expect('a parent code that lives 4 days is denied', false, () =>
  setDoc(doc(a.db, 'parentInvites', CODE), invite({ expiresAtMs: Date.now() + 4 * 24 * 3600 * 1000 })));
await expect('a parent code that expires in a month is denied', false, () =>
  setDoc(doc(a.db, 'parentInvites', CODE), invite({ expiresAtMs: Date.now() + 30 * 24 * 3600 * 1000 })));
await expect('a malformed parent code is denied', false, () =>
  setDoc(doc(a.db, 'parentInvites', 'ABCD0OIL'), invite()));
await expect('a learner can make a parent code', true, () => setDoc(doc(a.db, 'parentInvites', CODE), invite()));
await expect('a snapshot is unreadable by an unlinked parent', false, () => getDoc(doc(b.db, 'reportSnapshots', ua.uid)));
await expect('a link without deleting the code is denied', false, () =>
  setDoc(doc(b.db, 'parentLinks', linkId), linkData()));
await expect('a link with another child name is denied', false, () => claim(b.db, { childName: 'Dana' }));
await expect('a link for another parent is denied', false, () => claim(b.db, { parentUid: ua.uid }));
await expect('a link with a huge parent label is denied', false, () => claim(b.db, { parentLabel: 'x'.repeat(200) }));
await expect('a parent can claim the code (with a masked email label)', true, () => claim(b.db, { parentLabel: 'p***@example.com' }));
await expect('the claimed code is gone', true, async () => {
  if ((await getDoc(doc(b.db, 'parentInvites', CODE))).exists()) throw new Error('still there');
});
await expect('the learner can read their own link', true, () => getDoc(doc(a.db, 'parentLinks', linkId)));
await expect('the learner can save a report snapshot', true, () =>
  setDoc(doc(a.db, 'reportSnapshots', ua.uid), snapshot()));
await expect('a snapshot with extra fields is denied', false, () =>
  setDoc(doc(a.db, 'reportSnapshots', ua.uid), snapshot({ age: 9 })));
await expect('a parent cannot write a snapshot', false, () => setDoc(doc(b.db, 'reportSnapshots', ua.uid), snapshot()));
await expect('the linked parent can read the snapshot', true, () => getDoc(doc(b.db, 'reportSnapshots', ua.uid)));
await expect('the learner profile stays unreadable by the parent', false, () => getDoc(doc(b.db, 'learners', ua.uid)));
const resetTime = () => ({ pinResetAt: new Date().toISOString() });
await expect('the parent can leave a PIN reset time on the link', true, () => updateDoc(doc(b.db, 'parentLinks', linkId), resetTime()));
await expect('the learner cannot write a PIN reset time', false, () => updateDoc(doc(a.db, 'parentLinks', linkId), resetTime()));
await expect('the parent cannot change anything else on the link', false, () =>
  updateDoc(doc(b.db, 'parentLinks', linkId), { childName: 'Dana' }));
await expect('the parent cannot change the label with the reset time', false, () =>
  updateDoc(doc(b.db, 'parentLinks', linkId), { ...resetTime(), parentLabel: 'x' }));
await expect('the learner can read the reset time', true, async () => {
  if (!(await getDoc(doc(a.db, 'parentLinks', linkId))).data()?.pinResetAt) throw new Error('missing');
});
await expect('the parent can unlink', true, () => deleteDoc(doc(b.db, 'parentLinks', linkId)));
await expect('an unlinked parent can no longer read the snapshot', false, () => getDoc(doc(b.db, 'reportSnapshots', ua.uid)));
await deleteDoc(doc(a.db, 'reportSnapshots', ua.uid)).catch(() => {});
await expect('a parent marker is created by its owner only', false, () =>
  setDoc(doc(a.db, 'parents', ub.uid), { createdAt: new Date().toISOString() }));
await expect('a parent can mark their own account', true, () =>
  setDoc(doc(b.db, 'parents', ub.uid), { createdAt: new Date().toISOString() }));
await deleteDoc(doc(b.db, 'parents', ub.uid)).catch(() => {});

// Streak reminder subscriptions: owner only, strict fields
const pushSub = (extra = {}) => ({
  endpoint: 'https://fcm.googleapis.com/fcm/send/abc',
  p256dh: 'key',
  auth: 'auth',
  streakDays: 3,
  streakLastDateStr: '2026-10-26',
  isShabbatObserver: true,
  gender: 'girl',
  updatedAt: new Date().toISOString(),
  ...extra,
});
await expect('the learner can save a reminder subscription', true, () =>
  setDoc(doc(a.db, 'pushSubscriptions', ua.uid), pushSub()));
await expect('a subscription with an extra field is denied', false, () =>
  setDoc(doc(a.db, 'pushSubscriptions', ua.uid), pushSub({ email: 'x@y.z' })));
await expect('a subscription with a non-https endpoint is denied', false, () =>
  setDoc(doc(a.db, 'pushSubscriptions', ua.uid), pushSub({ endpoint: 'http://fcm.googleapis.com/fcm/send/abc' })));
await expect('a subscription to a host that is not a push service is denied', false, () =>
  setDoc(doc(a.db, 'pushSubscriptions', ua.uid), pushSub({ endpoint: 'https://tarpit.example/hang' })));
await expect('a subscription to a push-service lookalike host is denied', false, () =>
  setDoc(doc(a.db, 'pushSubscriptions', ua.uid), pushSub({ endpoint: 'https://fcm.googleapis.com.evil.example/x' })));
await expect('a subscription with a stray remindHour is denied', false, () =>
  setDoc(doc(a.db, 'pushSubscriptions', ua.uid), pushSub({ remindHour: 18 })));
await expect('another user cannot read a subscription', false, () => getDoc(doc(b.db, 'pushSubscriptions', ua.uid)));
await expect('another user cannot write a subscription', false, () =>
  setDoc(doc(b.db, 'pushSubscriptions', ua.uid), pushSub()));
await expect('the learner can delete their subscription', true, () => deleteDoc(doc(a.db, 'pushSubscriptions', ua.uid)));

// EnglishVibe Pro: the server writes entitlements (seeded here with the emulator's owner token,
// which bypasses the rules); a learner and a linked parent can read one, nobody can write.
const ownerDoc = (path) =>
  `http://127.0.0.1:8080/v1/projects/demo-english-vibe/databases/(default)/documents/${path}`;
const seedAsServer = (path, fields) =>
  fetch(ownerDoc(path), {
    method: 'PATCH',
    headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  }).then((response) => {
    if (!response.ok) throw new Error(`seed ${path} failed: ${response.status}`);
  });
const entitlement = () => ({
  plan: 'pro', status: 'active', source: 'subscription', billingPeriod: 'monthly',
  periodEnd: Date.now() + 30 * 24 * 3600 * 1000, payerParentUid: ub.uid, subscriptionId: 'x'.repeat(32),
  provider: 'mock', updatedAt: Date.now(),
});
await seedAsServer(`entitlements/${ua.uid}`, {
  plan: { stringValue: 'pro' }, status: { stringValue: 'active' }, payerParentUid: { stringValue: ub.uid },
});
await seedAsServer(`subscriptions/${'x'.repeat(32)}`, { payerParentUid: { stringValue: ub.uid } });
await seedAsServer(`checkouts/${'x'.repeat(32)}`, { parentUid: { stringValue: ub.uid }, processToken: { stringValue: 'secret' } });

await expect('a learner can read their own entitlement', true, () => getDoc(doc(a.db, 'entitlements', ua.uid)));
await expect('an unlinked user cannot read an entitlement', false, () => getDoc(doc(b.db, 'entitlements', ua.uid)));
await expect('a learner cannot write their own entitlement', false, () =>
  setDoc(doc(a.db, 'entitlements', ua.uid), entitlement()));
await expect('a learner cannot delete their own entitlement', false, () => deleteDoc(doc(a.db, 'entitlements', ua.uid)));
await expect('a parent cannot give a learner Pro', false, () => setDoc(doc(b.db, 'entitlements', ua.uid), entitlement()));
await deleteDoc(doc(b.db, 'parentLinks', linkId)).catch(() => {});
await deleteDoc(doc(a.db, 'parentInvites', CODE)).catch(() => {});
await setDoc(doc(a.db, 'parentInvites', CODE), invite());
await claim(b.db, {});
await expect('a linked parent can read the learner entitlement', true, () => getDoc(doc(b.db, 'entitlements', ua.uid)));
await expect('a linked parent still cannot write it', false, () =>
  updateDoc(doc(b.db, 'entitlements', ua.uid), { status: 'active' }));
await expect('the paying parent cannot read the subscription record', false, () =>
  getDoc(doc(b.db, 'subscriptions', 'x'.repeat(32))));
await expect('the paying parent cannot read the checkout record', false, () =>
  getDoc(doc(b.db, 'checkouts', 'x'.repeat(32))));
await expect('nobody can write a payment record', false, () =>
  setDoc(doc(b.db, 'payments', 'mock_1'), { subscriptionId: 'x', amountAgorot: 0, at: 0 }));
await deleteDoc(doc(b.db, 'parentLinks', linkId)).catch(() => {});
for (const path of [`entitlements/${ua.uid}`, `subscriptions/${'x'.repeat(32)}`, `checkouts/${'x'.repeat(32)}`]) {
  await fetch(ownerDoc(path), { method: 'DELETE', headers: { Authorization: 'Bearer owner' } }).catch(() => {});
}

for (const [status, label, detail] of results) console.log(`${status}  ${label}${detail ? `  (${detail})` : ''}`);
process.exit(results.some(([s]) => s === 'FAIL') ? 1 : 0);
