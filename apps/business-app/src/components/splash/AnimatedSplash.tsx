import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, TextStyle, View, useWindowDimensions } from "react-native";
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
import FlipLetters, { LETTER_TAIL } from "./FlipLetters";

/*
 * In-app half of the splash. The native splash (app.json → expo-splash-screen) is the plain
 * app background; this component takes over with the same blank frame, then plays:
 *
 *   a navy ball drops in from the top → lands at the centre, squashes and bounces once →
 *   swells until it floods the whole screen navy → the S mark fades in and "SPARKR MEDIA"
 *   flips letter by letter beneath it, around each letter's horizontal axis → fade into
 *   the app.
 *
 * Tap anywhere to skip.
 */

const BALL = 72; // diameter, px

// assets/splash-s.png is a navy silhouette, so it tints linen to read on the navy fill.
const S_LOGO_WIDTH = 60;
const S_LOGO_HEIGHT = Math.round((S_LOGO_WIDTH * 437) / 480);

const TIMING = {
  hold: 250, // plain white, exactly like the native splash
  drop: 650,
  bounceUp: 280,
  bounceDown: 300,
  settle: 120,
  fill: 750,
  logoIn: 450,
  lettersIn: 900, // base per letter; each letter spins a bit faster or slower
  letterScatter: 1100, // window the letters' start times are scattered over
  holdEnd: 1500,
  fadeOut: 500,
};

const TITLE = "SPARKR";
const SUBTITLE = "MEDIA";

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { width: W, height: H } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const [filled, setFilled] = useState(false);
  const [showLockup, setShowLockup] = useState(false);
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

      setShowLockup(true);
      const lettersTotal = TIMING.letterScatter + TIMING.lettersIn * LETTER_TAIL;
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

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, screenStyle]}>
      <StatusBar style={filled ? "light" : "dark"} />
      <Pressable style={StyleSheet.absoluteFill} onPress={finish}>
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Animated.View style={[styles.ball, ballStyle]} />
        </View>

        {showLockup && (
          <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
            <LogoMark />
            <View style={styles.wordRow}>
              <FlipLetters
                text={TITLE}
                style={styles.title}
                scatter={TIMING.letterScatter}
                duration={TIMING.lettersIn}
              />
              <View style={styles.wordSpacer} />
              <FlipLetters
                text={SUBTITLE}
                style={styles.subtitle}
                scatter={TIMING.letterScatter}
                duration={TIMING.lettersIn}
                seed={37} // a different pattern from SPARKR's
              />
            </View>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// The S mark above the wordmark: fades up into place as the letters start flipping in.
function LogoMark() {
  const appear = useSharedValue(0);

  useEffect(() => {
    appear.value = withTiming(1, { duration: TIMING.logoIn, easing: Easing.out(Easing.cubic) });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: appear.value,
    transform: [{ translateY: (1 - appear.value) * 12 }, { scale: 0.86 + appear.value * 0.14 }],
  }));

  return (
    <Animated.View style={style}>
      <Image
        source={require("../../../assets/splash-s.png")}
        style={styles.logo}
        resizeMode="contain"
        fadeDuration={0} // Android fades images in over 300ms by default
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.background, zIndex: 100 },
  center: { alignItems: "center", justifyContent: "center" },
  ball: {
    width: BALL,
    height: BALL,
    borderRadius: BALL / 2,
    backgroundColor: colors.navy,
  },
  logo: {
    width: S_LOGO_WIDTH,
    height: S_LOGO_HEIGHT,
    tintColor: colors.linen,
  },
  // "SPARKR MEDIA" reads as one line; the weight carries the hierarchy instead of size.
  wordRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  wordSpacer: { width: 11 },
  // FlipLetters applies these to every letter, so spacing belongs on the row, not here.
  title: {
    color: colors.linen,
    fontFamily: "DMSans_800ExtraBold",
    fontSize: 28,
    letterSpacing: 1.5,
  } as TextStyle,
  subtitle: {
    color: colors.linen,
    fontFamily: "DMSans_500Medium",
    fontSize: 28,
    letterSpacing: 1.5,
  } as TextStyle,
});
