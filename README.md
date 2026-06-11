# philipscheer.github.io

Personal professional website — living resume, case studies and recruiter hub.

**Stack:** Next.js (static export) · React · TypeScript · Tailwind CSS · GitHub Actions → GitHub Pages

## Structure

- `src/app/[locale]/` — pages (en, pt): Home, For Recruiters, About, Experience, Case Studies, Technical Leadership, Articles, Playbook, Resume, Contact
- `src/content/` — i18n dictionaries (all site copy lives here)
- `src/content/articles/` — blog posts as markdown (`{slug}.{locale}.md`, gray-matter frontmatter)
- `public/resume/` — resume PDFs (EN/PT)
- `public/playbook/` — downloadable engineering templates (design.md, ADR, RFC)
- `.github/workflows/deploy.yml` — CI/CD: build + deploy to GitHub Pages

## Writing an article

Create `src/content/articles/my-slug.en.md` and `my-slug.pt.md` with frontmatter (`title`, `description`, `date`, `tags`). The build picks them up automatically — list, routes, sitemap entry must be added to `public/sitemap.xml`.

## Development

```bash
npm install
npm run dev    # http://localhost:3000/en/
npm run build  # static export to ./out
```

## Deploy

Push to `master` triggers the GitHub Actions workflow, which builds the static export and publishes it to GitHub Pages.

> Pages settings must use **Source: GitHub Actions** (Settings → Pages).

## Roadmap

- [x] v1 — Recruiter core (EN/PT): Home, For Recruiters, Experience, Case Studies, Resume, Contact
- [x] v2a — About, Technical Leadership, Articles & Insights (markdown blog, 3 seed articles), Engineering Playbook
- [ ] v2b — ES/FR/DE locales, Software Architecture page
- [ ] v3 — AI Engineering page, more articles, profile photo + OG image
- [ ] v4 — Newsletter, analytics, contact form (Formspree), custom domain
