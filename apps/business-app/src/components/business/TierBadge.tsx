import React from "react";
import { View } from "react-native";
import type { MembershipTier } from "@sparkr/shared";
import { Text } from "../ui/text";

// Bronze / Silver / Gold chip. Tier colours are fixed metal tints (not brand tokens), with
// ink text so they stay readable on white.
export const TIER_COLORS: Record<MembershipTier, string> = {
  bronze: "#E7C3A1",
  silver: "#D9DDE3",
  gold: "#F4D77A",
};

export const TIER_LABEL: Record<MembershipTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
};

export default function TierBadge({ tier }: { tier: MembershipTier }) {
  return (
    <View className="self-start rounded-full px-2 py-0.5" style={{ backgroundColor: TIER_COLORS[tier] }}>
      <Text className="text-[11px] font-semibold">{TIER_LABEL[tier]}</Text>
    </View>
  );
}
