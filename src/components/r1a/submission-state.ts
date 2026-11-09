/** FE-03 consumer state only. Frozen API V0.2 §§3,5,6; matrix §1.6.
 * No transport, browser persistence, credential access or backend success claim.
 */
export const WIRE_VERSION = 'r1a-enq-api-v0.1' as const;
type Attempt = Readonly<{ token: string; expiresAt: number; noticeVersion: string; body: string }>;
type Receipt = Readonly<{ reference: string; receivedAt: string; replayed: boolean }>;
export type SubmissionState = Readonly<{
  kind: 'idle' | 'pending' | 'confirmed' | 'rejected' | 'uncertain' | 'rateLimited' | 'manualRecovery' | 'refreshNotice' | 'refreshConfig';
  attempt: Attempt;
  receipt?: Receipt;
  code?: string;
  retryAt?: number;
}>;
const object = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const utc = (v: unknown): v is string => {
  if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(v)) return false;
  const date = new Date(v);
  return Number.isFinite(date.getTime()) && date.toISOString().replace('.000Z', 'Z') === v.replace(/\.(\d{1,2})Z$/, (_, n) => '.' + n.padEnd(3, '0') + 'Z').replace('.000Z', 'Z');
};
export function newAttempt(config: { token: string; expiresAt: string; noticeVersion: string }, serializedBody: string): SubmissionState {
  if (!config.token || !config.noticeVersion || !utc(config.expiresAt)) throw new TypeError('Valid configured attempt required.');
  // Keep one immutable snapshot in memory; the form/adapter supplies its validated body.
  return Object.freeze({ kind: 'idle', attempt: Object.freeze({ token: config.token, noticeVersion: config.noticeVersion, expiresAt: Date.parse(config.expiresAt), body: serializedBody }) });
}
export function beginSubmission(state: SubmissionState, now: number, serializedBody = state.attempt.body): SubmissionState {
  if (!Number.isFinite(now)) throw new TypeError('Valid clock required.');
  if (serializedBody !== state.attempt.body) throw new Error('Do not reuse an attempt for changed content.');
  if (state.kind === 'pending' || state.kind === 'confirmed') return state;
  if (now >= state.attempt.expiresAt) return { ...state, kind: 'manualRecovery', code: 'SUBMISSION_ATTEMPT_EXPIRED' };
  if (state.kind === 'rateLimited' && (state.retryAt === undefined || now < state.retryAt)) return state;
  if (!['idle', 'uncertain', 'rateLimited'].includes(state.kind)) return state;
  return { kind: 'pending', attempt: state.attempt };
}
export function networkUnconfirmed(state: SubmissionState): SubmissionState {
  return state.kind === 'pending' ? { kind: 'uncertain', attempt: state.attempt, code: 'RECEIPT_UNCONFIRMED' } : state;
}
/** Body is parsed by the adapter. Malformed JSON passes null. Ignore late/foreign responses. */
export function receiveResponse(state: SubmissionState, attemptToken: string, status: number, body: unknown, now: number, retryAfterSeconds?: number): SubmissionState {
  if (state.kind !== 'pending' || attemptToken !== state.attempt.token) return state;
  const uncertain: SubmissionState = { kind: 'uncertain', attempt: state.attempt, code: 'RECEIPT_UNCONFIRMED' };
  if (!Number.isFinite(now)) return uncertain;
  if (!object(body) || body.contract_version !== WIRE_VERSION) return uncertain;
  if (status === 200 || status === 201) {
    const receipt = body.receipt;
    if (body.ok !== true || typeof body.replayed !== 'boolean' || !object(receipt) ||
        typeof receipt.reference !== 'string' || !receipt.reference.trim() || /[\u0000-\u001f\u007f]/u.test(receipt.reference) || !utc(receipt.received_at)) return uncertain;
    // Whitelist receipt fields; never expose contact echoes or internal payloads.
    return { kind: 'confirmed', attempt: state.attempt, receipt: { reference: receipt.reference, receivedAt: receipt.received_at, replayed: body.replayed } };
  }
  if (body.ok !== false || !object(body.error) || typeof body.error.code !== 'string') return uncertain;
  const code = body.error.code;
  if (status === 503 && ['SERVICE_UNAVAILABLE', 'RECEIPT_UNCONFIRMED'].includes(code)) return uncertain;
  if (status === 429 && code === 'RATE_LIMITED') {
    const delay = retryAfterSeconds !== undefined && Number.isSafeInteger(retryAfterSeconds) && retryAfterSeconds >= 0 ? retryAfterSeconds * 1000 : undefined;
    const retryAt = delay !== undefined && Number.isSafeInteger(now + delay) ? now + delay : undefined;
    return { kind: 'rateLimited', attempt: state.attempt, code, retryAt };
  }
  if ((status === 410 && ['SUBMISSION_ATTEMPT_EXPIRED', 'RECEIPT_UNAVAILABLE'].includes(code)) || (status === 409 && code === 'IDEMPOTENCY_CONFLICT')) return { kind: 'manualRecovery', attempt: state.attempt, code };
  if (status === 409 && code === 'NOTICE_VERSION_CHANGED') return { kind: 'refreshNotice', attempt: state.attempt, code };
  if (status === 409 && code === 'CONTRACT_VERSION_MISMATCH') return { kind: 'refreshConfig', attempt: state.attempt, code };
  if ((status === 422 && ['VALIDATION_FAILED', 'CATEGORY_UNAVAILABLE'].includes(code)) ||
      (status === 400 && code === 'MALFORMED_REQUEST') || (status === 413 && code === 'PAYLOAD_TOO_LARGE') ||
      (status === 415 && code === 'UNSUPPORTED_MEDIA_TYPE') || (status === 403 && code === 'VERIFICATION_FAILED')) return { kind: 'rejected', attempt: state.attempt, code };
  return uncertain;
}
export function submissionCopy(state: SubmissionState, mode: 'synthetic' | 'integrated'): { text: string; busy: boolean } {
  const labels: Record<SubmissionState['kind'], string> = {
    idle: 'Ready to submit.', pending: 'Submitting your enquiry…',
    confirmed: mode === 'synthetic' ? 'Synthetic receipt response only. No persisted enquiry is evidenced.' : 'Your enquiry has been received. Keep your reference for follow-up.',
    rejected: 'Check your enquiry or follow the approved verification instructions.',
    uncertain: 'Receipt is unconfirmed. Retry the same enquiry while this attempt remains valid.',
    rateLimited: 'Please wait before retrying the same enquiry.',
    manualRecovery: 'Receipt needs manual reconciliation. Do not automatically create another enquiry.',
    refreshNotice: 'Review the current privacy notice and explicitly acknowledge it before a new attempt.',
    refreshConfig: 'Refresh the enquiry configuration before continuing.',
  };
  return { text: labels[state.kind], busy: state.kind === 'pending' };
}
