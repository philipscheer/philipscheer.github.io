---
title: 'design.md: the document that aligns humans and AI before a line of code'
description: 'Why a lightweight design document became the highest-leverage engineering practice in my teams — and how it multiplies the quality of AI-assisted development.'
date: '2026-06-11'
tags: ['engineering practices', 'documentation', 'AI-assisted development', 'governance']
---

Most engineering failures I have seen in 20 years were not coding failures. They were alignment failures: the right code built for the wrong problem, the rollback nobody planned, the non-functional requirement everyone assumed someone else owned.

The cheapest fix I know is a `design.md` — a short design document that lives in the repository, next to the code it describes.

## What it is

A `design.md` answers, in one or two pages, the questions every stakeholder will eventually ask:

- **Context** — what problem are we solving, and why now?
- **Scope and non-scope** — what is explicitly out?
- **Functional and non-functional requirements** — including performance, security and cost targets.
- **Proposed architecture** — with a diagram when it helps.
- **Decisions and alternatives considered** — what we chose and what we rejected.
- **Risks and trade-offs** — what could go wrong, what we accepted consciously.
- **Test strategy, rollout plan, rollback plan** — how we ship safely.
- **Success metrics** — how we will know it worked.

If a section does not apply, you delete it. The document serves the delivery, never the other way around.

## When to write one

Not for every task. The trigger is irreversibility or blast radius: new services, schema changes, integrations with external systems, anything touching payments or authentication, anything that would take more than a sprint to undo. For a one-line fix, a good commit message is enough documentation.

## Why it matters more in the AI era

Here is what changed: your design document is no longer read only by humans. AI coding assistants — Claude Code and similar agentic tools — are remarkably good at implementing against a clear specification, and remarkably dangerous without one.

When an AI assistant has access to a `design.md`, it stops guessing your intent. It knows the architecture you chose, the alternatives you already rejected (so it does not "helpfully" reintroduce them), the non-functional constraints, and the rollback expectations. The same document that aligned your team now governs your tools.

In my teams, the rule is simple: **AI implements; the design decides.** An assistant can draft the `design.md` — it is often a great first-draft writer — but a human owns the decisions in it, and the document is reviewed before significant implementation starts.

## How it connects to ADRs

A `design.md` describes one solution end to end. An Architecture Decision Record captures one decision and its consequences. They compose: a design document typically generates one or two ADRs for the decisions that will outlive the project. The design doc is the story; ADRs are the precedents.

## Where to start

Pick the next non-trivial piece of work in your backlog and write the document before the first commit — thirty minutes, not three days. Review it with one stakeholder and one engineer. Then watch what happens to the pull request discussion: most of the architectural debate has already happened, in writing, where it is cheap.

A template to start from is available in my [Engineering Playbook](/en/playbook/).
