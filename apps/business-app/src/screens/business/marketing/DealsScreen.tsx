import React, { useMemo, useRef, useState } from "react";
import { Alert, ScrollView, View, type LayoutChangeEvent, type ScrollViewInstance } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mockDeals, type Deal, type DealKind, type DealStatus } from "@sparkr/shared";
import { Button, notYet, Text, useHeaderButton } from "../../../components/business/kit";
import { Reveal } from "../../../components/business/motion";
import { Toast, useToast } from "../../../components/business/Toast";
import { AnalyticsSheet } from "../../../components/business/deals/AnalyticsSheet";
import { DealCard } from "../../../components/business/deals/DealCard";
import { DealEditorSheet, DealTypeSheet } from "../../../components/business/deals/NewDealFlow";
import { PromoBanner } from "../../../components/business/deals/PromoBanner";
import { StatusSegmented } from "../../../components/business/deals/StatusSegmented";
import { D, type MetricKey } from "../../../components/business/deals/common";
import { dealStatus, useNow } from "../../../lib/dealTime";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 7: happy hours, flash deals, secret menus and limited-time offers. Repeat daily
// or run for set dates, set min spend / redemption limits / expiry, switch on or off.
// Free to post; shown live on the profile, discovery and the map.
//
// Layout follows the "Happy Hours Deals Dashboard" reference (promo banner → status pills →
// deal cards), under the app's native header and tab bar. Per-deal numbers live on the
// cards; the analytics sheet (Quick Stats → Full analytics) covers trends and comparisons. Everything
// is screen state on sample data: statuses and countdowns derive from each deal's timing,
// switches/edits/new deals update local state, analytics come from the deals' daily history.
// Backend wiring replaces the `setDeals` calls when the API exists.

const EMPTY: Record<DealStatus, { title: string; detail: string }> = {
  live: { title: "No live deals yet", detail: "Create an offer to get started." },
  scheduled: { title: "Nothing scheduled", detail: "Plan a deal for a future date and it shows up here." },
  ended: { title: "No ended deals", detail: "Deals move here once their end date passes." },
};

export default function DealsScreen({ navigation }: MarketingScreenProps<"Deals">) {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [tab, setTab] = useState<DealStatus>("live");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);

  const [typeOpen, setTypeOpen] = useState(false);
  const [editor, setEditor] = useState<{ open: boolean; kind: DealKind; initial?: Deal }>({ open: false, kind: "happy_hour" });
  const [analytics, setAnalytics] = useState<{ open: boolean; dealId: string | null; metric: MetricKey }>({ open: false, dealId: null, metric: "views" });

  const { toast, show, hide } = useToast();
  const now = useNow(30_000); // statuses re-derive as deals start/end
  const scrollRef = useRef<ScrollViewInstance>(null);
  const CONTENT_TOP = 16;
  const blockY = useRef(0);
  const listY = useRef(0);
  const cardY = useRef<Record<string, number>>({});

  const statusOf = useMemo(() => new Map(deals.map((d) => [d.id, dealStatus(d, now)])), [deals, now]);
  const counts: Record<DealStatus, number> = { live: 0, scheduled: 0, ended: 0 };
  for (const d of deals) counts[statusOf.get(d.id) ?? d.status]++;
  const shown = deals.filter((d) => statusOf.get(d.id) === tab);

  useHeaderButton(navigation, { label: "New", icon: "add", onPress: () => setTypeOpen(true) });

  const toggleActive = (d: Deal, active: boolean) => {
    const apply = () => setDeals((list) => list.map((x) => (x.id === d.id ? { ...x, active } : x)));
    if (active) {
      apply();
      setFlashId(d.id);
      setTimeout(() => setFlashId((cur) => (cur === d.id ? null : cur)), 1400);
      show(`${d.title} is on 🎉`);
      return;
    }
    Alert.alert(`Switch off ${d.title}?`, "The deal is hidden until you switch it back on. Its schedule and stats are kept.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Switch off",
        style: "destructive",
        onPress: () => {
          apply();
          show(`${d.title} switched off`, "neutral");
        },
      },
    ]);
  };

  const revealDeal = (id: string) => {
    const d = deals.find((x) => x.id === id);
    if (!d) return;
    setTab(statusOf.get(id) ?? dealStatus(d, now));
    setExpandedId(id);
    setTimeout(() => {
      const y = cardY.current[id];
      if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, CONTENT_TOP + blockY.current + listY.current + y - 12), animated: true });
    }, 80);
  };

  const saveDeal = (saved: Deal) => {
    const editing = !!editor.initial;
    setDeals((list) => (editing ? list.map((x) => (x.id === saved.id ? saved : x)) : [saved, ...list]));
    setEditor((e) => ({ ...e, open: false }));
    show(editing ? "Your changes are saved" : saved.active ? "Your deal has been added! 🎉" : "Deal saved, switched off", saved.active || editing ? "success" : "neutral");
    setTimeout(() => revealDeal(saved.id), 350);
  };

  const sponsor = () => notYet("Sponsor this deal", "Rotate into the top spots for 1, 3 or 7 days. Pricing and checkout come with the wallet integration.");

  return (
    <View className="flex-1" style={{ backgroundColor: D.page }}>
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ paddingTop: CONTENT_TOP, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 gap-4">
          <PromoBanner />

          <View onLayout={(e: LayoutChangeEvent) => (blockY.current = e.nativeEvent.layout.y)}>
            <Reveal delay={80}>
              <StatusSegmented value={tab} counts={counts} onChange={setTab} />
            </Reveal>

            <View className="gap-4 mt-4" onLayout={(e: LayoutChangeEvent) => (listY.current = e.nativeEvent.layout.y)}>
              {shown.length === 0 ? (
                <Reveal>
                  <View className="items-center px-6 py-10">
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: D.blueTint, alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name={tab === "ended" ? "checkmark-done" : "pricetag"} size={26} color={D.blue} />
                    </View>
                    <Text className="text-base font-bold mt-3" style={{ color: D.ink }}>
                      {EMPTY[tab].title}
                    </Text>
                    <Text className="text-sm text-center mt-1" style={{ color: D.muted }}>
                      {EMPTY[tab].detail}
                    </Text>
                    {tab !== "ended" ? (
                      <Button className="mt-5 rounded-full px-5" style={{ backgroundColor: D.blue }} onPress={() => setTypeOpen(true)}>
                        <Ionicons name="add" size={18} color={D.card} />
                        <Text>Create a deal</Text>
                      </Button>
                    ) : null}
                  </View>
                </Reveal>
              ) : (
                shown.map((d) => (
                  <DealCard
                    key={d.id}
                    deal={d}
                    status={statusOf.get(d.id) ?? d.status}
                    expanded={expandedId === d.id}
                    flash={flashId === d.id}
                    onLayout={(e) => (cardY.current[d.id] = e.nativeEvent.layout.y)}
                    onToggleExpand={() => setExpandedId((cur) => (cur === d.id ? null : d.id))}
                    onToggleActive={(v) => toggleActive(d, v)}
                    onAnalytics={() => setAnalytics({ open: true, dealId: d.id, metric: "views" })}
                    onEdit={() => setEditor({ open: true, kind: d.kind, initial: d })}
                    onSponsor={sponsor}
                  />
                ))
              )}
            </View>
          </View>

          <Text className="text-xs text-center px-4 mt-1" style={{ color: D.muted }}>
            Posting deals is free. Sponsor one from its card for a top spot.
          </Text>
        </View>
      </ScrollView>

      <Toast toast={toast} onHide={hide} />

      <DealTypeSheet
        visible={typeOpen}
        onClose={() => setTypeOpen(false)}
        onPick={(kind) => {
          setTypeOpen(false);
          setTimeout(() => setEditor({ open: true, kind, initial: undefined }), 250);
        }}
      />
      <DealEditorSheet visible={editor.open} kind={editor.kind} initial={editor.initial} onClose={() => setEditor((e) => ({ ...e, open: false }))} onSave={saveDeal} />
      <AnalyticsSheet
        visible={analytics.open}
        onClose={() => setAnalytics((a) => ({ ...a, open: false }))}
        deals={deals}
        focusDealId={analytics.dealId}
        initialMetric={analytics.metric}
      />
    </View>
  );
}
