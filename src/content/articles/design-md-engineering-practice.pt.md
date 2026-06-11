---
title: 'design.md: o documento que alinha humanos e IA antes de qualquer linha de código'
description: 'Por que um documento de design leve se tornou a prática de engenharia de maior alavancagem nos meus times — e como ele multiplica a qualidade do desenvolvimento assistido por IA.'
date: '2026-06-11'
tags: ['práticas de engenharia', 'documentação', 'desenvolvimento assistido por IA', 'governança']
---

A maioria das falhas de engenharia que vi em 20 anos não foram falhas de código. Foram falhas de alinhamento: o código certo construído para o problema errado, o rollback que ninguém planejou, o requisito não funcional que todos assumiram ser responsabilidade de outra pessoa.

A correção mais barata que conheço é um `design.md` — um documento de design curto que vive no repositório, ao lado do código que descreve.

## O que é

Um `design.md` responde, em uma ou duas páginas, às perguntas que todo stakeholder fará em algum momento:

- **Contexto** — que problema estamos resolvendo, e por que agora?
- **Escopo e não escopo** — o que está explicitamente fora?
- **Requisitos funcionais e não funcionais** — incluindo metas de performance, segurança e custo.
- **Arquitetura proposta** — com diagrama quando ajudar.
- **Decisões e alternativas consideradas** — o que escolhemos e o que rejeitamos.
- **Riscos e trade-offs** — o que pode dar errado, o que aceitamos conscientemente.
- **Estratégia de testes, plano de rollout, plano de rollback** — como entregamos com segurança.
- **Métricas de sucesso** — como saberemos que funcionou.

Se uma seção não se aplica, ela é removida. O documento serve à entrega, nunca o contrário.

## Quando escrever um

Não para toda tarefa. O gatilho é irreversibilidade ou raio de impacto: serviços novos, mudanças de schema, integrações com sistemas externos, qualquer coisa que toque pagamentos ou autenticação, qualquer coisa que levaria mais de uma sprint para desfazer. Para uma correção de uma linha, uma boa mensagem de commit é documentação suficiente.

## Por que isso importa mais na era da IA

Eis o que mudou: seu documento de design não é mais lido apenas por humanos. Assistentes de código com IA — Claude Code e ferramentas agentic similares — são notavelmente bons em implementar contra uma especificação clara, e notavelmente perigosos sem uma.

Quando um assistente de IA tem acesso a um `design.md`, ele para de adivinhar a sua intenção. Ele conhece a arquitetura que você escolheu, as alternativas que você já rejeitou (e não as reintroduz "para ajudar"), as restrições não funcionais e as expectativas de rollback. O mesmo documento que alinhou o seu time agora governa as suas ferramentas.

Nos meus times, a regra é simples: **a IA implementa; o design decide.** Um assistente pode rascunhar o `design.md` — costuma ser um ótimo escritor de primeira versão — mas um humano é dono das decisões contidas nele, e o documento é revisado antes de qualquer implementação relevante começar.

## Como se conecta com ADRs

Um `design.md` descreve uma solução de ponta a ponta. Um Architecture Decision Record captura uma decisão e suas consequências. Eles se compõem: um documento de design normalmente gera um ou dois ADRs para as decisões que sobreviverão ao projeto. O design doc é a história; os ADRs são os precedentes.

## Por onde começar

Escolha o próximo trabalho não trivial do backlog e escreva o documento antes do primeiro commit — trinta minutos, não três dias. Revise com um stakeholder e um engenheiro. Depois observe o que acontece com a discussão do pull request: a maior parte do debate de arquitetura já aconteceu, por escrito, onde custa barato.

Um template para começar está disponível no meu [Engineering Playbook](/pt/playbook/).
