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

## Release process (dev on `main`, deploy via `prod`)

- **Develop on `main`.** All work — fixes, features, content-model changes — happens on `main` and is verified there. `main` is the safe/staging branch (no auto-deploy).
- **Ship by moving to `prod`.** When confident, bring the changes onto `prod` and commit there — **Vercel auto-deploys the `prod` branch**, so any commit landing on `prod` triggers a production deploy.
- `main` and `prod` should stay in sync (they currently point to the same commit). Fast-forward `prod` from `main` when shipping; don't let them diverge.
- **Never commit straight to `prod`** unless you intend an immediate live deploy.

## Release status — LIVE (released 2026-07-16)

Live at **https://www.davidefantauzzi.me**. Deployed from the `prod` branch.

**Production stack:**
- **Domain** — `davidefantauzzi.me` (bought on Cheapname). Served at `www.davidefantauzzi.me`.
- **DNS** — Cloudflare.
- **Media storage** — Cloudflare R2 bucket (commit `feat: integrate Cloudflare R2 for media storage`). `next.config` `remotePatterns` allows the R2 host.
- **Database** — **Neon** (Postgres). ⚠️ Earlier notes said Supabase — the DB is now **Neon**; treat any leftover Supabase reference as stale.
- **Deploy** — **Vercel**, auto-deploys the `prod` branch (off `main`).
- **Email** — Resend **sandbox** (`onboarding@resend.dev`); domain verification intentionally skipped (not needed — the form only notifies the owner). The sandbox delivers **only to the Resend account email** (= `defaultToEmail`), which is exactly the desired behavior. ⚠️ prod email body bug — see urgent post-release #5.

**Pre-release checklist — DONE:**
- [x] Template cleanup — removed AdminBar, LivePreviewListener, Logo, BeforeDashboard/BeforeLogin, preview routes, getMeUser, livePreview config, PREVIEW_SECRET; importMap regenerated; unused deps removed.
- [x] Access control — all collections/globals explicit: public read (`anyone`), authenticated writes; Projects read = `authenticatedOrPublished` (has drafts).
- [x] Frontend shows only published projects (`where: { _status: { equals: "published" } }`).
- [x] Production build green (SSG both locales + sitemap).
- [x] IT/EN localization — code + schema push + deploy DONE. Bilingual EN-primary (`/`→`/en`, `/it`), Payload `defaultLocale: 'en'`, `fallback: true`; `localized:true` on all content fields; `[locale]` route + `src/middleware.ts`; `generateStaticParams`+`dynamicParams=false`; `IT|EN` switcher in Header; per-locale `generateMetadata` + hreflang/x-default/canonical. Spec: `docs/superpowers/specs/2026-07-16-bilingual-localization-design.md`. ⚠️ IT *content* may still be incomplete/untranslated — see urgent post-release #4.
- [x] SEO — SiteConfig.seo populated; `next-sitemap` siteUrl fixed to prod, emits `/en`+`/it` with hreflang alternateRefs, robots blocks admin/api.
- [x] Email — Resend **sandbox** `onboarding@resend.dev` (domain verification intentionally skipped; the form only notifies the owner). See Production stack → Email.
- [x] Prod env vars set on Vercel (PAYLOAD_SECRET, DATABASE_URL, RESEND_API_KEY, NEXT_PUBLIC_SERVER_URL, CRON_SECRET).
- [x] `next.config` remotePatterns — allows the R2 image host.
- [x] Go live / deploy — deployed on Vercel from `prod`.

Notes:
- Favicon is handled by the owner.
- Target accent color: `#B6ACE4` (Lavender) via SiteConfig → Colors.
- Form-builder collections (`forms`, `form-submissions`) keep plugin-default access (public submission create, authenticated read) — intentional for the contact form.

## Urgent post-release tasks (do first)

1. **Cache / performance (Next.js + Payload + Vercel)** — research current best practice for cache serving so the app stays reactive. Evaluate wrapping `payload.find` in Next.js `unstable_cache` (tagged) to cache results on the Vercel CDN, then add Payload `afterChange`/`afterDelete` hooks on collections **and** globals that call `revalidateTag`/`revalidatePath` to bust cache on edit/delete. Investigate whether a cleaner/more idiomatic approach exists (Next.js `cacheTag`/`revalidate`, ISR, Payload cache plugin). Use the `payload` skill + research skills.
2. ✅ **DONE — Mobile hamburger menu width** — added `relative` to the `<header>` bar in `src/components/Header/index.tsx` so the `absolute inset-x-0` dropdown anchors to the header (`max-w-[1100px]`) instead of the full-width `fixed` wrapper.
3. ✅ **DONE — Contact form labels** — root cause was empty field `label`s in the CMS falling back to the raw machine name. Fixed by: (a) labels entered in admin; (b) removed the code fallback in `contact-client.tsx` → `label = f.label ?? ""`; (c) contact inputs hardcoded `required`; (d) plugin's required `confirmationMessage` made optional + always-hidden (`condition: () => false`) via `formOverrides` in `payload.config.ts` — it was blocking form saves; the frontend uses toasts (text from the `Social` global) instead. NOTE: the `confirmationMessage` column is kept in Neon (hidden, not dropped) to avoid a destructive schema change.
4. **Italian content** — localization mechanism is live, but IT translations may be incomplete/untranslated. Complete + verify all IT content in admin across collections + globals.
5. **Prod contact email body = `undefined`** — ROOT CAUSE FOUND (confirmed via admin screenshot): the form's email **Message** template is empty in the Neon DB (wiped during the DB migration / content re-entry). `CUSTOM_HTML_EMAIL()` in `src/const/email.ts` injects `${email.html}`, and `email.html` is the rendered Message → empty Message ⇒ `${undefined}` prints the literal "undefined". **FIX (content, no code):** admin → Forms → contact form → **Emails → Email 01 → Message** → insert `{{*:table}}` (form-builder wildcard: outputs all submitted data as an HTML table; `{{*}}` = all data untabled, `{{fieldName}}` = single field by its Name). Set per-locale if prompted. No code guard needed once set. Subject is overridden at send time by `beforeEmail` in `payload.config.ts` (built from `formData.name`). Sender intentionally stays on the Resend sandbox (see Production stack → Email).

## Post-release improvements

- **A11y** — input focus ring (design wants white ring + black offset; currently default Tailwind ring), keyboard testing on card flip / nav.
- **Color picker in admin** — replace the hex text inputs in SiteConfig → colors.selection with a color-picker custom field component.
- **Testing** — real coverage: vitest integration tests (access control, form submission), Playwright e2e (nav, card flip, contact form).
- **Contact form anti-spam** — protect form-builder submissions from email spam (rate limiting, honeypot field, and/or captcha).
