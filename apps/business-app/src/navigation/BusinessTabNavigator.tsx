import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import DashboardScreen from "../screens/business/DashboardScreen";
import CampaignsScreen from "../screens/business/CampaignsScreen";
import MarketingScreen from "../screens/business/MarketingScreen";
import CustomersScreen from "../screens/business/CustomersScreen";
import ReservationsScreen from "../screens/business/ReservationsScreen";
import EventsScreen from "../screens/business/EventsScreen";
import MoreScreen from "../screens/business/MoreScreen";
import { colors } from "@sparkr/ui";

const Tab = createBottomTabNavigator();

const icon = (emoji: string) =>
  ({ color }: { color: string }) => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export default function BusinessTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: icon("🏠") }} />
      <Tab.Screen name="Campaigns" component={CampaignsScreen} options={{ tabBarIcon: icon("📣") }} />
      <Tab.Screen name="Marketing" component={MarketingScreen} options={{ tabBarIcon: icon("🏷️") }} />
      <Tab.Screen name="Customers" component={CustomersScreen} options={{ tabBarIcon: icon("👥") }} />
      <Tab.Screen name="Reservations" component={ReservationsScreen} options={{ tabBarIcon: icon("📅") }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ tabBarIcon: icon("🎫") }} />
      <Tab.Screen name="More" component={MoreScreen} options={{ tabBarIcon: icon("⋯") }} />
    </Tab.Navigator>
  );
}
