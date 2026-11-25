import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

type Props = { checked: boolean; onChange: (next: boolean) => void; label: string };

export default function Checkbox({ checked, onChange, label }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={8}
      className="flex-row items-center self-start"
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View
        className={cn(
          "w-5 h-5 rounded-md border-2 items-center justify-center mr-3",
          checked ? "bg-accent border-accent" : "border-primary/40"
        )}
      >
        {checked ? <Ionicons name="checkmark" size={14} color={colors.navy} /> : null}
      </View>
      <Text className="text-sm font-medium">{label}</Text>
    </Pressable>
  );
}
