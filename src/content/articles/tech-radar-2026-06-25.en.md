---
title: 'Tech Radar — The AI stack industrializes, and judgment gets expensive'
description: 'This edition: OpenAI''s first custom chip, Qualcomm buying Modular, GitHub throttling AI pull-request spam, computer use landing in a cheap Gemini model, infrastructure going free, and why open models and evaluation are the real story.'
date: '2026-06-25'
tags: ['Tech Radar', 'AI engineering', 'cloud', 'engineering leadership', 'FinOps']
---

The pattern this week is industrialization. The AI stack is getting more vertical and cheaper at the same time — custom silicon, infrastructure consolidation, agentic models priced for volume, and core services going free. When the machinery gets that cheap, the scarce resource moves up the stack: it stops being compute or code and becomes judgment — what to review, what to trust, what not to buy. Here is what I would put in front of an engineering leadership team this week, and why it matters beyond the headline.

## OpenAI unveils its first custom chip, built with Broadcom

OpenAI introduced its first in-house AI accelerator, designed with Broadcom — its move from renting other people's silicon to owning part of the supply chain ([TechCrunch](https://techcrunch.com/), via [Hacker News](https://news.ycombinator.com/)). The frontier labs are following the same logic Apple, Amazon and Google already proved: when compute is your largest cost line, you eventually build it yourself.

**Impact for companies:** the economics of inference are being rewritten upstream of you. Custom accelerators tighten the link between a model provider and a hardware roadmap, which over time shapes price, availability and lock-in for everyone who builds on top.

**Risks and opportunities:** the risk is a more concentrated supply chain where your model vendor, your capacity and your pricing are increasingly the same decision. The opportunity is cheaper inference at scale — if you keep your architecture portable enough to benefit from it.

**My take:** treat the model layer like any other infrastructure dependency — abstract it. Custom silicon is good news for your inference bill, but only if switching providers is a config change, not a rewrite. Vertical integration helps the vendor first; design so it helps you too.

## Qualcomm moves to acquire Modular

Qualcomm agreed to acquire Modular, the AI-infrastructure company behind the Mojo language and the MAX inference stack ([Reuters](https://www.reuters.com/), via [Hacker News](https://news.ycombinator.com/)). It is another sign that the unglamorous middle of the AI stack — compilers, runtimes, the layer that makes models run fast on real hardware — is where the strategic value is concentrating.

**Impact for companies:** the tooling you quietly depend on can change owners overnight. Acquisition usually means a new roadmap, new pricing pressure, and eventually a new set of priorities that may not include your use case.

**Risks and opportunities:** the risk is betting your performance strategy on an independent layer that just became someone else's product. The opportunity is that consolidation often brings real engineering investment and better hardware support — if the acquirer keeps it open.

**My take:** map your critical dependencies by who owns them, not just by what they do. When a key piece of your stack gets acquired, the question is not "does it still work today" — it is "what happens at the next renewal." Have a fallback before you need one.

## GitHub throttles pull requests as AI-generated PR spam piles up

GitHub shipped pull-request rate limits to cut down the noise, after a wave of low-quality, AI-generated contributions began overwhelming open-source maintainers — one widely shared post compared today's PR spam to email spam in the early 2000s ([GitHub Blog](https://github.blog/) and [greptile.com](https://www.greptile.com/), via [Hacker News](https://news.ycombinator.com/)). Generating a plausible-looking change is now nearly free; reviewing it is not.

**Impact for companies:** the bottleneck has officially moved from writing code to reviewing it. If your team adopted AI assistance and your review process did not change, you have quietly shifted load onto your most senior people — the ones who can tell a real fix from a confident-looking one.

**Risks and opportunities:** the risk is reviewer burnout and a slow erosion of code quality under volume. The opportunity is to make review a first-class, resourced activity — and to use AI on the review side too, for triage, not just for generation.

**My take:** measure the cost of a change at review time, not commit time. The cheapest way to ruin a codebase is to reward volume and starve review. Cap the inflow, automate the triage, and protect your reviewers' attention like the scarce resource it now is.

## Computer use lands in Gemini 3.5 Flash

Google brought computer-use — agents that operate a browser and UI directly — to Gemini 3.5 Flash, its fast, low-cost tier ([Google](https://blog.google/), via [Hacker News](https://news.ycombinator.com/)). Agentic capability that was a premium, slow feature a year ago is now cheap enough to run at volume.

**Impact for companies:** when an agent that can click, type and navigate costs cents, internal automation that was never worth a full integration suddenly pencils out. So does a new class of risk: software that takes actions on your behalf, fast and at scale.

**Risks and opportunities:** the risk is the familiar one — an autonomous process with real permissions and no real ceiling. The opportunity is genuine leverage on the long tail of manual, glue-work tasks that proper APIs never reached.

**My take:** cheap agentic compute is only a bargain if it is governed. Scope the credentials, log every action, sandbox the environment, and keep a human gate on anything irreversible. The price of the model is the small number; the cost of an unsupervised agent with permissions is the one that hurts.

## Infrastructure keeps going free — and you should keep it boring

Two quieter items make the same point. Bunny announced it is making its DNS free ([bunny.net](https://bunny.net/), via [Hacker News](https://news.ycombinator.com/)), and a popular write-up showed zero-downtime deployments with plain Docker Compose, no Kubernetes required (via [Hacker News](https://news.ycombinator.com/)). Commodity infrastructure keeps getting cheaper, and the case for heavy platforms keeps getting narrower.

**Impact for companies:** a lot of teams are paying — in money and in complexity — for capabilities they could now get for free or with far simpler tooling. Over-provisioned platforms are a tax you renew automatically.

**Risks and opportunities:** the risk is mistaking complexity for maturity and carrying a Kubernetes-sized operational burden for a Docker-Compose-sized problem. The opportunity is real FinOps and real velocity from right-sizing.

**My take:** boring infrastructure is a feature. Match the tool to the load, revisit the choice as the market commoditizes, and be willing to remove a platform, not just add one. The cheapest, most reliable system is usually the simplest one that meets the SLA.

## The real AI story: open models and the evaluation gap

Two threads worth watching together: a strong argument that, for most of the world, open-source AI is the only viable path ([techstrong.ai](https://techstrong.ai/), via [Hacker News](https://news.ycombinator.com/)), and a sharp post-mortem on why evaluation startups keep failing (via [Hacker News](https://news.ycombinator.com/)). Open-weight models keep getting better and cheaper to run; knowing whether any of them is actually good enough for your use case is still unsolved.

**Impact for companies:** model choice is becoming a portfolio decision — a frontier model for hard reasoning, open weights for high-volume or data-sensitive work. But a portfolio you cannot evaluate is just sprawl.

**Risks and opportunities:** the risk is adopting on vibes and discovering quality problems in production. The opportunity is that disciplined evaluation — task-specific, repeatable, tied to outcomes — is becoming a real competitive advantage.

**My take:** the hard part of AI engineering was never getting an answer; it is knowing whether the answer is right. Build your own small, honest eval set for the tasks that matter to you. The team that can measure model quality on its own terms is the team that can adopt open models safely and switch without fear.

## The trend to watch

Pull these together and the same line runs through all of them: the AI stack is industrializing — cheaper silicon, consolidating infrastructure, agentic compute at volume, services going free — and every one of those moves pushes the scarce resource further up, toward human judgment. The leaders who win the next year will not be the ones who adopted the most AI or the most platforms. They will be the ones who kept their architecture portable, their review process funded, their agents governed, and their model choices measured. When the machinery gets cheap, taste and discipline are what is left to compete on. Watch how quickly "we can build it" gives way to "should we, and how would we know if it worked."
