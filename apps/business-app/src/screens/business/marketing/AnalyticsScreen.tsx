import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockAnalyticsKpis, mockInfluencerPerformance, mockOfferPerformance } from "@sparkr/shared";
import {
  Badge,
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
  StatGrid,
  Text,
} from "../../../components/business/kit";

// Feature 2: influencer ROI (unique codes → visits, redemptions, members), offer and deal
// results in one dashboard, plus downloadable reports. Advanced analytics is a paid feature.

const OFFER_KIND = { deal: "Deal", voucher: "Voucher", influencer_offer: "Influencer offer" } as const;

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const topRevenue = Math.max(...mockOfferPerformance.map((o) => o.revenue));

  return (
    <Screen>
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Badge label="Advanced analytics · paid feature" tone="accent" icon="sparkles-outline" />
        </View>
        <Segmented
          options={[
            ["7d", "7 days"],
            ["30d", "30 days"],
            ["90d", "90 days"],
          ]}
          value={period}
          onChange={setPeriod}
        />
      </View>

      <StatGrid items={mockAnalyticsKpis.map((k) => ({ label: k.label, value: k.value, changePct: k.changePct }))} />

      <Section title="Influencer results" subtitle="by unique code">
        <ListCard>
          {mockInfluencerPerformance.map((p, i) => (
            <ListRow
              key={p.id}
              title={p.handle}
              subtitle={`Code ${p.code} · ${p.visits} visits · ${p.redemptions} redemptions · ${p.newMembers} new members`}
              right={<Text className="font-bold">{money(p.offerSales)}</Text>}
              chevron={false}
              last={i === mockInfluencerPerformance.length - 1}
            />
          ))}
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">
          Visits are tracked for Sparkr members only. Sales outside Sparkr aren't tracked.
        </Text>
      </Section>

      <Section title="Offers, deals & vouchers">
        <Card>
          <View className="gap-4">
            {mockOfferPerformance.map((o) => (
              <View key={o.id}>
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="font-semibold flex-1" numberOfLines={1}>
                    {o.title}
                  </Text>
                  <Text className="font-bold">{money(o.revenue)}</Text>
                </View>
                <ProgressBar pct={(o.revenue / topRevenue) * 100} className="mt-2" />
                <Text className="text-xs text-textMuted mt-1">
                  {OFFER_KIND[o.kind]} · {o.redemptions} redemptions
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <Section title="Reports">
        <InfoBanner text="Download or share a report of influencer results, offer sales, deals and vouchers for the selected period." />
        <View className="flex-row gap-3 mt-3">
          <Button variant="outline" className="flex-1" onPress={() => notYet("Download report")}>
            <Ionicons name="download-outline" size={16} color={colors.text} />
            <Text>Download PDF</Text>
          </Button>
          <Button className="flex-1" onPress={() => notYet("Share report")}>
            <Ionicons name="share-outline" size={16} color={colors.background} />
            <Text>Share</Text>
          </Button>
        </View>
      </Section>
    </Screen>
  );
}
