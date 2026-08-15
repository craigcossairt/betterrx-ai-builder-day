# BetterRX UI

Port of the BetterRX design system into this app. Tokens are the source of truth. Components consume those CSS variables.

## Tokens

- `tokens/colors.css` — coral brand, navy ink, eRX blues, semantic aliases
- `tokens/typography.css` — Poppins for marketing (`--font-body`), system stack for the product (`--font-ui`)
- `tokens/spacing.css` — 4px scale, radii, container
- `tokens/effects.css` — card shadows, focus ring, motion

Imported from `src/app/globals.css`. Poppins is loaded with `next/font` in `src/app/layout.tsx`.

## Components

Live product screens import the pieces they need (`Button`, `Input`, `Toast`, census/chrome/order/patient modules). App actions use `Button variant="app"` (blue, 6px).

## Assets

`public/brand/logo-black.svg`, `icon-192.png`, `icon-512.png`, `pod-sample.svg`.
