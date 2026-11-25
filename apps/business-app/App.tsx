import "./global.css";
import React, { useState } from "react";
import * as SplashScreen from "expo-splash-screen";
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

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SplashDoneContext.Provider value={splashDone}>
          <RootNavigator />
        </SplashDoneContext.Provider>
        {splashDone ? null : <AnimatedSplash onFinish={() => setSplashDone(true)} />}
      </AuthProvider>
    </SafeAreaProvider>
  );
}
