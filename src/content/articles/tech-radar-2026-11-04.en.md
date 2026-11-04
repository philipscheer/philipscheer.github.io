---
title: 'Tech Radar — Capacity and cost are now design constraints'
description: 'This edition: AWS says committed capacity is largely sold out through 2027, Grok Bot hits a cost wall while power users spend six figures on tokens, Docker argues agent security is an isolation problem, Shopify learns that the repository shows intent and the cluster shows reality, ECS Gateway ships with sharp edges, and GitHub makes cost-center chargeback scriptable.'
date: '2026-11-04'
tags: ['Tech Radar', 'FinOps', 'cloud', 'capacity planning', 'AI engineering', 'agentic AI', 'DevSecOps', 'platform engineering']
---

For a decade, cloud strategy assumed that capacity was infinite and the only question was price. This week's news says otherwise: capacity is being rationed, AI products are hitting their own unit-economics ceiling, and the security model for agents depends on limiting what they can reach. The common lesson is that constraints belong in the architecture, not in the post-mortem.

## AWS: committed capacity largely sold out through 2027

Amazon CEO Andy Jassy said AWS's large committed capacity is largely sold out through 2027, with a good part of 2028 already allocated, while headroom remains reserved for On-Demand, EC2 and Bedrock ([infoq.com](https://www.infoq.com/news/2026/11/aws-capacity-sold-out/)). Analyst David Linthicum argued the headlines overstate it, but practitioners report trouble obtaining On-Demand capacity for ordinary EC2 instances, not only GPUs.

**Impact for companies:** capacity planning returns to the agenda. CI pipelines and autoscaling groups that assume "there is always another instance" may fail at the worst moment.

**Risks and opportunities:** the risk is panic reservations — teams reserving capacity "just in case," which one commenter correctly called an anti-cloud pattern. The opportunity is to diversify instance families and regions and to measure reservation efficiency with tools that already exist, such as EC2 Capacity Manager.

**My take:** I would not sign multi-year commitments based on a headline. I would, however, test instance flexibility in the deployment pipeline this quarter: if your workload only runs on one instance type in one zone, that is a single point of failure you are paying for.

## The AI cost wall arrives — for vendors and for power users

Elon Musk confirmed that Grok Bot usage limits were cut over Halloween weekend because "the cost of serving Grok Bot was unsustainably high relative to revenue"; some users saw their weekly quota jump from 50% to 100% overnight ([techcrunch.com](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/)). In the same days, Y Combinator CEO Garry Tan said he spends roughly $100,000 to $200,000 a year on tokens running agents, and that broad adoption depends on costs coming down ([techcrunch.com](https://techcrunch.com/2026/11/02/y-combinators-garry-tan-uses-ai-agents-so-much-he-spends-up-to-200k-a-year-on-tokens/)).

**Impact for companies:** flat-rate AI subscriptions are a pricing experiment, not a contract you can build a process on. Vendors will change limits when the math stops working — sometimes overnight.

**Risks and opportunities:** the risk is a critical workflow that silently degrades when a quota changes. The opportunity is to treat agent usage like any other variable cost: budget per team, alerting, and a clear view of value per token.

**My take:** a six-figure token bill is fine if it replaces work worth more than that. The problem is that most companies cannot answer that question yet. Before scaling agents, I would instrument cost per accepted outcome — per merged PR, per resolved ticket — and design a fallback for when the provider changes the rules.

## Docker: agent security is an isolation problem, not a prompt problem

Docker published a guide to five agent risks — prompt injection, tool misuse and poisoning, excessive autonomy, credential exposure and data exfiltration — arguing that an agent "has no reliable way to tell a legitimate instruction from an injected one" ([infoq.com](https://www.infoq.com/news/2026/11/docker-ai-agent-security/)). Its examples include an agent with operator-level access that deleted and rebuilt a production environment, causing a thirteen-hour regional outage. Docker recommends disposable sandboxes, short-lived credentials injected at runtime and allow-listed network egress.

**Impact for companies:** the blast radius of an agent equals the permissions it inherits. An agent running with a developer's personal token is that developer, with none of the judgment.

**Risks and opportunities:** community feedback is fair — containers share a kernel, so agents executing code on behalf of other people need microVMs or gVisor-class isolation. The opportunity is that the controls are familiar: least privilege, ephemeral credentials and egress allowlists.

**My take:** "YOLO mode" is acceptable only inside a box you are willing to lose. Match the isolation boundary to the trust boundary, give agents their own identity, and never put production credentials in the context window.

## Shopify: the repository shows intent; the cluster shows reality

Shopify rebuilt its Overexposed scanner — which finds GKE Ingresses and Cloud Run services reachable from the internet without authentication — after the first version, based on repository config, produced false positives and blind spots ([infoq.com](https://www.infoq.com/news/2026/11/shopify-kubernetes-ingresses/)). The new version reads GCP Cloud Asset Inventory and sends one anonymous probe per candidate, cutting inconclusive Ingress verdicts by around 80%. Uncertain evidence stays "inconclusive" rather than defaulting to "protected," and the scanner itself is hardened against SSRF.

**Impact for companies:** config-as-code checks in CI are necessary but not sufficient. Admission controllers, platform tooling and other repositories change what actually runs.

**Risks and opportunities:** the risk is a green dashboard that measures intent. The opportunity is cheap: cloud inventory APIs already exist, and an allowlist with exact host and path makes exceptions explicit and reviewable.

**My take:** the detail I value most is the refusal to call unknown "safe." It is the same discipline I want from AI-generated reports — and Shopify built this tool with AI agents, using mutation testing to catch tests that check the wrong thing.

## Amazon ECS Gateway: useful abstraction, read the limits first

AWS launched Amazon ECS Gateway, an account-level ingress resource where platform teams define networking once and application teams attach services through a connector, at no extra charge beyond the resources it provisions ([infoq.com](https://www.infoq.com/news/2026/11/introducing-amazon-ecs-gateway/)). Each service gets a generated hostname with host-based routing, and the documentation does not cover custom domains. The gateway adds load balancers as they fill but does not consolidate them, so partly filled — and billed — ALBs can accumulate.

**Impact for companies:** the platform/application split is the right model for teams scaling ECS, and preview environments are an immediate fit.

**Risks and opportunities:** the risks are cost drift from unconsolidated ALBs, a limit of 25 services per load balancer, HTTPS on port 443 only, and failures if someone changes managed resources by hand.

**My take:** evaluate managed abstractions by their exit cost, not their demo. Pilot it for ephemeral environments, put an alert on load balancer count, and wait for custom-domain support before migrating customer-facing services.

## GitHub makes cost-center chargeback scriptable

GitHub added a REST endpoint that returns which cost center a user, organization, repository or enterprise team belongs to; previously you had to list every cost center and scan its resources ([github.blog](https://github.blog/changelog/2026-11-03-look-up-a-resources-cost-center-with-the-github-rest-api)).

**Impact for companies:** as Copilot and agent usage becomes a material line item, allocating it to the right team is a prerequisite for any serious conversation about ROI.

**Risks and opportunities:** the risk is resources with no cost center at all — the endpoint returns an empty list, which makes that gap easy to detect. The opportunity is automated showback in the same pipeline that provisions repositories.

**My take:** small API, big governance value. Add a check that fails when a new repository has no cost center. What gets allocated gets managed.

## The trend to watch

Infinite capacity and flat-rate AI were both subsidies, and both are being withdrawn. Over the next two quarters, the teams that win will be the ones that design for scarcity: flexible capacity, AI usage priced per outcome, agents boxed by default and cost allocated from day one.
