/** Frozen API V0.2 primitives. No I/O, credentials, persistence or UI. */
export const CONTRACT_VERSION = 'r1a-enq-api-v0.1' as const;
export type FieldError = { code: string; message: string };
export type Validation<T> =
  | { ok: true; value: T }
  | { ok: false; error: FieldError };

const bad = (code: string, message: string): Validation<never> => ({
  ok: false, error: { code, message },
});
const controls = /[\u0000-\u001f\u007f-\u009f]/u;

export function text(
  value: unknown,
  min: number,
  max: number,
  multiline = false,
): Validation<string> {
  if (typeof value !== 'string') return bad('INVALID_TYPE', 'Enter text.');
  // Frozen V0.2 trims surrounding whitespace before checking internal controls.
  const canonical = value.replace(/\r\n/g, '\n').trim().normalize('NFC');
  const controlCheck = multiline ? canonical.replace(/\n/g, '') : canonical;
  if (controls.test(controlCheck)) return bad('INVALID_CHARACTERS', 'Remove unsupported control characters.');
  const normalized = canonical;
  const length = Array.from(normalized).length;
  if (length < min || length > max) {
    return bad('INVALID_LENGTH', `Enter between ${min} and ${max} characters.`);
  }
  return { ok: true, value: normalized };
}

export const reason = (value: unknown) => text(value, 3, 500);
export const outcome = (value: unknown) => text(value, 3, 1000);

export function phone(value: unknown): Validation<string> {
  if (typeof value !== 'string') return bad('INVALID_TYPE', 'Enter a telephone number.');
  if (controls.test(value)) return bad('INVALID_PHONE', 'Enter a valid telephone number.');
  const trimmed = value.trim();
  if (!/^\+?[0-9 ().-]+$/.test(trimmed)) return bad('INVALID_PHONE', 'Enter a valid telephone number.');
  const digits = trimmed.replace(/[^0-9]/g, '').length;
  if (digits < 7 || digits > 20) return bad('INVALID_PHONE', 'Enter a telephone number with 7 to 20 digits.');
  return { ok: true, value: trimmed };
}

export function revision(value: unknown): Validation<number> {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    return bad('INVALID_REVISION', 'Enter a positive integer record revision.');
  }
  return { ok: true, value };
}

/** Clock must be supplied by the trusted server, never a request field. */
export function watDate(now: Date): string {
  if (!Number.isFinite(now.getTime())) throw new TypeError('Invalid server clock');
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const part = (kind: string) => parts.find(p => p.type === kind)!.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function dueDate(value: unknown, serverNow: Date): Validation<string> {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return bad('INVALID_DATE', 'Enter a valid calendar date.');
  }
  const [year, month, day] = value.split('-').map(Number);
  const calendar = new Date(`${value}T12:00:00Z`);
  if (year < 1 || !Number.isFinite(calendar.getTime()) ||
      calendar.getUTCFullYear() !== year || calendar.getUTCMonth() + 1 !== month ||
      calendar.getUTCDate() !== day) return bad('INVALID_DATE', 'Enter a valid calendar date.');
  if (value < watDate(serverNow)) return bad('DATE_BEFORE_TODAY', 'Due date cannot be before today.');
  return { ok: true, value };
}
