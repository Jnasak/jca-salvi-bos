# R1A frontend first executable milestone

Owner: AAY1. Activity date: 9 November 2026 (WAT).
Branch: feature/r1a-enq-frontend. Parent: 5104e8ec5346b3b23910b0506c575cca8d9206c9.
Coordination acceptance: https://github.com/Jnasak/jca-salvi-bos/issues/1#issuecomment-6737754129

## Delivered

`src/components/r1a/submission-state.ts` is a framework-independent FE-03 consumer state module, not a rendered component or an alternative application scaffold. Its only schema-like types are local UI state and the whitelisted receipt view. The wire string is pinned to API V0.2's `r1a-enq-api-v0.1`; shared constant import can replace the local guard constant when AY1's shared primitives are explicitly integrated.

It models pending, guarded confirmation, rejected input, unknown receipt, rate-limited, manual-recovery and notice/config-refresh states. An immutable in-memory attempt snapshot survives retries, duplicate starts are blocked, stale/foreign responses are ignored, and synthetic copy cannot claim database persistence. No transport, localStorage, Supabase, credentials, API handler, root package/lockfile or application scaffold is added.

## Exact contract references

- API V0.2: 8075b3e0e6132b5b56a090bc17911725e3e48996, sections 2–6.
- Frontend readiness §1.6: 5104e8ec5346b3b23910b0506c575cca8d9206c9; FE-03 and UX-04/05/06.
- Product V1.0: b37c6035a15381f77a56c103038baa773cede892.
- V1.0.1: c11023032dbda84de801cb44bf50320fe4ab98c4.
- V1.0.2: 9aba09481f0769ddf99a5bbfd79749ec211ac9d7.

## Executed verification

Node v24.22.1, isolated frontend checkout, no dependency installation:

`node --experimental-strip-types --test tests/frontend/r1a-submission-state.test.ts`

10 tests passed, 0 failed. Evidence covers guarded 200/201 receipt/replay consumption; malformed payload/date/version rejection; network/503 uncertainty; duplicate starts and stale response handling; changed-body refusal; exclusive expiry and conflicts; Retry-After; notice/config refresh; safe local error copy; explicit synthetic receipt copy.

These are pure synthetic consumer tests. They are not TypeScript compiler validation, browser acceptance, persistence/idempotency tests or server permission evidence. No 360/390/768/1024/1440 viewport result is claimed.

## Next implementation sequence and dependencies

1. AY1 returns the one shared scaffold commit, runtime/package-manager choice and commands in Issue #1.
2. Integrate that identified scaffold through reviewed branch changes. AAY1 owns UI/layouts except src/app/api; AY1 owns API/runtime/server. Shared contract changes require affected-owner review.
3. FE-01 labelled controls, linked errors/status region, focus and responsive layout; FE-02 form/config adapter; wire this FE-03 state module into explicitly synthetic mocks.
4. FE-04 session-state UI; then FE-05/06 list/detail/actions/history and FE-07 reporting adapters from AY1's frozen interfaces.
5. FE-08 rendered keyboard, viewport, zoom, contrast and integration regression with expected/actual evidence tied to each source commit and requirement reference.

No correction/resubmission policy is invented here: rejected-input and refresh states require a deliberate form/config flow, to be integrated against AY1's exact attempt semantics. Missing Retry-After leaves rate-limit retry blocked rather than guessing timing. The module does not renew attempts or implement a public receipt lookup.

## Parallel prototype status

Separate full-PRD Site: https://jca-salvi-bos-full-prototype.futureclay2.chatgpt.site/#acceptance
Site source commit 22a47da1ceaa51f5f651051a217aca1f42b67ba2. Priority knowledge/CRM/proposal/onboarding/reporting corrections are published as a browser-local demonstration. Its broad features, role switcher and storage are not copied into executable R1A. Specialist semantic acceptance, full rendered accessibility/responsive acceptance and real email delivery remain pending.

## Disposition

First executable frontend consumer milestone: PASS WITH CONTROLS (pure tests only).
Shared scaffold / rendered frontend: pending AY1 handback and integration.
PR #2: remains draft/open; no merge performed. Independent Jenn-Stack review remains required.
Production, real customer data, unapproved database/security changes and paid resources: not authorised by this milestone.
