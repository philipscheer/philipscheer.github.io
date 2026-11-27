---
title: 'Tech Radar — O incidente do seu fornecedor agora é o seu incidente'
description: 'Nesta edição: uma queda de 18 horas na nuvem da Microsoft, um vazamento na Fireworks AI que chegou a clientes do Notion, a United Airlines bloqueando agentes de IA pessoais, a CoreWeave reprecificando computação, o relatório de confiabilidade de outubro do GitHub, o agente Genie da Databricks e um guia prático de agent skills portáveis.'
date: '2026-11-13'
tags: ['Tech Radar', 'cloud', 'SRE', 'resiliência', 'segurança de IA', 'risco de fornecedor', 'FinOps', 'IA agêntica']
---

O padrão desta semana é concentração. Uma falha em cascata deixou fora do ar, por quase um dia inteiro, as ferramentas de produtividade, segurança e administração da Microsoft; um único provedor de IA invadido expôs dados dos clientes de um cliente; uma neocloud está reescrevendo o preço da computação. A pergunta para líderes de tecnologia deixou de ser "qual fornecedor é o melhor" e passou a ser "o que acontece com a gente quando esse fornecedor tem um dia ruim".

## Microsoft: uma queda de e-mail virou incidente de nuvem inteira

O que começou na quinta-feira como um problema no Outlook e no Teams se espalhou para uma queda global que também atingiu arquivos, documentos, Copilot, Defender e os painéis administrativos do Intune ([techcrunch.com](https://techcrunch.com/2026/11/13/microsoft-latest-email-outage-turned-into-a-full-blown-global-cloud-crisis/)). O tráfego voltou após cerca de 18 horas, segundo a Kentik. A Microsoft falou em "um grande número de servidores inesperadamente indisponíveis", disse não haver evidência de atividade maliciosa e ainda não divulgou a causa raiz.

**Impacto para empresas:** com comunicação, segurança e gestão de dispositivos no mesmo provedor, um incidente derruba o trabalho e as ferramentas de resposta.

**Riscos e oportunidades:** o risco é ter um processo de incidentes que pressupõe Teams e e-mail corporativo funcionando. A oportunidade é barata: um canal alternativo, runbooks acessíveis offline e contas administrativas de emergência que não dependam do tenant afetado.

**Minha visão:** eu não sairia da Microsoft por causa disso, mas testaria o cenário. Faça um exercício de uma hora com Teams, e-mail e Intune "fora do ar" e veja quem ainda consegue abrir um incidente, falar com clientes e subir uma correção.

## Vazamento na Fireworks AI chega a clientes do Notion

Atacantes invadiram o provedor de nuvem da Fireworks AI, alcançaram um sistema de desenvolvimento e levaram dados de faturamento e alguns datasets de clientes ([techcrunch.com](https://techcrunch.com/2026/11/12/cyberattack-on-fireworks-ai-allowed-hackers-to-access-notion-customers-chat-transcripts/)). O Notion confirmou que cerca de 1% dos seus clientes foi afetado, incluindo transcrições de chat do recurso "Insights" do Notion AI, e cortou toda a conexão com a Fireworks em 3 de novembro. É o segundo incidente do provedor em dois meses.

**Impacto para empresas:** as funcionalidades de IA do seu produto herdam a postura de segurança de cada provedor de inferência por trás delas — e os prompts dos seus clientes também.

**Riscos e oportunidades:** prompts e respostas raramente são classificados como dados sensíveis, mas costumam conter contratos, código e dados pessoais — tema direto de LGPD. A oportunidade é incluir provedores de IA na due diligence de fornecedores: retenção, suboperadores, prazo de notificação e um botão de desligar testado.

**Minha visão:** o controle mais rápido do Notion foi desconectar o fornecedor. Toda integração de IA deveria ter esse botão e um modelo de fallback definidos antes da produção, não durante o incidente.

## United Airlines bloqueia agentes de IA pessoais

A United vai restringir agentes de IA de terceiros não autorizados que compram passagens e gerenciam reservas, tanto nas próprias plataformas quanto via agências e agregadores ([techcrunch.com](https://techcrunch.com/2026/11/12/united-airlines-blocks-ai-agents-from-booking-flights-citing-cybersecurity-risks/)). A companhia cita compartilhamento de credenciais, compras ou uso de milhas não intencionais e regras federais que exigem que um humano conclua etapas como as declarações do check-in.

**Impacto para empresas:** agentes de consumo estão batendo em um muro de identidade e responsabilidade. Qualquer negócio com clientes logados vai precisar decidir como agentes podem agir em nome deles.

**Riscos e oportunidades:** só bloquear empurra agentes para scraping e senha compartilhada. A oportunidade é acesso delegado desde o design: tokens com escopo, limites de gasto e confirmação humana explícita nas etapas reguladas.

**Minha visão:** é uma decisão de produto de API disfarçada de política de segurança. Quem oferecer um caminho seguro para agentes transacionarem vai capturar esse tráfego.

## CoreWeave: pré-pagamento, contratos curtos e preços em alta

A CoreWeave reportou US$ 3,66 bilhões de receita no trimestre, alta de 168%, com prejuízo líquido de US$ 709 milhões ([techcrunch.com](https://techcrunch.com/2026/11/11/coreweave-turns-to-customer-prepayments-shorter-contracts-to-fund-ai-growth/)). A empresa espera cerca de US$ 9 bilhões em pré-pagamentos de clientes em três meses, subiu preços em aproximadamente 25% em julho e mais 10% depois, e vende capacidade de curto prazo acima de US$ 40 milhões por megawatt/ano, contra US$ 20–25 milhões em contratos de quatro a cinco anos.

**Impacto para empresas:** capacidade de GPU está sendo precificada como commodity escassa, e os fornecedores querem que o cliente financie a expansão.

**Riscos e oportunidades:** compromissos longos travam preço e fornecedor. A oportunidade é separar a inferência de base, que pode ser contratada, dos experimentos, que devem continuar sob demanda ou em modelos menores.

**Minha visão:** antes de assinar qualquer contrato plurianual de computação, quero previsão de utilização e cláusula de saída. Pagar adiantado por capacidade ociosa é financiar o fornecedor, não otimizar custo.

## Relatório de outubro do GitHub: capacidade não é resiliência

O GitHub divulgou oito incidentes em outubro, incluindo duas quedas de escrita causadas por um novo nó de roteamento com registros desatualizados e uma falha de rede da Azure nas três zonas de disponibilidade da região Central US ([github.blog](https://github.blog/news-insights/company-news/github-availability-report-october-2026/)). A regra declarada: "disponibilidade, depois capacidade, depois funcionalidades".

**Impacto para empresas:** as falhas foram tempestades de retries, pools de conexão esgotados e manutenção insegura — padrões comuns a qualquer plataforma.

**Riscos e oportunidades:** a oportunidade é copiar as correções: backoff aleatório em reconexões, limites de conexão, validação de mudanças de roteamento e automações que respeitam pausas de manutenção.

**Minha visão:** é um dos melhores cursos gratuitos de SRE disponíveis. Eu levaria para a próxima revisão de plantão, item a item: "isso poderia acontecer aqui?"

## Databricks Genie: um agente sempre ligado para executivos

A Databricks lançou uma nova versão do agente Genie, que executa tarefas de várias etapas sem supervisão, ancorado em uma ontologia construída sobre os dados do cliente na plataforma ([techcrunch.com](https://techcrunch.com/2026/11/11/databricks-new-ai-agent-tells-ceo-ali-ghodsi-the-unvarnished-truth/)). O CEO Ali Ghodsi mostrou como usa o agente para analisar resultados ruins de pesquisa interna e reuniões de venda malsucedidas — o que raramente chega ao CEO de uma empresa de 12 mil pessoas. O custo, diz ele, é controlado com limites de uso e modelos open-weight no Unity Gateway.

**Impacto para empresas:** agentes estão saindo da engenharia e entrando na gestão, onde a entrada é dado interno e a saída influencia decisões.

**Riscos e oportunidades:** um agente é tão honesto quanto os dados e as permissões que ele enxerga. A oportunidade é sinal mais rápido para a liderança, desde que governança e teto de custo venham primeiro.

**Minha visão:** útil, mas não substitui a cultura que faz as pessoas reportarem más notícias. Use para descobrir as perguntas certas e depois vá conversar com o time.

## GitHub: escreva agent skills uma vez e mantenha o acesso no host

O GitHub publicou um guia prático de agent skills: diretórios versionados com um `SKILL.md` que descreve uma tarefa repetível e roda em Copilot, Claude Code e Cursor ([github.blog](https://github.blog/ai-and-ml/github-copilot/build-once-run-on-any-agent-a-practical-guide-to-agent-skills/)). Os princípios: detalhes do projeto em um manifesto, credenciais no host, verificador separado do agente que fez o trabalho e regras de merge aplicadas no CI, não nas instruções.

**Impacto para empresas:** conhecimento institucional pode virar arquivo versionado e revisável, em vez de prompt repetido no chat.

**Minha visão:** "autoverificação não é verificação" é a frase que eu colocaria na parede de todo time.

## A tendência a observar

Risco de concentração virou métrica de engenharia. Tenants de nuvem, provedores de inferência de IA e fornecedores de GPU estão se tornando pontos únicos de falha para operação, dados e custo ao mesmo tempo. Os líderes que saírem na frente vão mapear essas dependências, manter um fallback testado para cada uma e tratar o incidente do fornecedor como seu — porque o cliente vai enxergar assim.
