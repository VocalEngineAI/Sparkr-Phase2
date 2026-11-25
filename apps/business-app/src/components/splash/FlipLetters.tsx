import React, { useEffect } from "react";
import { StyleSheet, Text, TextStyle, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

// A word whose letters flip in one after another around their horizontal axis — each
// starts face-down (rotated 90° away from the viewer), invisible, and twists upright.
type Props = {
  text: string;
  style: TextStyle;
  stagger: number; // ms between letters
  duration: number; // ms per letter
  delay?: number; // ms before the first letter
};

export default function FlipLetters({ text, style, stagger, duration, delay = 0 }: Props) {
  return (
    <View style={styles.row}>
      {Array.from(text).map((char, i) => (
        <FlipLetter
          key={`${char}-${i}`}
          char={char}
          style={style}
          delay={delay + i * stagger}
          duration={duration}
        />
      ))}
    </View>
  );
}

function FlipLetter({
  char,
  style,
  delay,
  duration,
}: {
  char: string;
  style: TextStyle;
  delay: number;
  duration: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, [delay, duration]);

  const animated = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { perspective: 600 },
      { rotateX: `${(1 - progress.value) * 90}deg` },
      { translateY: (1 - progress.value) * 10 },
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
