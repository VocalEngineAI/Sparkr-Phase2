import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import CreateAccountScreen from "../screens/auth/CreateAccountScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import FillProfileScreen from "../screens/auth/FillProfileScreen";
import CreatePinScreen from "../screens/auth/CreatePinScreen";

export type AuthRole = "business" | "influencer";

export type AuthStackParamList = {
  Welcome: undefined;
  CreateAccount: undefined;
  Login: undefined;
  FillProfile: { role: AuthRole; email: string };
  CreatePin: { role: AuthRole };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Signed-out flow: welcome reel → sign up (→ profile → PIN), or log in from there.
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="FillProfile" component={FillProfileScreen} />
      <Stack.Screen name="CreatePin" component={CreatePinScreen} />
    </Stack.Navigator>
  );
}
