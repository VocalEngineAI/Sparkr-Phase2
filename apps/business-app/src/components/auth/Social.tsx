import React from "react";
import { Alert, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

// Social sign-in is frontend-only for now: the buttons exist so the flow reads right,
// and tapping one says so.
const PROVIDERS = [
  { label: "Facebook", icon: "logo-facebook", color: "#1877F2" },
  { label: "Google", icon: "logo-google", color: "#DB4437" },
  { label: "Apple", icon: "logo-apple", color: colors.navy },
] as const;

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
          <Ionicons name={p.icon} size={22} color={p.color} />
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
