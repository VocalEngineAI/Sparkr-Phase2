// Shared design tokens for the two React Native apps (business-app, customer-app).
// Plain JS (not .ts) so Tailwind's Node-based config loader can `require()` it directly
// without a TS loader. Imported into each app's tailwind.config.js `theme.extend` so both
// apps render the same brand colors. admin-web (Next.js) keeps its own Tailwind config.

// Sparkr brand palette (trial scheme).
//   darkBlue — filled buttons, active tabs, headline text
//   lavender — secondary/lighter surfaces, muted tints of darkBlue
//   coral    — warm accent for CTAs/highlights; too light for body text
const brand = {
  darkBlue: "#091EDB",
  lavender: "#91A3E5",
  coral: "#FF7A7A",
};

const colors = {
  ...brand,
  // Semantic tokens used by screens (className="bg-primary", "text-textMuted", …).
  primary: brand.darkBlue,
  primaryLight: brand.lavender,
  accent: brand.coral,
  success: "#2C5F2D",
  warning: "#B85042",
  background: "#FFFFFF",
  surface: "#F4F6FD", // faint lavender tint for cards on the white background
  text: brand.darkBlue,
  textMuted: "#5B6B9E", // muted blend of darkBlue/lavender
  border: "#D7DEF5",
};

module.exports = { colors };
