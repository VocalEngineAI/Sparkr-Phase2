import React from "react";
import { DefaultTheme, NavigationContainer, Theme } from "@react-navigation/native";
import { colors } from "@sparkr/ui";
import { useAuth } from "../context/AuthContext";
import RoleSelectScreen from "../screens/auth/RoleSelectScreen";
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
  fonts: {
    regular: { fontFamily: "DMSans_400Regular", fontWeight: "normal" },
    medium: { fontFamily: "DMSans_500Medium", fontWeight: "normal" },
    bold: { fontFamily: "DMSans_700Bold", fontWeight: "normal" },
    heavy: { fontFamily: "DMSans_700Bold", fontWeight: "normal" },
  },
};

export default function RootNavigator() {
  const { role } = useAuth();

  return (
    <NavigationContainer theme={navTheme}>
      {role === "business" ? (
        <BusinessTabNavigator />
      ) : role === "influencer" ? (
        <InfluencerTabNavigator />
      ) : (
        <RoleSelectScreen />
      )}
    </NavigationContainer>
  );
}
