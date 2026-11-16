/**
 * Tells the owner, by email and WhatsApp, about Grow work to do by hand (`gatewayTasks.ts`). The alert
 * goes through the same Make scenario as payments (`action: "notify"`, docs/grow-make-setup.md),
 * which sends the email and the WhatsApp message. It never carries the payer's details: the owner
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

function alertBody(task: GatewayTask, dashboardUrl: string, reminder: boolean) {
  const dueDate = task.dueAt > 0 ? formatDate(task.dueAt) : '';
  const subject = `${reminder ? 'תזכורת: ' : ''}EnglishVibe: ${TITLE_HE[task.kind]}`;
  const lines = [
    TITLE_HE[task.kind],
    task.note,
    task.amountAgorot > 0 ? `סכום: ₪${task.amountAgorot / AGOROT_PER_SHEKEL}` : '',
    dueDate ? `עד: ${dueDate}` : 'בלי תאריך יעד',
    dashboardUrl ? `פרטים וסימון "בוצע": ${dashboardUrl}` : '',
  ];
  return { action: 'notify', kind: task.kind, subject, text: lines.filter(Boolean).join('\n'), dueDate, dashboardUrl };
}

/** Sends alerts through the Make scenario; does nothing without one (another gateway) */
export function createOwnerAlerter(env: Record<string, string | undefined>, fetchImpl: typeof fetch = fetch): OwnerAlerter {
  const config = readGrowMakeConfig(env);
  if (!config) return async () => {};
  const origin = (env.APP_ORIGIN ?? '').replace(/\/+$/, '');
  const dashboardUrl = origin ? `${origin}/?owner` : '';

  async function send(task: GatewayTask, reminder: boolean): Promise<void> {
    try {
      const response = await fetchImpl(config!.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-make-apikey': config!.apiKey },
        body: JSON.stringify(alertBody(task, dashboardUrl, reminder)),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!response.ok) console.error(`owner-alert: failed (${response.status})`);
    } catch {
      console.error('owner-alert: unreachable');
    }
  }

  return async (tasks, { reminder = false } = {}) => {
    await Promise.all(tasks.map((task) => send(task, reminder)));
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
