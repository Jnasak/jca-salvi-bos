import { test } from 'node:test';
import assert from 'node:assert/strict';
import { transition, clearOwner, disposeFollowUp } from '../src/server/r1a/workflow-guards.ts';
import type { LeadState, Status } from '../src/server/r1a/workflow-guards.ts';
const lead = (status: Status, ownerId: string | null = 'synthetic-principal-a', hasOpenFollowUp = false): LeadState => ({ status, ownerId, hasOpenFollowUp, revision: 7 });

test('owned/unowned terminal reopening follows all four product cases', () => {
  for (const status of ['resolved', 'closed'] as const) {
    assert.equal(transition(lead(status), 'in_progress', 'Synthetic reopen', 7).ok, true);
    assert.equal(transition(lead(status, null), 'new', 'Synthetic recovery', 7).ok, true);
    assert.equal(transition(lead(status, null), 'in_progress', 'Synthetic recovery', 7).ok, false);
  }
});

test('status changes require reasons and reject stale or missing revisions', () => {
  assert.equal(transition(lead('assigned'), 'in_progress', '', 7).ok, false);
  const stale = transition(lead('assigned'), 'in_progress', 'Synthetic start', 6);
  assert.equal(stale.ok ? '' : stale.code, 'REVISION_CONFLICT');
  assert.equal(transition(lead('assigned'), 'in_progress', 'Synthetic start', undefined).ok, false);
  assert.equal(transition(lead('assigned', null), 'in_progress', 'Synthetic start', 7).ok, false);
  assert.equal(transition(lead('new', null), 'assigned', 'Synthetic assign', 7).ok, false); // distinct owner route
});

test('active actions block closure/deassignment without silently changing input', () => {
  const state = Object.freeze(lead('in_progress', 'synthetic-principal-a', true));
  const result = transition(state, 'closed', 'Synthetic close', 7);
  assert.equal(result.ok ? '' : result.code, 'FOLLOW_UP_CONFLICT');
  assert.equal(clearOwner(state, 'Synthetic clear', 7).ok, false);
  assert.equal(state.hasOpenFollowUp, true);
  assert.equal(state.revision, 7);
});

test('terminal owners cannot be cleared; open owner clear requires no active action', () => {
  for (const status of ['resolved', 'closed'] as const) assert.equal(clearOwner(lead(status), 'Synthetic clear', 7).ok, false);
  assert.deepEqual(clearOwner(lead('assigned'), 'Synthetic clear', 7), { ok: true, value: { target: 'new', ownerId: null, reason: 'Synthetic clear' } });
});

test('completion and cancellation are distinct, require factual text, never reopen history', () => {
  const state = lead('in_progress', 'synthetic-principal-a', true);
  assert.deepEqual(disposeFollowUp(state, 'open', 'complete', 'Synthetic work performed', 7), { ok: true, value: { status: 'completed', text: 'Synthetic work performed' } });
  assert.deepEqual(disposeFollowUp(state, 'open', 'cancel', 'Synthetic action withdrawn', 7), { ok: true, value: { status: 'cancelled', text: 'Synthetic action withdrawn' } });
  assert.equal(disposeFollowUp(state, 'open', 'complete', '', 7).ok, false);
  assert.equal(disposeFollowUp(state, 'open', 'cancel', 'ab', 7).ok, false);
  assert.equal(disposeFollowUp(state, 'cancelled', 'complete', 'Synthetic work performed', 7).ok, false);
  assert.equal(disposeFollowUp(state, 'completed', 'cancel', 'Synthetic withdrawal', 7).ok, false);
});
