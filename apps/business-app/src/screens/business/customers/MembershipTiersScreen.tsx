import React, { useState } from "react";
import { Switch, View } from "react-native";
import { colors } from "@sparkr/ui";
import { mockMemberPromotions, mockTiers, type TierConfig } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  InfoBanner,
  LinkButton,
  ListCard,
  money,
  notYet,
  Screen,
  Section,
  SwitchRow,
  Text,
} from "../../../components/business/kit";
import { TIER_COLORS, TIER_LABEL } from "../../../components/business/TierBadge";

// Feature 13: optional Bronze/Silver/Gold tiers by 12-month spend, with business-set
// thresholds and rewards, plus daily/weekly/time-specific/holiday member promotions.

const REWARD_OPTIONS = [5, 7.5, 10, 15];
const PROMO_KIND = { daily: "Daily", weekly: "Weekly", time_specific: "Time-specific", holiday: "Holiday" } as const;

export default function MembershipTiersScreen() {
  const [enabled, setEnabled] = useState(true);
  const [tiers, setTiers] = useState(mockTiers);
  const [promos, setPromos] = useState(mockMemberPromotions);

  const setReward = (tier: TierConfig["tier"], rewardPct: number) =>
    setTiers((list) => list.map((t) => (t.tier === tier ? { ...t, rewardPct } : t)));

  return (
    <Screen>
      <ListCard>
        <SwitchRow
          icon="ribbon-outline"
          title="Membership tiers"
          description="Members move up by 12-month spend. Switch off to keep one simple membership."
          value={enabled}
          onValueChange={setEnabled}
          last
        />
      </ListCard>

      {enabled ? (
        <Section title="Tiers">
          <View className="gap-3">
            {tiers.map((t) => (
              <Card key={t.tier}>
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full mr-3" style={{ backgroundColor: TIER_COLORS[t.tier] }} />
                  <View className="flex-1">
                    <Text className="font-bold text-base">{TIER_LABEL[t.tier]}</Text>
                    <Text className="text-xs text-textMuted">
                      {t.threshold === 0 ? "Every new member" : `${money(t.threshold)}+ spent in 12 months`} · {t.members} members
                    </Text>
                  </View>
                </View>
                <Text className="text-xs text-textMuted mt-3 mb-2">Reward</Text>
                <View className="flex-row gap-2">
                  {REWARD_OPTIONS.map((pct) => (
                    <Button
                      key={pct}
                      size="sm"
                      variant={t.rewardPct === pct ? "default" : "secondary"}
                      className="flex-1 px-1"
                      onPress={() => setReward(t.tier, pct)}
                      accessibilityState={{ selected: t.rewardPct === pct }}
                    >
                      <Text>{pct}%</Text>
                    </Button>
                  ))}
                </View>
              </Card>
            ))}
          </View>
          <Button variant="outline" className="mt-3" onPress={() => notYet("Edit thresholds", "Set the 12-month spend needed for Silver and Gold.")}>
            <Text>Edit thresholds</Text>
          </Button>
        </Section>
      ) : null}

      <Section
        title="Offers & holiday promotions"
        action={<LinkButton label="New" onPress={() => notYet("New promotion", "Daily, weekly, time-specific or holiday offers for members.")} />}
      >
        <ListCard>
          {promos.map((p, i) => (
            <View key={p.id} className={`flex-row items-center px-4 py-3.5 ${i < promos.length - 1 ? "border-b border-border" : ""}`}>
              <View className="flex-1 mr-3">
                <Text className="font-semibold">{p.title}</Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Badge label={PROMO_KIND[p.kind]} />
                  <Text className="text-xs text-textMuted">{p.schedule}</Text>
                </View>
              </View>
              <Switch
                value={p.active}
                onValueChange={(v) => setPromos((list) => list.map((x) => (x.id === p.id ? { ...x, active: v } : x)))}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={colors.border}
                accessibilityLabel={p.title}
              />
            </View>
          ))}
        </ListCard>
      </Section>

      <InfoBanner
        icon="book-outline"
        text="New to tiers? The business user guide in Help & Support walks through setting up memberships, rewards and promotions."
      />
    </Screen>
  );
}
