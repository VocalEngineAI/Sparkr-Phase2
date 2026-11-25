import "./global.css";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/dm-sans";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import AnimatedSplash from "./src/components/splash/AnimatedSplash";

// Keep the native splash up until AnimatedSplash has drawn its identical first frame,
// then hide it instantly (no fade) so the hand-off is invisible.
SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 0, fade: false });

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  // The splash has no text, so it shows from the first frame; only the app screens wait
  // for the fonts (hidden behind the splash), so nothing ever renders in the system font.
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {fontsLoaded ? <RootNavigator /> : null}
        {splashDone ? null : <AnimatedSplash onFinish={() => setSplashDone(true)} />}
        <StatusBar style="dark" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
