import React from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

// Digit entry shared by the PIN and email-code screens: a row of boxes showing what's been
// typed (as dots or digits) and a custom number pad underneath.

export function CodeBoxes({ length, value, masked }: { length: number; value: string; masked?: boolean }) {
  return (
    <View className="flex-row justify-center gap-4">
      {Array.from({ length }).map((_, i) => {
        const digit = value[i];
        const current = i === value.length;
        return (
          <View
            key={i}
            className={cn(
              "w-16 h-16 rounded-2xl bg-surface border items-center justify-center",
              current ? "border-accent border-2" : "border-border"
            )}
          >
            {digit ? (
              masked ? (
                <View className="w-3.5 h-3.5 rounded-full bg-text" />
              ) : (
                <Text className="text-2xl font-bold">{digit}</Text>
              )
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"] as const;

export function NumberPad({ onKey }: { onKey: (key: string) => void }) {
  return (
    <View className="flex-row flex-wrap -mx-1">
      {KEYS.map((key, i) => (
        <Pressable
          key={i}
          onPress={() => onKey(key)}
          disabled={!key}
          accessibilityLabel={key === "⌫" ? "Delete" : key}
          className="w-1/3 h-16 items-center justify-center rounded-2xl active:bg-surface"
        >
          {key === "⌫" ? (
            <Ionicons name="backspace-outline" size={24} color={colors.text} />
          ) : (
            <Text className="text-2xl font-semibold">{key}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

// Applies a key press to a code of fixed length.
export function applyKey(code: string, key: string, length: number) {
  if (key === "⌫") return code.slice(0, -1);
  if (key && code.length < length) return code + key;
  return code;
}
