import React from "react";
import { Alert, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

const ICON_SIZE = 22;

// Google's "G" is four-colour, which an icon font can't draw (glyphs are single-colour),
// so it's the official mark as SVG paths (48×48 viewBox).
function GoogleLogo({ size = ICON_SIZE }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

// Social sign-in is frontend-only for now: the buttons exist so the flow reads right,
// and tapping one says so. Facebook and Apple use their Ionicons brand glyphs in the
// official colours (Facebook blue, Apple black).
const PROVIDERS = [
  {
    label: "Facebook",
    icon: <Ionicons name="logo-facebook" size={ICON_SIZE + 2} color="#0866FF" />,
  },
  { label: "Google", icon: <GoogleLogo /> },
  { label: "Apple", icon: <Ionicons name="logo-apple" size={ICON_SIZE + 2} color="#000000" /> },
];

function notYet(label: string) {
  Alert.alert(`Continue with ${label}`, "Social sign-in isn't connected yet.");
}

// The row of three icon tiles under "or continue with".
export function SocialRow() {
  return (
    <View className="flex-row justify-center gap-4">
      {PROVIDERS.map((p) => (
        <Pressable
          key={p.label}
          onPress={() => notYet(p.label)}
          accessibilityLabel={`Continue with ${p.label}`}
          className="w-20 h-14 rounded-2xl bg-surface border border-border items-center justify-center active:opacity-70"
        >
          {p.icon}
        </Pressable>
      ))}
    </View>
  );
}

export function OrDivider({ label, className }: { label: string; className?: string }) {
  return (
    <View className={cn("flex-row items-center", className)}>
      <View className="flex-1 h-px bg-border" />
      <Text className="text-sm text-textMuted mx-4">{label}</Text>
      <View className="flex-1 h-px bg-border" />
    </View>
  );
}
