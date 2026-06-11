---
title: 'Architecture is your best FinOps tool: how we scaled 10x and cut cost by 57%'
description: 'Right-sizing and savings plans have a ceiling. The big cloud savings live in architecture decisions — a real case scaling a platform from 100K to 1M+ concurrent users while cutting operating cost in half.'
date: '2026-06-09'
tags: ['FinOps', 'cloud architecture', 'cost optimization', 'real-time systems']
---

Most FinOps programs start — and stall — at the same place: right-sizing instances, deleting orphaned volumes, buying savings plans. Worth doing. Typically worth 15–25%. And then the curve flattens, because the remaining cost is not waste. It is architecture.

The real case: a real-time sports data platform that needed to grow from 100K to more than 1M concurrent users. The naive path — scale the existing architecture 10x — would have scaled the bill 10x. Instead, we redesigned, and ended with **10x the scale at roughly 57% lower operating cost** (about 2.3x cheaper).

## Where the money actually was

Three architecture decisions made the difference:

**1. Fan-out as a dedicated layer.** Pushing live updates to every connected client from application servers is comfortable and ruinously expensive — application instances are priced for business logic, not for holding a million idle sockets. We split connection handling into lean Go services dedicated to WebSocket fan-out and push, fed by Redis pub/sub. Connections became nearly free; business logic stayed where it belongs.

**2. One ingestion, many consumers.** Sports data arrives once (a gRPC/Protobuf dataloader), is normalized in a Python/FastAPI hub, and is distributed internally. No service fetches the same external data twice; nothing recomputes what a neighbor already computed. Deduplicating work is deduplicating cost.

**3. The right runtime for each job.** A polyglot stack is governance overhead — worth paying only where the economics demand it. Go where connection density rules, Python where integration speed rules, Java/Spring WebFlux where streaming backpressure rules. Each service runs on the cheapest runtime that meets its P99.

The same P99 target under 300ms survived the 10x growth. Cost per concurrent user dropped by an order of magnitude.

## What this means for your FinOps practice

- **Put cost on the architecture review agenda.** Every significant design review in my teams answers: what does this cost at 10x the load? ADRs include a cost consequence, not just a technical one.
- **Measure cost per workload, not per account.** Account-level bills hide the one service that costs more than the other twenty. Per-workload visibility is what turns FinOps from accounting into engineering.
- **Treat cost as a non-functional requirement.** It belongs in the `design.md`, with a number, next to latency and availability. What has a target gets designed for; what is invisible gets discovered in the invoice.
- **Redesign beats discount.** A savings plan makes the wrong architecture 30% cheaper. A redesign can make it 60% cheaper and faster. Run the architecture conversation before the procurement one.

The mindset shift is simple: the cheapest infrastructure is the infrastructure your design no longer needs. Right-size at the margins — but when the bill is the problem, the architecture is the answer.
