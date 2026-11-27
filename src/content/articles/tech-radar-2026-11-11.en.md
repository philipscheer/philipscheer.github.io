---
title: 'Tech Radar — Hygiene is now a cost and performance lever'
description: 'This edition: Google measures how stale TODOs derail coding agents, Entire bets on a Git forge built around eval scores, Google Cloud spend caps reach GA, Pinterest swaps a clustering pipeline for a fine-tuned 4B model, Cloudflare Basin ships open analytics with zero egress, and six Git CVEs meet Dependabot pausing on dormant repos.'
date: '2026-11-11'
tags: ['Tech Radar', 'AI engineering', 'agentic AI', 'technical debt', 'FinOps', 'data platforms', 'DevSecOps', 'software supply chain']
---

The most useful news this week is not about bigger models. It is about the unglamorous work around them: cleaning the context agents read, putting hard limits on what they can spend, choosing the smallest model that does the job, and patching the tools everything depends on. Hygiene is now a line item in cost and delivery speed.

## Google: stale TODOs send coding agents on side-quests

Google engineers analysed traces from hundreds of millions of agent steps and found that about 13% of sessions exposed agents to inline `TODO/FIXME` bug references; in 6% of those, the agent acted on the referenced bug, usually without being asked ([infoq.com](https://www.infoq.com/news/2026/11/google-agent-distraction/)). Those detours added 70% more steps, 77% more tokens and 105% more wait time. A scanner agent that removes obsolete references has cleaned up thousands of them, with over 95% acceptance from human reviewers.

**Impact for companies:** every stale comment, outdated spec and dead ticket reference is now context an agent reads and bills you for.

**Risks and opportunities:** the risk is scope creep at machine speed — agents "fixing" closed or unrelated bugs inside an unrelated change. The opportunity is that cleanup is now measurable: you can tie it to token spend and cycle time instead of arguing about it in a retro.

**My take:** this is the best argument for documentation hygiene I have seen in years, because it comes with a number. Before buying more agent seats, I would run a cheap scan for TODOs pointing to closed tickets and for docs nobody has touched in a year. Fewer distractions is the cheapest model upgrade available.

## Entire: a Git forge built around eval scores, not PR timelines

Entire, led by former GitHub CEO Thomas Dohmke, launched a Git forge designed for human–agent collaboration ([infoq.com](https://www.infoq.com/news/2026/11/entire-git-forge-coding-agents/)). Its core idea, "trails", replaces the PR timeline with eval scores for quality, security and "slop" that update on every push, plus configurable gates that block the merge until all findings are resolved.

**Impact for companies:** the review process is becoming the bottleneck of AI-assisted delivery, and vendors are now competing to redesign it. Expect "merge confidence" metrics to become a standard feature.

**Risks and opportunities:** a new forge means migration cost and lock-in risk, and eval scores produced by agents can create false confidence. The opportunity is the concept itself: repeated evaluation runs and explicit merge gates can be adopted on the platform you already use.

**My take:** I would not migrate repositories for this. I would steal the idea: define what "safe to merge" means for agent-authored code — tests, security scan, scope check — and enforce it as a gate.

## Google Cloud spend caps reach GA — with real limits

Google Cloud made spend caps on billing budgets generally available: once a monthly budget is reached, new usage of the capped service in that project is blocked without deleting resources ([infoq.com](https://www.infoq.com/news/2026/11/google-cloud-spend-caps/)). GA adds an API, enforcement based on estimated live costs for AI services, and automatic monthly resets. Caps only cover the Gemini API, the Agent Platform, Cloud Run and Cloud Run functions, and overages during enforcement delays are still billed.

**Impact for companies:** a runaway agent loop or a leaked API key can now be stopped by the platform, not just by an alert someone reads on Monday.

**Risks and opportunities:** the scope is narrow — per project, per service, per month, at list price — and it does nothing for a forgotten GPU instance. The opportunity is to wire caps into project provisioning so every sandbox is born with a ceiling.

**My take:** I prefer an error to a surprise five-figure bill. Use caps on sandboxes and experiments by default, keep production on alerts plus anomaly detection, and set the cap below your true limit, as Google itself advises.

## Pinterest: a fine-tuned 4B model replaces a clustering pipeline

Pinterest replaced its multi-stage user-journey clustering pipeline with a fine-tuned 4-billion-parameter Qwen3 model, reporting 1.1% higher email click-through and 1.3% more push opens ([infoq.com](https://www.infoq.com/news/2026/11/pinterest-journey/)). Training data was generated synthetically with frontier models; the team tested sizes from 0.6B to 8B and picked 4B for its quality-to-throughput balance. One of the biggest efficiency gains came from skipping users whose journeys were generated in the last couple of days.

**Impact for companies:** the pattern is replicable — use a frontier model to create training data, then serve a small open-weight model you control.

**Risks and opportunities:** fine-tuning and self-hosting move operational burden onto your team (GPUs, serving stack, evaluation). The upside is predictable unit cost and the ability to retire brittle multi-stage pipelines.

**My take:** the detail I like most is "avoid unnecessary inference". Before optimising the model, optimise when you call it. And benchmark the smallest model first — the biggest one is rarely the right business decision.

## Cloudflare Basin: open analytics with zero egress

Cloudflare made Basin generally available: a serverless analytics platform on Apache Iceberg and R2 that combines ingestion with SQL transformation, managed catalog and distributed SQL queries, with no egress fees ([infoq.com](https://www.infoq.com/news/2026/11/cloudflare-basin-analytics/)). Data stays readable by any Iceberg-compatible engine, such as DuckDB, Snowflake or Spark.

**Impact for companies:** for mid-sized data needs — too big for spreadsheets, too small for a warehouse contract — there is now a low-operations option built on open formats.

**Risks and opportunities:** the platform is young, and features such as real-time processing and stronger sovereignty controls are still on the roadmap. The opportunity is architectural: open table formats plus free egress make the query engine replaceable.

**My take:** the real news is Iceberg, not Cloudflare. If your data lives in an open format, vendor choice becomes a pricing decision rather than a migration project. That is the position I want any data platform to be in.

## Six Git CVEs, and Dependabot goes quiet on dormant repos

The Git project released fixes for six vulnerabilities, including code execution during recursive clones of malicious repositories and memory corruption when processing merges or binary patches ([github.blog](https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/)). The recommendation is to update to Git 2.56.1 or the patched maintenance release, including copies bundled in tools and CI images. Separately, from December 8 GitHub will turn off Dependabot alerts on most repositories with no activity in the past year, archiving existing alerts ([github.blog](https://github.blog/changelog/2026-11-10-dependabot-alerts-will-pause-on-inactive-repositories)).

**Impact for companies:** build agents, self-hosted runners and any service that clones or merges untrusted content are directly exposed.

**Risks and opportunities:** the risk is a dormant repo whose code still runs, now without alerts. Organisations with an enforced security configuration keep alerts on — a good reason to adopt one.

**My take:** patch runner images this week, not next sprint. Then use the Dependabot change as a forcing function: archive what is truly dead, and enforce alerts on everything that still ships.

## The trend to watch

AI amplifies whatever state your engineering system is in. Clean context makes agents cheaper; stale context makes them wander. Hard spending limits turn incidents into errors. The teams that win the next year will not be the ones with the most agents, but the ones with the cleanest repositories, the clearest gates and the tightest cost controls.
