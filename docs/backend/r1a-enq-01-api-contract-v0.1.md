# R1A-ENQ-01 — Shared Backend/API Contract V0.1.2

Date: 8 November 2026 (WAT)
Owner: AY1 — Technical Implementation & Integration
Status: Documentation-only engineering proposal for AY/AAY1/JJSA reconciliation. NOT frozen, implemented, tested, Gate 0 clearance or release approval.
Assigned source: Jnasak/jca-salvi-bos / feature/r1a-enq-backend.
Parent source-control baseline: 300cc7faa372a20ba3b3adfe282891aa73886ecc.

## 1. Exact governing references and precedence

- Product: docs/product/r1a-enq-01-product-contract-v1.0.md at b37c6035a15381f77a56c103038baa773cede892, on docs/r1a-enq-product-contract.
- Product amendment: docs/product/r1a-enq-01-status-reopen-amendment-v1.0.1.md at c11023032dbda84de801cb44bf50320fe4ab98c4; supersedes conflicting V1.0 sections 4–5 reopen/ownership rules only. Product semantic exception resolved; P-04 business approval remains pending.
- Frontend consumer matrix: docs/frontend/r1a-enq-01-integration-readiness.md, Section 1, at e44e3d690c82cbf5d371931e92347241dc7849ec; product reconciliation update Section 1.1 at 79a752e51de62e3d1e7c57863dada6102023ae5f.
- PRD V1.3-R1, R1A-ENQ-01 V0.1 and DEC-12 retain parent scope/traceability.
- Approved platform: Next.js, TypeScript, Vercel, Supabase Auth and PostgreSQL; separate principal identities.
- Public source contains documentation and synthetic examples only. No migrations, executable schemas, application code, real records or credentials are introduced here.

JJSA V1.0 is now received: it replaces earlier missing-contract findings. Its detailed rules are specified for reconciliation, with P-01 through P-04 approval dependencies preserved. AY1 owns proposed wire names, HTTP semantics and implementation contracts. AY retains final compatibility/security ruling and explicit G-00 Release to Code.

All engineering choices below are proposed V0.1.2 until AY rules. No unrelated services, portal, finance, project conversion or external messaging are added.

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

Do not reuse the earlier Operations enquiry schema. full_name, phone and single-category semantics follow JJSA V1.0. The thresholds remain JJSA's detailed proposals pending the appropriate review, not original DEC-12 approval claims.

Proposed body-size guard: 32 KiB measured before JSON parsing, supporting the bounded Unicode fields. Reject NUL/control characters except ordinary whitespace required by the field. Do not interpret markup as HTML or strip meaningful plain text silently. Technical normalisation/phone-separator decisions require JJSA compatibility review.

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
- FollowUp: {id:string,owner:Principal,summary:string,due_date:date,status:open|completed,outcome:string|null,completed_at:timestamp|null,completed_by:Principal|null}.
- Lead: {id:string,receipt_reference:string,received_at:timestamp,full_name:string,email:string,phone:string,organisation_name:string|null,service_category_id:string,category_label_at_submission:string,description:string,owner:Principal|null,operational_status:enum,qualification:Qualification,revision:positive integer,updated_at:timestamp,active_follow_up:FollowUp|null,capabilities:string[],allowed_actions:string[]}. Notice acknowledgement metadata remains protected; no secrets in this object.
- Event: {id:string,sequence:positive integer,event_type:string,actor:Principal|null,occurred_at:timestamp,from_revision:integer|null,to_revision:positive integer,changes:object}. changes is allowlisted structural metadata, not arbitrary raw request content.
- List uses Lead objects; qualification filter is its value enum. Capability/action identifiers match the route names (assign_owner, transition_status, set_qualification, create_follow_up, complete_follow_up, reschedule_follow_up); informational UI hints never replace server checks.
- Successful mutations return HTTP 200 and {ok:true,contract_version,data:{lead:Lead},replayed:boolean,meta:{as_of,timezone,scope}}. Creation of a follow-up is part of this same aggregate mutation envelope. No 204 success with ambiguous missing state.
- Session success returns HTTP 200 and {ok:true,contract_version,data:{principal:Principal,capabilities:string[],expires_at:timestamp}}; logout returns HTTP 200 and {ok:true,contract_version,data:{signed_out:true}} only after session termination is confirmed. These envelopes contain no session or refresh tokens.

## 9. Ownership, status, qualification and follow-ups

Proposed mutation routes:
- PATCH /api/internal/leads/{id}/owner: owner_id (approved UUID|null), expected_revision, reason (3–500 code points).
- POST /api/internal/leads/{id}/transitions: target_status, expected_revision, reason (3–500), and conditional active_follow_up_disposition as below.
- PATCH /api/internal/leads/{id}/qualification: qualification, rationale (3–1000), expected_revision.
- POST /api/internal/leads/{id}/follow-ups: owner_id, summary (3–500), due_date, expected_revision.
- POST /api/internal/leads/{id}/follow-ups/{followUpId}/complete: optional outcome <=1000, expected_revision.
- POST /api/internal/leads/{id}/follow-ups/{followUpId}/reschedule: due_date, reason (3–500), expected_revision.

Actor and timestamps always come from the server. Rationale/reason technical limits outside JJSA's explicit limits are proposed and require review.

Operational enum: new, assigned, in_progress, resolved, closed.
Qualification enum: unassessed, qualified, not_qualified, hold.
These are JJSA V1.0 semantics pending P-04/AY compatibility ruling; do not use historic overloaded labels as interchangeable enums.

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

EX-01 disposition: RESOLVED at product-specification level by V1.0.1. The earlier AY1 owner-retention-only proposal and V1.0 resolved→in_progress-only list are superseded. AY cross-contract ruling and P-04 business-policy approval are still pending.

EX-02 remaining bounded engineering choice: explicit terminal follow-up disposition is mandatory under V1.0.1, but exact cancellation/completion semantics are not frozen. Proposed payload active_follow_up_disposition={action:complete,outcome?:string up to 1000 code points}, preserving history. Reject terminal transition while an open action remains unless the approved disposition is included atomically. No silent completion/cancellation. Cancellation requires a reviewed contract amendment; no cancel endpoint is defined here.

EX-03 remaining bounded engineering choice: V1.0.1 resolves terminal owner clearing and open-case status reset. For this proposal reject open deassignment while ANY active follow-up remains (409 FOLLOW_UP_CONFLICT); complete the action through the approved operation first. A future transactional reassign/cancel variant requires explicit review. Historical next-action redesignation remains no silent deletion; rescheduling preserves identity. This is a safe proposed restriction, not a claim that JJSA approved all engineering payloads.

At most one open next-action follow-up per lead, enforced in database. Each follow-up belongs to the same workspace/lead and an approved member. due_date stays date-only; completed_at/actor are server timestamps. Reject impossible calendar dates. Past dates are permitted for faithful tracking with an overdue indicator; this is an engineering proposal requiring JJSA confirmation.

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

## 12. AAY1 Section 1 reconciliation

| Consumer contract area | Classification | V0.1 resolution / remaining owner |
| --- | --- | --- |
| Fields | Aligned structurally; Pending approval | Product snake_case fields and limits adopted; phone separators/Unicode rules to JJSA |
| Categories | Pending | Single configurable active selection; public labels blocked P-01 |
| Public request | Proposed T-01 | Sections 2–4; signed attempt/notice binding to AY |
| Confirmed receipt | Aligned structurally | Section 5; no CRM ID or owner disclosure |
| Validation/rejection | Aligned structurally | Section 6 shared envelope and field keys |
| Duplicate/unknown | Proposed T-01; Pending retention | Section 5; same-attempt replay, explicit expiry, no public lookup |
| Auth/session | Pending AY | Section 7 permission design/sign-in method |
| Assignment | Aligned with JJSA V1.0; Pending P-03 | Section 9 defaults/reassignment |
| Follow-up | Exception | V1.0.1 follow-up invariants incorporated; EX-02/03 payload restrictions and past-date proposal remain pending |
| Status | Exception / Pending P-04 | EX-01 product contradiction resolved by c110230; P-04 and AY cross-contract ruling pending |
| Concurrent edits | Aligned structurally | expected_revision, transaction and 409 response |
| Reporting | Aligned structurally; Pending review | Section 10 exact metric names; no optional filters yet |
| Privacy/abuse | Pending | P-02, approved runtime controls and secure environment |
| Notifications | Aligned | Durable internal queue/indicator; no external delivery promise |

Aligned structurally is AY1's document comparison only, NOT AAY1 joint sign-off, AY acceptance, frozen schema or passed runtime evidence.

### 12.1 Exact interface-state examples for AAY1

All values below are synthetic documentation fixtures. Each error uses the Section 6 envelope and supported contract_version. request_id values are non-sensitive placeholders. These examples are not executed responses.

| State / fixture | HTTP | Exact error fields or success discriminator | Expected frontend action |
| --- | --- | --- | --- |
| Invalid input SYN-02 | 422 | code=VALIDATION_FAILED; message=Check the highlighted fields.; field_errors.email=[{code:INVALID_EMAIL,message:Enter a valid email address.}]; retry=correct_input | Linked error and focus; retain safe values |
| Inactive category SYN-02 | 422 | code=CATEGORY_UNAVAILABLE; message=Choose an available enquiry category.; field_errors.service_category_id=[{code:UNAVAILABLE,message:Choose an available enquiry category.}]; retry=correct_input | Refresh category configuration without silent submission |
| Replay SYN-04 | 200 | Section 5 success JSON, replayed=true, identical receipt.reference and received_at | Display original receipt |
| Uncertain outcome SYN-05 | 503 | code=RECEIPT_UNCONFIRMED; message=We cannot yet confirm receipt.; retry=same_attempt | Preserve original attempt; same-payload retry only |
| Rate limit SYN-05 | 429 | code=RATE_LIMITED; message=Please wait before trying again.; retry=wait_then_same_attempt; Retry-After:60 | Announce delay; same valid attempt after wait |
| Unavailable SYN-05 | 503 | code=SERVICE_UNAVAILABLE; message=We cannot yet confirm receipt.; retry=same_attempt | Never infer non-persistence |
| Changed payload SYN-06 | 409 | code=IDEMPOTENCY_CONFLICT; message=This submission attempt does not match the original request.; retry=manual_recovery | No automatic new key |
| Expired attempt SYN-06 | 410 | code=SUBMISSION_ATTEMPT_EXPIRED; message=This attempt has expired. Receipt is unconfirmed.; retry=manual_recovery | Approved contact/recovery; no automatic new attempt |
| Expired session SYN-07 | 401 | code=SESSION_EXPIRED; message=Sign in to continue.; retry=sign_in | Clear private display/cache |
| Forbidden SYN-07 | 403 | code=ACCESS_DENIED; message=You do not have access.; retry=none | Explicit denied view |
| Stale revision SYN-08 | 409 | code=REVISION_CONFLICT; message=This record has changed. Review the latest version.; retry=refresh_record | Retain edits; re-fetch authorised detail |
| Terminal active action SYN-09 | 409 | code=FOLLOW_UP_CONFLICT; message=Resolve the active follow-up before changing this status.; retry=refresh_record | No silent completion; EX-02 pending |

Approved safe return navigation: same-origin allowlisted internal route identifiers only; never accept an arbitrary external return URL. Session refresh uses the selected Supabase SSR/session integration, with server identity validation and membership recheck; do not treat a locally cached session object as authorisation. Exact sign-in integration remains AY ratification pending.

Bounded mutation examples (request bodies; operation header required):
- Assign synthetic approved principal ID: {owner_id:"synthetic-principal-a",expected_revision:1,reason:"Synthetic assignment"}.
- Set qualification: {qualification:"qualified",rationale:"Synthetic eligibility review",expected_revision:2}.
- Create follow-up: {owner_id:"synthetic-principal-a",summary:"Review synthetic enquiry",due_date:"2026-11-09",expected_revision:3}.
- Complete follow-up: {outcome:"Synthetic follow-up completed",expected_revision:4}.
- Close with explicit active action completion, proposed EX-02 only: {target_status:"closed",reason:"Synthetic closure",active_follow_up_disposition:{action:"complete",outcome:"Synthetic completion"},expected_revision:5}. Do not freeze this shape until JJSA resolves EX-02.
- Reopen owned/unowned: target_status respectively in_progress/new, reason and expected_revision required; these follow JJSA V1.0.1; unassigned resolved is legacy-only. P-04 and AY cross-contract ruling remain pending.

WAT boundary fixture: 2026-11-08T22:59:59Z is 8 November 23:59:59 WAT; 2026-11-08T23:00:00Z is 9 November 00:00:00 WAT. An open follow-up due 2026-11-08 changes from due-today to overdue at that boundary. new_today counts use the half-open UTC window corresponding to that WAT calendar day. The Section 10 example is as at 13:00 WAT with one new unassigned lead.

### 12.2 V1.0.1 reopen/deassignment request and response fixtures

Contract version remains r1a-enq-api-v0.1 during documentation reconciliation; document revision is V0.1.2. No released consumer schema exists. All operation examples use Content-Type application/json, X-BOS-Contract-Version, X-BOS-Operation-Key and a verified internal session. Keys and IDs below are synthetic placeholders, not credentials. reason is trim/NFC, 3–500 code points as the proposed Section 9 engineering limit; JJSA requires nonblank. expected_revision must be a positive integer: missing/invalid is 422, present-but-stale is 409. Neither rejection changes state.

Reopen request: POST /api/internal/leads/synthetic-lead-a/transitions
Body: {"target_status":"in_progress","reason":"Synthetic reopening review","expected_revision":7}.
Precondition: owned resolved lead at revision 7, no active follow-up; actor has approved workspace permission. Result: same owner, in_progress, revision 8; qualification unchanged; exactly one reopen event. Example full success envelope:

```json
{
  "ok": true,
  "contract_version": "r1a-enq-api-v0.1",
  "data": {
    "lead": {
      "id": "synthetic-lead-a",
      "receipt_reference": "BOS-SYNTHETIC-RECEIPT-A",
      "received_at": "2026-11-08T12:00:00Z",
      "full_name": "Sample Prospect A",
      "email": "prospect-a@example.test",
      "phone": "0000000000",
      "organisation_name": null,
      "service_category_id": "general_enquiry",
      "category_label_at_submission": "General business enquiry",
      "description": "Synthetic enquiry for integration testing only.",
      "owner": {"id":"synthetic-principal-a","display_name":"Synthetic Principal A"},
      "operational_status": "in_progress",
      "qualification": {"value":"unassessed","rationale":null,"reviewed_by":null,"reviewed_at":null},
      "revision": 8,
      "updated_at": "2026-11-08T12:50:00Z",
      "active_follow_up": null,
      "capabilities": ["assign_owner","transition_status","set_qualification","create_follow_up"],
      "allowed_actions": ["assign_owner","transition_status","set_qualification","create_follow_up"]
    }
  },
  "replayed": false,
  "meta": {"as_of":"2026-11-08T12:50:00Z","timezone":"Africa/Lagos","scope":"authorised_bos_workspace"}
}
```

The fixture category is test-only. An identical operation replay returns the same original envelope with replayed=true; no second revision/event. meta.as_of remains that original result snapshot. Subsequent detail/report requests have their own as_of. For unassigned closed and legacy unassigned resolved, request target_status=new; successful lead retains owner=null, operational_status=new, increments revision once and creates no follow-up.

Validation example — HTTP 422, blank reason (invalid revision adds expected_revision field error):

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"VALIDATION_FAILED","message":"Check the highlighted fields.","field_errors":{"reason":[{"code":"REQUIRED","message":"Enter a reason."}]},"request_id":"synthetic-validation-a","retry":"correct_input"}}
```

Conflict example — HTTP 409, expected_revision=7 but persisted revision=8:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"REVISION_CONFLICT","message":"This record has changed. Review the latest version.","request_id":"synthetic-conflict-a","retry":"refresh_record"}}
```

Unauthorised-action example — HTTP 403, verified identity without active approved workspace permission:

```json
{"ok":false,"contract_version":"r1a-enq-api-v0.1","error":{"code":"ACCESS_DENIED","message":"You do not have access.","request_id":"synthetic-denied-a","retry":"none"}}
```

Public/no session uses HTTP 401 AUTH_REQUIRED; expired session uses 401 SESSION_EXPIRED. An otherwise authorised member requesting an absent/out-of-scope record receives the non-enumerating 404 NOT_FOUND. None returns protected lead/revision/history data.

Additional deterministic negative responses (same envelope; no mutation):
- Wrong target for current ownership, illegal terminal owner-clear or resolved owner edit: HTTP 409 TRANSITION_NOT_ALLOWED, message="This action is not permitted in the current state.", retry=refresh_record. A terminal owner-clear is not silently converted to reopen.
- Open deassignment with unresolved active follow-up, or terminal transition with no approved disposition: HTTP 409 FOLLOW_UP_CONFLICT, Section 12.1 copy, retry=refresh_record.
- Changed payload/route under the same operation key: HTTP 409 IDEMPOTENCY_CONFLICT, retry=manual_recovery.
- Two independently keyed simultaneous reopens with revision 7: one may succeed to revision 8; the other returns REVISION_CONFLICT. Two identical requests under one operation key return one result and replay, with exactly one event.

Owned terminal deassignment sequence fixture: reopen at revision 7→8 retaining owner, then PATCH owner with {owner_id:null,reason:"Synthetic deassignment",expected_revision:8}; if no active action, result revision 9, owner=null/status=new and a separate owner-clear event. Never combine the two user decisions silently.

## 13. Required test inventory (all NOT EXECUTED)

- API-01 / ENQ-T02: required fields, min/max, Unicode code points, phone/email, unknown fields, body size, invalid content type, inactive category and notice mismatch.
- API-02 / ENQ-T03/04: valid transaction commits all required records; injected audit/digest/lead failure rolls back; timeout and malformed success never cause false confirmation.
- API-03 / ENQ-T05: simultaneous identical submissions, response-loss retry, changed payload, token tamper/expiry, transaction retry, mapping purge; one lead/event for one logical attempt.
- API-04 / ENQ-T06/07: no session, outsider, revoked membership, guessed UUID, direct Data API, forged membership, browser key, cross-workspace and cached-response isolation.
- API-05 / ENQ-T08: legal/illegal owner, qualification, status transition, missing reason and any required disposition, duplicate mutation, stale version and immutable history.
- API-05A / V1.0.1 Sections 1–5: all four terminal/owner reopen combinations, legacy-only unassigned resolved, blank reason, missing/invalid/stale revision, public/outsider/revoked user, direct terminal owner clear, open deassignment blocked by active action, distinct-key concurrent reopen, identical-key replay, unchanged qualification and no automatic follow-up. Verify one state revision/event per successful logical operation and resulting triage/planning metrics. NOT EXECUTED.
- API-06 / ENQ-T09: one active follow-up constraint, reschedule/complete, terminal record contradiction, WAT midnight/Sunday-Monday and valid date-only rules.
- API-07 / ENQ-T10: reproduce exact metrics from fixtures; historical actions do not inflate leads; authorised scope and zero-state.
- API-08 / ENQ-T11 + UX-01–11: AAY1 shared valid/error/replay/expired/rate-limited/auth/conflict examples and no private-data flash.
- API-09 / ENQ-T12: secret scan of tracked files/history/build output, pinned dependencies, environment isolation and commit/build mapping.
- API-10 / ENQ-T13: after G-00, complete synthetic public submit→persist→internal retrieve→assign→follow-up→status→report and recovery rehearsal.

Evidence must identify actual source SHA, test/runtime/configuration without secrets, fixture, expected/actual, reviewer and disposition. Documentation-only review is not a functional test pass.

## 14. Open decisions and exact next action

- JJSA: review technical normalisation/limits and remaining EX-02/03 engineering choices; return approval or bounded amendments. Product V1.0 exists at the exact source above; no substitute product contract is required.
- JCA/Salvi + AY: resolve P-01 category wording, P-02 notice/retention, P-03 cross-principal sharing, P-04 material status rules at the required build/release stage.
- AY: ratify T-01 endpoint/envelope/token/revision/auth/security design, identity provisioning approach, token/digest lifetimes and abuse controls.
- AAY1: reconcile each Section 1 row against this version and JJSA V1.0; record Aligned/Exception/Pending with exact sources.
- AY/JCA: branch governance and approved zero-cost Supabase development environment remain separate T-02 conditions.
- No Supabase organisation/project selection is inferred from this documentation assignment.
- G-00 Release to Code and production release remain HOLD. This is a versioned preparation deliverable only.

Change log: V0.1.2 incorporates JJSA V1.0.1 at c110230, resolves EX-01 at product level, applies owner-clear/follow-up invariants, and supplies reopen success/validation/conflict/permission examples. P-04, AY compatibility ruling and Gate 0 remain pending.

V0.1.1 incorporates AY's conditional compatibility ruling and recommended reopen correction, AAY1 reconciliation at 79a752e, proposed attempt lifetimes and interface-state examples. Prior V0.1 at 9eb3eaabddbee473af934017d77364292f47af31 remains the historical first delivery; it is no longer accurate to classify AY1's API artifact as undelivered.

V0.1 initial AY1 shared API proposal, based on received JJSA V1.0 and accepted AAY1 matrix. No application implementation.
