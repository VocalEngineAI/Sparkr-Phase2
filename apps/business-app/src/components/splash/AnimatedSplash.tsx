import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { colors } from "@sparkr/ui";
import FloatingCards from "./FloatingCards";

/*
 * In-app half of the splash. The native splash (app.json → expo-splash-screen) shows the
 * navy Sparkr S centred on linen; this component draws the same S at the same size and spot,
 * hides the native one, then plays:
 *
 *   S pulses → slides left → a cursor types "SPARKR" letter by letter beside it →
 *   the rules draw in and "MEDIA" types underneath → cards drift up → fade into the app.
 *
 * Tap anywhere to skip.
 */

// Must match app.json → expo-splash-screen → imageWidth, so the hand-off is invisible.
// assets/splash-s.png (cropped from photos/Slogo.png) is 480x437.
export const S_LOGO_WIDTH = 120;
const S_LOGO_HEIGHT = Math.round((S_LOGO_WIDTH * 437) / 480);

const TIMING = {
  hold: 300, // S sits still, exactly like the native splash
  pulse: 450,
  slide: 550,
  blink: 400, // one off/on cycle
  charMs: 95,
  pauseBeforeMedia: 180,
  rules: 300,
  holdEnd: 3000, // finished logo + photo cards stay on screen before fading into the app
  fadeOut: 450,
};

const TITLE = "SPARKR";
const SUBTITLE = "MEDIA";

export default function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const { width: screenW } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  const [titleCount, setTitleCount] = useState(0);
  const [subtitleCount, setSubtitleCount] = useState(0);
  const [cursorLine, setCursorLine] = useState<"none" | "title" | "subtitle">("none");
  const [cardsActive, setCardsActive] = useState(false);
  const finished = useRef(false);

  const lockupOpacity = useSharedValue(0); // hidden until measured
  const sShift = useSharedValue(0); // translateX that puts the S at screen centre
  const sScale = useSharedValue(1);
  const cursorOpacity = useSharedValue(0);
  const glow = useSharedValue(0);
  const rules = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    screenOpacity.value = withTiming(0, { duration: TIMING.fadeOut });
    setTimeout(onFinish, TIMING.fadeOut);
  }, [onFinish]);

  // The S sits at the left of the final lockup. Measure where that is, shift it back to
  // screen centre (where the native splash drew it), then swap out the native splash.
  const onLockupLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (ready) return;
      const { x } = e.nativeEvent.layout;
      sShift.value = screenW / 2 - (x + S_LOGO_WIDTH / 2);
      lockupOpacity.value = 1;
      requestAnimationFrame(() => {
        SplashScreen.hide();
        setReady(true);
      });
    },
    [ready, screenW]
  );

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const alive = () => !cancelled && !finished.current;

    (async () => {
      await wait(TIMING.hold);
      sScale.value = withSequence(
        withTiming(1.07, { duration: TIMING.pulse / 2, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: TIMING.pulse / 2, easing: Easing.in(Easing.quad) })
      );
      await wait(TIMING.pulse);
      if (!alive()) return;

      sShift.value = withTiming(0, { duration: TIMING.slide, easing: Easing.out(Easing.cubic) });
      await wait(TIMING.slide * 0.7);
      if (!alive()) return;
      setCursorLine("title");
      cursorOpacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withRepeat(
          withSequence(
            withTiming(0, { duration: TIMING.blink / 2 }),
            withTiming(1, { duration: TIMING.blink / 2 })
          ),
          1
        )
      );
      await wait(150 + TIMING.blink);

      glow.value = withTiming(1, { duration: 250 });
      for (let i = 1; i <= TITLE.length; i++) {
        if (!alive()) return;
        setTitleCount(i);
        await wait(TIMING.charMs);
      }
      await wait(TIMING.pauseBeforeMedia);
      if (!alive()) return;

      rules.value = withTiming(1, { duration: TIMING.rules, easing: Easing.out(Easing.cubic) });
      setCursorLine("subtitle");
      setCardsActive(true);
      for (let i = 1; i <= SUBTITLE.length; i++) {
        if (!alive()) return;
        setSubtitleCount(i);
        await wait(TIMING.charMs);
      }
      glow.value = withTiming(0, { duration: 400 });
      cursorOpacity.value = withTiming(0, { duration: 300 });
      await wait(TIMING.holdEnd);
      if (alive()) finish();
    })();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  const lockupStyle = useAnimatedStyle(() => ({ opacity: lockupOpacity.value }));
  const sStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sShift.value }, { scale: sScale.value }],
  }));
  const rulesStyle = useAnimatedStyle(() => ({
    opacity: rules.value,
    transform: [{ scaleX: rules.value }],
  }));
  const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));
  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  const cursor = (height: number) => (
    <View style={[styles.cursorSlot, { height }]}>
      <Animated.View style={[styles.glow, { top: (height - GLOW_H) / 2 }, glowStyle]}>
        <Glow />
      </Animated.View>
      <Animated.View style={[styles.cursor, { height }, cursorStyle]} />
    </View>
  );

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, screenStyle]}>
      {/* Mounted last, so it wins over the welcome screen's light status bar until we fade. */}
      <StatusBar style="dark" />
      <Pressable style={StyleSheet.absoluteFill} onPress={finish}>
        <FloatingCards active={cardsActive} />

        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Animated.View style={[styles.lockup, lockupStyle]} onLayout={onLockupLayout}>
            <Animated.View style={sStyle}>
              <Image
                source={require("../../../assets/splash-s.png")}
                style={{ width: S_LOGO_WIDTH, height: S_LOGO_HEIGHT }}
              />
            </Animated.View>

            <View style={styles.wordmark}>
              <TypedText
                full={TITLE}
                count={titleCount}
                style={styles.title}
                cursor={cursorLine === "title" ? cursor(30) : null}
              />
              <View style={styles.subtitleRow}>
                <Animated.View style={[styles.rule, rulesStyle]} />
                <TypedText
                  full={SUBTITLE}
                  count={subtitleCount}
                  style={styles.subtitle}
                  cursor={cursorLine === "subtitle" ? cursor(14) : null}
                />
                <Animated.View style={[styles.rule, rulesStyle]} />
              </View>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Reserves the full word's width with an invisible copy, then draws the typed prefix on
// top, so the lockup never shifts while letters appear.
function TypedText({
  full,
  count,
  style,
  cursor,
}: {
  full: string;
  count: number;
  style: TextStyle;
  cursor: React.ReactNode;
}) {
  return (
    <View>
      <Text style={[style, styles.invisible]}>{full}</Text>
      <View style={styles.typedOverlay}>
        <Text style={style} numberOfLines={1}>
          {full.slice(0, count)}
        </Text>
        {cursor}
      </View>
    </View>
  );
}

// Soft amber haze trailing the cursor — one of the palette's amber hints. Stacked
// translucent ovals stand in for a blur, which React Native can't do without another
// native module.
function Glow() {
  return (
    <>
      {[1, 0.75, 0.5].map((scale) => (
        <LinearGradient
          key={scale}
          colors={["rgba(255,176,32,0.22)", "rgba(255,176,32,0.12)", "rgba(255,176,32,0)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.glowLayer, { transform: [{ scaleX: scale }, { scaleY: scale }] }]}
        />
      ))}
    </>
  );
}

const GLOW_W = 130;
const GLOW_H = 80;

const styles = StyleSheet.create({
  root: { backgroundColor: colors.linen, zIndex: 100 },
  center: { alignItems: "center", justifyContent: "center" },
  lockup: { flexDirection: "row", alignItems: "center" },
  wordmark: { marginLeft: 8 },
  title: {
    color: colors.navy,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  subtitleRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 6,
    marginLeft: 6, // balances the trailing letterSpacing so MEDIA sits centred
  },
  rule: { flex: 1, height: 1.5, backgroundColor: colors.amber, marginHorizontal: 6 },
  invisible: { opacity: 0 },
  // The overlay extends 40pt past the reserved word width. Yoga measures an absolute
  // child's text against its container's width, so without this slack the trailing
  // cursor squeezes the word and its last letters get cut off.
  typedOverlay: {
    position: "absolute",
    left: 0,
    right: -40,
    top: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  cursorSlot: { width: 3, marginLeft: 2 },
  cursor: { width: 3, borderRadius: 1.5, backgroundColor: colors.navy },
  glow: { position: "absolute", left: -20, width: GLOW_W, height: GLOW_H },
  glowLayer: { ...StyleSheet.absoluteFill, borderRadius: GLOW_H / 2 },
});
