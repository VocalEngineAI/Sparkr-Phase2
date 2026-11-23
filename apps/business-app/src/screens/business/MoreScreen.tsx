import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

const items = [
  "Wallet & billing / invoices",
  "NFC tag management",
  "Analytics & influencer ROI",
  "Business profile settings",
];

export default function MoreScreen() {
  const { signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-10">
        <Text className="text-2xl font-bold text-text mb-6">More</Text>

        {items.map((item) => (
          <View key={item} className="bg-surface rounded-xl p-4 mb-3">
            <Text className="text-sm text-text">{item}</Text>
          </View>
        ))}

        <Pressable
          onPress={signOut}
          className="mt-6 border border-border rounded-xl py-4 items-center active:opacity-80"
        >
          <Text className="text-accent font-semibold">Switch role / Sign out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
