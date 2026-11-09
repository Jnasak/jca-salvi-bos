import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONTRACT_VERSION, text, reason, outcome, phone, dueDate, watDate, revision } from '../src/shared/r1a/validation.ts';

test('frozen wire version and normalized Unicode code-point boundaries', () => {
  assert.equal(CONTRACT_VERSION, 'r1a-enq-api-v0.1');
  assert.deepEqual(text(' e\u0301😀 ', 2, 2), { ok: true, value: 'é😀' });
  for (const [length, valid] of [[2, false], [3, true], [500, true], [501, false]] as const) {
    assert.equal(reason('😀'.repeat(length)).ok, valid);
  }
  assert.equal(outcome('a'.repeat(1000)).ok, true);
  assert.equal(outcome('a'.repeat(1001)).ok, false);
  assert.equal(reason('   ').ok, false);
  assert.deepEqual(reason('\t valid reason \n'), { ok: true, value: 'valid reason' });
});

test('controls, multiline text and literal markup do not become HTML', () => {
  assert.equal(reason('\0valid').ok, false);
  assert.equal(reason('has\ttab').ok, false);
  assert.equal(text('line\r\nnext', 1, 30, true).ok, true);
  assert.equal(text('line\nnext', 1, 30).ok, false);
  assert.deepEqual(text('<script>literal</script>', 1, 100), { ok: true, value: '<script>literal</script>' });
});

test('telephone preserves submitted meaning, rejects unsupported digits and plus signs', () => {
  for (const valid of ['0000000', '+234 (000) 000-0000', '0'.repeat(20)]) assert.equal(phone(valid).ok, true);
  assert.deepEqual(phone(' 000 0000 '), { ok: true, value: '000 0000' });
  for (const invalid of ['000000', '0'.repeat(21), '++0000000', '00+00000', 'letters0000000', '٠٠٠٠٠٠٠', '000\n0000', null]) assert.equal(phone(invalid).ok, false);
});

test('today changes at WAT midnight; impossible dates and backdating rejected', () => {
  const before = new Date('2026-11-08T22:59:59Z');
  const after = new Date('2026-11-08T23:00:00Z');
  assert.equal(watDate(before), '2026-11-08');
  assert.equal(watDate(after), '2026-11-09');
  assert.equal(dueDate('2026-11-08', before).ok, true);
  assert.equal(dueDate('2026-11-08', after).ok, false);
  assert.equal(dueDate('2026-11-09', after).ok, true);
  for (const invalid of ['2026-02-30', '2026-13-01', '2026-11-9', '2026-11-09T00:00Z']) assert.equal(dueDate(invalid, before).ok, false);
  assert.equal(dueDate('2028-02-29', before).ok, true);
  assert.throws(() => watDate(new Date('bad')));
});

test('revisions cannot be coerced from request strings or fractional values', () => {
  for (const invalid of [null, '1', 0, -1, 1.1, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.equal(revision(invalid).ok, false);
  assert.equal(revision(1).ok, true);
});
