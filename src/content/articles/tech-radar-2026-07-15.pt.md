---
title: 'Tech Radar — O andaime sobe mais rápido que a confiança'
description: 'Nesta edição: um modelo de 27B rodando no celular, um zero-day no Cursor sem correção por sete meses, CLIs de código enviando sua pasta pessoal, um ensaio sobre por que sistemas vibecoded se desfazem, a Oracle rebaixada por causa da aposta em IA e dados como preço de entrada.'
date: '2026-07-15'
tags: ['Tech Radar', 'AI engineering', 'segurança', 'FinOps', 'liderança de tecnologia']
---

O fio condutor desta semana: a capacidade avança em disparada enquanto os alicerces embaixo dela — segurança, confiança, coordenação e economia — vão ficando para trás em silêncio. Modelos já cabem no celular, agentes reescrevem bases de código antes que alguém consiga discordar, e há dinheiro sendo emprestado contra um futuro que ainda não chegou. O andaime sobe; a pergunta é se ainda alguém entende como ele se sustenta. Aqui está o que eu colocaria na frente de um time de liderança de tecnologia esta semana.

## Um modelo de 27B agora roda no seu celular

A PrismML lançou o Bonsai 27B, que chama de o primeiro modelo da classe 27B capaz de rodar em um smartphone. A variante de 1 bit tem 3,9 GB — pequena o bastante para um iPhone — e a ternária tem 5,9 GB para notebooks, ambas prometendo raciocínio em várias etapas, chamada de ferramentas e fluxos agentic com cerca de 14× menos memória, 8× mais velocidade e 5× menos energia que um modelo padrão de 16 bits ([prismml.com](https://prismml.com/)). Na mesma semana, a nova API SpeechAnalyzer da Apple, que roda no dispositivo, foi comparada de igual para igual com o Whisper ([get-inscribe.com](https://news.ycombinator.com/best)).

**Impacto para empresas:** a suposição de que IA séria significa uma ida ao datacenter está caindo. Inferência de verdade no próprio aparelho muda latência, custo por requisição e, principalmente, por onde os dados regulados precisam trafegar.

**Riscos e oportunidades:** a oportunidade é soberania de dados e custo marginal quase zero para o que couber localmente. O risco é a fragmentação: uma frota de modelos no dispositivo é muito mais difícil de versionar, avaliar e governar do que um único endpoint de API.

**Minha visão:** para qualquer funcionalidade que toca em dado pessoal ou regulado, vale olhar seriamente para on-device antes de assinar mais um contrato por uso. Mantenha o modelo trocável e faça benchmark na sua própria tarefa — promessa de densidade é marketing até passar no seu critério.

## Um zero-day no Cursor ficou sete meses sem correção

A Mindgard publicou um relatório de divulgação total sobre uma falha no Cursor: no Windows, abrir um repositório que contém um `git.exe` malicioso na raiz faz o IDE executá-lo automaticamente — sem clique, sem aviso, de forma repetida — porque a resolução de caminho do Git do Cursor procura dentro do próprio workspace. Isso é execução de código arbitrário com zero interação. Foi reportado em dezembro de 2025 e continua presente 197+ versões depois; a Mindgard só tornou público após sete meses sem resposta significativa do fornecedor ([mindgard.ai](https://mindgard.ai/blog/cursor-0day-when-full-disclosure-becomes-the-only-protection-left)).

**Impacto para empresas:** o Cursor afirma ter mais de 50 mil empresas como clientes. Uma execução de código trivialmente explorável em uma ferramenta com acesso ao seu código, credenciais e terminal é uma exposição corporativa inteira, não o problema pessoal de um dev.

**Riscos e oportunidades:** o risco é óbvio. A oportunidade é de processo — este é o momento de exigir de todo fornecedor de ferramenta de IA o security.txt, o SLA de correção e o histórico real de fechamento de reports.

**Minha visão:** confiança se conquista pelo comportamento, não pelo valuation. Até isso ser corrigido, repositórios não confiáveis só devem ser abertos em sandbox ou VM descartável, e regras de bloqueio tipo AppLocker cabem nas máquinas gerenciadas. E "em quanto tempo você corrige uma falha reportada" deveria ser pergunta de compra, não detalhe secundário.

## Seu agente de código vai enviar sua pasta pessoal sem pestanejar

Dois assuntos relacionados lideraram o Hacker News: relatos de que um CLI do Grok enviou a pasta pessoal inteira de um usuário para o Google Cloud Storage, e a notícia de que o Codex, da OpenAI, passou a criptografar prompts de subagentes ([github.com/openai](https://github.com/openai)). Ferramentas diferentes, mesma realidade de fundo — CLIs agentic leem e transmitem muito mais da sua máquina do que a maioria imagina, e as proteções estão sendo colocadas depois do estrago.

**Impacto para empresas:** cada desenvolvedor rodando um CLI agentic é um caminho potencial e não auditado de vazamento de segredos e dados regulados — exposição direta à LGPD e à GDPR, sem rastro.

**Riscos e oportunidades:** o risco é o vazamento silencioso que você só descobre num relatório de incidente. A oportunidade é padronizar agora em ferramentas com listas de exclusão determinísticas e isolamento de arquivos no nível do sandbox, e transformar isso em critério explícito de escolha.

**Minha visão:** uma política de exclusão que se pode impor, mais sandbox, vence qualquer convenção escrita num README. Se a ferramenta não garante que um arquivo nunca sai da máquina, ela não deveria chegar perto dos seus repositórios sensíveis — por mais que acelere uma demo.

## Por que sistemas vibecoded se desfazem mesmo compilando

O ensaio "The Tower Keeps Rising", de Armin Ronacher, argumenta que software grande nunca foi limitado só pela velocidade com que um indivíduo escreve código — foi limitado por quão bem as pessoas coordenam um entendimento compartilhado do sistema ([lucumr.pocoo.org](https://lucumr.pocoo.org/2026/7/13/the-tower-keeps-rising/)). Os agentes removem o atrito que antes forçava essa sincronização: eu adiciono OAuth, você adiciona cache, outra pessoa reconstrói o banco, cada mudança razoável isoladamente, sem que nenhum de nós precise adquirir o modelo mental comum. Diferente de Babel, a construção não para quando a língua comum se perde — ela continua, e é justamente isso que torna a perda invisível.

**Impacto para empresas:** as métricas de velocidade podem parecer ótimas enquanto a coerência arquitetural se corrói em silêncio. A falha aparece tarde, na forma de um sistema que ninguém consegue raciocinar em conjunto.

**Riscos e oportunidades:** o risco é uma base de código que cresce mais rápido que o entendimento de qualquer um sobre ela. A oportunidade é tratar o entendimento compartilhado como entrega explícita — design docs, ADRs e revisão que existe para sincronizar pessoas, não só para aprovar diffs.

**Minha visão:** é a articulação mais clara que já vi do custo real da engenharia assistida por IA. A resposta não é desacelerar; é tratar coordenação como trabalho de primeira classe. Um `design.md` e uma conversa de revisão de verdade saem mais baratos que uma arquitetura sem dono.

## Oracle rebaixada por causa da aposta em datacenters de IA

A S&P Global rebaixou a nota de crédito da Oracle em um degrau, de BBB para BBB-, agora um passo acima do grau especulativo ([heise.de](https://news.ycombinator.com/best)). O movimento reflete a dívida que a Oracle está assumindo para financiar uma expansão agressiva de datacenters de IA e cloud contra uma demanda futura ainda não realizada.

**Impacto para empresas:** o boom de infraestrutura de IA está cada vez mais financiado por dívida, e as agências de rating começam a precificar o risco. O balanço do seu fornecedor de cloud agora faz parte do seu risco de fornecimento.

**Riscos e oportunidades:** o risco é apostar sua plataforma num provedor esticando as finanças para vencer uma corrida por capacidade. A oportunidade é dos times cuja arquitetura permanece portátil o suficiente para mover cargas se preço ou termos mudarem.

**Minha visão:** FinOps não é mais só sobre a sua fatura. Ao se comprometer com capacidade plurianual, considere a trajetória financeira do provedor como faria com qualquer fornecedor crítico. Portabilidade é hedge, não purismo.

## Dados como preço de entrada

O Samsung Health teria avisado usuários de que optar por sair do treinamento de IA poderia significar a exclusão dos seus dados ([neow.in](https://news.ycombinator.com/best)). Seja qual for a política final, o enquadramento — seus dados ou seu acesso — está virando um padrão que vale nomear.

**Impacto para empresas:** consentimento-como-coerção atrai atenção regulatória sob LGPD e GDPR e corrói a confiança que faz produtos orientados a dados funcionarem em primeiro lugar.

**Riscos e oportunidades:** o risco é uma captura de dados de curto prazo que vira passivo de longo prazo. A oportunidade é competir por consentimento genuíno e transparência enquanto os outros normalizam o oposto.

**Minha visão:** se o seu plano de crescimento depende de fazer da privacidade a moeda que o usuário precisa entregar, o plano é frágil. Construa o caso de valor para que as pessoas optem por entrar porque vale a pena — é a versão que sobrevive ao contato com um regulador.

## A tendência a observar

O denominador comum das seis histórias é uma distância crescente entre o que nossas ferramentas conseguem fazer e o quanto conseguimos confiar nelas, entendê-las e pagá-las. Modelos no dispositivo e código agentic são alavancagem real — mas um zero-day aberto por sete meses, CLIs enviando pastas pessoais e bases de código que ninguém raciocina em conjunto são a conta chegando por andarmos mais rápido que os nossos alicerces. Os times que ganharem o próximo ano não serão os que adotarem mais IA. Serão os que a combinarem com disciplina de segurança, coordenação explícita e economia honesta — para que, enquanto o andaime sobe, ainda haja alguém que entenda por que ele se sustenta.
