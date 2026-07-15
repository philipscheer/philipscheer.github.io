# design.md — Branding & Theming (Scheer Tecnologia)

> Following the design.md practice — see `/playbook`. The document serves the delivery.
> Owner: Philip Scheer · Status: approved · Last updated: 2026-07-15

## 1. Context

The site (`philipscheer.github.io`) is a dark-only personal/professional presence.
Two problems:

1. **No light mode.** Recruiters, printers and daytime readers get a single dark
   surface with no choice, and it ignores the visitor's OS preference.
2. **Generic identity.** The accent is `#38bdf8` — Tailwind's default `sky-400`,
   used by thousands of sites. There is no ownable color for the "Scheer
   Tecnologia / serviços" brand.

## 2. Objective

Ship a light/dark theme that respects system preference and remembers the
visitor's manual choice, driven by a **semantic color-token system** built around
a distinctive, professional **Petrol Teal** brand palette. One set of class names
renders correctly in both themes; the brand reads as engineering/reliability, not
default-Tailwind.

## 3. Scope / Non-scope

**In scope:**
- Semantic design tokens (CSS custom properties) for both themes.
- Petrol Teal brand palette (teal primary + warm amber signal accent).
- Theme toggle in the header: system default, manual override, persisted, no flash.
- Full migration of hardcoded colors across pages/components to tokens.
- Theme-aware article prose and Mermaid diagrams.

**Explicitly out of scope:**
- Copy, layout, IA and navigation changes.
- New pages or content.
- Logo/wordmark redesign (wordmark keeps text, adopts brand color only).

## 4. Requirements

**Functional:**
- First paint honors `localStorage.theme`, else `prefers-color-scheme`.
- Toggle flips theme instantly, persists the choice, updates diagrams live.
- No flash of the wrong theme (FOUC) on load.

**Non-functional:**
- Accessibility: body/label text ≥ WCAG AA (4.5:1) in both themes; primary
  button and link colors verified against their backgrounds.
- No layout shift or added blocking network requests (inline pre-paint script only).
- Static-export safe (site builds with `next build`, no runtime server).

## 5. Proposed architecture

**Token layer.** CSS custom properties as RGB triplets on `:root` (light) and
`:root[data-theme="dark"]` (dark), consumed by Tailwind via
`rgb(var(--c-x) / <alpha-value>)` so opacity utilities (`/5`, `/50`) keep working.

**Theme resolution.** An inline script in `<head>` sets `data-theme` on `<html>`
before first paint. `darkMode: ['selector', '[data-theme="dark"]']` lets `dark:`
variants (used only for prose) follow the same attribute.

**Toggle.** A small client component reads/writes `data-theme` + `localStorage`
and dispatches a `themechange` event; `ArticleBody` re-themes Mermaid on it and on
a `MutationObserver` over the `<html>` attribute.

Semantic tokens: `bg`, `surface`, `line`, `fg`, `muted`, `faint`,
`primary` / `primary-hover` / `primary-fg`, `accent` (amber), `ok` (emerald).

## 6. Technical decisions

| Decision | Choice | Why |
|---|---|---|
| Theme signal | `data-theme` attribute on `<html>` | Works with static export; no server; drives both tokens and `dark:` variants |
| Token format | `rgb(triplet / <alpha-value>)` | Preserves Tailwind opacity utilities already used throughout |
| Default | System pref, manual overrides & persists | Least surprise; honors OS, respects explicit choice |
| Brand primary | **Petrol Teal** `#14b8a6`/`#0f766e` | Distinct from default sky; reads as infrastructure/reliability |
| Signal accent | **Amber** `#f59e0b`/`#b45309` | Warm counterpoint for emphasis; "ok/available" stays emerald |
| FOUC | Inline pre-paint script | Only reliable way to set theme before paint without a flash |

## 7. Alternatives considered

- **Tailwind `class` dark mode with `.dark` on `<html>`** — equivalent, but
  `data-theme` reads cleaner for a named brand system and avoids clashing with
  utility class scanning.
- **Two full CSS stylesheets swapped at runtime** — heavier, worse caching,
  duplicated maintenance vs. one token set.
- **Keep sky accent** — rejected: it is the brief's core problem.

## 8. Risks & trade-offs

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| FOUC on slow first paint | Med | Low | Inline script runs before body; `suppressHydrationWarning` on `<html>` |
| Contrast regressions in light mode | Med | Med | Fixed token values chosen for AA; primary is teal-700 on light for link/button text |
| Mermaid diagrams stuck in old theme | Med | Low | Re-render on `themechange` + attribute observer, source cached per node |
| Missed hardcoded color | Low | Low | Grep audit of `ink-/slate-/white/accent`; single mapping table |

## 9. Cross-cutting impact

- **Performance:** one tiny inline script, no extra requests.
- **Accessibility:** AA-checked palette; respects `prefers-color-scheme` and
  existing `prefers-reduced-motion`.
- **Operations:** none (static site).

## 10. Test strategy

`next build` must pass. Manual visual pass of every route in both themes;
toggle persistence across reload; diagram re-theme on toggle.

## 11. Rollout plan

Single feature branch → build → visual review → merge. No flags needed.

## 12. Rollback plan

Revert the branch. Tokens are additive; no data or migration involved.

## 13. Success metrics

Theme honored on first paint with zero flash; all routes AA-compliant in both
themes; brand primary is Petrol Teal everywhere the sky accent used to appear.

---

## Palette reference — Petrol Teal

| Token | Dark | Light | Role |
|---|---|---|---|
| `bg` | `#0a1418` | `#f5f8f8` | Page background |
| `surface` | `#101e24` | `#ffffff` | Cards / elevated |
| `line` | slate `#94a3b8` @ α | ink `#0f2a33` @ α | Borders / hairline fills |
| `fg` | `#e7eef0` | `#0e2229` | Headings / strong text |
| `muted` | `#9fb3ba` | `#3f545c` | Body text |
| `faint` | `#64808a` | `#6b8189` | Labels / captions |
| `primary` | `#14b8a6` | `#0f766e` | Brand — buttons, links |
| `primary-hover` | `#2dd4bf` | `#115e59` | Hover state |
| `primary-fg` | `#05131a` | `#ffffff` | Text on primary |
| `accent` | `#f59e0b` | `#b45309` | Warm signal / emphasis |
| `ok` | `#34d399` | `#059669` | "Available" indicator |
