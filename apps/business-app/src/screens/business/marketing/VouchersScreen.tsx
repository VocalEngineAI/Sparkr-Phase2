import React, { useState } from "react";
import { View } from "react-native";
import { mockGiftCards, mockVouchers, type Voucher } from "@sparkr/shared";
import {
  Actions,
  Badge,
  Button,
  Card,
  InfoBanner,
  money,
  notYet,
  ProgressBar,
  Screen,
  Section,
  Segmented,
  StatGrid,
  Text,
  useHeaderButton,
} from "../../../components/business/kit";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 6: paid or free vouchers redeemed in store by members, and gift cards customers
// buy for friends (shared by link, QR or code). Money goes to the business via Stripe
// Connect; Sparkr takes a default 5% commission.

export default function VouchersScreen({ navigation }: MarketingScreenProps<"Vouchers">) {
  const [tab, setTab] = useState<"vouchers" | "giftcards">("vouchers");
  const [vouchers, setVouchers] = useState(mockVouchers);

  useHeaderButton(navigation, {
    label: "New",
    icon: "add",
    onPress: () =>
      notYet(
        tab === "vouchers" ? "New voucher" : "New gift card",
        tab === "vouchers"
          ? "Set the price and value (or make it free), when it can be used, conditions and validity."
          : "Choose the gift card amount customers can buy."
      ),
  });

  const sold = vouchers.reduce((n, v) => n + v.sold, 0);
  const redeemed = vouchers.reduce((n, v) => n + v.redeemed, 0);
  const revenue = vouchers.reduce((n, v) => n + v.revenue, 0);
  const gcRevenue = mockGiftCards.reduce((n, g) => n + g.revenue, 0);
  const gcSold = mockGiftCards.reduce((n, g) => n + g.sold, 0);
  const gcClaimed = mockGiftCards.reduce((n, g) => n + g.claimed, 0);

  const toggle = (id: string) =>
    setVouchers((list) =>
      list.map((v) => (v.id === id ? { ...v, status: v.status === "active" ? "paused" : "active" } : v))
    );

  return (
    <Screen>
      <Segmented
        options={[
          ["vouchers", "Vouchers"],
          ["giftcards", "Gift cards"],
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "vouchers" ? (
        <>
          <StatGrid
            items={[
              { label: "Sold", value: String(sold) },
              { label: "Redeemed", value: String(redeemed) },
              { label: "Revenue", value: money(revenue) },
              { label: "You receive", value: money(revenue * 0.95), hint: "After 5% Sparkr fee" },
            ]}
          />
          <Section title="Your vouchers">
            <View className="gap-3">
              {vouchers.map((v) => (
                <VoucherCard key={v.id} v={v} onToggle={() => toggle(v.id)} />
              ))}
            </View>
          </Section>
        </>
      ) : (
        <>
          <StatGrid
            items={[
              { label: "Gift cards sold", value: String(gcSold) },
              { label: "Claimed by friends", value: String(gcClaimed) },
              { label: "Revenue", value: money(gcRevenue) },
              { label: "You receive", value: money(gcRevenue * 0.95), hint: "After 5% Sparkr fee" },
            ]}
          />
          <Section title="Gift card amounts">
            <View className="gap-3">
              {mockGiftCards.map((g) => (
                <Card key={g.id}>
                  <View className="flex-row items-center">
                    <View className="w-16 h-11 rounded-lg bg-primary items-center justify-center mr-3">
                      <Text className="font-extrabold text-background">{money(g.amount)}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold">{money(g.amount)} gift card</Text>
                      <Text className="text-xs text-textMuted mt-0.5">
                        {g.sold} sold · {g.claimed} claimed · {money(g.revenue)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </Section>
          <InfoBanner text="Friends claim a gift card by link, QR or code after downloading Sparkr, and can only spend it in store at Tang Sushie." />
        </>
      )}

      <InfoBanner
        icon="card-outline"
        text="Customers pay in the app and the money goes straight to you via Stripe Connect. Sparkr never holds the funds or handles refunds."
      />
    </Screen>
  );
}

function VoucherCard({ v, onToggle }: { v: Voucher; onToggle: () => void }) {
  return (
    <Card>
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="font-bold">{v.title}</Text>
          <Text className="text-xs text-textMuted mt-0.5">
            {v.kind === "paid" ? `Pay ${money(v.price ?? 0)} · worth ${money(v.value)}` : `Free · worth ${money(v.value)}`}
          </Text>
        </View>
        <Badge label={v.status === "active" ? "On sale" : "Paused"} tone={v.status === "active" ? "success" : "neutral"} />
      </View>
      <ProgressBar pct={v.sold ? (v.redeemed / v.sold) * 100 : 0} className="mt-3" />
      <Text className="text-xs text-textMuted mt-1.5">
        {v.redeemed} of {v.sold} redeemed{v.kind === "paid" ? ` · ${money(v.revenue)} revenue` : ""}
      </Text>
      <Text className="text-xs text-textMuted mt-1">
        {v.validity}
        {v.conditions ? ` · ${v.conditions}` : ""}
      </Text>
      <Actions>
        <Button variant="outline" size="sm" onPress={onToggle}>
          <Text>{v.status === "active" ? "Pause" : "Resume"}</Text>
        </Button>
        <Button variant="secondary" size="sm" onPress={() => notYet("Edit voucher")}>
          <Text>Edit</Text>
        </Button>
      </Actions>
    </Card>
  );
}
