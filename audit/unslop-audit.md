# Unslop audit — Aana homepage and shell

Read-only inspection of the running app at `http://localhost:3000` (local dev build,
matches the published `https://aanaa.tech` markup) plus the existing screenshots in
`audit/quality-home-*.png`. No forms submitted, no writes.

## Signs of slop

1. **Decorative color blobs behind content.** `app/layout.tsx:46-50` puts three large
   blurred orbs (primary/purple/cyan) behind every page. They are not a world, they are
   filler.
2. **Gloss system everywhere.** `glass`, `glass-card`, `glass-floating`, `glass-subtle`
   with `backdrop-filter: blur + saturate(180%)`, inset specular highlights, `specular-rim`
   light catches, `glass-floating` double shadow. Every card, chip, navbar and the whole
   footer sit inside it. This is the glassmorphism trend, not a brand.
3. **Newsletter card carries its own glow.** `components/newsletter/newsletter-section.tsx:10-11`
   adds two more blurred primary/purple orbs inside an already-glass card.
4. **Gradient text helper exists.** `app/globals.css:103-108` `.gradient-text` — a
   foreground-to-muted gradient clip. Unused today but present as a landmine.
5. **Colored shadows on chrome.** Card `shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]`,
   header scrolled shadow with an alpha, `.hover-lift` dark shadow `rgba(0,0,0,0.65)`.
6. **Icons take their own accent colors.** `TrendingUp` is `text-primary`, the theme
   toggle sun is `text-amber-500`, moon is `text-primary`, the newsletter icon is
   `text-primary`. Icons should carry the color of their text role.
7. **`animate-pulse` on live-looking chrome.** Hero "Next-Gen Tech Editorial" status dot
   (`app/page.tsx:50`) and the header avatar loading state. Neither is a live signal.
8. **Hover lift on cards.** `.hover-lift` moves every card `translateY(-3px)` with a
   0.35s cubic, and scales the image inside on top of it. Bouncy and decorative.
9. **Uppercase tracked labels everywhere.** `NEXT-GEN TECH EDITORIAL`, `Featured Story`,
   `Trending`, `Latest Updates`, `All Stories & Reviews`, footer `Categories / Platform /
   Direct Dispatch`. Should be sentence case.
10. **A "Trending" badge in amber.** `text-amber-600 dark:text-amber-400` pill on every
    card in the grid — a colored tag, not a meaning.
11. **`animate-in fade-in zoom-in-95`** on the user dropdown menu.
12. **Pill everything.** Every button is `rounded-full`; the nav links are rounded-full
    chips; badges are full pills. Nothing is a plain rectangle.
13. **Accent used as text too often.** `text-primary` on `Latest Updates`, `View all`,
    every `Read Story` link, the newsletter icon, the moon icon. The accent belongs on
    the primary action and one number, not on a dozen small labels.
14. **No single bright element.** The page is all mid-tones: glass cards, muted text,
    tinted surfaces. Nothing carries the color.
15. **Generic editorial copy.** "Stay ahead of the curve", "Independent analysis, deep
    smartphone reviews, actionable gadget guides, and curated AI insights", "Future tech,
    distilled for everyone." These could belong to any tech blog.
16. **Card excerpts are clipped/generic** (already logged in `audit/live-site-review.md`):
    "Read Jackery ... and explore its linked sources." Slop in the data, not the CSS, but
    it lands on the same cards.
17. **Homepage content mix is off-brand** (also already logged): household etiquette,
    sports, politics, celebrity fitness alongside tech. The featured story is about
    houseguest etiquette. A tech editorial homepage that opens with a holiday-habits
    story is a content problem the design can't fix — flagged, not changed here.

## What is good

- Real brand color (Aana blue `#0071e3` / `#2997ff`) and a real wordmark logo. Kept.
- A single neutral ramp already exists in `globals.css` (Apple light/dark system colors).
- Type is one family (Inter) with optical tracking on headings — good bones.
- Layout is a sensible editorial hierarchy: hero, featured story, trending strip, grid,
    newsletter. Section order preserved.
- Accessibility base is present: skip link, focus-visible, reduced-motion and
    reduced-transparency media queries, min-width guards.
- No emoji in the interface. One lucide icon set, mostly one size.

## Verdict

Heavy slop across color, glass, motion and copy. Full process.