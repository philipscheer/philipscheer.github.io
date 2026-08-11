# LifeQuest — "Play Your Own Life" · Proposta de Produto

> Segundo projeto da família Career Quest: a pessoa importa seus dados (LinkedIn, Facebook, Instagram, contas de jogos) ou preenche manualmente, e a plataforma gera um jogo-timeline da própria vida — para jogar, rever e compartilhar.
>
> Status: **Proposta para validação** · v0.1 · 2026-07-29
> Posicionamento decidido: **demo aberta de portfólio** (marca Philip Scheer) · MVP: **exports sociais + wizard manual** · Narrativa: **IA gera, pessoa edita**

---

## 1. Visão

O Career Quest provou o formato com uma história (a sua). O LifeQuest generaliza: **qualquer pessoa joga a própria vida**. Educação vira o prólogo, empregos viram fases, viagens e conquistas viram insígnias, mudanças de cidade viram novos cenários — e a vida gamer vira capítulos próprios: "Era WoW (2010–2014): main Paladino, guilda Stormrage, 2.400 horas" com personagens e clãs contando a história junto.

Como demo aberta, o objetivo não é receita: é **autoridade técnica e alcance**. Cada timeline compartilhada carrega "made by Philip Scheer" — o projeto é simultaneamente case de engenharia (arquitetura, IA aplicada, privacidade by design) e máquina de distribuição da marca.

## 2. Princípio central: privacidade by design (LGPD)

Dados de vida inteira são sensíveis. A arquitetura decide isso no dia zero:

- **Processamento 100% no navegador.** Exports do LinkedIn/Meta são parseados client-side; nenhum dado bruto sobe para servidor.
- O que a pessoa gera fica **no dispositivo** (localStorage/arquivo baixável). Compartilhar é uma ação explícita.
- Geração por IA envia **somente a timeline normalizada** (não o export bruto), com consentimento claro do que está sendo enviado.
- Sem contas, sem banco de dados no MVP — não guardamos o que não temos.

Isso também elimina backend no MVP: mesma infra do site atual (estático + uma serverless function para a IA).

## 3. Fontes de dados

| Fase | Fonte | Método | O que vira jogo |
|---|---|---|---|
| MVP | **Wizard manual** | Formulário guiado | Qualquer evento: estudos, empregos, mudanças, viagens, filhos, jogos |
| MVP | **LinkedIn** | Upload do export oficial (ZIP/CSV) | Cargos → fases · empresas → cenários · formação → prólogo/insígnias |
| MVP | **Facebook / Instagram** | Upload do "Baixar suas informações" (JSON) | Cidades, eventos de vida, viagens (posts geolocalizados) → insígnias e cenários |
| Fase 2 | **Steam** | Web API (ID público, 1 clique) | Jogos, horas, conquistas, datas → "eras gamer" com chefes reais |
| Fase 2 | **Blizzard Battle.net** | OAuth oficial | Personagens WoW, guildas/clãs, conquistas → NPCs e capítulos |
| Fase 2 | Riot / Xbox / Discord | APIs parciais | Complementos |
| Sempre | **Adição manual de jogos** | Wizard | "Joguei Tibia 2003–2008, guild X" — sem depender de API |

APIs de LinkedIn/Meta são fechadas para leitura de perfil por terceiros; scraping viola ToS. O caminho do export oficial é legal, universal e ainda mais completo que as APIs.

## 4. Conceito de jogo

Mesmo runtime do Career Quest (side-scroller pixel-art, timeline andável, skills, insígnias, chefes, mapa fast-travel), com três generalizações:

1. **Temas de fase por tipo de evento**: escola, faculdade, escritório, viagem, mudança de cidade, era gamer (cenário do próprio jogo: masmorra para RPG, arena para shooter...).
2. **Chefes gerados dos dados**: "O Vestibular", "A Mudança para Berlim", "O Raid de 40 na Naxxramas", "A Troca de Carreira" — a IA propõe, a pessoa edita.
3. **Personagem customizável**: gerador de sprite (cabelo, óculos, barba, roupa por era) — aprendizado direto do v1.3 do Career Quest.

## 5. Schema de timeline (contrato central)

```ts
interface LifeTimeline {
  person: { name: string; avatar: SpriteConfig; locale: string };
  events: LifeEvent[];        // ordenados por data
}
interface LifeEvent {
  id: string;
  kind: 'education' | 'job' | 'move' | 'trip' | 'life' | 'gaming' | 'custom';
  start: string; end?: string;         // ISO
  title: string; place?: string;
  details: string[];                    // vira mini-CV da fase
  gaming?: {                            // quando kind = 'gaming'
    platform: 'steam' | 'battlenet' | 'manual' | string;
    game: string; hours?: number;
    characters?: { name: string; class?: string }[];
    clans?: { name: string; role?: string }[];
    achievements?: string[];
  };
  source: 'manual' | 'linkedin' | 'meta' | 'steam' | 'battlenet';
}
```

Importadores produzem `LifeEvent[]`; o gerador de IA consome a timeline e devolve `GameDefinition` (fases, skills, insígnias, chefes com perguntas) no mesmo formato de dados do Career Quest. **Todo o resto já existe.**

## 6. Arquitetura

```
[Wizard manual]──┐
[Parser LinkedIn]├─→ LifeTimeline ─→ [Gerador IA (serverless, rate-limited)] ─→ GameDefinition ─→ [Engine Career Quest]
[Parser Meta]────┘        │                    ↑ pessoa revisa/edita                     │
   (tudo client-side)     └── salvo local / arquivo .lifequest.json ────────────────────┘
Compartilhar: link com dados comprimidos na URL (#fragment, não vai ao servidor) ou arquivo
```

- **Reuso**: extrair o engine do Career Quest para pacote interno (`packages/quest-engine`) consumido pelos dois projetos.
- **IA**: uma função serverless (Vercel) com Claude, rate limit por IP e prompt fixo; entrada = timeline, saída = JSON validado (schema acima). Custo controlado por ser demo.
- **Stack**: Next.js + TypeScript + Tailwind (igual ao site), monorepo ou repo novo `lifequest`.

## 7. Requisitos do MVP

Funcionais: wizard manual completo (RF1) · upload/parse client-side de export LinkedIn (RF2) e Meta (RF3) · edição da timeline em lista (RF4) · geração IA com preview e edição de cada fase/chefe (RF5) · jogar no engine (RF6) · salvar/carregar arquivo local (RF7) · compartilhar por URL comprimida (RF8) · EN/PT (RF9) · adição manual de eventos gaming com personagens/clãs (RF10).

Não funcionais: nenhum dado bruto no servidor (RNF1) · mobile-first como o Career Quest (RNF2) · geração < 30s (RNF3) · funciona sem IA via templates básicos de fallback (RNF4).

## 8. Roadmap

| Milestone | Escopo | Sinal de sucesso |
|---|---|---|
| M0 | Validar proposta + extrair engine para pacote compartilhado | Career Quest rodando no pacote |
| M1 | Wizard manual → timeline → jogo com templates (sem IA) | Alguém joga a própria vida ponta a ponta |
| M2 | Parsers de export LinkedIn + Meta (client-side) | Import real em < 2 min |
| M3 | Gerador IA + editor de narrativa | Histórias com qualidade "uau" |
| M4 | Compartilhamento viral (URL + OG image gerada) | Timelines circulando no LinkedIn |
| M5 | Fase gamer: Steam Web API + Battle.net OAuth (personagens, guildas, horas) | "Era WoW" gerada em 1 clique |

## 9. Riscos

Exports mudam de formato sem aviso (mitigação: parsers tolerantes + fallback manual) · custo de IA se viralizar (rate limit + BYOK opcional) · URLs compridas para timelines grandes (compressão + limite de eventos no share) · expectativa de "conectar LinkedIn" com 1 clique que a API não permite (comunicar claramente o porquê — vira até conteúdo de artigo).

## 10. Decisões pendentes

1. Nome: **LifeQuest** / *Replay* / *MyLife.exe* / outro.
2. Repo novo (`lifequest`) vs monorepo com o site.
3. Idiomas do MVP: EN/PT (proposta) ou EN só.
4. A serverless de IA usa sua chave (custo seu, rate-limited) ou BYOK desde o início?

---

*Baseado nas decisões de 2026-07-29: demo aberta de portfólio · MVP com exports sociais + manual · IA gera com edição humana. Contas de jogos (Steam/Blizzard, personagens e clãs) confirmadas para a Fase 2 (M5), com entrada manual desde o M1.*
