# Digital Product Creation Flow

> Template by Philip Scheer — philipscheer.github.io
> A stage-gated flow from idea to operation. Each gate is a decision: persevere, pivot or stop. Adapt the rigor to the bet size.

## Stage 0 — Opportunity framing

- Problem hypothesis written in one sentence
- Market/user evidence collected (data, interviews, competitors)
- Business case sketch: audience size, willingness to pay, strategic fit
- **Gate:** leadership agrees the problem is worth 2-4 weeks of discovery

## Stage 1 — Discovery

- User interviews / data analysis to validate the problem
- Solution sketches and prototype (Figma or throwaway code)
- Riskiest-assumption tests defined and run
- Technical feasibility spike (architecture options, build vs. buy, cost at scale)
- **Gate:** evidence the problem is real and the solution is feasible → PRD approved

## Stage 2 — Definition

- PRD finalized (see PRD template)
- Engineering `design.md` written: architecture, NFRs, cost target, rollout/rollback
- Scope cut to walking skeleton / MVP
- Squad staffed; roadmap with milestones, not dates-by-feature
- **Gate:** design review approved (ARB if architecture is significant)

## Stage 3 — Build

- Walking skeleton first: end-to-end thin slice in production behind a flag
- Weekly demo cadence; metrics instrumented as features are built
- Quality gates on every merge: tests, lint, security scan, review
- **Gate:** MVP complete, observability live, rollback tested

## Stage 4 — Launch

- Staged rollout: internal → beta cohort → % ramp → GA
- Success metrics vs. targets reviewed at each ramp step
- Kill criteria honored — stopping is a valid outcome
- **Gate:** targets met at GA scale

## Stage 5 — Operate & evolve

- Post-launch review: metrics vs. PRD targets, cost vs. budget
- Feedback loop into the backlog; tech debt budgeted explicitly
- Quarterly: does this product still earn its infrastructure cost?

---

*The flow is a checklist, not a bureaucracy: for small bets, a stage can be one conversation — but the gate question still gets asked.*
