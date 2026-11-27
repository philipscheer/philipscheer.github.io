---
title: 'Tech Radar — A aprovação virou o novo gargalo'
description: 'Nesta edição: Meta e PyTorch deixam um revisor de IA aprovar PRs de baixo risco, a Anthropic lança o Claude Ship com aprovação por política, a QCon SF discute como acabar com o code review, a Netflix mede o raio de impacto de mudanças de API, o GitHub passa a cobrar o review do Copilot da organização, o AWS Lambda dobra o timeout e a 1Password é invadida por uma conta do GitHub.'
date: '2026-11-27'
tags: ['Tech Radar', 'AI engineering', 'code review', 'IA agêntica', 'DevSecOps', 'FinOps', 'serverless', 'liderança de engenharia']
---

Escrever código deixou de ser a restrição há algum tempo. Nesta semana, o mercado avançou para a próxima: decidir o que é seguro para fazer merge. Meta, PyTorch, Anthropic e OpenAI descrevem formas de deixar máquinas aprovarem mudanças rotineiras, enquanto a conta, o raio de impacto e a superfície de ataque do controle de versão ficam com a empresa. A pergunta para a liderança já não é "a IA deve revisar código?", e sim "quais mudanças podem passar só com evidência, e quem é dono dessa regra?".

## Meta e PyTorch deixam um revisor de IA aprovar PRs de baixo risco

O GreenLight, do PyTorch, já aprova pull requests dos próprios mantenedores. É uma versão open source do RADAR, sistema que a Meta usa para integrar automaticamente diffs de baixo risco ([infoq.com](https://www.infoq.com/news/2026/11/uber-agent-spend-steady/)). O ponto de partida do paper da Meta é capacidade: as linhas de código por diff humano cresceram 105,9% em um ano, e mais de 80% desse aumento é atribuído à IA agêntica. O RADAR combina critérios rígidos de elegibilidade, um Diff Risk Score por percentil e um revisor LLM que exige confiança mínima de 8/10; mesmo aprovados, os diffs aguardam numa fila com atraso antes de entrar.

**Impacto para empresas:** a aprovação automática sai do experimento e vira prática documentada, com um desenho de referência: confiar no autor, pontuar o risco, classificar a mudança e atrasar a entrada.

**Riscos e oportunidades:** o risco é copiar o resultado sem as salvaguardas — a Meta exclui código sob SOX e open source e exige 60 dias sem incidentes por runbook. A oportunidade é devolver tempo de revisão sênior para as mudanças que realmente precisam dele.

**Minha leitura:** a ideia mais valiosa aqui não é o LLM, é o score de risco e o atraso. Qualquer time pode começar com codemods determinísticos e atualização de dependências, medir reverts por um trimestre e só então ampliar o escopo.

## Anthropic lança o Claude Ship com aprovação baseada em política

A Anthropic lançou o Claude Ship, que junta o Code Review (já disponível) a dois agentes em beta: o PR Steward, que corrige CI quebrado, conflitos de merge e comentários de revisão, e o Claude Approvals, que aprova mudanças com base numa política escrita como arquivo no repositório ([techcrunch.com](https://techcrunch.com/2026/11/23/anthropic-launches-claude-ship-letting-ai-agents-review-fix-and-approve-code-changes/)). A recomendação é começar em modo somente observação, em um repositório, com limite mensal de gasto.

**Impacto para empresas:** a autoridade de aprovação vira um artefato versionado. Isso é boa governança: dá para revisar, comparar e auditar como qualquer código.

**Riscos e oportunidades:** política em linguagem natural continua ambígua, e um agente aprovador do mesmo fornecedor que escreveu o código não é evidência independente. A oportunidade é que o modo observação entrega uma linha de base sem custo: quantas vezes o agente teria aprovado algo que um humano depois rejeitou?

**Minha leitura:** eu rodaria em modo sombra por 30 dias e compartilharia a taxa de divergência com o time antes de conceder qualquer direito real de aprovação. Sem dado, sem delegação.

## QCon SF: como acabar com o code review

Ankit Jain, CEO da Aviator, defendeu que a revisão linha a linha já está desaparecendo: um estudo da Faros com mais de 4.000 times mostrou que mais de 75% dos PRs entram sem revisão humana, enquanto o PR mediano chega a 640 linhas — bem acima das ~400 em que a qualidade da revisão despenca ([infoq.com](https://www.infoq.com/news/2026/11/qcon-sf-26-kill-code-review/)). Ele propõe seis camadas — argumentar, capturar, codificar, provar, debater, assumir — e relata que seu time faz quatro vezes mais merges com cerca de 40% menos reverts. Ele próprio declarou o conflito de interesse.

**Impacto para empresas:** se a maioria dos PRs já entra sem revisão, o controle real é o que roda antes do merge. Transformar comentários recorrentes em invariantes — a Aviator converteu 11.000 comentários em 64 regras — vira conhecimento tácito em verificação automática.

**Riscos e oportunidades:** o risco é o "teatro de revisão": agentes escrevem, agentes revisam, humanos passam o olho. A oportunidade é evidência no lugar de check verde — screenshots, requisições gravadas, latências —, porque o agente que escreveu o código provavelmente escreveu os testes.

**Minha leitura:** a história de incidente dele é a lição. Uma query sem índice passou por todos os filtros; o post-mortem perguntou qual regra faltava, não quem aprovou. É a pergunta certa, e só funciona se as regras tiverem dono.

## Netflix mede o raio de impacto de mudanças de API

A Netflix criou o Quasar, que indexa definições e referências de símbolos com SCIP durante o CI, armazena em Parquet no S3 e consulta via Athena para mostrar quais repositórios de fato chamam uma API antes de a mudança sair ([infoq.com](https://www.infoq.com/news/2026/11/netflix-quasar-api-impact/)). Num exemplo, a remoção de um método depreciado afetava 137 repositórios em três versões da biblioteca. Os resultados ficam expostos via REST, GraphQL e um servidor MCP para agentes de código.

**Impacto para empresas:** análise de impacto passa a ser dado, não palpite — e sobre armazenamento e consulta serverless de baixo custo.

**Riscos e oportunidades:** a própria Netflix avisa que ausência de referência não prova que a API está sem uso; reflection, índices desatualizados e jobs raros continuam invisíveis. A oportunidade é entregar esse contexto aos agentes antes de abrirem o PR.

**Minha leitura:** é exatamente o sinal que uma política de aprovação automática precisa. "Baixo risco" deveria significar "baixo raio de impacto", e isso só se afirma medindo.

## GitHub passa a cobrar o review do Copilot da organização

A partir de 30 de dezembro de 2026, reviews do Copilot feitos por membros licenciados sem escolha de cobrança salva serão cobrados da organização dona do repositório, e não mais da franquia do membro ([github.blog](https://github.blog/changelog/2026-11-25-copilot-code-review-billing-will-default-to-the-organization)). Quem quiser manter o comportamento atual precisa selecionar **Member** antes da data; o GitHub avisa que a cobrança na organização exige AI Credits pagos e pode aumentar o gasto.

**Impacto para empresas:** revisão automatizada vira item medido na fatura da empresa, com um padrão que muda sem ninguém mexer em configuração.

**Riscos e oportunidades:** padrão silencioso é como conta de cloud surpreende o financeiro. A oportunidade é tornar a decisão explícita e atribuir um dono de orçamento.

**Minha leitura:** coloque isso no checklist de dezembro hoje. Qualquer que seja a escolha, que seja deliberada — e acompanhe custo por PR revisado ao lado da taxa de revert.

## AWS Lambda dobra o timeout para 30 minutos

A AWS elevou o timeout máximo das Lambda Event Functions sob demanda de 15 para 30 minutos em todas as regiões comerciais, sem opt-in e sem novo preço ([infoq.com](https://www.infoq.com/news/2026/11/aws-lambda-30-minute-timeout/)). A própria AWS lista os efeitos colaterais: o dobro de concorrência para a mesma taxa de requisições, visibility timeout do SQS de até três horas e alguns mapeamentos de Kafka e MQ que precisam ser recriados.

**Impacto para empresas:** cadeias longas de agentes, transcodificação e jobs batch podem ficar no Lambda, sem migrar para Fargate ou ECS.

**Riscos e oportunidades:** uma função assíncrona que estoura o timeout três vezes roda 90 minutos antes de cair na dead-letter queue, cobrada pela memória cheia. A oportunidade é uma arquitetura mais simples para tarefas longas e realmente esporádicas.

**Minha leitura:** mais tempo não corrige código lento atrás de uma API. Antes de aumentar o timeout, eu verificaria custo por invocação e idempotência; para fluxos com várias etapas, Step Functions continua sendo a resposta mais limpa.

## 1Password é invadida pela conta GitHub de um funcionário

A 1Password detectou uma invasão em 19 de novembro: o atacante usou a conta corporativa de GitHub de um funcionário para enviar código malicioso a servidores internos e baixar nomes, e-mails de login e datas de atividade de clientes ([techcrunch.com](https://techcrunch.com/2026/11/25/1password-said-hackers-broke-into-its-internal-systems-but-customer-passwords-are-safe/)). A empresa afirma que cofres, senhas e chaves secretas nunca estiveram acessíveis.

**Impacto para empresas:** controle de versão é produção. Uma conta capaz de enviar código que chega a servidores internos é uma identidade privilegiada, seja de pessoa ou de agente.

**Riscos e oportunidades:** com aprovações automatizadas, uma identidade comprometida atravessa o pipeline mais rápido. A oportunidade é tratar direito de merge, caminho de deploy e assinatura como controles de segurança, não como conveniência do desenvolvedor.

**Minha leitura:** este é o contrapeso do restante da edição. Toda política de aprovação automática precisa responder: e se o autor não for quem pensamos que é?

## A tendência a observar

A revisão está sendo reconstruída como sistema: níveis de confiança, score de risco, invariantes codificadas, evidência e entrada com atraso — com pessoas focadas em decisões, não em diffs. Em 2027, vão se destacar os times capazes de provar, com dados, quais mudanças são seguras para automatizar, e que precificam essa automação com a mesma clareza com que precificam compute. Delegar a aprovação é aceitável; delegar a responsabilidade, não.
