/**
 * The owner's Grow tasks (`gatewayTasks.ts`): listed with the owner stats, and marked done with
 * PATCH /api/owner-stats {taskId} (it shares that file to stay within Vercel's function limit).
 */
import { ConflictError, createFirestoreAdmin, type FirestoreAdmin } from './firestoreAdmin.js';
import { GATEWAY_TASK_ID_PATTERN, openGatewayTasks, type GatewayTask } from './gatewayTasks.js';
import { AdminError } from './googleAdmin.js';
import { authenticateOwner } from './ownerRequest.js';
import { errorResponse, jsonResponse, readJsonBody, type ParentRequestDeps } from './parentRequest.js';

const MAX_BODY_BYTES = 512;

export async function listOpenGatewayTasks(admin: FirestoreAdmin): Promise<GatewayTask[]> {
  return openGatewayTasks(await admin.listDocuments('gatewayTasks'));
}

export interface GatewayTaskDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
}

/** Marks one task done; answers the open tasks left */
export async function handleGatewayTaskDone(
  request: Request,
  env: Record<string, string | undefined>,
  deps: GatewayTaskDeps = {}
): Promise<Response> {
  if (request.method !== 'PATCH') return errorResponse(405, 'Method not allowed');
  const owner = await authenticateOwner(request, env, deps);
  if (owner instanceof Response) return owner;
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  const taskId = typeof body?.taskId === 'string' ? body.taskId : '';
  if (!GATEWAY_TASK_ID_PATTERN.test(taskId)) return errorResponse(400, 'Invalid request');

  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin } = deps;
  try {
    const admin = createAdmin(owner.account, owner.projectId, { fetchImpl });
    const task = await admin.getDocument('gatewayTasks', taskId);
    if (!task) return errorResponse(404, 'No such task');
    await admin.commit([{
      collection: 'gatewayTasks',
      id: taskId,
      mergeFields: ['doneAt'],
      fields: { doneAt: nowMs() },
      ...(task.updateTime ? { precondition: { updateTime: task.updateTime } } : {}),
    }]);
    return jsonResponse(200, { gatewayTasks: await listOpenGatewayTasks(admin) });
  } catch (error) {
    if (error instanceof ConflictError) return errorResponse(409, 'The task changed, reload');
    console.error(`owner-stats: task update failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not update the task');
  }
}
