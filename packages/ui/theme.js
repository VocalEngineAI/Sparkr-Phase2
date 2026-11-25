// Shared design tokens for the two React Native apps (business-app, customer-app).
// Plain JS (not .ts) so Tailwind's Node-based config loader can `require()` it directly
// without a TS loader. Imported into each app's tailwind.config.js `theme.extend` so both
// apps render the same brand colors. admin-web (Next.js) keeps its own Tailwind config.

// Sparkr brand palette.
//   linen — the base: every screen background
//   navy  — text, filled buttons, the logo S
//   amber — hints only (sparkle, small highlights); too light for text on linen
const brand = {
  linen: "#F1ECE3",
  navy: "#14213D",
  amber: "#FFB020",
};

const colors = {
  ...brand,
  // Semantic tokens used by screens (className="bg-primary", "text-textMuted", …).
  // `primary` is the colour of filled buttons/cards and active tabs, so it's navy —
  // linen is the base via `background`.
  primary: brand.navy,
  primaryLight: "#D9D2C5", // muted linen, for secondary text on navy cards
  accent: brand.amber,
  success: "#2C5F2D",
  warning: "#B85042",
  background: brand.linen,
  surface: "#FAF7F1", // cards on the linen background
  text: brand.navy,
  textMuted: "#5C6477",
  border: "#DDD5C7",
};

module.exports = { colors };
