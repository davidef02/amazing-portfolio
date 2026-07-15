# Claude Code

## Payload CMS

This project uses the Payload CMS skill at `.claude/skills/payload/`.
**Always invoke the `payload` skill FIRST** when a task touches Payload (payload.config.ts, collections, globals, fields, hooks, access control, Local API queries).
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## General guidelines (all agents)

- **KISS.** Simple code, simple style, easy to scale. No cleverness where a plain solution works.
- **Minimal dependencies.** Before adding a package, check whether the existing stack (Next.js, Payload, Tailwind v4, existing utils in `src/utilities/`) already covers the need. Adding a dep is the last resort.
- **Pixel-perfect UI checks:** use the Playwright CLI (screenshots against the design) to verify visual work.
- **Complex tasks:** split into small, resumable subtasks (task tracking / todo list) so progress survives if tokens run out mid-task. Each subtask should leave the repo in a working state.
- **When the user says "basta conversazione":** update this CLAUDE.md with the current session knowledge (task states, decisions, gotchas) before stopping.

## Release process

- Do release work on a **dedicated branch** (e.g. `release/v1`), not directly on `main`. Merge to `main` only when the pre-release checklist is green.

## Pre-release checklist

Done:
- [x] Template cleanup — removed AdminBar, LivePreviewListener, Logo, BeforeDashboard/BeforeLogin, preview routes, getMeUser, livePreview config, PREVIEW_SECRET; importMap regenerated; unused deps (`@payloadcms/admin-bar`, `@payloadcms/live-preview-react`) removed.
- [x] Access control — all collections/globals explicit: public read (`anyone`), authenticated writes; Projects read = `authenticatedOrPublished` (has drafts).
- [x] Frontend shows only published projects (`where: { _status: { equals: "published" } }` in `src/components/Projects/index.tsx`).

To do (suggested order):
1. **Production build** — `pnpm build` (so far only `tsc --noEmit` was run); catch and fix SSG/runtime errors.
2. **IT localization** — add locales + metadata; decide IT-only vs bilingual.
3. **SEO** — verify SiteConfig.seo is populated and sitemap (next-sitemap postbuild) is correct.
4. **Email domain** — verify the domain on Resend (SPF/DKIM) and set `noreply@<domain>` as `defaultFromAddress` in payload.config.ts (currently `onboarding@resend.dev` → lands in spam).
5. **Prod env vars** — PAYLOAD_SECRET, DATABASE_URL, RESEND_API_KEY, NEXT_PUBLIC_SERVER_URL, CRON_SECRET.
6. **next.config remotePatterns** — allow the production image host for next/image.
7. **A11y** — input focus ring (design wants white ring + black offset; currently default Tailwind ring), keyboard testing on card flip / nav.
8. **Final gate** — lint + tests (vitest/playwright) green + production build ok.

Notes:
- Favicon is handled by the owner.
- Target accent color: `#B6ACE4` (Lavender) via SiteConfig → Colors.
- Form-builder collections (`forms`, `form-submissions`) keep plugin-default access (public submission create, authenticated read) — intentional for the contact form.

## Post-release improvements

- **Color picker in admin** — replace the hex text inputs in SiteConfig → colors.selection with a color-picker custom field component.
- **Testing** — real coverage: vitest integration tests (access control, form submission), Playwright e2e (nav, card flip, contact form).
- **Contact form anti-spam** — protect form-builder submissions from email spam (rate limiting, honeypot field, and/or captcha).
