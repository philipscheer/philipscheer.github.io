---
title: 'Tech Radar — A IA premia quem domina o básico'
description: 'Nesta edição: código saudável reduz em 40–45% o gasto de tokens dos agentes, o Google reescreve o livro de SRE para a era da IA, o LinkedIn corta 10% do custo de compute ao separar o shuffle do processamento, GitHub e Microsoft transformam 9.791 achados de IA em 99 relatórios corrigíveis, o FBI alerta para invasões em menos de três horas e bancos devolvem ao cliente o risco dos agentes.'
date: '2026-11-19'
tags: ['Tech Radar', 'AI engineering', 'qualidade de código', 'SRE', 'FinOps', 'plataformas de dados', 'DevSecOps', 'governança de IA']
---

A IA está acelerando tudo ao mesmo tempo: geração de código, descoberta de vulnerabilidades e ataques. As notícias desta semana mostram quem captura o ganho — não os times com mais ferramentas, mas os que têm código saudável, SLOs explícitos, credenciais revogadas e acesso com escopo. A IA amplifica os fundamentos que você já tem, bons ou ruins.

## Código saudável deixa os agentes mais baratos e confiáveis

No GOTO Copenhagen, Adam Tornhill apresentou pesquisa mostrando que, em mais de mil projetos open source, o ganho de velocidade com IA foi totalmente anulado em cerca de dois meses pelo aumento da complexidade do código ([infoq.com](https://www.infoq.com/news/2026/11/healthy-code-AI-tokens/)). Modelos rendem mais em código saudável, e o mesmo trabalho consome de 40% a 45% menos tokens. Sozinhos, os agentes corrigiram cerca de metade dos problemas em código de baixa qualidade; com um servidor MCP fornecendo dados de saúde do código, a taxa subiu para 90%–100%.

**Impacto para empresas:** dívida técnica agora aparece diretamente na fatura de IA. Código ruim significa mais tokens, mais retrabalho e mais revisão por mudança.

**Riscos e oportunidades:** o risco é medir adoção por linhas geradas enquanto a complexidade cresce em silêncio. A oportunidade é refatorar com agentes, apoiados em baseline, testes e um indicador objetivo de qualidade.

**Minha leitura:** é o argumento de negócio mais forte para refatoração que vejo em anos. Antes de comprar mais licenças de agentes, eu mediria a saúde do código nos dez módulos mais alterados e exporia essa métrica aos próprios agentes. Feedback vale mais que prompt.

## Google reescreve o livro de SRE para a era da IA

Dez anos depois do original, o Google anunciou uma segunda edição totalmente reescrita de *Site Reliability Engineering* ([infoq.com](https://www.infoq.com/news/2026/11/google-sre-book-ai-era/)). O livro troca métricas básicas de disponibilidade por SLOs centrados no usuário com alertas por burn rate, substitui game days pontuais por testes contínuos de resiliência no pipeline e inclui capacidade de GPU/TPU e FinOps. A IA aparece sobretudo como apoio: triagem, rascunho de postmortem e consultas em linguagem natural sobre telemetria.

**Impacto para empresas:** a referência do mercado agora trata confiabilidade, engenharia de plataforma e custo como uma única disciplina — e reconhece que a maioria das empresas não consegue manter um time de SRE por serviço.

**Riscos e oportunidades:** o risco é comprar um produto de "SRE com IA" sem ter SLOs para avaliá-lo. A oportunidade é distribuir referências de confiabilidade nos times de produto e incorporar testes de resiliência à esteira de entrega.

**Minha leitura:** o sinal mais útil é o que o Google *não* prometeu: a IA reúne evidências, pessoas decidem. Eu começaria com um SLO por jornada crítica do usuário e uma política de error budget aplicada automaticamente, não discutida em reunião.

## LinkedIn: separar shuffle de compute cortou 10% do custo

O LinkedIn migrou a maior parte das cargas Spark e Flink para o Apache Celeborn, um serviço de shuffle remoto em workers dedicados ([infoq.com](https://www.infoq.com/news/2026/11/linkedin-celeborn-remote-shuffle/)). As falhas diárias de shuffle caíram de cerca de 750 para 20, o custo de compute recuou 10%, o tempo de execução melhorou 14% e o custo de shuffle por tarefa caiu quase 90%. Só a troca de LZ4 por Zstandard reduziu em cerca de 35% a frota de workers de shuffle.

**Impacto para empresas:** em plataformas de dados, a disputa entre armazenamento e processamento é um imposto oculto sobre confiabilidade e custo.

**Riscos e oportunidades:** o próprio LinkedIn reconhece que operar o Celeborn nessa escala exigiu muita engenharia além do projeto original. Para times menores, a lição barata é outra: compressão e desacoplamento movem a fatura.

**Minha leitura:** eu não copiaria essa arquitetura abaixo da escala do LinkedIn. Mas verificaria quanto tempo os jobs passam esperando shuffle e testaria Zstandard ainda nesta sprint. Ajustes de configuração muitas vezes rendem mais que grandes migrações.

## GitHub e Microsoft: achar falhas ficou barato; corrigir é o gargalo

No piloto Codename MDASH, o scanner agêntico da Microsoft apontou 9.791 possíveis problemas em seis projetos open source, entre eles Express, Caddy e Netty ([github.blog](https://github.blog/open-source/maintainers/maintainers-dont-need-more-ai-bug-reports-they-need-fixes/)). Depois de triagem por IA e revisão manual de sete pesquisadores, os mantenedores receberam 99 relatórios privados com prova de conceito e sugestão de correção. Até 15 de novembro, 55 estavam corrigidos; o Caddy resolveu todos os seus 22 em até uma semana.

**Impacto para empresas:** a mesma lógica vale dentro de qualquer área de engenharia: um scanner de IA que despeja achados brutos aumenta a carga em vez de reduzir o risco.

**Riscos e oportunidades:** o piloto dependeu de verificação humana — cerca de dois dias de pesquisadores por projeto —, algo que ainda não escala. A oportunidade é exigir de qualquer ferramenta de segurança achados verificados e com correção.

**Minha leitura:** eu avaliaria ferramentas de segurança por tempo até a correção, não por volume de alertas. Um relatório com prova reproduzível e patch revisado vale mais que cem alertas num dashboard.

## FBI: ferramentas de ataque com IA invadem redes em menos de três horas

O FBI alertou que atacantes usam o Artex, plataforma open source de pentest com IA, para ir do alvo ao comprometimento "em menos de três horas" ([techcrunch.com](https://techcrunch.com/2026/11/16/fbi-says-artex-ai-open-source-hacking-tool-used-to-breach-networks-in-under-three-hours/)). A ferramenta explora falhas simples — ausência de MFA, senhas expostas ou roubadas. A Barracuda foi invadida por meio de uma credencial de terceiro que não havia sido revogada ao fim do contrato com o fornecedor.

**Impacto para empresas:** ciclos de detecção e resposta medidos em dias já não acompanham a velocidade do atacante.

**Riscos e oportunidades:** o risco é investir em defesas sofisticadas enquanto a higiene básica continua aberta. A oportunidade é barata e imediata: MFA em tudo, inventário de credenciais e revogação como etapa obrigatória no desligamento de fornecedores.

**Minha leitura:** nenhum desses ataques precisou de exploit inédito. Eu faria uma auditoria de credenciais ainda este mês, começando pelas integrações de fornecedores com quem você não trabalha mais. É essa a superfície que a IA encontra primeiro.

## Bancos devolvem ao cliente o risco dos agentes de IA

O Citi alterou seus termos: clientes que dão acesso à conta a agentes de IA de terceiros respondem pelo que esses agentes fizerem — inclusive se a ferramenta vazar credenciais ou for invadida ([techcrunch.com](https://techcrunch.com/2026/11/18/more-banks-says-customers-using-ai-agents-are-on-their-own-even-if-they-get-hacked/)). JPMorgan, Bank of America, PNC e Citizens adotaram posições semelhantes. Os agentes oferecidos pelo próprio Citi ficam fora dessa regra.

**Impacto para empresas:** qualquer produto que queira agentes agindo em nome do usuário precisa responder a uma pergunta de responsabilidade, não só técnica.

**Riscos e oportunidades:** o risco é construir agentes sobre compartilhamento de senha, algo que parceiros podem desautorizar da noite para o dia. A oportunidade é acesso com escopo, somente leitura e auditável.

**Minha leitura:** primeiro somente leitura; escrita delegada só com escopos explícitos e trilha de auditoria. Se a integração do seu agente depende de o usuário entregar a senha, não é integração — é passivo.

## A tendência a observar

O fio condutor é alavancagem. A IA multiplica a produção de defensores e atacantes, de bases de código saudáveis e doentes, de plataformas bem e mal operadas. Vão se beneficiar os times que investiram no básico pouco glamoroso — saúde do código, SLOs, higiene de credenciais e acesso com escopo —, porque é isso que define se a IA amplifica valor ou risco.
