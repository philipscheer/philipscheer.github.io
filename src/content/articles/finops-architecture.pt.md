---
title: 'Arquitetura é sua melhor ferramenta de FinOps: como escalamos 10x cortando 57% do custo'
description: 'Right-sizing e savings plans têm teto. As grandes economias de cloud vivem nas decisões de arquitetura — um case real escalando uma plataforma de 100K para 1M+ usuários simultâneos com metade do custo de operação.'
date: '2026-06-09'
tags: ['FinOps', 'arquitetura cloud', 'otimização de custos', 'sistemas em tempo real']
---

A maioria dos programas de FinOps começa — e estaciona — no mesmo lugar: right-sizing de instâncias, exclusão de volumes órfãos, compra de savings plans. Vale a pena fazer. Normalmente vale de 15 a 25%. E então a curva achata, porque o custo restante não é desperdício. É arquitetura.

O case real: uma plataforma de dados esportivos em tempo real que precisava crescer de 100K para mais de 1M de usuários simultâneos. O caminho ingênuo — escalar a arquitetura existente 10x — teria escalado a fatura 10x. Em vez disso, redesenhamos, e terminamos com **10x a escala a cerca de 57% menos custo de operação** (aproximadamente 2,3x mais barato).

## Onde o dinheiro realmente estava

Três decisões de arquitetura fizeram a diferença:

**1. Fan-out como camada dedicada.** Empurrar atualizações ao vivo para cada cliente conectado a partir dos servidores de aplicação é confortável e ruinosamente caro — instâncias de aplicação são precificadas para lógica de negócio, não para segurar um milhão de sockets ociosos. Separamos o tratamento de conexões em serviços Go enxutos dedicados a fan-out WebSocket e push, alimentados por Redis pub/sub. Conexões ficaram quase de graça; a lógica de negócio ficou onde pertence.

**2. Uma ingestão, muitos consumidores.** Os dados esportivos chegam uma vez (dataloader gRPC/Protobuf), são normalizados em um hub Python/FastAPI e distribuídos internamente. Nenhum serviço busca o mesmo dado externo duas vezes; nada recomputa o que o vizinho já computou. Deduplicar trabalho é deduplicar custo.

**3. O runtime certo para cada trabalho.** Stack poliglota é overhead de governança — vale pagar apenas onde a economia exige. Go onde densidade de conexões manda, Python onde velocidade de integração manda, Java/Spring WebFlux onde backpressure de streaming manda. Cada serviço roda no runtime mais barato que atende seu P99.

A mesma meta de P99 abaixo de 300ms sobreviveu ao crescimento de 10x. O custo por usuário simultâneo caiu uma ordem de magnitude.

## O que isso significa para a sua prática de FinOps

- **Coloque custo na pauta da revisão de arquitetura.** Toda revisão de design relevante nos meus times responde: quanto isso custa com 10x a carga? ADRs incluem consequência de custo, não só técnica.
- **Meça custo por workload, não por conta.** Faturas no nível da conta escondem o serviço que custa mais do que os outros vinte juntos. Visibilidade por workload é o que transforma FinOps de contabilidade em engenharia.
- **Trate custo como requisito não funcional.** Ele pertence ao `design.md`, com um número, ao lado de latência e disponibilidade. O que tem meta é projetado; o que é invisível é descoberto na fatura.
- **Redesenho vence desconto.** Um savings plan torna a arquitetura errada 30% mais barata. Um redesenho pode torná-la 60% mais barata e mais rápida. Faça a conversa de arquitetura antes da de procurement.

A mudança de mentalidade é simples: a infraestrutura mais barata é a que o seu design deixou de precisar. Faça right-sizing nas margens — mas quando a fatura é o problema, a arquitetura é a resposta.
