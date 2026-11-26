import React, { useState } from "react";
import { Switch, View } from "react-native";
import { colors } from "@sparkr/ui";
import { mockDeals, type Deal, type DealKind } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  InfoBanner,
  money,
  notYet,
  Screen,
  Segmented,
  Text,
  useHeaderButton,
  type IconName,
} from "../../../components/business/kit";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 7: happy hours, flash deals, secret menus and limited-time offers. Repeat daily
// or run for set dates, set min spend / redemption limits / expiry, switch on or off.
// Free to post; shown live on the profile, discovery and the map.

const KIND: Record<DealKind, { label: string; icon: IconName }> = {
  happy_hour: { label: "Happy hour", icon: "beer-outline" },
  flash: { label: "Flash deal", icon: "flash-outline" },
  secret_menu: { label: "Secret menu", icon: "eye-off-outline" },
  limited_time: { label: "Limited time", icon: "hourglass-outline" },
};

export default function DealsScreen({ navigation }: MarketingScreenProps<"Deals">) {
  const [deals, setDeals] = useState(mockDeals);
  const [status, setStatus] = useState<Deal["status"]>("live");

  useHeaderButton(navigation, {
    label: "New",
    icon: "add",
    onPress: () =>
      notYet("New deal", "Pick happy hour, flash deal, secret menu or limited-time offer, then set the schedule and rules."),
  });

  const count = (s: Deal["status"]) => deals.filter((d) => d.status === s).length;
  const shown = deals.filter((d) => d.status === status);
  const toggle = (id: string, active: boolean) =>
    setDeals((list) => list.map((d) => (d.id === id ? { ...d, active } : d)));

  return (
    <Screen>
      <Segmented
        options={[
          ["live", `Live (${count("live")})`],
          ["scheduled", `Scheduled (${count("scheduled")})`],
          ["ended", `Ended (${count("ended")})`],
        ]}
        value={status}
        onChange={setStatus}
      />

      <View className="gap-3">
        {shown.length === 0 ? (
          <EmptyState icon="pricetag-outline" title="No deals here" />
        ) : (
          shown.map((d) => <DealCard key={d.id} d={d} onToggle={(v) => toggle(d.id, v)} />)
        )}
      </View>

      <InfoBanner text="Posting deals is free. Customers see them in real time on your profile, in discovery and on the map. Want a top spot? Sponsor a deal from its card." />
    </Screen>
  );
}

function DealCard({ d, onToggle }: { d: Deal; onToggle: (v: boolean) => void }) {
  const k = KIND[d.kind];
  const rules = [
    d.minSpend ? `Min spend ${money(d.minSpend)}` : null,
    d.redemptionLimit ? `Limit ${d.redemptionLimit}${d.kind === "happy_hour" ? " per visit" : ""}` : null,
    d.expires ? `Expires ${d.expires}` : null,
  ].filter(Boolean);

  return (
    <Card>
      <View className="flex-row items-start">
        <View className="flex-1">
          <Badge label={k.label} icon={k.icon} tone="accent" />
          <Text className="font-bold text-base mt-2">{d.title}</Text>
          <Text className="text-sm text-textMuted mt-0.5">{d.schedule}</Text>
          {rules.length ? <Text className="text-xs text-textMuted mt-1">{rules.join(" · ")}</Text> : null}
        </View>
        {d.status !== "ended" ? (
          <Switch
            value={d.active}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
            ios_backgroundColor={colors.border}
            accessibilityLabel={`${d.title} active`}
          />
        ) : null}
      </View>

      <View className="flex-row justify-between bg-surface rounded-xl p-3 mt-3">
        {[
          ["Redeemed", String(d.redemptions)],
          ["Views", String(d.views)],
          ["Saves", String(d.saves)],
          ["Revenue", money(d.revenue)],
        ].map(([label, value]) => (
          <View key={label} className="items-center flex-1">
            <Text className="font-bold">{value}</Text>
            <Text className="text-[11px] text-textMuted">{label}</Text>
          </View>
        ))}
      </View>

      {d.status !== "ended" ? (
        <View className="flex-row justify-end gap-2 mt-3">
          <Button variant="outline" size="sm" onPress={() => notYet("Sponsor this deal", "Rotate into the top spots for 1, 3 or 7 days.")}>
            <Text>Sponsor</Text>
          </Button>
          <Button variant="secondary" size="sm" onPress={() => notYet("Edit deal")}>
            <Text>Edit</Text>
          </Button>
        </View>
      ) : null}
    </Card>
  );
}
