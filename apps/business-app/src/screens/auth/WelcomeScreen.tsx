import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { colors } from "@sparkr/ui";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useSplashDone } from "../../context/SplashContext";
import Text from "../../components/Text";

// assets/welcome/welcome-reel.mp4 is the four source videos in videos/ cut to 4s each and
// joined into one silent 16s 720p loop (~1.1 MB). One player for one file keeps
// playback smooth; each 4s segment gets its own caption and progress bar below.
const REEL = require("../../../assets/welcome/welcome-reel.mp4");
const SEGMENT_SECONDS = 4;
// Scrim height as a multiple of the caption block, so it reaches above the text.
const SCRIM_REACH = 1.9;

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
  const [panelHeight, setPanelHeight] = useState(0); // caption block height sizes the scrim
  const active = isFocused && splashDone;
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
        onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}
      >
        {/* marginBottom as a style, not a class: NativeWind doesn't map className onto
            reanimated's Animated.View, so a mb-* class here is silently dropped. */}
        <Animated.View
          key={segment}
          entering={FadeInDown.duration(450)}
          style={{ marginBottom: 32 }}
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
          className="bg-linen rounded-2xl py-4 items-center active:opacity-80"
        >
          <Text className="text-navy text-base font-bold">Get started</Text>
        </Pressable>

        <Text className="text-linen/60 text-xs text-center mt-4">
          For businesses and influencers
        </Text>
      </View>
    </View>
  );
}
