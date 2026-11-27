// Pieces shared by the Reservations and Booking Settings screens: time helpers, the
// bottom sheet, party-size avatar, waitlist ring, table shapes and the +/- stepper.

import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { DiningTable, Reservation } from "@sparkr/shared";
import { Button, Text, type Tone } from "../../../components/business/kit";
import { cn } from "../../../lib/utils";

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------

/** Mock "now" for today's service (6:45 PM), so the demo looks the same at any hour. */
export const NOW_MINUTES = 18 * 60 + 45;

/** "7:30 PM" → minutes since midnight. */
export function toMinutes(t: string) {
  const m = t.match(/(\d+):(\d+) (AM|PM)/);
  if (!m) return 0;
  const h = (Number(m[1]) % 12) + (m[3] === "PM" ? 12 : 0);
  return h * 60 + Number(m[2]);
}

/** Minutes since midnight → "7:30 PM". */
export function formatTime(minutes: number) {
  const h24 = Math.floor(minutes / 60) % 24;
  const mm = String(minutes % 60).padStart(2, "0");
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${h24 >= 12 ? "PM" : "AM"}`;
}

/** 17 → "5 PM"; 24 → "12 AM". */
export function formatHour(hour: number) {
  const h24 = hour % 24;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12} ${h24 >= 12 ? "PM" : "AM"}`;
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ---------------------------------------------------------------------------
// Reservations
// ---------------------------------------------------------------------------

export const STATUS: Record<Reservation["status"], { label: string; tone: Tone; dot: string }> = {
  confirmed: { label: "Booked", tone: "neutral", dot: "bg-primary" },
  seated: { label: "Seated", tone: "success", dot: "bg-success" },
  finished: { label: "Done", tone: "neutral", dot: "bg-border" },
  cancelled: { label: "Cancelled", tone: "warning", dot: "bg-border" },
  no_show: { label: "No-show", tone: "warning", dot: "bg-warning" },
};

export const isActive = (r: Reservation) => r.status === "confirmed" || r.status === "seated";
export const counts = (r: Reservation) => r.status !== "cancelled" && r.status !== "no_show";

/** Confirmed, today, and more than 15 minutes past the booked time. */
export function isLate(r: Reservation, isToday: boolean) {
  return isToday && r.status === "confirmed" && NOW_MINUTES - toMinutes(r.time) > 15;
}

/** ["T9","T10"] → "T9 + T10"; counter seats ["C3","C4"] → "Counter 3–4". */
export function tableLabel(ids: string[] | undefined, tables: DiningTable[]) {
  if (!ids?.length) return "No table yet";
  const found = ids.map((id) => tables.find((t) => t.id === id)).filter(Boolean) as DiningTable[];
  const counter = found.filter((t) => t.area === "counter").map((t) => t.label);
  const dining = found.filter((t) => t.area === "dining").map((t) => t.label);
  const parts = [...dining];
  if (counter.length) parts.push(`Counter ${counter.length > 1 ? `${counter[0]}–${counter[counter.length - 1]}` : counter[0]}`);
  return parts.join(" + ") || ids.join(" + ");
}

export type TableState = { kind: "free" | "reserved" | "seated"; r?: Reservation };

/** What each table is doing: seated now, next booking held for it, or free. */
export function floorState(tables: DiningTable[], dayReservations: Reservation[]) {
  const state: Record<string, TableState> = {};
  for (const t of tables) state[t.id] = { kind: "free" };
  for (const r of dayReservations) {
    if (r.status === "seated") r.tableIds?.forEach((id) => (state[id] = { kind: "seated", r }));
  }
  const upcoming = dayReservations.filter((r) => r.status === "confirmed").sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  for (const r of upcoming) {
    r.tableIds?.forEach((id) => {
      if (state[id]?.kind === "free") state[id] = { kind: "reserved", r };
    });
  }
  return state;
}

// ---------------------------------------------------------------------------
// Bottom sheet
// ---------------------------------------------------------------------------

export function Sheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(20,33,61,0.45)" }}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
        {/* Reanimated views don't take NativeWind classes, so styling lives on the inner View. */}
        <Animated.View entering={SlideInDown.duration(260)} style={{ maxHeight: "88%" }}>
          <View className="bg-background rounded-t-[28px]" style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="items-center pt-2.5 pb-1">
            <View className="w-10 h-1 rounded-full bg-border" />
          </View>
          <View className="flex-row items-center px-5 pt-1 pb-2 min-h-[44px]">
            <Text className="flex-1 text-lg font-bold">{title}</Text>
            <Button variant="secondary" size="icon" className="w-9 h-9 rounded-full" onPress={onClose} accessibilityLabel="Close">
              <Ionicons name="close" size={18} color={colors.text} />
            </Button>
          </View>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8, gap: 16 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Visual bits
// ---------------------------------------------------------------------------

/** Round party-size badge: the number of guests with a people glyph. */
export function PartyAvatar({ size: n, big, muted }: { size: number; big?: boolean; muted?: boolean }) {
  const d = big ? 60 : 46;
  return (
    <View
      style={{ width: d, height: d, borderRadius: d / 2 }}
      className={cn("items-center justify-center", muted ? "bg-surface" : "bg-accent/25")}
    >
      <Text className={cn("font-extrabold leading-none", big ? "text-2xl" : "text-lg", muted && "text-textMuted")}>{n}</Text>
      <Ionicons name="people" size={big ? 13 : 11} color={muted ? colors.textMuted : colors.text} />
    </View>
  );
}

/** Ring that fills as a waitlist party's wait approaches its quote; red once over. */
export function WaitRing({ waited, quoted, size = 64 }: { waited: number; quoted: number; size?: number }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, waited / Math.max(1, quoted));
  const over = waited >= quoted;
  const color = over ? colors.warning : p > 0.75 ? colors.accent : colors.primary;
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surface} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Text className={cn("text-base font-extrabold leading-tight", over && "text-warning")}>{waited}</Text>
      <Text className="text-[10px] text-textMuted leading-none">min</Text>
    </View>
  );
}

const TABLE_FILL = {
  free: "bg-surface border-border",
  reserved: "bg-accent/15 border-accent",
  seated: "bg-primary border-primary",
} as const;

/**
 * A table drawn as a floor-plan shape: chairs as dots on the long sides, the label in the
 * middle and an optional status line. With `onPress` the whole shape is one button.
 */
export function TableShape({
  table,
  kind = "free",
  caption,
  onPress,
  className,
}: {
  table: DiningTable;
  kind?: TableState["kind"];
  caption?: string;
  /** Omit for a display-only table. */
  onPress?: () => void;
  className?: string;
}) {
  const perSide = Math.ceil(table.seats / 2);
  const chairs = (n: number) => (
    <View className="flex-row justify-center gap-2 h-2">
      {Array.from({ length: n }, (_, i) => (
        <View key={i} className={cn("w-4 h-2 rounded-full", kind === "seated" ? "bg-primary/60" : "bg-border")} />
      ))}
    </View>
  );
  const shape = cn(TABLE_FILL[kind], table.seats >= 6 ? "min-h-[72px]" : "min-h-[60px]");
  const body = (
    <>
      <Text className={cn("font-extrabold", kind === "seated" && "text-background")}>{table.label}</Text>
      <Text className={cn("text-[11px]", kind === "seated" ? "text-primaryLight" : "text-textMuted")} numberOfLines={1}>
        {caption ?? `${table.seats} seats`}
      </Text>
    </>
  );
  return (
    <View className={cn("gap-1", className)}>
      {chairs(perSide)}
      {onPress ? (
        <Button
          variant="ghost"
          className={cn("h-auto flex-col gap-0 rounded-xl border px-1 py-2.5", shape)}
          onPress={onPress}
          accessibilityLabel={`${table.label}, ${table.seats} seats, ${kind}`}
        >
          {body}
        </Button>
      ) : (
        <View className={cn("items-center justify-center rounded-xl border px-1 py-2.5", shape)}>{body}</View>
      )}
      {chairs(table.seats - perSide)}
    </View>
  );
}

/** One counter seat: a round stool. Display-only without `onPress`. */
export function CounterSeat({ table, kind = "free", onPress }: { table: DiningTable; kind?: TableState["kind"]; onPress?: () => void }) {
  const cls = cn("w-9 h-9 rounded-full border items-center justify-center", TABLE_FILL[kind]);
  const label = <Text className={cn("text-xs font-bold", kind === "seated" && "text-background")}>{table.label}</Text>;
  if (!onPress) return <View className={cls}>{label}</View>;
  return (
    <Button variant="ghost" size="icon" className={cls} onPress={onPress} accessibilityLabel={`Counter seat ${table.label}, ${kind}`}>
      {label}
    </Button>
  );
}

export function Legend({ items }: { items: [cls: string, label: string][] }) {
  return (
    <View className="flex-row flex-wrap gap-x-4 gap-y-1">
      {items.map(([cls, label]) => (
        <View key={label} className="flex-row items-center gap-1.5">
          <View className={cn("w-3 h-3 rounded-[4px] border", cls)} />
          <Text className="text-xs text-textMuted">{label}</Text>
        </View>
      ))}
    </View>
  );
}

export const FLOOR_LEGEND: [string, string][] = [
  [TABLE_FILL.free, "Free"],
  [TABLE_FILL.reserved, "Reserved"],
  [TABLE_FILL.seated, "Seated"],
];

// ---------------------------------------------------------------------------
// Controls
// ---------------------------------------------------------------------------

/** Label on the left, round − value + on the right. */
export function Stepper({
  label,
  hint,
  value,
  onChange,
  step = 1,
  min = 0,
  max = Infinity,
  format = String,
  last,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: (v: number) => string;
  last?: boolean;
}) {
  return (
    <View className={cn("flex-row items-center px-4 py-3 bg-background", !last && "border-b border-border")}>
      <View className="flex-1 mr-2">
        <Text className="font-semibold">{label}</Text>
        {hint ? <Text className="text-xs text-textMuted mt-0.5">{hint}</Text> : null}
      </View>
      <Button
        variant="secondary"
        size="icon"
        className="w-9 h-9 rounded-full"
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - step))}
        accessibilityLabel={`Decrease ${label}`}
      >
        <Ionicons name="remove" size={18} color={colors.text} />
      </Button>
      <Text className="font-bold min-w-[76px] text-center">{format(value)}</Text>
      <Button
        variant="secondary"
        size="icon"
        className="w-9 h-9 rounded-full"
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + step))}
        accessibilityLabel={`Increase ${label}`}
      >
        <Ionicons name="add" size={18} color={colors.text} />
      </Button>
    </View>
  );
}

/** Small icon + label + value tile, used in the booking sheet. */
export function InfoTile({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; value: string }) {
  return (
    <View className="flex-1 bg-surface rounded-2xl p-3">
      <Ionicons name={icon} size={16} color={colors.textMuted} />
      <Text className="text-xs text-textMuted mt-1.5">{label}</Text>
      <Text className="font-bold mt-0.5" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
