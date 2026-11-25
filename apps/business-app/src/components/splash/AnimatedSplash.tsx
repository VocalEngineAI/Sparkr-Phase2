import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "@sparkr/ui";
import FloatingCards from "./FloatingCards";

/*
 * In-app half of the splash. The native splash (app.json → expo-splash-screen) shows the
 * Sparkr S centred on the app background; this component draws the same S at the same
 * size and spot, hides the native one, then plays:
 *
 *   short hold → photo cards grow out towards the corners, blurred to sharp, and keep
 *   crossfading around the fixed S → fade into the app.
 *
 * Tap anywhere to skip.
 */

// Must match app.json → expo-splash-screen → imageWidth, so the hand-off is invisible.
// assets/splash-s.png (cropped from photos/Slogo.png) is 480x437.
export const S_LOGO_WIDTH = 90;
const S_LOGO_HEIGHT = Math.round((S_LOGO_WIDTH * 437) / 480);

const TIMING = {
  hold: 500, // S sits alone, exactly like the native splash, before the cards start
  holdEnd: 5800, // cards grow in and keep crossfading before the splash fades into the app
  fadeOut: 450,
};

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const [ready, setReady] = useState(false);
  const [cardsActive, setCardsActive] = useState(false);
  const finished = useRef(false);

  const screenOpacity = useSharedValue(1);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    screenOpacity.value = withTiming(0, { duration: TIMING.fadeOut });
    setTimeout(onFinish, TIMING.fadeOut);
  }, [onFinish]);

  // First frame is the S alone, identical to the native splash, so swap it in right away.
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

    (async () => {
      await wait(TIMING.hold);
      if (cancelled || finished.current) return;
      setCardsActive(true);
      await wait(TIMING.holdEnd);
      if (!cancelled) finish();
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, finish]);

  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, screenStyle]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={finish}>
        <FloatingCards active={cardsActive} />

        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Image
            source={require("../../../assets/splash-s.png")}
            style={{ width: S_LOGO_WIDTH, height: S_LOGO_HEIGHT }}
            resizeMode="contain"
            fadeDuration={0} // Android fades images in over 300ms by default
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.background, zIndex: 100 },
  center: { alignItems: "center", justifyContent: "center" },
});
