import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusiness } from "@sparkr/shared";
import { InfoBanner, ListCard, Screen, Section, SwitchRow, Text } from "../../../components/business/kit";
import { TIER_COLORS } from "../../../components/business/TierBadge";

// Feature 12: the business-branded virtual card (logo, colours; name, birthday, coin
// balance, QR, tier). The design is fixed — info can only be added or removed. Joining is
// free; each business chooses which details it asks for.

type CardField = "name" | "birthday" | "coins" | "tier" | "qr";

export default function MembershipCardsScreen() {
  const [fields, setFields] = useState<Record<CardField, boolean>>({
    name: true,
    birthday: true,
    coins: true,
    tier: true,
    qr: true,
  });
  const [ask, setAsk] = useState({ name: true, phone: true, email: true, dob: true });

  const set = (k: CardField) => (v: boolean) => setFields((f) => ({ ...f, [k]: v }));

  return (
    <Screen>
      <Section title="Card preview">
        <View className="bg-primary rounded-3xl p-5 aspect-[1.6]">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-9 h-9 rounded-full bg-background items-center justify-center">
                <Text className="font-extrabold text-sm">TS</Text>
              </View>
              <Text className="font-bold text-background">{mockBusiness.name}</Text>
            </View>
            {fields.tier ? (
              <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: TIER_COLORS.gold }}>
                <Text className="text-xs font-bold">Gold</Text>
              </View>
            ) : null}
          </View>

          <View className="flex-1" />

          <View className="flex-row items-end justify-between">
            <View>
              {fields.name ? <Text className="text-xl font-bold text-background">Maya Rodriguez</Text> : null}
              {fields.birthday ? <Text className="text-xs text-primaryLight mt-0.5">Birthday · Dec 4</Text> : null}
              {fields.coins ? (
                <Text className="text-sm font-semibold text-background mt-2">86 coins · $86</Text>
              ) : null}
            </View>
            {fields.qr ? (
              <View className="bg-background rounded-xl p-2">
                <Ionicons name="qr-code" size={44} color={colors.text} />
              </View>
            ) : null}
          </View>
        </View>
        <Text className="text-xs text-textMuted mt-2">
          Uses your logo and brand colour. Updates in real time as coins and tier change.
        </Text>
      </Section>

      <Section title="Shown on the card">
        <ListCard>
          <SwitchRow title="Member name" value={fields.name} onValueChange={set("name")} />
          <SwitchRow title="Birthday" value={fields.birthday} onValueChange={set("birthday")} />
          <SwitchRow title="Coin balance" value={fields.coins} onValueChange={set("coins")} />
          <SwitchRow title="Tier" value={fields.tier} onValueChange={set("tier")} />
          <SwitchRow title="QR code" description="Scanned at checkout to earn and redeem coins" value={fields.qr} onValueChange={set("qr")} last />
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">Phone numbers are never shown on the card.</Text>
      </Section>

      <Section title="Details you ask for when members join">
        <ListCard>
          <SwitchRow title="Name" value={ask.name} onValueChange={(v) => setAsk((a) => ({ ...a, name: v }))} />
          <SwitchRow title="Phone" value={ask.phone} onValueChange={(v) => setAsk((a) => ({ ...a, phone: v }))} />
          <SwitchRow title="Email" value={ask.email} onValueChange={(v) => setAsk((a) => ({ ...a, email: v }))} />
          <SwitchRow title="Date of birth" value={ask.dob} onValueChange={(v) => setAsk((a) => ({ ...a, dob: v }))} last />
        </ListCard>
      </Section>

      <InfoBanner text="Customers register once in Sparkr. “Become a Member” reuses their saved details, so joining is one tap and always free." />
    </Screen>
  );
}
