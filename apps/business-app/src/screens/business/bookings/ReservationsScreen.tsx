import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockReservationSettings, mockReservations, mockWaitlist, type Reservation } from "@sparkr/shared";
import {
  Actions,
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
} from "../../../components/business/kit";
import { cn } from "../../../lib/utils";
import type { BookingsScreenProps } from "../../../navigation/businessTypes";

// Feature 16: schedule view by day, bookings with party size / table / deposit / notes,
// arrival check & no-shows, manual phone bookings, business-initiated chat, and the
// digital waitlist in the same view.

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const STATUS = {
  confirmed: { label: "Confirmed", tone: "neutral" },
  seated: { label: "Seated", tone: "success" },
  cancelled: { label: "Cancelled", tone: "warning" },
  no_show: { label: "No-show", tone: "warning" },
} as const;

export default function ReservationsScreen({ navigation }: BookingsScreenProps<"Reservations">) {
  const [day, setDay] = useState(0);
  const [tab, setTab] = useState<"bookings" | "waitlist">("bookings");
  const [reservations, setReservations] = useState(mockReservations);
  const [waitlist, setWaitlist] = useState(mockWaitlist);

  useHeaderButton(navigation, {
    label: "Settings",
    icon: "options-outline",
    onPress: () => navigation.navigate("ReservationSettings"),
  });

  const setStatus = (id: string, status: Reservation["status"]) =>
    setReservations((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));

  const cancel = (r: Reservation) =>
    Alert.alert("Cancel reservation?", `${r.guestName}, party of ${r.partySize} at ${r.time}. The guest gets an SMS.`, [
      { text: "Keep", style: "cancel" },
      { text: "Cancel booking", style: "destructive", onPress: () => setStatus(r.id, "cancelled") },
    ]);

  const days = Array.from({ length: 7 }, (_, offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return { offset, label: offset === 0 ? "Today" : DAY[d.getDay()], date: d.getDate() };
  });

  const shown = reservations.filter((r) => r.dayOffset === day).sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  const guests = shown.filter((r) => r.status !== "cancelled").reduce((n, r) => n + r.partySize, 0);
  const seatsLeft = mockReservationSettings.seats - guests;

  return (
    <Screen>
      <View className="flex-row justify-between">
        {days.map((d) => {
          const selected = d.offset === day;
          return (
            <Button
              key={d.offset}
              variant={selected ? "default" : "secondary"}
              className="w-[13%] h-14 flex-col gap-0 px-0 rounded-xl"
              onPress={() => setDay(d.offset)}
              accessibilityState={{ selected }}
            >
              <Text className="text-[10px]">{d.label}</Text>
              <Text className="text-base font-bold">{d.date}</Text>
            </Button>
          );
        })}
      </View>

      <View className="flex-row gap-3">
        <Card tone="surface" className="flex-1 p-3">
          <Text className="text-xs text-textMuted">Bookings</Text>
          <Text className="text-xl font-extrabold">{shown.filter((r) => r.status !== "cancelled").length}</Text>
        </Card>
        <Card tone="surface" className="flex-1 p-3">
          <Text className="text-xs text-textMuted">Guests</Text>
          <Text className="text-xl font-extrabold">{guests}</Text>
        </Card>
        <Card tone="surface" className="flex-1 p-3">
          <Text className="text-xs text-textMuted">Seats free</Text>
          <Text className="text-xl font-extrabold">{Math.max(0, seatsLeft)}</Text>
        </Card>
      </View>

      {day === 0 ? (
        <Segmented
          options={[
            ["bookings", `Reservations (${shown.length})`],
            ["waitlist", `Waitlist (${waitlist.length})`],
          ]}
          value={tab}
          onChange={setTab}
        />
      ) : null}

      {tab === "waitlist" && day === 0 ? (
        <View className="gap-3">
          {waitlist.length === 0 ? (
            <EmptyState icon="people-outline" title="Waitlist is empty" />
          ) : (
            waitlist.map((w) => (
              <Card key={w.id}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-bold">{w.name}</Text>
                    <Text className="text-sm text-textMuted">
                      Party of {w.partySize} · joined {w.joined} · quoted {w.quotedWait}
                    </Text>
                  </View>
                </View>
                <Actions>
                  <Button variant="ghost" size="sm" onPress={() => setWaitlist((l) => l.filter((x) => x.id !== w.id))}>
                    <Text>Remove</Text>
                  </Button>
                  <Button variant="outline" size="sm" onPress={() => notYet("Notify guest", `Texts ${w.name} that their table is ready.`)}>
                    <Text>Notify</Text>
                  </Button>
                  <Button size="sm" onPress={() => setWaitlist((l) => l.filter((x) => x.id !== w.id))}>
                    <Text>Seat</Text>
                  </Button>
                </Actions>
              </Card>
            ))
          )}
        </View>
      ) : (
        <View className="gap-3">
          {shown.length === 0 ? (
            <EmptyState icon="calendar-outline" title="No bookings this day" />
          ) : (
            shown.map((r) => (
              <ReservationCard
                key={r.id}
                r={r}
                isToday={day === 0}
                onSeat={() => setStatus(r.id, "seated")}
                onNoShow={() => setStatus(r.id, "no_show")}
                onCancel={() => cancel(r)}
              />
            ))
          )}
        </View>
      )}

      <Button
        variant="outline"
        size="lg"
        onPress={() => notYet("Add phone booking", "Enter the guest's name, phone, party size and time.")}
      >
        <Ionicons name="call-outline" size={16} color={colors.text} />
        <Text>Add phone booking</Text>
      </Button>
    </Screen>
  );
}

function ReservationCard({
  r,
  isToday,
  onSeat,
  onNoShow,
  onCancel,
}: {
  r: Reservation;
  isToday: boolean;
  onSeat: () => void;
  onNoShow: () => void;
  onCancel: () => void;
}) {
  const s = STATUS[r.status];
  const open = r.status === "confirmed";
  return (
    <Card className={cn(!open && "opacity-70")}>
      <View className="flex-row">
        <View className="w-16">
          <Text className="font-extrabold">{r.time.replace(/ (AM|PM)$/, "")}</Text>
          <Text className="text-xs text-textMuted">{r.time.match(/(AM|PM)$/)?.[0]}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Text className="font-bold">{r.guestName}</Text>
            {r.vip ? <Badge label="VIP" tone="accent" icon="star" /> : null}
            {r.source === "phone" ? <Badge label="Phone" icon="call-outline" /> : null}
            {r.special ? <Badge label="Special" icon="sparkles-outline" /> : null}
          </View>
          <Text className="text-sm text-textMuted mt-0.5">
            Party of {r.partySize}
            {r.table ? ` · ${r.table}` : ""}
          </Text>
          {r.note ? <Text className="text-sm mt-1">“{r.note}”</Text> : null}
        </View>
        <Badge label={s.label} tone={s.tone} />
      </View>

      {r.deposit ? (
        <View className="mt-3">
          <InfoBanner
            tone="warning"
            icon="cash-outline"
            text={`${money(r.deposit)} deposit paid in app. Your restaurant is responsible for managing this deposit against the final bill.`}
          />
        </View>
      ) : null}

      {open ? (
        <Actions>
          <Button variant="ghost" size="icon" onPress={() => notYet("Message guest", "Chat with the guest if something changes, e.g. overbooking.")} accessibilityLabel="Message guest">
            <Ionicons name="chatbubble-outline" size={18} color={colors.text} />
          </Button>
          <Button variant="ghost" size="sm" onPress={onCancel}>
            <Text>Cancel</Text>
          </Button>
          {isToday ? (
            <>
              <Button variant="outline" size="sm" onPress={onNoShow}>
                <Text>No-show</Text>
              </Button>
              <Button size="sm" onPress={onSeat}>
                <Text>Arrived</Text>
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onPress={() => notYet("Modify booking", "Change the time, party size or table; the guest gets an SMS.")}>
              <Text>Modify</Text>
            </Button>
          )}
        </Actions>
      ) : null}
    </Card>
  );
}

function toMinutes(t: string) {
  const m = t.match(/(\d+):(\d+) (AM|PM)/);
  if (!m) return 0;
  const h = (Number(m[1]) % 12) + (m[3] === "PM" ? 12 : 0);
  return h * 60 + Number(m[2]);
}
