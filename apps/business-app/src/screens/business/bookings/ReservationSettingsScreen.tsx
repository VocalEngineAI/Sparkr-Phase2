import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockReservationSettings, type ReservationSettings } from "@sparkr/shared";
import {
  Button,
  Card,
  Chips,
  InfoBanner,
  ListCard,
  money,
  Screen,
  Section,
  Segmented,
  SwitchRow,
  Text,
} from "../../../components/business/kit";
import { cn } from "../../../lib/utils";
import { Stepper, formatDuration, formatHour, formatTime } from "./reservationParts";

// Feature 16 setup, laid out like OpenTable's availability settings: capacity (tables and
// seats), service hours with the bookable times they produce, turn time and
// pacing, party sizes, how far ahead guests can book, waitlist, deposits (party-size
// threshold, fixed or per person), the cancellation / no-show policy, and $0.25 special
// reservations.

const WINDOWS = [7, 14, 30, 60, 90] as const;
const PARTY_SCALE = 12;

export default function ReservationSettingsScreen() {
  const [s, setS] = useState<ReservationSettings>(mockReservationSettings);
  const set = <K extends keyof ReservationSettings>(k: K) => (v: ReservationSettings[K]) => setS((p) => ({ ...p, [k]: v }));

  const seats = s.seats;

  // Bookable times: every interval from opening until the last seating that still fits a
  // full turn before close.
  const lastSeating = s.serviceEnd * 60 - s.turnMinutes;
  const times: number[] = [];
  for (let t = s.serviceStart * 60; t <= lastSeating; t += s.intervalMinutes) times.push(t);
  const perHour = s.maxCoversPerInterval * (60 / s.intervalMinutes);

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
  const exampleParty = Math.max(s.depositThreshold, 6);
  const exampleDeposit = s.depositMode === "per_person" ? s.depositAmount * exampleParty : s.depositAmount;

  return (
    <Screen>
      {/* ---------------- Capacity ---------------- */}
      <Section title="Capacity">
        <Card tone="primary" className="p-5 mb-3">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-xs font-semibold text-primaryLight uppercase tracking-wider">Total capacity</Text>
              <View className="flex-row items-baseline gap-1.5 mt-1">
                <Text className="text-4xl font-extrabold text-background">{seats}</Text>
                <Text className="text-primaryLight">seats</Text>
              </View>
            </View>
            <View className="items-end gap-1">
              <CapacityStat icon="grid-outline" text={`${s.tables} tables`} />
              <CapacityStat icon="people-outline" text={`~${(seats / Math.max(1, s.tables)).toFixed(1).replace(/\.0$/, "")} per table`} />
            </View>
          </View>
        </Card>
        <ListCard>
          <Stepper label="Tables" value={s.tables} onChange={set("tables")} min={1} max={100} />
          <Stepper label="Seats" hint="Guests you can host at once" value={s.seats} onChange={set("seats")} min={s.tables} max={500} step={2} last />
        </ListCard>
      </Section>

      {/* ---------------- Service hours ---------------- */}
      <Section title="Service hours">
        <Card className="gap-4">
          <HoursBar start={s.serviceStart} end={s.serviceEnd} />
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="font-semibold">Bookable times</Text>
              <Text className="text-xs text-textMuted">
                {times.length} a night · last seating {lastSeating >= s.serviceStart * 60 ? formatTime(lastSeating) : "—"}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-1.5">
              {times.map((t) => (
                <View key={t} className="bg-surface rounded-full px-2.5 py-1">
                  <Text className="text-xs font-semibold">{formatTime(t).replace(":00", "")}</Text>
                </View>
              ))}
              {times.length === 0 ? <Text className="text-sm text-warning">Turn time is longer than service hours.</Text> : null}
            </View>
          </View>
        </Card>
        <ListCard className="mt-3">
          <Stepper label="Opens" value={s.serviceStart} onChange={set("serviceStart")} min={9} max={s.serviceEnd - 1} format={formatHour} />
          <Stepper label="Closes" value={s.serviceEnd} onChange={set("serviceEnd")} min={s.serviceStart + 1} max={24} format={formatHour} last />
        </ListCard>
      </Section>

      {/* ---------------- Turn time & pacing ---------------- */}
      <Section title="Turn time & pacing">
        <Segmented
          options={[
            ["15", "Every 15 min"],
            ["30", "Every 30 min"],
          ]}
          value={String(s.intervalMinutes) as "15" | "30"}
          onChange={(v) => set("intervalMinutes")(Number(v) as 15 | 30)}
          className="mb-3"
        />
        <ListCard>
          <Stepper
            label="Turn time"
            hint="How long a party keeps its table"
            value={s.turnMinutes}
            onChange={set("turnMinutes")}
            min={30}
            max={240}
            step={15}
            format={formatDuration}
          />
          <Stepper
            label="Max arrivals"
            hint={`Most guests arriving per ${s.intervalMinutes}-min slot`}
            value={s.maxCoversPerInterval}
            onChange={set("maxCoversPerInterval")}
            min={2}
            max={seats}
            step={2}
            format={String}
            last
          />
        </ListCard>
        <View className="mt-3">
          <PacingBar perHour={perHour} seats={seats} turn={s.turnMinutes} />
        </View>
      </Section>

      {/* ---------------- Party size & window ---------------- */}
      <Section title="Who can book">
        <Card className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold">Party size</Text>
            <Text className="text-sm font-bold">
              {s.minParty}–{s.maxParty} guests
            </Text>
          </View>
          <View className="flex-row justify-between">
            {Array.from({ length: PARTY_SCALE }, (_, i) => i + 1).map((n) => {
              const on = n >= s.minParty && n <= s.maxParty;
              return (
                <View key={n} className={cn("w-[7.4%] aspect-square rounded-full items-center justify-center", on ? "bg-primary" : "bg-surface")}>
                  <Text className={cn("text-[10px] font-bold", on ? "text-background" : "text-textMuted")}>{n}</Text>
                </View>
              );
            })}
          </View>
          <Text className="text-xs text-textMuted">Larger parties are asked to call the restaurant.</Text>
        </Card>
        <ListCard className="mt-3">
          <Stepper label="Smallest party" value={s.minParty} onChange={set("minParty")} min={1} max={s.maxParty} />
          <Stepper label="Largest party" value={s.maxParty} onChange={set("maxParty")} min={s.minParty} max={PARTY_SCALE} last />
        </ListCard>

        <Text className="font-semibold mt-5 mb-2">Book up to</Text>
        <Chips
          options={WINDOWS.map((d) => [String(d), `${d} days`] as const)}
          value={String(s.bookingWindowDays)}
          onChange={(v) => set("bookingWindowDays")(Number(v))}
        />
        <Text className="text-xs text-textMuted mt-2">
          Any Sparkr user can book a free slot up to {s.bookingWindowDays} days ahead with no approval, and gets a confirmation and SMS reminder.
        </Text>
      </Section>

      {/* ---------------- Waitlist ---------------- */}
      <Section title="Waitlist">
        <ListCard>
          <SwitchRow
            icon="people-outline"
            title="Digital waitlist"
            description="Guests join the waitlist in the Sparkr app and get a text when their table is ready"
            value={s.waitlistEnabled}
            onValueChange={set("waitlistEnabled")}
            last
          />
        </ListCard>
      </Section>

      {/* ---------------- Deposits ---------------- */}
      <Section title="Deposits">
        <ListCard className="mb-3">
          <SwitchRow
            icon="cash-outline"
            title="Require deposits"
            description="Collected in the app at booking"
            value={s.depositsEnabled}
            onValueChange={toggleDeposits}
            last={!s.depositsEnabled}
          />
          {s.depositsEnabled ? (
            <>
              <Stepper label="From party size" value={s.depositThreshold} onChange={set("depositThreshold")} min={1} max={s.maxParty} format={(v) => `${v}+`} />
              <Stepper label="Amount" value={s.depositAmount} onChange={set("depositAmount")} min={5} step={5} format={(v) => money(v)} last />
            </>
          ) : null}
        </ListCard>
        {s.depositsEnabled ? (
          <View className="gap-3">
            <Segmented
              options={[
                ["per_person", "Per person"],
                ["per_booking", "Per booking"],
              ]}
              value={s.depositMode}
              onChange={set("depositMode")}
            />
            <Card tone="surface" className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-accent/30 items-center justify-center">
                <Ionicons name="receipt-outline" size={20} color={colors.text} />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-textMuted">Example</Text>
                <Text className="font-semibold">
                  Party of {exampleParty} pays {money(exampleDeposit)}
                </Text>
              </View>
            </Card>
            <InfoBanner tone="warning" text="Your restaurant is responsible for managing each deposit against the final bill." />
          </View>
        ) : null}
      </Section>

      {/* ---------------- Cancellations ---------------- */}
      <Section title="Cancellation policy">
        <PolicyTimeline hours={s.cancellationHours} late={s.cancellationPenalty} noShow={s.noShowPenalty} />
        <ListCard className="mt-3">
          <Stepper label="Free cancellation" hint="Hours before the booking" value={s.cancellationHours} onChange={set("cancellationHours")} min={1} max={72} format={(v) => `${v}h`} />
          <Stepper label="Late-cancel fee" value={s.cancellationPenalty} onChange={set("cancellationPenalty")} step={5} format={(v) => (v ? money(v) : "None")} />
          <Stepper label="No-show fee" value={s.noShowPenalty} onChange={set("noShowPenalty")} step={5} format={(v) => (v ? money(v) : "None")} last />
        </ListCard>
        <Text className="text-xs text-textMuted mt-2">
          10 minutes after each booking starts, you're asked whether the guest arrived. If not, the table is freed and logged as a no-show.
        </Text>
      </Section>

      {/* ---------------- Special ---------------- */}
      <Section title="Special reservations">
        <ListCard>
          <SwitchRow
            icon="sparkles-outline"
            title="Offer special reservations"
            description="Guests pay you $0.25 for a special reservation"
            value={s.specialReservations}
            onValueChange={set("specialReservations")}
            last
          />
        </ListCard>
      </Section>

      <Text className="text-xs text-textMuted text-center -mt-4">
        Not included: floor-plan designer, OpenTable sync, or automatic deposit refunds.
      </Text>

      <Button size="lg" onPress={() => Alert.alert("Saved", "Booking settings updated.")}>
        <Text>Save settings</Text>
      </Button>

    </Screen>
  );
}

function CapacityStat({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>["name"]; text: string }) {
  return (
    <View className="flex-row items-center gap-1.5 bg-primaryLight/15 rounded-full px-2.5 py-1">
      <Ionicons name={icon} size={13} color={colors.primaryLight} />
      <Text className="text-xs font-semibold text-background">{text}</Text>
    </View>
  );
}

/** 9 AM – midnight track (labels every 3h) with the service window highlighted. */
function HoursBar({ start, end }: { start: number; end: number }) {
  const from = 9;
  const to = 24;
  const pct = (h: number) => `${((h - from) / (to - from)) * 100}%` as const;
  return (
    <View>
      <View className="flex-row items-baseline justify-between">
        <Text className="text-2xl font-extrabold">
          {formatHour(start)} – {formatHour(end)}
        </Text>
        <Text className="text-sm text-textMuted">{end - start}h service</Text>
      </View>
      <View className="h-8 rounded-xl bg-surface mt-3 overflow-hidden">
        <View className="absolute top-0 bottom-0 bg-primary rounded-xl" style={{ left: pct(Math.max(from, start)), width: `${((Math.min(to, end) - Math.max(from, start)) / (to - from)) * 100}%` }} />
      </View>
      <View className="flex-row justify-between mt-1.5">
        {[9, 12, 15, 18, 21, 24].map((h) => (
          <Text key={h} className="text-[10px] text-textMuted">
            {formatHour(h)}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** How fast pacing fills the room: guests/hour against total seats. */
function PacingBar({ perHour, seats, turn }: { perHour: number; seats: number; turn: number }) {
  const minutesToFill = Math.ceil((seats / perHour) * 60);
  const pct = Math.min(100, (perHour / seats) * 100);
  const tooFast = minutesToFill < turn;
  return (
    <Card tone="surface" className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold">Up to {perHour} arrivals an hour</Text>
        <Text className="text-xs text-textMuted">{seats} seats</Text>
      </View>
      <View className="h-2.5 rounded-full bg-background overflow-hidden">
        <View className={cn("h-full rounded-full", tooFast ? "bg-warning" : "bg-accent")} style={{ width: `${pct}%` }} />
      </View>
      <Text className={cn("text-xs", tooFast ? "text-warning" : "text-textMuted")}>
        {tooFast
          ? `The room could fill in ${formatDuration(minutesToFill)}, before the first tables turn. Consider fewer arrivals per slot.`
          : `A full room takes about ${formatDuration(minutesToFill)} to seat, so the kitchen never gets everyone at once.`}
      </Text>
    </Card>
  );
}

/** Free → late fee → no-show, drawn as one bar ending at the booking time. */
function PolicyTimeline({ hours, late, noShow }: { hours: number; late: number; noShow: number }) {
  return (
    <Card className="gap-3">
      <View className="flex-row h-3 rounded-full overflow-hidden gap-0.5">
        <View className="flex-[3] bg-success" />
        <View className="flex-[2] bg-accent" />
        <View className="flex-1 bg-warning" />
      </View>
      <View className="flex-row">
        <PolicyStep className="flex-[3]" title="Free" detail={`Until ${hours}h before`} />
        <PolicyStep className="flex-[2]" title={late ? money(late) : "No fee"} detail="Late cancel" />
        <PolicyStep className="flex-1" title={noShow ? money(noShow) : "No fee"} detail="No-show" />
      </View>
      <View className="flex-row items-center gap-1.5">
        <Ionicons name="eye-outline" size={13} color={colors.textMuted} />
        <Text className="text-xs text-textMuted">Guests see this policy before they confirm a booking.</Text>
      </View>
    </Card>
  );
}

function PolicyStep({ title, detail, className }: { title: string; detail: string; className?: string }) {
  return (
    <View className={cn("pr-2", className)}>
      <Text className="font-bold">{title}</Text>
      <Text className="text-[11px] text-textMuted">{detail}</Text>
    </View>
  );
}
