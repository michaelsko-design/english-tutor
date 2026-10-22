/**
 * Checks firestore.rules against the local emulators with real client calls:
 * `npm run emulators`, then `node scripts/emulator/rulesSmoke.mjs`.
 * Uses the two emulator test accounts (see .claude/test-user-emulator.md); never the live project.
 */
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  connectFirestoreEmulator, deleteDoc, doc, getDoc, getFirestore, setDoc, writeBatch,
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

for (const [status, label, detail] of results) console.log(`${status}  ${label}${detail ? `  (${detail})` : ''}`);
process.exit(results.some(([s]) => s === 'FAIL') ? 1 : 0);
