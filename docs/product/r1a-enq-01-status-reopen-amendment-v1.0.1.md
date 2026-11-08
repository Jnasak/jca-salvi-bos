# R1A-ENQ-01 — Product Contract V1.0.1 | Reopen and Ownership Semantic Correction

**Owner:** JJSA — Product Management & Product Strategy (JCA-side)  
**Date:** 8 November 2026 (WAT)  
**Status:** JJSA product-owner correction **issued for AY/AY1/AAY1 reconciliation**; **P-04 business-policy approval remains pending**.  
**Supersedes:** Only the conflicting reopen/ownership sentences in sections 4–5 of [Product Behaviour and Acceptance Contract V1.0](https://github.com/Jnasak/jca-salvi-bos/blob/b37c6035a15381f77a56c103038baa773cede892/docs/product/r1a-enq-01-product-contract-v1.0.md) (commit `b37c6035a15381f77a56c103038baa773cede892`).  
**Authority:** AY technical disposition dated 8 November 2026, SIA-06/DEC-12. The jointly approved enquiry-first reduced scope is unchanged.

## 1. Decision: deterministic terminal reopening

An authenticated principal with **server-confirmed workspace permission** may reopen a terminal record only with (1) a **nonblank reopen reason**, (2) the **expected enquiry revision**, and (3) a single **atomic, audited** mutation. If the expected revision does not match, reject the operation without a state change and return AY1's concurrency error; the UI retains the user's input for reconciliation.

| Current operational status | Owner at the instant of the authorised reopen | Reopened status | Resulting owner |
|---|---|---|---|
| `resolved` | JCA or Salvi | `in_progress` | Retain existing named owner |
| `resolved` | Unassigned (legacy/inconsistent record only) | `new` | Unassigned |
| `closed` | JCA or Salvi | `in_progress` | Retain existing named owner |
| `closed` | Unassigned | `new` | Unassigned |

The source V1.0 statement that `resolved → in_progress` is the only permitted reopened transition is **replaced** by the conditional table above. `in_progress` and `assigned` must never be unowned. No silent reassignment happens during a reopen.

## 2. Ownership clearing: precise rule

- **Normal resolution:** `in_progress → resolved` requires an existing JCA/Salvi owner and resolution disposition. **Retain the owner** as part of the closed-case history. Clearing an owner while an enquiry is `resolved` is **not a normal permitted user action**.
- **Direct closure:** `new → closed` is allowed without an owner, with required closure reason and audit; therefore `closed + unassigned` is a valid record. `assigned/in_progress → closed` keeps its named owner and requires closure reason.
- **Open-case deassignment:** An authorised principal may explicitly clear the owner of an **open** `assigned` or `in_progress` record only with a reason and expected revision. In the **same atomic mutation**, change operational status to `new`, set owner to Unassigned, and record before/after owner, status, actor, reason and time. Reject this change if an active follow-up would become ownerless; explicitly complete/cancel or reassign the follow-up as part of an approved controlled operation before deassignment.
- **Terminal deassignment:** Reject direct owner clearing from `resolved` or `closed`. To remove an owner, the authorised principal must **reopen with the retained owner to `in_progress`**, then deliberately deassign through the open-case rule (each action audited with a reason and expected revision); this avoids erasing terminal-case provenance. A previously unassigned `closed` record reopens to `new`; an unassigned `resolved` record is a defensive legacy-data case only, not a newly allowed normal resolution.
- **Reassignment:** When changing between JCA and Salvi on an open record, preserve its valid operational status, subject to the next-action ownership compatibility rule and revision/audit requirements. Do not allow an owner edit to bypass transition validation.

## 3. Follow-up and reporting invariants

- Neither `resolved` nor `closed` may retain an active open follow-up. Terminal transition requires explicit disposition of any outstanding follow-up, preserved in audit.
- Reopening does **not** automatically reopen completed follow-ups, invent a due date or generate an overdue action. A newly opened owned case without an active next action falls under V1.0's `needs_follow_up_planning` reporting rule. An unassigned `new` case appears in triage.
- AY1 must make the state/owner/revision/audit update transactional so partial updates cannot leave `in_progress` unowned or create contradictory follow-up/terminal states.
- Reporting remains derived from the **committed resulting state** using the V1.0 distinct-enquiry and WAT definitions, with no changes to reporting labels or counts.

## 4. Corrected allowed-transition summary

- `new → assigned` (requires named owner); `new → closed` (reason, owner may be Unassigned).
- `assigned → in_progress` or `closed` (reason for closure).
- `in_progress → resolved` or `closed` (reason/disposition; existing owner).
- `resolved → in_progress` if named owner; `resolved → new` **only for pre-existing unassigned/legacy** state.
- `closed → in_progress` if named owner; `closed → new` if unassigned.
- `assigned/in_progress → new` **only as the explicit, reasoned, atomic owner-clear action** described above.
- Operational `status` and separate `qualification` (`unassessed`, `qualified`, `not_qualified`, `hold`) stay distinct. Follow-up due/overdue remains calculated, not an operational state. No conversion/project creation is added.

## 5. Required negative and boundary tests

| Scenario | Expected outcome |
|---|---|
| Owned resolved record, correct revision + reason | Reopen `in_progress`, same owner, one audit event |
| Unassigned closed record, correct revision + reason | Reopen `new`, remains unassigned, one audit event |
| Unassigned legacy resolved record | Defensive recovery to `new`, never `in_progress` |
| Owned closed record | Reopen `in_progress`, owner retained |
| Missing/blank reason | Reject, no mutation |
| Missing/stale revision | Reject, no mutation; return conflict for UI reconciliation |
| Outsider/public/revoked user | Reject, no protected details leaked |
| Attempt direct owner clear on resolved/closed | Reject; no mutation |
| Attempt open-case deassign with active follow-up unresolved | Reject or require explicitly approved transactional disposition; no orphan action |
| Two simultaneous reopen requests with same expected revision | At most one succeeds; consistent audit and state |
| Reopen with no outstanding follow-up | No new follow-up auto-created; correct queue/report status |

These scenarios extend ENQ-T08/09/10 and UX-10/11; they do not change other ENQ-T01–13 acceptance contracts.

## 6. Decision status and handoff

**JJSA resolved the product-level semantic contradiction.** This document is not proof of principal approval. **P-04 remains pending** for the refined statuses, closure/reopen business rules and qualification distinction. P-01 (public category), P-02 (notice/retention), P-03 (shared access) also remain pending.

**AY1:** Implement this as the source product-rule contract in versioned API design; define response/error semantics, atomic updates and expected-revision requirements without silently approving business policy.

**AAY1:** Mark V1.0 reopen contradiction **resolved at product-specification level**; reconcile with AY1 versioned API examples; retain P-04 Pending and Gate 0 HOLD.

**AY:** Confirm cross-contract compatibility and address branch protection, local-development clearance and explicit RELEASE TO CODE separately.

**No application code, live deployment, commercial operation or production release is authorised by this amendment.**
