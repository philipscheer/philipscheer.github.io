---
title: 'Tech Radar — AI sets the pace, judgment sets the bar'
description: 'This edition: 2,000 people fail to break an AI email agent, the industry stands up a shared response team for open-source bugs found at AI speed, a builder learns AI code has no taste, IBM goes below 1nm, and Apple bets its Mac silicon on AI.'
date: '2026-06-26'
tags: ['Tech Radar', 'AI engineering', 'security', 'software architecture', 'engineering leadership']
---

The thread running through this week is speed. AI keeps compressing the time it takes to do everything — break into a system, find a vulnerability, generate working code, even shrink a transistor. The lesson in each of these stories is that speed alone settles nothing. The teams that come out ahead answer acceleration with judgment, coordination and guardrails. Here is what I would put in front of an engineering leadership team this week, and why it matters past the headline.

## 2,000 people tried to break an AI email agent — and failed

A developer built [hackmyclaw.com](https://www.fernandoi.cl/posts/hackmyclaw/), exposing an AI email assistant with access to a `secrets.env` file, and invited Hacker News to extract it. More than 6,000 emails from over 2,000 people followed — authority impersonation, fake "incident response" demands, multi-language social engineering — and not one leaked the secret. The guardrail was a four-line system prompt; the model was Claude Opus 4.6, which Anthropic trained specifically to resist prompt injection.

**Impact for companies:** the most useful data point on agent security in months. A capable model with a short, clear instruction held the line against thousands of adversarial attempts. That is reassuring for anyone weighing whether to put agents into real workflows.

**Risks and opportunities:** the experiment still cost over $500 in tokens and got the Gmail account suspended for three days. An exposed agent is a cost and availability liability, not only a security one. And the author was clear that a weaker, cheaper model would likely have failed — capability and safety are coupled here.

**My take:** this lowers my fear of prompt injection without removing it. I still would not hand an agent the ability to send mail or move money unsupervised. Pick a model hardened for injection, keep instructions short and explicit, cap spend, and assume the inbox is hostile.

## The industry builds a shared response team for open-source bugs found at AI speed

The Linux Foundation launched [Akrites](https://akrites.org/letter/), a coordinated effort to triage and remediate vulnerabilities in critical open-source software. The problem it names is sharp: AI scanners dropped the cost of finding a serious bug from weeks of expert work to minutes, and maintainers are now drowning in duplicate, AI-generated reports — the same flaw described five ways by five reporters in a week. Akrites runs a shared, confidential Security Incident Response Team so upstream maintainers face one coordinated partner instead of a hundred. The same week, IBM, Red Hat and Palo Alto expanded a parallel effort, Project Lightwell, aimed at the same problem.

**Impact for companies:** if you ship software, you depend on this commons. Discovery has outrun defence, and the burnout of unpaid maintainers is now a supply-chain risk on your own roadmap.

**Risks and opportunities:** the risk is a flood of low-signal AI reports burying the real exploit, and pre-patch findings leaking while everyone races to disclose. The opportunity is coordinated disclosure becoming a shared standard rather than a hundred private scrambles.

**My take:** this is the right shape of response — pool the signal, protect the maintainers, disclose once. For most companies the practical move is smaller: know your critical dependencies, fund or support the ones you rely on, and stop treating open source as free infrastructure that maintains itself.

## A builder learns AI code has no taste

In ["You can't unit test for taste"](https://dev.karltryggvason.com/you-cant-unit-test-for-taste/), a developer documents building a points-of-interest pipeline for a running app using Claude, GeoNames data, Python, Parquet and DuckDB. He expected AI to be the feature; it ended up in a supporting role, alongside data filters and notability signals, while he fought hallucinations and curated the output by hand. The judgment calls — which landmarks matter, which Wikipedia cross-reference is right — were his, not the model's.

**Impact for companies:** a grounded counter-narrative to "AI writes the whole thing." It mirrors what I see day to day — AI is a strong accelerator for plumbing and a poor substitute for product taste.

**Risks and opportunities:** the practical wins he reports are worth copying: build a plan with the model first, run a fresh context per milestone, and keep enough command of the stack to steer instead of follow. Big contexts degrade output quality — keep them tight.

**My take:** the differentiator was never typing speed; it was knowing what good looks like. AI makes that judgment more valuable, not less.

## IBM goes below one nanometer

IBM unveiled what it calls the [world's first sub-1nm chip technology](https://newsroom.ibm.com/2026-06-25-ibm-debuts-worlds-first-sub-1-nanometer-chip-technology), a "nanostack" architecture at the 0.7nm (7-angstrom) node that stacks transistors vertically and reports a 40% SRAM scaling gain, explicitly aimed at the bandwidth demands of AI workloads. IBM projects a decade of further scaling and a path to production in roughly five years.

**Impact for companies:** nothing to act on this quarter, but it matters for the long arc. The cost-per-AI-workload curve depends on whether silicon scaling keeps going, and this says it can for another decade.

**My take:** a useful signal for multi-year infrastructure and FinOps planning — not a reason to change anything today. File it under "the compute floor keeps dropping."

## Apple bets its Mac silicon on AI

Bloomberg [reported](https://www.bloomberg.com/news/articles/2026-06-25/apple-to-skip-high-end-m6-mac-chips-to-launch-m7-pro-m7-max-m7-ultra-instead) that Apple will skip the high-end M6 generation and jump to an AI-focused M7 Pro, Max and Ultra line. Treat the specifics as reporting, not confirmation — but the direction is the story.

**Impact for companies:** vendor roadmaps are now openly organized around on-device AI. If your product or your developers lean on local inference, hardware refresh cycles and capability assumptions are shifting under you.

**My take:** plan device refreshes and local-AI features against where the silicon is going, not where it is. The center of gravity has moved to inference.

The constant across all five stories is that AI compresses time at every layer — offense, defence, delivery and hardware. The teams that win are not the fastest; they are the ones that pair the speed with judgment about what is worth doing, coordination so the speed does not turn into chaos, and guardrails so an autonomous process cannot quietly become a six-thousand-email, three-day-outage problem. That is the trend worth watching: as the tools get faster, the human disciplines around them become the real competitive edge.
