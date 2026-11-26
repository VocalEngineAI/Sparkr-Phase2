import React from "react";
import { Alert, View } from "react-native";
import { mockBusiness, mockOneTab } from "@sparkr/shared";
import { useAuth } from "../../../context/AuthContext";
import { Card, ListCard, ListRow, money, Screen, Text } from "../../../components/business/kit";
import type { MoreScreenProps } from "../../../navigation/businessTypes";

// Account-level and remaining business-management features.

export default function MoreHubScreen({ navigation }: MoreScreenProps<"MoreHub">) {
  const { signOut } = useAuth();

  const logout = () =>
    Alert.alert("Log out?", "You'll need to log in again to manage Tang Sushie.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);

  return (
    <Screen hub title="More">
      <Card tone="surface" className="flex-row items-center">
        <View className="w-14 h-14 rounded-full bg-primary items-center justify-center mr-3">
          <Text className="text-lg font-bold text-background">TS</Text>
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold">{mockBusiness.name}</Text>
          <Text className="text-sm text-textMuted">
            {mockBusiness.ownerName} · Owner
          </Text>
        </View>
      </Card>

      <ListCard>
        <ListRow
          icon="wallet-outline"
          title="Business Wallet"
          subtitle="Balance, top-ups, transactions and invoices"
          right={<Text className="font-bold">{money(mockBusiness.walletBalance, true)}</Text>}
          onPress={() => navigation.navigate("Wallet")}
        />
        <ListRow
          icon="phone-portrait-outline"
          title="One-Tab Landing Page"
          subtitle={mockOneTab.status === "live" ? "Live · NFC tags active" : "Set up your landing page"}
          onPress={() => navigation.navigate("OneTab")}
        />
        <ListRow
          icon="storefront-outline"
          title="Business Profile"
          subtitle="Info, logo & photos, hours and branches"
          onPress={() => navigation.navigate("BusinessProfile")}
        />
        <ListRow
          icon="settings-outline"
          title="Settings"
          subtitle="Account, notifications, language and connections"
          onPress={() => navigation.navigate("Settings")}
        />
        <ListRow
          icon="help-buoy-outline"
          title="Help & Support"
          subtitle="User guide, FAQs, disputes and contact"
          onPress={() => navigation.navigate("Help")}
          last
        />
      </ListCard>

      <ListCard>
        <ListRow icon="log-out-outline" title="Log out" destructive chevron={false} onPress={logout} last />
      </ListCard>
    </Screen>
  );
}
