import React, { useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

// Decorative cards that drift up around the search line. Positions are fractions of the
// screen and keep the middle band clear for the text. Swap the emoji for real
// photos once Sparkr has brand imagery.
type Card = {
  x: number; // left, fraction of screen width (may be slightly off-screen)
  y: number; // top, fraction of screen height
  size: number; // width, fraction of screen width
  aspect: number; // height / width
  colors: [string, string];
  emoji: string;
  delay: number; // ms after the cards start appearing
};

const CARDS: Card[] = [
  // Top band (above the centred logo lockup)
  { x: 0.04, y: 0.05, size: 0.36, aspect: 1.1, colors: ["#F96167", "#F9A26C"], emoji: "🍜", delay: 0 },
  { x: 0.64, y: 0.14, size: 0.3, aspect: 1.2, colors: ["#EC4899", "#8B5CF6"], emoji: "💅", delay: 120 },
  { x: 0.44, y: 0.03, size: 0.14, aspect: 1.2, colors: ["#FDE68A", "#F59E0B"], emoji: "☕", delay: 260 },
  { x: -0.03, y: 0.27, size: 0.13, aspect: 1.2, colors: ["#CADCFC", "#6366F1"], emoji: "🕯️", delay: 380 },
  // Bottom band (below it)
  { x: 0.87, y: 0.6, size: 0.15, aspect: 1.1, colors: ["#A7F3D0", "#10B981"], emoji: "🌿", delay: 300 },
  { x: 0.06, y: 0.66, size: 0.3, aspect: 1.25, colors: ["#5EEAD4", "#0EA5E9"], emoji: "💆", delay: 180 },
  { x: 0.52, y: 0.7, size: 0.42, aspect: 1.1, colors: ["#60A5FA", "#1E2761"], emoji: "🍣", delay: 60 },
  { x: 0.1, y: 0.9, size: 0.16, aspect: 1.1, colors: ["#F9A8D4", "#DB2777"], emoji: "🌸", delay: 420 },
];

const APPEAR_MS = 600;
const DRIFT_MS = 5000;

function FloatingCard({ card, active }: { card: Card; active: boolean }) {
  const { width: W, height: H } = useWindowDimensions();
  const w = card.size * W;
  const h = w * card.aspect;
  // Bigger cards drift further, which gives a bit of parallax depth.
  const drift = 30 + card.size * 120;

  const appear = useSharedValue(0);
  const rise = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    appear.value = withDelay(
      card.delay,
      withTiming(1, { duration: APPEAR_MS, easing: Easing.out(Easing.cubic) })
    );
    rise.value = withDelay(
      card.delay,
      withTiming(1, { duration: DRIFT_MS, easing: Easing.linear })
    );
  }, [active]);

  const style = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [
      { translateY: drift * 0.4 - rise.value * drift },
      { scale: 0.8 + appear.value * 0.2 },
    ],
  }));

  return (
    <Animated.View
      style={[styles.card, { left: card.x * W, top: card.y * H, width: w, height: h }, style]}
    >
      <LinearGradient colors={card.colors} style={StyleSheet.absoluteFill} />
      <Text style={{ fontSize: w * 0.4 }}>{card.emoji}</Text>
    </Animated.View>
  );
}

export default function FloatingCards({ active }: { active: boolean }) {
  return (
    <>
      {CARDS.map((card) => (
        <FloatingCard key={card.emoji} card={card} active={active} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 18,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
