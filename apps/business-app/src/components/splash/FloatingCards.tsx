import React, { useEffect } from "react";
import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// Photo cards pinned to the four screen corners around the logo lockup, each slowly
// zooming out into place, half-cropped by the screen edge. Positions are fractions of
// the screen and keep the middle band clear for the logo.
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

// Layout: two photos on top (left corner; right one sitting a little lower than the
// left), and three on the bottom — a main bottom-left photo, a tiny tile tucked into the
// very bottom-left corner below it (mostly off-screen, just its top edge peeking in) with
// a gap between the two, and one photo in the bottom-right corner.
const CARDS: Card[] = [
  { x: -0.075, y: -0.04, size: 0.5, aspect: 1.2, image: require("../../../assets/splash/restaurant.jpg"), delay: 0 },
  { x: 0.64, y: 0.08, size: 0.42, aspect: 1.2, image: require("../../../assets/splash/salon.jpg"), delay: 150 },
  { x: -0.07, y: 0.674, size: 0.44, aspect: 1.2, image: require("../../../assets/splash/creator-tripod.jpg"), delay: 300 },
  // Tiny tile in the very bottom-left corner, below the photo above with a gap — mostly
  // off-screen, just its top edge visible.
  { x: -0.03, y: 0.978, size: 0.16, aspect: 1.2, image: require("../../../assets/splash/social-apps.jpg"), delay: 450 },
  { x: 0.52, y: 0.737, size: 0.56, aspect: 1.2, image: require("../../../assets/splash/filming.jpg"), delay: 600 },
];

const APPEAR_MS = 2200;

function FloatingCard({ card, active }: { card: Card; active: boolean }) {
  const { width: W, height: H } = useWindowDimensions();
  const w = card.size * W;
  const h = w * card.aspect;

  const appear = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    appear.value = withDelay(
      card.delay,
      withTiming(1, { duration: APPEAR_MS, easing: Easing.out(Easing.quad) })
    );
  }, [active]);

  // Zooms out slowly: each photo starts well enlarged (as if seen up close) and eases
  // down to its final size in place, so the collage reads as pulling back into its corner.
  const style = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{ scale: 2 - appear.value }],
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
