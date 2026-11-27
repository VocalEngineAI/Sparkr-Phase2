import { useEffect, useState } from "react";
import type { Deal, DealStatus, DealTiming } from "@sparkr/shared";

// Scheduling logic for deals: derive status and countdowns from `Deal.timing`. Pure
// functions over timestamps, so the screen never hardcodes "ends in" values.

export const HOUR = 3_600_000;
export const DAY = 24 * HOUR;
export const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type DealPhase = {
  status: DealStatus;
  /** True while customers can redeem right now (inside the window, deal switched on). */
  redeemableNow: boolean;
  /** "Ends in", "Starts in", "Paused", "Always on", "Ended". */
  label: string;
  /** Epoch ms the countdown runs to, when there is one. */
  until?: number;
};

/** Re-renders the caller every `intervalMs` with the current epoch time. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const parseHM = (hm: string) => {
  const [h, m] = hm.split(":").map((n) => Number(n));
  return { h: h || 0, m: m || 0 };
};

/** Epoch ms for `hm` ("HH:MM") on the local calendar day of `dayMs` (+ `dayOffset` days). */
function atTime(dayMs: number, hm: string, dayOffset = 0) {
  const d = new Date(dayMs);
  d.setDate(d.getDate() + dayOffset);
  const { h, m } = parseHM(hm);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

/** Current/next window of a recurring deal relative to `now`. */
function recurringWindow(t: Extract<DealTiming, { type: "recurring" }>, now: number): { inWindow: boolean; until: number } | null {
  if (t.days.length === 0) return null;
  for (let offset = 0; offset < 8; offset++) {
    const start = atTime(now, t.start, offset);
    const end = atTime(now, t.end, offset);
    const dow = new Date(start).getDay();
    if (!t.days.includes(dow)) continue;
    if (offset === 0 && now >= start && now < end) return { inWindow: true, until: end };
    if (start > now) return { inWindow: false, until: start };
  }
  return null;
}

export function dealPhase(deal: Pick<Deal, "timing" | "active">, now = Date.now()): DealPhase {
  const t = deal.timing;
  const startsAt = Date.parse(t.startsAt);

  if (now < startsAt) return { status: "scheduled", redeemableNow: false, label: "Starts in", until: startsAt };

  if (t.type === "window") {
    const endsAt = Date.parse(t.endsAt);
    if (now >= endsAt) return { status: "ended", redeemableNow: false, label: "Ended" };
    if (!deal.active) return { status: "live", redeemableNow: false, label: "Paused", until: endsAt };
    return { status: "live", redeemableNow: true, label: "Ends in", until: endsAt };
  }

  if (t.type === "ongoing") {
    if (!deal.active) return { status: "live", redeemableNow: false, label: "Paused" };
    return { status: "live", redeemableNow: true, label: "Always on" };
  }

  const w = recurringWindow(t, now);
  if (!deal.active) return { status: "live", redeemableNow: false, label: "Paused", until: w?.until };
  if (!w) return { status: "live", redeemableNow: false, label: "No days set" };
  return w.inWindow
    ? { status: "live", redeemableNow: true, label: "Ends in", until: w.until }
    : { status: "live", redeemableNow: false, label: "Starts in", until: w.until };
}

export function dealStatus(deal: Pick<Deal, "timing" | "active">, now = Date.now()): DealStatus {
  return dealPhase(deal, now).status;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "2d 3h" · "1h 24m" · "24m 10s" · "0s". */
export function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86_400);
  const h = Math.floor((s % 86_400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${pad(m)}m`;
  if (m > 0) return `${m}m ${pad(sec)}s`;
  return `${sec}s`;
}

const fmtTime = (hm: string) => {
  const { h, m } = parseHM(hm);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${pad(m)} ${suffix}` : `${hour} ${suffix}`;
};

const fmtDate = (ms: number) => new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const fmtClock = (ms: number) => {
  const d = new Date(ms);
  return fmtTime(`${d.getHours()}:${pad(d.getMinutes())}`);
};
const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();

/** Human-readable schedule line for a timing ("Weekdays • 4 PM – 6 PM", "Dec 15 – Dec 31"). */
export function describeTiming(t: DealTiming, now = Date.now()): string {
  if (t.type === "ongoing") return "Every day • no end date";
  if (t.type === "window") {
    const s = Date.parse(t.startsAt);
    const e = Date.parse(t.endsAt);
    if (sameDay(s, e)) {
      const day = sameDay(s, now) ? "Today" : sameDay(s, now + DAY) ? "Tomorrow" : fmtDate(s);
      return `${day} • ${fmtClock(s)} – ${fmtClock(e)}`;
    }
    return `${fmtDate(s)} – ${fmtDate(e)}`;
  }
  const days = [...t.days].sort();
  const key = days.join(",");
  const dayLabel =
    key === "0,1,2,3,4,5,6" ? "Every day" : key === "1,2,3,4,5" ? "Weekdays" : key === "0,6" ? "Weekends" : days.map((d) => DAY_SHORT[d]).join(", ");
  return `${dayLabel} • ${fmtTime(t.start)} – ${fmtTime(t.end)}`;
}

// --- Form helpers (the New Deal flow edits dates/times as text) ----------------------

/** "2026-12-15" + "17:00" → epoch ms, or null if either part is malformed. */
export function parseDateTime(date: string, time: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim()) || !/^\d{1,2}:\d{2}$/.test(time.trim())) return null;
  const [y, mo, d] = date.trim().split("-").map(Number);
  const { h, m } = parseHM(time.trim());
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || m > 59) return null;
  const ms = new Date(y, mo - 1, d, h, m, 0, 0).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export function toDateInput(ms: number) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function toTimeInput(ms: number) {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function isValidHM(hm: string) {
  if (!/^\d{1,2}:\d{2}$/.test(hm.trim())) return false;
  const { h, m } = parseHM(hm.trim());
  return h <= 23 && m <= 59;
}
