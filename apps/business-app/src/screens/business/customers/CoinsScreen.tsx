import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusiness, mockCoinLedger, mockCoinSettings, mockTopUpPackages } from "@sparkr/shared";
import {
  Button,
  Card,
  InfoBanner,
  ListCard,
  ListRow,
  money,
  Screen,
  Section,
  StatGrid,
  SwitchRow,
  Text,
} from "../../../components/business/kit";
import type { CustomersScreenProps } from "../../../navigation/businessTypes";

// Feature 14: business-only coins (1 coin = $1 here), configurable reward rate, cashier
// QR scan to earn/redeem, part-payment, 1-year expiry with SMS reminder, full ledger.
// Plus the optional customer wallet top-up packages (slide 36), paid straight to the
// business — Sparkr never holds the funds.

const RATES = [5, 10, 15, 20];

export default function CoinsScreen({ navigation }: CustomersScreenProps<"Coins">) {
  const [rate, setRate] = useState(mockCoinSettings.rewardRatePct);
  const [reminder, setReminder] = useState(mockCoinSettings.expiryReminder);
  const [topUps, setTopUps] = useState(true);

  return (
    <Screen>
      <Card tone="primary">
        <Text className="text-sm text-primaryLight">Coins outstanding</Text>
        <Text className="text-3xl font-extrabold text-background mt-1">
          {mockBusiness.coinsOutstanding.toLocaleString("en-US")}
        </Text>
        <Text className="text-xs text-primaryLight mt-1">
          Worth {money(mockBusiness.coinsOutstanding)} at Tang Sushie only · can't be cashed out
        </Text>
        <Button variant="secondary" className="mt-4" onPress={() => navigation.navigate("CoinScanner")}>
          <Ionicons name="qr-code-outline" size={18} color={colors.text} />
          <Text>Scan customer QR</Text>
        </Button>
      </Card>

      <StatGrid
        items={[
          { label: "Issued this month", value: mockCoinSettings.issuedThisMonth.toLocaleString("en-US") },
          { label: "Redeemed this month", value: mockCoinSettings.redeemedThisMonth.toLocaleString("en-US") },
        ]}
      />

      <Section title="Reward rate">
        <Card>
          <View className="flex-row gap-2">
            {RATES.map((r) => (
              <Button
                key={r}
                size="sm"
                variant={rate === r ? "default" : "secondary"}
                className="flex-1"
                onPress={() => setRate(r)}
                accessibilityState={{ selected: rate === r }}
              >
                <Text>{r}%</Text>
              </Button>
            ))}
          </View>
          <Text className="text-sm text-textMuted mt-3">
            A $100 purchase earns {rate} coins (${rate}). Coins can pay part of a bill, e.g. $20 in coins + $30 in money on a $50 bill.
          </Text>
        </Card>
      </Section>

      <Section title="Expiry">
        <ListCard>
          <ListRow icon="hourglass-outline" title="Coins expire after 1 year" subtitle="From the day they're earned" chevron={false} />
          <SwitchRow
            icon="chatbubble-outline"
            title="SMS expiry reminder"
            description="14 days before coins expire"
            value={reminder}
            onValueChange={setReminder}
            last
          />
        </ListCard>
      </Section>

      <Section title="Customer wallet top-ups">
        <ListCard className="mb-3">
          <SwitchRow
            icon="wallet-outline"
            title="Let members top up a wallet"
            description="Balance can only be spent at Tang Sushie. Payment goes straight to you."
            value={topUps}
            onValueChange={setTopUps}
            last
          />
        </ListCard>
        {topUps ? (
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {mockTopUpPackages.map((p) => (
              <Card key={p.id} tone="surface" className="w-[48.5%]">
                <Text className="text-xs text-textMuted">Pay {money(p.pay)}</Text>
                <Text className="text-xl font-extrabold mt-1">Get {money(p.pay + p.bonus)}</Text>
                <Text className="text-xs text-success font-semibold mt-1">+{money(p.bonus)} reward</Text>
              </Card>
            ))}
          </View>
        ) : null}
      </Section>

      <Section title="Coin ledger">
        <ListCard>
          {mockCoinLedger.map((l, i) => (
            <ListRow
              key={l.id}
              icon={l.kind === "earn" ? "add-circle-outline" : l.kind === "redeem" ? "remove-circle-outline" : "hourglass-outline"}
              iconTone={l.kind === "earn" ? "success" : l.kind === "expire" ? "warning" : "neutral"}
              title={l.customer}
              subtitle={`${l.kind === "earn" ? "Earned" : l.kind === "redeem" ? "Redeemed" : "Expired"}${l.bill ? ` on a ${money(l.bill)} bill` : ""} · ${l.time}`}
              right={
                <Text className={`font-bold ${l.kind === "earn" ? "text-success" : ""}`}>
                  {l.kind === "earn" ? "+" : "−"}
                  {l.coins}
                </Text>
              }
              chevron={false}
              last={i === mockCoinLedger.length - 1}
            />
          ))}
        </ListCard>
      </Section>

      <InfoBanner text="Coins can't be bought with money, used at other businesses, or refunded." />
    </Screen>
  );
}
