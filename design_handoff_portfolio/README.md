# Handoff: Neobrutalist Personal Portfolio (single page)

## Overview
A single-page personal portfolio with four sections — HERO, SKILLS, PROJECTS, CONTACT — in a neobrutalist style: thick black borders, hard offset shadows (no blur), bold uppercase type, playful accents on a light lavender page. One responsive page serves both desktop and mobile.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior, **not production code to copy directly**. The task is to **recreate these designs in the target codebase** (Next.js + TypeScript + Tailwind + Payload, per the owner's setup) using its established patterns. `Portfolio.dc.html` is the source of truth; `Mobile Preview.dc.html` + `ios-frame.jsx` only render the same page inside a phone frame for review.

## Fidelity
**High-fidelity.** Colors, spacing, type scale, copy structure and interactions are final. Recreate pixel-perfectly; all content is placeholder and will be swapped (bio, projects, skills come from Payload collections).

## Design Tokens (exact)
```css
--main:   #B6ACE4;  /* accent / primary (soft purple) */
--bg:     #f0eefc;  /* page background (light lavender) */
--white:  #ffffff;  /* surfaces / cards */
--black:  #000000;  /* ink, borders, text */
--mint:   #A7F3D0;  /* badge/tag accent */
--lemon:  #FEF08A;  /* badge/tag accent */
--hot-pink:#FBA1D3; /* badge/tag accent */
--radius: 5px;      /* everywhere */
--shadow-brutal: 4px 4px 0 0 #000;  /* base, no blur */
--shadow-brutal-lg: 6px 6px 0 0 #000; /* hover */
```
Borders: `2px solid #000` on cards/buttons/inputs; `4px solid #000` on hero/feature blocks (hero name block, contact form card).

**Tailwind v4 integration note (from the owner):** `badge.tsx` already references `bg-mint`, `bg-lemon`, `bg-hot-pink`, but `globals.css` only defines main/bg/white/black — add the 3 colors to `@theme`:
```css
@theme {
  --color-mint: #A7F3D0;
  --color-lemon: #FEF08A;
  --color-hot-pink: #FBA1D3;
}
```

## Typography
- Font: **Geist** (Google Fonts, weights 400–900), fallback `system-ui, sans-serif`. Monospace details: `ui-monospace, Menlo, monospace`.
- Headings: uppercase, weight 900 (`font-black`), tight line-height (0.92–0.95), slight negative letter-spacing.
- Hero H1: `clamp(52px, 9vw, 112px)`. Section H2: `clamp(28px, 4.5vw, 40px)`. Body: 14–16px, weight 500–600.

## Signature Interaction (apply consistently)
Buttons, cards, nav items, social links:
- **Hover:** `translate(-2px,-2px)` + shadow grows to `6px 6px 0 0 #000`
- **Active/press:** `translate(0,0)` + shadow collapses to `0 0 0 0 #000`
- **Transition:** `transform 200ms ease, box-shadow 200ms ease`
- **Focus ring:** `outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000` (2px black ring with 2px white offset)
- **Reduced motion:** `@media (prefers-reduced-motion: reduce) { * { transition: none !important } }` and use `behavior:'auto'` for scrolling.

## Screens / Sections

### 1. Sticky Header
- **Layout:** fixed, `top:12px`, full-width with 16px side padding; inner bar max-width 1100px, white bg, 2px border, radius 5, shadow-brutal, `padding:10px 14px`, flex space-between. A 74px static spacer sits at the top of the page flow (do NOT use `position:sticky` inside a height-constrained mount — the prototype uses `position:fixed` + spacer).
- **Left:** brand = 20px purple square (2px border, radius 5) + "Alex Morgan" uppercase 900, 17px. Clicking scrolls to hero.
- **Right (≥880px):** 4 nav buttons HERO · SKILLS · PROJECTS · CONTACT — uppercase 800, 12.5px, `padding:8px 14px`, 2px border, radius 5, shadow-brutal. **Active section button bg = accent (#B6ACE4), others white** (scroll-spy: section whose top ≤ 170px from viewport top; bottom of page forces CONTACT).
- **Mobile (<880px):** hamburger button 44×44px (accent bg, three 18×2.5px black bars). Opens a dropdown panel under the bar (white, 2px border, shadow-brutal, stacked full-width nav buttons, left-aligned). Menu closes on selection.
- Nav clicks smooth-scroll (`window.scrollTo`, target offsetTop − 88px).

### 2. HERO
- Badge row: two rotated stickers ("OPEN TO WORK" lemon, rotate −2°; "PORTFOLIO · 2026" mint, rotate 1.5°) — 2px border, shadow-brutal, uppercase 800 12px.
- Name block: accent bg, **4px border**, radius 5, shadow-brutal, `padding: clamp(24px,4vw,44px)`; H1 "ALEX MORGAN" on two lines.
- Tagline: uppercase 900, `clamp(17px,2.4vw,24px)`. Bio: ≤620px wide, 16px/1.6, weight 500.
- CTAs: "View projects →" (black bg, white text) and "Get in touch" (white bg) — uppercase 900 15px, `padding:14px 22px`, signature hover/press. Both smooth-scroll.

### 3. SKILLS
- Section heading pattern (used by all sections): numbered chip ("01", accent bg, 2px border, shadow-brutal, 900) + uppercase H2.
- Grid: `repeat(auto-fit, minmax(230px, 1fr))`, gap 20px.
- **Skill card = title + description only** (maps 1:1 to the Payload skills collection — no extra fields): white bg, 2px border, radius 5, shadow-brutal, `padding:18px`; H3 uppercase 900 17px; body 14px/1.55 weight 500. Hover lift.

### 4. PROJECTS — tape flip-cards
- Hint badge next to heading: hot-pink mono 12px "click a card to flip it ↓".
- Grid: `repeat(auto-fit, minmax(300px, 1fr))`, gap 38px 28px.
- Each card: fixed height 272px, `perspective:1200px`, resting rotation −1.6° / 1.4° / −1° / 1.8° (straightens to 0° on hover, 200ms). A **tape strip** sits on top: 90×24px, centered, colored (lemon/pink/mint/purple per card), `opacity:.85`, dashed 2px left/right borders `rgba(0,0,0,.25)`, rotate −2°, above the card (z-index).
- **Flip:** click / Enter / Space toggles `rotateY(180deg)` on an inner wrapper (`transform-style:preserve-3d`, 450ms ease; both faces `backface-visibility:hidden`, absolute inset 0). Card is `role="button"`, `tabIndex=0`, `aria-label`, focus style `outline:3px dashed #000; outline-offset:6px`.
  - **Front (white):** striped placeholder thumbnail (repeating 45° stripes #f0eefc/#fff, 2px border, mono label), title row = H3 uppercase 900 18px + "FLIP ↻" chip in the project's color.
  - **Back (project color bg):** mono project slug, title, description (13px/1.55, 600), white tag chips (2px border, uppercase 800 11px), and "VISIT →" link (black bg, white text) — the link **stops propagation** so it never triggers the flip.
- Per-project colors: PixelPress #B6ACE4 / Stack-o-Matic #A7F3D0 / CopyCat #FEF08A / Border Patrol #FBA1D3.
- Footer note under grid, mono 11px: `// click (or press Enter) to flip a card — the Visit link stays a link`.

### 5. CONTACT
- Two-column grid `repeat(auto-fit, minmax(290px,1fr))`, gap 24px.
- **Form card:** white, **4px border**, shadow-brutal, `padding:22px`. Fields: Name (text), Email (email), Message (textarea rows=5) — labels uppercase 900 12px; inputs **16px font** (prevents iOS zoom), weight 600, `padding:12px`, 2px border, radius 5, full width; focus = the 2px black + 2px white offset ring. Submit: accent bg, uppercase 900 15px.
- **Submit behavior:** preventDefault only (no backend); reset form; show toast.
- **Toast:** fixed bottom-right (bottom/right 20px, max-width 380px), mint bg, 2px border, shadow-brutal, `role="status"`: "MESSAGE SENT!" + "Well, pretend-sent. I'll pretend-reply soon." + ✕ dismiss (28×28). Auto-hides after 6s.
- **"Elsewhere" card:** white, 2px border, shadow-brutal; explainer copy + 4 stacked link-buttons (Email me → `mailto:hello@example.com`, GitHub, LinkedIn, Bluesky) each with a different accent bg and the signature hover.

### 6. Footer
2px black top border; small uppercase 700 12.5px row: "© 2026 Alex Morgan" / "Built with thick borders & zero blur".

## Interactions & Behavior summary
- Scroll-spy drives active nav state (throttle with requestAnimationFrame).
- Smooth scroll with 88px header offset; `auto` under reduced motion.
- Flip state per project id (`Record<string, boolean>`).
- Mobile menu boolean; closes on navigation.
- Toast boolean + 6s timeout.
- Accent color is themeable via CSS var `--accent` (default #B6ACE4) — the prototype exposes it as a tweak; optional in production.

## State Management
`activeSection: string`, `menuOpen: boolean`, `flipped: Record<string,boolean>`, `submitted: boolean`, viewport width (for the <880px breakpoint). Suggested hooks: `useScrollSpy(sectionIds, offset)`, `useFlip()`, plain controlled/uncontrolled form.

## Responsive rules
- Single breakpoint: **880px** (header nav ⇄ hamburger). Everything else is fluid (`clamp()` type, `auto-fit` grids).
- Works down to 375px. Touch targets ≥ 44px (hamburger 44×44, buttons ≥ 44 tall with padding).
- Flip cards work by tap on touch devices (no hover required for any information).

## Accessibility
- All interactive elements keyboard reachable with visible focus rings.
- Flip cards: `role="button"`, `tabIndex=0`, Enter/Space handler, `aria-label`.
- Hamburger: `aria-label`, `aria-expanded`. Toast: `role="status"`. Labels bound with `htmlFor`.
- `prefers-reduced-motion` disables all transitions and smooth scroll.

## Assets
- `favicon.svg` — "sticker stack" mark: lavender rounded square (black stroke) with mint/lemon/pink offset squares. Link as `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`. Export PNG fallbacks (32/180) if needed.
- No images: thumbnails are striped CSS placeholders with monospace labels — replace with real project screenshots (keep the 2px black border, radius 5).
- Screenshots of the reference design are in `screenshots/`.

## Files
- `Portfolio.dc.html` — the full single-page design (desktop + mobile in one responsive file). Markup is inside `<x-dc>`; logic in the embedded script class.
- `Mobile Preview.dc.html` + `ios-frame.jsx` — review-only phone-frame wrapper around the same page.
- `favicon.svg` — final favicon.
- `screenshots/` — `desktop-full.png` (full page), `desktop-project-flipped.png` (a project card flipped), `mobile-layout.png` (mobile layout: hamburger header + stacked sections; note it was captured at a wide canvas — open `Mobile Preview.dc.html` for the true 390px rendering).
