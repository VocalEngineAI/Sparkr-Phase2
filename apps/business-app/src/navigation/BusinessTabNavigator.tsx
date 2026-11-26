import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import HomeScreen from "../screens/business/HomeScreen";
import MarketingScreen from "../screens/business/MarketingScreen";
import CustomersScreen from "../screens/business/CustomersScreen";
import BookingsScreen from "../screens/business/BookingsScreen";
import MoreScreen from "../screens/business/MoreScreen";

// Marketing covers campaigns, reviews, social, SMS, vouchers, deals and posts (Features 1–9);
// Bookings covers reservations/waitlist (16) and events & tickets.
export type BusinessTabParamList = {
  Home: undefined;
  Marketing: undefined;
  Customers: undefined;
  Bookings: undefined;
  More: undefined;
};

type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Filled glyph for the active tab, outline for the rest (iOS/Material convention).
const TAB_ICONS: Record<keyof BusinessTabParamList, [IconName, IconName]> = {
  Home: ["home", "home-outline"],
  Marketing: ["megaphone", "megaphone-outline"],
  Customers: ["people", "people-outline"],
  Bookings: ["calendar", "calendar-outline"],
  More: ["ellipsis-horizontal-circle", "ellipsis-horizontal-circle-outline"],
};

const Tab = createBottomTabNavigator<BusinessTabParamList>();

export default function BusinessTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontFamily: "DMSans_500Medium", fontSize: 11 },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketing" component={MarketingScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
