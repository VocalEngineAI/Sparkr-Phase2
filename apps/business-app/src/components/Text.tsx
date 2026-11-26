import React from "react";
import { Text as RNText, type TextProps } from "react-native";
import { cn } from "../lib/utils";

// Drop-in replacement for RN's Text that defaults to DM Sans (font-normal) so screens
// get the brand font even without an explicit font-weight className. A font-* class
// passed in via `className` overrides this, since tailwind-merge dedupes the font-family
// group (see tailwind.config.js for why font-weight classes map to DM Sans files).
export default function Text({ className, ...props }: TextProps) {
  return <RNText className={cn("font-normal", className)} {...props} />;
}
