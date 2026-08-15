# BetterRX UI

Port of the BetterRX design system into this app. Tokens are the source of truth. Components consume those CSS variables.

## Tokens

- `tokens/colors.css` — coral brand, navy ink, eRX blues, semantic aliases
- `tokens/typography.css` — Poppins for marketing (`--font-body`), system stack for the product (`--font-ui`)
- `tokens/spacing.css` — 4px scale, radii, container
- `tokens/effects.css` — card shadows, focus ring, motion

Imported from `src/app/globals.css`. Poppins is loaded with `next/font` in `src/app/layout.tsx`.

## Components

Import from `@/ui`. App surfaces use `Card variant="app"` and `Button variant="app"`.

## Assets

`public/brand/logo-pill.png`, `logo-black.svg`, `logo-outline-white.png`, `heart.png`.
