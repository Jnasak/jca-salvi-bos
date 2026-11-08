# R1A-ENQ-01 — Consolidated Backend/API Contract V0.2

Date: 8 November 2026 (WAT)
Owner: AY1 — Technical Implementation & Integration
Status: Documentation-only consolidation of accepted technical designs and Product V1.0–V1.0.2. Awaiting AAY1 final reconciliation and AY freeze; no implementation, runtime test, Gate 0 clearance or release approval.
Assigned source: Jnasak/jca-salvi-bos / feature/r1a-enq-backend.
Preparation branch baseline: API V0.1.2 plus S1 at 13cf6e9afe23605a9d71347982b67bc7b7235e16.

## 1. Exact governing references and precedence

- Product: docs/product/r1a-enq-01-product-contract-v1.0.md at b37c6035a15381f77a56c103038baa773cede892, on docs/r1a-enq-product-contract.
- Product amendment: docs/product/r1a-enq-01-status-reopen-amendment-v1.0.1.md at c11023032dbda84de801cb44bf50320fe4ab98c4; supersedes conflicting V1.0 sections 4–5 reopen/ownership rules only. Product semantic exception resolved; P-04 business approval remains pending.
- Product follow-up/validation amendment: docs/product/r1a-enq-01-follow-up-and-validation-amendment-v1.0.2.md at 9aba09481f0769ddf99a5bbfd79749ec211ac9d7; accepted by AY for technical reconciliation.
- Accepted interface supplement: docs/backend/r1a-enq-01-api-v0.1.2-integration-supplement-s1.md at 13cf6e9afe23605a9d71347982b67bc7b7235e16; incorporated in Section 8.1 below.
- Frontend consumer matrix: docs/frontend/r1a-enq-01-integration-readiness.md, Section 1, at e44e3d690c82cbf5d371931e92347241dc7849ec; latest cited consumer checkpoint Section 1.4 at b4e26aff2552f36ea5f7643026bc415a21734b60 (not yet reconciliation of this V0.2).
- PRD V1.3-R1, R1A-ENQ-01 V0.1 and DEC-12 retain parent scope/traceability.
- Approved platform: Next.js, TypeScript, Vercel, Supabase Auth and PostgreSQL; separate principal identities.
- Public source contains documentation and synthetic examples only. No migrations, executable schemas, application code, real records or credentials are introduced here.

This document consolidates API V0.1.2 at 7271b4bc027af4683aaff07ce1771384659a5d85 and accepted S1 into a single current API source. It supersedes their conflicting follow-up, reason and validation proposals. Previous files/commits are historical references only; no combined closure/disposition operation is carried forward. Product V1.0.2 governs the bounded changes; DEC-12 scope remains unchanged.

EX-01/02/03 are CLOSED at product-specification level; FEX-01/FEX-02 designs are accepted for integration by AY. This is not P-01–P-04 approval, final contract freeze or G-00 clearance. AY1 supplies wire details; AAY1 reconciles consumption; AY issues final technical ruling.

## 2. Shared wire conventions

- JSON requests/responses; Content-Type application/json; UTF-8.
- All dates/timestamps in responses are server-derived where authoritative. Timestamps: ISO 8601 UTC ending Z. Calendar due dates: YYYY-MM-DD interpreted in Africa/Lagos, never UTC midnight deadlines.
- Contract version: r1a-enq-api-v0.1. Public config advertises this value; requests echo it in X-BOS-Contract-Version. Unsupported versions: 409 CONTRACT_VERSION_MISMATCH.
- IDs are opaque strings. Internal UUIDs never appear in public receipts. Neither public references nor internal IDs grant access.
- Every response includes X-Request-ID: random non-sensitive correlation ID. No raw SQL/provider/stack errors, tokens or enquiry values in logs.
- All public attempt/config/receipt and all internal responses use Cache-Control: no-store. No shared caching of authenticated responses.
- Internal request schemas reject unknown fields, forged actors, workspace IDs, permission flags and server timestamps.
- Limits and examples here are contract documentation; no runtime assertions of implemented behaviour.

## 3. Public configuration and attempt identity

Proposed GET /api/enquiry-config returns approved active category metadata, field constraints, approved notice display/version and a fresh opaque signed submission-attempt token plus expires_at. It is no-store and subject to abuse limits. It reads no private CRM records.

The signed token carries random attempt identity, expiry, contract version and notice version; no customer content. Token signing keys remain server-only. Proposed lifetime: 24 hours from server issuance, with expiry exclusive (now >= expires_at is expired). Replay is permitted only while the attempt token is valid. Proposed mapping/digest retention: 48 hours after issuance, then purge under the approved retention policy; this does not set lead or audit retention. These are explicit engineering recommendations pending AY/P-02 ratification, NOT approved business-retention values. A production-enabled runtime must not issue attempts while TTL, notice, category or abuse configuration lacks required approval. GET config failure must leave the form unavailable, not silently use a fixture category.

AAY1 holds the token and draft values in memory for the logical attempt, not browser persistent storage. Re-rendering never silently replaces an attempt after submission has started. Explicitly beginning a different enquiry obtains a new token.

Config response schema: ok=true; contract_version=the supported version; data.service_categories=array of {id:string,label:string}; data.constraints=map of documented field keys to {required:boolean,min_length?:integer,max_length?:integer}; data.privacy_notice={version:string,text:string}; data.submission_attempt={token:string,expires_at:UTC timestamp}. Required acknowledgement is advertised as required=true, without a preselected value. Constraints are server-owned and must match Section 4. Category IDs are unique, non-empty and active; an empty approved list prevents submission. Config includes no PII.

Only approved public configuration is sent to visitors. general_enquiry / General business enquiry is a SYNTHETIC TEST FIXTURE until P-01 is cleared. Actual notice text is not supplied by this API proposal.

## 4. Public submission request

POST /api/enquiries
Headers:
- Content-Type: application/json
- X-BOS-Contract-Version: r1a-enq-api-v0.1
- Idempotency-Key: opaque signed attempt token obtained from config
- X-BOS-Notice-Version: version displayed to the visitor

Body logical/wire fields:

| Key | Type | Required | Validation/normalisation |
| --- | --- | --- | --- |
| full_name | string | yes | NFC Unicode normalisation; trim outer whitespace; 2–120 Unicode code points; preserve internal spacing |
| email | string | yes | Trim; single syntactically valid address; max 254 code points; preserve local-part spelling; reject CR/LF |
| phone | string | yes | Trim; optional one leading +; ASCII digits and separators space, (), hyphen, period only; 7–20 digits after separator removal; preserve trimmed submitted form; no guessed country |
| organisation_name | string | no | NFC; trim; 0–160 code points; blank omitted |
| service_category_id | string | yes | Exactly one active server-allowlisted ID; store label-at-submission from server list |
| description | string | yes | NFC; trim; 10–3000 code points; multiline allowed; persist/render as text, not HTML |
| privacy_acknowledged | boolean literal true | yes | Explicit visitor action; false/missing/null rejected |

Do not reuse the earlier Operations enquiry schema. full_name, phone and single-category semantics follow JJSA V1.0. Thresholds/Unicode/phone semantics are confirmed by JJSA V1.0.2 for technical design; applicable business-policy gates remain separate.

Proposed body-size guard: 32 KiB measured before JSON parsing, supporting the bounded Unicode fields. Reject NUL/control characters except ordinary whitespace required by the field. Do not interpret markup as HTML or strip meaningful plain text silently. Product V1.0.2 confirms NFC/code-point and phone-separator semantics; backend and frontend must apply them consistently.

The notice header is untrusted input. Verify it against the signed token and approved server notice; server records the authoritative notice version. Changed/withdrawn versions return 409 NOTICE_VERSION_CHANGED and require notice review plus a fresh attempt. The frontend must not silently renew acknowledgement.

Public input must not accept owner, operational_status, qualification, source, internal ID, actor, workspace, received_at or audit metadata.

Synthetic body example:

```json
{
  "full_name": "Sample Prospect A",
  "email": "prospect-a@example.test",
  "phone": "0000000000",
  "service_category_id": "general_enquiry",
  "description": "Synthetic enquiry for integration testing only.",
  "privacy_acknowledged": true
}
```

The phone is a non-dialling fixture, not a real contact. Category and notice fixtures must never be published as approved content.

## 5. Persistence, receipt and duplicate semantics

One database transaction writes:
1. unique attempt mapping + normalised business-payload digest;
2. exactly one lead with source bos_public_enquiry, owner null, operational_status new, qualification unassessed, revision 1;
3. random non-authorising public receipt reference and server received_at;
4. authoritative notice acknowledgement metadata;
5. creation audit event.

Commit succeeds before any success response. Required audit/mapping write failure rolls back the lead. Notification delivery is not part of this transaction and no external notification integration is assumed.

Use a database uniqueness constraint for attempt identity; no in-memory-only deduplication. A replay never updates or merges lead content. A canonical payload digest covers all business fields plus bound notice/contract version, excluding replaceable abuse tokens; use a server-keyed digest and deterministic normalisation.

Concurrent identical requests serialize through the unique constraint and resolve to the same committed receipt. An identical committed replay returns 200. A new committed submission returns 201. Same key with different content returns 409 IDEMPOTENCY_CONFLICT. A rolled-back attempt may be retried with the same valid token.

Expired, invalid or tampered attempts cannot create a lead. Expired token: 410 SUBMISSION_ATTEMPT_EXPIRED. After timeout, never automatically create a fresh attempt: preserve input in memory, retry the same request while valid, otherwise explain unconfirmed receipt and offer the approved manual recovery/contact route. A deliberate new submission after expiry may duplicate a prior business enquiry; do not claim cross-attempt deduplication or automatically merge by email.

Replay storage lifetime and digest deletion must be approved under P-02/AY retention policy. Signed token expiry prevents an expired attempt from becoming a new write even after replay mappings have been purged. If retention deletion removed the stored receipt, return 410 RECEIPT_UNAVAILABLE; never recreate a deleted lead through replay.

Success response, illustrative synthetic values only:

```json
{
  "ok": true,
  "contract_version": "r1a-enq-api-v0.1",
  "receipt": {
    "reference": "BOS-SYNTHETIC-RECEIPT-A",
    "received_at": "2026-11-08T12:00:00Z"
  },
  "replayed": false
}
```

For replay only replayed becomes true; receipt identity/time stay unchanged. Public receipt has no lead UUID, owner, category history, qualification or contact echo. Success copy: Your enquiry has been received. Keep your reference for follow-up.

AAY1 confirms only after a successful 200/201 HTTP response AND ok true AND supported contract version AND well-formed receipt/reference/timestamp AND boolean replayed. Malformed JSON/envelopes, arbitrary ok:true and network loss remain UNCONFIRMED. A 503 does not guarantee absence of a commit; same-attempt recovery remains required.

## 6. Error contract and frontend state mapping

```json
{
  "ok": false,
  "contract_version": "r1a-enq-api-v0.1",
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Check the highlighted fields.",
    "field_errors": {
      "email": [{"code": "INVALID_EMAIL", "message": "Enter a valid email address."}]
    },
    "request_id": "synthetic-correlation-a",
    "retry": "correct_input"
  }
}
```

field_errors is optional, keyed only to documented public/editable fields. Messages use approved safe copy. retry enum: correct_input, same_attempt, wait_then_same_attempt, refresh_notice, sign_in, refresh_record, manual_recovery, none.

| HTTP | Code | Frontend treatment |
| --- | --- | --- |
| 400 | MALFORMED_REQUEST | Correct request; never show success |
| 413 | PAYLOAD_TOO_LARGE | Correct input/request |
| 415 | UNSUPPORTED_MEDIA_TYPE | Integration/request error |
| 422 | VALIDATION_FAILED / CATEGORY_UNAVAILABLE | Linked field errors; preserve safe values |
| 409 | NOTICE_VERSION_CHANGED | Review current notice and explicitly acknowledge |
| 409 | CONTRACT_VERSION_MISMATCH | Refresh configuration; no silent resubmission |
| 409 | IDEMPOTENCY_CONFLICT | Manual reconciliation; do not regenerate/retry automatically |
| 410 | SUBMISSION_ATTEMPT_EXPIRED / RECEIPT_UNAVAILABLE | Unconfirmed/manual recovery; no automatic new attempt |
| 429 | RATE_LIMITED | Retry-After seconds; wait, then same valid attempt |
| 403 | VERIFICATION_FAILED | Approved challenge/recovery; no private information |
| 503 | SERVICE_UNAVAILABLE / RECEIPT_UNCONFIRMED | Unconfirmed, same-attempt recovery |
| 405 | METHOD_NOT_ALLOWED | Integration error; Allow header |
| 401 | AUTH_REQUIRED / SESSION_EXPIRED | Clear private display/cache; approved sign-in |
| 403 | ACCESS_DENIED | Explicit denied view; no record contents |
| 404 | NOT_FOUND | Same response for absent and inaccessible record |
| 409 | REVISION_CONFLICT / TRANSITION_NOT_ALLOWED / FOLLOW_UP_CONFLICT | Preserve edits; refresh authorised record and reconcile |

No separate public receipt lookup, tracking portal or public record retrieval endpoint is added. A valid replay is the public recovery operation.

## 7. Authentication, membership and permission design

Supabase Auth verifies identity; separate approved JCA and Salvi accounts. Email/password through Supabase with public signup disabled is a PROPOSED sign-in method requiring AY ratification; no password is posted to BOS custom APIs. Do not create real principal accounts or send invitations under this document.

Proposed GET /api/internal/session returns authenticated principal id, approved display name, workspace capability set and expiry metadata, never tokens. POST /api/internal/logout terminates the applicable session using Supabase and clears private UI data. API calls use the verified user session and active database membership, not user-editable metadata. Revoked membership must deny subsequent protected reads/writes despite a still-valid JWT.

Signed out/missing identity: 401 AUTH_REQUIRED. Expired/invalid identity: 401 SESSION_EXPIRED where determinable. Signed in without active BOS membership: 403 ACCESS_DENIED. Do not leak a guessed record's existence through different errors.

Proposed baseline permission matrix (P-03 and AY ratification pending):
- anon/public: config and validated enquiry submission only; no direct CRM tables.
- authenticated outsider/revoked principal: no internal data or mutations.
- active JCA/Salvi BOS members: shared-workspace list/detail/report; assign/reassign, qualification, status and follow-up operations within final rules.
- application users: no membership administration, hard deletion, audit editing, private-finance access or access to other workspaces.
- public submission backend: narrow creation transaction, no general public read capability.

Enable RLS on all exposed application tables; revoke public direct table writes/reads. Use explicit table/function grants as well as RLS. Membership predicates validate workspace and active approved user; TO authenticated alone is insufficient. UPDATE checks both old-row scope and new-row scope; user cannot move a row to another workspace. Aggregate views must enforce caller permissions (security_invoker where supported). Service credentials never reach browser or NEXT_PUBLIC_ values.

Preferred internal path: user-context database operations with RLS; validated mutation functions enforce transitions/versioning/audit atomically. A privileged public submission transaction requires AY's explicit grant/function design: server-only credentials, fixed workspace/source/defaults, bounded inputs, no arbitrary SQL or caller-trusted roles. Do not solve an RLS error by adding broadly callable SECURITY DEFINER functions. Final SQL policies/functions are NOT implemented here.

Validate same-origin browser mutation protections and approved origin/CSRF handling; CORS alone is not authentication or anti-abuse. Abuse provider/limits are AY-owned pending T-02. Fail closed if required controls are absent.

## 8. Internal list/detail and revision contract

GET /api/internal/leads accepts proposed filters owner=unassigned|principal UUID, operational_status, qualification, and cursor. limit defaults 25, max 100. Invalid values: 422. Server enforces scope and stable sort received_at descending then id; cursor bound to applied filters. Cursor is opaque and never grants access.

List response: ok, contract_version, data.items, data.next_cursor (string|null), meta.as_of, meta.timezone Africa/Lagos, meta.scope. Lists never imply authoritative totals from page length.

Lead shape: id, receipt_reference, received_at, original public business fields, category_label_at_submission, owner (null or approved principal object), operational_status, qualification, revision, updated_at, active_follow_up (null or permitted follow-up summary), capabilities, allowed_actions. Qualification rationale/history is internal only. Stored intake text is immutable in reduced release; data correction/deletion follows separately approved privacy procedure.

GET /api/internal/leads/{id} returns {ok:true,contract_version,data:{lead:Lead},meta:{as_of,timezone,scope}}, or non-enumerating 404. GET /api/internal/leads/{id}/events?cursor=...&limit=... returns {ok:true,contract_version,data:{items:Event[],next_cursor:string|null},meta:{as_of,timezone,scope}} with the same pagination limits and ascending server event sequence. Audit events expose safe change metadata, not passwords/tokens or unnecessary copies of contact/free-text payloads.

Every mutation supplies expected_revision in the JSON body. Server transaction checks row revision, validates user/action, writes state + event and increments revision once. All internal mutations require X-BOS-Operation-Key: a fresh random UUID for each logical mutation, retained for retries. Scope its uniqueness to verified actor + workspace + operation key; bind it to method, route and canonical body. It is distinct from the signed public attempt token and conveys no authority. An identical completed operation returns its original result with replayed=true; a changed route/body conflicts. Authorisation and membership are checked on every replay. Check a stored operation before rejecting its already-applied expected_revision; a genuine duplicate is not a new stale edit. Operation retention/expiry requires AY policy before implementation; expired/unavailable operation results require re-fetch and explicit reconciliation, never automatic resubmission under a new key. A stale write returns 409 without private current-state payload; AAY1 re-fetches authorised detail and asks for reconciliation.

Internal response types (proposed):
- Principal: {id:string,display_name:string}; only provisioned approved identities.
- Qualification: {value:unassessed|qualified|not_qualified|hold,rationale:string|null,reviewed_by:Principal|null,reviewed_at:timestamp|null}.
- FollowUp: {id:string,owner:Principal,summary:string,due_date:date,status:open|completed|cancelled,outcome:string|null,completed_at:timestamp|null,completed_by:Principal|null,cancellation_reason:string|null,cancelled_at:timestamp|null,cancelled_by:Principal|null}.
- Lead: {id:string,receipt_reference:string,received_at:timestamp,full_name:string,email:string,phone:string,organisation_name:string|null,service_category_id:string,category_label_at_submission:string,description:string,owner:Principal|null,operational_status:enum,qualification:Qualification,revision:positive integer,updated_at:timestamp,active_follow_up:FollowUp|null,capabilities:string[],allowed_actions:string[]}. Notice acknowledgement metadata remains protected; no secrets in this object.
- Event: {id:string,sequence:positive integer,event_type:string,actor:Principal|null,occurred_at:timestamp,from_revision:integer|null,to_revision:positive integer,changes:object}. changes is allowlisted structural metadata, not arbitrary raw request content.
- List uses Lead objects; qualification filter is its value enum. Capability/action identifiers match the route names (assign_owner, transition_status, set_qualification, create_follow_up, complete_follow_up, cancel_follow_up, reschedule_follow_up); informational UI hints never replace server checks.
- Successful mutations return HTTP 200 and {ok:true,contract_version,data:{lead:Lead},replayed:boolean,meta:{as_of,timezone,scope}}. Creation of a follow-up is part of this same aggregate mutation envelope. No 204 success with ambiguous missing state.
- Session success returns HTTP 200 and {ok:true,contract_version,data:{principal:Principal,capabilities:string[],expires_at:timestamp}}; logout returns HTTP 200 and {ok:true,contract_version,data:{signed_out:true}} only after session termination is confirmed. These envelopes contain no session or refresh tokens.

### 8.1 FEX-01 — Authorised assignable-principal source

GET /api/internal/assignable-principals?lead_id={opaque lead ID}&purpose={lead_owner|follow_up_owner}

- Requires verified session, active BOS membership and authorised access to the specified lead. lead_id and purpose are required; invalid/missing values return 422 VALIDATION_FAILED.
- Source: server-controlled principal_memberships joined to approved principal identity configuration in the same BOS workspace. Only active, principal-approved JCA/Salvi identities eligible for the requested action may appear. No public Auth user directory, email matching, display-name inference or hardcoded client IDs.
- Server applies actor permissions, purpose, current record state and relevant assignment rules before returning items. No assignment ability => 403 ACCESS_DENIED; terminal-owner editing unavailable => 409 TRANSITION_NOT_ALLOWED. Missing/out-of-scope lead => non-enumerating 404 NOT_FOUND.
- items entries: {id:string,display_name:string}. id is the actual approved provisioned principal UUID at runtime. No emails, Auth metadata, tokens or unrelated memberships.
- No identities have been provisioned by this documentation; examples below use non-runtime synthetic IDs. An approved principal lacking an active provisioned membership must not be fabricated into the list.
- Response: {ok:true,contract_version,data:{items:Principal[],can_clear_owner:boolean},meta:{as_of:UTC timestamp,timezone:"Africa/Lagos",scope:string,lead_id:string,lead_revision:positive integer,purpose:enum}}.
- can_clear_owner is true only for purpose=lead_owner when actor can deassign a currently owned assigned/in_progress lead and no open follow-up remains. It is false for terminal/new records and follow_up_owner. Clearing is a distinct explicit UI choice, not a fake principal entry.
- For follow_up_owner, eligible ID must equal the current named lead owner and be an active approved member; no open action can be created for an unassigned lead. Replacement is cancel then create. There is no independent action-owner edit endpoint.
- Empty eligible list is HTTP 200 items=[]; disable the affected selector/action and explain that no eligible owner is available. Never fall back to cached names or assign a guessed principal.
- Metadata is Cache-Control:no-store. Selector values are informational, not grants. Mutation rechecks active membership, record revision, actor permission and eligible owner under the transaction. Revocation/changed state cannot be bypassed by an old list.
- For FE-05 owner FILTERS, this is not an all-owner directory: derive filter values from an independently authorised list result or use unassigned/current-view scope; do not call this endpoint without a specific permitted lead. The assignment selector is FE-06.

Synthetic response for an open assigned record without an active follow-up:

```json
{
  "ok":true,
  "contract_version":"r1a-enq-api-v0.1",
  "data":{
    "items":[
      {"id":"synthetic-principal-a","display_name":"Synthetic Principal A"},
      {"id":"synthetic-principal-b","display_name":"Synthetic Principal B"}
    ],
    "can_clear_owner":true
  },
  "meta":{
    "as_of":"2026-11-08T13:00:00Z",
    "timezone":"Africa/Lagos",
    "scope":"authorised_bos_workspace",
    "lead_id":"synthetic-lead-a",
    "lead_revision":8,
    "purpose":"lead_owner"
  }
}
```

### 8.2 FEX-02 — Permitted target and conditional-input source

GET /api/internal/leads/{id} retains the baseline lead envelope and adds:
data.action_metadata={record_revision:integer,transitions:TransitionOption[],deassignment:DeassignmentOption}.

Each TransitionOption:
- target_status: one of new, assigned, in_progress, resolved, closed.
- method: POST|PATCH.
- path: server-generated same-origin relative path for this lead, restricted to the documented transition/owner routes. Client must never follow an arbitrary external metadata URL.
- required_fields: array of field identifiers.
- field_constraints: map of those identifiers to declarative constraints described below.
- blocked_by_open_follow_up: always false for returned options: blocked options are OMITTED.
- No field pre-fills a reason or asserts an action occurred.

DeassignmentOption: {available:boolean,method:"PATCH",path:string,required_fields:string[],field_constraints:object}. When unavailable, required_fields=[] and field_constraints={}; never offer it solely because the generic assign_owner action is present.

Every metadata result is actor-, scope-, state- and revision-specific. Return only operations permitted under the current approved policy; applicable business gates may disable dependent operations. allowed_actions remains coarse UI information. action_metadata supplies target/input choices, and server enforcement remains authoritative.

Constraint vocabulary: type=string|integer|null; required=true; trim=true for reasons; min_code_points/max_code_points; minimum=1 for revisions; enum array for literal permitted strings; source={path:string,purpose:enum} for owner choices. Values follow JJSA V1.0.2 confirmed NFC/code-point boundaries. No executable expressions or client-authored permission predicates.

Deterministic semantic target matrix, SUBJECT to actor permission, policy gates and open-action guard:

| Current state | Ownership | Candidate operation | Required business input in addition to expected_revision |
| --- | --- | --- | --- |
| new | unassigned | assigned via PATCH owner | eligible owner_id; reason |
| new | unassigned | closed via POST transitions | reason |
| assigned | named | in_progress via POST transitions | reason |
| assigned | named | closed via POST transitions | reason |
| in_progress | named | resolved or closed via POST transitions | reason (resolution disposition when resolved) |
| resolved | named | in_progress via POST transitions | reason |
| resolved | unassigned legacy only | new via POST transitions | reason |
| closed | named | in_progress via POST transitions | reason |
| closed | unassigned | new via POST transitions | reason |
| assigned/in_progress | named | new via PATCH owner with owner_id=null | reason; no open follow-up |

For resolved, the reason is the textual resolution disposition; no extra disposition object is introduced. Reopening does not accept owner replacement. new→assigned is offered only via the owner route to ensure atomic assignment/status/audit. Open named-owner reassignment uses that same owner route and preserves status. Unexpected ownerless assigned/in_progress is inconsistent data: do not offer a target that hides corruption; return no mutation options and require authorised recovery review.

Terminal and open-deassignment options are omitted whenever any active open follow-up exists. Terminal records with an open follow-up are inconsistent: expose no mutation options until authorised recovery review; never silently repair by reopening/completing. Even if a stale client submits a target/disposition, the transaction rejects with 409 FOLLOW_UP_CONFLICT. Completion must reflect work actually performed; do not instruct a user to falsely complete an action to bypass this guard.

All transition reasons, including assigned→in_progress, are REQUIRED 3–500 NFC Unicode code points after trim per V1.0.2. expected_revision is a required positive integer. Include target_status,expected_revision,reason in every POST transition required_fields. Public phone/Unicode and protected reason/outcome boundaries are confirmed in Sections 4/9.

Example action_metadata fragment for named-owner resolved record, no active action, reopen permitted by actor/policy:

```json
{
  "record_revision":7,
  "transitions":[
    {
      "target_status":"in_progress",
      "method":"POST",
      "path":"/api/internal/leads/synthetic-lead-a/transitions",
      "required_fields":["target_status","expected_revision","reason"],
      "field_constraints":{
        "target_status":{"type":"string","required":true,"enum":["in_progress"]},
        "expected_revision":{"type":"integer","required":true,"minimum":1},
        "reason":{"type":"string","required":true,"trim":true,"min_code_points":3,"max_code_points":500}
      },
      "blocked_by_open_follow_up":false
    }
  ],
  "deassignment":{
    "available":false,
    "method":"PATCH",
    "path":"/api/internal/leads/synthetic-lead-a/owner",
    "required_fields":[],
    "field_constraints":{}
  }
}
```

For owner assignment, field_constraints.owner_id={type:"string",required:true,source:{path:"/api/internal/assignable-principals?lead_id=synthetic-lead-a&purpose=lead_owner",purpose:"lead_owner"}}. The clear-owner variant uses enum:[null] with type:"null" and available=true; it requires owner_id,expected_revision,reason. Never conflate it with a missing owner_id.

Unassigned closed/legacy resolved reopen metadata substitutes target_status enum ["new"]; owner remains null. Returned operation metadata revision must equal lead.revision; mixed snapshots are invalid and must not enable controls. AAY1 retains edit inputs on conflict, refreshes detail and options, and asks for deliberate reconciliation.


## 9. Ownership, status, qualification and follow-ups

Proposed mutation routes:
- PATCH /api/internal/leads/{id}/owner: owner_id (approved UUID|null), expected_revision, reason (3–500 code points).
- POST /api/internal/leads/{id}/transitions: target_status, expected_revision, required reason (3–500). No combined follow-up disposition field is supported.
- PATCH /api/internal/leads/{id}/qualification: qualification, rationale (3–1000), expected_revision.
- POST /api/internal/leads/{id}/follow-ups: owner_id, summary (3–500), due_date, expected_revision.
- POST /api/internal/leads/{id}/follow-ups/{followUpId}/complete: required outcome (3–1000), expected_revision.
- POST /api/internal/leads/{id}/follow-ups/{followUpId}/cancel: required reason (3–500), expected_revision.
- POST /api/internal/leads/{id}/follow-ups/{followUpId}/reschedule: due_date, reason (3–500), expected_revision.

Actor and timestamps always come from the server. ALL assignment/reassignment, deassignment, status-transition/reopen, reschedule and cancellation reasons are required 3–500 code points after trim/NFC. Qualification rationale and completion outcome are required 3–1000. This includes assigned→in_progress; no fabricated placeholder reasons.

Operational enum: new, assigned, in_progress, resolved, closed.
Qualification enum: unassessed, qualified, not_qualified, hold.
These are JJSA V1.0–V1.0.2 semantics accepted by AY for technical design, with P-04 business approval and final consumer freeze still pending; do not use historic overloaded labels as interchangeable enums.

Corrected product rules — V1.0 plus JJSA V1.0.1 at c11023032dbda84de801cb44bf50320fe4ab98c4:
- new→assigned requires named owner, atomic with assignment; new→closed permits unassigned owner with closure reason.
- assigned→in_progress/closed; in_progress→resolved/closed. Normal resolution requires named owner and disposition; terminal transitions retain named owners.
- Resolved/closed with named owner reopen to in_progress, retaining that owner. Unassigned closed reopens to new. Unassigned resolved→new is defensive legacy recovery only, never a permitted newly created normal resolved state.
- Both assigned and in_progress always require an owner. No automatic assignment, follow-up creation or resurrection on reopen.
- Direct owner clearing on resolved/closed is rejected. Reopen with retained owner first, then explicitly deassign in a separate revisioned/audited operation.
- Open assigned/in_progress owner clearing requires reason and expected_revision; one atomic mutation sets owner=null/status=new and writes audit. Reject while an unresolved active follow-up exists; no ownerless/orphan follow-up.
- Open JCA↔Salvi reassignment preserves valid status, subject to approved next-action ownership compatibility. No owner edit may bypass status checks.
- Terminal status cannot coexist with an open follow-up. Reopening never creates a due date; an owned reopened lead without an active action contributes needs_follow_up_planning; an unassigned reopened lead appears in triage.
- All mutations validate actor, membership and revision inside the same transaction. Reopen writes owner/status/revision and one audit event atomically; no intermediate ownerless in_progress.

EX-01: CLOSED under Product V1.0.1 and AY ruling. EX-02/03: CLOSED at product-specification level under V1.0.2. The following contracts implement those decisions in this documentation.

### 9.1 Explicit follow-up lifecycle and permissions

Follow-up states: open → completed OR cancelled, mutually exclusive and terminal. No reopen, delete, hidden removal or terminal-history edit endpoint. Status/owner/outcome changes of historical actions require separately authorised privacy procedures, outside this reduced release.

Only an actor with verified identity, active workspace membership and action permission may mutate a permitted lead/follow-up. Follow-up ID must belong to the requested lead/workspace. Validate this and lead.expected_revision in the same transaction; forged actor/time/status fields and unknown body keys are rejected. On completed/cancelled action, another fresh completion/cancellation/reschedule returns 409 FOLLOW_UP_CONFLICT; identical authorised operation-key replay returns its original result without another event.

Complete: action actually performed. Body {outcome:string,expected_revision:positive integer}; outcome 3–1000 after trim/NFC. Persist status=completed, outcome, server completed_by and completed_at; cancelled fields remain null. Completion does not assert a client response or commercial acceptance. The system records the authorised actor's factual attestation; it cannot independently verify the real-world action. Do not imply syntactic validation proves work occurred.

Cancel: planned action will not be performed. Body {reason:string,expected_revision:positive integer}; reason 3–500 after trim/NFC. Persist status=cancelled, cancellation_reason, server cancelled_by and cancelled_at; completion outcome/by/at remain null. Separate follow_up_cancelled event; never report cancellation as work completed.

Each mutation increments the lead revision once and writes exactly one corresponding immutable audit event containing follow-up ID, actor/time, old/new state, relevant reason/outcome, and from/to revision. Store necessary business reason/outcome in protected records; logs remain redacted. Lead-event payloads must expose these only to authorised consumers. FollowUp gains created_at/created_by/updated_at server fields; retain original owner, summary and due date in history.

Success envelope (all follow-up mutations, HTTP 200): {ok:true,contract_version,data:{lead:Lead,follow_up:FollowUp},replayed:boolean,meta:{as_of,timezone,scope}}. This extends the baseline aggregate mutation envelope with the affected historical action, so completed/cancelled state remains visible even when lead.active_follow_up becomes null. Lead assignment/status/qualification operations retain {data:{lead}}. Server returns one consistent post-commit snapshot.

### 9.2 Separate parent transitions and replacement

Terminal enquiry transition is a SEPARATE request after all open follow-ups are explicitly completed or cancelled. If any open action remains, reject with 409 FOLLOW_UP_CONFLICT without state/event/revision change. No automatic/combined completion or cancellation. An unsupported combined-disposition field is rejected with 422, never processed. Update target metadata after disposition; terminal state change requires its own reason, operation key and current expected_revision.

Owner clearing is blocked while ANY active follow-up remains. Named-owner reassignment must preserve compatibility with action owner: reject 409 FOLLOW_UP_CONFLICT if changing lead owner would mismatch the open action owner. No silent action reassignment. In this two-principal model, new active follow-up owner must equal the current named lead owner and remain an eligible active approved member. Unassigned new records cannot receive an open follow-up.

Replace action: cancel old open action with factual reason, then create a new action with a FRESH ID, approved named owner, summary (3–500), due date and returned latest expected_revision. Two separate operation keys, revisions and events; not an atomic combined replacement route. If cancellation commits and creation fails, old cancelled history remains and lead requires follow-up planning. UI must report the partial result truthfully and retry only the failed logical operation safely.

Reschedule: POST .../reschedule with due_date, required reason (3–500), expected_revision. Only an open action; retain ID, owner, summary, creation metadata and status; update due date/updated_at, record old/new date and actor/reason in audit. A changed action purpose uses replacement, never summary overwrite. No silent deletion or recreation.

### 9.3 WAT dates and validation

New/rescheduled due_date must be an actual calendar YYYY-MM-DD on or after the trusted server WAT date at transaction validation; today allowed. Reject impossible dates (e.g. 2026-02-30), malformed dates and past dates with 422 VALIDATION_FAILED and field_errors.due_date. Past-date copy: Due date cannot be before today. Date has no implicit time or 09:00 SLA; do not convert it into UTC-midnight semantics.

Existing overdue open actions retain original due dates and remain completable/cancellable. Reschedule requires today/future. No backdated creation/import or historical action migration is supported.

For name, organisation, description, follow-up summary/outcome and every reason/rationale: trim outer whitespace, NFC-normalise, then count Unicode code points, not UTF-16 units; never truncate. Preserve internal ordinary spaces; only description allows internal CR/LF newlines (CRLF normalised to LF before counting). Reject NUL and C0/C1 control characters elsewhere; reject tab/control characters within reasons and other single-line fields. Standard surrounding whitespace is trimmed first. Exact parser restrictions are engineering details consistent with JJSA's confirmed boundary; safe text rendering remains required.

Telephone: optional single leading +, ASCII digits, ordinary ASCII space, parentheses, hyphen, period; 7–20 digits after separator removal. Reject letters, interior/repeated + and unsupported characters. Preserve trimmed submitted representation; no guessed country or reachability claim.

No Converted operational state, Won, contract acceptance or project creation.

## 10. Operational reporting payload

GET /api/internal/reporting returns:

```json
{
  "ok": true,
  "contract_version": "r1a-enq-api-v0.1",
  "data": {
    "new_today": 1,
    "unassigned_open": 1,
    "assigned_jca_open": 0,
    "assigned_salvi_open": 0,
    "needs_follow_up_planning": 0,
    "follow_ups_due_today": 0,
    "follow_ups_overdue": 0,
    "qualified_open": 0,
    "closed_total": 0,
    "resolved_total": 0
  },
  "meta": {
    "as_of": "2026-11-08T12:00:00Z",
    "timezone": "Africa/Lagos",
    "wat_date": "2026-11-08",
    "scope": "authorised_bos_workspace",
    "filters": {}
  }
}
```

Example represents one new unassigned synthetic lead, no follow-ups. Copy metric definitions from JJSA V1.0 Section 7 exactly: enquiry metrics count distinct lead IDs, follow-up metrics count open actions. Closed/resolved leads cannot contribute open-action counts.

Compute as_of once per request and derive current WAT date on the server. Read aggregates within a consistent database snapshot; all metrics use identical authorised scope. Concurrent later queue reads can differ; UI must display freshness and not imply cross-request snapshot identity.

For V0.1 expose no optional date-range/owner filtering on reporting until request/filter semantics are ratified. Default metrics follow JJSA's exact today/as-at distinction; do not silently date-filter the whole queue. Identity mapping to JCA/Salvi uses provisioned approved principal IDs, never client text labels.

## 11. Database entities and recovery boundary

Proposed entities: principal_memberships; service_categories; privacy_notice_versions; leads; submission_requests; follow_ups; lead_events; internal_mutation_requests. Use stable primary keys, scoped foreign keys, unique request identities and concurrency revisions. Categories/notice records are server-controlled reference configuration, not public-editable records.

Backup/recovery: versioned schema/configuration, encrypted authorised export where permitted, documented restore into an isolated development target, then synthetic fixture/count/integrity and access-denial checks. Do not assume Free plan managed backups. Never commit exports or authentication dumps to public GitHub. Retention must cover leads, audit metadata, request digests, exports and test identities; P-02/AY decisions govern actual values. No restore, data export, schema or account provisioning has been executed.

## 12. Consumer reconciliation and synthetic examples

Single consumer reference: this V0.2 document, incorporating Product V1.0 at b37c603, V1.0.1 at c110230, V1.0.2 at 9aba094 and S1 at 13cf6e9. Historical examples in prior commits do not override this document. All JSON below is documentation-only, synthetic and NOT EXECUTED. Any supporting public config fixture uses test-only category/notice values; no live notice is approved here.

| Area | Current technical disposition | Consumer source |
| --- | --- | --- |
| Public fields/config/receipt/retry | Preserved; Unicode/phone boundaries confirmed | Sections 3–6 |
| Principal source FEX-01 | Accepted design incorporated; no directory exposure | Section 8.1 |
| Targets FEX-02 | Accepted design incorporated; all transition reasons required | Section 8.2 |
| Reopen/owner-clear EX-01 | Closed specification level | Section 9 and Product V1.0.1 |
| Completion/cancellation EX-02 | Distinct terminal action outcomes; separate parent transition | Sections 9.1/9.2 |
| Replacement/reschedule/date EX-03 | Cancel then create; same-ID date-only reschedule; today/future | Sections 9.2/9.3 |
| Reporting | Original ten metrics unchanged; only open actions count pending/overdue | Section 10 |
| Permissions/privacy | P-01–P-04 and environment controls retained | Sections 7/14 |

### 12.1 Cancellation and completion examples

POST /api/internal/leads/synthetic-lead-a/follow-ups/synthetic-action-a/cancel
Headers: verified internal session; X-BOS-Contract-Version:r1a-enq-api-v0.1; X-BOS-Operation-Key:fresh UUID; Content-Type:application/json.

```json
{"reason":"Synthetic action is no longer required","expected_revision":8}
```

HTTP 200 envelope uses Section 9.1; data.lead is the full resulting Lead at revision 9 with active_follow_up=null. Example affected FollowUp (data.follow_up):

```json
{
  "id":"synthetic-action-a",
  "owner":{"id":"synthetic-principal-a","display_name":"Synthetic Principal A"},
  "summary":"Review synthetic enquiry",
  "due_date":"2026-11-09",
  "status":"cancelled",
  "outcome":null,
  "completed_at":null,
  "completed_by":null,
  "cancellation_reason":"Synthetic action is no longer required",
  "cancelled_at":"2026-11-08T13:10:00Z",
  "cancelled_by":{"id":"synthetic-principal-a","display_name":"Synthetic Principal A"},
  "created_at":"2026-11-08T12:00:00Z",
  "created_by":{"id":"synthetic-principal-a","display_name":"Synthetic Principal A"},
  "updated_at":"2026-11-08T13:10:00Z"
}
```

Complete actual work instead: POST .../complete with {"outcome":"Synthetic review performed and recorded","expected_revision":8}; returns completed action, outcome, completed_by/at; cancellation_reason/cancelled_by/at=null. It is an alternative to cancellation, never a subsequent fresh completion of cancelled action.

After cancellation at revision 9, close parent using a NEW operation key:
POST /api/internal/leads/synthetic-lead-a/transitions
{"target_status":"closed","reason":"Synthetic enquiry closure after cancellation","expected_revision":9}.
Success data.lead revision 10/status=closed/active_follow_up=null, owner retained; one closure event distinct from cancellation. Same-key replay returns original result, replayed=true; no repeated state/event.

### 12.2 Required failures, partial replacement and dates

Validation HTTP 422:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"VALIDATION_FAILED","message":"Check the highlighted fields.","field_errors":{"reason":[{"code":"REQUIRED","message":"Enter a reason."}]},"request_id":"synthetic-validation-a","retry":"correct_input"}}
```

For missing/short completion outcome, key=outcome, code=INVALID_LENGTH, message=Enter an outcome of 3 to 1000 characters. No completion commits.

Active-action closure HTTP 409:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"FOLLOW_UP_CONFLICT","message":"Complete or cancel the open follow-up before changing this status.","request_id":"synthetic-action-conflict-a","retry":"refresh_record"}}
```

Stale expected revision HTTP 409:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"REVISION_CONFLICT","message":"This record has changed. Review the latest version.","request_id":"synthetic-revision-a","retry":"refresh_record"}}
```

Unauthorised workspace action HTTP 403:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"ACCESS_DENIED","message":"You do not have access.","request_id":"synthetic-denied-a","retry":"none"}}
```

No session=401 AUTH_REQUIRED; expired=401 SESSION_EXPIRED; absent/out-of-scope lead/action=404 NOT_FOUND. None includes protected data.

At server 2026-11-08T23:00:00Z (9 November 00:00 WAT), creation/reschedule due_date=2026-11-08 fails:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"VALIDATION_FAILED","message":"Check the highlighted fields.","field_errors":{"due_date":[{"code":"DATE_BEFORE_TODAY","message":"Due date cannot be before today."}]},"request_id":"synthetic-date-a","retry":"correct_input"}}
```

due_date=2026-11-09 is allowed; existing overdue 2026-11-08 remains completable/cancellable. Reschedule with due_date=2026-11-10,reason="Synthetic scheduling change",expected_revision=8 retains action ID/owner/summary, revision becomes9.

Replacement fixture: cancel action A successfully at revision8→9, create action B with expected_revision9, named matching owner, new summary/due date and fresh key. If create fails, action A remains cancelled; no action B is claimed, planning metric increments for eligible open owned lead. Retry creation using its SAME key/body; no rollback or recreation of A.

Unicode boundary fixture: decomposed e + combining acute normalises to one NFC code point; astral emoji counts one code point, not two UTF-16 units. Reason lengths2/3/500/501 reject/accept/accept/reject after trim/NFC. Phone "+234 (000) 000-0000" passes syntax/digit count only as a synthetic string; letters/interior plus/non-ASCII digits fail. No reachability claim.

### 12.3 Other interface states

- Receipt replay: Section 5 exact success JSON, HTTP200, replayed=true and identical receipt.
- Expired attempt: HTTP410 SUBMISSION_ATTEMPT_EXPIRED, retry=manual_recovery; no auto-new attempt.
- Rate limit: HTTP429 RATE_LIMITED, Retry-After:60, retry=wait_then_same_attempt.
- Unknown commit outcome: HTTP503 RECEIPT_UNCONFIRMED, message="We cannot yet confirm receipt.", retry=same_attempt.
- Service unavailable: HTTP503 SERVICE_UNAVAILABLE; no definite non-persistence claim.
- Operation mismatch: HTTP409 IDEMPOTENCY_CONFLICT, retry=manual_recovery.
- Principal/source and target metadata: Sections 8.1/8.2 exact JSON examples. Mutations revalidate eligibility; metadata never grants permission.
- Follow-up hard deletion/reopening not supported; no UI action or API route. Terminal transition cannot accept a combined disposition field.

## 13. Required verification inventory — ALL NOT EXECUTED

Preserve API-01–10 and ENQ-T01–13 coverage from historical V0.1.2: public validation, persistence/rollback, idempotency/concurrency/expiry, auth and direct RLS denial, owner/status/qualification audit, follow-up/WAT, exact reporting, UX/accessibility, secrets and deployed-build traceability, end-to-end synthetic journey and recovery.

Add V0.2 cases:
- completed vs cancelled mutually exclusive; valid required outcome/reason and server actor/time; no invented work claim.
- unknown fields/forged actor/time; missing/invalid/stale revision; duplicate replay vs competing request.
- active follow-up blocks terminal state and owner clear; mismatched reassignment rejects; no silent action ownership change.
- separate cancel/complete then close: two keys/revisions/events; no combined disposition processing.
- replace cancellation-success/create-failure truthful history and needs-planning count; safe failed-create retry.
- same-ID reschedule; past-date rejection at WAT midnight; existing overdue completion/cancellation allowed.
- cancelled history retained and excluded from open action counts; no delete/terminal-action editing.
- FEX principal isolation, eligibility/revocation, empty state, metadata revision coherence and required reason on assigned→in_progress.
- Unicode normalisation/code-point boundaries, telephone separators, unsafe controls, outcome and reason min/max.
- FE-06 explicit completion/cancellation/replacement/reschedule/blocked-state keyboard/error behaviour; actual rendered acceptance waits for application.

Each evidence record must identify actual source SHA, environment without secrets, synthetic fixture, steps, expected/actual, reviewer and disposition. Static JSON parsing/content review is not runtime acceptance.

## 14. Remaining gates and owner handback

Completed at specification level: JJSA EX-01/02/03 and product validation decisions received; accepted S1 principal/target definitions consolidated. No further broad product revision requested.
AAY1: reconcile this V0.2 exact commit against Product V1.0/V1.0.1/V1.0.2 and accepted S1; update only affected existing matrix dispositions.
AY: final cross-contract freeze remains pending consumer reconciliation; separately validate branch protection and authorised zero-cost development environment.
P-01 public categories, P-02 actual notice/retention, P-03 precise permissions and P-04 business-policy approval remain separately tracked with JCA/Salvi and AY as applicable.
Engineering runtime parameters (attempt/operation retention, abuse and auth integration) retain required AY/security disposition before dependent operation. No Supabase project selection or provisioning consent is inferred.
GATE 0 RELEASE TO CODE and production release remain HOLD. No application code, schema migration, provisioning, real-data processing, deployment or expenditure.

Historical sources: API V0.1.2 at 7271b4b and S1 at 13cf6e9 remain auditable earlier checkpoints; this V0.2 supersedes their conflicting/current-consumption wording. Historical combined closure proposals are not current supported contract shapes.
