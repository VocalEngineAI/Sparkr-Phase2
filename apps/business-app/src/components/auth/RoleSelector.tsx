import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";
import type { AuthRole } from "../../navigation/AuthNavigator";

// One app, two account types. The mock auth signs in as whichever is picked here, so both
// the sign-up and the login screens carry it.
const ROLES: { value: AuthRole; label: string; hint: string }[] = [
  { value: "business", label: "Business", hint: "Restaurant, salon or spa" },
  { value: "influencer", label: "Influencer", hint: "Creator or reviewer" },
];

type Props = { value: AuthRole; onChange: (role: AuthRole) => void };

export default function RoleSelector({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-3">
      {ROLES.map((r) => {
        const selected = r.value === value;
        return (
          <Pressable
            key={r.value}
            onPress={() => onChange(r.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            className={cn(
              "flex-1 rounded-2xl px-4 py-3 border",
              selected ? "bg-primary border-primary" : "bg-surface border-border"
            )}
          >
            <View className="flex-row items-center justify-between mb-0.5">
              <Text className={cn("text-base font-bold", selected && "text-background")}>
                {r.label}
              </Text>
              {selected ? <View className="w-2.5 h-2.5 rounded-full bg-accent" /> : null}
            </View>
            <Text className={cn("text-xs text-textMuted", selected && "text-primaryLight")}>
              {r.hint}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
