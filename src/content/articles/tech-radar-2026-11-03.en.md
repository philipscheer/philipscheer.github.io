---
title: 'Tech Radar — Agents need a control plane, not more autonomy'
description: 'This edition: AWS turns Step Functions workflows into agent tools, Uber governs 5,000+ agent tools behind an MCP gateway, GitHub blocks pull_request_target by default, Atlassian finds AI time savings collapsing into review work, Big Tech AI capex strains free cash flow, and LinkedIn traces the member journey end to end with OpenTelemetry.'
date: '2026-11-03'
tags: ['Tech Radar', 'AI engineering', 'agentic AI', 'MCP', 'DevSecOps', 'FinOps', 'observability', 'engineering leadership']
---

The common thread this week is that the interesting work in AI has moved from the model to the plumbing around it. The companies getting results are not handing agents more freedom; they are putting registries, gateways, policies and measurement between the agent and the systems it touches. That is architecture and governance work.

## AWS turns existing Step Functions workflows into agent tools

AWS made Step Functions workflows available as AI agent tools through Amazon Bedrock AgentCore Gateway, which exposes them over the Model Context Protocol (MCP) ([aws.amazon.com](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-gpt-6-1-terra-on-bedrock-step-functions-as-agent-tools-and-more-november-2-2026/)). In the same roundup, AWS describes how MoEngage exposed roughly 400 internal API operations as agent tools and estimates it saved about six months of platform engineering.

**Impact for companies:** the integration cost of agents drops sharply when you can reuse workflows that already carry your business rules, approvals and audit trail.

**Risks and opportunities:** the risk is exposing workflows with side effects (refunds, provisioning) without rate limits or human checkpoints. The opportunity is that your most battle-tested processes become the agent's guardrails.

**My take:** this is the right division of labor. Let the model choose *what* to do and keep *how* it is done in deterministic code you already test and observe. If a refund requires eligibility check, approval and credit in that order, that order should never be the model's to improvise.

## Uber puts 5,000+ agent tools behind an MCP gateway

Uber built an MCP Gateway that serves more than 800 MCP servers and 5,000 tools, separating a registry (control plane) from a proxy that translates calls to HTTP, gRPC or TChannel ([infoq.com](https://www.infoq.com/news/2026/11/uber-mcp-gateway-ai-agents/)). Tools discovered automatically stay disabled until the owning team enables them. The gateway enforces authorization per server and per tool, redacts PII in responses, and lets agents discover tools incrementally instead of loading the whole catalog into context.

**Impact for companies:** MCP sprawl is the new microservice sprawl. Without a central registry, every team ships its own server, its own auth and its own data-leak surface.

**Risks and opportunities:** the risk is shadow tooling with production credentials. The opportunity is reusing a pattern you already know — the API gateway — with ownership, enablement and observability built in.

**My take:** this looks exactly like the API gateways we built a decade ago, and that is a compliment. The detail I would copy first is "disabled until the owner opts in." It costs almost nothing and turns tool exposure into an explicit, reviewable decision.

## GitHub will block `pull_request_target` by default on December 2

Starting December 2, 2026, GitHub Actions will block `pull_request_target` events by default in all public repositories unless an Actions event policy explicitly allows them ([github.blog](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2)). Two brownouts will enforce the rule temporarily on November 9 and November 16, from 16:00 to 18:00 UTC. Private and internal repositories are not affected.

**Impact for companies:** any open source project or public SDK that relies on this trigger for labeling, previews or bots will see failed runs during the brownouts.

**Risks and opportunities:** the risk is discovering the dependency in the middle of a release. The opportunity is a forced audit of a trigger that runs with base-repository secrets and has been a recurring supply-chain attack vector.

**My take:** secure-by-default with a scheduled brownout is how platform changes should be rolled out. Check the Insights view this week, allow only the specific workflows that truly need the trigger, and treat the rest as debt you just paid off for free.

## Atlassian: AI time savings are collapsing into review work

Atlassian's State of Developer Experience 2026 reports that the share of developers saving ten or more hours a week with AI fell from 68% to 26% year over year, while adoption reached 95% ([infoq.com](https://www.infoq.com/news/2026/10/atlassian-devex-2026/)). Forty-nine percent of developers now spend four or more hours a week managing AI tools, 65% spend time correcting output that missed the intent. The report is vendor research based on self-reported data, and Atlassian itself warns against reading it as causal.

**Impact for companies:** the bottleneck moved from writing code to reviewing it. Teams that measure AI usage as a productivity signal are incentivizing the wrong behavior — 41% of developers admit to using AI more than necessary because it is expected.

**Risks and opportunities:** the risk is senior engineers becoming full-time reviewers of generated code. The opportunity is clear: among developers with a clear, implemented AI strategy, 41% report less friction, against 22% where the strategy is inconsistent.

**My take:** measure accepted work, not tokens or prompts. Design the review step explicitly — small diffs, tests first, a `design.md` before generation — instead of letting reviewers absorb whatever the agent produces.

## The AI capex boom is starting to show up in cash flow

Alphabet, Amazon, Meta and Microsoft outlined plans to spend more than $740 billion on capital expenditures this year, and investors are reacting to the cost ([techcrunch.com](https://techcrunch.com/2026/10/30/cracks-are-emerging-in-the-ai-spending-boom/)). Alphabet reported negative free cash flow of $9.1 billion in the third quarter, Amazon reported negative $42.4 billion over the trailing twelve months.

**Impact for companies:** providers that are spending at this rate will need to recover it, and that pressure eventually reaches price lists, commitments and discount negotiations.

**Risks and opportunities:** the risk is locking into multi-year AI commitments at today's assumptions. The opportunity is price competition at the model tier — AWS notes that GPT-6.1 Terra arrived on Bedrock with token prices at least 50% lower than the model beside it.

**My take:** I would not try to time the market, but I would keep options open. Abstract model access behind a gateway, track unit cost per business outcome, and keep the classic FinOps wins running — the same AWS roundup shows a 70% storage reduction on 5.8 PB of logs simply by proving access patterns before moving data.

## LinkedIn traces the member journey from tap to backend

LinkedIn built an OpenTelemetry-based platform that links what members do in iOS, Android and web apps with the backend services handling those requests ([infoq.com](https://www.infoq.com/news/2026/11/linkedin-opentelemetry-journey/)). A `pageForestId` groups the many traces a single page generates, and coordinated head sampling keeps client and server decisions consistent. LinkedIn estimates that up to 90% of some backend trace volume could be treated as debug-level data.

**Impact for companies:** most incident time is lost between "the user saw an error" and "this service failed."

**Risks and opportunities:** the risk is telemetry cost and traces becoming a channel for sensitive data. The opportunity is a vendor-neutral foundation, with allowlists and redaction designed in from day one.

**My take:** the 90% figure is the headline for any FinOps conversation about observability. Decide what is quality-of-experience signal and what is debug noise, sample accordingly, and standardize on OpenTelemetry so the backend you store it in remains a commercial choice, not a rewrite.

## The trend to watch

Every story this week answers the same question: who controls what the system is allowed to do? Over the next quarter, the advantage will go to teams that treat agent access like any other production interface — registered, owned, authorized, observed and priced — rather than to teams that simply buy the most capable model.
