import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockCoinLedger, mockCustomerActivity, mockCustomers } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ListCard,
  ListRow,
  money,
  notYet,
  Screen,
  Section,
  StatGrid,
  Text,
} from "../../../components/business/kit";
import TierBadge from "../../../components/business/TierBadge";
import type { CustomersScreenProps } from "../../../navigation/businessTypes";

// One member's record: contact details, birthday, coins, tier, SMS consent and in-app
// history (visits, coins, redemptions).

const SOURCE = {
  app: "Joined in the Sparkr app",
  nfc: "Joined by NFC tap",
  import: "Imported from CSV",
  influencer: "Joined via an influencer link",
} as const;

export default function CustomerDetailScreen({ route, navigation }: CustomersScreenProps<"CustomerDetail">) {
  const c = mockCustomers.find((x) => x.id === route.params.customerId);
  if (!c) return <EmptyState icon="person-outline" title="Member not found" />;

  const history = [
    ...mockCustomerActivity.filter((a) => a.customer === c.name).map((a) => ({ id: a.id, title: a.detail, time: a.time })),
    ...mockCoinLedger
      .filter((l) => l.customer === c.name)
      .map((l) => ({
        id: l.id,
        title: `${l.kind === "earn" ? "Earned" : l.kind === "redeem" ? "Redeemed" : "Expired"} ${l.coins} coins${l.bill ? ` · ${money(l.bill)} bill` : ""}`,
        time: l.time,
      })),
  ];
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <Screen>
      <View className="items-center">
        <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
          <Text className="text-2xl font-bold text-background">{initials}</Text>
        </View>
        <Text className="text-2xl font-extrabold mt-3">{c.name}</Text>
        <View className="flex-row items-center gap-2 mt-1.5">
          <TierBadge tier={c.tier} />
          <Badge label={c.smsOptIn ? "SMS opted in" : "No SMS consent"} tone={c.smsOptIn ? "success" : "neutral"} />
        </View>
        <Text className="text-xs text-textMuted mt-2">
          {SOURCE[c.source]} · member since {c.joined}
        </Text>
      </View>

      <StatGrid
        items={[
          { label: "Coin balance", value: String(c.coins), hint: `= ${money(c.coins)} here` },
          { label: "Visits", value: String(c.visits), hint: `Last: ${c.lastVisit}` },
          { label: "12-month spend", value: money(c.spend12m) },
          { label: "Birthday", value: c.birthday },
        ]}
      />

      <Section title="Contact">
        <ListCard>
          <ListRow icon="call-outline" title={c.phone} subtitle="Used for SMS only, never shown on the card" chevron={false} />
          <ListRow icon="mail-outline" title={c.email} chevron={false} last />
        </ListCard>
      </Section>

      {c.notes ? (
        <Section title="Notes">
          <Card tone="surface">
            <Text className="text-sm">{c.notes}</Text>
          </Card>
        </Section>
      ) : null}

      <View className="flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          disabled={!c.smsOptIn}
          onPress={() => navigation.getParent()?.navigate("Marketing", { screen: "Messaging", initial: false })}
        >
          <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
          <Text>Send SMS</Text>
        </Button>
        <Button className="flex-1" onPress={() => notYet("Adjust coins", "Add or remove coins with a reason; every change is logged.")}>
          <Ionicons name="cash-outline" size={16} color={colors.background} />
          <Text>Adjust coins</Text>
        </Button>
      </View>

      <Section title="History">
        {history.length === 0 ? (
          <Text className="text-sm text-textMuted">No activity yet.</Text>
        ) : (
          <ListCard>
            {history.map((h, i) => (
              <ListRow key={h.id} title={h.title} subtitle={h.time} chevron={false} last={i === history.length - 1} />
            ))}
          </ListCard>
        )}
      </Section>
    </Screen>
  );
}
