---
title: 'Tech Radar — Who owns the tools you build on'
description: 'This edition: SpaceX buys Cursor for $60bn, Cohere open-sources a coding model you can self-host, a fake LinkedIn recruiter ships a backdoor, and the budget cloud quietly triples some prices.'
date: '2026-06-16'
tags: ['Tech Radar', 'AI engineering', 'FinOps', 'security', 'engineering leadership']
---

The theme this week is ownership — of your AI toolchain, your infrastructure cost, and your developers' machines. A $60bn acquisition, an open-weight model you can run on your own hardware, a price hike at the cloud everyone calls cheap, and a backdoor dressed up as a job offer all point at the same question: how much of the stack you depend on do you actually control? Here is what I would put in front of an engineering leadership team this week, and why it matters beyond the headline.

## SpaceX buys Cursor for $60bn — and your editor now has an owner

SpaceX agreed to acquire Anysphere, the company behind the Cursor AI coding agent, for $60bn in an all-stock deal expected to close by the end of September ([BBC](https://www.bbc.com/news/articles/cvgd5g7d7gyo)). The two have been partners since April, when SpaceX secured the right to either buy Cursor outright or pay $10bn for joint work; the purchase lands days after SpaceX's record IPO valued it above $2tn. Cursor is used inside Stripe, Adobe and Nvidia.

**Impact for companies:** the editor your engineers live in is now owned by a rocket-and-satellite conglomerate with its own model ambitions (xAI, Grok) and its own training infrastructure. Roadmaps, pricing and data policies will be set by a parent whose priorities are not your delivery schedule.

**Risks and opportunities:** the risk is concentration — a tool deeply embedded in daily workflows changing hands, terms, or direction with little notice. The opportunity is that this is a forcing function to check how replaceable your AI tooling actually is.

**My take:** never let a productivity tool become load-bearing without an exit. If pulling Cursor out would stall your teams, that is not a tooling decision anymore — it is a dependency you have not priced. Standardize on the workflow, not the vendor, and keep the switching cost low on purpose.

## Cohere open-sources a coding model small enough to self-host

Cohere released North Mini Code, an Apache-2.0 mixture-of-experts coding model with 30B total parameters but only 3B active, a 256K context window, and a minimum footprint of a single H100 at FP8 ([Cohere](https://cohere.com/blog/north-mini-code)). The pitch is sovereignty: run it on-prem or locally, on your own terms, free of vendor constraints. The timing is telling — it lands the same week a 1,100-point Ask HN thread debated whether anyone has actually replaced Claude or GPT with a local model for daily coding ([Hacker News](https://news.ycombinator.com/item?id=48542100)).

**Impact for companies:** between a $60bn acquisition and a permissively-licensed model you can host yourself, the strategic gap could not be clearer. "Which model" is no longer one decision — it is a portfolio, with a frontier model for hard reasoning and a self-hostable one for high-volume, sensitive, or cost-controlled work.

**Risks and opportunities:** the risk is overestimating what a 3B-active model delivers — benchmarks are not your codebase, and self-hosting adds real operational load. The opportunity is data sovereignty and a fixed infrastructure cost instead of an open-ended per-token bill, plus a credible fallback when a hosted vendor changes the deal.

**My take:** the interesting number is not the benchmark, it is total cost of ownership. For high-volume internal work — boilerplate, refactors, test scaffolding, code review — a "good enough" model you control often beats the best hosted one once you add data risk and vendor lock-in to the ledger. Pilot it on a real workload before you believe the chart.

## A fake LinkedIn recruiter shipped a backdoor — and an agent caught it

A developer described being approached on LinkedIn by a "recruiter" at a crypto startup who asked him to review a public GitHub repo and "check out the deprecated Node modules issue" ([roman.pt](https://roman.pt/posts/linkedin-backdoor/)). The bait was the install: the repo's `package.json` wired a `prepare` script to run on `npm install`, which executed a payload hidden in a fake test file — code that runs whatever a remote server sends back. The commit history was forged under a real engineer's identity, and the recruiter's profile belonged to a real arts journalist who suddenly became fluent in Node versions when pressed to install.

**Impact for companies:** your developers' laptops and CI runners are part of your attack surface, and they run with credentials that production security never sees. A single `npm install` of a hostile repo is enough — no exploit, no zero-day, just social engineering and a lifecycle script.

**Risks and opportunities:** the risk is credential theft and lateral movement from the least-monitored corner of most security programs. The opportunity is a quiet detail in the story: he reviewed the code with a read-only AI agent, tools limited to reading files, and it flagged the backdoor in seconds — faster than he would have reading it himself.

**My take:** treat untrusted code like untrusted code. Clone into a throwaway, network-isolated sandbox; never run install scripts on your real machine; and pin and provenance-check dependencies. And note the inversion — AI that writes code carelessly is a liability, but AI constrained to read-only review is becoming a genuine security control. Point it at the diff before a human's tired eyes do.

## Hetzner raises prices — a reminder that "cheap cloud" is not a moat

Hetzner, long the go-to for cost-conscious teams, adjusted its pricing on 15 June ([Hetzner](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/)). The increases are uneven: entry Arm instances rose by roughly a third, but dedicated-vCPU cloud servers jumped far more — the CCX13, for example, went from €15.99 to €42.99 per month, nearly tripling, with the rest of that line up by similar multiples.

**Impact for companies:** if your cost model assumed your cheapest provider would stay cheapest forever, this week broke that assumption. The plans that rose most are exactly the ones teams reach for under load — and a 2-3x increase on your busiest instance class changes the math on where you run.

**Risks and opportunities:** the risk is a budget surprise that arrives at your next rescale, since the new prices apply to new orders and rescales. The opportunity is the discipline this should already exist: knowing your unit economics well enough to model a provider price change in an afternoon, not a quarter.

**My take:** cheap infrastructure is a tactic, not a strategy. Build for portability where it is cheap to do so, keep your workloads legible enough to compare across providers, and treat any single vendor's pricing as a variable, not a constant. The teams that panic at a price change are the ones that never knew their own cost structure.

## The trend to watch

Four stories, one throughline: the AI-era engineering stack is consolidating at the top and fragmenting at the bottom at the same time. The tools and clouds you rely on are being bought, repriced, and weaponized — while open, self-hostable alternatives are getting good enough to be a real hedge. The leaders who do well in the next year will not be the ones who bet everything on the best single tool; they will be the ones who kept their dependencies legible, their switching costs low, and their cost structure something they could explain on demand. Ownership is the quiet theme of 2026: know what you own, what you rent, and what you would do the morning the terms change.
