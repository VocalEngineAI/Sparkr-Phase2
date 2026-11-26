import React from "react";
import { View } from "react-native";
import { mockEvents, mockReservations, mockWaitlist } from "@sparkr/shared";
import { FeatureCard, Screen, StatGrid } from "../../../components/business/kit";
import type { BookingsScreenProps } from "../../../navigation/businessTypes";

// Bookings: reservations/waitlist and events/tickets together, since both manage customer
// attendance at scheduled times.

export default function BookingsHubScreen({ navigation }: BookingsScreenProps<"BookingsHub">) {
  const today = mockReservations.filter((r) => r.dayOffset === 0 && r.status !== "cancelled");
  const covers = today.reduce((n, r) => n + r.partySize, 0);
  const published = mockEvents.filter((e) => e.status === "published");
  const ticketsLeft = published.reduce((n, e) => n + e.ticketsTotal - e.ticketsSold, 0);

  return (
    <Screen hub title="Bookings" subtitle="Reservations, waitlist and events">
      <StatGrid
        items={[
          { label: "Bookings today", value: String(today.length), hint: `${covers} guests` },
          { label: "On the waitlist", value: String(mockWaitlist.length) },
          { label: "Upcoming events", value: String(published.length) },
          { label: "Tickets left", value: String(ticketsLeft) },
        ]}
      />
      <View className="gap-3">
        <FeatureCard
          icon="restaurant-outline"
          title="Reservations & Waitlist"
          description="Calendar, table availability, bookings, deposits, cancellations and waitlist."
          meta={`${today.length} today · ${mockWaitlist.length} waiting`}
          onPress={() => navigation.navigate("Reservations")}
        />
        <FeatureCard
          icon="ticket-outline"
          title="Events & Tickets"
          description="Create events, publish tickets, set prices, quantities and promo codes."
          meta={`${published.length} on sale`}
          onPress={() => navigation.navigate("Events")}
        />
        <FeatureCard
          icon="qr-code-outline"
          title="Ticket Scanner"
          description="Scan customer QR tickets at the event entrance and mark them as used."
          onPress={() => navigation.navigate("TicketScanner")}
        />
      </View>
    </Screen>
  );
}
