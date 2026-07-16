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

## Workflow resumability (ALWAYS — multi-agent `Workflow` runs)

Multi-agent `Workflow` runs are long + token-heavy; a token/session limit mid-run must NOT lose completed work. Every time:

- **Launch expecting interruption.** Structure scripts so expensive early phases (search/fetch/scan) finish + cache before costly later phases (verify/synthesize). `pipeline()` already does this — keep phase boundaries clean.
- **Note the resume handle.** Every Workflow launch result prints `scriptPath` + `runId` — keep them.
- **Resume, don't restart.** On token-out/kill, re-run with `Workflow({ scriptPath: "<path>", resumeFromRunId: "<runId>", args: <same args> })`. Completed agents (unchanged prompt+opts) replay from cache instantly; only failed/remaining agents run live. Prior run must be stopped first (it usually already completed with errors).
- **Force a failed phase to re-run.** Errored agents may replay from cache AS errors → same failure. Embed a rev marker in that phase's prompt (e.g. `verify-rev:r2`) and bump it → those `(prompt,opts)` change → run live, while earlier cached phases still replay.
- **Idempotent phases + honest partial results.** Each phase safe to re-run; a token-out must read as infra-failure, never as a genuine "nothing found".

## Release process

- Do release work on a **dedicated branch** (e.g. `release/v1`), not directly on `main`. Merge to `main` only when the pre-release checklist is green.

## Pre-release checklist

Done:
- [x] Template cleanup — removed AdminBar, LivePreviewListener, Logo, BeforeDashboard/BeforeLogin, preview routes, getMeUser, livePreview config, PREVIEW_SECRET; importMap regenerated; unused deps (`@payloadcms/admin-bar`, `@payloadcms/live-preview-react`) removed.
- [x] Access control — all collections/globals explicit: public read (`anyone`), authenticated writes; Projects read = `authenticatedOrPublished` (has drafts).
- [x] Frontend shows only published projects (`where: { _status: { equals: "published" } }` in `src/components/Projects/index.tsx`).
- [x] **Production build** — `pnpm build` green (compiles, SSG 5/5, sitemap). Build note carried to SEO: next-sitemap emitted `http://localhost:3000` + `sitemaps: 0` — fix siteUrl + per-locale URLs in #3.

To do (suggested order):
1. **IT localization** — CODE DONE, awaiting DB schema push + content re-entry. **Bilingual IT/EN, EN-primary** (`/`→`/en`, `/it`). Payload `defaultLocale: 'en'`, `fallback: true`. Spec: `docs/superpowers/specs/2026-07-16-bilingual-localization-design.md`. `localizeStatus` NOT used (experimental; fallback covers it). No i18n lib (tiny dict `src/i18n/dictionaries.ts` for the few hardcoded UI strings). Done: localization config + `localized:true` on all content fields (collections + globals); form-builder labels auto-localized by plugin (no override needed); toast content stays 100% CMS (Social localized, no dict fallback); `src/app/(frontend)/[locale]/` route + `src/middleware.ts` (`/`→`/en`, locale guard); `generateStaticParams`+`dynamicParams=false`; locale threaded to all server components + payload queries; `IT|EN` switcher in Header (desktop + mobile); per-locale `generateMetadata` (title/desc/OG) + `<html lang>` + hreflang/x-default/canonical; `next-sitemap.config.cjs` rewritten (emits `/en`+`/it` w/ alternateRefs, robots blocks admin/api). `tsc --noEmit` green. **REMAINING (manual):** (a) run `pnpm dev` → Payload dev-pushes localization schema to Supabase (data loss = localized TEXT cols only; rows/colors/images/dates/slugs/relations survive); (b) re-enter/translate localized text in admin; (c) `pnpm build` to verify SSG both locales + sitemap. Full pre-push backup at `backups/data-*.json` (gitignored). NOTE: agent was denied `pnpm dev` (long-running server on prod Supabase) — user runs it.
2. **SEO** — verify SiteConfig.seo is populated and sitemap (next-sitemap postbuild) is correct; fix siteUrl (was localhost) + emit `/it`+`/en` with hreflang alternateRefs (done partly in localization #1).
3. **Email domain** — verify the domain on Resend (SPF/DKIM) and set `noreply@<domain>` as `defaultFromAddress` in payload.config.ts (currently `onboarding@resend.dev` → lands in spam).
4. **Prod env vars** — PAYLOAD_SECRET, DATABASE_URL, RESEND_API_KEY, NEXT_PUBLIC_SERVER_URL, CRON_SECRET.
5. **next.config remotePatterns** — allow the production image host for next/image.
6. **A11y** — input focus ring (design wants white ring + black offset; currently default Tailwind ring), keyboard testing on card flip / nav.
7. **Final gate** — lint + tests (vitest/playwright) green + production build ok.
8. **Go live / deploy** — create dedicated `release/*` branch off `main` (per Release process), deploy to prod host, run production env vars, smoke-test (`/en`, `/it`, contact form, admin). Currently still on localhost.

Notes:
- Favicon is handled by the owner.
- Target accent color: `#B6ACE4` (Lavender) via SiteConfig → Colors.
- Form-builder collections (`forms`, `form-submissions`) keep plugin-default access (public submission create, authenticated read) — intentional for the contact form.

## Post-release improvements

- **Color picker in admin** — replace the hex text inputs in SiteConfig → colors.selection with a color-picker custom field component.
- **Testing** — real coverage: vitest integration tests (access control, form submission), Playwright e2e (nav, card flip, contact form).
- **Contact form anti-spam** — protect form-builder submissions from email spam (rate limiting, honeypot field, and/or captcha).
