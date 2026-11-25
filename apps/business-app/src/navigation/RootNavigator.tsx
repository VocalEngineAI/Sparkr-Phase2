import React from "react";
import { DefaultTheme, NavigationContainer, Theme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { colors } from "@sparkr/ui";
import { useAuth } from "../context/AuthContext";
import AuthNavigator from "./AuthNavigator";
import BusinessTabNavigator from "./BusinessTabNavigator";
import InfluencerTabNavigator from "./InfluencerTabNavigator";

// Tab bar, headers and screen containers follow the Sparkr palette (linen base, navy ink).
const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

export default function RootNavigator() {
  const { role } = useAuth();

  return (
    <>
      {/* Base status bar style. Screens that need another (the welcome video, the splash)
          mount their own <StatusBar>, which takes precedence while mounted. */}
      <StatusBar style="dark" />
      <NavigationContainer theme={navTheme}>
        {role === "business" ? (
          <BusinessTabNavigator />
        ) : role === "influencer" ? (
          <InfluencerTabNavigator />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
    </>
  );
}
