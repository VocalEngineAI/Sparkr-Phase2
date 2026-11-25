import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "@sparkr/ui";
import { BALL } from "../../components/splash/AnimatedSplash";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useSplashDone } from "../../context/SplashContext";

// assets/welcome/welcome-reel.mp4 is the four source videos in videos/ cut to 4s each and
// joined into one silent 16s 720p loop (~1.1 MB). One player for one file keeps
// playback smooth; each 4s segment gets its own caption and progress bar below.
const REEL = require("../../../assets/welcome/welcome-reel.mp4");
const SEGMENT_SECONDS = 4;
// Scrim height as a multiple of the caption block, so it reaches above the text.
const SCRIM_REACH = 1.9;

// The splash hands over a full-screen navy fill. It pulls back into the splash's ball at the
// centre (revealing this screen), pauses, then drops into the button and stretches to fit.
const MORPH_DELAY = 120;
const CONTRACT_MS = 620;
const BALL_HOLD_MS = 140;
const DROP_MS = 680;
const REVEAL_MS = 520; // once the ball has landed: content fades in, the pill fades out
const BUTTON_RADIUS = 16; // matches the button's rounded-2xl

type Rect = { x: number; y: number; width: number; height: number };

const SEGMENTS = [
  {
    label: "Restaurants",
    title: "Fill your tables with local creators",
    body: "Invite influencers to dine, post, and bring their followers to your door.",
  },
  {
    label: "Salons & spas",
    title: "Turn every appointment into content",
    body: "Creators try your services and share them with an audience that books.",
  },
  {
    label: "Influencers",
    title: "Get rewarded for what you already love",
    body: "Find paid and barter campaigns from local businesses near you.",
  },
  {
    label: "One app",
    title: "Campaigns, posts and payouts in one place",
    body: "Launch, track and pay for influencer marketing — all from Sparkr.",
  },
];

type Props = NativeStackScreenProps<AuthStackParamList, "Welcome">;

export default function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const splashDone = useSplashDone();
  const [time, setTime] = useState(0);
  // Caption block geometry: its height sizes the scrim, its offset places the morph target.
  const [panel, setPanel] = useState({ x: 0, y: 0, height: 0 });
  const [button, setButton] = useState<Rect | null>(null);
  const [landed, setLanded] = useState(false); // ball has reached the button
  const [morphDone, setMorphDone] = useState(false); // pill has faded into the real button
  const panelHeight = panel.height;
  // Everything but the ball stays hidden until it has landed; the reel starts as it fades in.
  const active = isFocused && splashDone && landed;

  const reveal = useSharedValue(0);
  useEffect(() => {
    if (landed) reveal.value = withTiming(1, { duration: REVEAL_MS });
  }, [landed]);
  const revealStyle = useAnimatedStyle(() => ({ opacity: reveal.value }));
  const startedOnce = useRef(false);

  const player = useVideoPlayer(REEL, (p) => {
    p.loop = true;
    p.muted = true;
    p.timeUpdateEventInterval = 0.1;
  });

  useEventListener(player, "timeUpdate", ({ currentTime }) => setTime(currentTime));

  // Play only while visible: not under the splash, not behind the sign-up screen.
  useEffect(() => {
    if (active) {
      if (!startedOnce.current) {
        startedOnce.current = true;
        player.currentTime = 0;
      }
      player.play();
    } else {
      player.pause();
    }
  }, [active, player]);

  const segment = Math.min(SEGMENTS.length - 1, Math.floor(time / SEGMENT_SECONDS));
  const copy = SEGMENTS[segment];

  // Story-style tap zones: left third goes back a clip, the rest skips ahead.
  const onTapVideo = (x: number) => {
    const next = x < width / 3 ? Math.max(0, segment - 1) : (segment + 1) % SEGMENTS.length;
    player.currentTime = next * SEGMENT_SECONDS;
    setTime(next * SEGMENT_SECONDS);
  };

  return (
    <View className="flex-1 bg-linen">
      <StatusBar style={isFocused ? "light" : "dark"} />

      {/* The whole screen fades in together once the ball has landed on the button. */}
      <Animated.View style={[StyleSheet.absoluteFill, revealStyle]}>
      {/* Edge to edge on any screen shape: the view is exactly the screen and the player's
          own aspect-fill crops the reel to it (sides on tall phones, top/bottom on wide). */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />
      {/* Scrim behind the caption: solid navy at the bottom edge, easing off to clear well
          above the text. Its height follows the measured caption block, so it scales with
          however the copy wraps. */}
      {panelHeight > 0 ? (
        <LinearGradient
          colors={[
            "rgba(20,33,61,0)",
            "rgba(20,33,61,0.3)",
            "rgba(20,33,61,0.62)",
            "rgba(20,33,61,0.85)",
            "rgba(20,33,61,0.96)",
            "rgba(20,33,61,1)",
          ]}
          locations={[0, 0.22, 0.45, 0.66, 0.85, 1]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: panelHeight * SCRIM_REACH,
          }}
          pointerEvents="none"
        />
      ) : null}

      {/* Progress bars + brand */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-5">
        <View className="flex-row gap-1.5">
          {SEGMENTS.map((_, i) => {
            const fill =
              i < segment ? 1 : i > segment ? 0 : (time - i * SEGMENT_SECONDS) / SEGMENT_SECONDS;
            return (
              <View key={i} className="flex-1 h-[3px] rounded-full bg-linen/30 overflow-hidden">
                <View
                  className="h-full bg-linen rounded-full"
                  style={{ width: `${Math.max(0, Math.min(1, fill)) * 100}%` }}
                />
              </View>
            );
          })}
        </View>
        <View className="flex-row items-center mt-4">
          <Image
            source={require("../../../assets/splash-s.png")}
            style={{ width: 30, height: 27, tintColor: colors.linen }}
          />
          <Text className="text-linen text-base font-extrabold tracking-[2px] ml-2">SPARKR</Text>
          <Text className="text-linen/70 text-[10px] font-medium tracking-[3px] ml-1.5 mt-0.5">
            MEDIA
          </Text>
        </View>
      </View>

      {/* Tap zones for skipping clips (everything between header and the copy/buttons) */}
      <Pressable className="flex-1" onPress={(e) => onTapVideo(e.nativeEvent.locationX)} />

      {/* Caption + actions */}
      <View
        style={{ paddingBottom: insets.bottom + 16 }}
        className="px-6"
        onLayout={(e) => {
          const { x, y, height } = e.nativeEvent.layout;
          setPanel({ x, y, height });
        }}
      >
        {/* marginBottom as a style, not a class: NativeWind doesn't map className onto
            reanimated's Animated.View, so a mb-* class here is silently dropped. */}
        <Animated.View
          key={segment}
          entering={FadeInDown.duration(450)}
          style={{ marginBottom: 56 }}
        >
          <Text className="text-amber text-xs font-bold tracking-[2px] uppercase mb-2">
            {copy.label}
          </Text>
          <Text className="text-linen text-[32px] leading-[38px] font-extrabold mb-3">
            {copy.title}
          </Text>
          <Text className="text-linen/80 text-base leading-6">{copy.body}</Text>
        </Animated.View>

        {/* One way in: the sign-up screen carries its own "Already have an account?" switch. */}
        <Pressable
          onPress={() => navigation.navigate("Auth", { mode: "signup" })}
          onLayout={(e) => setButton(e.nativeEvent.layout)}
          className="bg-linen rounded-2xl py-4 items-center active:opacity-80"
        >
          <Text className="text-navy text-base font-bold">Get started</Text>
        </Pressable>

        <Text className="text-linen/60 text-xs text-center mt-4">
          For businesses and influencers
        </Text>
      </View>
      </Animated.View>

      {/* Continues the splash: its navy fill shrinks into the ball, drops onto the button,
          then cross-fades into it while the rest of the screen fades in. */}
      {splashDone && button && !morphDone ? (
        <SplashMorph
          target={{
            x: panel.x + button.x,
            y: panel.y + button.y,
            width: button.width,
            height: button.height,
          }}
          onLanded={() => setLanded(true)}
          onDone={() => setMorphDone(true)}
        />
      ) : null}
    </View>
  );
}

// Starts as the full-screen navy the splash left behind. Progress 0→1 pulls it back into
// the splash's ball at the centre of the screen; 1→2 drops the ball onto the "Get started"
// button, stretching it to the button's shape and turning it linen. On landing it reports
// `onLanded`, then fades out over the real button (which is fading in underneath) and
// reports `onDone`.
function SplashMorph({
  target,
  onLanded,
  onDone,
}: {
  target: Rect;
  onLanded: () => void;
  onDone: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    const land = () => {
      onLanded();
      fade.value = withTiming(0, { duration: REVEAL_MS }, (finished) => {
        if (finished) runOnJS(onDone)();
      });
    };
    progress.value = withDelay(
      MORPH_DELAY,
      withSequence(
        withTiming(1, { duration: CONTRACT_MS, easing: Easing.inOut(Easing.cubic) }),
        withDelay(
          BALL_HOLD_MS,
          withTiming(2, { duration: DROP_MS, easing: Easing.inOut(Easing.cubic) }, (finished) => {
            if (finished) runOnJS(land)();
          })
        )
      )
    );
  }, []);

  const ballLeft = (width - BALL) / 2;
  const ballTop = (height - BALL) / 2;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      left: interpolate(p, [0, 1, 2], [0, ballLeft, target.x]),
      top: interpolate(p, [0, 1, 2], [0, ballTop, target.y]),
      width: interpolate(p, [0, 1, 2], [width, BALL, target.width]),
      height: interpolate(p, [0, 1, 2], [height, BALL, target.height]),
      borderRadius: interpolate(p, [0, 1, 2], [0, BALL / 2, BUTTON_RADIUS]),
      // Stays navy through the ball; only turns linen on the way into the button.
      backgroundColor: interpolateColor(p, [1, 2], [colors.navy, colors.linen]),
      opacity: fade.value,
    };
  });

  return <Animated.View pointerEvents="none" style={[{ position: "absolute" }, style]} />;
}
