import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator, type NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type {
  BookingsStackParamList,
  BusinessTabParamList,
  CustomersStackParamList,
  MarketingStackParamList,
  MoreStackParamList,
} from "./businessTypes";

import HomeScreen from "../screens/business/HomeScreen";

import MarketingHubScreen from "../screens/business/marketing/MarketingHubScreen";
import CampaignsScreen from "../screens/business/marketing/CampaignsScreen";
import AnalyticsScreen from "../screens/business/marketing/AnalyticsScreen";
import GoogleScreen from "../screens/business/marketing/GoogleScreen";
import SocialScreen from "../screens/business/marketing/SocialScreen";
import MessagingScreen from "../screens/business/marketing/MessagingScreen";
import VouchersScreen from "../screens/business/marketing/VouchersScreen";
import DealsScreen from "../screens/business/marketing/DealsScreen";
import PostsScreen from "../screens/business/marketing/PostsScreen";

import CustomersHubScreen from "../screens/business/customers/CustomersHubScreen";
import CustomerDatabaseScreen from "../screens/business/customers/CustomerDatabaseScreen";
import CustomerDetailScreen from "../screens/business/customers/CustomerDetailScreen";
import SegmentsScreen from "../screens/business/customers/SegmentsScreen";
import ImportCustomersScreen from "../screens/business/customers/ImportCustomersScreen";
import MembershipCardsScreen from "../screens/business/customers/MembershipCardsScreen";
import MembershipTiersScreen from "../screens/business/customers/MembershipTiersScreen";
import CoinsScreen from "../screens/business/customers/CoinsScreen";
import CoinScannerScreen from "../screens/business/customers/CoinScannerScreen";
import CustomerActivityScreen from "../screens/business/customers/CustomerActivityScreen";

import BookingsHubScreen from "../screens/business/bookings/BookingsHubScreen";
import ReservationsScreen from "../screens/business/bookings/ReservationsScreen";
import ReservationSettingsScreen from "../screens/business/bookings/ReservationSettingsScreen";
import EventsScreen from "../screens/business/bookings/EventsScreen";
import EventDetailScreen from "../screens/business/bookings/EventDetailScreen";
import TicketScannerScreen from "../screens/business/bookings/TicketScannerScreen";

import MoreHubScreen from "../screens/business/more/MoreHubScreen";
import WalletScreen from "../screens/business/more/WalletScreen";
import OneTabScreen from "../screens/business/more/OneTabScreen";
import BusinessProfileScreen from "../screens/business/more/BusinessProfileScreen";
import SettingsScreen from "../screens/business/more/SettingsScreen";
import HelpScreen from "../screens/business/more/HelpScreen";

export type { BusinessTabParamList } from "./businessTypes";

// Native header for feature screens (hub screens hide it and draw a large title).
const stackOptions: NativeStackNavigationOptions = {
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerTitleStyle: { fontFamily: "DMSans_700Bold", fontSize: 17 },
  headerBackButtonDisplayMode: "minimal",
  headerStyle: { backgroundColor: colors.background },
  contentStyle: { backgroundColor: colors.background },
};
const hub = { headerShown: false } as const;
const scanner = { headerShown: false, presentation: "fullScreenModal", animation: "slide_from_bottom" } as const;

const Marketing = createNativeStackNavigator<MarketingStackParamList>();
function MarketingStack() {
  return (
    <Marketing.Navigator screenOptions={stackOptions}>
      <Marketing.Screen name="MarketingHub" component={MarketingHubScreen} options={hub} />
      <Marketing.Screen name="Campaigns" component={CampaignsScreen} options={{ title: "Influencer Campaigns" }} />
      <Marketing.Screen name="Analytics" component={AnalyticsScreen} options={{ title: "Analytics & ROI" }} />
      <Marketing.Screen name="Google" component={GoogleScreen} options={{ title: "Google Management" }} />
      <Marketing.Screen name="Social" component={SocialScreen} options={{ title: "Social Media" }} />
      <Marketing.Screen name="Messaging" component={MessagingScreen} options={{ title: "SMS & Picture Messages" }} />
      <Marketing.Screen name="Vouchers" component={VouchersScreen} options={{ title: "Vouchers & Gift Cards" }} />
      <Marketing.Screen name="Deals" component={DealsScreen} options={{ title: "Happy Hours & Deals" }} />
      <Marketing.Screen name="Posts" component={PostsScreen} options={{ title: "Business Posts" }} />
    </Marketing.Navigator>
  );
}

const Customers = createNativeStackNavigator<CustomersStackParamList>();
function CustomersStack() {
  return (
    <Customers.Navigator screenOptions={stackOptions}>
      <Customers.Screen name="CustomersHub" component={CustomersHubScreen} options={hub} />
      <Customers.Screen name="CustomerDatabase" component={CustomerDatabaseScreen} options={{ title: "Customer Database" }} />
      <Customers.Screen name="CustomerDetail" component={CustomerDetailScreen} options={{ title: "Member" }} />
      <Customers.Screen name="Segments" component={SegmentsScreen} options={{ title: "Customer Segments" }} />
      <Customers.Screen name="ImportCustomers" component={ImportCustomersScreen} options={{ title: "Import Customers" }} />
      <Customers.Screen name="MembershipCards" component={MembershipCardsScreen} options={{ title: "Memberships & Cards" }} />
      <Customers.Screen name="MembershipTiers" component={MembershipTiersScreen} options={{ title: "Membership Tiers" }} />
      <Customers.Screen name="Coins" component={CoinsScreen} options={{ title: "Coins & Rewards" }} />
      <Customers.Screen name="CoinScanner" component={CoinScannerScreen} options={scanner} />
      <Customers.Screen name="CustomerActivity" component={CustomerActivityScreen} options={{ title: "Customer Activity" }} />
    </Customers.Navigator>
  );
}

const Bookings = createNativeStackNavigator<BookingsStackParamList>();
function BookingsStack() {
  return (
    <Bookings.Navigator screenOptions={stackOptions}>
      <Bookings.Screen name="BookingsHub" component={BookingsHubScreen} options={hub} />
      <Bookings.Screen name="Reservations" component={ReservationsScreen} options={{ title: "Reservations & Waitlist" }} />
      <Bookings.Screen name="ReservationSettings" component={ReservationSettingsScreen} options={{ title: "Booking Settings" }} />
      <Bookings.Screen name="Events" component={EventsScreen} options={{ title: "Events & Tickets" }} />
      <Bookings.Screen name="EventDetail" component={EventDetailScreen} options={{ title: "Event" }} />
      <Bookings.Screen name="TicketScanner" component={TicketScannerScreen} options={scanner} />
    </Bookings.Navigator>
  );
}

const More = createNativeStackNavigator<MoreStackParamList>();
function MoreStack() {
  return (
    <More.Navigator screenOptions={stackOptions}>
      <More.Screen name="MoreHub" component={MoreHubScreen} options={hub} />
      <More.Screen name="Wallet" component={WalletScreen} options={{ title: "Business Wallet" }} />
      <More.Screen name="OneTab" component={OneTabScreen} options={{ title: "One-Tab Landing Page" }} />
      <More.Screen name="BusinessProfile" component={BusinessProfileScreen} options={{ title: "Business Profile" }} />
      <More.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
      <More.Screen name="Help" component={HelpScreen} options={{ title: "Help & Support" }} />
    </More.Navigator>
  );
}

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
      <Tab.Screen name="Marketing" component={MarketingStack} />
      <Tab.Screen name="Customers" component={CustomersStack} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
