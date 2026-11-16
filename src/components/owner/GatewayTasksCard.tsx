import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { markGatewayTaskDone, type GatewayTask } from '../../services/ownerGatewayTasksService';

const CARD_CLASS =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900/90';
/** A task open longer than this is shown in red */
const LATE_AFTER_MS = 24 * 60 * 60 * 1000;

const TITLES: Record<GatewayTask['kind'], string> = {
  cancel: 'Cancel the standing order',
  amount: 'Change the standing order amount',
  refund: 'Refund',
  match_renewal: 'Unmatched Grow charge',
  extend: 'Extend the standing order',
};

const shekels = (agorot: number) => `₪${(agorot / 100).toLocaleString('en-GB', { maximumFractionDigits: 2 })}`;
const day = (ms: number) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

interface GatewayTasksCardProps {
  tasks: GatewayTask[];
  nowMs?: number;
}

/**
 * Work the owner does by hand in Grow's dashboard (Grow through Make can't cancel or change a
 * standing order). Each task names the parent so they can be found in Grow; "Done" closes it.
 */
export const GatewayTasksCard: React.FC<GatewayTasksCardProps> = ({ tasks: initialTasks, nowMs = Date.now() }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => setTasks(initialTasks), [initialTasks]);

  const lateCount = tasks.filter((task) => nowMs - task.createdAt > LATE_AFTER_MS).length;

  const handleDone = async (taskId: string) => {
    if (busyId) return;
    setBusyId(taskId);
    const result = await markGatewayTaskDone(taskId);
    if (result.ok) {
      setTasks(result.tasks);
      setMessage(null);
    } else {
      setMessage(result.message);
    }
    setBusyId(null);
  };

  return (
    <section className={CARD_CLASS} aria-labelledby="gateway-tasks-title">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
          <CreditCard className="h-4 w-4" />
        </div>
        <div>
          <h2 id="gateway-tasks-title" className="text-base font-extrabold text-slate-900 dark:text-white">
            Grow tasks{' '}
            <span className={`ms-1 text-sm font-bold ${lateCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-violet-600 dark:text-violet-400'}`}>
              {tasks.length}
            </span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Do these by hand in Grow&apos;s dashboard, before the date shown, then press Done.
            {lateCount > 0 && <span className="font-bold text-red-600 dark:text-red-400"> {lateCount} open for more than a day.</span>}
          </p>
        </div>
      </div>

      {message && (
        <p role="alert" className="mt-3 text-xs font-bold text-red-600 dark:text-red-400">
          {message}
        </p>
      )}

      {tasks.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Nothing to do in Grow.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {TITLES[task.kind]}
                    {task.amountAgorot > 0 && <span className="tabular-nums"> · {shekels(task.amountAgorot)}</span>}
                    {task.dueAt > 0 && <span className="font-normal text-slate-500 dark:text-slate-400"> · before {day(task.dueAt)}</span>}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <bdi dir="auto">{task.payerName || 'Unknown payer'}</bdi>
                    {task.payerPhone && (
                      <>
                        {' · '}
                        <a className="underline" href={`tel:${task.payerPhone}`} dir="ltr">
                          {task.payerPhone}
                        </a>
                      </>
                    )}
                    {task.payerEmail && <bdi dir="ltr"> · {task.payerEmail}</bdi>}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{task.note}</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleDone(task.id)}
                  disabled={busyId !== null}
                  aria-label={`Done: ${TITLES[task.kind]}, ${task.payerName || task.id}`}
                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                >
                  {busyId === task.id ? 'Saving…' : 'Done'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
