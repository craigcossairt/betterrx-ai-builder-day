---
name: betterrx-design
description: Use this skill to generate well-branded interfaces and assets for BetterRX, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
---

# BetterRX design

Read `src/ui/README.md` and the tokens under `src/ui/tokens/` before inventing colors, type, or controls.

Production UI imports from `src/ui` (`Button`, `Card`, `Badge`, `StatChip`, and the rest). Tokens are CSS variables. The eRX product look is white cards on `--surface-100`, blue `--blue-500` actions, coral accents, system UI font. Marketing look is Poppins, coral gradient pills, and navy ink.

Brand assets live in `public/brand/` (pill logo, ink SVG, white outline, heart mark).

Do not add a second token set. Do not restyle with Tailwind color utilities that ignore the tokens. No emoji. App buttons are 6px radius blue, not coral pills.

Voice: warm, plainspoken. Headlines in sentence case with a period. Eyebrow labels in all caps.
