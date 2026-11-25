// Shared design tokens for the two React Native apps (business-app, customer-app).
// Plain JS (not .ts) so Tailwind's Node-based config loader can `require()` it directly
// without a TS loader. Imported into each app's tailwind.config.js `theme.extend` so both
// apps render the same brand colors. admin-web (Next.js) keeps its own Tailwind config.

// Sparkr brand palette.
//   indigo   — very light indigo, the base: every screen background
//   electric — the main blue: filled buttons, active tabs, headline text
//   coral    — warm accent for CTAs/highlights; too light for body text
const brand = {
  indigo: "#EEF0FB",
  electric: "#091EDB",
  coral: "#FF7A7A",
};

const colors = {
  ...brand,
  // Semantic tokens used by screens (className="bg-primary", "text-textMuted", …).
  primary: brand.electric,
  primaryLight: "#A9B4F2", // lighter electric, for secondary text on blue cards
  accent: brand.coral,
  success: "#2C5F2D",
  warning: "#B85042",
  background: brand.indigo,
  surface: "#FFFFFF", // white cards lift off the indigo background
  text: "#101A4D", // deep navy-indigo for body text
  textMuted: "#5A6484",
  border: "#D3D8EE",
};

module.exports = { colors };
