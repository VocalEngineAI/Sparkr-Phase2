import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import {
  mockActionRequired,
  mockBusiness,
  mockBusinessOverview,
  mockPerformanceHighlights,
  mockRecentActivity,
  mockUpcomingEvents,
  mockUpcomingReservations,
  type ActionRequiredItem,
  type ActivityKind,
  type BusinessEvent,
  type Reservation,
} from "@sparkr/shared";
import { Button } from "../../components/ui/button";
import { Text } from "../../components/ui/text";
import { cn } from "../../lib/utils";
import type { BusinessTabParamList } from "../../navigation/BusinessTabNavigator";

type IconName = React.ComponentProps<typeof Ionicons>["name"];
type Nav = BottomTabNavigationProp<BusinessTabParamList, "Home">;

// Business home dashboard: overview → what needs attention → shortcuts → how it's going →
// what's coming up → what just happened. Everything is mock data from @sparkr/shared.

function money(n: number, cents = true) {
  const fixed = n.toFixed(cents ? 2 : 0);
  return `$${fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function notYet(what: string) {
  Alert.alert(what, "This isn't connected yet.");
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [actions, setActions] = useState(mockActionRequired);

  const dismiss = (id: string) => setActions((list) => list.filter((a) => a.id !== id));

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Header alertCount={actions.length} />

      <View className="px-5 gap-8">
        <OverviewCard />

        {actions.length > 0 ? (
          <Section title="Needs your attention" count={actions.length}>
            <View className="gap-3">
              {actions.map((item) => (
                <ActionCard
                  key={item.id}
                  item={item}
                  onDone={() => dismiss(item.id)}
                  onOpen={() =>
                    navigation.navigate(item.kind === "arrival_check" ? "Bookings" : "Marketing")
                  }
                />
              ))}
            </View>
          </Section>
        ) : null}

        <Section title="Quick actions">
          <QuickActions navigation={navigation} />
        </Section>

        <Section title="Performance" subtitle="Last 7 days">
          <Highlights />
        </Section>

        <Upcoming onSeeAll={() => navigation.navigate("Bookings")} />

        <Section title="Recent activity">
          <RecentActivity />
        </Section>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Header & overview
// ---------------------------------------------------------------------------

function Header({ alertCount }: { alertCount: number }) {
  const initials = mockBusiness.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <View className="flex-row items-center px-5 mb-6">
      <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
        <Text className="text-background font-bold text-base">{initials}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm text-textMuted">
          {greeting()}, {mockBusiness.ownerFirstName}
        </Text>
        <Text className="text-xl font-bold">{mockBusiness.name}</Text>
      </View>
      <View>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-11 h-11"
          accessibilityLabel={`Notifications, ${alertCount} need attention`}
          onPress={() => notYet("Notifications")}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </Button>
        {alertCount > 0 ? (
          <View
            pointerEvents="none"
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-warning items-center justify-center border-2 border-background"
          >
            <Text className="text-[10px] font-bold text-background">{alertCount}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function OverviewCard() {
  const stats: { label: string; value: string; icon: IconName }[] = [
    { label: "Members", value: mockBusiness.memberCount.toLocaleString("en-US"), icon: "people-outline" },
    { label: "Check-ins today", value: String(mockBusinessOverview.checkInsToday), icon: "enter-outline" },
    { label: "Bookings today", value: String(mockBusinessOverview.reservationsToday), icon: "calendar-outline" },
    {
      label: `${mockBusiness.googleReviewCount} reviews`,
      value: `${mockBusiness.googleRating.toFixed(1)}★`,
      icon: "logo-google",
    },
  ];

  return (
    <View className="bg-primary rounded-3xl p-5">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-sm text-primaryLight">Wallet balance</Text>
          <Text className="text-3xl font-extrabold text-background mt-1">
            {money(mockBusiness.walletBalance)}
          </Text>
          <Text className="text-xs text-primaryLight mt-1">
            {mockBusinessOverview.activeCampaigns} campaigns · {mockBusinessOverview.activeDeals} deals live
          </Text>
        </View>
        <Button variant="secondary" size="sm" onPress={() => notYet("Top up wallet")}>
          <Ionicons name="add" size={16} color={colors.text} />
          <Text>Top up</Text>
        </Button>
      </View>

      <View className="h-px bg-background/15 my-4" />

      <View className="flex-row flex-wrap gap-y-4">
        {stats.map((s) => (
          <View key={s.label} className="w-1/2 flex-row items-center">
            <View className="w-9 h-9 rounded-full bg-background/10 items-center justify-center mr-3">
              <Ionicons name={s.icon} size={17} color={colors.linen} />
            </View>
            <View>
              <Text className="text-lg font-bold text-background">{s.value}</Text>
              <Text className="text-xs text-primaryLight">{s.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section shell
// ---------------------------------------------------------------------------

function Section({
  title,
  subtitle,
  count,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold">{title}</Text>
          {count ? (
            <View className="bg-accent rounded-full px-2 py-0.5">
              <Text className="text-xs font-bold">{count}</Text>
            </View>
          ) : null}
          {subtitle ? <Text className="text-sm text-textMuted">{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Action required
// ---------------------------------------------------------------------------

const ACTION_ICONS: Record<ActionRequiredItem["kind"], IconName> = {
  arrival_check: "time-outline",
  campaign_payment: "card-outline",
  post_review: "images-outline",
  applicants: "person-add-outline",
  wallet_low: "wallet-outline",
};

function ActionCard({
  item,
  onDone,
  onOpen,
}: {
  item: ActionRequiredItem;
  onDone: () => void;
  onOpen: () => void;
}) {
  return (
    <View
      className={cn(
        "rounded-2xl border p-4",
        item.urgent ? "border-warning/40 bg-warning/5" : "border-border bg-background"
      )}
    >
      <View className="flex-row">
        <View
          className={cn(
            "w-10 h-10 rounded-full items-center justify-center mr-3",
            item.urgent ? "bg-warning/10" : "bg-surface"
          )}
        >
          <Ionicons
            name={ACTION_ICONS[item.kind]}
            size={20}
            color={item.urgent ? colors.warning : colors.text}
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <Text className="font-semibold flex-1" numberOfLines={1}>
              {item.title}
            </Text>
            {item.deadline ? (
              <Text className={cn("text-xs font-medium", item.urgent ? "text-warning" : "text-textMuted")}>
                {item.deadline}
              </Text>
            ) : null}
          </View>
          <Text className="text-sm text-textMuted mt-0.5">{item.detail}</Text>
        </View>
      </View>

      <View className="flex-row justify-end gap-2 mt-3">
        {item.kind === "arrival_check" ? (
          // Feature 16 arrival check: answer it right here.
          <>
            <Button variant="outline" size="sm" onPress={onDone}>
              <Text>No-show</Text>
            </Button>
            <Button size="sm" onPress={onDone}>
              <Ionicons name="checkmark" size={16} color={colors.background} />
              <Text>Arrived</Text>
            </Button>
          </>
        ) : (
          <Button size="sm" onPress={onOpen}>
            <Text>{item.cta}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

function QuickActions({ navigation }: { navigation: Nav }) {
  const items: { label: string; icon: IconName; tab: keyof BusinessTabParamList }[] = [
    { label: "New campaign", icon: "megaphone-outline", tab: "Marketing" },
    { label: "Create deal", icon: "pricetag-outline", tab: "Marketing" },
    { label: "Send SMS", icon: "chatbubble-ellipses-outline", tab: "Marketing" },
    { label: "Scan QR", icon: "qr-code-outline", tab: "Customers" },
    { label: "Add booking", icon: "add-circle-outline", tab: "Bookings" },
    { label: "New event", icon: "ticket-outline", tab: "Bookings" },
  ];

  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {items.map((a) => (
        <Button
          key={a.label}
          variant="secondary"
          className="w-[31.5%] h-auto flex-col gap-2 py-4 px-2"
          onPress={() => navigation.navigate(a.tab)}
        >
          <Ionicons name={a.icon} size={24} color={colors.text} />
          <Text className="text-xs text-center">{a.label}</Text>
        </Button>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Performance highlights
// ---------------------------------------------------------------------------

function Highlights() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5"
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    >
      {mockPerformanceHighlights.map((h) => {
        const up = h.changePct >= 0;
        return (
          <View key={h.id} className="w-36 bg-surface rounded-2xl p-4">
            <Text className="text-xs text-textMuted">{h.label}</Text>
            <Text className="text-2xl font-extrabold mt-2">{h.value}</Text>
            <View className="flex-row items-center mt-2">
              <Ionicons
                name={up ? "trending-up" : "trending-down"}
                size={14}
                color={up ? colors.success : colors.warning}
              />
              <Text className={cn("text-xs font-semibold ml-1", up ? "text-success" : "text-warning")}>
                {up ? "+" : ""}
                {h.changePct}%
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Upcoming reservations & events
// ---------------------------------------------------------------------------

function Upcoming({ onSeeAll }: { onSeeAll: () => void }) {
  const [tab, setTab] = useState<"reservations" | "events">("reservations");

  return (
    <Section
      title="Coming up"
      action={
        <Button variant="link" size="sm" className="px-0" onPress={onSeeAll}>
          <Text className="text-text font-semibold">See all</Text>
        </Button>
      }
    >
      <View className="flex-row bg-surface rounded-2xl p-1 mb-3">
        {(
          [
            ["reservations", `Reservations (${mockUpcomingReservations.length})`],
            ["events", `Events (${mockUpcomingEvents.length})`],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={tab === key ? "default" : "ghost"}
            className="flex-1"
            onPress={() => setTab(key)}
            accessibilityState={{ selected: tab === key }}
          >
            <Text>{label}</Text>
          </Button>
        ))}
      </View>

      <View className="rounded-2xl border border-border">
        {tab === "reservations"
          ? mockUpcomingReservations.map((r, i) => (
              <ReservationRow key={r.id} r={r} last={i === mockUpcomingReservations.length - 1} />
            ))
          : mockUpcomingEvents.map((e, i) => (
              <EventRow key={e.id} e={e} last={i === mockUpcomingEvents.length - 1} />
            ))}
      </View>
    </Section>
  );
}

function Badge({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "accent" | "warning" }) {
  return (
    <View
      className={cn(
        "rounded-full px-2 py-0.5",
        tone === "accent" ? "bg-accent" : tone === "warning" ? "bg-warning/10" : "bg-surface"
      )}
    >
      <Text className={cn("text-[11px] font-semibold", tone === "warning" && "text-warning")}>
        {label}
      </Text>
    </View>
  );
}

function ReservationRow({ r, last }: { r: Reservation; last: boolean }) {
  const time = r.when.split("·").pop()?.trim() ?? r.when;
  return (
    <View className={cn("flex-row items-center p-4", !last && "border-b border-border")}>
      <View className="w-16">
        <Text className="font-bold">{time.replace(/ (AM|PM)$/, "")}</Text>
        <Text className="text-xs text-textMuted">{time.match(/(AM|PM)$/)?.[0]}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 flex-wrap">
          <Text className="font-semibold">{r.guestName}</Text>
          {r.vip ? <Badge label="VIP" tone="accent" /> : null}
          {r.status === "waitlist" ? <Badge label="Waitlist" tone="warning" /> : null}
          {r.deposit ? <Badge label={`${money(r.deposit, false)} deposit`} /> : null}
        </View>
        <Text className="text-sm text-textMuted mt-0.5">
          Party of {r.partySize}
          {r.note ? ` · ${r.note}` : ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </View>
  );
}

function EventRow({ e, last }: { e: BusinessEvent; last: boolean }) {
  const pct = Math.round((e.ticketsSold / e.ticketsTotal) * 100);
  return (
    <View className={cn("p-4", !last && "border-b border-border")}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-semibold">{e.title}</Text>
          <Text className="text-sm text-textMuted mt-0.5">{e.when}</Text>
        </View>
        <Text className="font-bold">{money(e.ticketsSold * e.ticketPrice, false)}</Text>
      </View>
      <View className="h-2 rounded-full bg-surface mt-3 overflow-hidden">
        <View className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </View>
      <Text className="text-xs text-textMuted mt-1.5">
        {e.ticketsSold} of {e.ticketsTotal} tickets sold · {money(e.ticketPrice, false)} each
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Recent activity
// ---------------------------------------------------------------------------

const ACTIVITY_ICONS: Record<ActivityKind, IconName> = {
  check_in: "location-outline",
  voucher_sold: "gift-outline",
  review: "star-outline",
  member_joined: "person-add-outline",
  coins_redeemed: "cash-outline",
  influencer_post: "camera-outline",
  reservation: "calendar-outline",
};

function RecentActivity() {
  return (
    <View className="gap-4">
      {mockRecentActivity.map((a) => (
        <View key={a.id} className="flex-row items-start">
          <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
            <Ionicons name={ACTIVITY_ICONS[a.kind]} size={18} color={colors.text} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold">{a.title}</Text>
              <Text className="text-xs text-textMuted">{a.time}</Text>
            </View>
            <Text className="text-sm text-textMuted mt-0.5">{a.detail}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
