import "./global.css";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
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

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
        {splashDone ? null : <AnimatedSplash onFinish={() => setSplashDone(true)} />}
        <StatusBar style="dark" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
