const { colors } = require("@sparkr/ui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      // DM Sans ships as separate static files per weight, so these map Tailwind's
      // existing font-weight utilities (font-normal, font-bold, …) onto the right
      // file instead of a numeric font-weight, which React Native ignores for
      // custom fonts. Keep the key names matching Tailwind's default fontWeight
      // scale so every existing font-* className keeps working unchanged.
      fontFamily: {
        normal: ["DMSans_400Regular"],
        medium: ["DMSans_500Medium"],
        semibold: ["DMSans_600SemiBold"],
        bold: ["DMSans_700Bold"],
        extrabold: ["DMSans_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
