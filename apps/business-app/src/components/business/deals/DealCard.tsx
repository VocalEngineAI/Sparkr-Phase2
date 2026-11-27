import React from "react";
import { Image, Switch, View, type LayoutChangeEvent } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Deal, DealStatus } from "@sparkr/shared";
import { Button, ProgressBar, Text } from "../kit";
import { Expand, Reveal } from "../motion";
import { dealPhase, useNow } from "../../../lib/dealTime";
import { Countdown } from "./Countdown";
import { Sparkline } from "./charts";
import { CARD_SHADOW, D, fmtMetric, KIND, remainingRedemptions, ruleLines, STATUS } from "./common";

/** Deal photo; a soft tile with the type glyph when the deal has no image yet. */
function DealImage({ deal, size = 100 }: { deal: Pick<Deal, "kind" | "image" | "title">; size?: number }) {
  if (deal.image) {
    return <Image source={{ uri: deal.image }} style={{ width: size, height: size, borderRadius: 18, backgroundColor: D.blueTint }} accessibilityLabel={deal.title} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: 18, backgroundColor: D.blueTint, alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={KIND[deal.kind].icon} size={Math.round(size * 0.4)} color={D.blue} />
    </View>
  );
}

/**
 * Deal card per the reference: status chip + countdown chip on top; image, title, big blue
 * headline, schedule and the metric row in the middle with the switch; a footer bar with
 * Quick Stats (expands the card) and Edit. `readOnly` drops the controls (New Deal review step).
 */
export function DealCard({
  deal: d,
  status,
  expanded,
  onToggleExpand,
  onToggleActive,
  onAnalytics,
  onEdit,
  onSponsor,
  readOnly,
  flash,
  onLayout,
}: {
  deal: Deal;
  status: DealStatus;
  expanded: boolean;
  onToggleExpand?: () => void;
  onToggleActive?: (v: boolean) => void;
  onAnalytics?: () => void;
  onEdit?: () => void;
  onSponsor?: () => void;
  readOnly?: boolean;
  flash?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  const now = useNow(1000);
  const phase = dealPhase(d, now);
  const meta = STATUS[status];
  const ended = status === "ended";
  const paused = !ended && !d.active;
  const remaining = remainingRedemptions(d);
  const rules = ruleLines(d);
  const views14 = d.history.slice(-14).map((h) => h.views);

  // Countdown chip colour: red while running out, blue when counting down to a start.
  const countdownTone = phase.redeemableNow ? { fg: D.red, bg: D.redTint } : ended ? { fg: D.muted, bg: D.chip } : { fg: D.blue, bg: D.blueTint };
  const chip = paused ? { chip: "PAUSED", fg: D.muted, bg: D.chip } : meta;

  return (
    <Reveal onLayout={onLayout}>
      <View
        className="rounded-3xl overflow-hidden"
        style={[
          { backgroundColor: D.card, opacity: ended ? 0.9 : 1 },
          CARD_SHADOW,
          flash ? { borderColor: D.green } : expanded ? { borderColor: D.blue } : null,
        ]}
      >
        <Button
          variant="ghost"
          className="h-auto flex-col items-stretch justify-start gap-0 rounded-none px-4 pt-4 pb-3 active:bg-transparent"
          onPress={onToggleExpand}
          disabled={!onToggleExpand}
          accessibilityState={{ expanded }}
          accessibilityLabel={`${d.title}, ${KIND[d.kind].label}, ${meta.label}${onToggleExpand ? `, ${expanded ? "collapse" : "expand"}` : ""}`}
        >
          {/* Chips */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center rounded-full px-3 h-7 gap-1.5" style={{ backgroundColor: chip.bg }}>
              {status === "live" && !paused ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: D.greenBright }} /> : null}
              <Text className="text-xs font-bold" style={{ color: chip.fg }}>
                {chip.chip}
              </Text>
            </View>
            <View className="flex-row items-center rounded-full px-3 h-7 gap-1.5" style={{ backgroundColor: countdownTone.bg }}>
              <Ionicons name="time-outline" size={14} color={countdownTone.fg} />
              <Countdown deal={d} className="text-xs font-bold" style={{ color: countdownTone.fg }} />
            </View>
          </View>

          {/* Body */}
          <View className="flex-row mt-3.5">
            <DealImage deal={d} />
            <View className="flex-1 ml-3.5">
              <View className="flex-row items-start">
                <Text className="text-base font-bold flex-1" style={{ color: D.ink }} numberOfLines={expanded ? undefined : 2}>
                  {d.title}
                </Text>
                {!readOnly && !ended && onToggleActive ? (
                  <Switch
                    value={d.active}
                    onValueChange={onToggleActive}
                    trackColor={{ false: D.line, true: D.blue }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor={D.line}
                    accessibilityLabel={`${d.title} switched ${d.active ? "on" : "off"}`}
                    style={{ marginLeft: 6, marginTop: -4 }}
                  />
                ) : null}
              </View>
              {d.highlight ? (
                <Text className="text-3xl font-extrabold" style={{ color: paused || ended ? D.muted : D.blue, lineHeight: 40 }} numberOfLines={1} adjustsFontSizeToFit>
                  {d.highlight}
                </Text>
              ) : null}
              <Text className="text-sm mt-0.5" style={{ color: D.ink }} numberOfLines={1}>
                {d.schedule}
              </Text>
              <View className="flex-row items-center mt-2">
                <View className="flex-row items-center gap-3 flex-1 flex-wrap">
                  <Stat icon="eye-outline" value={fmtMetric("views", d.views)} />
                  <Stat icon="bookmark-outline" value={fmtMetric("saves", d.saves)} />
                  <Stat icon="ticket-outline" value={fmtMetric("redemptions", d.redemptions)} />
                  <Stat icon="cash-outline" value={fmtMetric("revenue", d.revenue)} />
                </View>
                {onToggleExpand ? <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={D.ink} /> : null}
              </View>
            </View>
          </View>
        </Button>

        {/* Expanded details ("Quick Stats") */}
        {expanded ? (
          <Expand style={{ paddingHorizontal: 16, paddingBottom: 14, gap: 14 }}>
            <View style={{ height: 1, backgroundColor: D.line }} />
            {d.offer ? (
              <Text className="text-sm font-semibold" style={{ color: D.ink }}>
                {d.offer}
              </Text>
            ) : null}
            {d.description ? (
              <Text className="text-sm" style={{ color: D.muted, lineHeight: 20 }}>
                {d.description}
              </Text>
            ) : null}

            <View>
              <Text className="text-xs font-bold mb-1" style={{ color: D.muted }}>
                RULES
              </Text>
              {rules.length ? (
                rules.map((r) => (
                  <Text key={r} className="text-sm" style={{ color: D.ink, lineHeight: 22 }}>
                    • {r}
                  </Text>
                ))
              ) : (
                <Text className="text-sm" style={{ color: D.muted }}>
                  No restrictions
                </Text>
              )}
            </View>

            {remaining !== undefined && d.redemptionLimit ? (
              <View>
                <View className="flex-row justify-between mb-1.5">
                  <Text className="text-xs font-bold" style={{ color: D.muted }}>
                    REDEMPTIONS
                  </Text>
                  <Text className="text-xs" style={{ color: D.muted, fontVariant: ["tabular-nums"] }}>
                    {remaining} of {d.redemptionLimit} left
                  </Text>
                </View>
                <ProgressBar pct={(d.redemptions / d.redemptionLimit) * 100} />
              </View>
            ) : null}

            <View className="flex-row items-center justify-between rounded-2xl px-4 py-3" style={{ backgroundColor: D.blueTint }}>
              <View>
                <Text className="text-xs font-bold" style={{ color: D.blue }}>
                  LAST 14 DAYS
                </Text>
                <Text className="text-base font-extrabold mt-0.5" style={{ color: D.ink, fontVariant: ["tabular-nums"] }}>
                  {fmtMetric("views", views14.reduce((a, b) => a + b, 0))} views
                </Text>
                <Text className="text-xs" style={{ color: D.muted }}>
                  {d.views > 0 ? `${Math.round((d.redemptions / d.views) * 1000) / 10}% of views redeemed` : "No views yet"}
                </Text>
              </View>
              <Sparkline data={views14} width={96} height={34} color={D.blue} />
            </View>

            {!readOnly ? (
              <View className="flex-row gap-2">
                <Pill label="Full analytics" icon="stats-chart" onPress={onAnalytics} />
                {!ended ? <Pill label="Sponsor" icon="rocket-outline" onPress={onSponsor} /> : null}
              </View>
            ) : null}
          </Expand>
        ) : null}

        {/* Footer bar */}
        {!readOnly ? (
          <View
            className="flex-row items-center justify-between px-3 py-2.5 overflow-hidden"
            style={{ backgroundColor: D.chip }}
          >
            <Button variant="ghost" size="sm" className="h-9 rounded-full px-2 gap-1.5 active:bg-transparent" onPress={onToggleExpand} accessibilityLabel={expanded ? "Hide quick stats" : "Show quick stats"}>
              <Ionicons name="bar-chart" size={16} color={D.blue} />
              <Text className="text-sm font-semibold" style={{ color: D.blue }}>
                Quick Stats
              </Text>
              <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={14} color={D.blue} />
            </Button>
            {!ended ? <Pill label="Edit" icon="pencil" onPress={onEdit} filled /> : null}
          </View>
        ) : null}
      </View>
    </Reveal>
  );
}

function Stat({ icon, value }: { icon: React.ComponentProps<typeof Ionicons>["name"]; value: string }) {
  return (
    <View className="flex-row items-center gap-1">
      <Ionicons name={icon} size={14} color={D.ink} />
      <Text className="text-[13px]" style={{ color: D.ink, fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
    </View>
  );
}

function Pill({ label, icon, onPress, filled }: { label: string; icon: React.ComponentProps<typeof Ionicons>["name"]; onPress?: () => void; filled?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-10 rounded-full px-4 gap-1.5"
      style={filled ? { backgroundColor: D.blue } : { backgroundColor: D.card, borderWidth: 1, borderColor: D.line }}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={15} color={filled ? D.card : D.ink} />
      <Text className="text-sm font-semibold" style={{ color: filled ? D.card : D.ink }}>
        {label}
      </Text>
    </Button>
  );
}
