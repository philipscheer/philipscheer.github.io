---
title: 'Tech Radar — Your vendors’ incidents are now your incidents'
description: 'This edition: an 18-hour Microsoft cloud outage, a Fireworks AI breach that reached Notion customers, United Airlines blocking personal AI agents, CoreWeave repricing compute, GitHub’s October reliability report, Databricks’ always-on Genie agent and a practical guide to portable agent skills.'
date: '2026-11-13'
tags: ['Tech Radar', 'cloud', 'SRE', 'resilience', 'AI security', 'vendor risk', 'FinOps', 'agentic AI']
---

This week’s pattern is concentration. One cascading failure took Microsoft’s productivity, security and admin tools offline for most of a day; one breached AI provider exposed data from a customer’s customers; one neocloud is rewriting compute pricing. The question for technology leaders is no longer “which vendor is best” but “what happens to us when that vendor has a bad day.”

## Microsoft: an email outage became a cloud-wide incident

What started on Thursday as an Outlook and Teams problem spread into a global outage that also hit files, documents, Copilot, Defender and the Intune admin dashboards ([techcrunch.com](https://techcrunch.com/2026/11/13/microsoft-latest-email-outage-turned-into-a-full-blown-global-cloud-crisis/)). Kentik observed traffic returning after roughly 18 hours. Microsoft cited “a large number of servers being unexpectedly unavailable,” said there was no evidence of malicious activity, and had not yet named a root cause.

**Impact for companies:** when communication, security screening and device management sit with the same provider, one incident removes both the work and the tools you would use to respond to it.

**Risks and opportunities:** the risk is an incident process that assumes Teams and corporate email are available. The opportunity is cheap: an out-of-band channel, offline runbooks and admin break-glass accounts that do not depend on the failing tenant.

**My take:** I would not leave Microsoft over this, but I would test the scenario. Run a one-hour drill with Teams, email and Intune “down” and see who can still declare an incident, reach customers and push a fix.

## Fireworks AI breach reaches Notion customers

Attackers breached Fireworks AI’s cloud provider, reached a development system and took billing information and some customer datasets ([techcrunch.com](https://techcrunch.com/2026/11/12/cyberattack-on-fireworks-ai-allowed-hackers-to-access-notion-customers-chat-transcripts/)). Notion confirmed that about 1% of its customers were affected, including Notion AI “Insights” chat transcripts, and cut all connectivity to Fireworks on November 3. Fireworks believes the goal was reselling stolen LLM access. It is the provider’s second incident in two months.

**Impact for companies:** your AI features inherit the security posture of every inference provider behind them — and so do your customers’ prompts.

**Risks and opportunities:** prompts and outputs are rarely classified as sensitive data, yet they often contain contracts, code and personal information. The opportunity is to add AI providers to vendor reviews with the same rigor as payment processors: retention, sub-processors, breach notification and a tested kill switch.

**My take:** Notion’s fastest control was disconnecting the vendor. Every AI integration should have that switch, plus a fallback model, documented before go-live — not designed during the incident.

## United Airlines blocks personal AI agents

United will restrict unauthorized third-party AI agents from booking flights and managing reservations, both on its own platforms and through agencies and aggregators ([techcrunch.com](https://techcrunch.com/2026/11/12/united-airlines-blocks-ai-agents-from-booking-flights-citing-cybersecurity-risks/)). The airline cites credential sharing, unintended purchases or miles usage, and federal rules that require a human to complete steps such as check-in declarations.

**Impact for companies:** consumer agents are hitting a wall of identity and liability. Any business with logged-in customers will have to decide how agents may act on their behalf.

**Risks and opportunities:** blocking alone pushes agents toward scraping and shared passwords, which is worse. The opportunity is delegated access by design: scoped tokens, spending limits and explicit human confirmation for regulated steps.

**My take:** this is an API product decision disguised as a security policy. Companies that publish a safe, scoped way for agents to transact will capture that traffic; the rest will fight it.

## CoreWeave: prepayments, short contracts and rising prices

CoreWeave reported $3.66 billion in quarterly revenue, up 168%, alongside a $709 million net loss and $846 million in interest expense ([techcrunch.com](https://techcrunch.com/2026/11/11/coreweave-turns-to-customer-prepayments-shorter-contracts-to-fund-ai-growth/)). It expects about $9 billion in customer prepayments over three months, raised prices by roughly 25% in July and another 10% later, and sells short-term capacity above $40 million per megawatt per year versus $20–25 million on four- to five-year contracts.

**Impact for companies:** GPU capacity is being priced like a scarce commodity, and suppliers want customers to fund the build-out.

**Risks and opportunities:** prepayments and long commitments lock in today’s price and today’s provider. Short-term capacity is flexible but expensive. The opportunity is to separate baseline inference, which can be committed, from experiments, which should stay on-demand or on smaller models.

**My take:** before signing any multi-year compute deal, I want a utilization forecast and an exit clause. Paying in advance for capacity you might not use is not cost optimization; it is financing your supplier.

## GitHub’s October report: capacity is not resilience

GitHub disclosed eight incidents in October, including two write outages caused by a new routing node with stale records and an Azure network disruption across all three Central US availability zones ([github.blog](https://github.blog/news-insights/company-news/github-availability-report-october-2026/)). It also cut peak database reads by 85% by moving one 250-million-requests-a-day endpoint. Its stated rule: “availability, then capacity, then features.”

**Impact for companies:** most failures described were retry storms, exhausted connection pools and unsafe maintenance — patterns present in almost every platform.

**Risks and opportunities:** the opportunity is to borrow the fixes directly: randomized reconnect backoff, connection limits, validation of routing changes and automation that honors maintenance pauses.

**My take:** this is one of the best free SRE curricula available. I would put it in the next on-call review and ask, item by item, “could this happen here?”

## Databricks Genie: an always-on agent for executives

Databricks released a revised Genie agent that runs multistep jobs unsupervised, grounded in an ontology built over customer data on its platform ([techcrunch.com](https://techcrunch.com/2026/11/11/databricks-new-ai-agent-tells-ceo-ali-ghodsi-the-unvarnished-truth/)). CEO Ali Ghodsi showed how he uses it to analyze weak survey results and failed sales calls — information that rarely reaches a CEO of a 12,000-person company. Costs, he says, are controlled through usage limits and cheaper open-weight models in Unity Gateway.

**Impact for companies:** agents are moving from engineering into management reporting, where the input is internal data and the output influences decisions.

**Risks and opportunities:** an agent is only as honest as the data and permissions it sees. The opportunity is faster signal for leaders, provided governance and cost caps come first.

**My take:** useful, but it does not replace the culture that makes people report bad news. Use it to find questions, then go and talk to the team.

## GitHub: write agent skills once, keep access in the host

GitHub published a practical guide to agent skills: versioned `SKILL.md` directories that describe a repeatable task and can run across Copilot, Claude Code and Cursor ([github.blog](https://github.blog/ai-and-ml/github-copilot/build-once-run-on-any-agent-a-practical-guide-to-agent-skills/)). Key principles: keep project details in a manifest, keep credentials in the host, separate the verifier from the agent that did the work, and enforce merge requirements in CI rather than in instructions.

**Impact for companies:** institutional knowledge can become reviewable, versioned files instead of repeated chat prompts.

**My take:** “self-verification is not verification” is the line I would put on every team wall.

## The trend to watch

Concentration risk is now an engineering metric. Cloud tenants, AI inference providers and GPU suppliers are becoming single points of failure for operations, data and cost at the same time. The leaders who come out ahead will map these dependencies explicitly, keep a tested exit or fallback for each one, and treat vendor incidents as their own — because customers will.
