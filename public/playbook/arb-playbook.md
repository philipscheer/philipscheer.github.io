# Architecture Review Board (ARB) — Operating Playbook

> Template by Philip Scheer — philipscheer.github.io
> An ARB that works is a service to teams, not a tollbooth. Goal: better decisions, made faster, documented forever.

## 1. Purpose & scope

The ARB reviews decisions that are expensive to reverse:
- New services, platforms or significant third-party dependencies
- Cross-team contracts (APIs, events, shared data)
- Changes to security, compliance or data-privacy posture
- Anything with material cost impact (build or run)

Everything else: teams decide autonomously, guided by published standards.

## 2. Composition

- 3-5 standing members: senior engineers/architects across domains + security representation
- The proposing team ALWAYS presents — the ARB reviews, it does not design by committee
- Rotating guest seat for engineers to learn the process

## 3. Inputs (no document, no meeting)

- `design.md` or RFC circulated at least 48h before
- Cost estimate at current and 10x load
- Security & data-privacy impact section filled
- Alternatives considered, with reasons for rejection

## 4. The review (45 min, hard stop)

1. 5 min — context by the proposer (everyone has read the doc)
2. 25 min — questions and challenge, focused on risks and trade-offs
3. 10 min — decision: approve / approve with conditions / revise and return
4. 5 min — record the decision as an ADR, assign follow-ups

## 5. Decision rules

- Default to approval: the burden is on the ARB to show material risk
- Conditions must be specific and verifiable, with owners
- Disagreement is recorded in the ADR — dissent is information
- SLA: decision within one week of submission, or it escalates

## 6. Artifacts

- ADR per decision (see ADR template) in the architecture repo
- Public decision log — searchable by all engineers
- Quarterly: review ADRs that turned out wrong; update standards, not blame

## 7. Anti-patterns to refuse

- Reviewing code instead of decisions
- Architecture by seniority instead of by argument
- Gatekeeping routine work (that is what standards are for)
- Meetings without pre-read documents

---

*Health metric: time-to-decision and % of decisions teams say helped them. If teams route around the ARB, the ARB is the problem.*
