import React, { useEffect } from "react";
import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// Photo cards that drift up around the logo lockup. Positions are fractions of the
// screen and keep the middle band clear for the logo.
//
// Images are card-sized crops (480x576 JPEG, ~30 KB) of the originals in photos/ —
// don't point these at the full-size photos, they're several MB each.
type Card = {
  x: number; // left, fraction of screen width
  y: number; // top, fraction of screen height
  size: number; // width, fraction of screen width
  aspect: number; // height / width
  image: ImageSourcePropType;
  delay: number; // ms after the cards start appearing
};

const CARDS: Card[] = [
  // Top band (above the centred logo lockup)
  { x: 0.04, y: 0.05, size: 0.38, aspect: 1.2, image: require("../../../assets/splash/restaurant.jpg"), delay: 0 },
  { x: 0.46, y: 0.03, size: 0.14, aspect: 1.2, image: require("../../../assets/splash/social-apps.jpg"), delay: 260 },
  { x: 0.62, y: 0.12, size: 0.32, aspect: 1.2, image: require("../../../assets/splash/salon.jpg"), delay: 120 },
  // Bottom band (below it)
  { x: 0.06, y: 0.66, size: 0.32, aspect: 1.2, image: require("../../../assets/splash/creator-tripod.jpg"), delay: 180 },
  { x: 0.52, y: 0.69, size: 0.42, aspect: 1.2, image: require("../../../assets/splash/filming.jpg"), delay: 60 },
];

const APPEAR_MS = 600;
const DRIFT_MS = 7000; // slow enough that the cards are still gently moving when the splash fades

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
    rise.value = withDelay(card.delay, withTiming(1, { duration: DRIFT_MS, easing: Easing.linear }));
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
      <Image source={card.image} style={styles.image} resizeMode="cover" />
    </Animated.View>
  );
}

export default function FloatingCards({ active }: { active: boolean }) {
  return (
    <>
      {CARDS.map((card, i) => (
        <FloatingCard key={i} card={card} active={active} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E6DDCD", // sand placeholder while the photo decodes
  },
  image: { width: "100%", height: "100%" },
});
