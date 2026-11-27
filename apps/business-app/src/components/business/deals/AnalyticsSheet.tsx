import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Deal } from "@sparkr/shared";
import { Button, Chips, Segmented, Text } from "../kit";
import { BottomSheet } from "../BottomSheet";
import { cn } from "../../../lib/utils";
import { LineChart } from "./charts";
import { D, dailySeries, fmtMetric, metricLabel, METRICS, shortDate, sumSeries, type MetricKey } from "./common";

type Range = "7" | "14" | "30";

/**
 * Interactive analytics: switch metric and range, tap a day for its value, and (when opened
 * from Quick Stats) tap a deal in the breakdown to focus the chart on it. Data is
 * the deals' 30-day daily history, so everything shown is derived from the same numbers as
 * the cards.
 */
export function AnalyticsSheet({
  visible,
  onClose,
  deals,
  focusDealId,
  initialMetric = "views",
}: {
  visible: boolean;
  onClose: () => void;
  deals: Deal[];
  /** Pre-select one deal (opened from its card). */
  focusDealId?: string | null;
  initialMetric?: MetricKey;
}) {
  const [metric, setMetric] = useState<MetricKey>(initialMetric);
  const [range, setRange] = useState<Range>("14");
  const [dealId, setDealId] = useState<string | null>(focusDealId ?? null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    setMetric(initialMetric);
    setDealId(focusDealId ?? null);
    setSelected(null);
  }, [visible, initialMetric, focusDealId]);

  const scope = useMemo(() => (dealId ? deals.filter((d) => d.id === dealId) : deals), [deals, dealId]);
  const days = Number(range);
  const rows = useMemo(() => (scope.length ? dailySeries(scope, days) : []), [scope, days]);
  const values = rows.map((r) => r[metric]);
  const labels = rows.map((r) => shortDate(r.date));
  const total = sumSeries(rows, metric);
  const views = sumSeries(rows, "views");
  const redemptions = sumSeries(rows, "redemptions");
  const conversion = views > 0 ? `${Math.round((redemptions / views) * 1000) / 10}%` : "—";
  const peakIdx = values.length ? values.indexOf(Math.max(...values)) : -1;
  const focus = dealId ? deals.find((d) => d.id === dealId) : undefined;
  const color = D.blue;

  const breakdown = useMemo(
    () =>
      deals
        .map((d) => ({ d, value: sumSeries(dailySeries([d], days), metric) }))
        .sort((a, b) => b.value - a.value),
    [deals, days, metric]
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} title={focus ? focus.title : "Deal analytics"} subtitle={focus ? "This deal only" : `All deals · ${deals.length}`}>
      <Chips
        options={METRICS.map((m) => [m.key, m.label] as const)}
        value={metric}
        onChange={(k) => {
          setMetric(k);
          setSelected(null);
        }}
      />

      <View className="flex-row items-end justify-between mt-4">
        <View>
          <Text className="text-xs text-textMuted">
            {metricLabel(metric)} · last {days} days
          </Text>
          <Text className="text-3xl font-extrabold mt-0.5" style={{ fontVariant: ["tabular-nums"], lineHeight: 40 }}>
            {fmtMetric(metric, total)}
          </Text>
        </View>
        <Segmented
          options={[
            ["7", "7d"],
            ["14", "14d"],
            ["30", "30d"],
          ]}
          value={range}
          onChange={(r) => {
            setRange(r);
            setSelected(null);
          }}
          className="w-40"
        />
      </View>

      <View className="mt-3">
        <LineChart data={values} labels={labels} selected={selected} onSelect={setSelected} color={color} format={(v) => fmtMetric(metric, v)} />
      </View>

      <View className="bg-surface rounded-xl px-3 py-2.5 mt-2">
        <Text className="text-sm">
          {selected !== null && rows[selected]
            ? `${shortDate(rows[selected].date)} · ${fmtMetric(metric, values[selected])} ${metricLabel(metric).toLowerCase()}`
            : "Tap a day on the chart to see its value."}
        </Text>
      </View>

      <View className="flex-row gap-3 mt-4">
        <Stat label="Conversion" value={conversion} hint="redeemed ÷ views" />
        <Stat label="Peak day" value={peakIdx >= 0 ? labels[peakIdx] : "—"} hint={peakIdx >= 0 ? fmtMetric(metric, values[peakIdx]) : ""} />
        <Stat label="Daily avg." value={rows.length ? fmtMetric(metric, Math.round(total / rows.length)) : "—"} hint={`over ${days} days`} />
      </View>

      {deals.length > 1 ? (
        <View className="mt-5">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-semibold text-textMuted">BY DEAL · LAST {days} DAYS</Text>
            {dealId ? (
              <Button variant="link" size="sm" className="h-6 px-0" onPress={() => setDealId(null)}>
                <Text className="text-xs font-semibold text-text">Show all</Text>
              </Button>
            ) : null}
          </View>
          <View className="rounded-2xl border border-border overflow-hidden">
            {breakdown.map(({ d, value }, i) => {
              const active = dealId === d.id;
              const share = total > 0 && !dealId ? Math.round((value / total) * 100) : null;
              return (
                <Button
                  key={d.id}
                  variant="ghost"
                  className={cn("h-auto flex-row items-center justify-start gap-0 rounded-none px-4 py-3", active && "bg-surface", i < breakdown.length - 1 && "border-b border-border")}
                  onPress={() => {
                    setDealId(active ? null : d.id);
                    setSelected(null);
                  }}
                  accessibilityState={{ selected: active }}
                >
                  <View className="flex-1">
                    <Text className="text-sm font-semibold" numberOfLines={1}>
                      {d.title}
                    </Text>
                    {share !== null ? <Text className="text-xs text-textMuted">{share}% of total</Text> : null}
                  </View>
                  <Text className="text-sm font-bold" style={{ fontVariant: ["tabular-nums"] }}>
                    {fmtMetric(metric, value)}
                  </Text>
                  <Ionicons name={active ? "close" : "chevron-forward"} size={16} color={D.muted} style={{ marginLeft: 8 }} />
                </Button>
              );
            })}
          </View>
        </View>
      ) : null}
    </BottomSheet>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <View className="flex-1 bg-surface rounded-xl p-3">
      <Text className="text-[11px] text-textMuted" numberOfLines={1}>
        {label}
      </Text>
      <Text className="font-bold mt-0.5" numberOfLines={1} style={{ fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
      {hint ? (
        <Text className="text-[11px] text-textMuted" numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
