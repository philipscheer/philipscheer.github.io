---
title: 'Tech Radar — O modelo deixou de ser o diferencial'
description: 'Nesta edição: um modelo de pesos abertos batendo um agente de fronteira por um sexto do custo, a volta do tokenmaxxing com o fim dos subsídios, governos controlando quem usa os melhores modelos, agentes de código enviando seus segredos sem avisar e dois lembretes de que disciplina de engenharia ainda vence.'
date: '2026-06-29'
tags: ['Tech Radar', 'AI engineering', 'FinOps', 'governança', 'liderança de tecnologia']
---

O fio condutor desta semana: o modelo de fronteira deixou de ser o diferencial. A capacidade está virando commodity rápido, e a vantagem migrou para o que está ao redor do modelo — custo por tarefa, quem tem permissão para rodá-lo, que dados seus agentes acessam e se o seu pipeline foi construído como software de verdade. Aqui está o que eu colocaria na frente de um time de liderança de tecnologia esta semana.

## Um modelo de pesos abertos bateu um agente de fronteira por um sexto do custo

A Semgrep rodou modelos de pesos abertos contra seu benchmark de segurança de IDOR e levou um susto: o GLM 5.2, da Zhipu AI, marcou 39% de F1 com um prompt simples, superando o Claude Code (32%) a cerca de **US$ 0,17 por vulnerabilidade encontrada** ([semgrep.dev](https://semgrep.dev/blog/2026/we-have-mythos-at-home-glm-52-beats-claude-in-our-cyber-benchmarks/)). O harness próprio deles ainda liderou com 53–61%, o que era justamente o ponto: a maior parte do resultado vem do andaime ao redor, não do modelo.

**Impacto para empresas:** "qual modelo" deixou de ser uma decisão única. O harness — descoberta de endpoints, seleção de contexto, parsing de saída — pesa mais no resultado do que a marca na chave de API.

**Riscos e oportunidades:** o risco é o aprisionamento a um modelo de fronteira caro quando um de pesos abertos, rodando no seu próprio ambiente, já resolve. A oportunidade é soberania de dados e controle de custo ao mesmo tempo.

**Minha visão:** invista no harness, mantenha o modelo trocável e faça benchmark na *sua* tarefa antes de padronizar. O caminho mais barato raramente é o logo mais famoso.

## O tokenmaxxing "morreu" — até a correção composta trazê-lo de volta

Um ensaio afiado argumenta que a era em que executivos forçavam gasto de tokens está acabando, à medida que OpenAI e Anthropic, ambas de olho em IPOs, cortam limites de assinatura e elevam o preço da API — mas um novo incentivo surge no lugar: a "correção composta", em que rodar um agente em loop melhora o resultado de forma confiável ([12gramsofcarbon.com](https://12gramsofcarbon.com/p/agentics-tech-things-tokenmaxxing)). O mesmo texto registra o preview do GPT-5.6 da OpenAI (Sol, Terra, Luna).

**Impacto para empresas:** o subsídio que fazia a ferramenta de IA parecer grátis acabou. A economia por token agora bate direto no resultado, e "rode em loop até acertar" é uma estratégia explícita de gasto, não um acidente.

**Riscos e oportunidades:** loops sem limite são faturas sem limite. Mas para a tarefa certa — grandes migrações, geração de testes durante a noite — um loop controlado num modelo barato supera uma única chamada cara.

**Minha visão:** orce tokens como orça computação em nuvem. Tetos, dashboards e uma métrica de custo por resultado vencem tanto a proibição geral quanto o cheque em branco.

## Governos começam a decidir quem usa os melhores modelos

Reportagens desta semana indicam que os EUA liberaram o bloqueio ao modelo mais capaz da Anthropic, o Claude Mythos 5, mas apenas para cerca de 100 instituições homologadas, depois de antes terem imposto controles de exportação por medo de jailbreaks ([12gramsofcarbon.com](https://12gramsofcarbon.com/p/agentics-tech-things-tokenmaxxing), citando a Semafor). O GPT-5.6 da OpenAI também está saindo como preview limitado, validado antes com o governo.

**Impacto para empresas:** o acesso aos modelos mais capazes está virando recurso regulado e alocado. Seu roadmap de IA agora tem uma dependência geopolítica que você não controla.

**Riscos e oportunidades:** o risco é construir a estratégia sobre um modelo que pode ser restringido, limitado ou bloqueado por região. A oportunidade fica com os times cuja arquitetura é agnóstica a modelo e degrada com elegância para o que estiver disponível.

**Minha visão:** trate o acesso a modelos de topo como risco de cadeia de suprimentos. Mantenha um portfólio, com opções de pesos abertos, para que uma decisão de política em outro país não paralise sua entrega.

## Agentes de código vão enviar seus segredos sem pestanejar

Uma issue antiga do OpenAI Codex — com mais de 450 votos positivos — documenta que ainda não há jeito confiável de impedir o agente de ler e enviar arquivos sensíveis como `.env`, chaves e credenciais ao modelo, mesmo quando estão no gitignore ([github.com/openai/codex](https://github.com/openai/codex/issues/2847)). Desenvolvedores relatam que, se o agente roda `grep` ou `cat`, o conteúdo sobe do mesmo jeito.

**Impacto para empresas:** cada dev rodando uma CLI agêntica é um caminho potencial e não auditado de vazamento de segredos e dados regulados — exposição direta à LGPD.

**Riscos e oportunidades:** o risco é vazamento silencioso, sem trilha de auditoria. A oportunidade é padronizar agora em ferramentas com deny-lists determinísticas e exclusão de arquivos em nível de sandbox, e tornar isso critério de compra.

**Minha visão:** uma organização atenta à segurança precisa de um `.agentignore` aplicável e de sandbox, não de uma convenção no README. Se a ferramenta não garante que um arquivo nunca sai da máquina, ela não está pronta para seus repositórios sensíveis.

## A Cloudflare gastou seis semanas numa condição de corrida de quatro linhas

A Cloudflare publicou uma aula sobre um bug de truncamento na biblioteca HTTP `hyper`, em Rust: respostas grandes chegavam cortadas de forma intermitente com um enganoso 200 OK, por causa de um flush descartado antes de um shutdown prematuro do socket ([blog.cloudflare.com](https://blog.cloudflare.com/hyper-bug/)). A correção tinha quatro linhas; achá-la exigiu `strace` em nível de kernel, porque a observabilidade da aplicação não mostrava nada errado.

**Impacto para empresas:** uma "melhoria" que deixou um caminho mais rápido expôs uma condição de corrida escondida numa dependência por anos. Sua stack de observabilidade tem pontos cegos abaixo da camada de aplicação.

**Riscos e oportunidades:** o risco é confiar em dashboards verdes enquanto dados se perdem em silêncio. A oportunidade é investir em habilidades de tracing de baixo nível e em contribuir correções upstream em vez de manter um fork eterno.

**Minha visão:** quando um bug é intermitente, escala com o tamanho e some quando você o observa, suspeite de timing na camada de conexão. E tenha no time alguém confortável em ler syscalls.

## "Model Training as Code" — trate o pipeline como software

A Aleph Alpha descreveu o Savanna, um sistema que implementa todo o pipeline de treino de modelos em código: execuções herméticas, com um clique, ganhando composabilidade, consenso versionado e proveniência via histórico de commits e um grafo de linhagem de artefatos ([aleph-alpha.com](https://aleph-alpha.com/en/blog/model-training-as-code/)). O ganho é organizacional — os times param de se coordenar por Slack e sistema de arquivos e passam a colaborar sobre um artefato durável.

**Impacto para empresas:** a lição vai muito além de ML. Qualquer processo complexo e multi-time que vive "na cabeça das pessoas" é frágil, não reproduzível e lento para integrar gente nova.

**Riscos e oportunidades:** o risco é conhecimento tribal e linhagem perdida. A oportunidade é a mesma disciplina que já pregamos — trunk-based development, CI, artefatos imutáveis e versionados — aplicada aos seus fluxos mais bagunçados.

**Minha visão:** se você não consegue reproduzir um resultado a partir de um hash de commit, você não tem processo, tem ritual. Coloque o pipeline em código.

## Uma ferramenta viral de RH dá uma nota diferente ao mesmo currículo a cada execução

Um engenheiro testou o agente open-source de triagem de currículos da HackerRank e obteve notas de 66 a 99 para o *mesmo currículo* em 100 execuções — reprovando num corte de 85 em 65% das vezes ([danunparsed.com](https://danunparsed.com/p/hackerrank-open-source-ats)). A categoria "experiência" dava 25/25 a todo mundo, com um prompt de duas linhas e sem âncoras; já a rubrica detalhada de "projetos" era a mais ruidosa.

**Impacto para empresas:** um LLM é ótimo para extrair dados estruturados de um currículo e péssimo para o julgamento de pontuá-lo. Usá-lo para a segunda tarefa reintroduz, de forma silenciosa, a arbitrariedade que o RH levou décadas tentando eliminar.

**Riscos e oportunidades:** o risco é um filtro de sorte não determinístico, que rejeita bons candidatos e expõe a empresa a questionamentos de justiça e jurídicos. A oportunidade é usar IA para extração e correspondência, e manter o julgamento com humanos.

**Minha visão:** nunca deixe um modelo atribuir uma nota que ele não consegue defender com uma rubrica. Se a mesma entrada gera saídas muito diferentes, você não está triando — está jogando dados.

## A tendência a observar

A capacidade está ficando barata e abundante, enquanto o *controle* — sobre custo, acesso, dados e reprodutibilidade — está virando o recurso escasso e decisivo. Os times que vencerem no próximo ano não terão o modelo mais inteligente; terão arquitetura agnóstica a modelo, governança aplicável sobre o que os agentes podem fazer e ver, e disciplina para tornar tudo isso reproduzível. Construa o harness, governe o acesso, mantenha o modelo trocável.
                                                                                                                                