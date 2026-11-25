const plugin = require("tailwindcss/plugin");
const { colors } = require("@sparkr/ui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["DMSans_400Regular"],
      },
    },
  },
  // React Native can't synthesise weights for a loaded font — each weight is its own
  // family — so the weight utilities swap the family instead of setting fontWeight.
  corePlugins: { fontWeight: false },
  plugins: [
    plugin(({ addUtilities }) =>
      addUtilities({
        ".font-normal": { fontFamily: "DMSans_400Regular" },
        ".font-medium": { fontFamily: "DMSans_500Medium" },
        ".font-semibold": { fontFamily: "DMSans_600SemiBold" },
        ".font-bold": { fontFamily: "DMSans_700Bold" },
      })
    ),
  ],
};
