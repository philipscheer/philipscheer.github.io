---
title: 'Agentic coding with governance: how my teams use Claude Code in production workflows'
description: 'AI assistants can ship real software — if you give them context, boundaries and quality gates. The operating model we use for AI-assisted development.'
date: '2026-06-10'
tags: ['Claude Code', 'agentic coding', 'AI engineering', 'code review', 'CI/CD']
---

There are two failure modes in AI-assisted development. The first is ignoring it and losing the productivity gain — measured in my teams, not marketing decks. The second is letting an agent loose on a codebase with no context and no gates, then spending the saved time debugging confident nonsense.

The answer to both is the same: treat AI-assisted development as an engineering discipline, with an operating model. Here is the one we use.

## 1. Context is infrastructure

An AI assistant is only as good as the context it can reach. We maintain a small set of files in every repository, treated as first-class deliverables:

- **`CLAUDE.md`** — how to work in this repo: conventions, commands, what never to touch, how to run tests.
- **`design.md`** — the current solution design for significant work in progress.
- **`architecture.md`** — the system map: services, boundaries, data flows.
- **`decisions.md` / ADRs** — why things are the way they are, so the agent does not relitigate settled decisions.
- **`tasks.md`** — what is in flight, granular enough for an agent to pick up a unit of work.

This is not bureaucracy — it is the same documentation a senior engineer would want on day one. The difference is that the AI reads all of it, every session, without onboarding cost.

## 2. Analysis before implementation

The single highest-value habit: **ask for an impact analysis before asking for a change.** "What would changing X affect? What are the risks? What tests cover this path?" The agent maps the blast radius in minutes — and you catch the dangerous assumption before it becomes a diff.

For anything non-trivial, the flow is: agent reads context → proposes a plan → human approves → agent implements → human reviews. The expensive part of software was never typing; it was deciding. Keep the deciding.

## 3. Small steps, real checkpoints

Agents are enthusiastic. Left alone, they will refactor the world. Our guardrails:

- **Small commits** with conventional messages — every step reversible.
- **One unit of work per session** — bounded scope, bounded damage.
- **Tests run before and after** — the agent writes or updates tests as part of the change, not as a favor.
- **No force-push, no schema changes, no dependency upgrades** without explicit human approval.

## 4. Review is non-negotiable

AI-generated code goes through the same pull request review as human code — often a stricter one, because the failure pattern is different. Humans make sloppy mistakes; models make plausible ones. Reviewers look specifically for: invented APIs, silently changed behavior at edge cases, and tests that assert what the code does rather than what it should do.

We also use AI on the other side: a review pass with the agent — security, performance, N+1 queries, error handling — before the human review. It catches the mechanical issues so humans can focus on design.

## 5. Measure the gain honestly

If you cannot show the productivity gain in delivery metrics — lead time, throughput, defect rate — you are guessing. We track time-to-merge and post-release defects for AI-assisted versus conventional work. The gains are real and significant, but they concentrate where context is good. Which closes the loop: the teams that invest in documentation get compounding returns from AI.

The pattern behind all five practices: **AI multiplies the quality of your engineering process.** Good process in, multiplied productivity out. Chaos in, multiplied chaos out.
