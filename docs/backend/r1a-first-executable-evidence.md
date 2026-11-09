# R1A — First executable backend slice

Activity date: 9 November 2026 (WAT). Owner: AY1.
Authority: AY's Formal Gate 0 RELEASE TO CODE, synthetic-only. Production HOLD.

## Coordination and source

Scaffold/route ownership coordination initiated in https://github.com/Jnasak/jca-salvi-bos/issues/1.
AAY1 agreement is pending; no shared app scaffold, package manifest or frontend UI was created.
Suggested ownership: AAY1 UI pages/layouts/components; AY1 server modules and API handlers;
one shared root Next.js/TypeScript runtime/configuration after agreement. Existing prototype
features are not executable R1A requirements.

Frozen references: API V0.2 at 8075b3e0e6132b5b56a090bc17911725e3e48996;
frontend §1.6 at 5104e8ec5346b3b23910b0506c575cca8d9206c9;
Product V1.0 b37c603, V1.0.1 c110230, V1.0.2 9aba094 as pinned in that API.
Wire identifier remains r1a-enq-api-v0.1. No contract changes.

## Implemented and verified

- Framework-independent TypeScript text/NFC/code-point, telephone, required reason/outcome,
  positive revision and today/future WAT calendar validation primitives.
- Pure workflow guards for owned/unowned terminal reopening, reason/revision requirements,
  terminal/active-follow-up conflicts, open owner clearing, distinct completion/cancellation.
- Ten synthetic Node test cases, including multiple boundary assertions, pass.

Reproduce at this document's containing commit, using Node 24 with built-in type stripping:

```sh
node --experimental-strip-types --test tests/r1a-validation.test.ts tests/r1a-workflow.test.ts
```

No npm dependency installation is needed for this slice. Node executes TypeScript by stripping
types; this is NOT a full TypeScript compiler/typecheck result. Next.js integration, pinned
dependencies, package/lockfile and compiler checks follow shared-scaffold agreement.

## Security and persistence boundaries

These are pure decisions, not HTTP handlers, authentication, database transactions or persistent
lead records. Inputs representing current records must come from authorised server-owned state.
Future caller must verify session/membership/action permissions and atomically recheck revision,
state, audit and idempotency in the database. A successful guard must NEVER be shown as a saved
enquiry/receipt. No public endpoint or mock success path is introduced.

No schema migration, RLS/Auth modification, principal provisioning, real customer data,
privileged credential, paid resource or deployment is part of this slice.

## Next implementation sequence and dependencies

1. AAY1/AY confirm issue #1 ownership and shared directory/runtime configuration.
2. Pin agreed Next.js/TypeScript/test dependencies and lockfile; integrate shared validation
   and error contracts without duplicating UI ownership.
3. Complete public field/request parsing and fail-closed HTTP boundaries against frozen API.
4. Seek explicit approval for database migrations/policies before persistent adapters or Auth
   changes; until then synthetic tests remain isolated, with no claim of persistent success.
5. Add atomic persistence/idempotency/audit and authenticated internal adapters only when those
   dependencies are authorised; execute functional, integration and negative-access acceptance.

Branch: feature/r1a-enq-backend. Protected main is unchanged. Independent PR review remains
required; no merge or production acceptance is implied by this evidence. Latest source SHA is
the GitHub commit containing this file, not an invented self-referential hash.
