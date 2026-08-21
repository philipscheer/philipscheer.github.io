---
title: 'Tech Radar — A conta da engenharia em escala de agentes'
description: 'Nesta edição: GitHub publica um postmortem de capacidade, JetBrains mede 90% de uso semanal de agentes, Cursor lança um rival do GitHub, Cloudflare transforma padrões em enforcement, AWS dá 14 dias de runtime para agentes, Wiz mostra que clones de S3 não têm a segurança do S3, e o MCP do Azure DevOps chega em GA sem cliente de terceiro que consiga autenticar.'
date: '2026-08-21'
tags: ['Tech Radar', 'AI engineering', 'agentic coding', 'plataforma', 'cloud', 'segurança', 'liderança de engenharia']
---

O fio condutor da semana é a fatura. Agentes já produzem código em um volume para o qual a infraestrutura ao redor nunca foi dimensionada — e as falhas que aparecem não são falhas de modelo. São falhas de capacidade, de revisão, de identidade e de premissa de segurança. Semana de decisão de plataforma e governança, não de escolha de ferramenta.

## A queda do GitHub foi falha de capacidade, não deploy ruim

O CTO do GitHub, Vlad Fedorov, publicou o postmortem da queda de 17 de agosto: 7 horas e 47 minutos de interrupção em github.com, autenticação, Actions, APIs, pull requests, issues e Copilot ([github.blog](https://github.blog/news-insights/company-news/the-august-17-outage-and-the-work-ahead/)). Um componente crítico no data center do Centro dos EUA não escalou em um novo pico de tráfego, e a pressão de capacidade virou falha de autenticação em cascata. A recuperação do Copilot foi prolongada por um loop de retry no cliente que amplificou o tráfego durante o restabelecimento. O contexto é a notícia de verdade: commits mensais saíram de 1,4 bilhão em abril para 2,9 bilhões, e o Azure hoje carrega cerca de 58% da carga da plataforma, contra 12% em maio.

**Impacto para empresas:** a dependência mais crítica da maioria das organizações de engenharia está sendo replataformada em pleno voo, enquanto seu tráfego dobra.

**Riscos e oportunidades:** o risco é que seu CI, release e plantão assumam GitHub disponível sem nenhum modo degradado. A oportunidade é que o GitHub nomeou o padrão de amplificação em voz alta — tempestade de retry durante recuperação — e a maioria dos times tem o mesmo bug nos próprios clientes.

**Minha leitura:** a frase do próprio Fedorov é que nem este nem o incidente de 6 de agosto vieram de mudança de código ou configuração. É essa frase que vale levar para a próxima revisão de arquitetura. Tráfego de agente dobra volume de commit sem dobrar headcount, e planejamento de capacidade é a disciplina que silenciosamente deixa de ser feita quando tudo é elástico. Revise sua política de retry — backoff exponencial com jitter — esta semana: custa uma tarde e é a diferença entre uma recuperação lenta e uma segunda queda autoinfligida.

## Uso semanal de agentes chega a 90% — e a liderança virou

A JetBrains publicou o Developer Ecosystem Survey 2026: mais de 15.000 desenvolvedores profissionais, coleta entre maio e julho, com repesagem para representatividade global ([blog.jetbrains.com](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)). Noventa por cento usam agentes de código no trabalho ao menos semanalmente, 68% diariamente. Claude Code chegou a 39% de adoção global, contra 18% em janeiro, e 47% nos EUA. Codex cresceu cerca de 5x, de 3% para 16%. GitHub Copilot caiu de 29% um ano atrás para 21%, apesar de 79% de conhecimento — conhecimento nunca foi a restrição.

**Impacto para empresas:** ferramenta de agente não é mais linha de piloto. É custo recorrente de licença, com atrito real de troca e questões reais de interoperabilidade.

**Riscos e oportunidades:** o risco é pagar assento de incumbente que ninguém abre enquanto o time compra por fora a ferramenta que realmente usa. A oportunidade é renegociar com evidência na mão.

**Minha leitura:** o número que deveria mexer orçamento não é 39%, é os 21% do Copilot contra 79% de conhecimento. As pessoas conhecem o produto e estão escolhendo outro. Antes da renovação, puxe a telemetria de uso da sua empresa em vez das suas suposições, e padronize interoperabilidade — o Agent Client Protocol — em vez de padronizar fornecedor.

## Cursor lança o Origin, alternativa ao GitHub

A Cursor lançou o Origin, plataforma de hospedagem de código com repositórios, navegação, colaboração e pull requests ([techcrunch.com](https://techcrunch.com/2026/08/18/cursor-capitalizes-on-github-frustration-launches-rival-hosting-platform/)). A interoperabilidade é deliberada: você conecta o GitHub, escolhe uma organização, sincroniza repositórios selecionados e roda os dois em paralelo. O lançamento caiu no mesmo dia da queda do GitHub, e a TechCrunch cita uma análise do LeadDev que conta 257 incidentes do GitHub no último ano.

**Impacto para empresas:** pela primeira vez em anos, uma alternativa crível de SCM posicionada em confiabilidade e fluxo nativo para agentes.

**Riscos e oportunidades:** o risco é uma migração reativa que custa meses de entrega para resolver um problema que um runbook de modo degradado resolve em uma semana. A oportunidade é que a interoperabilidade torna a avaliação barata.

**Minha leitura:** timing de lançamento tão bom é sorte ou paciência, e nenhum dos dois é motivo para migrar. Controle de versão é o último lugar onde se busca novidade. Sincronize um repositório não crítico, meça e mantenha a opção aberta — é todo o investimento que faz sentido agora.

## Cloudflare transforma padrão de engenharia em camada de enforcement

Desde janeiro, o revisor de código com IA da Cloudflare sinalizou quase 230.000 desvios de padrões de engenharia, com cerca de 16.000 resultando em aprovação retida ([infoq.com](https://www.infoq.com/news/2026/08/cloudflare-ai-enforcement/)). Os padrões vivem em um repositório central — o Cloudflare Codex — escritos como RFCs estruturadas, com requisitos classificados em SHOULD ou MUST, dono explícito e estados de ciclo de vida. Novos padrões passam por orientação, depois observação, depois enforcement. Regras determinísticas ficam com linters e análise estática; IA só entra onde é preciso julgamento de contexto.

**Impacto para empresas:** é uma resposta publicada e concreta para governar code review no volume que a geração por agente produz.

**Riscos e oportunidades:** o risco é pular direto para enforcement e transformar o time de plataforma no departamento do não. A oportunidade é que MUST/SHOULD com rollout em etapas é copiável no próximo trimestre, sem contratar fornecedor.

**Minha leitura:** o que eu roubaria daqui não é o revisor com IA — é tornar padrão legível por máquina, com dono e ciclo de vida. A maioria dos padrões de engenharia falha porque mora numa wiki sem responsável. Escreva a taxonomia primeiro, rode em modo observação por um trimestre e só depois deixe bloquear. E mantenha o linter fazendo o que linter faz: modelo é a ferramenta errada para regra determinística.

## AWS dá 14 dias de runtime para agentes — e um limiar de FinOps

O Bedrock AgentCore ganhou runtime instances: agentes em EC2 gerenciado na conta do cliente, ao lado das microVMs serverless limitadas a 8 horas ([infoq.com](https://www.infoq.com/news/2026/08/aws-bedrock-agentcore-runtime/)). As sessões podem durar até 14 dias, com sistema de arquivos compartilhado e tipos de instância com GPU, e vários agentes podem coabitar e colaborar por um diretório de sessão compartilhado em vez de chamar a API um do outro. Uma nova primitiva de capacity provider cuida de famílias de instância, rede, storage e utilização-alvo, dispensando Auto Scaling groups e pipelines de AMI. A InfoQ cita ponto de equilíbrio próximo de 24% de utilização sustentada de CPU frente às microVMs, antes de Savings Plans.

**Impacto para empresas:** carga multiagente longa e com estado deixa de exigir uma frota EC2 paralela e o custo operacional que vem com ela.

**Riscos e oportunidades:** o risco é ler o limite de 14 dias como licença para manter capacidade caro ligada. A oportunidade é ter um número de utilização real para decidir.

**Minha leitura:** 24% é o tipo de número que eu quero em slide. Transforma discussão de arquitetura em aritmética: meça utilização sustentada por workload, jogue tudo abaixo da linha em serverless e provisione só o que está genuinamente acima. A mudança de design mais interessante é o filesystem compartilhado entre agentes — coordenação por estado em vez de por API — e isso merece um spike antes de virar padrão por acidente.

## Compatível com S3 não é seguro como S3

Pesquisadores da Wiz, liderados por Scott Piper, compararam serviços compatíveis com S3 da Nebius, Crusoe, Vultr, Lambda Labs, Cloudflare R2 e DigitalOcean contra o Amazon S3 ([infoq.com](https://www.infoq.com/news/2026/08/s3-clone-security/)). O S3 e seus serviços associados somam quase 300 APIs; os clones implementam um subconjunto, às vezes com semântica surpreendente. O comportamento de acesso público divergiu muito entre provedores. Mais grave: as chaves de acesso em geral não têm formato estruturado, então o secret scanning do GitHub e a maioria dos scanners não conseguem detectá-las. Corey Quinn relatou que, em um provedor, `delete-bucket-policy` apagou o bucket inteiro.

**Impacto para empresas:** todo time que move workload de IA e GPU para neocloud por custo está levando premissas de segurança da AWS que não existem lá.

**Riscos e oportunidades:** o risco é uma credencial vazada para a qual seus scanners são estruturalmente cegos. A oportunidade é pegar isso no desenho da migração, e não no incidente.

**Minha leitura:** essa é a linha de custo escondida no business case de neocloud, e ela nunca aparece na comparação de preço. Se você está avaliando um, escreva os três controles dos quais você realmente depende — bloqueio de acesso público, secret scanning, IAM de menor privilégio — e valide cada um antes de assinar. Economia de 40% em compute não sobrevive a um bucket público.

## O MCP padronizou ferramenta, não identidade

O Azure DevOps Remote MCP Server chegou em GA no endpoint `https://mcp.dev.azure.com/{organization}`, expondo work items, pull requests, repositórios e pipelines com uma única entrada em `mcp.json` ([infoq.com](https://www.infoq.com/news/2026/08/azure-devops-remote-mcp-ga/)). A autenticação é via Microsoft Entra, e é aí que trava: segundo o PM Dan Hellem, Claude Desktop, Claude Code, ChatGPT e Cursor exigem registro dinâmico de cliente ou Client ID Metadata Documents, e o Entra ainda não suporta nenhum dos dois. Os clientes que funcionam hoje são todos da Microsoft. A especificação MCP de 28 de julho de 2026, publicada uma semana antes, depreciou o registro dinâmico de cliente.

**Impacto para empresas:** times padronizados em agentes fora do ecossistema Microsoft seguem hospedando e credenciando os próprios servidores MCP, enquanto quem usa Copilot tem acesso sem instalação.

**Riscos e oportunidades:** o risco é tratar "suporte a MCP" no roadmap do fornecedor como garantia de portabilidade. A oportunidade é fazer a pergunta de autenticação durante a avaliação, quando ela ainda é barata.

**Minha leitura:** o MCP resolveu descoberta de ferramenta e deixou identidade para cada fornecedor, ou seja, o imposto de integração mudou de lugar em vez de desaparecer. Quando um fornecedor anuncia suporte a MCP, a única pergunta que importa é quais clientes conseguem autenticar hoje. Também vale registrar na semana: o **Go 1.27** chegou com métodos genéricos, `encoding/json/v2` sustentando o pacote existente (ganho de performance no unmarshal só ao atualizar), profile `goroutineleak` em GA e ML-DSA pós-quântico em `crypto/x509` e `crypto/tls` ([go.dev](https://go.dev/blog/go1.27)).

## O que observar

A tendência a acompanhar é a governança correndo atrás da geração. A camada de enforcement da Cloudflare, a admissão de capacidade do GitHub e a amplificação por retry são a mesma história vista de ângulos diferentes: a restrição saiu de produzir código e passou para absorver código. Volume deixou de ser escasso, e tudo que vem depois do volume — capacidade de revisão, folga de plataforma, higiene de credencial, custo por unidade de trabalho — passou a ser. Se o seu planejamento de 2027 ainda enquadra IA como ganho de produtividade, reenquadre. O ganho é real e em boa parte já capturado; a conta chega na plataforma, e é lá que devem estar os próximos dois trimestres de investimento em engenharia.
