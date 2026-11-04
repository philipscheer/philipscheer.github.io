---
title: 'Tech Radar — Capacidade e custo viraram restrições de arquitetura'
description: 'Nesta edição: a AWS diz que a capacidade comprometida está praticamente esgotada até 2027, o Grok Bot bate no teto de custo enquanto usuários avançados gastam seis dígitos em tokens, a Docker trata segurança de agentes como problema de isolamento, a Shopify aprende que o repositório mostra a intenção e o cluster mostra a realidade, o ECS Gateway chega com arestas e o GitHub torna o rateio por centro de custo automatizável.'
date: '2026-11-04'
tags: ['Tech Radar', 'FinOps', 'cloud', 'planejamento de capacidade', 'AI engineering', 'IA agêntica', 'DevSecOps', 'engenharia de plataforma']
---

Por uma década, a estratégia de cloud partiu do princípio de que capacidade era infinita e a única discussão era preço. As notícias desta semana dizem o contrário: capacidade está sendo racionada, produtos de IA esbarram no próprio limite de unit economics e a segurança de agentes depende de restringir o que eles alcançam. Restrições precisam estar na arquitetura, não no post-mortem.

## AWS: capacidade comprometida praticamente esgotada até 2027

O CEO da Amazon, Andy Jassy, afirmou que a grande capacidade comprometida da AWS está praticamente vendida até 2027, com boa parte de 2028 já alocada, mantendo uma reserva para On-Demand, EC2 e Bedrock ([infoq.com](https://www.infoq.com/news/2026/11/aws-capacity-sold-out/)). Profissionais relatam dificuldade para obter capacidade On-Demand até de instâncias EC2 comuns, não só GPUs.

**Impacto para empresas:** planejamento de capacidade volta à pauta. Pipelines e autoscaling que assumem "sempre haverá mais uma instância" podem falhar no pior momento.

**Riscos e oportunidades:** o risco é a reserva por pânico — times reservando capacidade "por via das dúvidas", o que um comentarista chamou, com razão, de antipadrão de cloud. A oportunidade é diversificar famílias de instância e regiões e medir a eficiência das reservas com o EC2 Capacity Manager.

**Minha leitura:** eu não assinaria compromisso plurianual com base em manchete. Mas testaria, ainda neste trimestre, a flexibilidade de instâncias no deploy: carga que só roda em um tipo de instância numa única zona é ponto único de falha.

## O teto de custo da IA chegou — para fornecedores e para usuários avançados

Elon Musk confirmou que os limites de uso do Grok Bot foram reduzidos no fim de semana do Halloween porque "o custo de servir o Grok Bot estava insustentavelmente alto em relação à receita"; alguns usuários viram a cota semanal saltar de 50% para 100% da noite para o dia ([techcrunch.com](https://techcrunch.com/2026/11/02/elon-musk-throttles-grok-bot-limits-due-to-unsustainably-high-costs/)). Nos mesmos dias, o CEO da Y Combinator, Garry Tan, disse gastar entre US$ 100 mil e US$ 200 mil por ano em tokens com agentes, e que a adoção ampla depende de os custos caírem ([techcrunch.com](https://techcrunch.com/2026/11/02/y-combinators-garry-tan-uses-ai-agents-so-much-he-spends-up-to-200k-a-year-on-tokens/)).

**Impacto para empresas:** assinatura de IA com preço fixo é um experimento de precificação, não um contrato sobre o qual se constrói processo. O fornecedor muda o limite quando a conta deixa de fechar.

**Riscos e oportunidades:** o risco é um fluxo crítico que degrada em silêncio quando a cota muda. A oportunidade é tratar uso de agentes como custo variável: orçamento por time, alertas e valor por token.

**Minha leitura:** uma conta de tokens de seis dígitos é razoável se substitui trabalho que vale mais do que isso. A maioria das empresas ainda não sabe responder isso. Antes de escalar agentes, eu instrumentaria custo por resultado aceito — por PR mergeado, por chamado resolvido — e desenharia um plano B para quando o fornecedor mudar as regras.

## Docker: segurança de agentes é problema de isolamento, não de prompt

A Docker publicou um guia com cinco riscos de agentes — prompt injection, uso indevido e envenenamento de ferramentas, autonomia excessiva, exposição de credenciais e exfiltração de dados — e defende que o agente "não tem forma confiável de distinguir uma instrução legítima de uma injetada" ([infoq.com](https://www.infoq.com/news/2026/11/docker-ai-agent-security/)). Um dos exemplos: um agente com acesso de operador apagou e recriou um ambiente de produção, causando treze horas de indisponibilidade regional. A recomendação: sandboxes descartáveis, credenciais de curta duração injetadas em runtime e saída de rede por allowlist.

**Impacto para empresas:** o raio de impacto de um agente é igual às permissões que ele herda. Um agente rodando com o token pessoal de um desenvolvedor *é* esse desenvolvedor, sem o discernimento dele.

**Riscos e oportunidades:** containers compartilham kernel; agentes que executam código de terceiros pedem microVMs ou gVisor. A boa notícia: os controles são conhecidos.

**Minha leitura:** "modo YOLO" só é aceitável dentro de uma caixa que você está disposto a perder. Alinhe a fronteira de isolamento à fronteira de confiança, dê ao agente uma identidade própria e nunca coloque credencial de produção na janela de contexto.

## Shopify: o repositório mostra a intenção; o cluster mostra a realidade

A Shopify reconstruiu o Overexposed — scanner que encontra Ingresses no GKE e serviços Cloud Run acessíveis pela internet sem autenticação — depois que a primeira versão, baseada na configuração do repositório, gerou falsos positivos e pontos cegos ([infoq.com](https://www.infoq.com/news/2026/11/shopify-kubernetes-ingresses/)). A nova versão lê o Cloud Asset Inventory do GCP e faz uma requisição anônima por candidato, reduzindo em cerca de 80% os veredictos inconclusivos. Evidência incerta continua "inconclusiva" em vez de virar "protegida".

**Impacto para empresas:** checagens de configuração como código no CI são necessárias, mas não suficientes. Admission controllers e outras ferramentas mudam o que de fato roda.

**Riscos e oportunidades:** o risco é um painel verde que mede intenção. A oportunidade custa pouco: APIs de inventário já existem, e uma allowlist com host e path exatos torna exceções revisáveis.

**Minha leitura:** o detalhe que mais valorizo é a recusa em chamar o desconhecido de "seguro". É a mesma disciplina que quero de relatórios gerados por IA — e a Shopify construiu o scanner com agentes de IA, usando testes de mutação para validar os próprios testes.

## Amazon ECS Gateway: abstração útil, mas leia os limites antes

A AWS lançou o Amazon ECS Gateway, recurso de ingress no nível da conta em que o time de plataforma define a rede uma vez e os times de aplicação conectam seus serviços, sem custo adicional além dos recursos provisionados ([infoq.com](https://www.infoq.com/news/2026/11/introducing-amazon-ecs-gateway/)). Cada serviço recebe um hostname gerado, com roteamento por host, e a documentação não trata de domínios customizados. O gateway cria load balancers conforme enchem, mas não os consolida — ALBs parcialmente ocupados, e cobrados, podem se acumular.

**Impacto para empresas:** a separação plataforma/aplicação é o modelo certo para quem está escalando ECS, e ambientes de preview são encaixe imediato.

**Riscos e oportunidades:** os riscos são desvio de custo por ALBs não consolidados, limite de 25 serviços por load balancer, HTTPS apenas na porta 443 e falhas se alguém alterar à mão os recursos gerenciados.

**Minha leitura:** avalie abstrações gerenciadas pelo custo de saída, não pela demo. Faça piloto em ambientes efêmeros, monitore a contagem de load balancers e espere suporte a domínio próprio antes de migrar serviços de clientes.

## GitHub torna o rateio por centro de custo automatizável

O GitHub adicionou um endpoint REST que informa a qual centro de custo pertence um usuário, organização, repositório ou time do enterprise ([github.blog](https://github.blog/changelog/2026-11-03-look-up-a-resources-cost-center-with-the-github-rest-api)).

**Impacto para empresas:** com Copilot e agentes virando linha relevante do orçamento, alocar o gasto ao time certo é pré-requisito para discutir ROI.

**Riscos e oportunidades:** o risco são recursos sem centro de custo — o endpoint devolve lista vazia, o que torna essa lacuna fácil de detectar. A oportunidade é showback automatizado no mesmo pipeline que provisiona repositórios.

**Minha leitura:** API pequena, grande valor de governança. Inclua uma checagem que falha quando um repositório novo nasce sem centro de custo. O que é alocado é gerenciado.

## A tendência a observar

Capacidade infinita e IA a preço fixo eram, ambas, subsídios — e os dois estão sendo retirados. Vão se destacar os times que projetam para a escassez: capacidade flexível, uso de IA precificado por resultado, agentes isolados por padrão e custo alocado desde o primeiro dia.
