---
title: 'Tech Radar — A IA dita o ritmo, o julgamento define o padrão'
description: 'Nesta edição: 2 mil pessoas tentam quebrar um agente de e-mail e falham, a indústria cria um time compartilhado para bugs de open source achados na velocidade da IA, um dev descobre que código de IA não tem bom gosto, a IBM passa de 1nm e a Apple aposta o silício do Mac em IA.'
date: '2026-06-26'
tags: ['Tech Radar', 'AI engineering', 'segurança', 'arquitetura de software', 'liderança de tecnologia']
---

O fio que conecta a semana é velocidade. A IA segue comprimindo o tempo de tudo — invadir um sistema, achar uma vulnerabilidade, gerar código que funciona, até encolher um transistor. A lição em cada uma destas histórias é que velocidade sozinha não decide nada. Os times que saem na frente respondem à aceleração com julgamento, coordenação e guardrails. Aqui está o que eu colocaria na frente de um time de liderança de tecnologia esta semana, e por que importa além da manchete.

## 2 mil pessoas tentaram quebrar um agente de e-mail com IA — e falharam

Um desenvolvedor criou o [hackmyclaw.com](https://www.fernandoi.cl/posts/hackmyclaw/), expondo um assistente de e-mail com IA que tinha acesso a um arquivo `secrets.env`, e desafiou o Hacker News a extrair o segredo. Vieram mais de 6 mil e-mails de mais de 2 mil pessoas — falsa autoridade, falsos pedidos de "resposta a incidente", engenharia social em vários idiomas — e nenhum vazou o segredo. O guardrail era um prompt de sistema de quatro linhas; o modelo era o Claude Opus 4.6, que a Anthropic treinou especificamente para resistir a prompt injection.

**Impacto para empresas:** o dado mais útil sobre segurança de agentes em meses. Um modelo capaz, com uma instrução curta e clara, segurou a linha contra milhares de tentativas adversariais. Isso tranquiliza quem está avaliando colocar agentes em fluxos reais.

**Riscos e oportunidades:** ainda assim, o experimento custou mais de US$ 500 em tokens e teve a conta do Gmail suspensa por três dias. Um agente exposto é passivo de custo e de disponibilidade, não só de segurança. E o autor foi claro: um modelo mais fraco e mais barato provavelmente teria vazado — aqui capacidade e segurança andam juntas.

**Minha leitura:** isso reduz meu medo de prompt injection, mas não elimina. Eu ainda não daria a um agente o poder de enviar e-mail ou mover dinheiro sem supervisão. Escolha um modelo endurecido contra injection, mantenha as instruções curtas e explícitas, limite o gasto e parta do princípio de que a caixa de entrada é hostil.

## A indústria cria um time compartilhado para bugs de open source achados na velocidade da IA

A Linux Foundation lançou o [Akrites](https://akrites.org/letter/), um esforço coordenado para triar e corrigir vulnerabilidades no software open source crítico. O problema que ele aponta é certeiro: scanners de IA derrubaram o custo de achar um bug sério de semanas de trabalho especializado para minutos, e os mantenedores agora se afogam em relatórios duplicados gerados por IA — a mesma falha descrita de cinco formas por cinco pessoas na mesma semana. O Akrites opera um time de resposta a incidentes (SIRT) compartilhado e confidencial, para que o mantenedor enfrente um parceiro coordenado em vez de cem. Na mesma semana, IBM, Red Hat e Palo Alto ampliaram um esforço paralelo, o Project Lightwell, com o mesmo alvo.

**Impacto para empresas:** se você entrega software, você depende desse bem comum. A descoberta ultrapassou a defesa, e o esgotamento de mantenedores não remunerados virou risco de cadeia de suprimentos dentro do seu próprio roadmap.

**Riscos e oportunidades:** o risco é uma enxurrada de relatórios de IA de baixo sinal enterrar o exploit real, e achados vazarem antes do patch enquanto todos correm para divulgar. A oportunidade é a divulgação coordenada virar um padrão compartilhado, e não cem correrias privadas.

**Minha leitura:** é o formato certo de resposta — somar o sinal, proteger o mantenedor, divulgar uma vez. Para a maioria das empresas o passo prático é menor: conheça suas dependências críticas, financie ou apoie as que você usa e pare de tratar open source como infraestrutura gratuita que se mantém sozinha.

## Um dev descobre que código de IA não tem bom gosto

Em ["You can't unit test for taste"](https://dev.karltryggvason.com/you-cant-unit-test-for-taste/), um desenvolvedor documenta a construção de um pipeline de pontos de interesse para um app de corrida usando Claude, dados do GeoNames, Python, Parquet e DuckDB. Ele esperava que a IA fosse a feature; ela acabou em papel de apoio, ao lado de filtros de dados e sinais de relevância, enquanto ele brigava com alucinações e curava o resultado na mão. As decisões de julgamento — quais marcos importam, qual referência da Wikipédia é a certa — foram dele, não do modelo.

**Impacto para empresas:** um contraponto pé no chão ao discurso de que "a IA escreve tudo". Bate com o que vejo no dia a dia — a IA é um ótimo acelerador para o encanamento e um substituto ruim para o bom gosto de produto.

**Riscos e oportunidades:** as práticas que ele relata valem copiar: montar o plano com o modelo antes, rodar um contexto novo por marco e manter domínio suficiente do stack para guiar em vez de seguir. Contextos grandes degradam a qualidade — mantenha-os enxutos.

**Minha leitura:** o diferencial nunca foi velocidade de digitação; era saber o que é "bom". A IA torna esse julgamento mais valioso, não menos.

## A IBM passa de um nanômetro

A IBM apresentou o que chama de [primeira tecnologia de chip sub-1nm do mundo](https://newsroom.ibm.com/2026-06-25-ibm-debuts-worlds-first-sub-1-nanometer-chip-technology), uma arquitetura "nanostack" no nó de 0,7nm (7 angstroms) que empilha transistores na vertical e relata um ganho de 40% de escala em SRAM, mirando explicitamente a demanda de banda das cargas de IA. A IBM projeta uma década de escala adicional e produção em cerca de cinco anos.

**Impacto para empresas:** nada para agir neste trimestre, mas importa no longo prazo. A curva de custo por carga de IA depende de o silício continuar escalando — e isso diz que dá para mais uma década.

**Minha leitura:** um bom sinal para planejamento de infraestrutura e FinOps de vários anos — não um motivo para mudar nada hoje. Anote como "o piso de compute continua caindo".

## A Apple aposta o silício do Mac em IA

A Bloomberg [noticiou](https://www.bloomberg.com/news/articles/2026-06-25/apple-to-skip-high-end-m6-mac-chips-to-launch-m7-pro-m7-max-m7-ultra-instead) que a Apple vai pular a geração M6 de topo e ir direto para uma linha M7 Pro, Max e Ultra com foco em IA. Trate os detalhes como reportagem, não confirmação — mas a direção é o que importa.

**Impacto para empresas:** os roadmaps dos fornecedores agora se organizam abertamente em torno de IA no dispositivo. Se o seu produto ou seus desenvolvedores dependem de inferência local, ciclos de troca de hardware e premissas de capacidade estão mudando sob seus pés.

**Minha leitura:** planeje a troca de equipamentos e as features de IA local pensando para onde o silício vai, não onde ele está. O centro de gravidade migrou para a inferência.

A constante nas cinco histórias é que a IA comprime o tempo em todas as camadas — ataque, defesa, entrega e hardware. Os times que vencem não são os mais rápidos; são os que combinam a velocidade com julgamento sobre o que vale a pena fazer, coordenação para que a velocidade não vire caos, e guardrails para que um processo autônomo não vire, em silêncio, um problema de seis mil e-mails e três dias fora do ar. Essa é a tendência a observar: conforme as ferramentas ficam mais rápidas, as disciplinas humanas em volta delas viram a verdadeira vantagem competitiva.
