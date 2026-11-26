import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import {
  Actions,
  Badge,
  Button,
  IconCircle,
  LinkButton,
  ListCard,
  money,
  notYet,
  ProgressBar,
  Section,
  Segmented,
  StatStrip,
  Text,
  type IconName,
} from "../../components/business/kit";
import { cn } from "../../lib/utils";
import type { HomeScreenProps } from "../../navigation/businessTypes";

type Nav = HomeScreenProps["navigation"];

// Business home dashboard: overview → what needs attention → shortcuts → how it's going →
// what's coming up → what just happened. Everything is mock data from @sparkr/shared.

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// Deep links into a tab's stack. `initial: false` keeps the tab's hub underneath, so back
// returns to it.
const go = {
  campaigns: (n: Nav) => n.navigate("Marketing", { screen: "Campaigns", initial: false }),
  deals: (n: Nav) => n.navigate("Marketing", { screen: "Deals", initial: false }),
  sms: (n: Nav) => n.navigate("Marketing", { screen: "Messaging", initial: false }),
  scan: (n: Nav) => n.navigate("Customers", { screen: "CoinScanner", initial: false }),
  reservations: (n: Nav) => n.navigate("Bookings", { screen: "Reservations", initial: false }),
  events: (n: Nav) => n.navigate("Bookings", { screen: "Events", initial: false }),
  wallet: (n: Nav) => n.navigate("More", { screen: "Wallet", initial: false }),
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [actions, setActions] = useState(mockActionRequired);

  const dismiss = (id: string) => setActions((list) => list.filter((a) => a.id !== id));
  const openAction = (item: ActionRequiredItem) => {
    if (item.kind === "arrival_check") go.reservations(navigation);
    else if (item.kind === "wallet_low") go.wallet(navigation);
    else go.campaigns(navigation);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Header alertCount={actions.length} />

      <View className="px-5 gap-8">
        <OverviewCard onTopUp={() => go.wallet(navigation)} />

        {actions.length > 0 ? (
          <Section title="Needs your attention" count={actions.length}>
            <View className="gap-3">
              {actions.map((item) => (
                <ActionCard key={item.id} item={item} onDone={() => dismiss(item.id)} onOpen={() => openAction(item)} />
              ))}
            </View>
          </Section>
        ) : null}

        <Section title="Quick actions">
          <QuickActions navigation={navigation} />
        </Section>

        <Section title="Performance" subtitle="Last 7 days">
          <StatStrip items={mockPerformanceHighlights} />
        </Section>

        <Upcoming navigation={navigation} />

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

function OverviewCard({ onTopUp }: { onTopUp: () => void }) {
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
          <Text className="text-3xl font-extrabold text-background mt-1">{money(mockBusiness.walletBalance, true)}</Text>
          <Text className="text-xs text-primaryLight mt-1">
            {mockBusinessOverview.activeCampaigns} campaigns · {mockBusinessOverview.activeDeals} deals live
          </Text>
        </View>
        <Button variant="secondary" size="sm" onPress={onTopUp}>
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
// Action required
// ---------------------------------------------------------------------------

const ACTION_ICONS: Record<ActionRequiredItem["kind"], IconName> = {
  arrival_check: "time-outline",
  campaign_payment: "card-outline",
  post_review: "images-outline",
  applicants: "person-add-outline",
  wallet_low: "wallet-outline",
};

function ActionCard({ item, onDone, onOpen }: { item: ActionRequiredItem; onDone: () => void; onOpen: () => void }) {
  return (
    <View
      className={cn(
        "rounded-2xl border p-4",
        item.urgent ? "border-warning/40 bg-warning/5" : "border-border bg-background"
      )}
    >
      <View className="flex-row">
        <View className="mr-3">
          <IconCircle icon={ACTION_ICONS[item.kind]} tone={item.urgent ? "warning" : "neutral"} />
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

      <Actions>
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
      </Actions>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------

function QuickActions({ navigation }: { navigation: Nav }) {
  const items: { label: string; icon: IconName; open: (n: Nav) => void }[] = [
    { label: "New campaign", icon: "megaphone-outline", open: go.campaigns },
    { label: "Create deal", icon: "pricetag-outline", open: go.deals },
    { label: "Send SMS", icon: "chatbubble-ellipses-outline", open: go.sms },
    { label: "Scan QR", icon: "qr-code-outline", open: go.scan },
    { label: "Bookings", icon: "restaurant-outline", open: go.reservations },
    { label: "Events", icon: "ticket-outline", open: go.events },
  ];

  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {items.map((a) => (
        <Button
          key={a.label}
          variant="secondary"
          className="w-[31.5%] h-auto flex-col gap-2 py-4 px-2"
          onPress={() => a.open(navigation)}
        >
          <Ionicons name={a.icon} size={24} color={colors.text} />
          <Text className="text-xs text-center">{a.label}</Text>
        </Button>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Upcoming reservations & events
// ---------------------------------------------------------------------------

function Upcoming({ navigation }: { navigation: Nav }) {
  const [tab, setTab] = useState<"reservations" | "events">("reservations");

  return (
    <Section
      title="Coming up"
      action={
        <LinkButton
          label="See all"
          onPress={() => (tab === "reservations" ? go.reservations(navigation) : go.events(navigation))}
        />
      }
    >
      <Segmented
        options={[
          ["reservations", `Reservations (${mockUpcomingReservations.length})`],
          ["events", `Events (${mockUpcomingEvents.length})`],
        ]}
        value={tab}
        onChange={setTab}
        className="mb-3"
      />

      <ListCard>
        {tab === "reservations"
          ? mockUpcomingReservations.map((r, i) => (
              <ReservationRow key={r.id} r={r} last={i === mockUpcomingReservations.length - 1} />
            ))
          : mockUpcomingEvents.map((e, i) => <EventRow key={e.id} e={e} last={i === mockUpcomingEvents.length - 1} />)}
      </ListCard>
    </Section>
  );
}

function ReservationRow({ r, last }: { r: Reservation; last: boolean }) {
  return (
    <View className={cn("flex-row items-center p-4", !last && "border-b border-border")}>
      <View className="w-16">
        <Text className="font-bold">{r.time.replace(/ (AM|PM)$/, "")}</Text>
        <Text className="text-xs text-textMuted">{r.time.match(/(AM|PM)$/)?.[0]}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5 flex-wrap">
          <Text className="font-semibold">{r.guestName}</Text>
          {r.vip ? <Badge label="VIP" tone="accent" /> : null}
          {r.deposit ? <Badge label={`${money(r.deposit)} deposit`} /> : null}
        </View>
        <Text className="text-sm text-textMuted mt-0.5">
          Party of {r.partySize}
          {r.note ? ` · ${r.note}` : ""}
        </Text>
      </View>
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
        <Text className="font-bold">{money(e.ticketsSold * e.ticketPrice)}</Text>
      </View>
      <ProgressBar pct={pct} className="mt-3" />
      <Text className="text-xs text-textMuted mt-1.5">
        {e.ticketsSold} of {e.ticketsTotal} tickets sold · {money(e.ticketPrice)} each
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
          <View className="mr-3">
            <IconCircle icon={ACTIVITY_ICONS[a.kind]} />
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

