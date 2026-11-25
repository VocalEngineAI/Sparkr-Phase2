import React from "react";
import { ScrollView, Text, View } from "react-native";

// Mocked data — replace with real queries once the backend exists.
const mockBalance = 128.0;
const mockPending = 60.0;
const mockActions = ["Post due in 3 days — Fall Tasting Menu visit"];
const mockCampaigns = [
  { id: "1", title: "Fall Tasting Menu", business: "Bistro 22", status: "Scheduled" },
  { id: "2", title: "Secret Menu Launch", business: "Noodle House", status: "Posted" },
];

export default function InfluencerHomeScreen() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-10">
        <Text className="text-2xl font-bold text-text mb-6">Home</Text>

        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-primary rounded-2xl p-5">
            <Text className="text-primaryLight text-sm mb-1">Balance</Text>
            <Text className="text-white text-2xl font-bold">
              ${mockBalance.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 bg-surface rounded-2xl p-5">
            <Text className="text-textMuted text-sm mb-1">Pending</Text>
            <Text className="text-text text-2xl font-bold">
              ${mockPending.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text className="text-lg font-semibold text-text mb-3">Action required</Text>
        {mockActions.map((a) => (
          <View key={a} className="bg-warning/10 border border-warning rounded-xl p-4 mb-3">
            <Text className="text-sm text-warning">{a}</Text>
          </View>
        ))}

        <Text className="text-lg font-semibold text-text mb-3 mt-4">My campaigns</Text>
        {mockCampaigns.map((c) => (
          <View
            key={c.id}
            className="bg-surface rounded-xl p-4 mb-3 flex-row items-center justify-between"
          >
            <View>
              <Text className="text-base font-medium text-text">{c.title}</Text>
              <Text className="text-sm text-textMuted">{c.business}</Text>
            </View>
            <Text className="text-sm font-medium text-primary">{c.status}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
