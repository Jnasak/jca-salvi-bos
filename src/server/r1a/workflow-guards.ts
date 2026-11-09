/** Pure decisions only. Caller MUST authorise and recheck these inside a DB transaction.
 * No return value is a persisted receipt, authenticated session or committed update.
 */
import { reason, outcome, revision } from '../../shared/r1a/validation.ts';

export type Status = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type LeadState = Readonly<{
  status: Status; ownerId: string | null; revision: number; hasOpenFollowUp: boolean;
}>;
export type Decision<T> = { ok: true; value: T } | {
  ok: false; http: 409 | 422; code: string; field?: string; message: string;
};
const conflict = (code: string): Decision<never> => ({
  ok: false, http: 409, code,
  message: code === 'FOLLOW_UP_CONFLICT'
    ? 'Complete or cancel the open follow-up before changing this state.'
    : 'Review the latest record before continuing.',
});

function check(state: LeadState, expected: unknown, input: unknown, field: string, completion = false): Decision<string> {
  const rev = revision(expected);
  if (!rev.ok) return { ok: false, http: 422, code: 'VALIDATION_FAILED', field: 'expected_revision', message: rev.error.message };
  const parsed = completion ? outcome(input) : reason(input);
  if (!parsed.ok) return { ok: false, http: 422, code: 'VALIDATION_FAILED', field, message: parsed.error.message };
  if (rev.value !== state.revision) return conflict('REVISION_CONFLICT');
  return { ok: true, value: parsed.value };
}

/** Requires server-owned lead state. Owner assignment uses its distinct route. */
export function transition(state: LeadState, target: unknown, inputReason: unknown, expected: unknown): Decision<{ target: Status; reason: string }> {
  const checked = check(state, expected, inputReason, 'reason');
  if (!checked.ok) return checked;
  if ((state.status === 'assigned' || state.status === 'in_progress') && !state.ownerId) {
    return conflict('TRANSITION_NOT_ALLOWED');
  }
  // Terminal + open action is inconsistent data: never silently repair it.
  if ((state.status === 'closed' || state.status === 'resolved') && state.hasOpenFollowUp) return conflict('FOLLOW_UP_CONFLICT');
  if ((target === 'closed' || target === 'resolved') && state.hasOpenFollowUp) return conflict('FOLLOW_UP_CONFLICT');
  const allowed: Record<Status, readonly Status[]> = {
    new: ['closed'],
    assigned: ['in_progress', 'closed'],
    in_progress: ['resolved', 'closed'],
    resolved: [state.ownerId ? 'in_progress' : 'new'], // unowned = defensive legacy case only
    closed: [state.ownerId ? 'in_progress' : 'new'],
  };
  if (typeof target !== 'string' || !allowed[state.status].includes(target as Status)) return conflict('TRANSITION_NOT_ALLOWED');
  return { ok: true, value: { target: target as Status, reason: checked.value } };
}

export function clearOwner(state: LeadState, inputReason: unknown, expected: unknown): Decision<{ target: 'new'; ownerId: null; reason: string }> {
  const checked = check(state, expected, inputReason, 'reason');
  if (!checked.ok) return checked;
  if (!state.ownerId || !['assigned', 'in_progress'].includes(state.status)) return conflict('TRANSITION_NOT_ALLOWED');
  if (state.hasOpenFollowUp) return conflict('FOLLOW_UP_CONFLICT');
  return { ok: true, value: { target: 'new', ownerId: null, reason: checked.value } };
}

export type FollowUpStatus = 'open' | 'completed' | 'cancelled';
export function disposeFollowUp(
  state: LeadState, actionStatus: FollowUpStatus, operation: 'complete' | 'cancel', input: unknown, expected: unknown,
): Decision<{ status: 'completed' | 'cancelled'; text: string }> {
  const checked = check(state, expected, input, operation === 'complete' ? 'outcome' : 'reason', operation === 'complete');
  if (!checked.ok) return checked;
  if (actionStatus !== 'open' || !state.hasOpenFollowUp || !state.ownerId || !['assigned', 'in_progress'].includes(state.status)) return conflict('FOLLOW_UP_CONFLICT');
  return { ok: true, value: { status: operation === 'complete' ? 'completed' : 'cancelled', text: checked.value } };
}
