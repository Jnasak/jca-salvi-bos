# R1A-ENQ-01 — Product Behaviour and Acceptance Contract V1.0

**Owner:** JJSA (JCA-side Product Management)  
**Date:** 8 November 2026 (WAT)  
**Status:** Product-owner specification for AY/AY1/AAY1 reconciliation; **NOT an API contract, Gate 0 clearance, or production approval**.  
**Parent baseline:** PRD V1.3-R1 + jointly approved R1A-ENQ-01 V0.1 + DEC-12 (8 November 2026).  
**Source reference:** `docs/product/r1a-enq-01-product-contract-v1.0.md` on `docs/r1a-enq-product-contract`.  
**Frontend reconciliation:** `docs/frontend/r1a-enq-01-integration-readiness.md` on `feature/r1a-enq-frontend` at `e44e3d690c82cbf5d371931e92347241dc7849ec`.

**Authority boundary:** JCA and Salvi remain the only collaboration principals; AY is the JCA-side accountable implementation owner. This document resolves product semantics for the *approved reduced release* only. AY1 owns wire schemas, URLs, HTTP codes, API errors and persistence implementation. AY owns security, architecture, deployment gates and Gate 0. JCA and Salvi approve externally published service wording, privacy/legal processing, material commercial-policy changes and production release.

## 1. Release boundary

**Must demonstrate:** Public Enquiry → Confirmed Persisted Lead → Assignment → Follow-up → Status Tracking → Operational Reporting, secured and auditable. This is an enquiry-first operating slice, **not** the complete original R1A suite. Preserve R-001–R-011 identifiers and defer the unselected finance, projects, timesheet, knowledge and R1B/R2 capabilities per DEC-12. No client portal, payments, recruiter workflow, live proposals or guaranteed response-time claims.

### Terminology

- **Enquiry:** public submitted request, initially unassigned; **Lead:** the persisted CRM representation of an enquiry. They share one record identity in the reduced release, not duplicate CRM entities.
- **Submitted:** persistence confirmed. It does **not** mean assigned, qualified, accepted, contracted or acknowledged by a human.
- **Owner:** one of JCA / Salvi or Unassigned; the public visitor cannot set or infer owner.
- **Qualified:** a separate commercial assessment outcome. It does **not** equal Won/Contracted.
- **Follow-up due/overdue:** **derived indicators**, not mutable enquiry stage labels.

## 2. Enquiry field contract (public-facing meaning)

| Canonical logical field | Label | Required | Rule (product level) |
|---|---|---|---|
| `full_name` | Full name | Yes | Trim outer whitespace; 2–120 Unicode characters after normalisation; internal spaces allowed |
| `email` | Email address | Yes | Trim; valid single email address; <=254 characters; do not silently alter local-part spelling |
| `phone` | Phone number | Yes | Trim; accept Nigerian and international numbers; 7–20 digits after removing accepted separators/leading +; reject letters; do not invent country or rewrite unrecognised number |
| `organisation_name` | Organisation / business name | No | Trim; 0–160 characters; blank becomes absent |
| `service_category_id` | What do you need help with? | Yes | Exactly one **active, approved** category ID; value from server-approved category list; no free-text ID |
| `description` | Tell us about your enquiry | Yes | Trim; 10–3000 characters; multiline supported; render as text, not HTML |
| `privacy_acknowledged` | Required acknowledgement associated with approved notice | Yes | Must be affirmatively checked; not preselected; approved notice version/date is recorded server-side |

Product limits above are **JJSA's proposed V1.0 detailed implementation thresholds**, not terms independently approved in the original DEC-12. AY may propose technical refinements; material UX/business effects require JJSA review.

Server-owned, non-public fields: enquiry/lead ID, received-at timestamp, source=`bos_public_enquiry`, notice version, verification/processing metadata, operational status, qualification, owner, version, audit history and follow-up records. **Do not accept trusted server fields from the public request.** No resume upload, salary, government ID, employer confidential data or sensitive demographic fields in this release.

**Field error copy:** “Enter your full name.” / “Enter a valid email address.” / “Enter a valid phone number.” / “Choose an enquiry type.” / “Please add a little more detail (at least 10 characters).” / “Please acknowledge the privacy notice.” Keep a neutral submission error: “We could not confirm your enquiry was received. Please try the advised recovery step.” Never expose internal record contents in public errors.

## 3. Service category decision

**Business taxonomy is not approved in supplied DEC-12 evidence.** Do not copy JIDP's nine-service list or invent commercial offerings.

**Data contract:** `id` (stable, non-reused), `display_label`, `active`, `display_order` (ascending), `effective_from` optional; exactly **one** active selection required. Store category ID **and label-at-submission** in the record so later renames do not rewrite history.

**Implementation-safe product decision:** build against a configurable reference list with a single **synthetic fixture** `general_enquiry` / “General business enquiry” for tests and mock views. **Public enablement remains BLOCKED** until JCA and Salvi expressly approve either this label or a list of actual categories. An inactive/missing category is rejected with a specific field error. No automatic "Other" open text in V1.0.

## 4. Internal ownership and visibility

- On successful public submission: `owner = unassigned`, `operational_status = new`, `qualification = unassessed`; no auto-routing.
- Either authenticated **authorised** principal may assign/reassign to JCA or Salvi within the approved shared workspace; server membership, not user-supplied identity strings, determines authority. Reassignment retains previous/new owner, actor, time and revision.
- Both principals may view the shared enquiry workspace only per the approved cross-principal permissions. **No access** to private allocations, other unrelated records or secrets. Public visitors cannot list/read/update/delete an enquiry after submission merely by knowing its receipt.
- Unassigned enquiries appear in the work queue for both authorised principals; assigning does not imply acceptance or commercial eligibility.
- Edit/update must reject stale revision rather than silently overwrite newer changes; UI retains safe unsaved input and offers reconciliation.

**Approval dependency:** AY must ratify the complete server-side role/record-access matrix and session/reauthentication treatment before code dependent on permissions is accepted.

## 5. Operational status and qualification — canonical model

Keep **operational status** distinct from **commercial qualification**. This prevents overloaded source V0.1 terms (Qualified, Not Qualified, Hold and Follow-up) from behaving as unrelated pipeline states.

**Operational status:** `new` → `assigned` → `in_progress` → `resolved` or `closed`; reopening returns `in_progress` if owned, otherwise `new`.

| State | Meaning | Entry rules / exits |
|---|---|---|
| `new` | Stored, untriaged enquiry | Created on persistence, unassigned; may assign, or close with reason |
| `assigned` | A named principal owns triage | Requires valid owner; may move to in_progress or close with reason |
| `in_progress` | Contact/qualification/follow-up ongoing | Requires owner; may resolve or close with disposition |
| `resolved` | Enquiry-specific request answered/handled | Requires disposition and actor; reopen allowed with reason |
| `closed` | No active work expected | Requires closure reason and actor; reopen allowed with reason |

Allowed normal transitions: new→assigned, new→closed; assigned→in_progress, assigned→closed; in_progress→resolved, in_progress→closed; resolved→in_progress; closed→in_progress (owned) or new (unassigned). Reassignment may occur while assigned/in_progress, not as a public action. Terminal→reopen requires a reason; all transitions append immutable audit events. For any transition to assigned/in_progress, owner must be present. If owner is cleared while open, return to new and record reason. A closed/resolved record is excluded from open/follow-up due counts.

**Qualification outcome** (separate field): `unassessed`, `qualified`, `not_qualified`, `hold`. Setting an outcome requires a reviewer and recorded rationale; `not_qualified` and `hold` do **not** automatically close the operational enquiry. No automatic opportunity Won/Contracted or project creation.

**Crosswalk to historic proposed labels:** Under Review→assigned/in_progress; Follow-up→open record plus due action; Qualified/Not Qualified/Hold→qualification outcome; Converted→not a V1.0 operational state (deferred R-005 conversion); Closed→closed. This is a bounded **JJSA product refinement requiring explicit AY compatibility review**, not an assertion that earlier proposed labels were already approved.

## 6. Follow-up contract

- Follow-up is a **separate task/action** linked to one enquiry; one enquiry may have multiple historical actions but at most one currently designated **next active action** in the reduced release.
- Required when scheduling: owner (JCA/Salvi), next-action summary 3–500 characters, WAT due **calendar date** (`YYYY-MM-DD`), status `open`.
- Completion records completion actor, timestamp and optional outcome (<=1000 characters); retain original due date and history, no silent deletion.
- Rescheduling requires actor, prior date, new date and reason; completed follow-up is not reopened silently.
- **Due today:** open action with due_date = current WAT calendar date. **Overdue:** open action with due_date < current WAT date. Future: open action with due_date > current WAT date. No invented 9am due time or per-hour SLA.
- An enquiry may be open but have no scheduled next action: show as **Needs follow-up planning**, not overdue. New/unassigned enquiries appear in triage queue.
- Resolved/closed enquiry cannot have an active open follow-up without an explicit close/complete disposition; server rejects contradictory updates.
- Timestamps are stored with unambiguous offsets/UTC and formatted as WAT for users. AY1 owns exact serialisation.

## 7. Reporting contract (record-derived)

**Default reporting period:** rolling current WAT calendar day for “New today”; aggregate queue counts as at server-provided `as_of` (not limited by a start date). Optional date range, if exposed, uses inclusive WAT calendar dates for submission-based measures only.

**Count distinct enquiry IDs** for enquiry-based measures; do not count each follow-up or audit event as a new lead.

| Metric | Definition |
|---|---|
| `new_today` | Distinct enquiries with received_at in current WAT calendar day |
| `unassigned_open` | Not resolved/closed; owner unassigned |
| `assigned_jca_open` | Not resolved/closed; owner JCA |
| `assigned_salvi_open` | Not resolved/closed; owner Salvi |
| `needs_follow_up_planning` | Open enquiry, assigned, no active next action |
| `follow_ups_due_today` | Number of **open follow-up actions** due on today's WAT date (at most 1 per enquiry in R1A) |
| `follow_ups_overdue` | Number of **open follow-up actions** with due_date < today WAT |
| `qualified_open` | Distinct open enquiries with qualification=qualified |
| `closed_total` | Distinct enquiries in closed (not resolved) as at `as_of` |
| `resolved_total` | Distinct enquiries in resolved as at `as_of` |

All metrics are based on **authorised, persisted records**. The backend returns the server `as_of` timestamp, timezone basis and applied scope/filter; no UI-calculated authoritative total. Enquiry counts must reconcile to the queue/detail; exclude private finance and unrelated protected data.

## 8. Submission truthfulness, retries and messages

- Public submit may confirm **only after committed persistent storage**; notification delivery is not a prerequisite.
- One logical request with the same idempotency identity creates at most one enquiry; a replay returns the same safe receipt, with no second lead.
- If server/storage outcome is unknown to the browser, show **“We cannot yet confirm receipt”**, not guaranteed success or failure. Retain safe input and follow AY1's agreed query/recovery path.
- Public receipt may expose only a non-authorising confirmation reference, received timestamp and generic next-step wording. **No full CRM ID, owner, eligibility judgement or guaranteed response time.**
- Rate limits/anti-abuse, input sanitisation, safe server error contracts, TTL and replay mismatch handling are **AY/AY1-owned engineering decisions**; frontend must consume AY1's versioned contract rather than invent endpoints or status codes.
- **Success copy:** “Your enquiry has been received. Keep your reference for follow-up.” (only after persistence-confirmed receipt).
- No implied email, WhatsApp or guaranteed response time. Dashboard indicator is sufficient for first release; external notifications need separate approval.

## 9. Validation / acceptance matrix

| Test | Minimum product acceptance |
|---|---|
| ENQ-T01 | Public form accessible signed out; display JCA `08165942310` / `tel:+2348165942310` and Salvi `08134253351` / `tel:+2348134253351` |
| ENQ-T02 | Every required field, limits and category-active check enforced server-side; labelled errors and keyboard focus |
| ENQ-T03 | Valid submission produces one durable lead, source identity, submission time and protected notice-version record |
| ENQ-T04 | Storage failure/unknown outcome never displays false success |
| ENQ-T05 | Retry/replay/concurrency does not create an unintended second enquiry; payload mismatch handled explicitly |
| ENQ-T06 | Public/outsider/revoked identities cannot list/read/update protected enquiry data even by direct API/record-ID attempt |
| ENQ-T07 | Separate JCA and Salvi sign-in and approved shared visibility operate; expired session cannot mutate |
| ENQ-T08 | Assign/reassign and state changes obey transitions, revision concurrency and audit |
| ENQ-T09 | WAT due-today/overdue and follow-up complete/reschedule rules reconcile at Sunday/Monday and date boundaries |
| ENQ-T10 | Queue and aggregate counts match persisted source records; multiple historical follow-ups do not inflate lead counts |
| ENQ-T11 | UX-01–UX-11 checks: error/empty/loading states, focus, keyboard, 360–1440px layout, contrast and zoom |
| ENQ-T12 | Release candidate URL/commit/environment match tested build; no secrets in public repo |
| ENQ-T13 | End-to-end persisted submit→authenticated retrieval→owner→next action→status→report verified; AY technical acceptance and separate JCA+Salvi release decision |

**Evidence record per test:** source SHA, environment (no credentials), synthetic fixture, steps, expected/actual results, reviewer, severity, screenshot/log when useful, retest disposition. Unexecuted = NOT TESTED, never PASS.

## 10. Contract freeze and unresolved approval gates

| Gate | Owner | Freeze condition |
|---|---|---|
| **P-01 Public category wording** | JCA + Salvi | Written approval of `general_enquiry` label or actual permitted category list; cannot enable public form before this |
| **P-02 Privacy statement and retention** | JCA + Salvi, AY technical advice | Approved notice text, version, collection purpose, retention/deletion and lawful processing basis |
| **P-03 Shared access policy** | JCA + Salvi, AY implementation | Both-principal access/assignment rule and server-side enforcement ratified |
| **P-04 Product status semantics** | JJSA; JCA + Salvi confirm material business rules | Approve refined operational/qualification distinction and closure reasons if it affects business practice |
| **T-01 API/schema contract** | AY1; AY ruling | Versioned request/response, error, auth, list, mutation, concurrency, reporting and safe retry examples |
| **T-02 Infrastructure/governance** | AY/JCA | Branch protection, approved zero-cost environment and access/privacy technical conditions |
| **G-00 Release to Code** | AY | Explicit technical clearance citing source refs, no inferred coding authority |
| **G-03 Production release** | AY technical; JCA + Salvi joint business | Tested live candidate and separate release approvals |

**Status at authoring:** JJSA product semantics **specified for reconciliation**. P-01/P-02/P-03/P-04 require proper approval; T-01/T-02 and G-00 remain pending. **No assertion of frozen cross-contract alignment or authority to build.**

## 11. Source lineage

1. PRD V1.3-R1 — parent review candidate, including R-001–R-011 and future R1B/R2.
2. R1A-ENQ-01 V0.1 / ENQ-FR-01–12 / AC-01–14 — JCA+Salvi-approved reduced product scope through DEC-12 on 8 November 2026.
3. JJSA final field/status/ownership recommendations and ENQ-T01–13 — preparation records from 8 November 2026.
4. AAY1 Frontend Integration Readiness at `e44e3d6` — contract consumer requirements and UX-01–11.
5. **This document V1.0** — exact product-level choices for reconciliation; not AY1's API design or AY's Gate 0 verdict.

**Required next action:** AY1 returns a versioned API contract; AAY1 records Aligned / Exception / Pending by contract row; AY rules on cross-contract consistency and Gate 0 separately.
