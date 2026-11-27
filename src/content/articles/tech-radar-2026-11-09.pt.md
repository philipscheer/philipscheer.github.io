---
title: 'Tech Radar — A IA entra na fase da eficiência: mais tokens, gasto estável'
description: 'Nesta edição: dados da Ramp mostram uso de IA subindo enquanto o gasto estaciona, o GitHub admite que o gargalo saiu da escrita de código e foi para a revisão, o painel de impacto do Copilot passa a contar chat e agentes, a Uber registra quatro corridas pedidas por agentes na semana mais movimentada, a Palo Alto Networks aposta US$ 500 milhões em segurança de acesso de agentes e a Dropbox compra a Tigris para vender armazenamento compatível com S3.'
date: '2026-11-09'
tags: ['Tech Radar', 'FinOps', 'AI engineering', 'IA agêntica', 'métricas de engenharia', 'segurança', 'cloud', 'liderança de engenharia']
---

O mercado de IA está saindo da fase do "gastar o que for preciso". O uso continua crescendo, mas quem mais usa está aprendendo a pagar menos, e os ganhos aparecem em alguns lugares e não em outros. Para líderes de tecnologia, a pergunta desta semana não é "devemos adotar IA?", e sim "onde está o valor e como comprovamos?".

## Ramp: o uso de IA cresce, mas o gasto estacionou

O AI Index da Ramp mostra que o gasto com tokens cresceu apenas 1,5% entre agosto e setembro, depois de crescer 42% mês contra mês em julho, mesmo com o volume de tokens subindo ([techcrunch.com](https://techcrunch.com/2026/11/06/ramp-data-shows-ai-spending-stalling-just-as-anthropic-nears-its-ipo/)). O economista-chefe da Ramp, Ara Kharazian, atribui o movimento aos cortes de preço da OpenAI e da Anthropic e a compradores mais disciplinados: padrões mais baratos, orçamento por funcionário e roteadores que mandam tarefas simples para modelos mais leves. Outubro voltou a acelerar (8,9%), mas ele segue chamando o cenário de mercado do comprador.

**Impacto para empresas:** boa notícia para quem compra. Os preços caem, há espaço para negociar descontos e controle de custo comprovadamente funciona.

**Riscos e oportunidades:** o risco é a dependência de fornecedor. Empresas de modelos pressionadas por receita vão buscar lock-in com descontos e pacotes. A oportunidade é construir agora uma camada de roteamento, para que trocar uma carga de modelo seja mudança de configuração, não projeto.

**Minha leitura:** "usar mais IA pagando menos" é exatamente a postura que recomendo. Trate modelos como qualquer recurso de cloud: comece pelo mais barato que passa nas suas avaliações, escale só quando necessário e revise a fatura todo mês. Evite compromissos plurianuais enquanto os preços caem nesse ritmo.

## GitHub: o código ficou mais rápido, o trabalho em volta não

O GitHub registrou mais de 1,2 bilhão de commits em uma única semana de outubro, mais de 400% acima do ano anterior, e citou um estudo da Faros AI em que pull requests passaram 441% mais tempo em revisão quando os times foram de baixa para alta adoção de IA ([github.blog](https://github.blog/ai-and-ml/github-copilot/beyond-code-generation-a-developers-guide-to-agentic-engineering/)). A resposta proposta é um fluxo em quatro etapas — planejar, construir, verificar e observar: plano aprovado antes da implementação, pull requests empilhados em vez de "pequenos refactors" com 47 arquivos e checagens automáticas de qualidade e segurança antes de um humano abrir o diff.

**Impacto para empresas:** o gargalo da entrega saiu da escrita de código e foi para a revisão e a validação. Times que medem produção em commits ou linhas de código estão medindo a coisa errada.

**Riscos e oportunidades:** o risco é a fila de revisão crescer mais rápido que a capacidade de leitura do time, gerando aprovações no automático. A oportunidade é investir no que barateia a revisão: mudanças pequenas, critérios de aceite claros e gates automatizados.

**Minha leitura:** bate com o que vejo na prática. Eu definiria um limite rígido de tamanho para PRs gerados por agentes e acompanharia o lead time entre abertura e merge. Se esse número sobe enquanto os commits disparam, a IA está criando trabalho, não eliminando.

## Painel de impacto do Copilot passa a contar chat e agentes

O GitHub incluiu o Copilot Chat e a janela de agentes do VS Code no gráfico de adoção de agentes do painel de impacto do Copilot, somando nove recursos acompanhados, e renomeou o grupo "Passive users" para "Chat-first users" ([github.blog](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/)). As fases de adoção não mudaram, e os dados aparecem nos relatórios de 28 dias de enterprise e organização.

**Impacto para empresas:** parece cosmético, mas classificar como passivo quem usa principalmente o chat distorce decisões sobre licenças e treinamento.

**Riscos e oportunidades:** o risco é comparar relatórios antes e depois da mudança, já que os períodos anteriores incluem só sete recursos. A oportunidade é ter uma linha de base mais honesta de adoção por time.

**Minha leitura:** painel de uso responde "as pessoas estão usando?", não "está se pagando?". Uso esses dados para encontrar times que precisam de apoio e os cruzo com métricas de entrega — lead time, taxa de falha de mudanças, tempo de revisão — antes de renovar qualquer licença.

## Uber: quatro corridas pedidas por agentes na semana mais movimentada

Na teleconferência do terceiro trimestre, a Uber informou que apenas quatro corridas foram pedidas por um agente de IA na semana do Halloween, de cerca de 320 milhões de viagens e pedidos somando Uber e Uber Eats; cerca de 500 pedidos do Uber Eats vieram de agentes ([techcrunch.com](https://techcrunch.com/2026/11/04/almost-no-one-uses-ai-agents-to-book-their-uber-company-says/)). O CEO Dara Khosrowshahi lembrou que pedir uma corrida no app leva uns 50 segundos — ou seja, o agente não necessariamente economiza tempo.

**Impacto para empresas:** o comércio agêntico para o consumidor ainda é hipótese, não canal. Roadmaps baseados em "agentes vão comprar da gente" precisam de evidência.

**Riscos e oportunidades:** o risco é desviar capacidade de produto para integrações com agentes sem demanda mensurável. A oportunidade é uma opção barata: APIs bem documentadas e amigáveis a agentes, que também servem a parceiros e à automação interna.

**Minha leitura:** agentes geram valor onde a tarefa é longa, repetitiva e cara para humanos — não onde um bom app já resolve em 50 segundos. Eu manteria integrações com agentes na coluna das "apostas pequenas" até que dados reais de uso digam o contrário.

## Palo Alto Networks aposta US$ 500 milhões em segurança de acesso de agentes

A Palo Alto Networks negocia a compra da Clutch Security, que protege o acesso de agentes de IA aos sistemas da empresa, por US$ 500 milhões em dinheiro mais pagamentos por metas, segundo uma fonte a par das conversas ([techcrunch.com](https://techcrunch.com/2026/11/05/palo-alto-networks-in-talks-to-buy-ai-agent-security-startup-clutch-for-500m/)). A Clutch se aproxima de US$ 10 milhões de receita recorrente anual, o que implica cerca de 50 vezes a receita. Concorrentes também foram adquiridos: a Cyera comprou a Oasis Security por US$ 1 bilhão e a Cisco comprou a Astrix por cerca de US$ 400 milhões.

**Impacto para empresas:** identidade não humana — contas de serviço, chaves de API, credenciais de agentes — virou uma categoria própria de segurança, e os grandes fornecedores estão consolidando o segmento rapidamente.

**Riscos e oportunidades:** o risco é comprar uma plataforma antes de conhecer o próprio inventário. A maioria das empresas não consegue listar hoje quais agentes têm quais credenciais. A oportunidade é começar por esse inventário e por credenciais de vida curta e escopo restrito.

**Minha leitura:** 50 vezes a receita mostra que o mercado vê o acesso de agentes como a próxima grande superfície de ataque, e concordo. Mas o primeiro passo é uma lista de cada agente, o que ele alcança e quem responde por ele. Sem isso, qualquer plataforma só automatiza a confusão.

## Dropbox compra a Tigris para vender armazenamento para agentes

A Dropbox vai adquirir a Tigris Data por US$ 350 milhões, aparentemente sua maior aquisição até hoje, para sustentar o DBX Agent Cloud, uma plataforma de armazenamento para quem constrói modelos e agentes de IA ([techcrunch.com](https://techcrunch.com/2026/11/05/dropbox-acquires-tigris-data-for-350m-to-bolster-its-ai-iinfrastructure/)). A primeira oferta será armazenamento de objetos avulso, compatível com ferramentas feitas para o Amazon S3. A Tigris, fundada por ex-engenheiros de storage da Uber, posiciona os dados perto dos usuários e da computação que precisam deles.

**Impacto para empresas:** a API do S3 virou interface commodity, e novos provedores competem em preço e localização dos dados. É uma alavanca útil para quem tem conta alta de armazenamento ou de tráfego de saída.

**Riscos e oportunidades:** o risco é migrar dados para um provedor com roadmap ainda indefinido após a aquisição. A oportunidade é manter as aplicações na API do S3, para que armazenamento seja decisão de compra, não reescrita.

**Minha leitura:** eu não migraria dados de produção com base nessa notícia. Mas faria uma comparação de custo para datasets e artefatos de IA, que costumam ser grandes, muito lidos e sensíveis a tráfego de saída. Portabilidade é posição de negociação, mesmo quando você decide ficar.

## A tendência a observar

A IA está passando da fase de adoção para a fase de eficiência. O gasto se estabiliza, a revisão virou o novo gargalo, os painéis de uso estão sendo corrigidos e os agentes de consumo ainda esperam demanda. Vão se destacar os times que tratam IA como qualquer outro investimento: roteada para o modelo mais barato que resolve, medida por resultados de entrega e governada com identidades e limites claros.
