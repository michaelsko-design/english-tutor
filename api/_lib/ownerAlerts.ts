/**
 * Tells the owner, by email and Telegram, about Grow work to do by hand (`gatewayTasks.ts`) and other
 * owner notices (Make credits running low, `makeCredits.ts`). The alert
 * goes through the same Make scenario as payments (`action: "notify"`, docs/grow-make-setup.md),
 * which sends the email and the Telegram message. It never carries the payer's details: the owner
 * finds them on the owner dashboard. An alert that can't be sent is logged; it never fails the
 * request that saved the task.
 */
import type { DocumentWrite, PlainValue } from './firestoreAdmin.js';
import { readGatewayTask, type GatewayTask, type GatewayTaskKind } from './gatewayTasks.js';
import { readGrowMakeConfig } from './payments/growMake.js';

const TIMEOUT_MS = 10_000;
const AGOROT_PER_SHEKEL = 100;

/** What the owner has to do, in the owner's language */
const TITLE_HE: Record<GatewayTaskKind, string> = {
  cancel: 'לבטל הוראת קבע ב-Grow',
  amount: 'לשנות סכום הוראת קבע ב-Grow',
  refund: 'להחזיר כסף ב-Grow',
  match_renewal: 'חיוב Grow שלא שויך למנוי',
  extend: 'להאריך הוראת קבע ב-Grow',
};

export interface AlertOptions {
  /** A daily reminder for a task still open */
  reminder?: boolean;
}

export type OwnerAlerter = (tasks: GatewayTask[], options?: AlertOptions) => Promise<void>;

const formatDate = (ms: number) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit', year: 'numeric' }).format(ms);

function alertBody(task: GatewayTask, dashboardUrl: string, reminder: boolean): OwnerNotice {
  const dueDate = task.dueAt > 0 ? formatDate(task.dueAt) : '';
  const subject = `${reminder ? 'תזכורת: ' : ''}EnglishVibe: ${TITLE_HE[task.kind]}`;
  const lines = [
    TITLE_HE[task.kind],
    task.note,
    task.amountAgorot > 0 ? `סכום: ₪${task.amountAgorot / AGOROT_PER_SHEKEL}` : '',
    dueDate ? `עד: ${dueDate}` : 'בלי תאריך יעד',
    dashboardUrl ? `פרטים וסימון "בוצע": ${dashboardUrl}` : '',
  ];
  return { kind: task.kind, subject, text: lines.filter(Boolean).join('\n'), dueDate, dashboardUrl };
}

/** A message to the owner through the Make scenario's `notify` route (email + Telegram) */
export interface OwnerNotice {
  kind: string;
  subject: string;
  text: string;
  dueDate?: string;
  dashboardUrl?: string;
}

/** Sends one notice; true when Make took it. Without the Make scenario (another gateway) nothing is sent. */
export function createOwnerNotifier(env: Record<string, string | undefined>, fetchImpl: typeof fetch = fetch): (notice: OwnerNotice) => Promise<boolean> {
  const config = readGrowMakeConfig(env);
  return async (notice) => {
    if (!config) return false;
    try {
      const response = await fetchImpl(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-make-apikey': config.apiKey },
        body: JSON.stringify({ action: 'notify', dueDate: '', dashboardUrl: '', ...notice }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) console.error(`owner-alert: failed (${response.status})`);
      return response.ok;
    } catch {
      console.error('owner-alert: unreachable');
      return false;
    }
  };
}

/** Sends task alerts through the Make scenario; does nothing without one (another gateway) */
export function createOwnerAlerter(env: Record<string, string | undefined>, fetchImpl: typeof fetch = fetch): OwnerAlerter {
  if (!readGrowMakeConfig(env)) return async () => {};
  const notify = createOwnerNotifier(env, fetchImpl);
  const origin = (env.APP_ORIGIN ?? '').replace(/\/+$/, '');
  const dashboardUrl = origin ? `${origin}/?owner` : '';

  return async (tasks, { reminder = false } = {}) => {
    await Promise.all(tasks.map((task) => notify(alertBody(task, dashboardUrl, reminder))));
  };
}

/** The new open tasks among saved writes (a task marked done is a partial write without `kind`) */
function savedTasks(writes: DocumentWrite[]): GatewayTask[] {
  return writes
    .filter((write) => write.collection === 'gatewayTasks' && !write.mergeFields && typeof write.fields.kind === 'string')
    .map((write) => readGatewayTask({ id: write.id, fields: write.fields as Record<string, PlainValue> }))
    .filter((task): task is GatewayTask => task !== null && task.doneAt === 0);
}

/** The same admin, alerting the owner after every commit that saves a Grow task */
export function withOwnerAlerts<T extends { commit(writes: DocumentWrite[]): Promise<void> }>(admin: T, alert: OwnerAlerter): T {
  return {
    ...admin,
    async commit(writes: DocumentWrite[]): Promise<void> {
      await admin.commit(writes);
      const tasks = savedTasks(writes);
      if (tasks.length > 0) await alert(tasks);
    },
  };
}
