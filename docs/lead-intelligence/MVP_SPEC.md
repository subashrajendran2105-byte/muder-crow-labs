# Lead Intelligence — MVP Product Spec

## User

A performance marketer, agency, or sales-led business running paid acquisition.

## Primary job

Turn raw leads into an actionable priority queue and connect marketing spend to qualified outcomes.

## Main screens

### 1. Overview
- Leads today / period
- Hot, warm, low distribution
- Qualification rate
- Response-time distribution
- Qualified opportunity rate
- Revenue attributed
- Campaign/source leaderboard
- Revenue-leak alerts

### 2. Leads
Columns:
- Lead
- Source/campaign
- Score
- Confidence
- Status
- Reason
- Owner
- Response time
- Outcome

Filters:
- score band
- source
- campaign
- date
- status
- language
- outcome

### 3. Lead detail
Show raw submission, normalized data, score factors, AI intent summary, timeline, owner, human corrections and outcome/revenue.

### 4. Campaign intelligence
For each source/campaign:
- spend (manual/import first)
- leads
- qualified leads
- opportunities
- wins
- revenue
- cost per qualified lead
- cost per opportunity
- ROAS where revenue and spend are available

### 5. Rules
Customer defines qualification criteria, e.g.:
- serviceable locations
- minimum budget
- required product/requirement
- language requirements
- working hours / availability

## Score UX

Use:
- `91` + “High confidence”
- 3–6 concise reasons
- “What would change this score?” when useful
- explicit “Insufficient evidence” state

Never use “fake person” as a definitive classification from a phone number or other single signal.

## Day-30 acceptance criteria

1. A customer can create an organization.
2. A customer can import a CSV of leads.
3. Leads are normalized and deduplicated.
4. Each lead receives a score, confidence and reasons.
5. Customer can configure basic qualification rules.
6. Customer can mark lead outcomes.
7. Dashboard aggregates qualification and outcomes by source/campaign.
8. Product works on a deployed URL.
9. Architecture leaves clean integration points for Meta and Google webhooks.

## Pilot strategy

Do not wait for perfect integrations before testing the value proposition. Start with CSV/manual import using real historical lead data. Compare the system's ranking against human qualification and eventual outcomes. Use this evidence to improve the scoring model before activating live ad-platform webhooks.
