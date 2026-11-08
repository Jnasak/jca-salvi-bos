# AAY1 Frontend Integration Readiness — R1A-ENQ-01

Date: 8 November 2026 (WAT)
Owner: AAY1; technical acceptance: AY
Status: Preparation only. Contract reconciliation incomplete. No executable application, executed tests, deployment or rendered acceptance.

## Authority and source

Canonical repository: Jnasak/jca-salvi-bos (public).
Assigned branch: feature/r1a-enq-frontend.
Verified preparation baseline: 300cc7faa372a20ba3b3adfe282891aa73886ecc.
Both assigned feature branches and main were observed at this baseline on 8 November 2026, 13:05 WAT. The baseline tree contains README.md and .gitignore only. Main reported protected=false; AY retains governance disposition.
This document adds preparation only; it does not establish an application baseline or Gate 0 clearance.

Governing inputs: AY's 8 November frontend preparation directive; accepted UX-01–UX-11 specification; PRD V1.3-R1; R1A-ENQ-01 V0.1, ENQ-FR-01–12 and AC-01–14.
The retrieved amendment's historic proposed/pending status is superseded for reduced-scope approval by the recorded DEC-12 directive. Its unresolved detailed business rules are not silently approved by this document.
Approved baseline: Next.js, TypeScript, Vercel, Supabase Auth and PostgreSQL; separate JCA/Salvi accounts.
Coding requires AY's explicit SIA-06 / DEC-12 — GATE 0 RELEASE TO CODE.

## 1. Contract alignment and unresolved decisions

Confirmed workflow: public enquiry → persistent lead → owner assignment → follow-up → status → operational reporting.
Public submission is independent of internal sign-in. Only authorised authenticated principals access internal records.
Submission confirmation depends on database persistence, not notification delivery or an HTTP status alone.
No existing API/type/schema is present in the inspected baseline. All wire names, endpoint paths and error codes remain AY1-owned; no duplicate frontend schema is created here.

| Contract area | Source-supported expectation | Required resolution and owner |
| --- | --- | --- |
| Fields | V0.1 proposes required full name, email, phone, service/enquiry category, description and privacy acknowledgement; organisation optional | JJSA: final labels, cardinality, field keys, lengths, formats, whitespace rules and requiredness. Do not copy Operations website categories |
| Categories | A service/enquiry category is required in V0.1 | JJSA: stable IDs, display labels, ordering, active values and single/multiple choice |
| Public request | Validated submitted fields and acknowledgement; request identity for safe retries | AY1: endpoint/method, shared schema version, payload, request identity lifetime and privacy-notice version binding |
| Confirmed receipt | Exactly one persisted record per logical request; safe public submission reference | AY1: exact discriminated response and non-sensitive reference; internal IDs do not grant access |
| Validation/rejection | Field errors mapped to shared keys; useful general errors | AY1: error envelope; JJSA: field messages and permitted wording |
| Duplicate/unknown outcome | Repeat same logical request without duplicate creation | AY1: key scope, payload mismatch, replay result, expiry and recovery path; UI does not retry automatically until agreed |
| Auth/session | Separate approved accounts, no public internal registration | AY1/AY: sign-in method, session refresh/logout, unauthenticated/expired/forbidden distinctions and safe return route |
| Assignment | Assign to JCA or Salvi; history retained | JJSA: initial/unassigned rule and allowed actors; AY1: authorised principal IDs and update contract |
| Follow-up | Next action, responsible principal, due date and outcome | JJSA: requiredness, date-only versus time, completion/overdue semantics; AY1: storage and WAT serialization |
| Status | V0.1 proposes New, Under Review, Qualified, Follow-up, Converted, Closed, Hold, Not Qualified | JJSA: definitions, permitted transitions/reasons and terminal/reopen rules; AY1: allowed-action response and audit. Converted does not create project scope |
| Concurrent edits | Avoid overwriting another principal's update silently | AY1: revision/conflict response; UI preserves unsaved values and offers refresh/reconciliation |
| Reporting | New, owner counts, outstanding/overdue follow-ups, qualified/closed summaries | JJSA: window, inclusion and distinct-enquiry versus action counts; AY1: aggregates, filters, WAT cutoffs and freshness metadata |
| Privacy/abuse | Approved notice/acknowledgement and protected processing; no private information in logs | AY: approved wording/version, retention, processing, local environment and abuse controls; AY1: service-unavailable/rate-limit/challenge contract |
| Notifications | Internal new-enquiry indication; optional external delivery separately approved | AY1: durable queue source and failure recovery; no email/WhatsApp integration assumed |

Contract freeze evidence: shared artifact path/version, owner review, approved examples and AY disposition. This table is an integration checklist, not a jointly signed API agreement.


### 1.1 Owner-contract reconciliation — 8 November 2026, 13:33 WAT

Product reference: [JJSA Product Behaviour and Acceptance Contract V1.0](https://github.com/Jnasak/jca-salvi-bos/blob/b37c6035a15381f77a56c103038baa773cede892/docs/product/r1a-enq-01-product-contract-v1.0.md), commit b37c6035a15381f77a56c103038baa773cede892, branch docs/r1a-enq-product-contract.
API reference: Pending receipt. The inspected backend branch remains at 300cc7faa372a20ba3b3adfe282891aa73886ecc and contains README.md and .gitignore only.

Labels below assess product-to-frontend compatibility only; Aligned does not mean approved for code, jointly API-reconciled, implemented or tested. V1.0 thresholds are JJSA proposals for reconciliation. Prior matrix rows retain their historical V0.1 basis; this subsection records the newer product decisions and exceptions.

| Contract area | Classification | Reconciliation and remaining owner action |
| --- | --- | --- |
| Fields | Aligned — product level; API Pending | V1.0 section 2 supplies seven logical keys, labels, requiredness and proposed limits. Frontend can consume one category, optional organisation and affirmative acknowledgement. AY1 must map shared wire schema/errors; JJSA/AY1 must clarify Unicode normalisation/counting and accepted phone separators before boundary tests freeze |
| Categories | Pending — public enablement blocker | V1.0 section 3 permits only synthetic general_enquiry for mock/testing until principal approval. Use configurable active list and stored label-at-submission; do not present synthetic label as approved public taxonomy. P-01: JCA/Salvi; AY1 list schema Pending |
| Public request | Aligned — product boundary; API Pending | V1.0 sections 2/8: public fields only; owner/status/source/notice version server-owned. AY1 endpoint, schema version, request identity and error contract Pending |
| Confirmed receipt | Aligned — product level; API Pending | V1.0 section 8: persistence-confirmed, non-authorising public reference, received time and generic wording only. Do not expose full CRM ID. AY1 exact discriminator/receipt schema Pending |
| Validation/rejection | Aligned — product intent; API Pending | V1.0 section 2 supplies field copy and limits; consume field-key errors. Threshold/normalisation agreement and technical error envelope Pending |
| Duplicate/unknown outcome | Aligned — product level; API Pending | V1.0 section 8 matches at-most-one logical request and same receipt replay; retain uncertain state. AY1 TTL, changed-payload response, recovery and safe retry rules Pending |
| Auth/session | Pending | Separate accounts and private internal workspace align. V1.0 section 4/P-03 still requires ratified access matrix and session treatment; AY/AY1 auth/expiry/forbidden contract Pending |
| Assignment | Aligned — product level; permission/API Pending | V1.0 section 4: initial unassigned, no public owner control; authorised principal assignment/reassignment audited. Final shared access ratification P-03 and allowed-action payload Pending |
| Follow-up | Aligned — product level; API Pending | V1.0 section 6: separate linked action, at most one active next action, required owner/summary/WAT date; overdue strictly before today. Reschedule/completion audited. AY1 serialization, mutation and close/complete transaction contract Pending |
| Status/qualification | Exception — AY compatibility ruling required | V1.0 section 5 refines historic V0.1 labels into operational new/assigned/in_progress/resolved/closed plus separate unassessed/qualified/not_qualified/hold. Follow-up is derived; Converted/project creation deferred. Frontend must not silently retain old labels as enum values. P-04 business-rule disposition and AY ruling required before dependent schema/UI freeze |
| Concurrent edits | Aligned — product level; API Pending | V1.0 section 4 rejects stale revisions, matching retained-input reconciliation. AY1 revision token and conflict/error payload Pending |
| Reporting | Aligned — product level; API Pending | V1.0 section 7 distinguishes distinct enquiry counts from open action counts, new_today from as-of queue totals, resolved from closed. Server as_of/timezone/scope required; no UI-authoritative totals. AY1 exact payload/date-cutoff examples Pending |
| Privacy/abuse | Pending — real/public-data blocker | V1.0 P-02 notice/retention/processing approval and AY technical controls outstanding. Notice version is server-owned. Rate-limit/anti-abuse and error/recovery responses Pending AY1 |
| Notifications | Aligned — product boundary; API Pending | V1.0 section 8 permits dashboard indication; external delivery is not a persistence or release prerequisite. AY1 durable queue/freshness/recovery payload Pending |

Additional bounded exception: V1.0 section 5 allows reopening resolved records, but its explicit transition list only includes resolved→in_progress while the general reopening rule allows unowned records to return to new. JJSA/AY1 should resolve the resolved-without-owner case and the atomic owner-clear/status-reset contract rather than derive contradictory client rules.

Classification: partial product/frontend reconciliation completed; joint product/API/frontend contract freeze NOT COMPLETE.
Next owner handback: AY1 versioned API contract referencing this exact product SHA, including examples for field errors, category activation, receipt replay, uncertain outcome, auth expiry, stale update, status/qualification, follow-up closure and reporting. JJSA resolves P-04 and bounded semantic exceptions; AY rules on compatibility. P-01/P-02/P-03 remain separately owned approvals, not reopened DEC-12 scope.


### 1.2 Cross-contract reconciliation — 8 November 2026, 13:40 WAT

This subsection supersedes the API-delivery-pending findings in 1.1 and the historical pending-receipt wording elsewhere in this document. It does not change the accepted component backlog or define another API.
Product: V1.0 at b37c6035a15381f77a56c103038baa773cede892, docs/product/r1a-enq-01-product-contract-v1.0.md.
API: [AY1 Shared Backend/API Contract V0.1](https://github.com/Jnasak/jca-salvi-bos/blob/9eb3eaabddbee473af934017d77364292f47af31/docs/backend/r1a-enq-01-api-contract-v0.1.md), commit 9eb3eaabddbee473af934017d77364292f47af31, branch feature/r1a-enq-backend.
Frontend consumer baseline: this document at 79a752e51de62e3d1e7c57863dada6102023ae5f.
AY's Product Contract V1.0 Technical Review (8 November) accepts model compatibility conditionally, retains JJSA semantic correction/P-04, and has NOT issued Gate 0.
API V0.1 section 1 references frontend e44e3d6: valid original consumer baseline; AY1 should additionally reference 79a752e and this reconciliation on its next revision.

Classification below is static document alignment, not runtime validation, joint contract freeze or business-policy approval.

| Area | Classification | Exact contract reference and frontend disposition |
| --- | --- | --- |
| Fields | Aligned structurally; Pending JJSA technical-detail review | Product section 2; API section 4 request table and synthetic body. Seven snake_case keys, single category, optional organisation, true acknowledgement. NFC/code-point lengths, separator rules/body guard require JJSA compatibility review. Native UTF-16 maxlength alone cannot enforce Unicode code-point limits |
| Categories | Aligned structurally; Pending P-01 | Product section 3; API section 3 config schema and section 6 CATEGORY_UNAVAILABLE. Consume id/label active list in server order; empty/unavailable config disables submission. general_enquiry is synthetic only |
| Public request | Aligned; Pending AY T-01 parameters | API sections 2–4: GET /api/enquiry-config, POST /api/enquiries, contract/notice headers and signed attempt token. Keep token/draft in memory; freeze logical attempt once submit starts. TTL/abuse configuration still requires AY |
| Confirmed receipt | Aligned | Product section 8; API section 5 success JSON. Require HTTP 200/201, ok=true, supported version, well-formed reference/received_at and boolean replayed. Display safe receipt only; no CRM UUID. No UI success on arbitrary ok=true |
| Validation/rejection | Aligned; Pending complete example set | API section 6 error JSON/table and retry enum. Bind field_errors to shared keys and safe copy; map general/integration errors to error summary. Existing concrete JSON example covers email; remaining state examples need bounded completion |
| Duplicate/unknown | Aligned behaviour; Pending TTL/retention approval | API sections 3/5/6. Retain same signed attempt for retry; replay returns original receipt. 409 mismatch, 410 expiry/unavailable receipt and unknown outcome never trigger automatic new attempt. 429 waits Retry-After but expired attempt requires manual recovery. No public lookup endpoint |
| Auth/session | Aligned envelopes; Pending AY/P-03 | API sections 7/8: session/logout envelopes, 401 versus 403, no-store and revoked membership checks. Email/password method proposed, not ratified. No public internal registration. Clear private view/cache on expiry; no user-editable metadata used as authority |
| Assignment | Exception FEX-01; Pending P-03 | Product section 4; API sections 8/9. Owner mutation expects approved UUID but no documented response supplies the complete assignable-principal list to owner/follow-up selectors. AY1 must identify an authorised source; frontend must not hardcode IDs or infer second principal from display names |
| Follow-up | Exception EX-02/EX-03; Pending JJSA | Product section 6; API section 9. Date-only WAT, one active next action, complete/reschedule shape align. Terminal active-action disposition, replacement/removal rules and permissibility of past dates remain explicit proposals; UI must not silently complete/delete |
| Status/qualification | Exception EX-01/FEX-02; Pending correction and P-04 | Product section 5; API section 9. AY conditionally accepts separate operational/qualification model. API still proposes resolved-owner invariant and resolved→in_progress only. Await JJSA versioned decision for owned/unowned reopen and owner clearing; no independent frontend transitions |
| Concurrent edits | Aligned | API section 8 mutation envelope/revision rules and section 6 conflicts. Send expected_revision plus distinct X-BOS-Operation-Key per logical internal edit. Retain key on retry; authorisation checked on replay. Re-fetch/reconcile on real stale conflict; do not retry under new key automatically |
| Reporting | Aligned | Product section 7; API section 10 complete reporting JSON. Consume ten named metrics plus as_of/timezone/wat_date/scope; no optional report filters in V0.1. New-today versus as-of totals and action versus enquiry counts remain distinct. Later queue reads need not be the same snapshot |
| Privacy/abuse | Pending public-enablement/technical controls | Product P-02; API sections 3/4/6/7/11/14. AY reports D1–D3 governance approved with controls; actual approved notice/version still outstanding. Token/digest/internal-operation retention, abuse mechanism and protected environment need AY disposition. Do not use config placeholders as legal notice |
| Notifications | Aligned | Product section 8; API sections 5/10/12. Durable queue/summary indication suffices; notification failure does not undo persisted receipt. No external messaging introduced |

#### Bounded exceptions and missing examples

- EX-01 / JJSA: confirm reopening resolved/closed with owner→in_progress, without owner→new, as AY recommends; specify whether/when terminal ownership may be cleared. API V0.1's proposed invariant is not an approved substitute. Mutation requires authorised actor, reason, expected revision, atomic state/audit.
- EX-02 / JJSA: decide explicit handling of an active follow-up when resolving/closing. API proposes same-transaction completion disposition; frontend must await confirmation.
- EX-03 / JJSA: replacement/removal of next action, completed-action handling and past-date allowance need bounded confirmation.
- FEX-01 / AY1: supply authorised assignable-principal source for both owner selectors (FE-05/06); no new endpoint is prescribed by AAY1.
- FEX-02 / AY1 + JJSA: allowed_actions lists action names, not target-state choices or conditional input requirements. Supply authoritative transition/reason/disposition metadata OR reference an exact frozen transition matrix for client presentation, while retaining server enforcement. FE-06 cannot infer this from action names alone.
- FEX-03 / AY1: complete minimal synthetic examples for config, list/detail, session, successful mutation, 409 revision conflict, replay, 410 expiry, 429, 401/403 and 503 uncertain outcome. V0.1 already supplies concrete public request, success receipt, validation error and reporting JSON; internal type/envelope descriptions are useful but not a full reproducible example set.
- Technical-detail review / JJSA + AY1: ratify NFC/code-point interpretation, phone separators/control-character policy and proposed reason/rationale limits. Frontend validation must match backend normalization exactly.

#### P-01–P-04 disposition

| Gate | Updated disposition |
| --- | --- |
| P-01 | Public category wording pending principals; synthetic category remains test-only |
| P-02 | D1–D3 governance approved with controls per AY; actual notice/version and detailed retention/runtime implementation still require proper approval |
| P-03 | Initial two-principal membership approved; precise shared permissions/assignment matrix pending ratification |
| P-04 | Status/qualification model technically compatible per AY; JJSA bounded correction and required business-policy approval pending |

FE/UX impact: FE-01 layout/control preparation unchanged; FE-02 depends on approved category/notice and compatible constraints; FE-03 has consumable proposed response semantics but runtime parameters/recovery review remain; FE-04 needs ratified auth/session setup; FE-05/06 require FEX-01/02 and EX-01/02/03 dispositions; FE-07 reporting is structurally consumable with V0.1 scope; FE-08 waits Gate 0 and executable candidate.
UX-01–UX-11 coverage remains unchanged; API-01–10 and ENQ-T01–13 provide additional evidence links. All tests NOT EXECUTED.

Disposition: product + API delivery blockers closed. Cross-contract static review completed with the exceptions above; NOT a frozen contract. Next: JJSA versioned semantic correction, AY1 bounded contract/example revision, then AY cross-contract ruling. Branch governance/local environment and explicit Release to Code remain separate conditions. No application implementation or deployment is included.


### 1.3 V1.0.1 status correction reconciliation — 8 November 2026, 13:49 WAT

Product correction: [JJSA V1.0.1](https://github.com/Jnasak/jca-salvi-bos/blob/c11023032dbda84de801cb44bf50320fe4ab98c4/docs/product/r1a-enq-01-status-reopen-amendment-v1.0.1.md), commit c11023032dbda84de801cb44bf50320fe4ab98c4. It supersedes only the conflicting V1.0 reopen/ownership statements; other product rules and reduced scope remain unchanged.
Latest API reviewed: [AY1 contract at 058cee8](https://github.com/Jnasak/jca-salvi-bos/blob/058cee8b907d6fd17fa4f5b94876177e0f0628f8/docs/backend/r1a-enq-01-api-contract-v0.1.md), change log V0.1.1, sections 9 and 12.1. The filename/header still identify V0.1; pin the SHA, not filename alone. This revision references AY's recommended correction but still awaits JJSA's amendment. It does not yet incorporate c110230.

| Affected area | Classification | Frontend reconciliation / owner action |
| --- | --- | --- |
| EX-01 reopening contradiction | Resolved at product-specification level | Product V1.0.1 sections 1/4 give deterministic destinations. Do not classify it as an unresolved JJSA contradiction or invent a different rule |
| Status/qualification | Aligned to corrected product; API/P-04 Pending | Operational and qualification fields stay separate. No effect on category choices, report definitions or scope. AY1 must replace the old transition text and amendment-pending wording |
| Owned terminal reopen | Aligned product behaviour | resolved/closed with named owner → in_progress; retain owner. Require reason, expected revision and authorised actor; one atomic state/audit mutation |
| Unassigned terminal reopen | Aligned product behaviour; defensive case explicit | closed + unassigned → new. resolved + unassigned → new only for pre-existing legacy/inconsistent records; never expose this as permission to create a normally unowned resolved case |
| Owner clearing | Aligned product behaviour; API Pending | Reject direct terminal owner clear. Owned terminal case must reopen first, then explicitly deassign in a separately audited/revisioned action. Open assigned/in_progress deassignment atomically clears owner and returns to new |
| Follow-up consistency | Invariant aligned; EX-02/03 partially Pending | No active open follow-up on terminal record; no orphan action from deassignment. Reopening creates no action/due date and never revives completed work. Exact completion/cancellation/reassignment payload/permissions and replacement rules still need the bounded JJSA/AY1 contract |
| Concurrency and denied actions | Aligned requirement; examples Pending | Missing/blank reason, missing/stale revision and unauthorised action reject without mutation. Retain safe input on conflict. AY1 supplies examples tied to c110230 and differentiates duplicate operation replay from competing fresh requests |
| Reporting/queue | Aligned; no definition change | Reopened owned case with no next action → needs_follow_up_planning; unassigned new → triage. Consume committed-state server aggregates; do not invent overdue action on reopen |
| FEX-01/02 | Pending | Authorised selector principal source and authoritative permitted-target/input contract still required from AY1; corrected product table supplies semantic basis but does not grant permissions |
| FEX-03 examples | Partially addressed | API 058cee8 section 12.1 now supplies replay, expiry, rate limit, 401/403, stale conflict, uncertain response and mutation-body examples. Close the earlier missing-state-table finding for these examples only. Config/list/detail/session and full successful mutation fixtures, plus corrected reopen/deassignment outcomes, still need completion/ratification |

Proposed future verification (NOT EXECUTED): use V1.0.1 section 5 cases for four owned/unassigned terminal combinations, legacy recovery, missing reason/revision, stale/conflicting and unauthorised attempts, rejected terminal clearing, follow-up-blocked deassignment, concurrent reopen and no automatic follow-up creation. Extend existing SYN-08/09/10 and UX-10/11 coverage; no new interface scope or independent schema.

Approval gates retained: P-01 public categories Pending; P-02 actual approved notice/version and relevant retention controls Pending (AY's D1–D3 governance acceptance with controls preserved); P-03 precise permissions Pending; P-04 business-policy approval Pending. Product-level correction is not principal approval, API adoption or runtime evidence.

Next handback: AY1 updates the versioned API against c110230 with success, invalid-input, revision-conflict, disallowed-action and unauthorised examples, and resolves selector/action metadata gaps; AAY1 then records exact aligned references. AY cross-contract compatibility ruling remains separate from branch governance, environment validation and Release to Code.
No application code, tests, deployment or production release is authorised or claimed.


### 1.4 API V0.1.2 consumer delta — 8 November 2026, 13:56 WAT

Exact API reference: [V0.1.2 at 7271b4b](https://github.com/Jnasak/jca-salvi-bos/blob/7271b4bc027af4683aaff07ce1771384659a5d85/docs/backend/r1a-enq-01-api-contract-v0.1.md), full SHA 7271b4bc027af4683aaff07ce1771384659a5d85. Compared against JJSA V1.0 b37c603, correction V1.0.1 c110230 and frontend reconciliation 1917dd5. This delta supersedes 1.3's API-adoption-pending finding. Unchanged classifications in 1.2 remain applicable.

AY's current cross-contract ruling: compatibility accepted in principle with controls, final freeze Pending. EX-01 CLOSED at product AND API specification levels; no further JJSA reconsideration requested.

| Changed / retained item | Disposition | Evidence and frontend consequence |
| --- | --- | --- |
| EX-01 product/API consistency | Aligned — Closed | API section 9 adopts c110230: owned terminal→in_progress, unassigned closed→new, unassigned resolved→new for legacy recovery only; terminal clearing prohibited, open deassignment atomic. Matches product and accepted UX behaviour |
| Reopen/deassignment response examples | Aligned documentation | API section 12.2 supplies full successful mutation envelope, replay behaviour, 422 field validation, 409 stale revision/illegal transition and 403 denied action. Map successful lead revision/owner/status; retain edits for 409, linked reason errors for 422, remove protected display on auth loss |
| Revision distinction | Aligned | Section 12.2: missing/invalid expected_revision→422; present stale→409. Do not treat all revision errors as a refresh conflict. Fresh competing keys versus identical-key replay remain distinct |
| FEX-03 mutation-example gap | Partially closed | Full reopen success envelope and corresponding negative examples now supplied. Preserve only remaining config/list/detail/session fixture gaps previously identified; no claim of executed mock tests |
| EX-02/03 | Exception — Pending JJSA | Completion versus cancellation, replacement/removal and past-date rules not frozen. Apply AY interim safety ruling below; API proposed atomic-complete payload is NOT accepted by frontend as a resolved business disposition |
| FEX-01 | Pending AY1 | Approved assignable-principal source absent from reviewed API revision; do not infer/hardcode UUIDs |
| FEX-02 | Pending AY1 | Action names still do not supply authoritative permitted targets/conditional inputs. Need metadata or exact frozen referenced matrix with server enforcement |
| Validation boundaries | Pending JJSA/AY1 | NFC/code points, telephone separators and reason/rationale limits need final compatibility disposition; no frontend-only alternate limits |
| P-01–P-04 | Pending appropriate owners | No closure inferred from API delivery or technical compatibility; prior governance approvals with controls retained |

AY interim safety ruling takes precedence over the provisional section 9/12.1 active_follow_up_disposition complete example: while EX-02/03 remain unresolved, reject a terminal transition involving any unresolved open follow-up. No close action may silently complete/cancel/delete it. Completion represents work actually performed and must be an explicit approved operation. In FE-06 explain the blocking action, preserve unsaved safe input, and consume the agreed server conflict response; no client bypass or automatic completion.
Open deassignment also rejects an unresolved active follow-up under section 9. Reopening creates no task, due date or overdue indication.

FE-06 and UX-03/10/11 now have aligned reopen/owner-clear outcomes and error examples. FE-01–08 scope and UX-01–11 coverage are unchanged. No new strategy or API schema is introduced.

Final consumer review of API 7271b4b: completed with bounded exceptions. Contract freeze remains Pending EX-02/03, FEX-01/02, validation and AY disposition; public/data enablement approvals remain separately tracked. Branch governance, authorised zero-cost environment and explicit RELEASE TO CODE remain independent Gate 0 conditions. All runtime/rendered tests NOT EXECUTED; production HOLD, synthetic-only and zero-expenditure controls retained.

## 2. Component backlog and implementation order

Routes below are semantic views, not independently assigned URL paths. UX specification is retained rather than redesigned.

| ID | Components and bounded task | Depends on | Traceability / exit evidence |
| --- | --- | --- | --- |
| FE-01 | Shared form controls, labels, errors, status region, buttons, contact links and responsive layout | AY canonical scaffold and shared contracts | UX-02/03/07/08/09; keyboard, wrapping and contrast evidence |
| FE-02 | Public EnquiryForm, ServiceSelector, PrivacyAcknowledgement | JJSA fields/categories; AY notice; AY1 request schema | ENQ-FR-01/02/10; AC-01/02/10/12; UX-01/02/03 |
| FE-03 | SubmissionStatus, ReceiptPanel, RetryRecovery | AY1 persistence/idempotency/error contract | ENQ-FR-03/09; AC-03/04; UX-04/05/06 |
| FE-04 | PrincipalSignIn, SessionNotice, AccessDenied and logout | AY1 auth/session and safe navigation contract | ENQ-FR-08; AC-05/09; UX-11 |
| FE-05 | EnquiryQueue, OwnerFilter, StatusFilter, EmptyState and load/retry controls | Authorised list payload, filtering and pagination | ENQ-FR-07/08/12; UX-08/10/11 |
| FE-06 | LeadDetail, OwnerAssignment, FollowUpEditor, StatusControl, AuditHistory | JJSA rules; AY1 updates, allowed actions and concurrency | ENQ-FR-04/05/06/11; AC-06/07; UX-03/07/10/11 |
| FE-07 | OperationalSummary with window, freshness, loading/empty/failure states | Approved aggregate definitions and payload | ENQ-FR-07; AC-08; UX-10/11 |
| FE-08 | Integrated synthetic journey and rendered regression; evidence index | FE-01–07, AY test environment, AY1 integration support | AC-11/13; UX-01–11; commit-linked expected/actual evidence |

After Gate 0, develop against approved synthetic mock contracts without waiting for full backend completion. Mock behaviour is test evidence only and must not be reachable as an accepted production persistence path.
No portal, project engine, finance, timesheets, full knowledge base, external messaging or advanced analytics.

## 3. State and interaction decisions

- Invalid: show linked inline errors and error summary; move focus to summary or first invalid control after failed submit; retain safe input.
- Pending: mark form busy, announce progress and block concurrent submit. Keep the same logical request identity.
- Confirmed: render receipt only when the agreed response confirms persistence. Move focus to a receipt heading and announce the outcome without duplicate announcements. Do not promise assignment, qualification, response time or commercial acceptance.
- Rejected: display approved field/general corrections and retain safe values; no raw provider/stack messages.
- Unavailable/rate limited: explain approved retry timing; preserve safe input and use the shared response contract.
- Uncertain: explain that receipt is unconfirmed. Do not assert success or definite loss; use the agreed recovery procedure.
- Replay: reconcile to the original receipt without presenting a new lead. A changed payload or expired key follows AY1's explicit conflict/recovery rule.
- Internal saves: show pending state and confirmed server result. On conflict retain edits, explain staleness, fetch latest authorised data and require reconciliation.
- Auth expiry: stop private mutations, remove private display/cache and offer approved sign-in. Do not store credentials or enquiry drafts in browser persistent storage. Denied views disclose no record existence/content.
- Navigation and updates: logical tab order; visible focus; keyboard controls; text/icon status labels; status announcements without unexpectedly moving focus during background refresh.
- No operational totals or permission enforcement derived solely from hidden frontend controls.

## 4. Synthetic fixture and mock-response catalogue (documentation only)

All identities are fictitious; use reserved example.test email addresses. No passwords, tokens, real enquiry content, database IDs or runtime mock code.

| Fixture | Synthetic content / response scenario | Expected coverage |
| --- | --- | --- |
| SYN-01 | Sample Prospect A, prospect-a@example.test, Example Test Organisation; description "Synthetic enquiry for integration testing"; JJSA category placeholder; phone value supplied from AY1's non-dialling validation-compatible fixture | Valid submit and persisted receipt |
| SYN-02 | Blank required values, invalid email and unavailable category | Field/error mapping and focus |
| SYN-03 | Long organisation/description, Unicode name and literal markup-like text | Limits, wrapping and safe text rendering; no raw HTML |
| SYN-04 | Same logical request twice, delayed response and two clicks | One persisted record; receipt replay |
| SYN-05 | Connection loss before response, malformed response, server rejection, unavailable service and rate limit | No false success; recovery |
| SYN-06 | Same request identity with changed content or after expiry | Approved conflict/recovery behaviour; no blind new request |
| SYN-07 | Principal A/Principal B synthetic memberships; outsider, revoked and expired sessions | Authorised views versus denied data access; no credentials in repository |
| SYN-08 | Unassigned lead; authorised assignment; disallowed owner/status; conflicting revision | Explicit states, server rejection and retained edits |
| SYN-09 | Follow-up due today, overdue, completed and boundary dates | WAT semantics and report reconciliation |
| SYN-10 | Zero leads; one new lead; one lead with multiple follow-ups; mixed statuses/owners | Empty state and exact expected aggregate counts after JJSA definitions |
| SYN-11 | Successful persistence with failed notification | Receipt remains truthful; internal retrieval/recovery works |

Mock envelope fields/status codes are pending AY1. Approved product contact links are not synthetic customer fixture phone values.

## 5. UX acceptance and test sequence

| Criteria | Planned evidence |
| --- | --- |
| UX-01 Primary route | Public form reachable signed out; contacts secondary; no internal data exposed |
| UX-02 Accessible fields | Labels, required/optional flags, input purpose, acknowledgement and descriptions |
| UX-03 Validation | Keyboard invalid submit; error summary, linked errors, focus and retained input |
| UX-04 Submission states | SYN-01/02/04/05 reproduces idle/invalid/pending/confirmed/failed/uncertain states |
| UX-05 Truthful confirmation | Receipt appears only for agreed persistence-confirmed response; malformed response rejected |
| UX-06 Recovery | SYN-04/05/06; UI plus AY1 database evidence verifies no unintended duplicates |
| UX-07 Keyboard/focus | Entire enquiry, sign-in and internal update journeys keyboard-only; focus visible and unobscured |
| UX-08 Responsive | 360, 390, 768, 1024 and 1440 px; 200% zoom; long text, readable queue and error wrapping |
| UX-09 Contrast/targets | Normal text 4.5:1; large text/essential indicators 3:1; target 44px controls where feasible; measure actual render |
| UX-10 Continuity | Submit → reload/retrieve → assign → follow-up → status → matching report; stable record linkage |
| UX-11 Privacy/access | Signed out/expired/revoked/outsider states; no private cache flash; AY1 direct API/RLS corroboration |

Sequence: shared contract example review → authorised scaffold/components → form and mocked submission states → auth/internal views → workflow/report integration → keyboard/accessibility review → responsive/zoom/contrast review → AY1 persistence, duplicate and negative-access checks → consolidated regression.
No browser matrix/tooling claim is made; AY confirms available test environment and coverage.
Each result records source SHA, runtime/configuration without secrets, fixture, viewport/browser, steps, expected/actual outcome, screenshot or log where appropriate, severity and correction/retest.
Use PASS / PASS WITH BOUNDED ISSUE / FAIL — BLOCKER. Unexecuted is not PASS.

## 6. Contacts

| Contact | Display | Telephone link |
| --- | --- | --- |
| JCA | 08165942310 | tel:+2348165942310 |
| Salvi | 08134253351 | tel:+2348134253351 |

Specification formatting checked against AY's directive. Actual device/link operation untested. No WhatsApp or marketing permission inferred.

## 7. Readiness disposition

Completed: live repository/branch baseline inspection; README and ignore-policy review; amendment field/status/AC review; component backlog; submission state design; contract gap matrix; synthetic scenario catalogue; UX-01–UX-11 coverage mapping.
Ready structurally: seven bounded screen areas and FE-01–08 sequencing. Not contract-frozen or ready to connect to a live backend.
Pending: JJSA final product rules and AY1 versioned API/mock examples with explicit reconciliation; runtime tests and rendered QA.
Blockers to coding: explicit AY Gate 0 Release to Code; outstanding governance/development-environment conditions retained by AY; shared contracts for affected work.
Blockers to release: persistence/access/privacy/security and end-to-end evidence; AY acceptance; joint business release. No paid resources or live commercial hosting assumed.
Next action: AY1 and JJSA review section 1 and supply versioned contract artifacts through the canonical source. After AY clearance, first implement FE-01–03 against the approved schema/mock examples, then integrate FE-04–07.
No application code, infrastructure provisioning, production settings or deployment is included in this preparation commit.
