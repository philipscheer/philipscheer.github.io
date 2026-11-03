---
title: 'Tech Radar — Agentes precisam de um plano de controle, não de mais autonomia'
description: 'Nesta edição: a AWS transforma workflows do Step Functions em ferramentas para agentes, a Uber governa mais de 5.000 ferramentas de agentes atrás de um gateway MCP, o GitHub bloqueia pull_request_target por padrão, a Atlassian mostra o ganho de tempo com IA virando trabalho de revisão, o capex de IA das big techs pressiona o fluxo de caixa e o LinkedIn rastreia a jornada do usuário de ponta a ponta com OpenTelemetry.'
date: '2026-11-03'
tags: ['Tech Radar', 'AI engineering', 'IA agêntica', 'MCP', 'DevSecOps', 'FinOps', 'observabilidade', 'liderança de engenharia']
---

O fio condutor desta semana é que o trabalho relevante em IA saiu do modelo e foi para a infraestrutura ao redor dele. As empresas que estão colhendo resultado não estão dando mais liberdade aos agentes; estão colocando registro, gateway, política e medição entre o agente e os sistemas que ele toca. Isso é arquitetura e governança.

## AWS transforma workflows do Step Functions em ferramentas para agentes

A AWS passou a disponibilizar workflows do Step Functions como ferramentas para agentes de IA via Amazon Bedrock AgentCore Gateway, expostos pelo Model Context Protocol (MCP) ([aws.amazon.com](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-gpt-6-1-terra-on-bedrock-step-functions-as-agent-tools-and-more-november-2-2026/)). No mesmo resumo, a AWS conta que a MoEngage expôs cerca de 400 operações de APIs internas assim e estima ter poupado uns seis meses de engenharia de plataforma.

**Impacto para empresas:** o custo de integrar agentes cai bastante quando é possível reaproveitar workflows que já carregam regras de negócio, aprovações e trilha de auditoria.

**Riscos e oportunidades:** o risco é expor workflows com efeitos colaterais (estornos, provisionamento) sem limite de taxa nem checkpoint humano. A oportunidade é que os processos mais testados da empresa viram os próprios guardrails do agente.

**Minha leitura:** essa é a divisão de responsabilidades correta. O modelo escolhe *o que* fazer; o *como* fica em código determinístico, que você já testa e observa. Se um estorno exige validação de elegibilidade, aprovação e crédito nessa ordem, essa ordem nunca deveria ficar a critério do modelo.

## Uber coloca mais de 5.000 ferramentas de agentes atrás de um gateway MCP

A Uber construiu um MCP Gateway que atende mais de 800 servidores MCP e 5.000 ferramentas, separando um registro (plano de controle) de um proxy que traduz as chamadas para HTTP, gRPC ou TChannel ([infoq.com](https://www.infoq.com/news/2026/11/uber-mcp-gateway-ai-agents/)). Ferramentas descobertas automaticamente ficam desabilitadas até o time dono habilitá-las. O gateway aplica autorização por servidor e por ferramenta, mascara dados pessoais nas respostas e permite que os agentes descubram ferramentas de forma incremental, sem carregar o catálogo inteiro no contexto.

**Impacto para empresas:** a proliferação de servidores MCP é a nova proliferação de microsserviços. Sem um registro central, cada time publica seu próprio servidor, sua própria autenticação e sua própria superfície de vazamento de dados.

**Riscos e oportunidades:** o risco é ferramenta "na sombra" rodando com credencial de produção. A oportunidade é reaproveitar um padrão conhecido — o API gateway — com dono, habilitação explícita e observabilidade desde o início.

**Minha leitura:** isso é idêntico aos API gateways que construímos há uma década, e isso é um elogio. O detalhe que eu copiaria primeiro é "desabilitado até o dono aprovar": custa quase nada e torna a exposição de cada ferramenta uma decisão explícita.

## GitHub vai bloquear `pull_request_target` por padrão a partir de 2 de dezembro

A partir de 2 de dezembro de 2026, o GitHub Actions bloqueará eventos `pull_request_target` por padrão em todos os repositórios públicos, a menos que uma política de eventos do Actions os permita explicitamente ([github.blog](https://github.blog/changelog/2026-11-02-pull_request_target-blocked-by-default-december-2)). Haverá dois *brownouts* com a regra aplicada temporariamente, em 9 e 16 de novembro, das 16h às 18h UTC (13h às 15h em Brasília). Repositórios privados e internos não são afetados.

**Impacto para empresas:** qualquer projeto open source ou SDK público que dependa desse gatilho para rótulos, previews ou bots terá execuções falhando durante os brownouts.

**Riscos e oportunidades:** o risco é descobrir a dependência no meio de um release. A oportunidade é uma auditoria obrigatória de um gatilho que roda com os segredos do repositório base e tem sido vetor recorrente de ataques à cadeia de suprimentos.

**Minha leitura:** seguro por padrão, com brownout agendado, é como mudanças de plataforma deveriam ser feitas. Vale olhar o painel de Insights nesta semana, liberar apenas os workflows que realmente precisam do gatilho e tratar o resto como dívida quitada sem custo.

## Atlassian: o ganho de tempo com IA está virando trabalho de revisão

O relatório State of Developer Experience 2026, da Atlassian, mostra que a parcela de desenvolvedores que economiza dez horas ou mais por semana com IA caiu de 68% para 26% em um ano, enquanto a adoção chegou a 95% ([infoq.com](https://www.infoq.com/news/2026/10/atlassian-devex-2026/)). Quarenta e nove por cento dos desenvolvedores já gastam quatro horas ou mais por semana gerenciando ferramentas de IA, 65% gastam tempo corrigindo resultados que não atenderam à intenção. É uma pesquisa de fornecedor, baseada em autodeclaração, e a própria Atlassian alerta que as associações não provam causalidade.

**Impacto para empresas:** o gargalo saiu da escrita de código e foi para a revisão. Times que tratam uso de IA como indicador de produtividade estão incentivando o comportamento errado.

**Riscos e oportunidades:** o risco é transformar engenheiros seniores em revisores em tempo integral de código gerado. A oportunidade está nos números: entre quem tem uma estratégia de IA clara e implementada, 41% relatam menos atrito, contra 22% onde a estratégia é inconsistente.

**Minha leitura:** meça trabalho aceito, não tokens nem prompts. Desenhe a etapa de revisão de forma explícita — diffs pequenos, testes primeiro, um `design.md` antes de gerar código — em vez de deixar o revisor absorver tudo o que o agente produz.

## O boom de capex em IA começa a aparecer no fluxo de caixa

Alphabet, Amazon, Meta e Microsoft anunciaram planos de investir mais de US$ 740 bilhões em capex neste ano, e os investidores começaram a reagir ao custo ([techcrunch.com](https://techcrunch.com/2026/10/30/cracks-are-emerging-in-the-ai-spending-boom/)). A Alphabet reportou fluxo de caixa livre negativo de US$ 9,1 bilhões no terceiro trimestre, a Amazon, negativo de US$ 42,4 bilhões nos últimos doze meses.

**Impacto para empresas:** provedores investindo nesse ritmo vão precisar recuperar o capital, e essa pressão acaba chegando a tabelas de preço, contratos de compromisso e negociações de desconto.

**Riscos e oportunidades:** o risco é travar compromissos plurianuais de IA com as premissas de hoje. A oportunidade é a competição de preço na camada de modelos — a AWS informa que o GPT-6.1 Terra chegou ao Bedrock com preço por token pelo menos 50% menor que o do modelo ao lado.

**Minha leitura:** não tentaria acertar o timing do mercado, mas manteria opções abertas. Abstraia o acesso a modelos atrás de um gateway, acompanhe o custo unitário por resultado de negócio e mantenha os ganhos clássicos de FinOps rodando — o mesmo resumo da AWS mostra corte de 70% no custo de 5,8 PB de logs só comprovando o padrão de acesso antes de mover os dados.

## LinkedIn rastreia a jornada do usuário do toque ao backend

O LinkedIn construiu uma plataforma baseada em OpenTelemetry que conecta o que os membros fazem nos apps iOS, Android e web com os serviços de backend que processam essas interações ([infoq.com](https://www.infoq.com/news/2026/11/linkedin-opentelemetry-journey/)). Um `pageForestId` agrupa os vários traces gerados por uma única página e uma amostragem coordenada mantém consistentes as decisões de cliente e servidor. O LinkedIn estima que até 90% de parte do volume de traces de backend poderia ser tratado como dado de depuração.

**Impacto para empresas:** é entre "o usuário viu um erro" e "este serviço falhou" que se perde a maior parte do tempo de um incidente.

**Riscos e oportunidades:** o risco é o custo de telemetria e os traces virarem um canal para dados sensíveis. A oportunidade é uma base neutra em relação a fornecedor, com allowlists e mascaramento desde o início.

**Minha leitura:** o número de 90% é a manchete para qualquer conversa de FinOps sobre observabilidade. Defina o que é sinal de experiência do usuário e o que é ruído de depuração, amostre de acordo e padronize em OpenTelemetry, para que a ferramenta de armazenamento continue sendo uma escolha comercial, e não uma reescrita.

## A tendência a observar

Todas as notícias desta semana respondem à mesma pergunta: quem controla o que o sistema pode fazer? No próximo trimestre, a vantagem será dos times que tratarem o acesso de agentes como qualquer outra interface de produção — registrada, com dono, autorizada, observada e precificada — e não dos que simplesmente comprarem o modelo mais capaz.
