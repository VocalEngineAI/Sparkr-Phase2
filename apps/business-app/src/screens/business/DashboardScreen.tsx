import React from "react";
import { ScrollView, View } from "react-native";
import Text from "../../components/Text";

// Mocked data — replace with real wallet/campaign queries once the backend exists.
const mockWalletBalance = 482.5;
const mockActiveCampaigns = [
  { id: "1", title: "Fall Tasting Menu", slotsFilled: 3, slotsTotal: 5, type: "Paid" as const },
  { id: "2", title: "Secret Menu Launch", slotsFilled: 5, slotsTotal: 5, type: "Barter" as const },
];
const mockAlerts = [
  "1 influencer post is due for review",
  "Unpaid campaign: pay within 72 hours to avoid a reminder flag",
];

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-10">
        <Text className="text-2xl font-bold text-text mb-6">Dashboard</Text>

        <View className="bg-primary rounded-2xl p-5 mb-6">
          <Text className="text-primaryLight text-sm mb-1">Wallet balance</Text>
          <Text className="text-white text-3xl font-bold">
            ${mockWalletBalance.toFixed(2)}
          </Text>
        </View>

        <Text className="text-lg font-semibold text-text mb-3">Active campaigns</Text>
        {mockActiveCampaigns.map((c) => (
          <View
            key={c.id}
            className="bg-surface rounded-xl p-4 mb-3 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-base font-medium text-text">{c.title}</Text>
              <Text className="text-sm text-textMuted">
                {c.slotsFilled}/{c.slotsTotal} slots · {c.type}
              </Text>
            </View>
          </View>
        ))}

        <Text className="text-lg font-semibold text-text mb-3 mt-4">Needs attention</Text>
        {mockAlerts.map((a) => (
          <View key={a} className="bg-warning/10 border border-warning rounded-xl p-4 mb-3">
            <Text className="text-sm text-warning">{a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
