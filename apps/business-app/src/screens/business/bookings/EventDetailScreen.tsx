import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockEventInfluencers, mockEvents, mockPromoCodes } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  LinkButton,
  ListCard,
  ListRow,
  money,
  notYet,
  ProgressBar,
  Screen,
  Section,
  StatGrid,
  SwitchRow,
  Text,
} from "../../../components/business/kit";
import type { BookingsScreenProps } from "../../../navigation/businessTypes";
import { SPARKR_TICKET_FEE } from "./EventsScreen";

// One event's sales dashboard (sold/remaining, revenue, promo code use), promo codes, and
// influencer promotion: commission per referred ticket, unique codes, referral tracking.
// The business pays influencer commission from its share (after Sparkr's 10%).

export default function EventDetailScreen({ route, navigation }: BookingsScreenProps<"EventDetail">) {
  const e = mockEvents.find((x) => x.id === route.params.eventId);
  const [status, setStatus] = useState(e?.status);
  const [promoteOpen, setPromoteOpen] = useState(mockEventInfluencers.some((i) => i.eventId === e?.id));

  if (!e) return <EmptyState icon="ticket-outline" title="Event not found" />;

  const codes = mockPromoCodes.filter((p) => p.eventId === e.id);
  const influencers = mockEventInfluencers.filter((i) => i.eventId === e.id);
  const gross = e.ticketsSold * e.ticketPrice;
  const fee = gross * SPARKR_TICKET_FEE;
  const commission = influencers.reduce((n, i) => n + i.ticketsSold * i.commissionPerTicket, 0);

  const publish = () =>
    Alert.alert("Publish event?", `Sparkr's 10% fee is ${money(e.ticketPrice * SPARKR_TICKET_FEE, true)} per ${money(e.ticketPrice)} ticket. The event appears in the customer app right away.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Publish", onPress: () => setStatus("published") },
    ]);

  return (
    <Screen>
      <View>
        <Text className="text-2xl font-extrabold">{e.title}</Text>
        <Text className="text-sm text-textMuted mt-1">
          {e.when} · {e.venue}
        </Text>
        <Text className="text-sm mt-2">{e.description}</Text>
      </View>

      {status === "draft" ? (
        <Button size="lg" onPress={publish}>
          <Text>Publish event</Text>
        </Button>
      ) : status === "published" ? (
        <Button size="lg" onPress={() => navigation.navigate("TicketScanner", { eventId: e.id })}>
          <Ionicons name="qr-code-outline" size={18} color={colors.background} />
          <Text>Scan tickets at the door</Text>
        </Button>
      ) : null}

      <Section title="Sales">
        <StatGrid
          items={[
            { label: "Tickets sold", value: `${e.ticketsSold}`, hint: `${e.ticketsTotal - e.ticketsSold} remaining` },
            { label: "Checked in", value: `${e.checkedIn}`, hint: `of ${e.ticketsSold}` },
            { label: "Gross revenue", value: money(gross) },
            { label: "Your share", value: money(gross - fee - commission), hint: "After 10% fee & commission" },
          ]}
        />
        <ProgressBar pct={(e.ticketsSold / e.ticketsTotal) * 100} className="mt-3" />
        <Text className="text-xs text-textMuted mt-1.5">
          Sales stop automatically at {e.ticketsTotal} tickets and the event shows Sold Out.
        </Text>
      </Section>

      <Section
        title="Promo codes"
        action={<LinkButton label="Add" onPress={() => notYet("New promo code", "Percent or fixed amount off, a use limit and an expiry date.")} />}
      >
        {codes.length === 0 ? (
          <Text className="text-sm text-textMuted">No promo codes yet.</Text>
        ) : (
          <ListCard>
            {codes.map((p, i) => (
              <ListRow
                key={p.id}
                icon="pricetag-outline"
                title={p.code}
                subtitle={`${p.discountType === "percent" ? `${p.amount}% off` : `${money(p.amount)} off`} · expires ${p.expires}`}
                right={<Text className="text-sm font-semibold">{p.uses}/{p.limit} used</Text>}
                chevron={false}
                last={i === codes.length - 1}
              />
            ))}
          </ListCard>
        )}
      </Section>

      <Section title="Influencer promotion">
        <ListCard className="mb-3">
          <SwitchRow
            icon="megaphone-outline"
            title="Open to influencers"
            description="Influencers share a unique code or link and earn commission on each ticket sold."
            value={promoteOpen}
            onValueChange={setPromoteOpen}
            last
          />
        </ListCard>
        {promoteOpen ? (
          influencers.length === 0 ? (
            <Text className="text-sm text-textMuted">No influencers have joined yet.</Text>
          ) : (
            <Card>
              <View className="gap-3">
                {influencers.map((i) => (
                  <View key={i.id} className="flex-row items-center">
                    <View className="flex-1">
                      <Text className="font-semibold">{i.handle}</Text>
                      <Text className="text-xs text-textMuted">
                        Code {i.code} · {money(i.commissionPerTicket)}/ticket
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="font-bold">{i.ticketsSold} tickets</Text>
                      <Badge label={`${money(i.ticketsSold * i.commissionPerTicket)} earned`} tone="accent" />
                    </View>
                  </View>
                ))}
              </View>
              <Text className="text-xs text-textMuted mt-3">
                You pay {money(commission)} commission from your share. Sparkr's 10% is taken from every sale.
              </Text>
            </Card>
          )
        ) : null}
      </Section>
    </Screen>
  );
}
