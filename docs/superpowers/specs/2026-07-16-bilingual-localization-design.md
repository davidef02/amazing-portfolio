# Bilingual IT/EN Localization — Design

**Date:** 2026-07-16
**Status:** Approved (design), pending implementation plan
**Pre-release checklist item:** #2 IT localization

## Goal

Add English + Italian to the single-page Payload portfolio. EN is the primary
landing (`/` redirects to `/en`); IT lives at `/it`. Content is authored per
locale in the Payload admin; UI chrome strings live in a tiny in-repo
dictionary. No new runtime dependency (no `next-intl`) — almost all display
text is already CMS-driven, so a small dictionary covers the few hardcoded
strings.

## Decisions

- **Locales:** `en` (default), `it`. `fallback: true` — a missing IT value
  falls back to EN, so a published document is always fully rendered in both
  locales.
- **Routing:** both locales prefixed (`/en`, `/it`); root `/` redirects to
  `/en`.
- **Contact form:** form-builder field labels are localized.
- **Drafts + status (`localizeStatus`):** NOT used. `localizeStatus` (per-locale
  publish status) is experimental in Payload and requires
  `experimental.localizeStatus`. With `fallback: true` the owner publishes a
  project once (global status) and fills the IT translation incrementally while
  it stays visible in both locales showing EN until translated. Per-locale
  publish gating is unnecessary and adds production risk. Projects `versions`
  config is unchanged; the frontend `_status: { equals: 'published' }` filter
  stays valid for both locales.
- **UI strings:** in-repo dictionary keyed by locale, no i18n library.

## 1. Payload config (`src/payload.config.ts`)

```ts
localization: {
  locales: [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' },
  ],
  defaultLocale: 'en',
  fallback: true,
},
```

Postgres note: enabling localization is a **schema migration** — localized
columns move into `_locales` tables. Existing rows migrate to `defaultLocale`
(`en`). Steps: apply migration (dev push or generated migration), verify no data
loss, regenerate `payload-types.ts`.

## 2. Localized fields (`localized: true`)

**Collections**
- Projects: `title`, `description`
- Experiences: `title`, `description`
- Skills: `title`, `description`
- Tags: `title`

**Globals**
- Hero: `heroDescription`, `badges[].title`, `link[].title`
- Header: `navItems[].title`
- Footer: `footerDescription`
- Social: `toast.successTitle`, `toast.successMessage`, `toast.errorTitle`,
  `toast.errorMessage`, `socialDescription`, `links[].title`
- SiteConfig: `seo.metaTitle`, `seo.metaDescription`

**NOT localized (shared across locales):** colors, URLs (`link`, `link.link`,
social `link`), dates, images/uploads, checkboxes, slugs, relationships,
`fullName`, `siteTitle`, `seo.metaLink` (canonical is computed per locale in the
frontend, see §6).

On array fields (badges / navItems / links) only the `title` subfield is
localized, so URLs and colors stay shared and the array structure is identical
across locales.

## 3. Frontend routing

- Move `src/app/(frontend)/*` → `src/app/(frontend)/[locale]/*`
  (`layout.tsx`, `page.tsx`, `not-found.tsx`, `globals.css`).
- `src/middleware.ts`: redirect `/` → `/en`; reject `[locale]` not in
  `{en, it}` (404 / notFound).
- `generateStaticParams` → `[{ locale: 'en' }, { locale: 'it' }]` (keeps SSG).
- `page.tsx` reads `locale` from params and passes it as a prop to each server
  component (Hero, Skills, Projects, Experience, Contact, Footer, Header,
  Social). Each passes `locale` to its `payload.find` / `payload.findGlobal`
  call.
- A `Locale` type (`'en' | 'it'`) and the locale list live in `src/i18n/`.

## 4. UI string dictionary

- `src/i18n/dictionaries.ts`: `{ en: {…}, it: {…} }`.
- Keys (current hardcoded strings): section titles (`Skills`, `Projects`,
  `Experiences`, `Contact`), the flip hint (`click a card to flip it ↓`),
  contact button (`Send message →` / `Sending…`), aria-labels (`Sections`,
  `Toggle menu`), toast fallbacks.
- Server components look up `dict[locale][key]`. Client components
  (`header-client.tsx`, `contact-client.tsx`) receive the resolved strings as
  props (they must not import the dictionary and re-derive locale).

## 5. Language switcher

- New component rendered in the Header: an `IT | EN` toggle linking to the same
  page in the other locale (`/it` ↔ `/en`), active state styled, brutalist look
  matching the nav buttons. Present in both the desktop nav and the mobile
  hamburger dropdown.

## 6. SEO / metadata (`[locale]/layout.tsx`)

- `generateMetadata({ params: { locale } })` fetches SiteConfig with `locale`
  and sets `title` / `description` / OG / Twitter per locale.
- `<html lang={locale}>`.
- `alternates.languages`: hreflang for `it` and `en` plus `x-default` → `en`;
  `canonical` per locale (`<serverURL>/<locale>`).
- `next-sitemap.config.cjs`: emit both `/en` and `/it` URLs with `alternateRefs`
  for hreflang. (Also resolves the earlier build note: sitemap must use the
  production `siteUrl`, not `localhost`.)

## 7. Form-builder localization

- `formBuilderPlugin` `formOverrides` to make the form field `label`, submit
  button label, and confirmation message localized.
- The Contact server component passes `locale` when fetching the form via the
  Social global's `contactForm` relationship (or a direct `forms` fetch), so
  labels render in the active locale.

## 8. Testing / verification

- `pnpm build` green (SSG for both locales, sitemap emits both).
- `payload-types.ts` regenerated, `tsc --noEmit` clean.
- Manual: `/en` and `/it` render the correct locale; `/` → `/en`; language
  switcher swaps locale on the same page; `<head>` has correct `lang`,
  canonical, and hreflang; admin shows the locale selector on localized fields;
  contact form labels localized; a published project shows EN content under
  `/it` before its IT translation exists (fallback).

## Out of scope

- Per-locale publish status (`localizeStatus`) — see Decisions.
- Localized slugs / per-locale project detail routes (no detail routes exist;
  the site is a single page).
- Any content translation authoring (owner fills IT in the admin post-merge).
