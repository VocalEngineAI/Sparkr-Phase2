// Pieces shared by the Reservations and Booking Settings screens: time helpers, the
// bottom sheet, party-size avatar, waitlist ring and the +/- stepper.

import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { Reservation } from "@sparkr/shared";
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
