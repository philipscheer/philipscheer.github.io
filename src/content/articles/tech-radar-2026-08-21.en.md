---
title: 'Tech Radar — The bill for agent-scale engineering'
description: 'This edition: GitHub publishes a capacity postmortem, JetBrains puts weekly agent use at 90%, Cursor launches a GitHub rival, Cloudflare turns standards into enforcement, AWS gives agents 14-day runtimes, Wiz finds S3 clones missing S3 security, and Azure DevOps ships an MCP server no third-party client can use.'
date: '2026-08-21'
tags: ['Tech Radar', 'AI engineering', 'agentic coding', 'platform engineering', 'cloud', 'security', 'engineering leadership']
---

The thread this week is the invoice. Agents are now writing code at a volume the surrounding infrastructure was never sized for — and the failures showing up are not model failures. They are capacity failures, review failures, identity failures and security-assumption failures. This is a week for platform and governance decisions, not tool decisions.

## GitHub's outage was a capacity failure, not a bad deploy

GitHub CTO Vlad Fedorov published a postmortem on the August 17 outage: 7 hours 47 minutes of disruption across github.com, authentication, Actions, APIs, pull requests, issues and Copilot ([github.blog](https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead/)). A critical component in the Central US data center failed to scale at a new traffic peak, and capacity pressure cascaded into authentication failures. Copilot's recovery was prolonged by a client-side retry loop that amplified traffic during restoration. The context is the real story: monthly commits went from 1.4 billion in April to 2.9 billion, and Azure now carries roughly 58% of platform load, up from 12% in May.

**Impact for companies:** the single most load-bearing dependency in most engineering organizations is being re-platformed mid-flight while its traffic doubles.

**Risks and opportunities:** the risk is that your own CI, release and on-call flows assume GitHub availability with no degraded mode. The opportunity is that GitHub named the amplification pattern out loud — retry storms during recovery — and most teams have that same bug in their own clients.

**My take:** Fedorov's own line is that neither this nor the August 6 incident was caused by a code or config change. That is the sentence to bring to your next architecture review. Agent traffic doubles commit volume without doubling headcount, and capacity planning is the discipline that quietly stops being done when everything is elastic. Check your retry policy for exponential backoff and jitter this week — it costs an afternoon and it is the difference between a slow recovery and a self-inflicted second outage.

## Weekly agent use hits 90% — and the leaderboard flipped

JetBrains published its Developer Ecosystem Survey 2026: 15,000+ professional developers, fielded May–July, reweighted for global representation ([blog.jetbrains.com](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)). Ninety percent use AI coding agents at work at least weekly, 68% daily. Claude Code reached 39% global adoption, up from 18% in January, and 47% in the US. Codex grew roughly 5x, from 3% to 16%. GitHub Copilot fell from 29% a year ago to 21%, despite 79% awareness — awareness was never the constraint.

**Impact for companies:** agent tooling is no longer a pilot line item. It is a standing licence cost with real switching friction and real interop questions.

**Risks and opportunities:** the risk is paying for an incumbent seat nobody opens while shadow-purchasing the tool the team actually uses. The opportunity is renegotiating from a position of evidence.

**My take:** the number that should move budgets is not 39%, it is Copilot's 21% against 79% awareness. Developers know the product and are choosing something else. Before renewal, pull your own usage telemetry rather than your own assumptions, and standardise on interop — the Agent Client Protocol — instead of on a vendor.

## Cursor launches Origin, a GitHub alternative

Cursor launched Origin, a code hosting platform covering repositories, browsing, collaboration and pull requests ([techcrunch.com](https://techcrunch.com/2026/08/18/cursor-capitalizes-on-github-frustration-launches-rival-hosting-platform/)). It is deliberately interoperable: connect GitHub, pick an org, sync selected repos, run both. It launched the same day GitHub went down, and TechCrunch cites a LeadDev analysis counting 257 GitHub outages over the past year.

**Impact for companies:** a credible SCM alternative positioned on reliability and agent-native workflows, for the first time in years.

**Risks and opportunities:** the risk is a reactive migration priced in months of lost delivery to solve a problem that a degraded-mode runbook solves in a week. The opportunity is that interoperability makes evaluation cheap.

**My take:** launch timing this good is either luck or patience, and neither is a reason to migrate. Source control is the last place to chase novelty. Sync one non-critical repo, measure, and keep the option open — that is the whole investment worth making right now.

## Cloudflare turns engineering standards into an enforcement layer

Since January, Cloudflare's AI code reviewer has flagged almost 230,000 deviations from engineering standards, with nearly 16,000 resulting in approval being withheld ([infoq.com](https://www.infoq.com/news/2026/08/cloudflare-ai-enforcement/)). Standards live in a central repository — the Cloudflare Codex — written as structured RFCs with requirements classified SHOULD or MUST, explicit owners and lifecycle states. New standards move through guidance, then observation, then enforcement. Deterministic rules stay with linters and static analysis; AI is used only where contextual judgement is needed.

**Impact for companies:** this is a published, concrete answer to governing code review at agent-generated volume.

**Risks and opportunities:** the risk is skipping straight to enforcement and turning the platform team into the department of no. The opportunity is that MUST/SHOULD plus staged rollout is copyable next quarter with no new vendor.

**My take:** the design choice I would steal is not the AI reviewer — it is making standards machine-readable with an owner and a lifecycle. Most engineering standards fail because they live in a wiki nobody owns. Write the taxonomy first, run it in observation mode for a quarter, and only then let it block. And keep the linters doing what linters do: a model is the wrong tool for a deterministic rule.

## AWS gives agents 14-day runtimes — and a FinOps threshold

Bedrock AgentCore added runtime instances: agents on managed EC2 in the customer's account, alongside the existing serverless microVMs capped at 8 hours ([infoq.com](https://www.infoq.com/news/2026/08/aws-bedrock-agentcore-runtime/)). Sessions can run up to 14 days with shared file systems and GPU instance types, and multiple agents can co-locate and collaborate through a shared session directory instead of calling each other's APIs. A new capacity provider primitive handles instance families, networking, storage and target utilisation, removing Auto Scaling groups and AMI pipelines. InfoQ cites a break-even near 24% sustained CPU utilisation versus microVMs, before Savings Plans.

**Impact for companies:** long-running, stateful multi-agent workloads no longer require a parallel EC2 fleet and its operational overhead.

**Risks and opportunities:** the risk is a 14-day session limit read as a licence to keep expensive capacity warm. The opportunity is a real utilisation number to decide with.

**My take:** 24% is the kind of figure I want on a slide. It converts an architecture argument into arithmetic: measure sustained utilisation per workload, put anything below the line on serverless, and provision only what is genuinely above it. The multi-agent shared filesystem is the more interesting design shift — coordination through state rather than through APIs — and it deserves a spike before it becomes a pattern by accident.

## S3-compatible does not mean S3-secure

Wiz researchers, led by Scott Piper, compared S3-compatible services from Nebius, Crusoe, Vultr, Lambda Labs, Cloudflare R2 and DigitalOcean against Amazon S3 ([infoq.com](https://www.infoq.com/news/2026/08/s3-clone-security/)). S3 and its related services carry nearly 300 APIs; clones implement a subset, sometimes with surprising semantics. Public-access behaviour diverges sharply across providers. More seriously, access keys generally lack structured formats, so GitHub secret scanning and most other scanners cannot detect them. Corey Quinn reported that on one provider, `delete-bucket-policy` deleted the entire bucket.

**Impact for companies:** every team moving AI and GPU workloads to neoclouds for cost reasons is carrying AWS security assumptions that do not exist there.

**Risks and opportunities:** the risk is a leaked credential your scanners are structurally blind to. The opportunity is catching this during the migration design rather than during the incident.

**My take:** this is the hidden cost line in a neocloud business case, and it never appears in the pricing comparison. If you are evaluating one, write down the three controls you actually depend on — block public access, secret scanning, least-privilege IAM — and verify each one exists before signing. A 40% compute saving does not survive one public bucket.

## MCP standardised tools, not identity

The Azure DevOps Remote MCP Server reached GA at `https://mcp.dev.azure.com/{organization}`, exposing work items, pull requests, repos and pipelines with one `mcp.json` entry ([infoq.com](https://www.infoq.com/news/2026/08/azure-devops-remote-mcp-ga/)). Authentication is Microsoft Entra, and that is the blocker: per PM Dan Hellem, Claude Desktop, Claude Code, ChatGPT and Cursor require dynamic client registration or Client ID Metadata Documents, neither of which Entra supports yet. Working clients today are all Microsoft. The MCP 2026-07-28 spec, released a week earlier, deprecated dynamic client registration outright.

**Impact for companies:** teams standardised on non-Microsoft agents keep hosting and credentialing their own MCP servers while Copilot users get zero-install access.

**Risks and opportunities:** the risk is treating "MCP support" in a vendor roadmap as a portability guarantee. The opportunity is asking the auth question during evaluation, when it is still cheap.

**My take:** MCP solved tool discovery and left identity to each vendor, which means the integration tax moved rather than disappeared. When a vendor claims MCP support, the only question that matters is which clients can actually authenticate today. Also worth noting this week: **Go 1.27** shipped generic methods, `encoding/json/v2` backing the existing package for a free unmarshal speedup, a GA `goroutineleak` profile, and post-quantum ML-DSA in `crypto/x509` and `crypto/tls` ([go.dev](https://go.dev/blog/go1.27)).

## What to watch

The trend to track is governance catching up to generation. Cloudflare's enforcement layer, GitHub's capacity admission and the retry-storm amplification are all the same story from different angles: the constraint has moved from producing code to absorbing it. Volume is no longer scarce, and everything downstream of volume — review capacity, platform headroom, credential hygiene, cost per unit of work — is. If your 2027 planning still frames AI as a productivity gain, reframe it. The gain is real and largely captured; the bill lands on the platform, and that is where the next two quarters of engineering investment belong.
