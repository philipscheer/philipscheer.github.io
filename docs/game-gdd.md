# Career Quest — "Play My Career" · Game Design Document (GDD)

> Jogo side-scroller 2D pixel-art integrado ao site philipscheer.github.io.
> Objetivo: recrutadores e líderes de tecnologia conhecerem a trajetória do Philip **jogando** — andando para frente e para trás na linha do tempo, desbloqueando habilidades (Dev, Gestão, Negócio), conquistando insígnias e superando "chefes" que representam desafios reais de cada época.
>
> Status: **Proposta para validação** · Versão 0.1 · 2026-07-29
> Referência de inspiração: [Noniv/snowflow_demo](https://github.com/Noniv/snowflow_demo) (portfólio técnico que viraliza) — adaptado para formato leve e acessível.

---

## 1. Visão e objetivo de negócio

| Item | Definição |
|---|---|
| Nome de trabalho | **Career Quest** (alternativas: *Play My Career*, *Press Start to Hire*) |
| Público-alvo | Recrutadores, headhunters, CTOs/VPs de engenharia, pares técnicos |
| Objetivo primário | Diferenciar o portfólio, aumentar tempo de permanência no site e gerar contato (CTA de contratação) |
| Objetivo secundário | Demonstrar na prática domínio técnico (o jogo em si é um case de engenharia) e storytelling de produto |
| Mensagem central | "20+ anos transformando ideias em produtos de baixo custo e alta performance — jogue a jornada" |
| KPI | % de visitantes que iniciam o jogo · % que chegam à fase final · cliques no CTA "Contact / Download Resume" pós-jogo |

**Posicionamento no site:** rota dedicada `/[locale]/play`, com destaque na Home ("🎮 Meet me by playing" / "Me conheça jogando") e link no header.

---

## 2. Requisitos

### 2.1 Funcionais

- RF01 — Personagem 2D controlável: andar para **frente avança** na carreira e para **trás retorna** no tempo (a timeline é o próprio mapa).
- RF02 — 12 fases sequenciais (ver §4), cada uma com cenário, ano, empresa/contexto, skills coletáveis e 1 chefe.
- RF03 — Sistema de skills em 3 árvores: **Development**, **Management**, **Business** — desbloqueadas ao concluir entregas/fases (ver §5).
- RF04 — Insígnias (achievements) por marcos reais: Graduação, Certificações, Idiomas, Viagens internacionais, Primeira liderança etc. (ver §6).
- RF05 — Chefes de fase = desafios reais do período, vencidos usando as skills já coletadas (ver §7).
- RF06 — HUD com XP, skills ativas, insígnias e progresso na timeline (ex.: "2015 — Synchro").
- RF07 — **Modo Recrutador (fast-travel):** menu/mapa que permite pular para qualquer fase ou abrir o resumo textual do período (respeito ao tempo do recrutador; nada de forçar 20 min de jogo).
- RF08 — Tela final com estatísticas da jornada + CTA: *Contact Me · Download Resume · LinkedIn*.
- RF09 — Pause = "mini-CV" do período atual (cargo, empresa, resultados, stack) — o jogo é um currículo navegável.
- RF10 — i18n EN + PT com troca sem reload, seguindo o locale do site (`/en/play`, `/pt/play`).
- RF11 — Save automático de progresso em memória de sessão (sem dependência de backend).
- RF12 — Eventos de analytics: `game_start`, `level_complete{level}`, `boss_defeated{boss}`, `badge_earned{badge}`, `cta_click{type}`, `fast_travel_used`.

### 2.2 Não funcionais

- RNF01 — Roda em **qualquer navegador moderno, inclusive mobile** (canvas/WebGL1 com fallback), sem GPU dedicada — lição do snowflow: não excluir o recrutador que abre no celular.
- RNF02 — Peso total do jogo (engine + assets) **< 3 MB**, lazy-loaded: não pode degradar Core Web Vitals do site.
- RNF03 — Compatível com **static export do Next.js / GitHub Pages** (sem backend).
- RNF04 — Controles: teclado (← → / A D, espaço, E) e **touch** (botões virtuais no mobile).
- RNF05 — Acessibilidade: jogo é conteúdo complementar — todo conteúdo do jogo tem equivalente textual (Modo Recrutador + páginas do site); `prefers-reduced-motion` respeitado; contraste AA nos textos do HUD.
- RNF06 — Tempo de jogo alvo: **6–10 min** na rota completa; **< 60 s** para um recrutador via fast-travel entender a proposta.
- RNF07 — Código TypeScript, lint/build no CI existente (GitHub Actions), sem dependência de rede em runtime.

### 2.3 Restrições e premissas

- Site atual: Next.js static export, EN/PT, GitHub Pages (build feito em /tmp por causa do OneDrive).
- Sem armazenamento de dados pessoais do jogador; analytics agregado apenas.
- Nomes de empresas reais exibidos como no CV/LinkedIn público (validar §12).

---

## 3. Conceito e narrativa

**Gênero:** side-scroller de plataforma leve (foco em exploração/narrativa, não em dificuldade).

**Metáfora central:** o mundo é uma **linha do tempo contínua (2004 → 2026 → "?")**. Andar para a direita é progredir na carreira; andar para a esquerda é revisitar o passado (todas as skills e insígnias já obtidas permanecem — como na vida real). O cenário evolui visualmente: sala de aula → lab de informática → escritórios → mundo global → nuvem/tempo real.

**Arco narrativo (3 atos):**

1. **Ato I — Fundações (2004–2012):** aprender a programar, primeiro código em produção, mundo fiscal brasileiro. Skills quase só de Development.
2. **Ato II — Expansão (2012–2019):** consultoria internacional, senioridade técnica, arquitetura global na 99/DiDi. Skills de Development avançado + primeiras de Business.
3. **Ato III — Liderança (2019–hoje):** a virada dev → líder. Times de 27→80+ pessoas, Dell remoto internacional, otimizações milionárias, e o chefe final: **1 milhão de usuários simultâneos**. Skills de Management e Business dominam; as de Dev viram "super-poderes" que o líder usa para desbloquear o time.

**Mensagem embutida:** as skills antigas nunca são descartadas — chefes tardios exigem combinações (ex.: o chefe final precisa de `Real-Time Systems` + `Team Leadership` + `Cost Optimization`). É o argumento "hands-on leader" em forma de mecânica.

---

## 4. Fases (mundos e níveis)

> Fonte: CV (docs no repo) + LinkedIn (2008–2017 fornecido). Itens `[PENDENTE]` em §12.

| # | Fase | Período | Cenário | Skills liberadas | Chefe |
|---|---|---|---|---|---|
| 0 | **Prólogo — Colégio Técnico** `[PENDENTE: nome/anos]` | ~2004–2007 | Sala de aula, lousa, PC bege | Lógica, primeiro "Hello World" (tutorial de controles) | **A Prova Final** (tutorial de combate: responder padrões de lógica) |
| 1 | **Datatex — Web Developer** | 2008–2009 | Agência web, monitores CRT | PHP/WordPress, HTML/CSS/JS, Python/Django | **O Site Quebrado em Produção** (primeiro bug fix ao vivo) |
| 2 | **BR part / Synchro Solução Fiscal — Systems Analyst** | 2009–2012 | Escritório corporativo, pilhas de DANFEs | Java EE, JBoss/WebSphere, Suporte N3, Documentação | **O Monstro do Compliance Fiscal** (NFe/CTe — ataca com "mudança de legislação") |
| — | 🎓 **Insígnia: Graduação — B.Sc. Ciência da Computação (FAENAC)** `[PENDENTE: ano de conclusão]` — cutscene de formatura entre as fases 2 e 3 | | | | |
| 3 | **IT Convergence — IT Consultant** | 2012–2015 | Consultoria internacional (Berrini), clientes em inglês | App servers, Troubleshooting, Inglês profissional 🌐 | **O Servidor Caído às 3h** (incident response contra o relógio) |
| 4 | **Synchro — Senior J2EE Developer** | 2015–2017 | Data center + telas Oracle | Oracle EBS/ODI/BPEL, PL/SQL, SAP B1, HANA, Senioridade | **A Integração das Duas Gigantes** (Oracle ⇄ SAP: alinhar fluxos de dados sem derrubar nenhum lado) |
| 5 | **99 (DiDi) — Principal Engineer, Payments** | 2017–2019 | Mapa-múndi: Brasil ✈ EUA ✈ China | Arquitetura Global, Payments/Fintech, Gestão de 18 projetos, Compliance | **A Hidra dos 18 Projetos** (18 cabeças; cada skill certa derruba uma — ensina priorização) |
| 6 | **Restoque — Technology & Innovation Manager** | 2019–2020 | Estúdio de produto/UX Labs | 👑 **Primeira Liderança (27 pessoas)**, Roadmap, Design Sprints, Flutter, CI/CD | **A Troca de Chapéu** (chefe interno: o jogador não pode mais vencer codando sozinho — precisa "recrutar" NPCs e delegar) |
| 7 | **Dell Technologies — Design System Manager** | 2020–2022 | Home office ↔ EUA, timezone duplo | Design Systems, Governança, Trabalho remoto internacional, UX | **O Caos da Inconsistência** (mesmo componente com 12 aparências; vencer padronizando) |
| 8 | **Dexco — Senior Technology Manager** | 2022–2024 | Indústria + dashboards | Estratégia digital, Otimização de performance, IA/NLP (chatbot) | **A Query de 30 Segundos** (barra de vida = tempo de query; ataques a reduzem até −50%) |
| 9 | **Scheer Tecnologia / EMS** | 2024 | Fábrica farmacêutica + ERP | Fundar empresa 🏢, IA Generativa, Migração zero-downtime | **O Legado Intocável** (migrar dados sem o sistema piscar — mecânica de troca em movimento) |
| 10 | **Scheer / Crefisa (Avanade)** | 2024–2025 | Torre financeira | Templates de arquitetura, EDA/Kafka, ARB, Governança DevOps | **O Conselho de Arquitetura** (defender decisões com trade-offs — mini-quiz de arquitetura) |
| 11 | **Scheer / R10 — Fase Final** | 2025–hoje | Estádio + sala de guerra em tempo real | Real-Time (WebSockets/gRPC), Go, Escala, FinOps | **⚡ UM MILHÃO SIMULTÂNEOS** (chefe final: onda de 100K→1M usuários; vencer combinando skills dos 3 ramos; recompensa: "−57% de custo, P99 < 300ms") |
| 12 | **Epílogo — "Next Level: your company?"** | 2026–? | Porta aberta com "?" | — | CTA: *Contact Me · Download Resume · LinkedIn* + estatísticas da run |

Cada fase contém ainda 2–4 **coletáveis de contexto** (documentos flutuantes que abrem 1 frase do CV real, ex.: "18 projetos simultâneos entregues no prazo").

---

## 5. Sistema de skills (3 árvores)

Skills são coletadas nas fases e ficam permanentes. Ícones pixel-art + tooltip com a evidência real do CV.

**🔧 Development** — Hello World → Web (PHP/JS) → Java EE → PL/SQL & Oracle → Integrações ERP → Arquitetura de Sistemas → Microservices & EDA → Real-Time (WebSockets/gRPC) → Go/Python poliglota → IA/ML aplicada.

**👥 Management** — Documentação & Processos → Suporte N3 (empatia com usuário) → Gestão de Projetos (18 simultâneos) → **Liderança de Times (27)** → Roadmap & Priorização → Gestão Remota Internacional → Governança & ARB → **Escala de Squads (80+)**.

**💼 Business** — Compliance Fiscal BR → Cliente Internacional (inglês) → Payments/Fintech → Visão de Produto & UX → Estratégia Digital → **Otimização de Custos/FinOps (−50% query · −57% cloud)** → Fundação de Empresa → Portfólio R$26M+.

Regra de design: chefes do Ato III **exigem combinações inter-árvores** — materializa o discurso "conecto tecnologia a resultado de negócio".

---

## 6. Insígnias (achievements)

| Insígnia | Gatilho |
|---|---|
| 🎓 Graduação | Cutscene FAENAC (fase 2→3) |
| 🌐 English Unlocked | Fase 3 (clientes internacionais) |
| ✈️ Globetrotter | Fase 5 (Brasil · EUA · China) `[PENDENTE: confirmar viagens a destacar]` |
| 👑 First Leadership | Fase 6 (27 pessoas) |
| 🏠 Remote Master | Fase 7 (Dell 100% remoto) |
| 🤖 AI Engineer | Fase 8/9 (chatbots NLP, IA generativa) |
| 🏢 Founder | Fase 9 (Scheer Tecnologia) |
| 📜 18+ Certifications | Coletável distribuído (Google GenAI, Product School, Databricks, Scrum, Six Sigma, IDEO) |
| ⚡ 1M Concurrent | Vencer o chefe final |
| 🏆 Completionist | 100% skills + coletáveis |

---

## 7. Design dos chefes

Padrão único e simples (para caber no orçamento e no mobile): cada chefe é um **mini-desafio de 30–60 s** com 1 mecânica própria, sempre vencível — o jogo nunca frustra o recrutador. Derrota impossível: falhar apenas reinicia a tentativa com uma dica ("Na vida real também não desistimos do deploy"). Ao vencer, aparece o **card de resultado real** (métrica do CV) — o chefe é o gancho, o número é a mensagem.

---

## 8. Telas e UI

1. **Title screen** — logo pixel-art "PHILIP SCHEER — CAREER QUEST", *Press Start*, seletor EN/PT, botão "I'm a recruiter, skip to the map".
2. **HUD in-game** — ano/empresa (topo), XP, últimas skills, botão pause/mapa.
3. **Mapa da timeline (fast-travel)** — linha 2004→2026 com as 12 fases; clique leva direto; cada nó mostra resumo textual (o "currículo vivo" dentro do jogo).
4. **Pause / mini-CV** — cargo, empresa, período, 3 bullets de resultado, stack.
5. **Card de skill/insígnia** — arte + evidência real.
6. **Tela final** — estatísticas da run + 3 CTAs + share (copiar link).

Direção de arte: pixel-art 16-bit limpa (paleta reduzida, ~8 cores por cenário), coerente com o design executivo do site — sóbrio, sem infantilizar. Dark/light seguindo o tema do site.

---

## 9. Stack técnica

| Camada | Escolha | Justificativa |
|---|---|---|
| Engine | **Phaser 3** (ou Kaplay como alternativa mais leve) | Maduro, TypeScript, canvas/WebGL com fallback, touch nativo, tree-shakeable |
| Integração | Componente client-only no Next.js (`dynamic import`, rota `/[locale]/play`) | Compatível com static export/GitHub Pages; zero impacto no resto do site |
| Linguagem | TypeScript estrito | Padrão do repo |
| Dados do jogo | `src/content/game/{en,pt}.ts` — fases, skills, insígnias e textos como **dados**, não código | i18n igual ao site; atualizar carreira = editar dados (currículo vivo) |
| Assets | Spritesheets pixel-art (PNG) + bitmap font; alvo < 2 MB | Performance/RNF02 |
| Analytics | Mesmos eventos do site (provider atual) | KPI §1 |
| CI | Build + lint no GitHub Actions existente; build local em /tmp (OneDrive) | Processo já validado |

**Estrutura proposta:**

```
src/
  app/[locale]/play/page.tsx      # rota, metadata SEO, loading
  game/
    engine/                        # boot, cenas, input, save
    scenes/                        # Title, Level, Boss, Map, Final
    data/                          # levels.ts, skills.ts, badges.ts (refs a content)
  content/game/en.ts · pt.ts       # todos os textos
public/game/                       # spritesheets, audio (opcional, mudo por padrão)
docs/game-gdd.md                   # este documento
```

---

## 10. i18n

- Estrutura de strings espelhando `src/content/{en,pt}.ts` do site.
- Nomes próprios (empresas, tecnologias) não traduzem; títulos de chefes e narrativa sim.
- Ex.: `boss.final.name`: EN "ONE MILLION CONCURRENT" · PT "UM MILHÃO SIMULTÂNEOS".
- URLs: `/en/play` e `/pt/play` com hreflang, OG image própria (pixel-art) — alto potencial de compartilhamento no LinkedIn.

---

## 11. Roadmap de implementação

| Milestone | Escopo | Critério de aceite |
|---|---|---|
| **M0 — Validação** | Aprovar este GDD + resolver pendências §12 | GDD aprovado por você |
| **M1 — Protótipo vertical (1–2 semanas de esforço)** | Engine integrada ao site, Fase 6 (Restoque, a mais representativa da virada) jogável: andar, coletar 2 skills, vencer 1 chefe, pause/mini-CV, EN/PT | Jogável no desktop e mobile em `/[locale]/play` atrás de flag |
| **M2 — Conteúdo completo** | 12 fases, 3 árvores, insígnias, mapa fast-travel, tela final + CTAs | Rota completa 6–10 min; fast-travel < 60 s |
| **M3 — Polish** | Arte final, animações, som opcional, analytics, OG image, acessibilidade, peso < 3 MB | Lighthouse do site inalterado; eventos disparando |
| **M4 — Lançamento** | Destaque na Home, post LinkedIn (EN/PT) contando o making-of | Publicado + post |

Fluxo de trabalho: branch por milestone, commits pequenos, PR com descrição e checklist, revisão sua antes de merge (padrão já usado no repo).

---

## 12. Pendências / decisões — resolvidas em 2026-07-29

1. ✅ **Colégio técnico**: Clovis Bevilacqua — Técnico em Informática, 2005–2007.
2. ✅ **FAENAC**: Bacharelado em Ciência da Computação, 2008–2011 (insígnia Graduação após a fase BR part/Synchro).
3. ✅ **Gap 2004–2008**: coberto pelo Prólogo (colégio técnico) — sem fase adicional.
4. ✅ **Viagens**: Nova York, Califórnia (Palo Alto/Vale do Silício), Beijing; nacionais: SP, Rio, BH, Curitiba, Campinas, Cuiabá, Maringá — na insígnia Globetrotter (fase 99/DiDi).
5. ✅ Nomes reais de empresas exibidos (públicos no LinkedIn). Fase Dexco inclui **Vivadecora** e gestão de **80+ pessoas**.
6. ✅ Nome final: **Career Quest**.
7. ✅ Engine: **canvas 2D próprio** (zero dependências, ~7 kB de página, 100% procedural — sem Phaser). Motivo: peso mínimo, sem assets, compatível com static export.
8. ✅ Áudio: sem áudio no MVP.

---

*Documento gerado a partir de: CV EN/PT (repo), perfil LinkedIn 2008–2017 (fornecido em 2026-07-29) e análise do snowflow_demo como referência de portfólio-jogo.*
