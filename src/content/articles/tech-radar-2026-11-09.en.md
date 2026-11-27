---
title: 'Tech Radar — AI enters its efficiency phase: more tokens, flat spend'
description: 'This edition: Ramp data shows AI usage rising while spend stalls, GitHub admits the bottleneck moved from writing code to reviewing it, the Copilot impact dashboard finally counts chat and agent usage, Uber reports four agent-booked rides in its busiest week, Palo Alto Networks bets $500M on agent access security, and Dropbox buys Tigris to sell S3-compatible storage for agents.'
date: '2026-11-09'
tags: ['Tech Radar', 'FinOps', 'AI engineering', 'agentic AI', 'engineering metrics', 'security', 'cloud', 'engineering leadership']
---

The AI market is leaving the "spend whatever it takes" phase. Usage keeps growing, but the companies that use it most are learning to pay less for it, and the gains are showing up in some places and not in others. For technology leaders, the question this week is not "should we adopt AI?" but "where is the value, and how do we prove it?"

## Ramp: AI usage keeps rising, but spend has stalled

Ramp's AI Index shows token spend grew only 1.5% across August and September, after growing 42% month over month in July, even as token volumes kept rising ([techcrunch.com](https://techcrunch.com/2026/11/06/ramp-data-shows-ai-spending-stalling-just-as-anthropic-nears-its-ipo/)). Ramp's lead economist, Ara Kharazian, attributes it to price cuts from OpenAI and Anthropic and to more disciplined buyers: cheaper defaults, per-employee budgets and routers that send simple work to lighter models. October re-accelerated by 8.9%, but he still calls it a buyer's market.

**Impact for companies:** good news for buyers. Prices are falling, discounts are negotiable and cost controls demonstrably work.

**Risks and opportunities:** the risk is vendor dependence. Model companies under revenue pressure will push lock-in through discounts and bundles. The opportunity is to build a routing layer now, so that moving a workload to a cheaper model is a configuration change, not a project.

**My take:** "use more AI, but pay less for it" is exactly the posture I recommend. Treat models like any other cloud resource: default to the cheapest one that passes your evals, escalate only when needed, and review the bill monthly. Avoid multi-year commitments while prices are still falling this fast.

## GitHub: code got faster, the work around it did not

GitHub reported more than 1.2 billion commits in a single week in October, over 400% more than a year earlier, and cited a Faros AI study in which pull requests spent 441% longer in review as teams moved from low to high AI adoption ([github.blog](https://github.blog/ai-and-ml/github-copilot/beyond-code-generation-a-developers-guide-to-agentic-engineering/)). Its proposed answer is a Plan, Build, Verify and Observe workflow: approved plans before implementation, stacked pull requests instead of 47-file "small refactors," and automated quality and security checks before a human opens the diff.

**Impact for companies:** the delivery bottleneck has moved from writing code to reviewing and validating it. Teams that measure output in commits or lines of code are measuring the wrong thing.

**Risks and opportunities:** the risk is a review queue that grows faster than the team's capacity to read, which leads to rubber-stamp approvals. The opportunity is to invest in what makes review cheap: small changes, clear acceptance criteria and automated gates.

**My take:** this matches what I see in practice. I would set a hard limit on PR size for agent-generated changes and track lead time from PR opened to merged. If that number is rising while commits soar, AI is creating work, not removing it.

## Copilot impact dashboard now counts chat and agent usage

GitHub added Copilot Chat and the VS Code Agents window to the Agent adoption chart in the Copilot impact dashboard, for nine tracked features in total, and renamed the "Passive users" cohort to "Chat-first users" ([github.blog](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/)). Adoption phases are unchanged, and the data appears in the enterprise and organization 28-day reports.

**Impact for companies:** it sounds cosmetic, but labeling chat-heavy developers as passive distorts decisions about licenses and training.

**Risks and opportunities:** the risk is comparing reports before and after the change, since earlier periods only include seven features. The opportunity is a more honest baseline for adoption by team.

**My take:** usage dashboards answer "are people using it?", not "is it paying off?". I use them to find teams that need support, and pair them with delivery metrics — lead time, change failure rate, review time — before renewing any seat.

## Uber: four agent-booked rides in its busiest week

On its third-quarter earnings call, Uber said only four rides were ordered through an AI agent during the week of Halloween, out of roughly 320 million trips and orders across Uber and Uber Eats; about 500 Uber Eats orders came from agents ([techcrunch.com](https://techcrunch.com/2026/11/04/almost-no-one-uses-ai-agents-to-book-their-uber-company-says/)). CEO Dara Khosrowshahi noted that booking a ride in the app takes about 50 seconds, so an agent does not necessarily save time.

**Impact for companies:** consumer agentic commerce is still a hypothesis, not a channel. Roadmaps built on "agents will buy from us" need evidence.

**Risks and opportunities:** the risk is diverting product capacity to agent integrations with no measurable demand. The opportunity is cheap optionality: well-documented, agent-friendly APIs that also serve partners and internal automation.

**My take:** agents create value where the task is long, repetitive and expensive for humans — not where a good app already finishes the job in 50 seconds. I would keep agent integrations in the "small bet" column until real usage data says otherwise.

## Palo Alto Networks bets $500M on agent access security

Palo Alto Networks is in talks to acquire Clutch Security, which secures AI agents' access to company systems, for $500 million in cash plus milestone payments, according to a person familiar with the discussions ([techcrunch.com](https://techcrunch.com/2026/11/05/palo-alto-networks-in-talks-to-buy-ai-agent-security-startup-clutch-for-500m/)). Clutch is approaching $10 million in ARR, which implies about 50 times revenue. Competitors have also been acquired: Cyera bought Oasis Security for $1 billion and Cisco bought Astrix for roughly $400 million.

**Impact for companies:** non-human identity — service accounts, API keys, agent credentials — is becoming its own security category, and large vendors are consolidating it quickly.

**Risks and opportunities:** the risk is buying a platform before knowing your inventory. Most companies cannot list which agents hold which credentials today. The opportunity is to start with that inventory and with short-lived, scoped credentials.

**My take:** 50x ARR says the market sees agent access as the next big attack surface, and I agree. But the first step is a list of every agent, what it can reach and who owns it. Without that, any platform just automates confusion.

## Dropbox buys Tigris to sell storage for agents

Dropbox is acquiring Tigris Data for $350 million, apparently its largest deal to date, to support DBX Agent Cloud, a storage platform for teams building AI models and agents ([techcrunch.com](https://techcrunch.com/2026/11/05/dropbox-acquires-tigris-data-for-350m-to-bolster-its-ai-iinfrastructure/)). It will first offer stand-alone object storage compatible with tools built for Amazon S3. Tigris, founded by former Uber storage engineers, places data close to the users and compute that need it.

**Impact for companies:** the S3 API is now a commodity interface, and new providers are competing on price and data placement. That is useful leverage for anyone with a large storage or egress bill.

**Risks and opportunities:** the risk is moving data to a provider whose roadmap is still being defined after an acquisition. The opportunity is to keep applications speaking the S3 API, so storage becomes a procurement decision rather than a rewrite.

**My take:** I would not migrate production data based on this news. I would, however, run a cost comparison for AI datasets and artifacts, which are often large, read-heavy and egress-sensitive. Portability is a negotiating position even when you stay.

## The trend to watch

AI is moving from the adoption phase to the efficiency phase. Spend is flattening, review is the new bottleneck, usage dashboards are being corrected and consumer agents are still waiting for demand. The winners will be the teams that treat AI like any other investment: routed to the cheapest model that works, measured by delivery outcomes and governed by clear identities and limits.
