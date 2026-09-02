# Lead Intelligence — MVP Architecture

## Product thesis

Build an intelligence layer between advertising channels and revenue operations. The MVP does not replace a CRM. It answers: **which leads deserve sales attention, why, and which marketing sources create revenue?**

## V1 scope

### Lead sources
- Meta Lead Ads / Instagram lead forms
- Google lead-form submissions
- Website forms
- CSV import for testing and onboarding

### Core pipeline

```text
Ad platforms / website
        |
        v
  Ingestion API
        |
        v
  Normalization
        |
        +--> duplicate / validity checks
        |
        v
 Qualification engine
   |            |
   |            +--> deterministic business rules
   +--------------> AI intent / requirement extraction
        |
        v
 Lead score 0-100 + reasons + confidence
        |
        +--> routing / priority
        |
        v
 Sales outcome
        |
        v
 Revenue attribution + model feedback
```

## Architecture principles

1. **Rules + AI, not AI alone.** Business eligibility rules remain deterministic; AI interprets messy language and unstructured answers.
2. **Explainability.** Every score has evidence/reasons. Never present an opaque claim that a person is “fake.”
3. **Outcome learning.** Qualified, contacted, opportunity, won/lost and revenue become feedback signals.
4. **Source-agnostic core.** Every integration maps into the same canonical lead/event model.
5. **Privacy by design.** Store only data required for the customer’s workflow; encrypt secrets and restrict access.
6. **Human override.** Sales teams can correct qualification and score outcomes.

## Proposed stack

- Frontend: Next.js + TypeScript
- API: Next.js route handlers/server functions initially
- Database: PostgreSQL
- ORM: Prisma
- Validation: Zod
- AI: model API behind an internal provider interface
- Auth: managed authentication provider, selected during implementation
- Background jobs: queue provider once webhook volume requires it
- Deployment: Vercel for web/API; managed Postgres

## Core entities

- `organizations`
- `users`
- `sources`
- `campaigns`
- `leads`
- `lead_events`
- `qualification_rules`
- `lead_scores`
- `assignments`
- `outcomes`
- `revenue_events`
- `integration_connections`

## Canonical lead fields

```text
id
organization_id
source
external_id
name
phone
email
location
language
raw_fields (JSON)
normalized_fields (JSON)
intent_summary
qualification_status
score
score_confidence
score_reasons (JSON)
created_at
updated_at
```

## Score model V1

Start transparent rather than pretending to have a trained predictive model:

```text
score = weighted combination of:
- business-rule fit
- stated requirement / intent
- location / serviceability
- contactability signals
- duplicate / suspicious-pattern signals
- source/campaign historical performance (when enough data exists)
```

The system must return **score + confidence + reasons**, not just a number.

## API surface V1

```text
POST /api/leads/ingest
POST /api/leads/import
GET  /api/leads
GET  /api/leads/:id
POST /api/leads/:id/requalify
POST /api/leads/:id/outcome
GET  /api/dashboard/summary
GET  /api/campaigns/performance
POST /api/webhooks/meta
POST /api/webhooks/google
```

## First success metric

A pilot customer should be able to answer, from one dashboard:

> “Which source/campaign generated the most **qualified opportunities and revenue**, not merely the most leads?”

## Explicitly out of scope for the first month

- Building a full CRM
- Autonomous ad-budget changes
- AI voice calling
- WhatsApp automation at scale
- Dozens of ad-platform integrations
- Guaranteed lead/fraud classification
- Training a custom foundation model
