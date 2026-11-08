# JCA × Salvi Business Operating System

A shared operating system for managing business enquiries and operational lead tracking.

## Initial release scope

R1A-ENQ-01 — Integrated Business Enquiry Intake:

Public Enquiry → Persistent Lead Record → Owner Assignment → Follow-up → Status Tracking → Operational Reporting.

The integrated BOS enquiry form is the primary enquiry route.

## Technology baseline

- Next.js
- TypeScript
- Vercel
- Supabase Auth
- PostgreSQL

These technologies are selected for implementation. Their inclusion here does not establish that infrastructure is provisioned or functionality is complete.

## Access and data protection

- JCA and Salvi use separate authenticated accounts.
- Internal records are accessible only to authorised users.
- Public enquiry submission does not provide access to internal records.
- Submission success is displayed only after confirmed database persistence.
- Development and testing use synthetic records.
- Credentials, environment secrets, database exports and customer records must never be committed to this public repository.

## Source control

- Default branch: `main`
- Backend working branch: `feature/r1a-enq-backend`
- Frontend working branch: `feature/r1a-enq-frontend`

Working branches are established from the verified baseline. Changes follow pull-request review and applicable branch protections.

## Current status

Repository preparation is authorised.

Application implementation remains on hold until AY issues:

**SIA-06 / DEC-12 — GATE 0 RELEASE TO CODE**

Production release requires completed testing, AY technical acceptance and separate joint authorisation from JCA and Salvi.

No production readiness is claimed by this README.

## Scope boundaries

The initial release excludes client portals, payment processing, advanced analytics and unrelated business-management modules.

## Licensing

No software licence has been selected. Any licensing decision requires the applicable project-owner approval.
