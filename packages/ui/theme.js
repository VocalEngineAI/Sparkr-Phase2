// Shared design tokens for the two React Native apps (business-app, customer-app).
// Plain JS (not .ts) so Tailwind's Node-based config loader can `require()` it directly
// without a TS loader. Imported into each app's tailwind.config.js `theme.extend` so both
// apps render the same brand colors. admin-web (Next.js) keeps its own Tailwind config.

const colors = {
  primary: "#1E2761",
  primaryLight: "#CADCFC",
  accent: "#F96167",
  success: "#2C5F2D",
  warning: "#B85042",
  background: "#FFFFFF",
  surface: "#F5F5F7",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
};

module.exports = { colors };
