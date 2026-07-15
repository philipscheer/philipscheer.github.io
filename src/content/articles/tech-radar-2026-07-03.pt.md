---
title: 'Tech Radar — Agentes entram em produção e a camada de confiança amadurece'
description: 'Nesta edição: OpenTelemetry se gradua, a AWS dá micro-VMs a cada agente, o Copilot corrige vulnerabilidades no Azure DevOps, a Alibaba teria banido uma ferramenta de IA, a Oracle corta o free tier em silêncio, a Apple roda computação confidencial no Google Cloud e a Virgínia proíbe a venda de dados de localização.'
date: '2026-07-03'
tags: ['Tech Radar', 'AI engineering', 'cloud', 'DevOps', 'segurança', 'liderança de tecnologia']
---

O padrão desta semana não é "a IA agora consegue fazer X". É o encanamento que está se formando em volta da IA que já roda em produção: como isolar, observar, proteger e decidir se você confia no fornecedor por trás dela. As notícias mais úteis para um time de liderança raramente são as demos chamativas — são as que falam de fronteiras de isolamento, sustos na fatura e decisões de governança. Aqui está o que eu levaria para uma reunião de liderança técnica esta semana, e por que importa além da manchete.

## OpenTelemetry se gradua — observabilidade virou pré-requisito

O OpenTelemetry atingiu o nível máximo de maturidade da CNCF, o status "graduated", reconhecendo-o como pronto para uso corporativo em produção ([CNCF](https://www.cncf.io/announcements/)). É um dos projetos mais adotados do ecossistema cloud-native, e este é o mercado oficializando o que muitos times já assumiam.

**Impacto para empresas:** telemetria neutra de fornecedor deixa de ser aposta e vira padrão. Você instrumenta uma vez e continua portável entre backends, em vez de ficar preso ao agente e ao preço de um único fornecedor de observabilidade.

**Riscos e oportunidades:** o risco é tratar a graduação como "pronto" — instrumentar sem modelo de custo gera dashboards caros e ignorados. A oportunidade é padronizar traces, métricas e logs agora, ainda mais com agentes de IA adicionando chamadas não determinísticas impossíveis de depurar sem eles.

**Minha visão:** se você ainda usa um agente proprietário por causa de lock-in, este é o momento de planejar a migração. Observabilidade que você não controla é uma conta e uma dependência que você não consegue renegociar depois.

## A AWS dá a cada agente (e usuário) sua própria micro-VM

A AWS lançou o Lambda MicroVMs, uma primitiva serverless que roda cada sessão de usuário ou agente de IA dentro de sua própria máquina virtual Firecracker, com isolamento em hardware, inicialização rápida via snapshot e estado que persiste por até oito horas ([AWS](https://aws.amazon.com/blogs/aws/)). Contas iniciais da comunidade estimam um mínimo de cerca de US$ 3/dia por setup — aproximadamente 9x o preço do Fargate spot.

**Impacto para empresas:** rodar código não confiável ou gerado por agente era o bloqueador silencioso de muitos produtos de IA. Isolamento por hardware a cada sessão elimina uma classe real de risco e torna "deixe o agente executar isso" uma decisão defensável.

**Riscos e oportunidades:** a oportunidade é ganhar uma fronteira de segurança que você teria de construir sozinho. O risco é custo — é uma primitiva premium, e uma frota de micro-VMs sempre ligadas vira um problema de FinOps se ninguém definir TTLs e escala a zero.

**Minha visão:** o isolamento vale o preço quando você roda código que não escreveu. Não vale como runtime padrão. Use com intenção, limite a vida da sessão e modele a fatura antes de padronizar.

## Copilot Autofix chega ao Azure DevOps

A Microsoft abriu um preview público limitado do Copilot Autofix para o GitHub Advanced Security no Azure DevOps, estendendo a remediação de vulnerabilidades gerada por IA para times que trabalham no Azure Repos ([Microsoft](https://devblogs.microsoft.com/devops/)). O scanner não apenas aponta o problema — ele propõe a correção como uma mudança revisável.

**Impacto para empresas:** o gargalo de segurança de aplicações nunca foi a detecção; foi a capacidade de correção. Transformar achados em pull requests em rascunho pode reduzir de forma real a fila de "vulnerabilidades conhecidas e não corrigidas".

**Riscos e oportunidades:** a oportunidade é reduzir o tempo médio de remediação sem contratar um exército de segurança. O risco é a falsa sensação de segurança — um patch sugerido por IA é uma proposta, não uma garantia, e aprová-lo no automático anula o benefício.

**Minha visão:** adote como motor de primeiro rascunho, não como aprovador. Mantenha o portão de revisão humana, mantenha seus testes e meça se ele de fato fecha achados mais rápido — não quantas sugestões gera.

## Alibaba teria banido uma ferramenta de IA por risco de backdoor

A Reuters informou que a Alibaba pretende banir um assistente de código com IA no ambiente de trabalho por suposto risco de backdoor e exfiltração de dados, segundo uma fonte ([Reuters](https://www.reuters.com/technology/)). Trate os detalhes como não confirmados, mas a decisão de fundo é o que importa: uma grande organização de engenharia traçando uma linha dura em torno de uma ferramenta de IA para desenvolvimento.

**Impacto para empresas:** toda ferramenta de código com IA tem acesso de leitura ao seu fonte e, muitas vezes, a um contexto bem além do arquivo aberto. Isso é uma superfície de supply chain e de governança de dados que a maioria dos times adotou mais rápido do que governou.

**Riscos e oportunidades:** o risco é o vazamento silencioso de código proprietário e segredos por ferramentas que ninguém aprovou formalmente. A oportunidade é se antecipar com uma política real: quais ferramentas são permitidas, o que elas podem ver e para onde vai a telemetria.

**Minha visão:** você não precisa banir para estar seguro, mas precisa decidir de propósito. Faça o inventário das ferramentas de IA já presentes no seu código, entenda os fluxos de dados e escolha seus padrões antes que uma manchete os escolha por você.

## Oracle corta o Always Free pela metade, em silêncio

A Oracle reduziu a cota Always Free do Ampere A1 de 4 OCPUs e 24 GB de RAM para 2 OCPUs e 12 GB — sem anúncio público e com o suporte dando respostas conflitantes sobre quem é afetado ([Oracle](https://www.oracle.com/cloud/free/)).

**Impacto para empresas:** o free tier é onde vivem, discretamente, projetos paralelos, protótipos e ferramentas internas. Um corte silencioso importa menos pela computação e mais pelo sinal: os termos podem mudar sob seus pés, sem aviso.

**Riscos e oportunidades:** o risco é arquitetura construída sobre premissas que o fornecedor pode revisar da noite para o dia. A oportunidade é o lembrete de manter workloads portáveis e ler compromissos como revogáveis, salvo contrato.

**Minha visão:** a computação aqui é trivial; a confiança não é. Como um fornecedor conduz um corte silencioso mostra como ele conduzirá o próximo. Tenha rota de saída para tudo que importa.

## Apple roda Private Cloud Compute no Google Cloud

Pela primeira vez, a Apple escolheu o Google Cloud para rodar o Private Cloud Compute fora dos seus próprios data centers, usando GPUs NVIDIA Blackwell, Intel TDX e a camada de segurança Titanium do Google, mantendo seu próprio ledger de hardware append-only e atestação de dois fornecedores ([Apple](https://security.apple.com/blog/)).

**Impacto para empresas:** computação confidencial está saindo do discurso de pesquisa para a arquitetura de produção. O padrão — rodar workloads sensíveis no hardware de outra empresa provando que você nunca confiou nele — agora é algo que uma hyperscaler e um cliente do porte de uma hyperscaler operam juntos.

**Riscos e oportunidades:** a oportunidade é um modelo crível de IA que preserva privacidade em escala. O risco é a complexidade: atestação, raízes de confiança de dois fornecedores e ledgers de hardware são difíceis de acertar e mais ainda de auditar.

**Minha visão:** a maioria de nós não vai construir isso, mas vai comprar serviços que alegam ter. Aprenda o vocabulário — atestação, TEEs, computação confidencial — para distinguir uma garantia real de uma de marketing.

## Virgínia proíbe a venda de dados de geolocalização

A Virgínia aprovou a proibição da venda de dados precisos de geolocalização, endurecendo as regras sobre uma das categorias mais sensíveis de dado pessoal ([Hunton](https://www.hunton.com/privacy-and-information-security-law)). É mais um capítulo da fragmentação estado a estado da lei de privacidade nos EUA — e um espelho do que a LGPD já exige por aqui em torno de dado sensível.

**Impacto para empresas:** se localização toca seu produto, seu analytics ou sua stack de anúncios, conformidade virou um alvo móvel que varia por jurisdição. "A gente anonimiza" já não é a defesa que já foi.

**Riscos e oportunidades:** o risco é dado coletado sob uma regra virar passivo sob outra. A oportunidade é minimização de dados como estratégia — a localização que você nunca guardou é a que você nunca precisa defender.

**Minha visão:** trate geolocalização como radioativa por padrão. Colete o mínimo, defina retenção e garanta que alguém seja dono do mapa de para onde a regulação está indo, não só de onde ela está hoje.

## A tendência para observar

O fio condutor é que IA em produção virou um problema de infraestrutura e governança, não de modelagem. O trabalho interessante migrou para as fronteiras: isolar o que os agentes podem executar, observar o que eles fazem, automatizar as correções e decidir em quais fornecedores e ferramentas você realmente confia com seu código e os dados dos seus usuários. As organizações que vencerem o próximo ano não serão as dos prompts mais espertos — serão as que trataram agentes como qualquer outro sistema de produção, com orçamento, raio de impacto, telemetria e um responsável. Construa a camada de confiança antes de escalar a autonomia.
