import React, { useEffect, useState } from "react";
import { Pressable, TextInputProps, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// White outlined text field with a leading icon (or a prefix such as a dial code), an
// optional trailing control and a floating label: `placeholder` sits inside the field
// while it's empty and lifts onto the top outline as soon as the field is focused or has
// a value. `secure` turns it into a password field with a show/hide toggle.
type Props = TextInputProps & {
  icon?: IconName;
  prefix?: React.ReactNode;
  trailing?: React.ReactNode;
  secure?: boolean;
  className?: string;
};

const FIELD_HEIGHT = 56; // h-14
const LABEL_INSET = 14; // where the floated label sits from the left edge

export default function IconField({
  icon,
  prefix,
  trailing,
  secure,
  className,
  placeholder,
  value,
  ...input
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secure);
  const floated = focused || !!value;
  const tint = focused ? colors.accent : colors.textMuted;

  const float = useSharedValue(floated ? 1 : 0);
  useEffect(() => {
    float.value = withTiming(floated ? 1 : 0, { duration: 180, easing: Easing.out(Easing.quad) });
  }, [floated]);

  // Resting position of the label: after the icon / prefix, vertically centred.
  const restingLeft = prefix ? 96 : icon ? 48 : 16;
  const labelStyle = useAnimatedStyle(() => ({
    top: interpolate(float.value, [0, 1], [FIELD_HEIGHT / 2 - 10, -9]),
    left: interpolate(float.value, [0, 1], [restingLeft, LABEL_INSET]),
    fontSize: interpolate(float.value, [0, 1], [16, 12]),
    // A white chip behind the floated label breaks the outline, like a notched field.
    backgroundColor: interpolateColor(float.value, [0, 1], ["rgba(255,255,255,0)", colors.background]),
  }));

  return (
    <View className={cn("relative justify-center", className)}>
      <Input
        {...input}
        value={value}
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
          "h-14 rounded-2xl bg-background",
          icon && "pl-12",
          prefix && "pl-24",
          (trailing || secure) && "pr-12",
          focused && "border-accent"
        )}
      />

      {placeholder ? (
        <Animated.Text
          pointerEvents="none"
          numberOfLines={1}
          style={[
            labelStyle,
            {
              position: "absolute",
              paddingHorizontal: 4,
              borderRadius: 4,
              color: floated && focused ? colors.accent : colors.textMuted,
              fontFamily: floated ? "DMSans_500Medium" : "DMSans_400Regular",
            },
          ]}
        >
          {placeholder}
        </Animated.Text>
      ) : null}

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
