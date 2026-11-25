import React, { useState } from "react";
import { Pressable, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Text field with a leading icon (or a prefix such as a dial code) and an optional
// trailing control. `secure` turns it into a password field with a show/hide toggle.
type Props = TextInputProps & {
  icon?: IconName;
  prefix?: React.ReactNode;
  trailing?: React.ReactNode;
  secure?: boolean;
  className?: string;
};

export default function IconField({ icon, prefix, trailing, secure, className, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  const tint = focused ? colors.accent : colors.textMuted;

  return (
    <View className={cn("relative justify-center", className)}>
      <Input
        {...input}
        secureTextEntry={secure ? hidden : input.secureTextEntry}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur?.(e);
        }}
        className={cn(
          "h-14 rounded-2xl",
          icon && "pl-12",
          prefix && "pl-24",
          (trailing || secure) && "pr-12",
          focused && "border-accent bg-background"
        )}
      />

      {icon ? (
        <View className="absolute left-4" pointerEvents="none">
          <Ionicons name={icon} size={18} color={tint} />
        </View>
      ) : null}
      {prefix ? (
        <View className="absolute left-4 flex-row items-center" pointerEvents="none">
          {prefix}
        </View>
      ) : null}

      {secure ? (
        <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10} className="absolute right-4">
          <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={18} color={tint} />
        </Pressable>
      ) : trailing ? (
        <View className="absolute right-4">{trailing}</View>
      ) : null}
    </View>
  );
}
