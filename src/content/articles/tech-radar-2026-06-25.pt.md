---
title: 'Tech Radar — A stack de IA se industrializa, e o julgamento fica caro'
description: 'Nesta edição: o primeiro chip próprio da OpenAI, a Qualcomm comprando a Modular, o GitHub barrando spam de pull requests gerados por IA, computer use chegando a um modelo Gemini barato, infraestrutura ficando gratuita e por que modelos abertos e avaliação são a história que importa.'
date: '2026-06-25'
tags: ['Tech Radar', 'AI engineering', 'cloud', 'liderança de tecnologia', 'FinOps']
---

O padrão desta semana é industrialização. A stack de IA está ficando mais vertical e mais barata ao mesmo tempo — silício próprio, consolidação de infraestrutura, modelos agentivos com preço de volume e serviços essenciais virando gratuitos. Quando a máquina fica barata assim, o recurso escasso sobe na pilha: deixa de ser computação ou código e passa a ser julgamento — o que revisar, em que confiar, o que não comprar. Aqui está o que eu colocaria na frente de um time de liderança de tecnologia esta semana, e por que importa além da manchete.

## A OpenAI apresenta seu primeiro chip próprio, feito com a Broadcom

A OpenAI apresentou seu primeiro acelerador de IA interno, projetado com a Broadcom — a passagem de alugar o silício dos outros para ser dona de parte da cadeia de suprimentos ([TechCrunch](https://techcrunch.com/), via [Hacker News](https://news.ycombinator.com/)). Os grandes laboratórios estão seguindo a mesma lógica que Apple, Amazon e Google já provaram: quando computação é sua maior linha de custo, mais cedo ou mais tarde você passa a construí-la.

**Impacto para empresas:** a economia da inferência está sendo reescrita rio acima de você. Aceleradores próprios apertam o vínculo entre o provedor do modelo e um roadmap de hardware, o que com o tempo molda preço, disponibilidade e aprisionamento para todo mundo que constrói por cima.

**Riscos e oportunidades:** o risco é uma cadeia de suprimentos mais concentrada, em que o fornecedor do seu modelo, sua capacidade e seu preço viram cada vez mais a mesma decisão. A oportunidade é inferência mais barata em escala — se você mantiver a arquitetura portável o suficiente para aproveitar.

**Minha visão:** trate a camada de modelo como qualquer outra dependência de infraestrutura — abstraia. Silício próprio é boa notícia para a sua conta de inferência, mas só se trocar de provedor for uma mudança de configuração, não uma reescrita. A integração vertical ajuda o fornecedor primeiro; projete para que ajude você também.

## A Qualcomm anuncia a compra da Modular

A Qualcomm acertou a aquisição da Modular, empresa de infraestrutura de IA por trás da linguagem Mojo e da stack de inferência MAX ([Reuters](https://www.reuters.com/), via [Hacker News](https://news.ycombinator.com/)). É mais um sinal de que o meio sem glamour da stack de IA — compiladores, runtimes, a camada que faz modelos rodarem rápido em hardware de verdade — é onde o valor estratégico está se concentrando.

**Impacto para empresas:** as ferramentas das quais você depende silenciosamente podem mudar de dono da noite para o dia. Aquisição geralmente significa novo roadmap, nova pressão de preço e, no fim, um novo conjunto de prioridades que pode não incluir o seu caso de uso.

**Riscos e oportunidades:** o risco é apostar sua estratégia de performance em uma camada independente que acabou de virar produto de outra pessoa. A oportunidade é que consolidação costuma trazer investimento real de engenharia e melhor suporte a hardware — se quem comprou mantiver tudo aberto.

**Minha visão:** mapeie suas dependências críticas por quem é o dono, não só pelo que elas fazem. Quando uma peça-chave da sua stack é adquirida, a pergunta não é "ainda funciona hoje" — é "o que acontece na próxima renovação". Tenha um plano B antes de precisar dele.

## O GitHub limita pull requests com o acúmulo de spam gerado por IA

O GitHub lançou limites de taxa para pull requests para conter o ruído, depois de uma onda de contribuições de baixa qualidade geradas por IA começar a sufocar mantenedores de open source — um texto bastante compartilhado comparou o spam de PR de hoje ao spam de e-mail do início dos anos 2000 ([GitHub Blog](https://github.blog/) e [greptile.com](https://www.greptile.com/), via [Hacker News](https://news.ycombinator.com/)). Gerar uma mudança plausível ficou praticamente de graça; revisá-la, não.

**Impacto para empresas:** o gargalo mudou oficialmente de escrever código para revisá-lo. Se o seu time adotou IA e o processo de revisão não mudou, você transferiu carga, sem perceber, para as pessoas mais seniores — justamente quem distingue uma correção real de uma que só parece confiante.

**Riscos e oportunidades:** o risco é o esgotamento dos revisores e uma erosão lenta da qualidade do código sob o volume. A oportunidade é tornar a revisão uma atividade de primeira classe, com gente alocada — e usar IA também do lado da revisão, para triagem, não só para geração.

**Minha visão:** meça o custo de uma mudança no momento da revisão, não no commit. A forma mais barata de arruinar uma base de código é premiar volume e deixar a revisão à míngua. Limite a entrada, automatize a triagem e proteja a atenção dos seus revisores como o recurso escasso que ela virou.

## Computer use chega ao Gemini 3.5 Flash

O Google levou o computer use — agentes que operam navegador e interface diretamente — ao Gemini 3.5 Flash, sua linha rápida e de baixo custo ([Google](https://blog.google/), via [Hacker News](https://news.ycombinator.com/)). Uma capacidade agentiva que há um ano era recurso premium e lento agora está barata o suficiente para rodar em volume.

**Impacto para empresas:** quando um agente que clica, digita e navega custa centavos, automações internas que nunca justificaram uma integração completa de repente fecham a conta. E surge uma nova classe de risco: software que age em seu nome, rápido e em escala.

**Riscos e oportunidades:** o risco é o de sempre — um processo autônomo com permissões reais e sem teto real. A oportunidade é alavancagem genuína na cauda longa de tarefas manuais e de "cola" que APIs decentes nunca alcançaram.

**Minha visão:** computação agentiva barata só é boa compra se for governada. Restrinja as credenciais, registre cada ação, isole o ambiente em sandbox e mantenha um gate humano em qualquer coisa irreversível. O preço do modelo é o número pequeno; o custo de um agente sem supervisão com permissões é o que dói.

## A infraestrutura segue ficando gratuita — e o ideal é mantê-la sem graça

Dois itens mais discretos fazem o mesmo ponto. A Bunny anunciou que vai tornar seu DNS gratuito ([bunny.net](https://bunny.net/), via [Hacker News](https://news.ycombinator.com/)), e um texto popular mostrou deploys com zero downtime usando Docker Compose puro, sem Kubernetes (via [Hacker News](https://news.ycombinator.com/)). A infraestrutura commodity continua ficando mais barata, e o argumento para plataformas pesadas continua encolhendo.

**Impacto para empresas:** muitos times estão pagando — em dinheiro e em complexidade — por capacidades que hoje conseguiriam de graça ou com ferramentas bem mais simples. Plataformas superdimensionadas são um imposto que você renova no automático.

**Riscos e oportunidades:** o risco é confundir complexidade com maturidade e carregar uma carga operacional do tamanho de um Kubernetes para um problema do tamanho de um Docker Compose. A oportunidade é FinOps de verdade e velocidade de verdade ao dimensionar certo.

**Minha visão:** infraestrutura sem graça é uma vantagem. Combine a ferramenta com a carga, revisite a escolha à medida que o mercado vira commodity e esteja disposto a remover uma plataforma, não só a adicionar. O sistema mais barato e confiável costuma ser o mais simples que cumpre o SLA.

## A história de IA que importa: modelos abertos e a lacuna de avaliação

Dois fios para observar juntos: um argumento forte de que, para a maior parte do mundo, IA open source é o único caminho viável ([techstrong.ai](https://techstrong.ai/), via [Hacker News](https://news.ycombinator.com/)) — algo especialmente concreto para América Latina, onde custo, soberania de dados e câmbio pesam na conta — e um post-mortem afiado sobre por que startups de avaliação continuam fracassando (via [Hacker News](https://news.ycombinator.com/)). Modelos de pesos abertos seguem ficando melhores e mais baratos de rodar; saber se algum deles é de fato bom o suficiente para o seu caso continua sem solução.

**Impacto para empresas:** a escolha de modelo virou decisão de portfólio — um modelo de fronteira para raciocínio difícil, pesos abertos para trabalho de alto volume ou com dado sensível. Mas um portfólio que você não consegue avaliar é só dispersão.

**Riscos e oportunidades:** o risco é adotar no "feeling" e descobrir problemas de qualidade em produção. A oportunidade é que avaliação disciplinada — específica por tarefa, repetível, ligada a resultado — está virando vantagem competitiva real.

**Minha visão:** a parte difícil de engenharia de IA nunca foi obter uma resposta; é saber se a resposta está certa. Monte seu próprio conjunto de avaliação, pequeno e honesto, para as tarefas que importam para você. O time que consegue medir a qualidade do modelo nos seus próprios termos é o time que adota modelos abertos com segurança e troca sem medo.

## A tendência a observar

Junte tudo e a mesma linha atravessa todos os itens: a stack de IA está se industrializando — silício mais barato, infraestrutura consolidando, computação agentiva em volume, serviços virando gratuitos — e cada um desses movimentos empurra o recurso escasso mais para cima, em direção ao julgamento humano. Os líderes que vencerem o próximo ano não serão os que adotaram mais IA ou mais plataformas. Serão os que mantiveram a arquitetura portável, a revisão financiada, os agentes governados e as escolhas de modelo medidas. Quando a máquina fica barata, o que sobra para competir é bom senso e disciplina. Observe quão rápido "a gente consegue construir" dá lugar a "será que devemos, e como saberíamos se funcionou".
