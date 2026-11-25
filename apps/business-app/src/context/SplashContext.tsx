import { createContext, useContext } from "react";

// True once the animated splash has faded out. Screens that sit under the splash (the
// welcome reel) use it to hold off starting playback until they're actually visible.
export const SplashDoneContext = createContext(false);

export function useSplashDone() {
  return useContext(SplashDoneContext);
}
