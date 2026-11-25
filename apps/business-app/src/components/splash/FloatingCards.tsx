import React, { useEffect, useRef, useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

// Placeholder photo pool — swap for final images later. Reused across cards in
// different rotations so each card cycles independently.
const POOL: ImageSourcePropType[] = [
  require("../../../assets/splash/restaurant.jpg"),
  require("../../../assets/splash/salon.jpg"),
  require("../../../assets/splash/creator-tripod.jpg"),
  require("../../../assets/splash/filming.jpg"),
  require("../../../assets/splash/social-apps.jpg"),
];

type Slot = {
  x: number; // left, fraction of screen width
  y: number; // top, fraction of screen height
  size: number; // width, fraction of screen width
  aspect: number; // height / width
  images: ImageSourcePropType[]; // this card's own rotation
  delay: number; // entrance stagger, ms
};

// Same arrangement as the reference frames, but the cards are bigger and pushed past the
// screen edges so only part of each one shows: roughly 3/4 of the top-left card, half of
// the top-right and mid-left ones, about 2/3 of the big bottom-right card, and just the
// top quarter of the bottom-left one.
const SLOTS: Slot[] = [
  { x: -0.06, y: -0.04, size: 0.5, aspect: 1.5, images: [POOL[0], POOL[2], POOL[4]], delay: 0 },
  { x: 0.66, y: 0.1, size: 0.42, aspect: 1.5, images: [POOL[1], POOL[3], POOL[0]], delay: 90 },
  { x: -0.1, y: 0.56, size: 0.46, aspect: 1.2, images: [POOL[2], POOL[4], POOL[1]], delay: 180 },
  { x: 0.54, y: 0.71, size: 0.62, aspect: 1.4, images: [POOL[3], POOL[0], POOL[2]], delay: 270 },
  { x: 0, y: 0.9, size: 0.26, aspect: 1.3, images: [POOL[4], POOL[1], POOL[3]], delay: 360 },
];

const START_SCALE = 0.3; // size of a tile as it first shows
const INWARD_PULL = 0.45; // how far towards the screen centre a tile starts (0 = own spot, 1 = centre)
const ENTRANCE_MS = 3400;
const CROSSFADE_MS = 450;
const FIRST_HOLD_MS = 150; // first switch lands while the card is still zooming in
const MIN_HOLD_MS = 900;
const MAX_HOLD_MS = 2000;

function FloatingCard({ slot, active }: { slot: Slot; active: boolean }) {
  const { width: W, height: H } = useWindowDimensions();
  const w = slot.size * W;
  const h = w * slot.aspect;

  const appear = useSharedValue(0); // 0 = small/blurred/pulled inward, 1 = settled
  const fade = useSharedValue(0); // crossfade progress between current and next image

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextIndex = (currentIndex + 1) % slot.images.length;

  const cycleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const advance = () => {
    if (!mounted.current) return;
    setCurrentIndex((i) => (i + 1) % slot.images.length);
    fade.value = 0;
    scheduleNext();
  };

  const scheduleNext = (hold = MIN_HOLD_MS + Math.random() * (MAX_HOLD_MS - MIN_HOLD_MS)) => {
    cycleTimeout.current = setTimeout(() => {
      if (!mounted.current) return;
      fade.value = withTiming(1, { duration: CROSSFADE_MS, easing: Easing.inOut(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(advance)();
      });
    }, hold);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (cycleTimeout.current) clearTimeout(cycleTimeout.current);
      cancelAnimation(appear);
      cancelAnimation(fade);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) return;
    appear.value = withDelay(
      slot.delay,
      withTiming(1, { duration: ENTRANCE_MS, easing: Easing.out(Easing.cubic) })
    );
    const kickoff = setTimeout(
      () => scheduleNext(FIRST_HOLD_MS + Math.random() * 300),
      slot.delay
    );
    return () => clearTimeout(kickoff);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Each card starts as a small, faint, blurred tile pulled part-way in towards the screen
  // centre and grows outward into its own spot — scaling up, drifting out, sharpening —
  // in one continuous move from the first frame.
  const inwardX = (W / 2 - (slot.x * W + w / 2)) * INWARD_PULL;
  const inwardY = (H / 2 - (slot.y * H + h / 2)) * INWARD_PULL;
  const cardStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, appear.value * 1.6),
    transform: [
      { translateX: inwardX * (1 - appear.value) },
      { translateY: inwardY * (1 - appear.value) },
      { scale: START_SCALE + appear.value * (1 - START_SCALE) },
    ],
  }));

  // The blur overlay starts fully opaque (image reads as a soft blob) and fades away as
  // the card settles, so the photo resolves from blurred to sharp.
  const blurStyle = useAnimatedStyle(() => ({
    opacity: 1 - appear.value,
  }));

  const incomingStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <Animated.View
      style={[styles.card, { left: slot.x * W, top: slot.y * H, width: w, height: h }, cardStyle]}
    >
      <Image source={slot.images[currentIndex]} style={styles.image} resizeMode="cover" />
      <Animated.Image
        source={slot.images[nextIndex]}
        style={[styles.image, styles.overlay, incomingStyle]}
        resizeMode="cover"
      />
      <Animated.View style={[styles.overlay, blurStyle]} pointerEvents="none">
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
      </Animated.View>
    </Animated.View>
  );
}

export default function FloatingCards({ active }: { active: boolean }) {
  return (
    <>
      {SLOTS.map((slot, i) => (
        <FloatingCard key={i} slot={slot} active={active} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#DDE1F5", // slightly deeper indigo while the photo decodes
  },
  image: { width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFill },
});
