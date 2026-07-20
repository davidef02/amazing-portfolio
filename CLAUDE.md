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

Live at **https://davidefantauzzi.me** (apex, no www). Deployed from the `prod` branch.

**Production stack:**
- **Domain** — `davidefantauzzi.me` (bought on Cheapname). Served at the **apex** `davidefantauzzi.me`; `www` → 308 → apex (flipped on Vercel 2026-07-18 — apex is canonical everywhere: sitemap, canonical, hreflang, OG).
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
- [x] IT/EN localization — code + schema push + deploy DONE. Bilingual EN-primary (`/`→`/en`, `/it`), Payload `defaultLocale: 'en'`, `fallback: true`; `localized:true` on all content fields; `[locale]` route + `src/proxy.ts` (Next 16 renamed middleware→proxy); `generateStaticParams`+`dynamicParams=false`; `IT|EN` switcher in Header; per-locale `generateMetadata` + hreflang/x-default/canonical. Spec: `docs/superpowers/specs/2026-07-16-bilingual-localization-design.md`. ⚠️ IT *content* may still be incomplete/untranslated — see urgent post-release #4.
- [x] SEO — SiteConfig.seo populated; sitemap/robots now via **native Next routes** (`src/app/sitemap.ts` + `robots.ts`, see task #6) — `/en`+`/it` with hreflang alternates, robots blocks admin/api. (`next-sitemap` removed.)
- [x] Email — Resend **sandbox** `onboarding@resend.dev` (domain verification intentionally skipped; the form only notifies the owner). See Production stack → Email.
- [x] Prod env vars set on Vercel (PAYLOAD_SECRET, DATABASE_URL, RESEND_API_KEY, NEXT_PUBLIC_SERVER_URL, CRON_SECRET).
- [x] `next.config` remotePatterns — allows the R2 image host.
- [x] Go live / deploy — deployed on Vercel from `prod`.

Notes:
- Favicon is handled by the owner.
- Target accent color: `#B6ACE4` (Lavender) via SiteConfig → Colors.
- Form-builder collections (`forms`, `form-submissions`) keep plugin-default access (public submission create, authenticated read) — intentional for the contact form.
- Project screenshots: recommended **16:10, ~1600×1000, PNG** (card image area ≈316×196 CSS px at 3 cols, up to ~510px at 2 cols; `object-cover` center crop — keep the subject centered; next/image re-encodes to AVIF/WebP so source quality > file size, keep under ~1MB for R2).

## Architecture notes & gotchas (Next 16 + this deploy)

- **Middleware is `src/proxy.ts`** — Next 16 renamed `middleware.ts` → `proxy.ts`. Handles `/`→`/en` redirect + locale guard; its matcher excludes `admin`/`api`/`_next` and any dotted path, so `/sitemap.xml` + `/robots.txt` are not redirected.
- **Frontend is fully SSG** (`/en`, `/it`; `dynamicParams=false`) → CMS content is baked at build time. Edits appear only via **on-demand revalidation** (`src/hooks/revalidate.ts`, wired into every frontend collection + global). ⚠️ Any NEW frontend collection/global MUST add these hooks, or its edits won't show without a redeploy. This is also why "content edited in admin doesn't appear on prod" until revalidation/redeploy.
- **Sitemap/robots are native Next routes** (`src/app/sitemap.ts`, `src/app/robots.ts`) — NOT `next-sitemap` (removed). `public/sitemap.xml` + `public/robots.txt` are gitignored; never recommit them.
- **`NEXT_PUBLIC_SERVER_URL` on Vercel MUST be `https://davidefantauzzi.me`** (apex, no www — updated 2026-07-18) — it drives sitemap, canonical, hreflang and OG URLs (via `getServerSideURL()`). If unset it falls back to `VERCEL_PROJECT_PRODUCTION_URL` (`*.vercel.app`) or `http://localhost:3000`.
- **Locale switch** uses `next/link` (client nav, no full page reload); `<html data-scroll-behavior="smooth">` is set to silence the Next route-transition warning.
- **Contact form** (form-builder, content lives in Neon): field Names are `name` (required by the `beforeEmail` subject), `contactFormEmail`, `contactFormMessage`. Field **Labels** and the Email 01 **Message** (`{{*:table}}`) are CMS content — re-enter them after any DB migration (they get wiped).

## Urgent post-release tasks (do first)

1. ✅ **DONE — Cache / performance (Next.js + Payload + Vercel)** — RESEARCH CONCLUSION: wrapping `payload.find` in `unstable_cache` is NOT the right lever — the frontend `/en`/`/it` pages are fully **SSG** (`●` in the build output), so there is no per-request DB fetch to cache; they're already served static from Vercel's CDN. The real gap was **invalidation** (CMS edits didn't appear without a redeploy — this is what caused the "labels not showing in prod" symptom). Also rejected Next 16 Cache Components / `use cache` (`cacheComponents`) — overkill for a single-page site + known Payload-admin limitations. IMPLEMENTED on-demand revalidation: `src/hooks/revalidate.ts` exports `revalidateFrontend` + `revalidateFrontendAfterDelete` (collections) and `revalidateFrontendGlobal` (globals), each calling `revalidatePath('/en')` + `revalidatePath('/it')` (guarded by `req.context.disableRevalidate` for seeds/scripts). Wired into all frontend collections (Projects, Skills, Experiences, Tags, Media) + all globals (SiteConfig, Header, Footer, Hero, Social). Pages stay static (fast CDN) and regenerate on-demand only when content changes — no redeploy needed. `form-submissions` intentionally NOT hooked (submissions don't change page content). ⚠️ Needs a redeploy to activate.
2. ✅ **DONE — Mobile hamburger menu width** — added `relative` to the `<header>` bar in `src/components/Header/index.tsx` so the `absolute inset-x-0` dropdown anchors to the header (`max-w-[1100px]`) instead of the full-width `fixed` wrapper.
3. ✅ **DONE — Contact form labels** — root cause was empty field `label`s in the CMS falling back to the raw machine name. Fixed by: (a) labels entered in admin; (b) removed the code fallback in `contact-client.tsx` → `label = f.label ?? ""`; (c) contact inputs hardcoded `required`; (d) plugin's required `confirmationMessage` made optional + always-hidden (`condition: () => false`) via `formOverrides` in `payload.config.ts` — it was blocking form saves; the frontend uses toasts (text from the `Social` global) instead. NOTE: the `confirmationMessage` column is kept in Neon (hidden, not dropped) to avoid a destructive schema change.
4. ✅ **DONE — Italian content** (2026-07-18) — full IT translation proposed field-by-field in chat (sarcastic tone kept); owner is entering it in admin. Scope: SiteConfig SEO metaDescription, Header navItems + badges, Hero description, all Skills, Experiences, Social (socialDescription + toast group), form field Labels, Footer richText. Excluded (already localized in code): UI chrome in `src/i18n/dictionaries.ts`, privacy page in `src/app/(frontend)/[locale]/privacy/privacy-content.ts`. Gotchas: (a) if the form's **Email 01 Message** is localized, `{{*:table}}` must be set on the IT locale too, or IT submissions email `undefined` (same bug as task #5); (b) EN footer has typo "coffe" → fix to "coffee"; (c) no published Projects yet — translate title/description/tags when they're added.
5. ✅ **DONE — Prod contact email body was `undefined`** — FIXED: set the Email 01 **Message** to `{{*:table}}` in admin. Root cause: the form's email Message template was empty in the Neon DB (wiped during the DB migration / content re-entry). `CUSTOM_HTML_EMAIL()` in `src/const/email.ts` injects `${email.html}`, and `email.html` is the rendered Message → empty Message ⇒ `${undefined}` prints the literal "undefined". **FIX (content, no code):** admin → Forms → contact form → **Emails → Email 01 → Message** → insert `{{*:table}}` (form-builder wildcard: outputs all submitted data as an HTML table; `{{*}}` = all data untabled, `{{fieldName}}` = single field by its Name). Set per-locale if prompted. No code guard needed once set. Subject is overridden at send time by `beforeEmail` in `payload.config.ts` (built from `formData.name`). Sender intentionally stays on the Resend sandbox (see Production stack → Email).
6. ✅ **DONE — Sitemap served `localhost` in prod** — root cause: `public/sitemap.xml` + `public/robots.txt` were **committed to git** (stale, generated locally → `localhost`) and next-sitemap's `postbuild` wasn't regenerating them on the Vercel build (frozen `lastmod` proved the served file never changed) → updating `NEXT_PUBLIC_SERVER_URL` had no effect. FIXED via **native Next 16 metadata routes**: `src/app/sitemap.ts` (emits `/en`+`/it` with hreflang alternates + x-default) and `src/app/robots.ts` (allow `/`, block `/admin`,`/api`, points to sitemap). Removed the `next-sitemap` dep + `postbuild` script + `next-sitemap.config.cjs`; gitignored & untracked `public/sitemap.xml`+`public/robots.txt`. Base URL from `getServerSideURL()` (`NEXT_PUBLIC_SERVER_URL`, read at build). ⚠️ Needs a redeploy to take effect. NOTE: in Next 16 middleware is `src/proxy.ts` (matcher excludes dotted paths → sitemap/robots not redirected).
7. ✅ **DONE — Web analytics** — Vercel Analytics (2026-07-18): `@vercel/analytics` + `<Analytics />` in `src/app/(frontend)/[locale]/layout.tsx` (frontend only, non l'admin). Cookieless/GDPR-friendly, free su hobby. Web Analytics enabled on the Vercel dashboard by the owner (2026-07-18) — fully done.
8. **Google Search Console + speed up indexing** — IN PROGRESS (2026-07-18, waiting on Google). DONE: (a) **www→apex flip** — Google Images was showing `www.…`; flipped on Vercel (apex primary, `www` → 308 → apex), `NEXT_PUBLIC_SERVER_URL` → `https://davidefantauzzi.me`, redeployed; verified live: canonical/hreflang/og:url/sitemap/robots all apex; (b) GSC **Domain** property `davidefantauzzi.me` verified via Cloudflare DNS TXT (covers apex+www, so the flip needs no GSC change); (c) sitemap submitted; (d) **Request indexing** done for `/en` + `/it` (URL Inspection said "URL sconosciuto a Google" — normal for a new site, no blockers: 200, no noindex, robots ok). REMAINING: wait for crawl (homepage days–1wk, full site 1–4wk; check with `site:davidefantauzzi.me`); confirm Sitemap report shows "Success" with 4 URLs; Google Images will update to apex as it recrawls (the 308 transfers the canonical). Optional boosts: inbound links from LinkedIn/GitHub profiles.

## Post-release improvements

Backlog — deliberately dropped for v1 closure (2026-07-18), pick up only if the project reopens:

- **A11y** — input focus ring (design wants white ring + black offset; currently default Tailwind ring), keyboard testing on card flip / nav.
- **Color picker in admin** — replace the hex text inputs in SiteConfig → colors.selection with a color-picker custom field component.
- **Testing** — real coverage: vitest integration tests (access control, form submission), Playwright e2e (nav, card flip, contact form).
- ✅ **DONE — Contact form anti-spam (honeypot)** (2026-07-18) — hidden `website` text input in `contact-client.tsx` (off-screen, not `display:none`; `tabIndex=-1`, `autoComplete="off"`), always sent (empty for humans). Server: `formSubmissionOverrides.hooks.beforeValidate` in `payload.config.ts` — filled honeypot → `APIError` 400 (no save, no email — plugin's `sendEmail` is in `afterChange`); empty → row stripped so it never reaches DB or the `{{*:table}}` email. Rate limiting/captcha intentionally skipped (KISS). ⚠️ Honeypot is 100% code-side — do NOT add a `website` field to the form in the CMS: `contact-client.tsx` renders all CMS `form.fields` as visible inputs, so a CMS `website` field would collide with the hidden input → humans fill the visible one → 400.
