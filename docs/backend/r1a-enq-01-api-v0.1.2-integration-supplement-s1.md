# R1A-ENQ-01 — API V0.1.2 Supplement S1: Selector and Transition Metadata

Date: 8 November 2026 (WAT)
Owner: AY1
Status: Documentation-only contract proposal for AY/AAY1 reconciliation. No implementation, executed tests, contract freeze or Gate 0 authorisation.
Branch: feature/r1a-enq-backend.

## 1. Baseline, authority and precedence

Preserved technical baseline: [API V0.1.2](https://github.com/Jnasak/jca-salvi-bos/blob/7271b4bc027af4683aaff07ce1771384659a5d85/docs/backend/r1a-enq-01-api-contract-v0.1.md), exact commit 7271b4bc027af4683aaff07ce1771384659a5d85.
Product: V1.0 at b37c6035a15381f77a56c103038baa773cede892 plus V1.0.1 at c11023032dbda84de801cb44bf50320fe4ab98c4.
Consumer: AAY1 readiness matrix Sections 1.2/1.3 at 1917dd5bde7f6bb562820b5f6f366c1fb12fefb7.
Authority: AY's 8 November Cross-Contract Technical Ruling supplied in the programme correspondence.

AY accepts compatibility in principle and closes EX-01 at product/API specification levels. This supplement supplies FEX-01/FEX-02 contracts and applies AY's interim follow-up safety ruling. Where the preserved baseline suggests same-transaction follow-up completion on terminal transition, THIS supplement takes precedence: reject any terminal transition involving an open follow-up. No automatic completion, deletion or cancellation. Do not accept active_follow_up_disposition during the interim restriction. The historical baseline is unchanged.

Wire contract_version remains r1a-enq-api-v0.1; S1 is a documentation supplement, not a released consumer version. Proposed metadata additions require AY acceptance before freeze. Pending P-01–P-04 and EX-02/03 are not approved by this file.

## 2. FEX-01 — Authorised assignable-principal source

GET /api/internal/assignable-principals?lead_id={opaque lead ID}&purpose={lead_owner|follow_up_owner}

- Requires verified session, active BOS membership and authorised access to the specified lead. lead_id and purpose are required; invalid/missing values return 422 VALIDATION_FAILED.
- Source: server-controlled principal_memberships joined to approved principal identity configuration in the same BOS workspace. Only active, principal-approved JCA/Salvi identities eligible for the requested action may appear. No public Auth user directory, email matching, display-name inference or hardcoded client IDs.
- Server applies actor permissions, purpose, current record state and relevant assignment rules before returning items. No assignment ability => 403 ACCESS_DENIED; terminal-owner editing unavailable => 409 TRANSITION_NOT_ALLOWED. Missing/out-of-scope lead => non-enumerating 404 NOT_FOUND.
- items entries: {id:string,display_name:string}. id is the actual approved provisioned principal UUID at runtime. No emails, Auth metadata, tokens or unrelated memberships.
- No identities have been provisioned by this documentation; examples below use non-runtime synthetic IDs. An approved principal lacking an active provisioned membership must not be fabricated into the list.
- Response: {ok:true,contract_version,data:{items:Principal[],can_clear_owner:boolean},meta:{as_of:UTC timestamp,timezone:"Africa/Lagos",scope:string,lead_id:string,lead_revision:positive integer,purpose:enum}}.
- can_clear_owner is true only for purpose=lead_owner when actor can deassign a currently owned assigned/in_progress lead and no open follow-up remains. It is false for terminal/new records and follow_up_owner. Clearing is a distinct explicit UI choice, not a fake principal entry.
- Follow-up replacement/reassignment options remain restricted to operations explicitly defined by the baseline; do not infer a follow-up owner-edit endpoint from this list. If compatibility rules cannot be safely determined pending EX-03, the dependent action stays unavailable rather than guessing eligibility.
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

## 3. FEX-02 — Permitted target and conditional-input source

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

Every metadata result is actor-, scope-, state- and revision-specific. Return only operations permitted under the current approved policy; pending business gates may disable dependent operations. allowed_actions remains coarse UI information. action_metadata supplies target/input choices, and server enforcement remains authoritative.

Constraint vocabulary: type=string|integer; required=true; trim=true for reasons; min_code_points/max_code_points; minimum=1 for revisions; enum array for literal permitted strings; source={path:string,purpose:enum} for owner choices. Values use baseline NFC/code-point proposals pending JJSA validation. No executable expressions or client-authored permission predicates.

Deterministic semantic target matrix, SUBJECT to actor permission, policy gates and open-action guard:

| Current state | Ownership | Candidate operation | Required business input in addition to expected_revision |
| --- | --- | --- | --- |
| new | unassigned | assigned via PATCH owner | eligible owner_id; reason |
| new | unassigned | closed via POST transitions | reason |
| assigned | named | in_progress via POST transitions | none |
| assigned | named | closed via POST transitions | reason |
| in_progress | named | resolved or closed via POST transitions | reason (resolution disposition when resolved) |
| resolved | named | in_progress via POST transitions | reason |
| resolved | unassigned legacy only | new via POST transitions | reason |
| closed | named | in_progress via POST transitions | reason |
| closed | unassigned | new via POST transitions | reason |
| assigned/in_progress | named | new via PATCH owner with owner_id=null | reason; no open follow-up |

For resolved, the reason is the textual resolution disposition; no extra disposition object is introduced. Reopening does not accept owner replacement. new→assigned is offered only via the owner route to ensure atomic assignment/status/audit. Open named-owner reassignment uses that same owner route and preserves status. Unexpected ownerless assigned/in_progress is inconsistent data: do not offer a target that hides corruption; return no mutation options and require authorised recovery review.

Terminal and open-deassignment options are omitted whenever any active open follow-up exists. Terminal records with an open follow-up are inconsistent: expose no mutation options until authorised recovery review; never silently repair by reopening/completing. Even if a stale client submits a target/disposition, the transaction rejects with 409 FOLLOW_UP_CONFLICT. Completion must reflect work actually performed; do not instruct a user to falsely complete an action to bypass this guard.

Reasons: baseline proposed 3–500 NFC Unicode code points, trim, nonblank; revision positive integer. in_progress from assigned has no product-required reason; omit reason from required_fields (do not invent a mandatory rationale). Other exact limits and phone/Unicode policy remain JJSA/AY1 review items.

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

For owner assignment, field_constraints.owner_id={type:"string",required:true,source:{path:"/api/internal/assignable-principals?lead_id=synthetic-lead-a&purpose=lead_owner",purpose:"lead_owner"}}. The clear-owner variant uses enum:[null] with type:"null" (additional constraint type for this explicit variant only) and available=true; it requires owner_id,expected_revision,reason. Never conflate it with a missing owner_id.

Unassigned closed/legacy resolved reopen metadata substitutes target_status enum ["new"]; owner remains null. Returned operation metadata revision must equal lead.revision; mixed snapshots are invalid and must not enable controls. AAY1 retains edit inputs on conflict, refreshes detail and options, and asks for deliberate reconciliation.

## 4. Interim terminal guard response and examples

POST transitions to closed or resolved with an active follow-up:
HTTP 409, no state/audit/revision change; no follow-up deletion/completion.

```json
{
  "ok":false,
  "contract_version":"r1a-enq-api-v0.1",
  "error":{
    "code":"FOLLOW_UP_CONFLICT",
    "message":"An open follow-up prevents this status change.",
    "request_id":"synthetic-follow-up-conflict-a",
    "retry":"refresh_record"
  }
}
```

Reject active_follow_up_disposition as an unsupported field (422 VALIDATION_FAILED) during this interim contract. It cannot trigger completion/cancellation. For a request without that unsupported field but with an open action, return the 409 above. No new cancellation endpoint is introduced.

Baseline Section 12.2 supplies full reopen success, 422 validation, 409 revision and 403 access examples. Those remain valid, subject to this supplement's guard. Requests always include expected_revision and X-BOS-Operation-Key; missing/invalid revision =>422, stale valid revision=>409, no session=>401, nonmember=>403, out-of-scope lead=>404. Mutation permission/eligibility is always rechecked, including retries.

## 5. Bounded verification inventory — NOT EXECUTED

- FEX-T01: principal source excludes inactive, unapproved, outsider and other-workspace identities; empty list handled; no email/token disclosure.
- FEX-T02: revocation or ownership change after selector load rejected at mutation; no cached-list authority.
- FEX-T03: exact target metadata for all V1.0.1 owner/status cases; reason/revision conditions; no terminal clear; no automatic follow-up.
- FEX-T04: any open follow-up removes terminal/deassignment options; stale submissions reject atomically; unsupported disposition cannot complete/cancel.
- FEX-T05: record/action_metadata revisions coherent; competing edits conflict; authorised replay remains idempotent.
- FEX-T06: no required reason invented for assigned→in_progress; resolved reason stores resolution disposition; invalid/null/missing owner distinctions enforced.
- FEX-T07: FE-06 keyboard-labelled selectors, explicit empty/blocked states and retained edit input; actual rendered UX remains untested.

## 6. Handback and open decisions

FEX-01/FEX-02: contract definitions supplied for consumer review, not runtime acceptance or unilateral final freeze.
EX-01: CLOSED per AY technical ruling; no further JJSA reopen redesign requested.
EX-02/03: Pending JJSA bounded decisions; product branch inspected at c110230 on 8 November 2026 and contains no later follow-up decision. No inference that JJSA has not prepared a decision elsewhere.
Validation: Unicode/phone/reason limits remain explicit proposed engineering boundaries in the preserved baseline; JJSA/AY1 confirmation pending.
AAY1: reconcile API 7271b4b PLUS this supplement, recording only changed dispositions.
AY: accept/revise FEX definitions, then final cross-contract ruling; branch governance and approved zero-cost environment remain separate conditions.
P-01–P-04 separately tracked. GATE 0 RELEASE TO CODE and production remain HOLD. No executable files, infrastructure provisioning, real-data operation or expenditure.
