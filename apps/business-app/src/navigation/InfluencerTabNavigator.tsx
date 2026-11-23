import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import HomeScreen from "../screens/influencer/HomeScreen";
import DiscoverScreen from "../screens/influencer/DiscoverScreen";
import CampaignsScreen from "../screens/influencer/CampaignsScreen";
import MoreScreen from "../screens/influencer/MoreScreen";
import { colors } from "@sparkr/ui";

const Tab = createBottomTabNavigator();

const icon = (emoji: string) =>
  ({ color }: { color: string }) => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export default function InfluencerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon("🏠") }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ tabBarIcon: icon("🔍") }} />
      <Tab.Screen name="Campaigns" component={CampaignsScreen} options={{ tabBarIcon: icon("📣") }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ tabBarIcon: icon("⋯") }} />
    </Tab.Navigator>
  );
}
