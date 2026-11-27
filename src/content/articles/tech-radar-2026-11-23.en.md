---
title: 'Tech Radar — The harness is where risk and cost live'
description: 'This edition: Claude Code’s "don’t ask again" rules leak secrets into public repos, QCon SF argues the harness matters more than the model, Google keeps credentials out of agent sandboxes, AWS Lambda gets GPUs, PostgreSQL 19 ships online repacking and Uber cuts cache memory by 90%.'
date: '2026-11-23'
tags: ['Tech Radar', 'AI engineering', 'agentic AI', 'DevSecOps', 'FinOps', 'serverless', 'databases', 'software architecture']
---

Most AI conversations still start with "which model?". This week's news says the better question is "what surrounds it?". Secrets leak through agent configuration files, benchmark scores move by double digits when only the harness changes, and cloud providers are competing on where credentials live, not on model quality. Meanwhile, the classic levers — database maintenance and memory efficiency — keep delivering measurable savings.

## Claude Code's "don't ask again" leaks secrets into public repos

Apiiro found that when developers approve a shell command with "Yes, and don't ask again", Claude Code stores it as a permission rule in `.claude/settings.local.json` — including any password or token embedded in the command. The firm identified 1,122 secrets in those files and another 1,160 in git history, shared settings and committed transcripts, across 63 organizations; GitGuardian later reported 31,088 secrets in the same file on public GitHub, 5,343 still valid ([infoq.com](https://www.infoq.com/news/2026/11/claude-code-leaking-secrets/)).

**Impact for companies:** agent configuration, memory files and transcripts are now a credential store nobody inventoried. Generic scanners such as gitleaks and TruffleHog missed many of these because the secrets sat inside shell commands.

**Risks and opportunities:** the risk is a quiet, organization-wide exposure that survives a `.gitignore` fix because it lives in history. The opportunity is cheap hygiene: add `.claude/settings.local.json` to every repo's own `.gitignore`, rotate anything that ever appeared there, and pass secrets through environment variables.

**My take:** this is not an AI problem; it is the oldest problem in the book — secrets in command lines — amplified by a tool that remembers everything. I would run a one-off scan of all repositories for agent files this week and add a pre-commit check. Fast to do, expensive to skip.

## QCon SF: the harness is the new operating system

In the QCon San Francisco opening keynote, Mad Labs CEO Manju Rajashekhar argued that the harness — context, tools, state, permissions, feedback loops — decides what an agent can do and how safely, more than the model does ([infoq.com](https://www.infoq.com/news/2026/11/harness-new-operating-system/)). The evidence: the same model scored 65.5% to 74.2% on one benchmark across eight harnesses, and LangChain lifted a model from 52.8% to 66.5% on Terminal-Bench 2.0 by moving skipped checks into the harness.

**Impact for companies:** when an agent underperforms, swapping vendors is the expensive reflex. Changing tools, context or feedback is usually cheaper and often more effective.

**Risks and opportunities:** the risk is treating approval prompts as a control — "a tired gatekeeper is a rubber stamp." The opportunity is engineering the boundaries: scoped credentials, isolation and explicit feedback that separates "tests failed" from "could not run".

**My take:** the compounding-error math in the talk is worth sharing with any executive: 20 steps at 95% each gives 36% end-to-end success. That is a reliability problem, and reliability is solved with engineering, not with a bigger model.

## Google keeps credentials out of the agent sandbox

Google announced Agent Compute Engine, a managed service that runs agents in isolated microVMs with checkpoint and restore, and keeps API keys and OAuth tokens outside the sandbox; an external Agent Gateway authenticates requests and injects secrets ([infoq.com](https://www.infoq.com/news/2026/11/google-agent-compute-engine/)). It is not available yet, has no published pricing and targets preview "in the coming months"; the open-source Agent Substrate runs on any Kubernetes.

**Impact for companies:** "no credentials inside the sandbox" is becoming a reference architecture, alongside AWS Bedrock AgentCore and Azure Foundry Agent Service.

**Risks and opportunities:** the risk is buying an announcement — boot time, price and density are still unknown. The opportunity is adopting the pattern now, on whatever platform you run: the harness holds identity, the sandbox only executes.

**My take:** read this next to the Claude Code story. One shows what happens when secrets live where the agent works; the other is the design that prevents it. I would put "where do agent credentials live?" on every architecture review checklist today, regardless of vendor.

## AWS Lambda now runs GPU inference

Lambda Managed Instances can now run Event Functions on EC2 G-series GPUs, with up to 48 concurrent invocations sharing one model copy per GPU and vLLM/SGLang base images that need no handler code ([infoq.com](https://www.infoq.com/news/2026/11/aws-lambda-gpu-managed-instances/)). Pricing is the EC2 On-Demand rate plus a 9.75% fee; early tests report an eight-minute publish, no response streaming and a default GPU vCPU quota of zero.

**Impact for companies:** event-driven inference — document processing, classification, queue workers — no longer requires operating a GPU cluster.

**Risks and opportunities:** the instance bills while the minimum environment count is above zero, scaling takes tens of seconds and Terraform support lagged at launch. The opportunity is a simpler path for batch and asynchronous workloads, with Savings Plans still applicable.

**My take:** "serverless" here means less operations, not pay-per-use. I would model the always-on cost before migrating, and keep streaming chat on dedicated instances. For queue-driven inference, it is a strong default.

## PostgreSQL 19: online repacking and plan control

PostgreSQL 19 introduces `REPACK ... CONCURRENTLY` to reclaim space without blocking reads or writes, plus `pg_plan_advice` and `pg_stash_advice` to influence query plans without code changes ([infoq.com](https://www.infoq.com/news/2026/11/postgresql-19-released/)). It also adds `WAIT FOR LSN` for read-your-writes on replicas, logical replication of sequences, near-2x faster bulk inserts in testing, and disables JIT by default.

**Impact for companies:** two classic operational pains — bloat requiring downtime and plan regressions requiring a deploy — get first-class tools.

**Risks and opportunities:** the JIT and MD5 changes can surprise upgrades. The opportunity is lower storage cost and fewer maintenance windows.

**My take:** I agree with the community advice — wait for 19.1 on critical systems. But start testing `REPACK CONCURRENTLY` in staging now; for many teams it removes the main reason to schedule maintenance windows.

## Uber cuts translation cache memory by up to 90%

Uber redesigned its Go translation cache into a hybrid: keys and hot values in memory, the rest on disk, across 256 shards ([infoq.com](https://www.infoq.com/news/2026/11/uber-go-translation-cache/)). One dataset went from roughly 800 MB to 80–120 MB, the hit rate stayed above 99.9% and p99 disk-backed misses stayed below 100 microseconds. An earlier change — replacing `sync.Map` with a plain map and RWMutex — improved CPU utilization by more than 30%.

**Impact for companies:** caching "everything in memory" is often paying for data nobody reads. Profiling found garbage collection consuming over 20% of CPU in some services.

**Risks and opportunities:** hybrid caches add complexity around refresh and warm-up; Uber preloads keys accessed in the last 15 minutes to avoid cold starts. The opportunity is right-sizing instances once memory stops being the constraint.

**My take:** this is the kind of FinOps I trust most — profile, measure access patterns, change the design. No new vendor, no new contract, just engineering.

## The trend to watch

The model is becoming a commodity input; the harness is the product. Where credentials live, what the agent can touch and how feedback flows will define both security posture and AI unit economics in 2027. Teams that treat the harness as architecture — reviewed, versioned and measured — will spend less and leak less than teams still shopping for the next model.
