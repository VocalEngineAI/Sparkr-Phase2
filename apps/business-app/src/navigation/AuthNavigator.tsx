import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import ChooseRoleScreen from "../screens/auth/ChooseRoleScreen";
import CreateAccountScreen from "../screens/auth/CreateAccountScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import FillProfileScreen from "../screens/auth/FillProfileScreen";
import CapturePhotoScreen from "../screens/auth/CapturePhotoScreen";
import CreatePinScreen from "../screens/auth/CreatePinScreen";

export type AuthRole = "business" | "influencer";

export type AuthStackParamList = {
  Welcome: undefined;
  ChooseRole: undefined;
  CreateAccount: { role: AuthRole };
  Login: { role: AuthRole };
  ForgotPassword: { role: AuthRole };
  // One code screen for both sign-up and password reset; `purpose` picks where it goes next.
  VerifyEmail: { role: AuthRole; email: string; purpose?: "signup" | "reset" };
  ResetPassword: { role: AuthRole; email: string };
  FillProfile: { role: AuthRole; email: string; photoUri?: string };
  CapturePhoto: { role: AuthRole; email: string }; // echoed back to FillProfile with the photo
  CreatePin: { role: AuthRole };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Signed-out flow: welcome reel → pick account type → sign up → verify email → profile
// (→ camera for the photo) → PIN. Login branches off from sign-up.
export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ChooseRole" component={ChooseRoleScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="FillProfile" component={FillProfileScreen} />
      <Stack.Screen
        name="CapturePhoto"
        component={CapturePhotoScreen}
        options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="CreatePin" component={CreatePinScreen} />
    </Stack.Navigator>
  );
}
