---
title: 'Tech Radar — O harness é onde moram o risco e o custo'
description: 'Nesta edição: as regras "não perguntar novamente" do Claude Code vazam segredos em repositórios públicos, a QCon SF defende que o harness importa mais que o modelo, o Google tira as credenciais do sandbox de agentes, o AWS Lambda ganha GPUs, o PostgreSQL 19 traz repack online e a Uber corta 90% da memória de cache.'
date: '2026-11-23'
tags: ['Tech Radar', 'AI engineering', 'IA agêntica', 'DevSecOps', 'FinOps', 'serverless', 'bancos de dados', 'arquitetura de software']
---

A maioria das conversas sobre IA ainda começa com "qual modelo?". As notícias desta semana mostram que a pergunta certa é "o que está em volta dele?". Segredos vazam por arquivos de configuração de agentes, resultados de benchmark mudam dois dígitos trocando apenas o harness, e os provedores de cloud disputam onde ficam as credenciais, não a qualidade do modelo.

## O "não perguntar novamente" do Claude Code vaza segredos em repositórios públicos

A Apiiro descobriu que, quando o desenvolvedor aprova um comando com "Sim, e não perguntar novamente", o Claude Code grava a regra de permissão em `.claude/settings.local.json` — incluindo qualquer senha ou token embutido no comando. Foram 1.122 segredos nesses arquivos e outros 1.160 no histórico do git, em configurações compartilhadas e em transcrições versionadas, em 63 organizações; a GitGuardian depois encontrou 31.088 segredos no mesmo arquivo no GitHub público, 5.343 ainda válidos ([infoq.com](https://www.infoq.com/news/2026/11/claude-code-leaking-secrets/)).

**Impacto para empresas:** configurações, arquivos de memória e transcrições de agentes viraram um cofre de credenciais que ninguém inventariou.

**Riscos e oportunidades:** o risco é uma exposição silenciosa e ampla, que sobrevive a um ajuste no `.gitignore` porque está no histórico. A oportunidade é higiene barata: incluir `.claude/settings.local.json` no `.gitignore` de cada repositório, rotacionar tudo o que já passou por ali e usar variáveis de ambiente para segredos.

**Minha leitura:** não é um problema de IA; é o problema mais antigo do livro — segredo em linha de comando — amplificado por uma ferramenta que lembra de tudo. Eu faria ainda esta semana uma varredura pontual de todos os repositórios atrás de arquivos de agentes e adicionaria uma checagem no pre-commit.

## QCon SF: o harness é o novo sistema operacional

Na keynote de abertura da QCon San Francisco, Manju Rajashekhar, CEO da Mad Labs, defendeu que o harness — contexto, ferramentas, estado, permissões e ciclos de feedback — determina o que um agente consegue fazer, e com que segurança, mais do que o próprio modelo ([infoq.com](https://www.infoq.com/news/2026/11/harness-new-operating-system/)). A evidência: o mesmo modelo variou de 65,5% a 74,2% em um benchmark conforme o harness, e a LangChain levou um modelo de 52,8% para 66,5% no Terminal-Bench 2.0 apenas movendo verificações para o harness.

**Impacto para empresas:** quando um agente entrega abaixo do esperado, trocar de fornecedor é o reflexo caro. Ajustar o harness costuma ser mais barato e mais eficaz.

**Riscos e oportunidades:** o risco é tratar prompts de aprovação como controle — "um porteiro cansado vira carimbo". A oportunidade é projetar as fronteiras: credenciais com escopo, isolamento e feedback explícito que separe "testes falharam" de "não foi possível executar".

**Minha leitura:** a conta de erro composto da palestra vale ser levada a qualquer diretoria: 20 etapas com 95% de acerto cada resultam em 36% de sucesso de ponta a ponta. Confiabilidade se resolve com engenharia, não com um modelo maior.

## Google tira as credenciais do sandbox de agentes

O Google anunciou o Agent Compute Engine, serviço gerenciado que executa agentes em microVMs isoladas, com checkpoint e restore, e mantém chaves de API e tokens OAuth fora do sandbox; um Agent Gateway externo autentica as requisições e injeta os segredos ([infoq.com](https://www.infoq.com/news/2026/11/google-agent-compute-engine/)). O serviço ainda não está disponível, não tem preço publicado e mira um preview "nos próximos meses"; o Agent Substrate, open source, roda em qualquer Kubernetes.

**Impacto para empresas:** "nenhuma credencial dentro do sandbox" está virando arquitetura de referência.

**Riscos e oportunidades:** o risco é comprar um anúncio — tempo de boot, preço e densidade ainda são desconhecidos. A oportunidade é adotar o padrão agora, em qualquer plataforma: o harness guarda a identidade, o sandbox apenas executa.

**Minha leitura:** leia esta notícia junto com a do Claude Code. Uma mostra o que acontece quando o segredo mora onde o agente trabalha; a outra é o desenho que evita isso. Eu colocaria "onde ficam as credenciais do agente?" no checklist de toda revisão de arquitetura, independentemente do fornecedor.

## AWS Lambda passa a rodar inferência em GPU

O Lambda Managed Instances agora executa Event Functions em GPUs EC2 da família G, com até 48 invocações simultâneas compartilhando uma única cópia do modelo por GPU e imagens base vLLM/SGLang que dispensam código de handler ([infoq.com](https://www.infoq.com/news/2026/11/aws-lambda-gpu-managed-instances/)). O preço é o On-Demand do EC2 mais uma taxa de 9,75%; os primeiros testes relatam oito minutos para publicar, ausência de streaming de resposta e cota padrão de vCPU de GPU igual a zero.

**Impacto para empresas:** inferência orientada a eventos — processamento de documentos, classificação, workers de fila — deixa de exigir a operação de um cluster de GPU.

**Riscos e oportunidades:** a instância é cobrada enquanto o mínimo de ambientes for maior que zero, o scaling leva dezenas de segundos e o suporte no Terraform chegou atrasado. A oportunidade é um caminho mais simples para cargas assíncronas e batch.

**Minha leitura:** "serverless" aqui significa menos operação, não pagamento por uso. Eu modelaria o custo sempre ligado antes de migrar e manteria chat com streaming em instâncias dedicadas. Para inferência disparada por fila, é um ótimo padrão.

## PostgreSQL 19: repack online e controle de planos

O PostgreSQL 19 traz `REPACK ... CONCURRENTLY`, que recupera espaço sem bloquear leituras ou escritas, e as extensões `pg_plan_advice` e `pg_stash_advice`, que influenciam planos de consulta sem alterar código ([infoq.com](https://www.infoq.com/news/2026/11/postgresql-19-released/)). Também adiciona `WAIT FOR LSN` para leitura consistente em réplicas, replicação lógica de sequences e JIT desativado por padrão.

**Impacto para empresas:** duas dores operacionais clássicas — bloat que exige downtime e regressão de plano que exige deploy — ganham ferramentas nativas.

**Riscos e oportunidades:** as mudanças em JIT e MD5 podem surpreender upgrades. A oportunidade é menor custo de armazenamento e menos janelas de manutenção.

**Minha leitura:** concordo com a comunidade: em sistemas críticos, espere a 19.1. Mas comece a testar o `REPACK CONCURRENTLY` em homologação agora; para muitos times, ele elimina o principal motivo para agendar janelas de manutenção.

## Uber reduz em até 90% a memória do cache de traduções

A Uber redesenhou seu cache de traduções em Go como um modelo híbrido: chaves e valores mais acessados em memória, o restante em disco, distribuídos em 256 shards ([infoq.com](https://www.infoq.com/news/2026/11/uber-go-translation-cache/)). Um dataset caiu de cerca de 800 MB para 80–120 MB, o hit rate ficou acima de 99,9% e o p99 de miss em disco abaixo de 100 microssegundos.

**Impacto para empresas:** cachear "tudo em memória" muitas vezes significa pagar por dado que ninguém lê. O profiling mostrou garbage collection consumindo mais de 20% da CPU em alguns serviços.

**Riscos e oportunidades:** caches híbridos adicionam complexidade em refresh e aquecimento; a Uber pré-carrega as chaves acessadas nos últimos 15 minutos para evitar cache frio. A oportunidade é redimensionar instâncias quando a memória deixa de ser o gargalo.

**Minha leitura:** esse é o tipo de FinOps em que mais confio — medir, entender o padrão de acesso, mudar o desenho. Sem fornecedor novo, só engenharia.

## A tendência a observar

O modelo está virando insumo; o harness é o produto. Onde ficam as credenciais, o que o agente pode tocar e como o feedback circula vão definir tanto a postura de segurança quanto a unit economics da IA em 2027. Times que tratam o harness como arquitetura — revisado, versionado e medido — vão gastar menos e vazar menos do que os que ainda estão escolhendo o próximo modelo.
