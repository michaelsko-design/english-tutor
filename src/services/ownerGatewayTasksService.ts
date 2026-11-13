import { OWNER_ERROR_BY_STATUS, ownerAuthHeaders } from './ownerStatsService';
import type { GatewayTask } from '../../api/_lib/gatewayTasks';

export type { GatewayTask };

const OWNER_STATS_URL = '/api/owner-stats';

export type GatewayTasksResult = { ok: true; tasks: GatewayTask[] } | { ok: false; message: string };

/** Marks a Grow task done (the owner did it in Grow's dashboard); answers the open tasks left. */
export async function markGatewayTaskDone(taskId: string): Promise<GatewayTasksResult> {
  try {
    const headers = await ownerAuthHeaders();
    if (!headers) return { ok: false, message: OWNER_ERROR_BY_STATUS[401] };
    const response = await fetch(OWNER_STATS_URL, {
      method: 'PATCH',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    if (response.ok) return { ok: true, tasks: ((await response.json()) as { gatewayTasks: GatewayTask[] }).gatewayTasks };
    const detail = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, message: detail?.error ?? OWNER_ERROR_BY_STATUS[response.status] ?? 'Could not update the task.' };
  } catch {
    return { ok: false, message: 'No connection.' };
  }
}
