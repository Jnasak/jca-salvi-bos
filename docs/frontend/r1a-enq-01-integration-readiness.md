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
