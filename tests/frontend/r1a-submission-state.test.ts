import test from 'node:test';
import assert from 'node:assert/strict';
import { newAttempt, beginSubmission, networkUnconfirmed, receiveResponse, submissionCopy, WIRE_VERSION } from '../../src/components/r1a/submission-state.ts';
const now = Date.parse('2026-11-09T10:00:00Z');
const config = { token: 'SYNTHETIC-ATTEMPT-A', expiresAt: '2026-11-10T10:00:00Z', noticeVersion: 'SYNTHETIC-NOTICE' };
const idle = () => newAttempt(config, '{"full_name":"Synthetic Prospect"}');
const pending = () => beginSubmission(idle(), now);
const success = (replayed = false) => ({ ok: true, contract_version: WIRE_VERSION, receipt: { reference: 'SYNTHETIC-RECEIPT-A', received_at: '2026-11-09T10:00:00Z' }, replayed });
const error = (code: string) => ({ ok: false, contract_version: WIRE_VERSION, error: { code, message: 'RAW MESSAGE MUST NOT BE SHOWN' } });
test('200 replay and 201 receipt consume only the supported well-formed receipt', () => {
  for (const [status, replayed] of [[201, false], [200, true]] as const) {
    const result = receiveResponse(pending(), config.token, status, success(replayed), now);
    assert.equal(result.kind, 'confirmed'); assert.equal(result.receipt?.replayed, replayed);
    assert.deepEqual(Object.keys(result.receipt!).sort(), ['receivedAt', 'reference', 'replayed']);
  }
});
test('malformed envelopes, dates, wire identifiers and arbitrary ok:true never confirm', () => {
  const cases = [null, { ok: true }, { ...success(), contract_version: 'r1a-enq-api-v0.2' }, { ...success(), replayed: 'false' }, { ...success(), receipt: { reference: 'R', received_at: '2026-02-30T10:00:00Z' } }, { ...success(), receipt: { reference: '', received_at: '2026-11-09T10:00:00Z' } }];
  for (const body of cases) assert.equal(receiveResponse(pending(), config.token, 201, body, now).kind, 'uncertain');
  assert.equal(receiveResponse(pending(), config.token, 202, success(), now).kind, 'uncertain');
});
test('network loss and 503 retain original identity and identical body for recovery', () => {
  const state = pending();
  for (const unknown of [networkUnconfirmed(state), receiveResponse(state, config.token, 503, error('SERVICE_UNAVAILABLE'), now)]) {
    assert.equal(unknown.kind, 'uncertain'); const retry = beginSubmission(unknown, now + 1000);
    assert.equal(retry.kind, 'pending'); assert.equal(retry.attempt, state.attempt);
  }
});
test('double submit and stale or foreign responses cannot replace an active attempt', () => {
  const state = pending(); assert.equal(beginSubmission(state, now), state);
  assert.equal(receiveResponse(state, 'OTHER-ATTEMPT', 201, success(), now), state);
  const confirmed = receiveResponse(state, config.token, 201, success(), now);
  assert.equal(beginSubmission(confirmed, now), confirmed);
  assert.equal(receiveResponse(confirmed, config.token, 503, error('SERVICE_UNAVAILABLE'), now), confirmed);
});
test('changed payload cannot reuse a logical attempt', () => {
  assert.throws(() => beginSubmission(networkUnconfirmed(pending()), now, '{"full_name":"Changed"}'));
});
test('expiry is exclusive and conflicts do not silently create or retry another attempt', () => {
  assert.equal(beginSubmission(idle(), Date.parse(config.expiresAt)).kind, 'manualRecovery');
  for (const [status, code] of [[410,'SUBMISSION_ATTEMPT_EXPIRED'],[410,'RECEIPT_UNAVAILABLE'],[409,'IDEMPOTENCY_CONFLICT']] as const) {
    const result = receiveResponse(pending(), config.token, status, error(code), now);
    assert.equal(result.kind, 'manualRecovery'); assert.equal(beginSubmission(result, now), result);
  }
});
test('rate limit observes Retry-After and does not guess a missing retry time', () => {
  const result = receiveResponse(pending(), config.token, 429, error('RATE_LIMITED'), now, 5);
  assert.equal(beginSubmission(result, now + 4999), result);
  assert.equal(beginSubmission(result, now + 5000).kind, 'pending');
  const missing = receiveResponse(pending(), config.token, 429, error('RATE_LIMITED'), now);
  assert.equal(beginSubmission(missing, now + 9999), missing);
});
test('notice/config refresh requires deliberate acknowledgement and does not auto-retry', () => {
  for (const [code, kind] of [['NOTICE_VERSION_CHANGED','refreshNotice'],['CONTRACT_VERSION_MISMATCH','refreshConfig']] as const) {
    const result = receiveResponse(pending(), config.token, 409, error(code), now);
    assert.equal(result.kind, kind); assert.equal(beginSubmission(result, now), result);
  }
});
test('validation returns safe local state without displaying untrusted server messages', () => {
  const result = receiveResponse(pending(), config.token, 422, error('VALIDATION_FAILED'), now);
  assert.equal(result.kind, 'rejected'); assert.equal(submissionCopy(result, 'synthetic').text.includes('RAW'), false);
});
test('synthetic receipt copy cannot claim a persisted backend record', () => {
  const result = receiveResponse(pending(), config.token, 201, success(), now);
  assert.match(submissionCopy(result, 'synthetic').text, /No persisted enquiry/);
  assert.equal(submissionCopy(pending(), 'synthetic').busy, true);
});
