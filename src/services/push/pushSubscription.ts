import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { LearnerGender } from '../../types/learner';

/**
 * The learner's streak reminder: a Web Push subscription kept in `pushSubscriptions/{uid}` together
 * with the streak facts the daily cron (api/streak-reminder.ts) needs. Everything here is optional:
 * the app works the same without it.
 */

const COLLECTION = 'pushSubscriptions';

export type ReminderSupport = 'supported' | 'needs-install' | 'unsupported';

export interface ReminderFacts {
  streakDays: number;
  streakLastDateStr?: string;
  isShabbatObserver: boolean;
  gender?: LearnerGender;
}

export type ReminderResult = { ok: true } | { ok: false; errorHe: string };

const NOT_ALLOWED_HE = 'ההתראות חסומות בדפדפן. אפשר לאפשר אותן בהגדרות האתר.';
const FAILED_HE = 'לא הצלחנו להפעיל תזכורות. כדאי לנסות שוב.';

export function getVapidPublicKey(): string {
  return import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim() ?? '';
}

export function isIosDevice(userAgent: string): boolean {
  return /iPad|iPhone|iPod/.test(userAgent);
}

function isStandalone(): boolean {
  return window.matchMedia?.('(display-mode: standalone)').matches || (navigator as { standalone?: boolean }).standalone === true;
}

/** iOS only allows push for an app added to the Home Screen, so it needs the install guide first. */
export function getReminderSupport(): ReminderSupport {
  if (!getVapidPublicKey() || !('serviceWorker' in navigator)) return 'unsupported';
  const hasPush = 'PushManager' in window && 'Notification' in window;
  if (isIosDevice(navigator.userAgent) && !isStandalone()) return 'needs-install';
  return hasPush ? 'supported' : 'unsupported';
}

export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function toBase64Url(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.ready;
}

function buildDocument(subscription: PushSubscription, facts: ReminderFacts) {
  return {
    endpoint: subscription.endpoint,
    p256dh: toBase64Url(subscription.getKey('p256dh')),
    auth: toBase64Url(subscription.getKey('auth')),
    streakDays: facts.streakDays,
    ...(facts.streakLastDateStr ? { streakLastDateStr: facts.streakLastDateStr } : {}),
    isShabbatObserver: facts.isShabbatObserver,
    ...(facts.gender ? { gender: facts.gender } : {}),
    updatedAt: new Date().toISOString(),
  };
}

export async function isReminderOn(uid: string): Promise<boolean> {
  if (!db) return false;
  try {
    return (await getDoc(doc(db, COLLECTION, uid))).exists();
  } catch {
    return false;
  }
}

/** Asks permission, subscribes this device and stores the subscription. */
export async function enableReminder(uid: string, facts: ReminderFacts): Promise<ReminderResult> {
  if (!db) return { ok: false, errorHe: FAILED_HE };
  try {
    if ((await Notification.requestPermission()) !== 'granted') return { ok: false, errorHe: NOT_ALLOWED_HE };
    const registration = await getRegistration();
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey()),
      }));
    await setDoc(doc(db, COLLECTION, uid), buildDocument(subscription, facts));
    return { ok: true };
  } catch {
    return { ok: false, errorHe: FAILED_HE };
  }
}

/**
 * Keeps the stored streak facts current. When reminders are off there is
 * no document, so the update is refused and nothing is created.
 */
export async function syncReminder(uid: string, facts: ReminderFacts): Promise<void> {
  if (!db) return;
  try {
    await updateDoc(doc(db, COLLECTION, uid), {
      streakDays: facts.streakDays,
      ...(facts.streakLastDateStr ? { streakLastDateStr: facts.streakLastDateStr } : {}),
      isShabbatObserver: facts.isShabbatObserver,
      ...(facts.gender ? { gender: facts.gender } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch {
    // Reminders are off (no document) or offline; the next change retries.
  }
}

export async function disableReminder(uid: string): Promise<ReminderResult> {
  if (!db) return { ok: false, errorHe: FAILED_HE };
  try {
    const subscription = await (await getRegistration()).pushManager.getSubscription();
    await subscription?.unsubscribe();
    await deleteDoc(doc(db, COLLECTION, uid));
    return { ok: true };
  } catch {
    return { ok: false, errorHe: FAILED_HE };
  }
}
