---
title: 'Tech Radar — AI rewards the fundamentals'
description: 'This edition: healthy code cuts agent token spend by 40–45%, Google rewrites the SRE book for the AI era, LinkedIn cuts Spark compute costs 10% by separating shuffle from compute, GitHub and Microsoft turn 9,791 AI findings into 99 fixable reports, the FBI says AI hacking tools breach networks in under three hours, and banks push agent risk back onto customers.'
date: '2026-11-19'
tags: ['Tech Radar', 'AI engineering', 'code quality', 'SRE', 'FinOps', 'data platforms', 'DevSecOps', 'AI governance']
---

AI is accelerating everything at once: code generation, vulnerability discovery and attacks. This week's news shows who captures the gain — not the teams with the most tools, but the ones with healthy code, explicit SLOs, revoked credentials and scoped access. AI is an amplifier; it amplifies whatever fundamentals you already have.

## Healthy code makes agents cheaper and more reliable

At GOTO Copenhagen, Adam Tornhill presented research showing that AI velocity gains in 1,000+ open source projects were fully cancelled after about two months by rising code complexity ([infoq.com](https://www.infoq.com/news/2026/11/healthy-code-AI-tokens/)). Models perform better in healthy code, and the same work takes 40% to 45% fewer tokens. Agents alone fixed about half of the code health issues in low-quality code; with an MCP server feeding code health data, the fix rate rose to 90%–100%.

**Impact for companies:** technical debt now has a direct line in the AI bill. Unhealthy code means more tokens, more retries and more review per change.

**Risks and opportunities:** the risk is measuring adoption by lines generated while complexity compounds quietly. The opportunity is agentic refactoring with a baseline, a test safety net and an objective quality signal in the loop.

**My take:** this is the strongest business case for refactoring I have seen in years. Before buying more agent seats, I would measure code health on the ten most-changed modules and expose that metric to the agents themselves. Feedback beats prompting.

## Google rewrites the SRE book for the AI era

Ten years after the original, Google announced a fully rewritten second edition of *Site Reliability Engineering* ([infoq.com](https://www.infoq.com/news/2026/11/google-sre-book-ai-era/)). It moves from basic availability metrics to user-centred, multi-tiered SLOs with burn-rate alerting, from game days to continuous resilience checks in the pipeline, and adds GPU/TPU capacity and FinOps alignment. AI appears mainly in a supporting role: triage, postmortem drafting and natural-language queries over telemetry.

**Impact for companies:** the reference playbook now treats reliability, platform engineering and cost as one discipline — and assumes most companies cannot staff a central SRE team per service.

**Risks and opportunities:** the risk is buying an "AI SRE" product before having SLOs to evaluate it against. The opportunity is to embed reliability champions in product teams and bake resilience checks into delivery.

**My take:** the most useful signal is what Google did *not* claim: AI gathers evidence, humans judge. I would start with one SLO per critical user journey and an error-budget policy that is enforced automatically, not debated in meetings.

## LinkedIn: separate shuffle from compute, cut cost 10%

LinkedIn moved most Spark and Flink workloads to Apache Celeborn, a remote shuffle service running on dedicated workers ([infoq.com](https://www.infoq.com/news/2026/11/linkedin-celeborn-remote-shuffle/)). Daily shuffle fetch failures fell from about 750 to 20, compute costs dropped 10%, runtimes improved 14% and shuffle cost per task fell nearly 90%. Switching from LZ4 to Zstandard alone shrank the shuffle worker fleet by about 35%.

**Impact for companies:** in data platforms, contention between storage and compute is a hidden tax on both reliability and cost.

**Risks and opportunities:** LinkedIn notes that operating Celeborn at scale required substantial engineering beyond the upstream project — a Raft control plane, host-health integration, network-aware replication. The opportunity for smaller teams is the cheap lesson: compression choice and disaggregation decisions move the bill.

**My take:** I would not copy this architecture below LinkedIn's scale. I would, however, check how much executor time my jobs spend waiting on shuffle and test Zstandard this sprint. Small configuration choices often beat big migrations.

## GitHub and Microsoft: findings are cheap, fixes are the bottleneck

In the Codename MDASH pilot, Microsoft's agentic scanner flagged 9,791 possible issues across six open source projects, including Express, Caddy and Netty ([github.blog](https://github.blog/open-source/maintainers/maintainers-dont-need-more-ai-bug-reports-they-need-fixes/)). After AI triage and manual review by seven researchers, maintainers received 99 private reports with proofs of concept and suggested fixes. As of November 15, 55 were fixed; Caddy fixed all 22 of its reports within a week.

**Impact for companies:** the same dynamic applies inside any engineering org: an AI scanner that dumps raw findings adds load instead of reducing risk.

**Risks and opportunities:** the pilot worked because of human verification — about two days of researcher time per project — which does not scale yet. The opportunity is to demand verified findings with patches from any security tool you buy.

**My take:** I would measure security tools by time-to-fix, not by findings count. A report with a reproducible proof and a reviewed patch is worth a hundred alerts in a dashboard.

## FBI: AI hacking tools breach networks in under three hours

The FBI warned that attackers are using Artex, an open source AI-powered penetration testing platform, to move from targeting to compromise "in under three hours" ([techcrunch.com](https://techcrunch.com/2026/11/16/fbi-says-artex-ai-open-source-hacking-tool-used-to-breach-networks-in-under-three-hours/)). The tool exploits simple weaknesses — missing MFA, exposed or stolen passwords. Barracuda was breached through a third-party credential it had not revoked after ending a vendor relationship.

**Impact for companies:** detection-and-response timelines measured in days no longer match attacker speed.

**Risks and opportunities:** the risk is investing in sophisticated defences while basic hygiene stays open. The opportunity is cheap and immediate: MFA everywhere, credential inventories and revocation built into vendor offboarding.

**My take:** none of these attacks needed a novel exploit. I would run a credential audit this month, starting with integrations from vendors you no longer work with. That is the attack surface AI finds first.

## Banks push agent risk back onto customers

Citi changed its online terms: customers who grant account access to third-party AI agents are responsible for what those agents do — including when the tool leaks credentials or is hacked ([techcrunch.com](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/)). JPMorgan, Bank of America, PNC and Citizens have adopted similar positions. Citi's terms exempt the AI agents it provides itself.

**Impact for companies:** any product that wants agents acting on behalf of users must now answer a liability question, not only a technical one.

**Risks and opportunities:** the risk is building agent features on credential sharing that partners can disown overnight. The opportunity is scoped, read-only, auditable access — the approach some AI vendors already take for finance features.

**My take:** read-only first, delegated write access only with explicit scopes and logs. If your agent integration depends on users handing over passwords, it is not an integration; it is a liability.

## The trend to watch

The common thread is leverage. AI multiplies output for defenders and attackers, for healthy and unhealthy codebases, for well-run and poorly run platforms. The teams that benefit will be the ones that invested in boring fundamentals — code health, SLOs, credential hygiene and scoped access — because those determine whether AI amplifies value or amplifies risk.
