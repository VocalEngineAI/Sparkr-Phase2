import "./global.css";
import React, { useState } from "react";
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
import { SplashDoneContext } from "./src/context/SplashContext";
import RootNavigator from "./src/navigation/RootNavigator";
import AnimatedSplash from "./src/components/splash/AnimatedSplash";

// Keep the native splash up until AnimatedSplash has drawn its identical first frame,
// then hide it instantly (no fade) so the hand-off is invisible.
SplashScreen.preventAutoHideAsync().catch(() => {});
SplashScreen.setOptions({ duration: 0, fade: false });

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  // The splash's wordmark is set in DM Sans. Its opening (white screen, falling ball) has
  // no text, so the splash shows from the first frame while the fonts finish loading.
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SplashDoneContext.Provider value={splashDone}>
          {fontsLoaded ? <RootNavigator /> : null}
        </SplashDoneContext.Provider>
        {splashDone ? null : <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      </AuthProvider>
    </SafeAreaProvider>
  );
}
