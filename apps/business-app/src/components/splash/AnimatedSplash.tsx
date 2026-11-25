import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TextStyle, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "@sparkr/ui";
import FlipLetters from "./FlipLetters";

/*
 * In-app half of the splash. The native splash (app.json → expo-splash-screen) is plain
 * white; this component takes over with the same white frame, then plays:
 *
 *   a blue ball drops in from the top → lands at the centre, squashes and bounces once →
 *   swells until it floods the whole screen blue → "SPARKR" and "MEDIA" flip in letter
 *   by letter around their horizontal axis → fade into the app.
 *
 * Tap anywhere to skip.
 */

const BALL = 72; // diameter, px

const TIMING = {
  hold: 250, // plain white, exactly like the native splash
  drop: 650,
  bounceUp: 280,
  bounceDown: 300,
  settle: 120,
  fill: 750,
  lettersIn: 520, // per letter
  letterStagger: 55,
  wordGap: 180, // extra pause before "MEDIA" starts
  holdEnd: 1500,
  fadeOut: 500,
};

const TITLE = "SPARKR";
const SUBTITLE = "MEDIA";

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { width: W, height: H } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const [filled, setFilled] = useState(false);
  const [lettersStart, setLettersStart] = useState<number | null>(null);
  const finished = useRef(false);

  const ballY = useSharedValue(-(H / 2 + BALL)); // starts just above the top edge
  const ballScaleX = useSharedValue(1);
  const ballScaleY = useSharedValue(1);
  const ballGrow = useSharedValue(1); // 1 = ball, FILL_SCALE = covers the screen
  const screenOpacity = useSharedValue(1);

  // Scale that takes the ball's circle past every screen corner.
  const fillScale = (Math.hypot(W, H) / BALL) * 1.05;

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    screenOpacity.value = withTiming(0, { duration: TIMING.fadeOut });
    setTimeout(onFinish, TIMING.fadeOut);
  }, [onFinish]);

  // First frame is plain white, identical to the native splash, so swap it in right away.
  useEffect(() => {
    requestAnimationFrame(() => {
      SplashScreen.hide();
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const alive = () => !cancelled && !finished.current;

    (async () => {
      await wait(TIMING.hold);
      if (!alive()) return;

      // Drop under gravity, squash on impact, one bounce, settle.
      const bounceHeight = -H * 0.16;
      ballY.value = withSequence(
        withTiming(0, { duration: TIMING.drop, easing: Easing.in(Easing.quad) }),
        withTiming(bounceHeight, { duration: TIMING.bounceUp, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: TIMING.bounceDown, easing: Easing.in(Easing.quad) })
      );
      const squash = (amount: number, at: number) => {
        ballScaleX.value = withDelay(
          at,
          withSequence(
            withTiming(1 + amount, { duration: 90, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) })
          )
        );
        ballScaleY.value = withDelay(
          at,
          withSequence(
            withTiming(1 - amount, { duration: 90, easing: Easing.out(Easing.quad) }),
            withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) })
          )
        );
      };
      squash(0.22, TIMING.drop);
      squash(0.1, TIMING.drop + TIMING.bounceUp + TIMING.bounceDown);
      await wait(TIMING.drop + TIMING.bounceUp + TIMING.bounceDown + TIMING.settle);
      if (!alive()) return;

      // Swell until the circle covers the screen.
      ballGrow.value = withTiming(fillScale, {
        duration: TIMING.fill,
        easing: Easing.inOut(Easing.cubic),
      });
      await wait(TIMING.fill * 0.55);
      if (!alive()) return;
      setFilled(true); // light status bar once the blue is behind it
      await wait(TIMING.fill * 0.45);
      if (!alive()) return;

      setLettersStart(Date.now());
      const lettersTotal =
        (TITLE.length + SUBTITLE.length - 1) * TIMING.letterStagger +
        TIMING.wordGap +
        TIMING.lettersIn;
      await wait(lettersTotal + TIMING.holdEnd);
      if (alive()) finish();
    })();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  const ballStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: ballY.value },
      { scaleX: ballScaleX.value * ballGrow.value },
      { scaleY: ballScaleY.value * ballGrow.value },
    ],
  }));
  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  const subtitleDelay = TITLE.length * TIMING.letterStagger + TIMING.wordGap;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, screenStyle]}>
      <StatusBar style={filled ? "light" : "dark"} />
      <Pressable style={StyleSheet.absoluteFill} onPress={finish}>
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Animated.View style={[styles.ball, ballStyle]} />
        </View>

        {lettersStart !== null && (
          <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
            <FlipLetters
              text={TITLE}
              style={styles.title}
              stagger={TIMING.letterStagger}
              duration={TIMING.lettersIn}
            />
            <FlipLetters
              text={SUBTITLE}
              style={styles.subtitle}
              stagger={TIMING.letterStagger}
              duration={TIMING.lettersIn}
              delay={subtitleDelay}
            />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#FFFFFF", zIndex: 100 },
  center: { alignItems: "center", justifyContent: "center" },
  ball: {
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    backgroundColor: colors.primary,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "DMSans_800ExtraBold",
    fontSize: 44,
    letterSpacing: 2,
  } as TextStyle,
  subtitle: {
    color: "#FFFFFF",
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    letterSpacing: 7,
    marginTop: 6,
    marginLeft: 7, // balances the trailing letterSpacing so MEDIA sits centred
  } as TextStyle,
});
