import React, { useState } from "react";
import { Alert, View } from "react-native";
import { mockBusiness, mockInvoices, mockWalletSpend, mockWalletTopUps, mockWalletTransactions, type WalletTransaction } from "@sparkr/shared";
import {
  Button,
  Card,
  InfoBanner,
  ListCard,
  ListRow,
  money,
  notYet,
  ProgressBar,
  Screen,
  Section,
  Segmented,
  Text,
  type IconName,
} from "../../../components/business/kit";

// Business wallet (slides 10, 47): non-refundable top-ups fund campaigns, add-ons, SMS
// bundles, sponsored placements and AI features. Every top-up and charge is invoiced.

const KIND_ICON: Record<WalletTransaction["kind"], IconName> = {
  topup: "add-circle-outline",
  campaign: "megaphone-outline",
  sms: "chatbubbles-outline",
  ai: "sparkles-outline",
  addon: "extension-puzzle-outline",
  sponsored: "rocket-outline",
};

export default function WalletScreen() {
  const [amount, setAmount] = useState(mockWalletTopUps[1]);
  const [filter, setFilter] = useState<"all" | "topups" | "spend">("all");

  const spendTotal = mockWalletSpend.reduce((n, s) => n + s.amount, 0);
  const topSpend = Math.max(...mockWalletSpend.map((s) => s.amount));
  const tx = mockWalletTransactions.filter((t) =>
    filter === "all" ? true : filter === "topups" ? t.amount > 0 : t.amount < 0
  );

  const topUp = () =>
    Alert.alert("Top up wallet", `Add ${money(amount)} to your Sparkr wallet? Top-ups are non-refundable.`, [
      { text: "Cancel", style: "cancel" },
      { text: `Pay ${money(amount)}`, onPress: () => notYet("Payment", "Card payment connects with the backend.") },
    ]);

  return (
    <Screen>
      <Card tone="primary">
        <Text className="text-sm text-primaryLight">Wallet balance</Text>
        <Text className="text-4xl font-extrabold text-background mt-1">{money(mockBusiness.walletBalance, true)}</Text>
        <Text className="text-xs text-primaryLight mt-1">Spent this month: {money(spendTotal)}</Text>
      </Card>

      <Section title="Top up">
        <View className="flex-row gap-2">
          {mockWalletTopUps.map((a) => (
            <Button
              key={a}
              variant={amount === a ? "default" : "secondary"}
              className="flex-1 px-1"
              onPress={() => setAmount(a)}
              accessibilityState={{ selected: amount === a }}
            >
              <Text>{money(a)}</Text>
            </Button>
          ))}
        </View>
        <Button size="lg" className="mt-3" onPress={topUp}>
          <Text>Top up {money(amount)}</Text>
        </Button>
        <Text className="text-xs text-textMuted mt-2">
          Top-ups are non-refundable. Your balance pays for campaigns, add-ons, SMS bundles and AI features.
        </Text>
      </Section>

      <Section title="Campaign & add-on spending" subtitle="This month">
        <Card>
          <View className="gap-3">
            {mockWalletSpend.map((s) => (
              <View key={s.label}>
                <View className="flex-row justify-between">
                  <Text className="text-sm">{s.label}</Text>
                  <Text className="text-sm font-semibold">{money(s.amount)}</Text>
                </View>
                <ProgressBar pct={(s.amount / topSpend) * 100} className="mt-1.5" />
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <Section title="Transactions">
        <Segmented
          options={[
            ["all", "All"],
            ["topups", "Top-ups"],
            ["spend", "Spend"],
          ]}
          value={filter}
          onChange={setFilter}
          className="mb-3"
        />
        <ListCard>
          {tx.map((t, i) => (
            <ListRow
              key={t.id}
              icon={KIND_ICON[t.kind]}
              iconTone={t.amount > 0 ? "success" : "neutral"}
              title={t.title}
              subtitle={t.date}
              right={<Text className={`font-bold ${t.amount > 0 ? "text-success" : ""}`}>{t.amount > 0 ? "+" : ""}{money(t.amount, true)}</Text>}
              chevron={false}
              last={i === tx.length - 1}
            />
          ))}
        </ListCard>
      </Section>

      <Section title="Invoices">
        <ListCard>
          {mockInvoices.map((inv, i) => (
            <ListRow
              key={inv.id}
              icon="document-text-outline"
              title={inv.number}
              subtitle={`${inv.date} · ${inv.description}`}
              right={<Text className="font-semibold">{money(inv.amount, true)}</Text>}
              onPress={() => notYet(inv.number, "Opens the PDF invoice.")}
              last={i === mockInvoices.length - 1}
            />
          ))}
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">Every top-up, spend and charge is invoiced automatically.</Text>
      </Section>

      <InfoBanner text="Unpaid campaigns past 72 hours show up as reminders on your dashboard." />
    </Screen>
  );
}
