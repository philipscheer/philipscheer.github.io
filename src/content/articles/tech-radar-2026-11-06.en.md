---
title: 'Tech Radar — Agents in the pipeline need proof, budgets and gates'
description: 'This edition: AWS Continuum prices security fixes per finding, GitLab 19.5 brings external agents under governance, Inkitt shows that the orchestrator matters more than the model, GitHub Actions lockfiles reach GA, GitHub rebuilds Git storage for thousands of agents per repository, Apple caps daily AI spend, and Copilot metrics start measuring whether review comments land.'
date: '2026-11-06'
tags: ['Tech Radar', 'AI engineering', 'agentic AI', 'DevSecOps', 'software supply chain', 'FinOps', 'platform engineering', 'engineering metrics']
---

Agents are no longer a sidecar to the delivery pipeline; they are becoming a participant in it. This week's news shows what that requires in practice: evidence before a fix ships, governance over who is acting, hard limits on what an agent may touch, and a budget that someone is accountable for. The tools are arriving. The operating model is still each company's job.

## AWS Continuum: security fixes with proof — and a price per finding

AWS made Continuum for code vulnerabilities generally available in US East (N. Virginia) and US West (Oregon). It validates findings by running the exploit in an isolated sandbox, attaches proof-of-concept code and opens fixes as pull requests ([infoq.com](https://www.infoq.com/news/2026/11/aws-continuum-ga/)). Pricing combines a context fee of $200 per million lines of code per month with $10 per inference unit; AWS's own example of 100 million lines and 10,000 vulnerabilities reaches $218,200, roughly $20 per validated finding.

**Impact for companies:** "proven exploitable" is a far better prioritization signal than a severity score, and it can shrink the noise that drowns security teams.

**Risks and opportunities:** cost scales with finding volume, so a noisy codebase gets an expensive bill. Findings Continuum cannot prove still need an owner, or they quietly become the "safe" pile.

**My take:** run it on one critical service first and compare cost per closed vulnerability with your current process. Before granting autonomous merges, define the acceptance test for a fix class — including proof that behavior did not change.

## GitLab 19.5: external agents enter the governance perimeter

GitLab 19.5 made its MCP server generally available and now lets Claude Code, Cursor and Codex connect through the GitLab CLI, recording the user, agent, project and timing of qualifying sessions in its AI Governance Dashboard, with audit events streamable to a SIEM ([infoq.com](https://www.infoq.com/news/2026/11/gitlab-19-5-agentic-platform/)). Administrators can choose which MCP toolsets to expose; a new auto mode in Duo CLI ships disabled by default; and GitLab Secrets Manager, built on OpenBao, is now GA.

**Impact for companies:** agent activity becomes auditable in the same place as the code, pipelines and secrets it touches.

**Risks and opportunities:** visibility is not control. The opportunity is least privilege by configuration — fewer tools exposed means less context consumed and fewer actions possible.

**My take:** the competition is shifting from "which assistant writes better code" to "which platform is the safest place for agents to work." I would start with the inventory: which agents run against which repositories today, and under whose identity.

## Inkitt: the model was the easy part

Inkitt built a one-shot PR creator that takes small, low-risk tasks from Slack, Linear or an API call to a draft pull request ([infoq.com](https://www.infoq.com/news/2026/11/inkitt-one-shot-pr-creator-agent/)). An event-driven orchestrator persists each run, coordinates short-lived agent containers with short-lived tokens, caps verification and CI repair at two attempts, and rejects tasks involving migrations, authentication, payments, CI configuration or new packages. The system cannot merge its own changes. Its lead engineer summed it up: "The model was the easy part."

**Impact for companies:** the engineering effort is in idempotency, retry budgets, permissions and state — classic distributed-systems work.

**Risks and opportunities:** without explicit scope boundaries, "small changes" grow. The opportunity is a reusable pattern: deny-list sensitive paths, check the real diff, keep humans on the merge.

**My take:** this is the most transferable case of the week. Start with a deny-list, not an allow-everything mindset.

## GitHub Actions lockfiles reach GA

GitHub made workflow dependency lockfiles generally available: an `actions.lock` file records the exact commits of direct and transitive action dependencies, so tags and branches can no longer shift underneath a pipeline ([infoq.com](https://www.infoq.com/news/2026/11/github-actions-lockfiles-ga/)). A CLI extension generates and verifies the file, Dependabot updates it in the same pull request, and admins can enforce a "Require lockfile" policy.

**Impact for companies:** a long-standing supply-chain gap closes without sacrificing readable version tags.

**Risks and opportunities:** a lockfile guarantees reproducibility, not safety. Teams that auto-merge Dependabot updates will lock in a malicious commit just as reliably as a good one.

**My take:** onboard release and deployment workflows first, add the verification step as a CI gate, and treat the Dependabot pull request as a real review point.

## GitHub rebuilds Git storage for agent scale

GitHub detailed "Rubicon," its new Git storage architecture: in internal tests it supported 5,000 concurrent agents and 7,200 pushes per second to a single repository ([github.blog](https://github.blog/engineering/architecture-optimization/inside-githubs-new-git-storage-architecture/)). The key insight is that only reference updates need coordination; packs live in Azure Blob Storage, references in a replicated compare-and-swap log, and disposable "virtual replicas" serve traffic. GitHub says one repository's traffic grew about 4x between March and May.

**Impact for companies:** if GitHub plans for two orders of magnitude more writes, your CI, artifact storage and code-review capacity should be part of the same conversation.

**Risks and opportunities:** every push triggers CI runs and fetches, so agent volume amplifies downstream cost. The opportunity is a sound architecture lesson: separate the small piece of state that needs agreement from the bulk data that does not.

**My take:** the bottleneck will not be the Git server. It will be your pipeline bill and your reviewers.

## Apple puts a daily cap on AI spend

Apple cut the daily AI spending cap for its engineering teams from $300 to $200 in October, with some allowances heading to $100 and limits as low as $25 a day under consideration outside engineering, according to Bloomberg as reported by TechCrunch ([techcrunch.com](https://techcrunch.com/2026/11/04/apple-is-reportedly-cutting-budgets-for-its-internal-ai-usage/)).

**Impact for companies:** "use AI as much as possible" is giving way to token rationing, even at companies with deep pockets.

**Risks and opportunities:** flat caps penalize high-value use as much as waste. The opportunity is to tie budgets to outcomes rather than to headcount.

**My take:** a cap is a blunt instrument, but it beats an unmanaged bill. Pair it with a measure of value, or you will only learn which teams hit the limit first.

## Copilot metrics start measuring whether review comments land

GitHub's repository-level Copilot usage metrics now report how many Copilot code review comments developers acted on — an addressed rate — broken down by severity, comment type and customization, plus how many reviewed pull requests merged with no later human change request ([github.blog](https://github.blog/changelog/2026-11-05-usage-metrics-api-adds-code-review-details-and-addressed-rate)).

**Impact for companies:** for the first time, AI review value can be tracked per repository with something better than "suggestions applied."

**Risks and opportunities:** comments are counted on merge day and mostly exclude bot-opened pull requests, so trends need context. The opportunity is to test whether custom instructions actually improve signal.

**My take:** this is the metric I would bring to the budget discussion. Low addressed rate means noise you are paying for.

## The trend to watch

The pattern across this edition is consistent: agents are being admitted into the delivery pipeline on the condition that they bring proof, identity, boundaries and a cost owner. Over the next quarters, the advantage will go to teams that define those conditions in policy and metrics before the agent volume arrives — not after the first incident or the first surprising invoice.
