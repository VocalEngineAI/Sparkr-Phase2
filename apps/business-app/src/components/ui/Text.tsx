import React from "react";
import { Text as RNText, TextProps } from "react-native";

// react-native's Text falls back to the system font, so screens use this wrapper to get
// DM Sans by default. font-medium/semibold/bold swap to the matching DM Sans face via
// the plugin in tailwind.config.js.
export function Text({ className, ...props }: TextProps & { className?: string }) {
  return <RNText className={className ? `font-sans ${className}` : "font-sans"} {...props} />;
}
