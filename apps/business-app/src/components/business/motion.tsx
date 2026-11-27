// Shared motion helpers for business screens, built on react-native-reanimated (already in
// the app). Every animation uses `ReduceMotion.System`, so it's skipped when the OS
// reduce-motion setting is on.
//
// These wrap Reanimated's Animated.View, which is not a NativeWind-interop'd component, so
// they take `style` only — never pass className to them.

import React from "react";
import type { View, ViewStyle } from "react-native";
import Animated, { Easing, FadeIn, FadeInDown, FadeOut, LinearTransition, ReduceMotion } from "react-native-reanimated";

const EASE = Easing.out(Easing.cubic);

/** Fades + slides a block into view when it mounts; also animates later layout shifts. */
export function Reveal({
  delay = 0,
  children,
  style,
  onLayout,
}: {
  delay?: number;
  children: React.ReactNode;
  style?: ViewStyle;
  onLayout?: React.ComponentProps<typeof View>["onLayout"];
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(delay).easing(EASE).reduceMotion(ReduceMotion.System)}
      layout={LinearTransition.duration(240).easing(EASE).reduceMotion(ReduceMotion.System)}
      style={style}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
}

/** Content that appears/disappears inside an expandable block. */
export function Expand({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <Animated.View
      entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(140).reduceMotion(ReduceMotion.System)}
      layout={LinearTransition.duration(240).easing(EASE).reduceMotion(ReduceMotion.System)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}
