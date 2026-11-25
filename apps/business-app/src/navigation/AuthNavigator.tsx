import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import AuthScreen from "../screens/auth/AuthScreen";

export type AuthRole = "business" | "influencer";

export type AuthStackParamList = {
  Welcome: undefined;
  Auth: { mode: "signup" | "login"; role?: AuthRole };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Signed-out flow: welcome reel → sign up / log in.
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
    </Stack.Navigator>
  );
}
