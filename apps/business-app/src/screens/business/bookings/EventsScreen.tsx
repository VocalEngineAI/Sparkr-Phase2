import React, { useState } from "react";
import { View } from "react-native";
import { mockEvents, type BusinessEvent } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  InfoBanner,
  money,
  notYet,
  ProgressBar,
  Screen,
  Segmented,
  Text,
  useHeaderButton,
} from "../../../components/business/kit";
import type { BookingsScreenProps } from "../../../navigation/businessTypes";

// Events & tickets (slides 48–49): create and publish events with a price and max
// quantity; sales stop at sell-out. Sparkr takes 10% of each ticket sale.

export const SPARKR_TICKET_FEE = 0.1;

export default function EventsScreen({ navigation }: BookingsScreenProps<"Events">) {
  const [status, setStatus] = useState<BusinessEvent["status"]>("published");

  useHeaderButton(navigation, {
    label: "New",
    icon: "add",
    onPress: () =>
      notYet(
        "New event",
        "Title, description, date, start/end time, venue and photos; ticket price and quantity; optional promo codes. Save as draft or publish."
      ),
  });

  const count = (s: BusinessEvent["status"]) => mockEvents.filter((e) => e.status === s).length;
  const shown = mockEvents.filter((e) => e.status === status);

  return (
    <Screen>
      <Segmented
        options={[
          ["published", `On sale (${count("published")})`],
          ["draft", `Drafts (${count("draft")})`],
          ["past", `Past (${count("past")})`],
        ]}
        value={status}
        onChange={setStatus}
      />

      <View className="gap-3">
        {shown.length === 0 ? (
          <EmptyState icon="ticket-outline" title="No events here" />
        ) : (
          shown.map((e) => (
            <EventCard key={e.id} e={e} onOpen={() => navigation.navigate("EventDetail", { eventId: e.id })} />
          ))
        )}
      </View>

      <InfoBanner text="Customers pay in the app and the money goes to you via Stripe Connect. Sparkr takes 10% of every ticket sale. Drafts stay private until you publish." />
    </Screen>
  );
}

function EventCard({ e, onOpen }: { e: BusinessEvent; onOpen: () => void }) {
  const soldOut = e.ticketsSold >= e.ticketsTotal;
  const revenue = e.ticketsSold * e.ticketPrice;
  return (
    <Button variant="outline" className="h-auto flex-col items-stretch gap-0 rounded-2xl p-4" onPress={onOpen}>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bold text-base">{e.title}</Text>
          <Text className="text-sm text-textMuted mt-0.5">{e.when}</Text>
          <Text className="text-xs text-textMuted mt-0.5">{e.venue}</Text>
        </View>
        {soldOut ? <Badge label="Sold out" tone="success" /> : e.status === "draft" ? <Badge label="Draft" /> : null}
      </View>
      <ProgressBar pct={(e.ticketsSold / e.ticketsTotal) * 100} className="mt-3" />
      <View className="flex-row justify-between mt-1.5">
        <Text className="text-xs text-textMuted">
          {e.ticketsSold}/{e.ticketsTotal} sold · {money(e.ticketPrice)} each
        </Text>
        <Text className="text-xs font-semibold">{money(revenue * (1 - SPARKR_TICKET_FEE))} net</Text>
      </View>
    </Button>
  );
}
