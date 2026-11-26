import type { NavigatorScreenParams, CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Each business tab (except Home) is a native stack: a hub screen listing the tab's
// features, then one screen per feature. Kept in its own file so screens can import the
// types without importing the navigators (which import the screens).

export type MarketingStackParamList = {
  MarketingHub: undefined;
  Campaigns: undefined;
  Analytics: undefined;
  Google: undefined;
  Social: undefined;
  Messaging: undefined;
  Vouchers: undefined;
  Deals: undefined;
  Posts: undefined;
};

export type CustomersStackParamList = {
  CustomersHub: undefined;
  CustomerDatabase: undefined;
  CustomerDetail: { customerId: string };
  Segments: undefined;
  ImportCustomers: undefined;
  MembershipCards: undefined;
  MembershipTiers: undefined;
  Coins: undefined;
  CoinScanner: undefined;
  CustomerActivity: undefined;
};

export type BookingsStackParamList = {
  BookingsHub: undefined;
  Reservations: undefined;
  ReservationSettings: undefined;
  Events: undefined;
  EventDetail: { eventId: string };
  TicketScanner: { eventId?: string } | undefined;
};

export type MoreStackParamList = {
  MoreHub: undefined;
  Wallet: undefined;
  OneTab: undefined;
  BusinessProfile: undefined;
  Settings: undefined;
  Help: undefined;
};

export type BusinessTabParamList = {
  Home: undefined;
  Marketing: NavigatorScreenParams<MarketingStackParamList>;
  Customers: NavigatorScreenParams<CustomersStackParamList>;
  Bookings: NavigatorScreenParams<BookingsStackParamList>;
  More: NavigatorScreenParams<MoreStackParamList>;
};

type Tab<T extends keyof BusinessTabParamList> = BottomTabScreenProps<BusinessTabParamList, T>;

export type MarketingScreenProps<S extends keyof MarketingStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<MarketingStackParamList, S>,
  Tab<"Marketing">
>;
export type CustomersScreenProps<S extends keyof CustomersStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<CustomersStackParamList, S>,
  Tab<"Customers">
>;
export type BookingsScreenProps<S extends keyof BookingsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<BookingsStackParamList, S>,
  Tab<"Bookings">
>;
export type MoreScreenProps<S extends keyof MoreStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<MoreStackParamList, S>,
  Tab<"More">
>;
export type HomeScreenProps = Tab<"Home">;
