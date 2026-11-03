# philipscheer.github.io

Personal professional website — living resume, case studies and recruiter hub.

**Stack:** Next.js (static export) · React · TypeScript · Tailwind CSS · GitHub Actions → GitHub Pages

## Structure

- `src/app/[locale]/` — pages (en, pt): Home, For Recruiters, About, Experience, Case Studies, Technical Leadership, Articles, Playbook, Resume, Contact, Speaking
- `src/content/` — i18n dictionaries (all site copy lives here)
- `src/content/articles/` — blog posts as markdown (`{slug}.{locale}.md`, gray-matter frontmatter)
- `src/content/testimonials.ts` — verbatim recommendations (section hidden while empty)
- `src/lib/integrations.ts` — optional third-party integrations (see below)
- `public/resume/` — resume PDFs (EN/PT)
- `public/playbook/` — downloadable engineering templates (design.md, ADR, RFC)
- `.github/workflows/deploy.yml` — CI/CD: build + deploy to GitHub Pages

## Writing an article

Create `src/content/articles/my-slug.en.md` and `my-slug.pt.md` with frontmatter (`title`, `description`, `date`, `tags`, optional `featured: true`). The build picks them up automatically: list, routes, sitemap (`src/app/sitemap.ts`) and RSS feeds (`/en/feed.xml`, `/pt/feed.xml`). Slugs starting with `tech-radar-` are grouped in the Tech Radar series.

## Development

```bash
npm install
npm run dev    # http://localhost:3000/en/
npm run build  # static export to ./out
```

## Deploy

Push to `master` triggers the GitHub Actions workflow, which builds the static export and publishes it to GitHub Pages.

> Pages settings must use **Source: GitHub Actions** (Settings → Pages).

## Integrations (optional)

All integrations are configured with **repository variables** (Settings → Secrets and variables → Actions → Variables) and injected at build time by `deploy.yml`. When a variable is empty, the feature is hidden and the site falls back to plain links.

| Variable | Service | Effect |
| --- | --- | --- |
| `UMAMI_WEBSITE_ID` | [Umami Cloud](https://cloud.umami.is) (free Hobby plan) | Cookie-less analytics + conversion events (`data-umami-event`) |
| `CALENDLY_URL` | Calendly | "Schedule a 20-min call" buttons (Home, For Recruiters, Contact) |
| `FORMSPREE_ID` | [Formspree](https://formspree.io) | Contact form on `/contact` (honeypot + Formspree spam filtering) |
| `BUTTONDOWN_USERNAME` | [Buttondown](https://buttondown.com) | Tech Radar newsletter signup on articles |

Locally: `NEXT_PUBLIC_UMAMI_WEBSITE_ID=… NEXT_PUBLIC_CALENDLY_URL=… npm run build`.

Tracked events: `schedule-click`, `resume-download`, `linkedin-click`, `email-click`, `consulting-click`, `contact-submit`, `newsletter-subscribe`, `rss-click`, `speaking-invite-click`.

## Roadmap

- [x] v1 — Recruiter core (EN/PT): Home, For Recruiters, Experience, Case Studies, Resume, Contact
- [x] v2a — About, Technical Leadership, Articles & Insights (markdown blog, 3 seed articles), Engineering Playbook
- [ ] v2b — ES/FR/DE locales, Software Architecture page
- [ ] v3 — AI Engineering page, more articles, profile photo
- [x] v4a — OG images, generated sitemap/RSS, analytics, hiring vs consulting CTAs, newsletter, contact form, testimonials, Speaking page
- [ ] v4b — Testimonials content, custom domain
