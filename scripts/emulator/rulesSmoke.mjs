/**
 * Checks firestore.rules against the local emulators with real client calls:
 * `npm run emulators`, then `node scripts/emulator/rulesSmoke.mjs`.
 * Uses the two emulator test accounts (see .claude/test-user-emulator.md); never the live project.
 */
import { initializeApp } from 'firebase/app';
import {
  connectAuthEmulator, createUserWithEmailAndPassword, getAuth, signInAnonymously, signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  collection, connectFirestoreEmulator, deleteDoc, doc, getDoc, getDocs, getFirestore, increment, serverTimestamp, setDoc, updateDoc, writeBatch,
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
// The accounts exist only in the emulator, so a fresh emulator (firebase emulators:exec) gets them created
const signInOrCreate = (appPair, email) =>
  signInWithEmailAndPassword(appPair.auth, email, PIN)
    .catch(() => createUserWithEmailAndPassword(appPair.auth, email, PIN))
    .then((credential) => credential.user);
const ua = await signInOrCreate(a, 'emutest@peachnote.tutor.local');
const ub = await signInOrCreate(b, 'emutest2@peachnote.tutor.local');
const pairId = [ua.uid, ub.uid].sort().join('_');

// Closed early-tester phase (isAllowed in firestore.rules): the server (the emulator's owner token,
// which bypasses the rules) records which accounts are allowed. A, B and C are testers here.
const EMULATOR_DOCS = 'http://127.0.0.1:8080/v1/projects/demo-english-vibe/databases/(default)/documents';
const serverWrite = (path, fields) =>
  fetch(`${EMULATOR_DOCS}/${path}`, {
    method: 'PATCH',
    headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  }).then((response) => {
    if (!response.ok) throw new Error(`server write ${path} failed: ${response.status}`);
  });
const serverDelete = (path) =>
  fetch(`${EMULATOR_DOCS}/${path}`, { method: 'DELETE', headers: { Authorization: 'Bearer owner' } }).catch(() => {});
const allowedFields = { cohort: { stringValue: 'smoke' }, invitedAt: { integerValue: '1' } };
await serverDelete('config/access');
await serverWrite(`allowed/${ua.uid}`, allowedFields);
await serverWrite(`allowed/${ub.uid}`, allowedFields);

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

// A request needs the invited learner's Friends Hub on (a public profile) and their profile name
await deleteDoc(doc(b.db, 'publicProfiles', ub.uid)).catch(() => {});
const stranger = 'someRandomUid123';
const counter = await getDoc(counterRef);
const current = counter.exists() ? counter.data() : null;
const nextCount = current && current.dateStr === today ? current.count + 1 : 1;
// Raises the counter correctly, so a denial can only come from the friendship rules
const withCounter = (id, data) => {
  const batch = writeBatch(a.db);
  batch.set(doc(a.db, 'friendships', id), data);
  batch.set(counterRef, { dateStr: today, count: nextCount });
  return batch.commit();
};
await expect('friend request to a learner with the hub off is denied', false, () => withCounter(pairId, request));
await expect('friend request to a uid with no learner is denied', false, () =>
  withCounter([ua.uid, stranger].sort().join('_'), { ...request, uids: [ua.uid, stranger] }));
await setDoc(doc(b.db, 'publicProfiles', ub.uid), {
  displayName: 'Ido', avatarEmoji: '🐶', level: 1, streakDays: 0, stars: 0, missionsCompleted: 0,
  updatedAt: new Date().toISOString(),
});
await expect('friend request with a name that is not the profile name is denied', false, () =>
  withCounter(pairId, { ...request, addresseeName: 'Mallory' }));

if (nextCount > 10) {
  results.push(['SKIP', 'daily limit already reached in the emulator today', '']);
} else {
  await expect('friend request with the counter raised by one is allowed', true, () =>
    withCounter(pairId, request));
  await expect('the counter cannot be reset to 1', false, () =>
    setDoc(counterRef, { dateStr: today, count: 1 }));
  await expect('the counter cannot jump past 10', false, () => setDoc(counterRef, { dateStr: today, count: 11 }));
  await expect('the counter cannot be deleted', false, () => deleteDoc(counterRef));
}

await expect('the other learner can delete the friendship (account deletion)', true, () =>
  deleteDoc(doc(b.db, 'friendships', pairId)));
await deleteDoc(doc(b.db, 'publicProfiles', ub.uid)).catch(() => {});
await expect('the owner can delete their friend-code record', true, () =>
  deleteDoc(doc(a.db, 'friendCodeOwners', ua.uid)));
const claimFriendCode = (code) => {
  const batch = writeBatch(a.db);
  batch.set(doc(a.db, 'friendCodes', code), { uid: ua.uid, displayName: 'Noa', avatarEmoji: '🐱' });
  batch.set(doc(a.db, 'friendCodeOwners', ua.uid), { code });
  return batch.commit();
};
await expect('claiming a new 6-character friend code is denied', false, () => claimFriendCode('K7MP2Q'));
await expect('claiming a new 8-character friend code is allowed', true, () => claimFriendCode('K7MP2QXA'));
await deleteDoc(doc(a.db, 'friendCodeOwners', ua.uid)).catch(() => {});
await deleteDoc(doc(a.db, 'friendCodes', 'K7MP2QXA')).catch(() => {});
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
const masteredWord = { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01', '2026-11-02'], masteredOn: '2026-11-02' };
await expect('a snapshot with mastered deck words is allowed', true, () =>
  setDoc(doc(a.db, 'reportSnapshots', ua.uid), snapshot({ deckWordMastery: { apple: masteredWord } })));
await expect('a snapshot with deck words that are not a map is denied', false, () =>
  setDoc(doc(a.db, 'reportSnapshots', ua.uid), snapshot({ deckWordMastery: ['apple'] })));
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
await expect('nobody can read the owner reminder log', false, () => getDoc(doc(a.db, 'reminderSends', `2026-11-06_${ua.uid}`)));
await expect('nobody can write the owner reminder log', false, () =>
  setDoc(doc(a.db, 'reminderSends', `2026-11-06_${ua.uid}`), { uid: ua.uid, dateStr: '2026-11-06', kind: 'streak' }));
await expect('a learner cannot read the owner test-account list', false, () => getDoc(doc(a.db, 'testUsers', ua.uid)));
await expect('a learner cannot add themselves to the owner test-account list', false, () =>
  setDoc(doc(a.db, 'testUsers', ua.uid), { label: 'me', addedAt: 1 }));
await expect('a learner cannot list the owner test accounts', false, () => getDocs(collection(a.db, 'testUsers')));
// Product analytics: write-only counters and scrubbed errors
const dayDoc = (uid) => doc(a.db, 'analyticsDaily', `${today}_${uid}`);
const dayData = (uid, counts) => ({ uid, day: today, gradeId: 'grade-3', counts });
await expect('a learner can write their own analytics counters', true, () =>
  setDoc(dayDoc(ua.uid), dayData(ua.uid, { session_start: increment(1) }), { merge: true }));
await expect('a learner cannot write analytics under another uid', false, () =>
  setDoc(doc(a.db, 'analyticsDaily', `${today}_${ub.uid}`), dayData(ub.uid, { session_start: increment(1) }), { merge: true }));
await expect('a learner can count a feature open', true, () =>
  setDoc(dayDoc(ua.uid), dayData(ua.uid, { feature_room: increment(1) }), { merge: true }));
await expect('a learner can count struggle signals', true, () =>
  setDoc(dayDoc(ua.uid), dayData(ua.uid, { mission_start: increment(1), mission_abandon: increment(1), hint_used: increment(1), tts_error: increment(1) }), { merge: true }));
await expect('a learner can count the onboarding and first-week steps', true, () =>
  setDoc(dayDoc(ua.uid), dayData(ua.uid, { onboarding_view: increment(1), greeting_done: increment(1), week_one_seen: increment(1), tour_skipped: increment(1) }), { merge: true }));
await expect('a learner can count the Pro wall and an ask sent', true, () =>
  setDoc(dayDoc(ua.uid), dayData(ua.uid, { pro_wall_view: increment(1), pro_ask_sent: increment(1) }), { merge: true }));
// Where a new account came from (the `?src=` tag): written once, never read or changed
const signup = (uid, extra = {}) => ({ uid, day: today, src: 'wa-family', ...extra });
await expect('a sign-up source outside the list is rejected', false, () => setDoc(doc(a.db, 'signups', ua.uid), signup(ua.uid, { src: 'made-up' })));
await expect('a sign-up with a badly shaped campaign is rejected', false, () => setDoc(doc(a.db, 'signups', ua.uid), signup(ua.uid, { campaign: 'Dec Soft!' })));
await expect('a sign-up with an extra field is rejected', false, () => setDoc(doc(a.db, 'signups', ua.uid), signup(ua.uid, { name: 'Dana' })));
await expect('a learner cannot store a sign-up source for another account', false, () => setDoc(doc(a.db, 'signups', ub.uid), signup(ub.uid)));
await expect('a learner can store their own sign-up source once', true, () => setDoc(doc(a.db, 'signups', ua.uid), signup(ua.uid, { campaign: 'dec-soft' })));
await expect('a stored sign-up source cannot be changed', false, () => setDoc(doc(a.db, 'signups', ua.uid), signup(ua.uid, { src: 'landing' })));
await expect('a learner cannot read a sign-up source', false, () => getDoc(doc(a.db, 'signups', ua.uid)));
await expect('a client cannot write or read the anonymous sign-up counters', false, () =>
  setDoc(doc(a.db, 'funnelDaily', today), { gate_view: increment(1) }, { merge: true }));
await expect('a client cannot read the anonymous sign-up counters', false, () => getDoc(doc(a.db, 'funnelDaily', today)));
await expect('an analytics counter outside the allow-list is rejected', false, () =>
  setDoc(dayDoc(ua.uid), dayData(ua.uid, { typed_text: increment(1) }), { merge: true }));
await expect('an analytics document with an extra field is rejected', false, () =>
  setDoc(dayDoc(ua.uid), { ...dayData(ua.uid, { session_start: increment(1) }), name: 'Dana' }, { merge: true }));
await expect('a learner cannot read analytics counters', false, () => getDoc(dayDoc(ua.uid)));
await expect('analytics counters may carry a coarse device bucket', true, () =>
  setDoc(dayDoc(ua.uid), { ...dayData(ua.uid, { session_start: increment(1) }), device: 'ios-safari-phone-pwa' }, { merge: true }));
await expect('a raw user-agent as the device is rejected', false, () =>
  setDoc(dayDoc(ua.uid), { ...dayData(ua.uid, { session_start: increment(1) }), device: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5)' }, { merge: true }));
await expect('a device bucket outside the fixed words is rejected', false, () =>
  setDoc(dayDoc(ua.uid), { ...dayData(ua.uid, { session_start: increment(1) }), device: 'ios-safari-phone-dana' }, { merge: true }));
// Where learners get stuck: write-only per mission and tier
const struggleId = (uid, mission, tier) => `${today}_${uid}_${mission}_${tier}`;
const struggleData = (uid, mission, tier, extra = {}) => ({ uid, day: today, missionId: mission, tier, starts: increment(1), abandons: increment(1), ...extra });
await expect('a learner can record a mission they left unfinished', true, () =>
  setDoc(doc(a.db, 'missionStruggle', struggleId(ua.uid, 'g3-u1-m1', 'challenger')), struggleData(ua.uid, 'g3-u1-m1', 'challenger'), { merge: true }));
await expect('a mission record under another uid is rejected', false, () =>
  setDoc(doc(a.db, 'missionStruggle', struggleId(ub.uid, 'g3-u1-m1', 'challenger')), struggleData(ub.uid, 'g3-u1-m1', 'challenger'), { merge: true }));
await expect('a mission record with a mismatched document id is rejected', false, () =>
  setDoc(doc(a.db, 'missionStruggle', struggleId(ua.uid, 'g3-u1-m2', 'challenger')), struggleData(ua.uid, 'g3-u1-m1', 'challenger'), { merge: true }));
await expect('a mission record with an unknown tier is rejected', false, () =>
  setDoc(doc(a.db, 'missionStruggle', struggleId(ua.uid, 'g3-u1-m1', 'wizard')), struggleData(ua.uid, 'g3-u1-m1', 'wizard'), { merge: true }));
await expect('a mission record with a free-text mission id is rejected', false, () =>
  setDoc(doc(a.db, 'missionStruggle', struggleId(ua.uid, 'Dana was here', 'master')), struggleData(ua.uid, 'Dana was here', 'master'), { merge: true }));
await expect('a mission record with an extra field is rejected', false, () =>
  setDoc(doc(a.db, 'missionStruggle', struggleId(ua.uid, 'g3-u1-m1', 'master')), struggleData(ua.uid, 'g3-u1-m1', 'master', { name: 'Dana' }), { merge: true }));
await expect('a learner cannot read mission records', false, () =>
  getDoc(doc(a.db, 'missionStruggle', struggleId(ua.uid, 'g3-u1-m1', 'challenger'))));
await expect('a client error may carry a coarse device bucket', true, () =>
  setDoc(doc(a.db, 'clientErrors', `${today}_abe`),
    { day: today, message: 'boom', stack: '', source: 'render', appVersion: 'test', device: 'ios-safari-phone', count: increment(1), lastSeen: serverTimestamp() }, { merge: true }));
await expect('a client error with a free-text device is rejected', false, () =>
  setDoc(doc(a.db, 'clientErrors', `${today}_abf`),
    { day: today, message: 'boom', stack: '', source: 'render', appVersion: 'test', device: 'Pixel 8 of Dana', count: increment(1), lastSeen: serverTimestamp() }, { merge: true }));
await expect('a learner can report a scrubbed client error', true, () =>
  setDoc(doc(a.db, 'clientErrors', `${today}_abc`),
    { day: today, message: 'boom', stack: '', source: 'render', appVersion: 'test', count: increment(1), lastSeen: serverTimestamp() }, { merge: true }));
await expect('an oversized client error message is rejected', false, () =>
  setDoc(doc(a.db, 'clientErrors', `${today}_abd`),
    { day: today, message: 'x'.repeat(500), stack: '', source: 'render', appVersion: 'test', count: increment(1), lastSeen: serverTimestamp() }, { merge: true }));
const feedbackNote = (uid, extra = {}) => ({ uid, day: today, kind: 'idea', text: 'more games please', gradeId: 'grade-3', screen: 'settings', appVersion: 'abc123', ...extra });
await expect('an allowed learner can send a feedback note', true, () => setDoc(doc(a.db, 'feedback', 'note-a1'), feedbackNote(ua.uid)));
await expect('a feedback note under another uid is rejected', false, () => setDoc(doc(a.db, 'feedback', 'note-a2'), feedbackNote(ub.uid)));
await expect('an oversized feedback note is rejected', false, () => setDoc(doc(a.db, 'feedback', 'note-a3'), feedbackNote(ua.uid, { text: 'x'.repeat(501) })));
await expect('a feedback note with an extra field is rejected', false, () => setDoc(doc(a.db, 'feedback', 'note-a4'), feedbackNote(ua.uid, { name: 'Dana' })));
await expect('a learner cannot read feedback notes', false, () => getDoc(doc(a.db, 'feedback', 'note-a1')));
await expect('a learner cannot edit a sent feedback note', false, () => setDoc(doc(a.db, 'feedback', 'note-a1'), feedbackNote(ua.uid, { text: 'changed' })));
await expect('a learner cannot read client errors', false, () => getDoc(doc(a.db, 'clientErrors', `${today}_abc`)));
await deleteDoc(doc(b.db, 'parentLinks', linkId)).catch(() => {});
for (const path of [`entitlements/${ua.uid}`, `subscriptions/${'x'.repeat(32)}`, `checkouts/${'x'.repeat(32)}`]) {
  await fetch(ownerDoc(path), { method: 'DELETE', headers: { Authorization: 'Bearer owner' } }).catch(() => {});
}

// ---- Gap coverage (audit "Test coverage" item 2): A and B are learners, C a third real account, D anonymous ----
// C only exists in the emulator; it is a stranger to both A and B.
const c = app('c');
const C_EMAIL = 'emutest3@peachnote.tutor.local';
const uc = await signInOrCreate(c, C_EMAIL);
await serverWrite(`allowed/${uc.uid}`, allowedFields);
const d = app('d');
await signInAnonymously(d.auth);
const nowIso = () => new Date().toISOString();

// Lookups: usernames and friend codes belong to their owner
const lookupEntry = (uid) => ({ uid, displayName: 'Noa', avatarEmoji: '🐱' });
await deleteDoc(doc(a.db, 'usernames', 'emutest')).catch(() => {});
await deleteDoc(doc(a.db, 'friendCodeOwners', ua.uid)).catch(() => {});
await deleteDoc(doc(a.db, 'friendCodes', 'K7MP2QXA')).catch(() => {});
await expect('a learner cannot claim the username of another sign-in email', false, () =>
  setDoc(doc(b.db, 'usernames', 'emutest'), lookupEntry(ub.uid)));
await expect('a username entry pointing at another uid is denied', false, () =>
  setDoc(doc(a.db, 'usernames', 'emutest'), lookupEntry(ub.uid)));
await expect('the owner of the sign-in email can publish the username', true, () =>
  setDoc(doc(a.db, 'usernames', 'emutest'), lookupEntry(ua.uid)));
await expect('another learner can look the username up', true, () => getDoc(doc(b.db, 'usernames', 'emutest')));
await expect('a non-owner cannot overwrite a username', false, () =>
  setDoc(doc(b.db, 'usernames', 'emutest'), lookupEntry(ub.uid)));
await expect('a non-owner cannot delete a username', false, () => deleteDoc(doc(b.db, 'usernames', 'emutest')));
await expect('the owner can delete the username', true, () => deleteDoc(doc(a.db, 'usernames', 'emutest')));
await claimFriendCode('K7MP2QXA');
await expect('another learner can look a friend code up', true, () => getDoc(doc(b.db, 'friendCodes', 'K7MP2QXA')));
await expect('a non-owner cannot take over a friend code', false, () =>
  setDoc(doc(b.db, 'friendCodes', 'K7MP2QXA'), lookupEntry(ub.uid)));
await expect('a non-owner cannot delete a friend code', false, () => deleteDoc(doc(b.db, 'friendCodes', 'K7MP2QXA')));
await expect('a learner cannot read another learner\'s code-owner record', false, () =>
  getDoc(doc(b.db, 'friendCodeOwners', ua.uid)));
await expect('a code-owner record for a code the learner does not own is denied', false, () =>
  setDoc(doc(b.db, 'friendCodeOwners', ub.uid), { code: 'K7MP2QXA' }));
await deleteDoc(doc(a.db, 'friendCodeOwners', ua.uid)).catch(() => {});
await deleteDoc(doc(a.db, 'friendCodes', 'K7MP2QXA')).catch(() => {});

// Friendships and contests between A (requester) and B (invitee), with C as a stranger
const counterNow = await getDoc(counterRef);
const counterData = counterNow.exists() ? counterNow.data() : null;
const requestCount = counterData && counterData.dateStr === today ? counterData.count + 1 : 1;
if (requestCount > 10) {
  results.push(['SKIP', 'friendship and contest rules: daily friend-request limit already reached in the emulator', '']);
} else {
  await deleteDoc(doc(a.db, 'friendships', pairId)).catch(() => {});
  await setDoc(doc(b.db, 'publicProfiles', ub.uid), {
    displayName: 'Ido', avatarEmoji: '🐶', level: 1, streakDays: 0, stars: 0, missionsCompleted: 0, updatedAt: nowIso(),
  });
  const friendRequest = () => {
    const batch = writeBatch(a.db);
    batch.set(doc(a.db, 'friendships', pairId), { ...request, createdAt: nowIso() });
    batch.set(counterRef, { dateStr: today, count: requestCount });
    return batch.commit();
  };
  const friendshipRef = (db) => doc(db, 'friendships', pairId);
  await expect('a learner can send a friend request', true, friendRequest);
  await expect('the requester cannot accept their own request', false, () =>
    updateDoc(friendshipRef(a.db), { status: 'accepted', acceptedAt: nowIso() }));
  await expect('a stranger cannot read a friendship', false, () => getDoc(friendshipRef(c.db)));
  await expect('a stranger cannot accept a friendship', false, () =>
    updateDoc(friendshipRef(c.db), { status: 'accepted', acceptedAt: nowIso() }));
  await expect('a stranger cannot delete a friendship', false, () => deleteDoc(friendshipRef(c.db)));
  await expect('a pending request does not open the requester\'s public profile', false, () =>
    getDoc(doc(b.db, 'publicProfiles', ua.uid)));
  await expect('the invitee cannot change other fields when accepting', false, () =>
    updateDoc(friendshipRef(b.db), { status: 'accepted', acceptedAt: nowIso(), requesterName: 'Mallory' }));
  await expect('a reaction on a pending request is denied', false, () =>
    updateDoc(friendshipRef(b.db), { ['reactions.' + ub.uid]: { emoji: '🎉', at: nowIso() } }));
  await expect('the invitee can accept', true, () =>
    updateDoc(friendshipRef(b.db), { status: 'accepted', acceptedAt: nowIso() }));
  await expect('friends can read each other\'s public profile', true, () => getDoc(doc(b.db, 'publicProfiles', ua.uid)));
  await expect('a stranger cannot read a public profile', false, () => getDoc(doc(c.db, 'publicProfiles', ua.uid)));
  await expect('a friend can send a preset reaction', true, () =>
    updateDoc(friendshipRef(b.db), { ['reactions.' + ub.uid]: { emoji: '🎉', at: nowIso() } }));
  await expect('a reaction that is not a preset is denied', false, () =>
    updateDoc(friendshipRef(b.db), { ['reactions.' + ub.uid]: { emoji: 'hi', at: nowIso() } }));
  await expect('a friend cannot write the other friend\'s reaction', false, () =>
    updateDoc(friendshipRef(b.db), { ['reactions.' + ua.uid]: { emoji: '🎉', at: nowIso() } }));
  await expect('a stranger cannot react', false, () =>
    updateDoc(friendshipRef(c.db), { ['reactions.' + uc.uid]: { emoji: '🎉', at: nowIso() } }));

  const contestId = `${pairId}_${today}`;
  const contestRef = (db) => doc(db, 'contests', contestId);
  const contest = (overrides = {}) => ({
    uids: [ua.uid, ub.uid], createdBy: ua.uid, creatorName: 'Noa', inviteeName: 'Ido', dateStr: today,
    expiresAtMs: Date.now() + 12 * 3600 * 1000, seed: 42, unitNumber: 1, status: 'invited', createdAt: nowIso(),
    ...overrides,
  });
  const contestResult = (overrides = {}) => ({
    correctCount: 5, totalCount: 10, timeMs: 60000, finishedAt: nowIso(), ...overrides,
  });
  const putResult = (db, uid, value) => updateDoc(contestRef(db), { ['results.' + uid]: value });
  await deleteDoc(contestRef(a.db)).catch(() => {});
  await expect('a contest created in someone else\'s name is denied', false, () =>
    setDoc(contestRef(a.db), contest({ createdBy: ub.uid })));
  await expect('a contest whose first uid is not the creator is denied', false, () =>
    setDoc(contestRef(a.db), contest({ uids: [ub.uid, ua.uid] })));
  await expect('a contest with a stranger is denied', false, () =>
    setDoc(doc(c.db, 'contests', `${[uc.uid, ua.uid].sort().join('_')}_${today}`),
      contest({ uids: [uc.uid, ua.uid], createdBy: uc.uid, creatorName: 'Eve' })));
  await expect('a contest that already ended is denied', false, () =>
    setDoc(contestRef(a.db), contest({ expiresAtMs: Date.now() - 1000 })));
  await expect('a contest that lasts more than a day is denied', false, () =>
    setDoc(contestRef(a.db), contest({ expiresAtMs: Date.now() + 30 * 3600 * 1000 })));
  await expect('a contest created as already accepted is denied', false, () =>
    setDoc(contestRef(a.db), contest({ status: 'accepted' })));
  await expect('a contest with the wrong id is denied', false, () =>
    setDoc(doc(a.db, 'contests', `${pairId}_2099-01-01`), contest()));
  await expect('a contest with a made-up creator name is denied', false, () =>
    setDoc(contestRef(a.db), contest({ creatorName: 'Mallory' })));
  await expect('a friend can invite to a contest', true, () => setDoc(contestRef(a.db), contest()));
  await expect('a stranger cannot read a contest', false, () => getDoc(contestRef(c.db)));
  await expect('the invitee cannot post a result before accepting', false, () =>
    putResult(b.db, ub.uid, contestResult()));
  await expect('the creator cannot accept their own invitation', false, () =>
    updateDoc(contestRef(a.db), { status: 'accepted' }));
  await expect('a player cannot post a result for the other player', false, () =>
    putResult(a.db, ub.uid, contestResult()));
  await expect('a result faster than 3 seconds is denied', false, () =>
    putResult(a.db, ua.uid, contestResult({ timeMs: 1000 })));
  await expect('a result with fewer than 5 questions is denied', false, () =>
    putResult(a.db, ua.uid, contestResult({ totalCount: 3, correctCount: 3 })));
  await expect('a result with more correct answers than questions is denied', false, () =>
    putResult(a.db, ua.uid, contestResult({ correctCount: 11 })));
  await expect('a result with an extra field is denied', false, () =>
    putResult(a.db, ua.uid, contestResult({ bonus: 1 })));
  await expect('the creator can post a valid result', true, () => putResult(a.db, ua.uid, contestResult()));
  await expect('a result cannot be replaced', false, () => putResult(a.db, ua.uid, contestResult({ correctCount: 10 })));
  await expect('the invitee can accept', true, () => updateDoc(contestRef(b.db), { status: 'accepted' }));
  await expect('the invitee can post a valid result after accepting', true, () =>
    putResult(b.db, ub.uid, contestResult({ correctCount: 7 })));
  // An expired contest cannot be created by a client, so it is seeded the way the server would
  const expiredId = `${pairId}_2020-01-01`;
  await seedAsServer(`contests/${expiredId}`, {
    uids: { arrayValue: { values: [{ stringValue: ua.uid }, { stringValue: ub.uid }] } },
    createdBy: { stringValue: ua.uid }, status: { stringValue: 'accepted' }, dateStr: { stringValue: '2020-01-01' },
    expiresAtMs: { integerValue: '1000' },
  });
  await expect('a result on an expired contest is denied', false, () =>
    updateDoc(doc(b.db, 'contests', expiredId), { ['results.' + ub.uid]: contestResult() }));
  await expect('a player can delete an expired contest', true, () => deleteDoc(doc(b.db, 'contests', expiredId)));
  await expect('a stranger cannot delete a contest', false, () => deleteDoc(contestRef(c.db)));
  await expect('a player can delete a contest', true, () => deleteDoc(contestRef(a.db)));
  await expect('a friend can remove the friendship', true, () => deleteDoc(friendshipRef(b.db)));
  await deleteDoc(doc(b.db, 'publicProfiles', ub.uid)).catch(() => {});
}

// Parent codes: only their learner changes them
await deleteDoc(doc(a.db, 'parentInvites', CODE)).catch(() => {});
await setDoc(doc(a.db, 'parentInvites', CODE), invite());
await expect('another learner cannot change a parent code', false, () =>
  updateDoc(doc(b.db, 'parentInvites', CODE), { childName: 'Mallory' }));
await expect('another learner cannot delete a parent code', false, () => deleteDoc(doc(b.db, 'parentInvites', CODE)));
await expect('a learner cannot hand a parent code to another learner', false, () =>
  updateDoc(doc(a.db, 'parentInvites', CODE), { childUid: ub.uid }));
await expect('a parent cannot claim a code for a different child uid', false, () => claim(b.db, { childUid: uc.uid }));
await deleteDoc(doc(a.db, 'parentInvites', CODE)).catch(() => {});

// Anonymous (guest) sessions can only reach their own learners document, and only once access is
// open: a guest can't redeem an invite code, so the closed tester phase keeps guests out
await expect('while access is closed, a guest cannot save a learner document', false, () =>
  setDoc(doc(d.db, 'learners', d.auth.currentUser.uid), { probe: true }));
await serverWrite('config/access', { open: { booleanValue: true } });
await expect('a guest can save their own learner document', true, () =>
  setDoc(doc(d.db, 'learners', d.auth.currentUser.uid), { probe: true }));
await expect('a guest can read their own learner document', true, () =>
  getDoc(doc(d.db, 'learners', d.auth.currentUser.uid)));
await expect('a guest cannot read another learner document', false, () => getDoc(doc(d.db, 'learners', ua.uid)));
await deleteDoc(doc(d.db, 'learners', d.auth.currentUser.uid)).catch(() => {});
await serverDelete('config/access');
const guestDenied = {
  'a friend code': ['friendCodes', 'K7MP2QXA'],
  'a username': ['usernames', 'emutest'],
  'a public profile': ['publicProfiles', ua.uid],
  'a friendship': ['friendships', pairId],
  'a contest': ['contests', `${pairId}_${today}`],
  'a parent code': ['parentInvites', CODE],
  'a parent link': ['parentLinks', linkId],
  'a report snapshot': ['reportSnapshots', ua.uid],
  'an entitlement': ['entitlements', ua.uid],
  'a push subscription': ['pushSubscriptions', ua.uid],
};
for (const [label, [collectionName, id]] of Object.entries(guestDenied)) {
  await expect(`a guest cannot read ${label}`, false, () => getDoc(doc(d.db, collectionName, id)));
}
await expect('a guest cannot publish a friend code', false, () =>
  setDoc(doc(d.db, 'friendCodes', 'K7MP2QXB'), lookupEntry(d.auth.currentUser.uid)));
await expect('a guest cannot publish a public profile', false, () =>
  setDoc(doc(d.db, 'publicProfiles', d.auth.currentUser.uid), publicProfile(1)));
await expect('a guest cannot make a parent code', false, () =>
  setDoc(doc(d.db, 'parentInvites', 'K7MP2QXC'), invite({ childUid: d.auth.currentUser.uid })));
await expect('a guest cannot save a push subscription', false, () =>
  setDoc(doc(d.db, 'pushSubscriptions', d.auth.currentUser.uid), pushSub()));
const signedOut = app('signedOut');
await expect('a signed-out visitor cannot read a learner document', false, () => getDoc(doc(signedOut.db, 'learners', ua.uid)));
await expect('a signed-out visitor cannot read a friend code', false, () => getDoc(doc(signedOut.db, 'friendCodes', 'K7MP2QXA')));

// Anything the rules do not name is denied, even for a real account
await expect('an unknown top-level collection is denied for reads', false, () => getDoc(doc(a.db, 'madeUp', 'x')));
await expect('an unknown top-level collection is denied for writes', false, () => setDoc(doc(a.db, 'madeUp', 'x'), { a: 1 }));
await expect('an unknown subcollection of a learner is denied', false, () =>
  setDoc(doc(a.db, 'learners', ua.uid, 'madeUp', 'x'), { a: 1 }));
await expect('another learner cannot write a learner document', false, () =>
  setDoc(doc(b.db, 'learners', ua.uid), { probe: true }));

// ---- Closed early-tester phase: an account that was never invited can use nothing ----
const e = app('e');
const ue = await signInOrCreate(e, 'emutest-uninvited@peachnote.tutor.local');
await serverDelete(`allowed/${ue.uid}`);
await serverDelete('config/access');
const uninvitedProfile = { name: 'Eve', updatedAt: nowIso() };
await expect('an uninvited account cannot read its learner document', false, () => getDoc(doc(e.db, 'learners', ue.uid)));
await expect('an uninvited account cannot create its learner document', false, () =>
  setDoc(doc(e.db, 'learners', ue.uid), uninvitedProfile));
await expect('an uninvited account cannot send feedback', false, () =>
  setDoc(doc(e.db, 'feedback', 'note-e1'), { uid: ue.uid, day: today, kind: 'idea', text: 'hi', gradeId: 'grade-3', screen: 'settings', appVersion: 'abc' }));
await expect('an uninvited account cannot write analytics', false, () =>
  setDoc(doc(e.db, 'analyticsDaily', `${today}_${ue.uid}`), { uid: ue.uid, day: today, gradeId: 'grade-3', counts: { session_start: 1 } }));
await expect('an uninvited account cannot record mission struggle', false, () =>
  setDoc(doc(e.db, 'missionStruggle', `${today}_${ue.uid}_g3-u1-m1_explorer`),
    { uid: ue.uid, day: today, missionId: 'g3-u1-m1', tier: 'explorer', starts: 1, abandons: 1 }));
await expect('an uninvited account cannot report client errors', false, () =>
  setDoc(doc(e.db, 'clientErrors', `${today}_zzz`),
    { day: today, message: 'boom', stack: '', source: 'render', appVersion: 'test', count: 1, lastSeen: serverTimestamp() }));
await expect('an uninvited account cannot publish a username', false, () =>
  setDoc(doc(e.db, 'usernames', 'emutest-uninvited'), lookupEntry(ue.uid)));
await expect('an uninvited account cannot allow itself', false, () =>
  setDoc(doc(e.db, 'allowed', ue.uid), { cohort: 'smoke', invitedAt: 1 }));
await expect('an uninvited account cannot open access for everyone', false, () =>
  setDoc(doc(e.db, 'config', 'access'), { open: true }));
await expect('nobody can read an invite code', false, () => getDoc(doc(a.db, 'invites', 'ABCDEFGH23')));
await expect('nobody can write an invite code', false, () => setDoc(doc(a.db, 'invites', 'ABCDEFGH23'), { usedByUid: null }));
await expect('an invited account can read its own allowed record', true, () => getDoc(doc(a.db, 'allowed', ua.uid)));
await expect('an account cannot read another account allowed record', false, () => getDoc(doc(e.db, 'allowed', ua.uid)));
await expect('an invited account can still write its learner document', true, () =>
  setDoc(doc(a.db, 'learners', ua.uid), { name: 'Noa', updatedAt: nowIso() }, { merge: true }));
// The launch switch: once config/access.open is true, everyone signed in is let in; closing it shuts them out again
await serverWrite('config/access', { open: { booleanValue: true } });
await expect('with access open, an uninvited account can create its learner document', true, () =>
  setDoc(doc(e.db, 'learners', ue.uid), uninvitedProfile));
await expect('with access open, an account can read the access flag', true, () => getDoc(doc(e.db, 'config', 'access')));
await serverWrite('config/access', { open: { booleanValue: false } });
await expect('with access closed again, the uninvited account is shut out', false, () => getDoc(doc(e.db, 'learners', ue.uid)));
await serverDelete('config/access');
await deleteDoc(doc(a.db, 'usernames', 'emutest')).catch(() => {});

for (const [status, label, detail] of results) console.log(`${status}  ${label}${detail ? `  (${detail})` : ''}`);
process.exit(results.some(([s]) => s === 'FAIL') ? 1 : 0);
