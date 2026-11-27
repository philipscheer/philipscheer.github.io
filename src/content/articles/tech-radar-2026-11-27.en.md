---
title: 'Tech Radar — Approval is the new bottleneck'
description: 'This edition: Meta and PyTorch let an AI reviewer approve low-risk PRs, Anthropic launches Claude Ship with policy-based approvals, QCon SF asks how to kill the code review, Netflix measures the blast radius of API changes, GitHub moves Copilot review billing to the organization, AWS Lambda doubles its timeout and 1Password is breached through a GitHub account.'
date: '2026-11-27'
tags: ['Tech Radar', 'AI engineering', 'code review', 'agentic AI', 'DevSecOps', 'FinOps', 'serverless', 'engineering leadership']
---

Writing code stopped being the constraint a while ago. This week the industry moved on to the next one: deciding what is safe to merge. Meta, PyTorch, Anthropic and OpenAI all describe ways to let machines approve routine changes, while the bills, the blast radius and the source-control attack surface land on the organization. The question for leaders is no longer "should AI review code?" but "which changes can pass on evidence alone, and who owns that rule?".

## Meta and PyTorch let an AI reviewer approve low-risk PRs

PyTorch's GreenLight now approves pull requests from its own maintainers, an open-source take on RADAR, the system Meta uses to auto-land low-risk diffs ([infoq.com](https://www.infoq.com/news/2026/11/uber-agent-spend-steady/)). Meta's paper starts from a capacity problem: lines of code per human-landed diff rose 105.9% year over year, with more than 80% of the increase attributed to agentic AI. RADAR combines hard eligibility limits, a percentile-based Diff Risk Score and an LLM reviewer that needs a confidence of at least 8/10; approved diffs still wait in a delayed landing queue.

**Impact for companies:** auto-approval is moving from experiment to documented practice, and it comes with a reference design — trust the author, score the risk, classify the change, delay the landing.

**Risks and opportunities:** the risk is copying the outcome without the guardrails: Meta excludes SOX-scoped and open-source code and requires a 60-day clean record per runbook. The opportunity is reclaiming senior review time for the changes that deserve it.

**My take:** the most valuable idea here is not the LLM, it is the risk score and the delay. Any team can start with deterministic codemods and dependency bumps, measure reverts for a quarter, and only then widen the gate.

## Anthropic launches Claude Ship with policy-based approvals

Anthropic launched Claude Ship, a suite that pairs its generally available Code Review with two beta agents: PR Steward, which fixes failing CI, merge conflicts and review feedback, and Claude Approvals, which approves changes based on a policy written as a file in the repository ([techcrunch.com](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes/)). Anthropic recommends starting in observe-only mode, on one repository, with monthly spending limits.

**Impact for companies:** approval authority becomes a versioned artifact. That is good governance — it can be reviewed, diffed and audited like any other code.

**Risks and opportunities:** a natural-language policy is still ambiguous, and an approval agent from the same vendor that wrote the code is not independent evidence. The opportunity is that observe-only mode gives you a free baseline: how often would the agent have approved something a human later rejected?

**My take:** I would run it in shadow mode for 30 days and publish the disagreement rate to the team before granting any real approval rights. No data, no delegation.

## QCon SF: how to kill the code review

Aviator CEO Ankit Jain argued that line-by-line review is already fading: a Faros study of 4,000+ teams found over 75% of PRs merge without human review, while the median PR is now 640 lines — well past the ~400 where review quality drops ([infoq.com](https://www.infoq.com/news/2026/11/qcon-sf-26-kill-code-review/)). He proposes six layers — argue, capture, codify, prove, debate, own — and reports his team merges four times more PRs with about 40% fewer reverts. He also flagged his own conflict of interest.

**Impact for companies:** if most PRs already merge unreviewed, the real control is whatever runs before the merge. Codifying recurring review comments into invariants — Aviator mined 11,000 comments into 64 rules — turns tribal knowledge into checks.

**Risks and opportunities:** "review theater" is the risk: agents write, agents review, humans skim. The opportunity is evidence over green checks — screenshots, recorded requests, latencies — because the agent that wrote the code likely wrote its tests.

**My take:** his outage story is the lesson. An unindexed query passed every filter; the post-mortem asked which rule was missing, not who approved it. That is the right blameless question, and it only works if rules have owners.

## Netflix measures the blast radius of API changes

Netflix built Quasar, which indexes symbol definitions and references with SCIP during CI, stores them as Parquet in S3 and queries them with Athena to show which repositories actually call an API before a change ships ([infoq.com](https://www.infoq.com/news/2026/11/netflix-quasar-api-impact/)). One example showed a deprecated method removal affecting 137 repositories across three library versions. Findings are exposed via REST, GraphQL and an MCP server for coding agents.

**Impact for companies:** impact analysis becomes data, not guesswork, and it is built on cheap, serverless storage and query.

**Risks and opportunities:** Netflix is explicit that absence of references does not prove an API is unused — reflection, stale indexes and rare batch paths stay invisible. The opportunity is feeding this context to agents before they open a PR.

**My take:** this is exactly the kind of signal an auto-approval policy needs. "Low risk" should mean "low blast radius", and you can only claim that if you measure it.

## GitHub moves Copilot code review billing to the organization

Starting December 30, 2026, Copilot code reviews for licensed members with no saved billing choice will be charged to the organization that owns the repository, not to the member's entitlement ([github.blog](https://github.blog/changelog/2026-11-25-copilot-code-review-billing-will-default-to-the-organization)). Organizations that want the current behavior must select **Member** before then; GitHub notes organization billing requires AI Credits paid usage and can increase spending.

**Impact for companies:** automated review is becoming a metered line item on the company bill, with a default that changes without anyone touching a setting.

**Risks and opportunities:** silent defaults are how cloud bills surprise finance. The opportunity is to make the decision explicit and attach a budget owner.

**My take:** add this to the December checklist today. Whatever you choose, choose it on purpose — and track cost per reviewed PR next to revert rate.

## AWS Lambda doubles its timeout to 30 minutes

AWS raised the maximum timeout of on-demand Lambda Event Functions from 15 to 30 minutes in all commercial regions, with no opt-in and no new pricing ([infoq.com](https://www.infoq.com/news/2026/11/aws-lambda-30-minute-timeout/)). AWS itself lists the side effects: twice the concurrency at the same request rate, SQS visibility timeouts of up to three hours, and some Kafka and MQ mappings that must be recreated.

**Impact for companies:** long agent chains, transcoding and batch jobs can stay on Lambda instead of moving to Fargate or ECS.

**Risks and opportunities:** a function that times out three times asynchronously has run 90 minutes before reaching the dead-letter queue, billed at full memory. The opportunity is simpler architecture for genuinely bursty, long tasks.

**My take:** more runway is not a fix for slow code behind an API. Before raising a timeout, I would check cost per invocation and idempotency; for multi-step work, Step Functions remains the cleaner answer.

## 1Password breached through an employee's GitHub account

1Password detected an intrusion on November 19: an attacker used an employee's corporate GitHub account to push malicious code to internal servers and download customer names, login emails and account activity dates ([techcrunch.com](https://techcrunch.com/2026/11/25/1password-said-hackers-broke-into-its-internal-systems-but-customer-passwords-are-safe/)). The company says vaults, passwords and secret keys were never accessible.

**Impact for companies:** source control is production. An account that can push code that reaches internal servers is a privileged identity, whether it belongs to a person or an agent.

**Risks and opportunities:** as approvals become automated, a compromised identity can move faster through the pipeline. The opportunity is to treat merge rights, deploy paths and signing as security controls, not developer convenience.

**My take:** this is the counterweight to the rest of the edition. Every auto-approval policy must answer: what happens if the author is not who we think it is?

## The trend to watch

Review is being rebuilt as a system: trust tiers, risk scores, codified invariants, evidence and delayed landing — with humans focused on decisions, not diffs. The winners in 2027 will be teams that can prove, with data, which changes are safe to automate, and that price that automation as clearly as they price compute. Delegating approval is fine; delegating accountability is not.
