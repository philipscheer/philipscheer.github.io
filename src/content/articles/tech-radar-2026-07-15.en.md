---
title: 'Tech Radar — The tower keeps rising'
description: 'This edition: a 27B model that runs on a phone, a Cursor zero-day that went unfixed for seven months, coding CLIs quietly uploading your home directory, an essay on why vibecoded systems drift apart, Oracle downgraded over its AI buildout, and data as the price of admission.'
date: '2026-07-15'
tags: ['Tech Radar', 'AI engineering', 'security', 'FinOps', 'engineering leadership']
---

The thread this week: capability keeps racing ahead while the foundations underneath it — security, trust, coordination, and economics — quietly fall behind. Models now fit on a phone, agents rewrite codebases before anyone can object, and money is being borrowed against a future that hasn't arrived. The tower keeps rising; the question is whether anyone still understands how it holds together. Here is what I would put in front of an engineering leadership team this week.

## A 27B model now runs on your phone

PrismML released Bonsai 27B, which it calls the first 27B-class model that runs on a smartphone. The 1-bit variant is 3.9 GB — small enough for an iPhone — and the ternary variant is 5.9 GB for laptops, both claiming multi-step reasoning, tool calling and agentic workflows at roughly 14× less memory, 8× faster and 5× less energy than a standard 16-bit model ([prismml.com](https://prismml.com/)). The same week, Apple's new on-device SpeechAnalyzer API was benchmarked as competitive with Whisper ([get-inscribe.com](https://news.ycombinator.com/best)).

**Impact for companies:** the default assumption that serious AI means a datacenter round-trip is breaking. Real inference on the device changes latency, cost per request, and — most importantly — where regulated data has to travel.

**Risks and opportunities:** the opportunity is data sovereignty and near-zero marginal cost for workloads that fit locally. The risk is fragmentation: a fleet of on-device models is far harder to version, evaluate and govern than one API endpoint.

**My take:** for any feature touching personal or regulated data, on-device is now worth a serious look before you sign another usage-based contract. Keep the model swappable and benchmark on your own task — density claims are marketing until they clear your bar.

## A Cursor zero-day sat unfixed for seven months

Mindgard published a full-disclosure report on a Cursor vulnerability: on Windows, opening a repository that contains a malicious `git.exe` in its root causes the IDE to execute it automatically — no click, no prompt, repeatedly — because Cursor's Git path resolution searches the workspace itself. That is arbitrary code execution with zero interaction. It was reported in December 2025 and remains present 197+ releases later; Mindgard went public only after seven months of no meaningful vendor response ([mindgard.ai](https://mindgard.ai/blog/cursor-0day-when-full-disclosure-becomes-the-only-protection-left)).

**Impact for companies:** Cursor reports 50,000+ companies as users. A trivially exploitable ACE in a tool with access to your source, credentials and terminals is an enterprise-wide exposure, not a developer's personal problem.

**Risks and opportunities:** the risk is obvious. The opportunity is procedural — this is the moment to ask every AI-tool vendor for their security.txt, their disclosure SLA, and their track record on actually closing reports.

**My take:** trust is earned through behavior, not valuation. Until this is patched, untrusted repositories should only be opened in a sandbox or disposable VM, and AppLocker-style deny rules belong on managed machines. And "how fast do you fix reported bugs" should be a procurement question, not an afterthought.

## Your coding agent will happily upload your home directory

Two related threads topped Hacker News: reports that a Grok CLI uploaded a user's entire home directory to Google Cloud Storage, and news that OpenAI's Codex has started encrypting sub-agent prompts ([github.com/openai](https://github.com/openai)). Different tools, same underlying reality — agentic CLIs read and transmit far more of your machine than most users assume, and the guardrails are being retrofitted after the fact.

**Impact for companies:** every developer running an agentic CLI is a potential, unlogged exfiltration path for secrets and regulated data — a direct LGPD/GDPR exposure with no audit trail.

**Risks and opportunities:** the risk is silent leakage you only discover in a breach report. The opportunity is to standardize now on tools with deterministic deny-lists and sandbox-level file exclusion, and make that an explicit selection criterion.

**My take:** an enforceable exclusion policy and sandboxing beat a convention in a README. If a tool can't guarantee a file never leaves the machine, it doesn't belong near your sensitive repositories — regardless of how much it accelerates a demo.

## Why vibecoded systems drift apart even when they compile

Armin Ronacher's essay "The Tower Keeps Rising" argues that large software was never limited only by how fast an individual writes code — it was limited by how well people coordinate a shared understanding of the system ([lucumr.pocoo.org](https://lucumr.pocoo.org/2026/7/13/the-tower-keeps-rising/)). Agents remove the friction that used to force that synchronization: I can add OAuth, you can add caching, someone else can rebuild the database, each change reasonable in isolation, none of us ever having to acquire the shared model. Unlike Babel, construction doesn't stop when the common language collapses — it keeps going, which is exactly what makes the loss invisible.

**Impact for companies:** velocity metrics can look excellent while architectural coherence quietly erodes. The failure shows up late, as a system nobody can reason about together.

**Risks and opportunities:** the risk is a codebase that grows faster than anyone's understanding of it. The opportunity is to make shared understanding an explicit deliverable — design docs, ADRs, and review that exists to synchronize people, not just to approve diffs.

**My take:** this is the clearest articulation I've seen of the real cost of AI-assisted engineering. The answer isn't to slow down; it's to treat coordination as first-class work. A `design.md` and a real review conversation are cheaper than an architecture no human owns.

## Oracle downgraded over its AI datacenter bet

S&P Global lowered Oracle's credit rating a notch, from BBB to BBB-, now one step above non-investment grade ([heise.de](https://news.ycombinator.com/best)). The move reflects the debt Oracle is taking on to fund an aggressive AI-datacenter and cloud buildout against future, still-unrealized demand.

**Impact for companies:** the AI infrastructure boom is increasingly debt-financed, and rating agencies are starting to price the risk. Your cloud vendor's balance sheet is now part of your supply-chain risk.

**Risks and opportunities:** the risk is betting your platform on a provider stretching its finances to win a capacity race. The opportunity belongs to teams whose architecture stays portable enough to move workloads if pricing or terms shift.

**My take:** FinOps isn't only about your own bill anymore. When you commit to multi-year capacity, factor in the provider's financial trajectory the same way you'd assess any critical supplier. Portability is a hedge, not a purity test.

## Data as the price of admission

Samsung Health reportedly warned users that opting out of AI training could mean deletion of their data ([neow.in](https://news.ycombinator.com/best)). Whatever the eventual policy, the framing — your data, or your access — is becoming a pattern worth naming.

**Impact for companies:** consent-as-coercion invites regulatory attention under LGPD and GDPR and erodes the trust that makes data-driven products work in the first place.

**Risks and opportunities:** the risk is a short-term data grab that becomes a long-term liability. The opportunity is to compete on genuine consent and transparency while others normalize the opposite.

**My take:** if your growth plan depends on making privacy the thing users have to trade away, the plan is fragile. Build the value case so people opt in because it's worth it — that's the version that survives contact with a regulator.

## The trend to watch

The common denominator across all six stories is a widening gap between what our tools can do and whether we can trust, understand, and afford them. On-device models and agentic coding are real leverage — but a zero-day left open for seven months, CLIs uploading home directories, and codebases no one can reason about together are the bill coming due for moving faster than our foundations. The teams that win the next year won't be the ones that adopt the most AI. They'll be the ones that pair it with security discipline, explicit coordination, and honest economics — so that when the tower keeps rising, someone still understands why it stands.
