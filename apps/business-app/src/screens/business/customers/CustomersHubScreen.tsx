import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusiness, mockCoinSettings, mockSegments, mockTiers } from "@sparkr/shared";
import { Button, FeatureCard, Screen, StatGrid, Text, type IconName } from "../../../components/business/kit";
import type { CustomersScreenProps, CustomersStackParamList } from "../../../navigation/businessTypes";

// Customers: relationships, memberships and loyalty (Features 10–14).
const FEATURES: {
  route: Exclude<keyof CustomersStackParamList, "CustomersHub" | "CustomerDetail" | "CoinScanner">;
  icon: IconName;
  title: string;
  description: string;
}[] = [
  { route: "CustomerDatabase", icon: "people-outline", title: "Customer Database", description: "View all members and their information." },
  { route: "Segments", icon: "funnel-outline", title: "Customer Segments", description: "Filter by birthdays, check-ins, inactive customers and more." },
  { route: "ImportCustomers", icon: "cloud-upload-outline", title: "Import Customers", description: "Upload CSV files and send welcome messages." },
  { route: "MembershipCards", icon: "card-outline", title: "Memberships & Cards", description: "Manage your business-branded membership card." },
  { route: "MembershipTiers", icon: "ribbon-outline", title: "Membership Tiers", description: "Bronze, Silver and Gold, plus member promotions." },
  { route: "Coins", icon: "cash-outline", title: "Coins & Rewards", description: "Configure earning rates, redemption and expiry." },
  { route: "CustomerActivity", icon: "pulse-outline", title: "Customer Activity", description: "Membership activity, coins and redemptions." },
];

export default function CustomersHubScreen({ navigation }: CustomersScreenProps<"CustomersHub">) {
  const optedIn = mockSegments.find((s) => s.id === "seg_7")?.count ?? 0;
  const gold = mockTiers.find((t) => t.tier === "gold")?.members ?? 0;

  return (
    <Screen
      hub
      title="Customers"
      subtitle="Members, memberships and loyalty"
      headerRight={
        <Button size="sm" className="rounded-full" onPress={() => navigation.navigate("CoinScanner")}>
          <Ionicons name="qr-code-outline" size={16} color={colors.background} />
          <Text>Scan</Text>
        </Button>
      }
    >
      <StatGrid
        items={[
          { label: "Members", value: mockBusiness.memberCount.toLocaleString("en-US"), changePct: 6 },
          { label: "SMS opted in", value: optedIn.toLocaleString("en-US"), hint: `${Math.round((optedIn / mockBusiness.memberCount) * 100)}% of members` },
          { label: "Coins outstanding", value: mockBusiness.coinsOutstanding.toLocaleString("en-US"), hint: `${mockCoinSettings.rewardRatePct}% reward rate` },
          { label: "Gold members", value: String(gold), hint: "Top tier" },
        ]}
      />
      <View className="gap-3">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.route}
            icon={f.icon}
            title={f.title}
            description={f.description}
            onPress={() => navigation.navigate(f.route)}
          />
        ))}
      </View>
    </Screen>
  );
}
