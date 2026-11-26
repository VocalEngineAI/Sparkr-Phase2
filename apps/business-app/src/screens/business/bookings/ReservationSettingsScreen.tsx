import React, { useState } from "react";
import { Alert, View } from "react-native";
import { mockReservationSettings, type ReservationSettings } from "@sparkr/shared";
import {
  Button,
  Card,
  InfoBanner,
  ListCard,
  money,
  Screen,
  Section,
  Segmented,
  SwitchRow,
  Text,
} from "../../../components/business/kit";

// Feature 16 setup: capacity (tables, seats, slot length), waitlist on/off, deposits
// (party-size threshold, fixed or per person), cancellation deadline/penalty, no-show
// penalty, special reservations ($0.25).

function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  format = String,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  format?: (v: number) => string;
}) {
  return (
    <View className="flex-row items-center px-4 py-3 border-b border-border bg-background">
      <Text className="font-semibold flex-1">{label}</Text>
      <Button variant="secondary" size="icon" className="w-9 h-9 rounded-full" onPress={() => onChange(Math.max(min, value - step))} accessibilityLabel={`Decrease ${label}`}>
        <Text className="text-lg">−</Text>
      </Button>
      <Text className="font-bold w-16 text-center">{format(value)}</Text>
      <Button variant="secondary" size="icon" className="w-9 h-9 rounded-full" onPress={() => onChange(value + step)} accessibilityLabel={`Increase ${label}`}>
        <Text className="text-lg">+</Text>
      </Button>
    </View>
  );
}

export default function ReservationSettingsScreen() {
  const [s, setS] = useState<ReservationSettings>(mockReservationSettings);
  const set = <K extends keyof ReservationSettings>(k: K) => (v: ReservationSettings[K]) => setS((p) => ({ ...p, [k]: v }));

  // Same warning as on each booking, shown when deposits are switched on (slide 33).
  const toggleDeposits = (on: boolean) => {
    if (!on) return set("depositsEnabled")(false);
    Alert.alert(
      "Turn on deposits?",
      "Sparkr collects deposits when guests book, but does not apply, refund or reconcile them. Your restaurant is responsible for managing each deposit against the final bill.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "I understand", onPress: () => set("depositsEnabled")(true) },
      ]
    );
  };

  return (
    <Screen>
      <Section title="Capacity">
        <ListCard>
          <Stepper label="Tables" value={s.tables} onChange={set("tables")} min={1} />
          <Stepper label="Seats" value={s.seats} onChange={set("seats")} min={1} step={2} />
          <Stepper label="Slot length" value={s.slotMinutes} onChange={set("slotMinutes")} min={30} step={15} format={(v) => `${v} min`} />
          <SwitchRow
            title="Digital waitlist"
            description="Guests join the waitlist in the Sparkr app"
            value={s.waitlistEnabled}
            onValueChange={set("waitlistEnabled")}
            last
          />
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">
          Any Sparkr user can book a free slot with no approval and gets a confirmation and SMS reminder.
        </Text>
      </Section>

      <Section title="Deposits">
        <ListCard className="mb-3">
          <SwitchRow
            title="Require deposits"
            description="Collected in the app at booking"
            value={s.depositsEnabled}
            onValueChange={toggleDeposits}
            last={!s.depositsEnabled}
          />
          {s.depositsEnabled ? (
            <>
              <Stepper label="From party size" value={s.depositThreshold} onChange={set("depositThreshold")} min={1} />
              <Stepper label="Amount" value={s.depositAmount} onChange={set("depositAmount")} min={5} step={5} format={(v) => money(v)} />
            </>
          ) : null}
        </ListCard>
        {s.depositsEnabled ? (
          <>
            <Segmented
              options={[
                ["per_person", "Per person"],
                ["per_booking", "Per booking"],
              ]}
              value={s.depositMode}
              onChange={set("depositMode")}
              className="mb-3"
            />
            <InfoBanner
              tone="warning"
              text={`Parties of ${s.depositThreshold}+ pay ${money(s.depositAmount)} ${s.depositMode === "per_person" ? "per person" : "per booking"}. Your restaurant is responsible for managing each deposit against the final bill.`}
            />
          </>
        ) : null}
      </Section>

      <Section title="Cancellations & no-shows">
        <ListCard>
          <Stepper label="Cancel up to" value={s.cancellationHours} onChange={set("cancellationHours")} min={1} step={1} format={(v) => `${v}h before`} />
          <Stepper label="Late-cancel penalty" value={s.cancellationPenalty} onChange={set("cancellationPenalty")} step={5} format={(v) => (v ? money(v) : "None")} />
          <Stepper label="No-show penalty" value={s.noShowPenalty} onChange={set("noShowPenalty")} step={5} format={(v) => (v ? money(v) : "None")} />
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">
          10 minutes after each booking starts, you're asked whether the guest arrived. If not, the slot is freed and logged as a no-show.
        </Text>
      </Section>

      <Section title="Special reservations">
        <ListCard>
          <SwitchRow
            title="Offer special reservations"
            description="Guests pay you $0.25 for a special reservation"
            value={s.specialReservations}
            onValueChange={set("specialReservations")}
            last
          />
        </ListCard>
      </Section>

      <Card tone="surface">
        <Text className="text-sm">
          Not included: floor-plan designer, OpenTable sync, or automatic deposit refunds.
        </Text>
      </Card>

      <Button size="lg" onPress={() => Alert.alert("Saved", "Booking settings updated.")}>
        <Text>Save settings</Text>
      </Button>
    </Screen>
  );
}
