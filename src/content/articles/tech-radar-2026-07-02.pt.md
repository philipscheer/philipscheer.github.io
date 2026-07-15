---
title: 'Tech Radar — Os agentes entram em produção, e a disciplina vem junto'
description: 'Nesta edição: o Claude Sonnet 5 barateia rodar agentes, a AWS dá a cada agente sua própria micro-VM, o Copilot leva correções de segurança ao Azure DevOps, a Meta mira o mercado de nuvem e os times de plataforma amadurecem.'
date: '2026-07-02'
tags: ['Tech Radar', 'AI engineering', 'cloud', 'DevOps', 'engenharia de plataforma', 'liderança de tecnologia']
---

O fio que costura a semana é sempre o mesmo: agentes de IA deixaram de ser demonstração e viraram carga de trabalho. E, no momento em que algo vira carga de trabalho, chegam as perguntas chatas — quanto custa, onde roda, quem isola e quem revisa o que ele entrega. Aqui está o que eu colocaria na frente de um time de liderança de tecnologia esta semana, e por que cada ponto importa além da manchete.

## A Anthropic lança o Claude Sonnet 5 como forma mais barata de rodar agentes

A Anthropic lançou o Claude Sonnet 5 com capacidades agênticas mais fortes e preço menor, posicionando-o como alternativa mais barata ao Opus, ao GPT-5.5 e ao Gemini Pro para quem roda agentes em escala ([TechCrunch](https://techcrunch.com/2026/06/30/anthropic-launches-claude-sonnet-5-as-a-cheaper-way-to-run-agents/)).

**Impacto para as empresas:** o preço da fronteira deixou de ser o preço que você paga na maior parte do trabalho. Um modelo intermediário mais barato e "bom o suficiente" para tarefas agênticas de alto volume muda a conta de tudo o que você adiava automatizar porque a fatura de tokens não fechava.

**Riscos e oportunidades:** o risco é padronizar silenciosamente na curva de preço de um único fornecedor e acordar preso. A oportunidade é montar um portfólio de modelos — um de fronteira para raciocínio difícil, um mais barato para os 80% que são rotina — escolhido por tarefa, não por moda.

**Minha visão:** faça a conta de custo por tarefa concluída, não por milhão de tokens. Um modelo 3x mais barato que precisa de duas tentativas não é mais barato. Faça benchmark com as suas próprias cargas antes de migrar qualquer coisa que importe.

## A AWS dá a cada agente sua própria micro-VM

A AWS lançou os Lambda MicroVMs, uma primitiva serverless que roda cada sessão de usuário ou agente de IA dentro da própria máquina virtual Firecracker — isolamento em nível de hardware, inicialização rápida via snapshot e estado preservado por até oito horas. A análise da comunidade estima um mínimo de cerca de US$ 3,03/dia, aproximadamente 9x o preço do Fargate spot ([InfoQ](https://www.infoq.com/news/2026/06/aws-lambda-microvms/)).

**Impacto para as empresas:** essa é a resposta de infraestrutura para o problema do agente sem freio. Se um agente executa código não confiável ou age sobre entrada do usuário, o isolamento de hardware por sessão impede que o raio de dano de um inquilino vire o incidente de todos.

**Riscos e oportunidades:** o risco é o preço — 9x não é erro de arredondamento em escala de frota, e é fácil buscar um isolamento que você não precisa. A oportunidade é uma postura de segurança mais limpa para as cargas realmente arriscadas, sem ter que construir o próprio sandbox.

**Minha visão:** isolamento é um espectro, não um interruptor. Reserve as micro-VMs para o código em que você não confia; mantenha computação mais barata para o código em que confia. A decisão de engenharia aqui é classificar as cargas com honestidade, não jogar tudo no nível mais caro por padrão.

## O Copilot Autofix leva correção de segurança para dentro do Azure DevOps

A Microsoft abriu o preview público do Copilot Autofix para o GitHub Advanced Security no Azure DevOps, levando correções de vulnerabilidade geradas por IA para times que trabalham no Azure Repos ([InfoQ](https://www.infoq.com/news/2026/06/azuredevops-copilot-autofix/)).

**Impacto para as empresas:** o gargalo da segurança de aplicações nunca foi encontrar vulnerabilidades — os scanners nos afogam em achados há anos. Era corrigi-las. Levar a remediação sugerida para dentro do pull request é onde a dívida de segurança de fato começa a ser paga.

**Riscos e oportunidades:** o risco é a falsa sensação de segurança — uma correção proposta pela IA que fecha o alerta do scanner sem fechar o buraco de verdade. A oportunidade é transformar um backlog parado de "problemas conhecidos" em diffs revisados e prontos para merge.

**Minha visão:** o autofix é ferramenta de rascunho, não de aprovação. Todo patch sugerido continua passando por revisão humana e pela suíte de testes. Usado assim, ele encurta a distância entre "sabemos desta CVE" e "está em produção" — que é exatamente onde a maioria das empresas perde tempo.

## A Meta quer te vender computação em nuvem

A Meta estaria construindo um negócio de infraestrutura em nuvem, vendendo acesso à sua computação e aos seus modelos de IA — o que a coloca em concorrência direta com AWS, Google Cloud e Azure, e ecoa o modo como a SpaceX monetiza capacidade ociosa ([TechCrunch](https://techcrunch.com/2026/07/01/meta-like-spacex-looks-to-turn-excess-ai-compute-into-cash/)).

**Impacto para as empresas:** mais fornecedores sérios de nuvem é bom para quem compra. Concorrência em disponibilidade e preço de GPU é a alavanca mais direta sobre a fatura de infraestrutura de IA, que virou silenciosamente um dos três maiores itens de custo em muitas empresas.

**Riscos e oportunidades:** o risco é correr atrás de um entrante barato e herdar uma plataforma imatura, ferramental raso e confiabilidade não comprovada. A oportunidade é ganhar poder de negociação real e uma estratégia multicloud crível para as cargas pesadas de computação.

**Minha visão:** um novo fornecedor é alavanca de negociação antes de ser decisão de arquitetura. Mantenha as partes pesadas de IA do seu stack portáveis o suficiente para que a concorrência de preço jogue a seu favor — mas não migre produção para uma plataforma recém-nascida só para economizar alguns pontos.

## Times de plataforma amadurecem: de projeto para produto

A InfoQ documentou um time que trocou a mentalidade de projeto pela de produto quando a plataforma interna cresceu além de um único time — migrando para infraestrutura self-service, orientada a API e multi-tenant, com ownership claro, depois de bater nos limites clássicos das entregas avulsas e dos ciclos de feedback fracos ([InfoQ](https://www.infoq.com/news/2026/07/platform-projects-products/)).

**Impacto para as empresas:** a maioria das plataformas internas morre da mesma doença — tratada como um backlog de chamados em vez de um produto com usuários, roadmap e métricas de adoção. A virada é organizacional, não técnica.

**Riscos e oportunidades:** o risco é uma "plataforma" que ninguém escolhe usar e que silenciosamente vira um imposto. A oportunidade é alavancagem de verdade: cada hora investida se multiplica em todo time que se autoatende em vez de abrir um chamado.

**Minha visão:** se o time de plataforma não sabe dizer quem são seus usuários e qual sua taxa de adoção, ele está tocando projetos, não um produto. Dê a ele um product owner, meça a adoção do self-service e trate os desenvolvedores internos como clientes que podem dizer não.

## Segurança no desenvolvimento acelerado por IA

Uma palestra do QCon mapeou as vulnerabilidades concretas dentro do loop ReAct dos agentes — contexto, raciocínio e execução de ferramentas — e os padrões de defesa em profundidade para produção: mitigação de envenenamento de memória, críticos no estilo LLM-as-a-judge e modelagem de ameaças MAESTRO ([InfoQ](https://www.infoq.com/presentations/ai-development/)).

**Impacto para as empresas:** à medida que os agentes ganham a capacidade de chamar ferramentas e agir, a superfície de ataque sai de "saída ruim" para "ação ruim". Isso é uma questão de governança que cai no colo da liderança de tecnologia, não só da segurança.

**Riscos e oportunidades:** o risco é entregar capacidade autônoma mais rápido do que as barreiras em volta dela. A oportunidade é que os padrões já são conhecidos — não é mais território inexplorado, é disciplina que dá para adotar.

**Minha visão:** trate um agente com acesso a ferramentas como um serviço com credenciais de produção — menor privilégio, logs de auditoria e um portão humano para qualquer coisa irreversível. A produtividade da IA é real, mas só é confiável quando os controles entram junto.

## A tendência para observar

Todos os itens da semana falam do mesmo amadurecimento: a indústria parou de se espantar que agentes funcionam e começou a perguntar quanto custa rodá-los com segurança. Modelos mais baratos, isolamento por agente, correção de segurança no PR, mais fornecedores de computação, plataformas com nível de produto — são as fundações sem glamour que transformam uma demonstração em um sistema confiável. Os times que vencerem no próximo ano não serão os do agente mais vistoso. Serão os que o envolveram em controle de custo, isolamento e revisão antes de os concorrentes precisarem aprender, na dor, por que isso importa.
