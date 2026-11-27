---
title: 'Tech Radar — Higiene de engenharia virou alavanca de custo e performance'
description: 'Nesta edição: o Google mede como TODOs obsoletos desviam agentes de código, a Entire aposta em uma forja Git guiada por scores de avaliação, os spend caps do Google Cloud chegam a GA, o Pinterest troca um pipeline de clustering por um modelo de 4B ajustado, o Cloudflare Basin entrega analytics aberto sem egress e seis CVEs do Git coincidem com o Dependabot pausando repositórios inativos.'
date: '2026-11-11'
tags: ['Tech Radar', 'AI engineering', 'IA agêntica', 'dívida técnica', 'FinOps', 'plataformas de dados', 'DevSecOps', 'cadeia de suprimentos de software']
---

As notícias mais úteis desta semana não falam de modelos maiores. Falam do trabalho pouco glamoroso ao redor deles: limpar o contexto que os agentes leem, impor limites rígidos de gasto, escolher o menor modelo que resolve o problema e corrigir as ferramentas das quais tudo depende. Higiene agora aparece direto no custo e no prazo de entrega.

## Google: TODOs obsoletos tiram agentes de código do foco

Engenheiros do Google analisaram traces de centenas de milhões de passos de agentes e constataram que cerca de 13% das sessões expuseram os agentes a referências `TODO/FIXME` para bugs; em 6% delas, o agente agiu sobre o bug citado, geralmente sem que ninguém tivesse pedido ([infoq.com](https://www.infoq.com/news/2026/11/google-agent-distraction/)). Esses desvios somaram 70% mais passos, 77% mais tokens e 105% mais tempo de espera. Um agente de limpeza já removeu milhares dessas referências, com mais de 95% de aceitação humana.

**Impacto para empresas:** cada comentário velho, especificação desatualizada ou ticket morto vira contexto que o agente lê e cobra em tokens.

**Riscos e oportunidades:** o risco é aumento de escopo em velocidade de máquina, com agentes "corrigindo" bugs fechados ou alheios à tarefa. A oportunidade: a limpeza agora pode ser medida em tokens e tempo de ciclo.

**Minha leitura:** é o melhor argumento a favor de higiene de documentação que vi em anos, porque vem com número. Antes de comprar mais licenças de agentes, eu rodaria uma varredura simples por TODOs que apontam para tickets fechados e por documentos que ninguém atualiza há um ano. Menos distração é o upgrade de modelo mais barato que existe.

## Entire: uma forja Git guiada por scores de avaliação, não pela timeline do PR

A Entire, liderada pelo ex-CEO do GitHub Thomas Dohmke, lançou uma forja Git pensada para colaboração entre pessoas e agentes ([infoq.com](https://www.infoq.com/news/2026/11/entire-git-forge-coding-agents/)). O conceito central, os "trails", troca a timeline do PR por scores de qualidade, segurança e "slop" atualizados a cada push, além de gates configuráveis que bloqueiam o merge até que todos os apontamentos sejam resolvidos.

**Impacto para empresas:** a revisão virou o gargalo da entrega assistida por IA, e os fornecedores já disputam quem vai redesenhá-la.

**Riscos e oportunidades:** nova forja significa migração e risco de lock-in, e scores gerados por agentes podem dar falsa segurança. O conceito, porém, pode ser adotado na plataforma que você já usa.

**Minha leitura:** eu não migraria repositórios por isso. Eu copiaria a ideia: definir o que significa "seguro para merge" em código escrito por agentes — testes, scan de segurança, checagem de escopo — e aplicar isso como gate.

## Spend caps do Google Cloud chegam a GA — com limites reais

O Google Cloud disponibilizou de forma geral os spend caps nos orçamentos de billing: quando o orçamento mensal é atingido, novos usos do serviço limitado naquele projeto são bloqueados, sem apagar recursos ([infoq.com](https://www.infoq.com/news/2026/11/google-cloud-spend-caps/)). A versão GA traz API, aplicação baseada em custo estimado em tempo quase real para serviços de IA e reset automático a cada mês. Os caps cobrem apenas Gemini API, Agent Platform, Cloud Run e Cloud Run functions, e o excedente durante o atraso de aplicação continua sendo cobrado.

**Impacto para empresas:** um loop de agente descontrolado ou uma chave vazada agora podem ser barrados pela própria plataforma, não só por um alerta lido na segunda-feira.

**Riscos e oportunidades:** o escopo é estreito — por projeto, por serviço, por mês, a preço de lista — e não resolve a GPU esquecida ligada. A oportunidade é embutir os caps no provisionamento, para que todo sandbox já nasça com teto.

**Minha leitura:** prefiro um erro a uma fatura surpresa de cinco dígitos. Use caps por padrão em sandboxes e experimentos, mantenha produção com alertas e detecção de anomalias e configure o teto abaixo do limite real, como o próprio Google recomenda.

## Pinterest: um modelo de 4B ajustado substitui um pipeline de clustering

O Pinterest trocou seu pipeline de clustering em várias etapas, usado para inferir jornadas de usuários, por um modelo Qwen3 de 4 bilhões de parâmetros com fine-tuning, e reportou alta de 1,1% no clique em e-mails e 1,3% na abertura de push ([infoq.com](https://www.infoq.com/news/2026/11/pinterest-journey/)). O time testou de 0,6B a 8B e escolheu 4B pelo equilíbrio entre qualidade e throughput. Um dos maiores ganhos de eficiência veio de pular usuários cujas jornadas já tinham sido geradas nos últimos dias.

**Impacto para empresas:** o padrão é replicável: modelo de fronteira gera os dados de treino, e um modelo aberto pequeno, sob seu controle, vai para produção.

**Riscos e oportunidades:** fine-tuning e hospedagem própria trazem carga operacional (GPUs, serving, avaliação), em troca de custo unitário previsível.

**Minha leitura:** o detalhe de que mais gosto é "evitar inferência desnecessária". Antes de otimizar o modelo, otimize quando ele é chamado. E teste primeiro o menor modelo — o maior raramente é a melhor decisão de negócio.

## Cloudflare Basin: analytics aberto e sem custo de egress

A Cloudflare lançou em GA o Basin, plataforma serverless de analytics sobre Apache Iceberg e R2 que combina ingestão com transformação em SQL, catálogo gerenciado e consultas SQL distribuídas, sem taxa de egress ([infoq.com](https://www.infoq.com/news/2026/11/cloudflare-basin-analytics/)). Os dados continuam legíveis por qualquer engine compatível com Iceberg, como DuckDB, Snowflake ou Spark.

**Impacto para empresas:** para volumes grandes demais para planilha e pequenos demais para um warehouse, surge uma opção de baixa operação sobre formatos abertos.

**Riscos e oportunidades:** a plataforma é jovem; tempo real e controles de soberania ainda estão no roadmap. A oportunidade é arquitetural: formato de tabela aberto somado a egress gratuito torna a engine de consulta substituível.

**Minha leitura:** a notícia de verdade é o Iceberg, não a Cloudflare. Se seus dados estão em formato aberto, escolher fornecedor vira decisão de preço, e não projeto de migração.

## Seis CVEs no Git, e o Dependabot silencia repositórios inativos

O projeto Git publicou correções para seis vulnerabilidades, incluindo execução de código em clones recursivos de repositórios maliciosos e corrupção de memória ao processar merges ou patches binários ([github.blog](https://github.blog/open-source/git/git-security-vulnerabilities-announced-7/)). A recomendação é atualizar para o Git 2.56.1 ou para a versão corrigida da sua linha de manutenção, inclusive as cópias embarcadas em ferramentas e imagens de CI. A partir de 8 de dezembro o GitHub vai desligar os alertas do Dependabot na maioria dos repositórios sem atividade no último ano, arquivando os alertas existentes ([github.blog](https://github.blog/changelog/2026-11-10-dependabot-alerts-will-pause-on-inactive-repositories)).

**Impacto para empresas:** agentes de build, runners self-hosted e qualquer serviço que clona ou faz merge de conteúdo não confiável estão diretamente expostos.

**Riscos e oportunidades:** o risco é um repositório parado cujo código ainda está no ar, agora sem alertas. Configurações de segurança aplicadas (enforced) mantêm os alertas ligados.

**Minha leitura:** atualize as imagens dos runners nesta semana, não na próxima sprint. Depois, use a mudança do Dependabot como gatilho: arquive o que está realmente morto e force alertas em tudo que ainda vai para produção.

## A tendência a observar

A IA amplifica o estado em que o seu sistema de engenharia já está. Contexto limpo deixa agentes mais baratos; contexto obsoleto os faz se dispersar. Limites rígidos de gasto transformam incidentes em erros controlados. Vai se destacar quem tiver os repositórios mais limpos, os gates mais claros e o controle de custo mais firme — não quem tiver mais agentes.
