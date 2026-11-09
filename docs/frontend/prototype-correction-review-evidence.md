# Full-site prototype corrections — independent acceptance evidence register

Activity/review handoff date: 9 November 2026 (WAT).
Prepared by: AAY1. Status: SUBMITTED FOR REVIEW; independent acceptance PENDING.
This is an evidence register for existing corrections, not a new requirements baseline or prototype expansion.

## Pinned source and separate workstreams
- Published journeys: https://jca-salvi-bos-full-prototype.futureclay2.chatgpt.site/#acceptance
- Full-site prototype: Site version 3; source commit `22a47da1ceaa51f5f651051a217aca1f42b67ba2`.
- Prototype source locations: `dist/priorities.js` (UI/handlers), `dist/priority-model.js` (pure rules), `tests/priorities.cjs` (rule checks); `docs/priority-correction-acceptance.md` (original bounded check record), in the **separate Site source repository**.
- The appended source extracts below preserve the exact pure model and test definitions for review without importing the broad prototype application into executable R1A.
- PRD: JCA × Salvi BOS V1.3-R1, the supplied source-lineage document. Its review-candidate status is retained; prototype exploration does not approve its full implementation.
- R1A frozen sources remain Product b37c603 / c110230 / 9aba094, API 8075b3e, frontend matrix §1.6 at 5104e8e; wire `r1a-enq-api-v0.1`. Full-prototype patterns do not override that slice.

Scaffold agreement already posted: https://github.com/Jnasak/jca-salvi-bos/issues/1#issuecomment-6737754129
First R1A frontend consumer milestone: https://github.com/Jnasak/jca-salvi-bos/pull/3 at `3d442a2a2aabcd8407ffebdbc848eff109bd1af9`.
Its ten synthetic consumer tests are separate from the prototype checks below. Neither establishes backend persistence or permissions.

## Evidence language and review responsibility
- **Observed:** AAY1 executed the described browser actions and inspected the rendered result.
- **Rule-tested:** the appended Node assertions passed against the pinned pure model.
- **Source-inspected:** a handler/guard exists; the corresponding rendered case has not necessarily run.
- **Not executed:** expected result is a review case, not a PASS.

The prior checks are implementer evidence. Durable screenshots/video for every case and independent replay are not yet assembled. No viewport matrix, full accessibility acceptance, security penetration test or independent specialist verdict is claimed.

Named review responsibilities requested by the handoff: **AY** technical acceptance; **JJSA** business semantics and PRD traceability; **AY1** backend/integration corroboration. Their acceptance remains pending. **AAY1** owns prototype corrections. BE-01 backend corrections belong to **AY1**. These are requested review roles, not claims that reviews have taken place.

## KN-01 — General knowledge creation
**PRD:** R-009; §H. **Start:** JCA principal preview; Knowledge; browser-local synthetic dataset. Fixture: title “QA knowledge review journey”, content “Synthetic decision and evidence for knowledge review.”
**Journey:** New knowledge record → enter title/content, source, owner/type, date and optional links → Save → Open record.
**Expected / observed success:** a private Draft reopens with metadata and no implicit client publication. **Observed.**
**Validation:** leave title/content empty; expect linked required-field feedback without a new record. **Not executed in this correction check.**
**Blocked action:** approved records are not editable through draft editing; a revision is required. **Source-inspected; rendered negative case pending.**
**Recovery:** cancel incomplete form and reopen without creating a record. **Independent execution pending; unsaved-draft persistence is not promised.**
**Reviewer / disposition:** AY + JJSA requested; PENDING. **Correction owner:** AAY1.
**Exception:** file/evidence attachments are references, not upload/storage functionality.

## CRM-01 — Organisation and contact reuse
**PRD:** R-003/R-005; §E. **Start:** seeded Example Studio organisation and contact exist.
**Journey:** Organisations & contacts → New organisation → enter “Example Studio” → Save → observe duplicate flag → Cancel → Open existing organisation; add/edit contact and link it from lead context.
**Expected / observed success:** existing organisation is reusable by stable ID. Existing record opened; **Observed.** Add/edit-contact and lead relink handlers are **Source-inspected**, not fully rendered in the recorded correction check.
**Validation / blocked action:** duplicate Example Studio rejected with its existing reference; no silent merge. **Observed** and **Rule-tested** for trimmed/case-normalised equality.
**Recovery:** cancel duplicate creation and use existing record. **Observed.**
**Reviewer / disposition:** AY + JJSA requested; PENDING. **Correction owner:** AAY1.
**Exception:** approximate/fuzzy duplicate detection is not implemented; only normalised exact-name and per-organisation email checks.

## CRM-02 — Eligibility/conflict clearance and communications
**PRD:** Journey 1; R1B communication-history scope. **Start:** JCA preview; Example Studio clearance Pending.
**Journey:** Open organisation → Record JCA clearance → Cleared + “DEMO-CLEARANCE-QA” + fictional rationale → Save. Open related lead → Log communication → channel/direction/date/summary/outcome/next action.
**Expected / observed success:** synthetic clearance recorded. **Observed.** Communication timeline handler **Source-inspected**, rendered success pending.
**Validation:** mismatched organisation/contact must be rejected; future dates cannot be recorded as completed communications. **Source-inspected; rendered cases pending.**
**Blocked action:** Salvi cannot record the JCA clearance decision; pending/conflicting accounts cannot become contracted opportunities. **Source-inspected**; missing-clearance contract guard **Rule-tested**.
**Recovery:** correct invalid input/reuse the correct linked record without discarding unrelated lead status or follow-up. **Independent execution pending.**
**Reviewer / disposition:** JJSA + AY requested; PENDING. **Correction owner:** AAY1.
**Exception:** clearance is an attestation to synthetic evidence; it does not independently verify real account rights. Logging sends no message.

## COM-01 — Proposal, agreement and linked project
**PRD:** R-004/R-005/R-013; Journey 2. **Start:** eligible synthetic organisation, assessed opportunity, no conflicting proposal version.
**Journey:** Draft “QA linked proposal” with scope, acceptance, schedule and terms → Under Review → Approved → Sent (channel/evidence) → Accepted → Record linked agreement with “DEMO-AGREEMENT-QA”, designated fictional signatory and “DEMO-SIGNED-EVIDENCE” → assess/mark linked opportunity Won → Convert to project.
**Expected / observed success:** draft/review/approval/sent/accepted sequence and agreement recording **Observed**. Existing conversion UI had earlier been exercised, but a new complete browser conversion after the added agreement guard was **not re-executed**. Do not combine those checkpoints into a full end-to-end PASS.
**Validation / blocked action:** no skipped Draft→Sent; no contract conversion without qualification, clearance and a signed agreement for that exact opportunity. **Rule-tested**. Mandatory commercial input/evidence handlers **Source-inspected**.
**Recovery:** duplicate conversion should navigate to its existing project; proposal revision creates another version and retains prior evidence. **Source-inspected; current rendered replay/revision tests pending.**
**Reviewer / disposition:** JJSA + AY; AY1 for integration, all requested/PENDING. **Correction owner:** AAY1.
**Exceptions:** no actual document signature or external proposal send. State transitions record fictional evidence only. Commercial approval policy requires specialist assessment.

## ONB-01 — Onboarding and explicit publication
**PRD:** Journey 3; R-017. **Start:** synthetic project with checklist/publication Pending.
**Journey:** project → Update onboarding → confirm scope, lead, inputs/access and kick-off → enter 2026-11-09 plus “DEMO-KICKOFF-QA” notes → Save → Publication decision → Approved + “DEMO-PUBLICATION-QA” + explicit audience/reason.
**Expected / observed success:** checklist and kick-off saved; publication is a distinct decision. **Observed.**
**Validation:** completed kick-off needs date and notes; a future kick-off cannot be completed. **Source-inspected; rendered negative cases pending.**
**Blocked action:** publication with incomplete checklist and invitations without approved project publication are rejected by handlers. **Source-inspected; independent rendered checks pending.**
**Recovery:** fix incomplete checklist then deliberately request publication again. Revocation removes explicit sharing. **Source-inspected; independent replay pending.**
**Reviewer / disposition:** AY + JJSA requested; PENDING. **Correction owner:** AAY1.
**Exception:** neither checklist completion nor publication creates a real invitation or authenticated access grant. Sequencing policy needs semantic acceptance.

## KN-02 — Knowledge governance
**PRD:** R-009; §H; R-017. **Start:** KN-01 draft in JCA preview.
**Journey:** Open record → Under Review + reason → request Approved without evidence → see rejection → supply “DEMO-REVIEW-QA-001” → Save → filter Approved. Publication/sharing and new revisions are distinct controls.
**Expected / observed success:** approval with evidence and Approved filter retrieval. **Observed.**
**Validation / blocked action:** Draft offers no direct Approved target; approval without evidence is rejected. **Observed**, with transition guard also **Rule-tested**.
**Recovery:** supply missing evidence after the failed approval and save the existing record. **Observed.**
**Additional cases:** internal publication, client-shareable access class/project publication guard and immutable prior revision lineage **Source-inspected**; full rendered sharing/revision/revocation cases **Not executed**.
**Reviewer / disposition:** JJSA + AY requested; PENDING. **Correction owner:** AAY1.
**Exception:** implementer records approval evidence; real reviewer identity and permissions are not enforced by a server.

## REP-01 — WAT reporting and denominators
**PRD:** R-020; §M. **Start:** synthetic records; choose an inclusive WAT reporting period; undated imported events remain unknown.
**Journey:** Reports → choose From/Through → Apply → inspect numerator/denominator, definitions and warnings → record approved capacity for the same period/principal → record sample method/result/evidence.
**Expected / observed success:** proposal cohort displayed 1/1 following the recorded synthetic agreement; definitions/warnings rendered. **Observed.** Capacity/sample input handlers **Source-inspected**, complete rendered entry sequence pending.
**Validation / blocked action:** reversed periods rejected by UI handler; zero denominators display “—”; unverified/undated/future-cut-off receipts excluded; cancelled tasks excluded; opportunity assessments and membership acceptance/activity handled separately. **Rule-tested** where covered by appended assertions; reversed-period rendered test pending.
**Recovery:** correct period and apply; unknown historic dates remain excluded with warnings rather than being invented. **Source-inspected**, independent replay pending.
**Reviewer / disposition:** JJSA metric definitions + AY technical review; AY1 future server aggregates, requested/PENDING. **Correction owner:** AAY1.
**Exceptions:** same-version proposal cohort convention, imported assessment date exclusions, and current invitation-state use need explicit review. Historical membership-state reconstruction is not implemented. Capacity is only a recorded synthetic approval, not independently verified.

## BE-01 — Real backend controls
**PRD:** R-001/R-010/R-014–R-019; §§I/K.
**Start/journey:** AY1-approved application environment, genuine separate principal sessions, data/persistence and negative-access fixtures.
**Expected:** protected read/write/download authorisation, tenant isolation, durable transactional persistence/idempotency, secure files, audit and continuity evidence.
**Actual:** not implemented or tested by this full-site prototype. Browser-local records and identity switching are simulations.
**Success / validation / blocked / recovery:** **PENDING AY1 executable evidence and independent review**; no prototype result substitutes for them.
**Reviewer:** AY final technical ruling; AY1 implementation/evidence. **Disposition:** HOLD for operational claims. **Correction owner:** AY1.
**Exceptions:** real customer data, production credentials/deployment and unapproved database/security modifications remain outside this handoff.

## Common acceptance gate
For each ID, reviewers must record their name, source version, starting conditions, fixture, steps, expected/actual result and PASS / CORRECTION REQUIRED / HOLD disposition, with correction owner and unresolved exception. Capture appropriate screenshot/log evidence. Unexecuted cases stay pending; do not treat the existing “ready for review” label as independent acceptance.
Responsive 360/390/768/1024/1440, keyboard/focus, zoom/contrast and recovery regression are still pending as a complete matrix.
No further prototype expansion is requested or performed by this document.

## Reproducible pure-rule evidence
The following two blocks are evidence-only copies from the pinned separate Site source. Recreate the shown relative file paths in an isolated temporary directory and run `node tests/priorities.cjs`. This does not run the BOS application and does not access any backend.

### dist/priority-model.js
SHA-256: `8475e45797b8afcceb7dc68b7bae1f5b5a3befe75b4236c5a474beef69090dc2`

```javascript
'use strict';
// Pure rules shared by the prototype and its acceptance checks.
const BOSRules={
 normalise:s=>String(s||'').trim().normalize('NFC').toLowerCase(),
 day(date){if(!date)return '';if(/^\d{4}-\d{2}-\d{2}$/.test(date))return date;const d=new Date(date);if(Number.isNaN(d.getTime()))return '';const p=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);return ['year','month','day'].map(k=>p.find(x=>x.type===k).value).join('-');},
 dateIn:(date,start,end)=>!!BOSRules.day(date)&&BOSRules.day(date)>=start&&BOSRules.day(date)<=end,
 proposalTargets:{Draft:['Draft','Under Review'],'Under Review':['Under Review','Draft','Approved','Rejected'],Approved:['Approved','Sent','Superseded'],Sent:['Sent','Accepted','Rejected','Superseded'],Accepted:['Accepted','Superseded'],Rejected:['Rejected','Superseded'],Superseded:['Superseded']},
 knowledgeTargets:{Draft:['Draft','Under Review'],'Under Review':['Under Review','Draft','Approved'],Approved:['Approved','Superseded','Archived'],Superseded:['Superseded','Archived'],Archived:['Archived']},
 requireTransition(map,from,to){if(!map[from]?.includes(to))throw Error('This transition skips a required review step.');},
 requireContract(o,org,agreement){if(!o.qualified)throw Error('Record opportunity qualification first.');if(org?.clearance!=='Cleared')throw Error('JCA must record eligibility and account-conflict clearance first.');if(!agreement||agreement.status!=='Signed'||agreement.opportunityId!==o.id||!agreement.evidence)throw Error('Link a signed agreement with evidence for this opportunity first.');},
 duplicateOrganisation(orgs,name,except){return orgs.find(o=>o.id!==except&&BOSRules.normalise(o.name)===BOSRules.normalise(name));},
 metric(n,d){return d?Math.round(n/d*100)+'%':'—';},
 report(s,start,end){const within=d=>BOSRules.dateIn(d,start,end),assessed=s.opportunities.filter(o=>within(o.assessedAt)&&o.qualificationOutcome!=='unassessed'),qualified=assessed.filter(o=>o.qualified),proposals=s.proposals.filter(p=>within(p.sentAt)),converted=proposals.filter(p=>s.agreements.some(a=>a.proposalId===p.id&&a.status==='Signed'&&a.signedAt&&BOSRules.day(a.signedAt)<=end)),tasks=s.tasks.filter(t=>within(t.due)&&t.status!=='Cancelled'),onTime=tasks.filter(t=>t.status==='Done'&&t.completed&&t.completed<=t.due),invoices=s.invoices.filter(i=>i.status==='Issued'&&within(i.due)),due=invoices.reduce((n,i)=>n+i.amount,0),cash=invoices.reduce((n,i)=>n+i.receipts.filter(r=>r.status==='Verified'&&r.verifiedAt&&BOSRules.day(r.verifiedAt)<=end).reduce((x,r)=>x+r.amount,0),0),time=s.times.filter(t=>within(t.date)),hours=time.reduce((n,t)=>n+t.hours,0),capacity=s.reportingCapacity?.filter(c=>c.start===start&&c.end===end)||[],completenessHours=time.filter(t=>capacity.some(c=>c.person===t.person)).reduce((n,t)=>n+t.hours,0),expected=capacity.reduce((n,c)=>n+c.hours,0),accepted=s.invites.filter(i=>i.acceptedAt&&BOSRules.day(i.acceptedAt)<=end),active=accepted.filter(i=>i.state==='Active'&&i.expires>=end&&within(i.lastActiveAt)),samples=s.accuracySamples.filter(a=>within(a.date)),passed=samples.filter(a=>a.result==='Pass');return {assessed,qualified,proposals,converted,tasks,onTime,invoices,due,cash,time,hours,completenessHours,expected,accepted,active,samples,passed};}
};
if(typeof module!=='undefined')module.exports=BOSRules;

```

### tests/priorities.cjs
SHA-256: `f28719d006767316ab1dabb227f1b80568952fe8ff41b6e82f93f1f8c49ef93f`

```javascript
const assert=require('node:assert/strict');
const R=require('../dist/priority-model.js');
assert.equal(R.day('2026-11-09T23:30:00Z'),'2026-11-10');
assert.equal(R.dateIn('2026-11-09T23:30:00Z','2026-11-10','2026-11-10'),true);
assert.equal(R.duplicateOrganisation([{id:'1',name:' Example Studio '}],'example studio').id,'1');
assert.equal(R.duplicateOrganisation([{id:'1',name:'Example Studio'}],'Example Studio','1'),undefined);
assert.throws(()=>R.requireTransition(R.knowledgeTargets,'Draft','Approved'));
assert.doesNotThrow(()=>R.requireTransition(R.knowledgeTargets,'Under Review','Approved'));
assert.throws(()=>R.requireTransition(R.proposalTargets,'Draft','Sent'));
assert.throws(()=>R.requireContract({id:'O',qualified:true},{clearance:'Pending'},{status:'Signed',opportunityId:'O',evidence:'e'}));
assert.throws(()=>R.requireContract({id:'O',qualified:true},{clearance:'Cleared'},{status:'Signed',opportunityId:'OTHER',evidence:'e'}));
assert.doesNotThrow(()=>R.requireContract({id:'O',qualified:true},{clearance:'Cleared'},{status:'Signed',opportunityId:'O',evidence:'e'}));
const s={opportunities:[{assessedAt:'2026-11-09',qualified:true},{assessedAt:null,qualified:true},{assessedAt:'2026-11-09',qualified:false}],proposals:[{id:'P1',sentAt:'2026-11-09'},{id:'P2',sentAt:'2026-10-01'}],agreements:[{proposalId:'P1',status:'Signed',signedAt:'2026-11-09'},{proposalId:'P1',status:'Signed',signedAt:'2026-11-09'}],tasks:[{due:'2026-11-09',status:'Done',completed:'2026-11-09'},{due:'2026-11-09',status:'Cancelled'},{due:'2026-11-09',status:'To do'}],invoices:[{status:'Issued',due:'2026-11-09',amount:100,receipts:[{status:'Verified',amount:25,verifiedAt:'2026-11-08'},{status:'Verified',amount:30,verifiedAt:'2026-11-10'},{status:'Unverified',amount:10},{status:'Verified',amount:5}]},{status:'Issued',due:'2026-11-20',amount:900,receipts:[]}],times:[{person:'JCA',date:'2026-11-09',hours:2},{person:'Salvi',date:'2026-11-09',hours:8}],reportingCapacity:[{person:'JCA',start:'2026-11-09',end:'2026-11-09',hours:4}],invites:[{state:'Active',expires:'2026-12-01',acceptedAt:'2026-11-08',lastActiveAt:'2026-11-09'},{state:'Active',expires:'2026-12-01'},{state:'Revoked',expires:'2026-12-01',acceptedAt:'2026-11-08',lastActiveAt:'2026-11-09'}],accuracySamples:[{date:'2026-11-09',result:'Pass'},{date:'2026-11-09',result:'Fail'}]};
const x=R.report(s,'2026-11-09','2026-11-09');
assert.equal(x.assessed.length,2);assert.equal(x.qualified.length,1);
assert.equal(x.proposals.length,1);assert.equal(x.converted.length,1);
assert.equal(x.tasks.length,2);assert.equal(x.onTime.length,1);
assert.equal(x.due,100);assert.equal(x.cash,25);
assert.equal(x.hours,10);assert.equal(x.completenessHours,2);assert.equal(x.expected,4);
assert.equal(x.accepted.length,2);assert.equal(x.active.length,1);
assert.equal(x.samples.length,2);assert.equal(x.passed.length,1);
assert.equal(R.metric(0,0),'—');
console.log('PASS: 26 assertions: WAT boundaries, duplicate records, review gates, contract linkage, cohort/receipt/capacity/adoption/sample denominators.');

```
