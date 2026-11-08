# R1A-ENQ-01 — Product Contract V1.0.2 | Follow-up Disposition and Validation Boundaries

**Owner:** JJSA — Product Management & Product Strategy  
**Date:** 8 November 2026 (WAT)  
**Status:** JJSA product semantic ruling for AY/AY1/AAY1 reconciliation; P-04 business acceptance remains pending. No coding or deployment authority.  
**Governing sources:** Product V1.0 at `b37c6035a15381f77a56c103038baa773cede892`; reopen amendment V1.0.1 at `c11023032dbda84de801cb44bf50320fe4ab98c4`; AY1 API proposal V0.1.2 at `7271b4bc027af4683aaff07ce1771384659a5d85`; AY 8 November cross-contract technical ruling.  
**Supersedes:** Only unfinished follow-up action disposition, replacement/removal, past-due-date and product validation semantics. EX-01 stays closed. Approved DEC-12 reduced release unchanged.

## 1. EX-02 — Completing versus cancelling active follow-ups

A follow-up action has the lifecycle `open` → `completed` **or** `cancelled`. These terminal action outcomes are **mutually exclusive**. Historical action records remain immutable except through separately authorised privacy procedures.

**Complete:** an action **actually performed**. Authorised actor records an outcome/description (3–1000 Unicode code points), and server derives `completed_at`, `completed_by`; `status=completed`. Completion does not imply employer/client reply or commercial acceptance. Do not permit completion without a real-world action and recorded outcome.

**Cancel:** the planned action **will not be performed**. Authorised actor supplies a specific reason (3–500 Unicode code points), server derives `cancelled_at`, `cancelled_by`; `status=cancelled`. Cancellation is not completion and cannot be reported as work performed. Reasons must be factual, not generated or silently inferred. Distinct terminal disposition and audit event are required.

**Parent enquiry transition:** `resolved` or `closed` cannot coexist with `open` follow-up. For the reduced release, **do not allow an implicit or combined closure-as-completion operation**. The user must explicitly complete or cancel the action first; a subsequent, revision-controlled enquiry transition records its own resolution/closure reason. If an open follow-up remains, reject terminal transition with a non-destructive `FOLLOW_UP_CONFLICT`. AY1 should remove the earlier proposed `active_follow_up_disposition:{action:"complete"}` implicit closure shape from the contract; a separate cancel mutation and cancelled status are necessary. This is bounded to already-approved follow-up lifecycle integrity, not a new reminder/workflow module.

**Direct owner clearing:** reject while any active follow-up is present; explicitly complete/cancel it first, then perform the owner-clear/status-reset mutation under V1.0.1. No side-effect cancellation. Reassignment of named principal while an active follow-up exists must not orphan or silently change the action owner; if reassignment would create mismatch, reject pending explicit action disposition and recreation under the new owner. AY1 owns authoritative route/error design.

## 2. EX-03 — Replacement, removal and dates

- Maximum **one** `open` follow-up per enquiry; past completed/cancelled actions are retained.
- **Replace next action:** cancel existing open action with reason, then create a new action with a fresh ID, named approved owner, summary and due date. Distinct revisioned/audited operations; no overwriting history. If the first mutation succeeds but second fails, cancelled history remains truthful and record appears as needing follow-up planning; UI must not imply replacement succeeded.
- **Reschedule same action:** when the intended action is unchanged, allow updating its due date only with an explicit reason, expected revision and audit of old/new date. Do not create a duplicate action or reset its owner/summary. A substantive change of next-action purpose uses replacement.
- **Remove:** do not hard-delete or hide a follow-up. Only cancellation with reason ends an unperformed action; completion ends a performed action. No delete API in this reduced release.
- **New scheduling/reschedule:** due date is a valid WAT calendar date `YYYY-MM-DD`, **today or future** relative to trusted server-side current WAT date. Reject a past date with a field-level error `Due date cannot be before today.` No implicit due times or 09:00 SLA.
- **Existing overdue actions:** preserve original past due dates and flag overdue; completion/cancellation remains possible after due date, and rescheduling can choose today/future with an auditable reason. Do not auto-complete or silently change old dates.
- **Historical actions:** no backdated creation or imported retrospective schedules in this first release; if essential later, propose separately reviewed migration/administrative capability.
- **Owner consistency:** an open follow-up's assigned owner must be an authorised principal and compatible with the current named enquiry owner; do not allow unassigned `new` records to receive an active action until assigned. Retain historical actor ownership as recorded even when later lead ownership changes.

## 3. Product validation boundary confirmation

**Unicode:** for name, optional organisation, description, follow-up summary/outcome and reason, trim leading/trailing whitespace, apply NFC Unicode normalization, then count **Unicode code points** rather than UTF-16 code units. The contracted numerical limits apply *after* normalization. Never truncate values silently. Internal space/newline preserved where allowed. Reject null bytes and unsafe control characters, allowing standard spaces and multiline description newlines. AY1 remains responsible for exact parser and safe rendering.

**Telephone:** accept one optional leading `+`; digits are ASCII `0-9`; permitted separators are ordinary ASCII space, `(`, `)`, hyphen and period. Count 7–20 digits after stripping separators. Reject letters, multiple/interior plus signs and unsupported characters. Do not guess country or silently rewrite a submitted number. Allow domestic Nigerian forms and international numbers without pretending syntactic validation proves number ownership or reachability. AY1 handles server canonicalization/storage and consistent frontend hints without changing the submitted business meaning.

**Reason fields:** owner assignment/reassignment, deassignment, status transitions/reopening, reschedule and cancellation use mandatory nonblank reason **3–500 NFC-normalized Unicode code points**. For status `new→assigned` the assignment reason covers the atomic transition. Qualification rationale retains V1.0/API proposal **3–1000**; follow-up completion outcome **3–1000**. Strip outer whitespace; reject all-whitespace values, over-limit, raw control characters; no silent placeholder or fabricated reason. Technical replay and operation keys remain AY1-owned.

**Date errors:** reject malformed dates such as `2026-02-30` and past dates at mutation time (server clock WAT authoritative). The calendar date may differ from UTC date by one day. No timezone-floating conversion to 00:00Z.

## 4. Additional acceptance fixtures (ENQ-T08/09/10)

| Scenario | Expected |
|---|---|
| Attempt terminal transition with open follow-up | 409/conflict, no mutation; explicit completion or cancellation required |
| Perform actual action, submit valid completion outcome | `completed`, actor/time/outcome persisted and audited |
| Cancel pending action with valid reason | `cancelled`, actor/time/reason persisted and audited; not counted completed |
| Attempt to mark unperformed action completed | Workflow prohibits; human review/audit needed to detect dishonest assertion |
| Attempt cancel without reason | Validation failure; unchanged action |
| Replace active action | Cancel then create new; old record retained, new ID/revision; at most one open |
| Reschedule active action due date | Same follow-up ID; changed due date and reason in audit |
| Try creating second open action | Reject; no duplicate next action |
| Try hard deleting follow-up | No supported route; reject |
| Create/reschedule with yesterday's WAT date | Reject; existing already-overdue action stays overdue |
| Submit WAT today near 23:00Z boundary | Correct WAT date used, not UTC calendar date |
| New unassigned lead creating follow-up | Reject until assigned |
| Open-case deassignment with active action | Reject without disposition; no orphan |
| JCA/Salvi reassignment while active action owner mismatch | Reject until action explicitly disposed |
| Emoji/astral Unicode and decomposed accented text at exact limits | NFC code-point counts consistent backend/frontend |
| Telephone with one leading plus and listed separators | Accept if digit count in range |
| Telephone with letters, two plus signs or unsupported symbols | Reject |
| Reason 2/3/500/501 code points after trim and NFC | Reject 2 and 501; accept 3/500 |

No executed QA or runtime acceptance is implied. AY1 to return revised API request/response examples and validate whether an additional documented cancel endpoint/status is compatible; AAY1 to reconcile exact latest version.

## 5. Remaining gates

- **Product exceptions EX-02 / EX-03:** resolved at JJSA **semantic-specification level only**, pending AY1 API change and AAY1 consumer reconciliation.
- **Validation:** product limits specified; AY1 must align the backend wire contract and implementation details.
- **FEX-01 / FEX-02:** AY1 owns principal-source and transition-target/conditional-input contract.
- **P-01 / P-02 / P-03 / P-04:** remain open with approved decision owners; do not silently approve.
- **T-02:** source-control governance and approved ₦0 development environment pending AY/JCA validation.
- **G-00 Gate 0 RELEASE TO CODE:** HOLD until AY explicitly authorises.
- **Production:** HOLD until AY technical acceptance + separate joint JCA–Salvi authorisation.

**Next:** AY1 make a bounded API contract amendment; AAY1 update only classifications changed by that amendment; AY issue final cross-contract ruling. Do not create another broad specification.
