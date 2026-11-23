import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import RoleSelectScreen from "../screens/auth/RoleSelectScreen";
import BusinessTabNavigator from "./BusinessTabNavigator";
import InfluencerTabNavigator from "./InfluencerTabNavigator";

export default function RootNavigator() {
  const { role } = useAuth();

  return (
    <NavigationContainer>
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
