// Shared design tokens for the two React Native apps (business-app, customer-app).
// Plain JS (not .ts) so Tailwind's Node-based config loader can `require()` it directly
// without a TS loader. Imported into each app's tailwind.config.js `theme.extend` so both
// apps render the same brand colors. admin-web (Next.js) keeps its own Tailwind config.

// Sparkr brand palette.
//   linen — every fill on white: inputs, cards, tiles, chips (via `surface`); also text
//           and buttons over dark video/navy
//   navy  — text, filled buttons, the logo S
//   amber — hints only (focus rings, checks, badges, small labels); too light for text
//           on white
const brand = {
  linen: "#F1ECE3",
  navy: "#14213D",
  amber: "#FFB020",
};

const colors = {
  ...brand,
  // Semantic tokens used by screens (className="bg-primary", "text-textMuted", …).
  // `primary` is the colour of filled buttons/cards and active tabs, so it's navy;
  // every screen sits on white via `background`.
  primary: brand.navy,
  primaryLight: "#D9D2C5", // muted linen, for secondary text on navy cards
  accent: brand.amber,
  success: "#2C5F2D",
  warning: "#B85042",
  background: "#FFFFFF",
  surface: brand.linen, // cards, inputs and tiles on white
  text: brand.navy,
  textMuted: "#5C6477",
  border: "#DDD5C7",
};

module.exports = { colors };
