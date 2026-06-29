---
title: 'Tech Radar — The model is no longer the moat'
description: 'This edition: an open-weight model beating a frontier agent at a sixth of the cost, the return of tokenmaxxing as subsidies vanish, governments gating who can use the best models, coding agents quietly uploading your secrets, and two reminders that engineering discipline still wins.'
date: '2026-06-29'
tags: ['Tech Radar', 'AI engineering', 'FinOps', 'governance', 'engineering leadership']
---

The thread this week: the frontier model is no longer the moat. Capability is commoditizing fast, and the leverage is moving to what surrounds the model — cost per task, who is allowed to run it, what data your agents touch, and whether your pipeline is built like real software. Here is what I would put in front of an engineering leadership team this week.

## An open-weight model beat a frontier agent at a sixth of the cost

Semgrep ran open-weight models against its IDOR security benchmark and got a surprise: GLM 5.2, an open-weight model from Zhipu AI, scored 39% F1 on a bare prompt, beating Claude Code (32%) at roughly **$0.17 per vulnerability found** ([semgrep.dev](https://semgrep.dev/blog/2026/we-have-mythos-at-home-glm-52-beats-claude-in-our-cyber-benchmarks/)). Their own purpose-built harness still led at 53–61%, which was the actual point: most of the performance comes from the scaffolding, not the model.

**Impact for companies:** "which model" is no longer a one-time decision. The harness — endpoint discovery, context selection, output parsing — drives more of the result than the brand on the API key.

**Risks and opportunities:** the risk is vendor lock-in to an expensive frontier model when a cheaper open-weight one, run in your own environment, clears the bar. The opportunity is data sovereignty and cost control at the same time.

**My take:** invest in the harness, keep the model swappable, and benchmark on *your* task before you standardize. The cheapest path is rarely the most famous logo.

## Tokenmaxxing is "dead" — until compounding correctness brings it back

A sharp essay argues that the era of executives forcing token spend is ending as OpenAI and Anthropic, both eyeing IPOs, cut subscription limits and raise API prices — but a new incentive is replacing it: "compounding correctness," where running an agent in a loop reliably improves the output ([12gramsofcarbon.com](https://12gramsofcarbon.com/p/agentics-tech-things-tokenmaxxing)). The same piece notes OpenAI's GPT-5.6 preview (Sol, Terra, Luna) is out.

**Impact for companies:** the subsidy that made AI tooling feel free is over. Per-token economics now hit the P&L directly, and "run it in a loop until it's right" is an explicit spend strategy, not an accident.

**Risks and opportunities:** unbounded loops are unbounded bills. But for the right task — large migrations, overnight test generation — controlled looping on a cheap model can beat a single expensive call.

**My take:** budget tokens like cloud compute. Caps, dashboards, and a cost-per-outcome metric beat both blanket bans and blank checks.

## Governments are starting to decide who gets the best models

Reporting this week says the US lifted its block on Anthropic's most capable model, Claude Mythos 5, but only for roughly 100 vetted institutions, after earlier imposing export controls over jailbreak fears ([12gramsofcarbon.com](https://12gramsofcarbon.com/p/agentics-tech-things-tokenmaxxing), citing Semafor). OpenAI's GPT-5.6 is similarly launching as a limited preview cleared with the government first.

**Impact for companies:** access to the most capable models is becoming a regulated, allocated resource. Your AI roadmap now has a geopolitical dependency you do not control.

**Risks and opportunities:** the risk is building a strategy on a model that may be gated, throttled, or restricted by region. The opportunity belongs to teams whose architecture is model-agnostic and can degrade gracefully to whatever is actually available.

**My take:** treat top-tier model access as a supply-chain risk. Keep a portfolio, including open-weight options, so a policy decision in another country does not stall your delivery.

## Coding agents will happily upload your secrets

A long-running OpenAI Codex issue — with 450+ thumbs-up — documents that there is still no reliable way to stop the agent from reading and sending sensitive files like `.env`, keys, and credentials to the model, even when they are gitignored ([github.com/openai/codex](https://github.com/openai/codex/issues/2847)). Practitioners report that if the agent runs `grep` or `cat`, the contents go up regardless.

**Impact for companies:** every developer running an agentic CLI is a potential, unlogged data-exfiltration path for secrets and regulated data — a direct LGPD/GDPR exposure.

**Risks and opportunities:** the risk is silent leakage with no audit trail. The opportunity is to standardize now on tools with deterministic deny-lists and sandbox-level file exclusion, and make that a procurement criterion.

**My take:** a security-minded org needs an enforceable `.agentignore` and sandboxing, not a convention in a README. If the tool cannot guarantee a file never leaves the machine, it is not ready for your sensitive repos.

## Cloudflare spent six weeks on a four-line race condition

Cloudflare published a clinic on a truncation bug in the `hyper` Rust HTTP library: large responses intermittently arrived cut short with a misleading 200 OK, caused by a flush that was discarded before a premature socket shutdown ([blog.cloudflare.com](https://blog.cloudflare.com/hyper-bug/)). The fix was four lines; finding it took `strace` at the kernel level because application observability showed nothing wrong.

**Impact for companies:** an "improvement" that made one path faster surfaced a race condition that had hidden in a dependency for years. Your observability stack has blind spots below the application layer.

**Risks and opportunities:** the risk is trusting green dashboards while data is silently lost. The opportunity is investing in low-level tracing skills and in contributing fixes upstream rather than forking forever.

**My take:** when a bug is intermittent, scales with size, and vanishes under inspection, suspect timing in the connection layer. And keep someone on the team who is comfortable reading syscalls.

## "Model Training as Code" — treat the pipeline like software

Aleph Alpha described Savanna, a system that implements its entire model-training pipeline in code: hermetic, one-click runs, with composability, version-controlled consensus, and provenance via commit history and an artifact lineage graph ([aleph-alpha.com](https://aleph-alpha.com/en/blog/model-training-as-code/)). The win is organizational — teams stop coordinating over Slack and the filesystem and start collaborating on a durable artifact.

**Impact for companies:** the lesson generalizes well beyond ML. Any complex, multi-team process that lives "in people's heads" is fragile, unreproducible, and slow to onboard.

**Risks and opportunities:** the risk is tribal knowledge and lost lineage. The opportunity is the same discipline we already preach — trunk-based development, CI, immutable versioned artifacts — applied to your messiest workflows.

**My take:** if you cannot reproduce a result from a commit hash, you do not have a process, you have a ritual. Put the pipeline in code.

## A viral hiring tool gives the same résumé a different score every run

An engineer tested HackerRank's open-source résumé-screening agent and got scores from 66 to 99 for the *same résumé* across 100 runs — failing an 85 cutoff 65% of the time ([danunparsed.com](https://danunparsed.com/p/hackerrank-open-source-ats)). The "experience" category scored everyone 25/25 with a two-line, anchorless prompt; the detailed "projects" rubric was the noisiest.

**Impact for companies:** an LLM is excellent at parsing a résumé into structured data and terrible at the judgment call of scoring it. Using it for the latter quietly reintroduces the arbitrariness hiring teams spent decades removing.

**Risks and opportunities:** the risk is a non-deterministic luck filter that rejects strong candidates and exposes you to fairness and legal challenges. The opportunity is to use AI for extraction and matching, and keep judgment with humans.

**My take:** never let a model assign a score it cannot defend with a rubric. If the same input yields wildly different outputs, you are not screening — you are rolling dice.

## The trend to watch

Capability is getting cheap and abundant, while *control* — over cost, access, data, and reproducibility — is becoming the scarce, decisive resource. The teams that win the next year will not have the smartest model; they will have a model-agnostic architecture, enforceable governance over what agents can do and see, and the discipline to make it reproducible. Build the harness, govern the access, keep the model swappable.
                                                                                                                                                            