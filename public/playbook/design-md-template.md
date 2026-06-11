# design.md — [Feature / System Name]

> Template by Philip Scheer — philipscheer.github.io
> Delete any section that does not apply. The document serves the delivery, not the other way around.

## 1. Context

What problem are we solving? Why now? Link to the business goal or metric this supports.

## 2. Objective

One paragraph: what success looks like when this ships.

## 3. Scope / Non-scope

**In scope:**
- ...

**Explicitly out of scope:**
- ...

## 4. Requirements

**Functional:**
- ...

**Non-functional (with targets):**
- Performance (e.g., P99 < ___ ms)
- Availability (e.g., ___ %)
- Security / compliance constraints
- Cost target (e.g., < $___/month at expected load; cost at 10x load: ___)

## 5. Proposed architecture

Describe the solution. Include or link a diagram (C4 level 2/3 recommended).

- Components and responsibilities
- Data flows
- External dependencies

## 6. Technical decisions

| Decision | Choice | Why |
|---|---|---|
| ... | ... | ... |

Significant decisions that outlive this project should become ADRs.

## 7. Alternatives considered

For each rejected alternative: what it was, why rejected.

## 8. Risks & trade-offs

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ... | ... | ... | ... |

## 9. Cross-cutting impact

- **Security:** ...
- **Performance:** ...
- **Data (privacy, migrations, retention):** ...
- **Operations (on-call, runbooks, observability):** ...

## 10. Test strategy

Unit / integration / e2e / load — what gets tested, where, and what gates the merge.

## 11. Rollout plan

Stages, feature flags, traffic ramp, communication. Who approves each stage.

## 12. Rollback plan

Concrete procedure. Verify migrations are backward-compatible. **Test the rollback, don't just write it.**

## 13. Success metrics

How we will know it worked — metric, target, when to evaluate.

---

*Owner: ___ · Reviewers: ___ · Status: draft / in review / approved · Last updated: ___*
