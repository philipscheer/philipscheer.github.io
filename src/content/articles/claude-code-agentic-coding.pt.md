---
title: 'Agentic coding com governança: como meus times usam Claude Code em fluxos de produção'
description: 'Assistentes de IA conseguem entregar software de verdade — se você der contexto, limites e quality gates. O modelo operacional que usamos para desenvolvimento assistido por IA.'
date: '2026-06-10'
tags: ['Claude Code', 'agentic coding', 'AI engineering', 'code review', 'CI/CD']
---

Existem dois modos de falha no desenvolvimento assistido por IA. O primeiro é ignorá-lo e perder o ganho de produtividade — medido nos meus times, não em slides de marketing. O segundo é soltar um agente numa base de código sem contexto e sem gates, e gastar o tempo economizado depurando bobagem confiante.

A resposta para os dois é a mesma: tratar o desenvolvimento assistido por IA como disciplina de engenharia, com um modelo operacional. Este é o que usamos.

## 1. Contexto é infraestrutura

Um assistente de IA é tão bom quanto o contexto que consegue alcançar. Mantemos um pequeno conjunto de arquivos em todo repositório, tratados como entregáveis de primeira classe:

- **`CLAUDE.md`** — como trabalhar neste repo: convenções, comandos, o que nunca tocar, como rodar testes.
- **`design.md`** — o design da solução em andamento para trabalhos relevantes.
- **`architecture.md`** — o mapa do sistema: serviços, fronteiras, fluxos de dados.
- **`decisions.md` / ADRs** — por que as coisas são como são, para o agente não reabrir decisões já tomadas.
- **`tasks.md`** — o que está em andamento, granular o suficiente para um agente pegar uma unidade de trabalho.

Isso não é burocracia — é a mesma documentação que um engenheiro sênior gostaria de ter no primeiro dia. A diferença é que a IA lê tudo, em toda sessão, sem custo de onboarding.

## 2. Análise antes da implementação

O hábito de maior valor: **pedir análise de impacto antes de pedir a mudança.** "O que mudar X afetaria? Quais os riscos? Quais testes cobrem esse caminho?" O agente mapeia o raio de impacto em minutos — e você captura a suposição perigosa antes de ela virar um diff.

Para qualquer coisa não trivial, o fluxo é: agente lê o contexto → propõe um plano → humano aprova → agente implementa → humano revisa. A parte cara do software nunca foi digitar; foi decidir. Mantenha a decisão com você.

## 3. Passos pequenos, checkpoints reais

Agentes são entusiasmados. Sozinhos, refatoram o mundo. Nossos guardrails:

- **Commits pequenos** com mensagens convencionais — cada passo reversível.
- **Uma unidade de trabalho por sessão** — escopo limitado, dano limitado.
- **Testes rodam antes e depois** — o agente escreve ou atualiza testes como parte da mudança, não como favor.
- **Sem force-push, sem mudança de schema, sem upgrade de dependências** sem aprovação humana explícita.

## 4. Revisão é inegociável

Código gerado por IA passa pelo mesmo pull request review que código humano — muitas vezes mais rigoroso, porque o padrão de falha é diferente. Humanos cometem erros desleixados; modelos cometem erros plausíveis. Revisores procuram especificamente: APIs inventadas, comportamento silenciosamente alterado em casos de borda, e testes que afirmam o que o código faz em vez do que deveria fazer.

Também usamos IA do outro lado: uma passada de revisão com o agente — segurança, performance, queries N+1, tratamento de erros — antes da revisão humana. Ela captura os problemas mecânicos para que humanos foquem no design.

## 5. Medir o ganho com honestidade

Se você não consegue mostrar o ganho de produtividade nas métricas de entrega — lead time, throughput, taxa de defeitos — você está chutando. Acompanhamos time-to-merge e defeitos pós-release para trabalho assistido por IA versus convencional. Os ganhos são reais e significativos, mas se concentram onde o contexto é bom. O que fecha o ciclo: os times que investem em documentação recebem retornos compostos da IA.

O padrão por trás das cinco práticas: **a IA multiplica a qualidade do seu processo de engenharia.** Processo bom entra, produtividade multiplicada sai. Caos entra, caos multiplicado sai.
