import React, { useEffect } from "react";
import { Modal, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { Text } from "../ui/text";

// "Congratulations!" card over a dimmed screen: amber badge with confetti, message, a
// dotted spinner, then `onDone` fires after `delayMs` (the redirect the copy promises).
type Props = {
  visible: boolean;
  title?: string;
  body?: string;
  delayMs?: number;
  onDone: () => void;
};

const BADGE_BOX = 184; // area the badge and its confetti share
const BADGE = 96; // the amber circle

// Confetti around the badge: angle clockwise from 12 o'clock, distance from the centre
// (the badge's edge is at 48), dot size. Spread unevenly on purpose so it reads as
// scattered, not as a ring.
const CONFETTI: [angle: number, radius: number, size: number][] = [
  [18, 80, 9],
  [62, 72, 5],
  [112, 84, 7],
  [158, 70, 4],
  [206, 78, 10],
  [252, 86, 6],
  [296, 69, 5],
  [338, 88, 7],
];

function onRing(angleDeg: number, radius: number, size: number, box: number) {
  const a = (angleDeg * Math.PI) / 180;
  return {
    left: box / 2 + radius * Math.sin(a) - size / 2,
    top: box / 2 - radius * Math.cos(a) - size / 2,
    width: size,
    height: size,
  };
}

export default function CongratsModal({
  visible,
  title = "Congratulations!",
  body = "Your account is ready to use. You will be redirected to the Home page in a few seconds.",
  delayMs = 3000,
  onDone,
}: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, delayMs);
    return () => clearTimeout(t);
  }, [visible, delayMs, onDone]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: "rgba(20,33,61,0.6)" }}>
        <View className="w-full max-w-[340px] bg-background rounded-[28px] px-8 pt-9 pb-9 items-center">
          <View style={{ width: BADGE_BOX, height: BADGE_BOX }} className="items-center justify-center mb-6">
            {CONFETTI.map(([angle, radius, size], i) => (
              <View
                key={i}
                className="absolute bg-accent rounded-full"
                style={[onRing(angle, radius, size, BADGE_BOX), { opacity: i % 3 === 1 ? 0.6 : 1 }]}
              />
            ))}
            <View
              style={{ width: BADGE, height: BADGE, borderRadius: BADGE / 2 }}
              className="bg-accent items-center justify-center"
            >
              <Ionicons name="person" size={44} color={colors.navy} />
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-center mb-3">{title}</Text>
          <Text className="text-sm text-textMuted text-center leading-5 mb-8">{body}</Text>

          <DotSpinner />
        </View>
      </View>
    </Modal>
  );
}

// Eight dots on a ring, turning clockwise, sized like a comet: going clockwise from
// 12 o'clock the dots start smallest and grow steadily all the way round, so the head
// arriving back at 12 is the biggest — and the whole trail rotates.
const SPINNER = 36;
const SPINNER_DOTS = 8;
const DOT = 8;
const SPIN_MS = 1400;

function DotSpinner() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: SPIN_MS, easing: Easing.linear }), -1);
  }, []);

  const ringStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View style={[{ width: SPINNER, height: SPINNER }, ringStyle]}>
      {Array.from({ length: SPINNER_DOTS }).map((_, i) => (
        <SpinnerDot key={i} angle={(360 / SPINNER_DOTS) * i} rotation={rotation} />
      ))}
    </Animated.View>
  );
}

function SpinnerDot({ angle, rotation }: { angle: number; rotation: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    // Where this dot currently sits, clockwise from 12 o'clock, after the ring's rotation:
    // just past 12 → ~0 (tail), coming back up to 12 → 1 (head).
    const at = (((angle + rotation.value) % 360) + 360) % 360;
    const grown = (at === 0 ? 360 : at) / 360;
    return {
      transform: [{ scale: 0.3 + grown * 0.7 }],
      opacity: 0.35 + grown * 0.65,
    };
  });

  return (
    <Animated.View
      className="absolute bg-accent rounded-full"
      style={[onRing(angle, SPINNER / 2 - DOT / 2, DOT, SPINNER), style]}
    />
  );
}
