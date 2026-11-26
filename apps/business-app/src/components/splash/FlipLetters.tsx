import React, { useEffect } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// A word whose letters flip around their horizontal axis. The whole word is on screen
// from the first frame — each letter starts a half turn over and spins upright, then
// holds still. Every letter picks its own start time, speed and direction, so they flip
// independently rather than sweeping across the word.
const FLIP_FROM = 180; // degrees each letter travels
const SLOWEST = 1.6; // a letter's spin lasts between MIN and SLOWEST x the base duration
const FASTEST = 0.65;

// How long after `delay` the last letter can still be spinning.
export const LETTER_TAIL = SLOWEST;

// Deterministic pseudo-random in [0,1), so a letter keeps the same spin across renders.
function noise(seed: number) {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  return n - Math.floor(n);
}

type Props = {
  text: string;
  style: TextStyle;
  duration: number; // base ms per letter; each letter varies around it
  scatter: number; // ms window the letters' start times are spread over
  delay?: number; // ms before the window opens
  seed?: number; // separates words so they don't flip in the same pattern
};

export default function FlipLetters({
  text,
  style,
  duration,
  scatter,
  delay = 0,
  seed = 0,
}: Props) {
  return (
    <View style={styles.row}>
      {Array.from(text).map((char, i) => {
        const at = seed + i;
        return (
          <FlipLetter
            key={`${char}-${i}`}
            char={char}
            style={style}
            delay={delay + noise(at * 7.31) * scatter}
            duration={duration * (FASTEST + noise(at * 3.17 + 91.7) * (SLOWEST - FASTEST))}
            direction={noise(at * 5.53 + 311.3) > 0.5 ? 1 : -1}
          />
        );
      })}
    </View>
  );
}

function FlipLetter({
  char,
  style,
  delay,
  duration,
  direction,
}: {
  char: string;
  style: TextStyle;
  delay: number;
  duration: number;
  direction: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, duration]);

  const animated = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateX: `${(1 - progress.value) * direction * FLIP_FROM}deg` },
    ],
  }));

  return (
    <Animated.View style={animated}>
      <Text style={style}>{char}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
});
