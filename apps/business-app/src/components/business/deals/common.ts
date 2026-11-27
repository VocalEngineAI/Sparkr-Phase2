import type { Deal, DealDaily, DealKind, DealStatus } from "@sparkr/shared";
import { colors } from "@sparkr/ui";
import { compact, money, type IconName } from "../kit";

// Shared vocabulary for the Happy Hours & Deals screen.
//
// Layout follows the "Happy Hours Deals Dashboard" reference; colours are the Sparkr theme
// tokens only (packages/ui/theme.js) — navy for actions and text, amber as the accent,
// success/warning for live/urgent states, linen surfaces on white. The keys below keep the
// role names the components use.

const tint = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const D = {
  blue: colors.primary,
  blueDark: colors.primary,
  blueTint: colors.surface,
  green: colors.success,
  greenBright: colors.success,
  greenTint: tint(colors.success, 0.1),
  red: colors.warning,
  redTint: tint(colors.warning, 0.1),
  purple: colors.textMuted,
  purpleTint: colors.surface,
  amber: colors.accent,
  ink: colors.text,
  muted: colors.textMuted,
  page: colors.background,
  card: colors.background,
  line: colors.border,
  chip: colors.surface,
} as const;

/** Cards are bordered like the rest of the app, not shadowed. */
export const CARD_SHADOW = { borderWidth: 1, borderColor: colors.border } as const;

export const KIND: Record<DealKind, { label: string; icon: IconName; description: string }> = {
  happy_hour: { label: "Happy hour", icon: "beer-outline", description: "Repeats on set days and hours, e.g. drinks 4–6 PM." },
  flash: { label: "Flash deal", icon: "flash-outline", description: "Short, urgent offer for a few hours or one day." },
  secret_menu: { label: "Secret menu", icon: "eye-off-outline", description: "Off-menu item only Sparkr members can see." },
  limited_time: { label: "Limited time", icon: "hourglass-outline", description: "Seasonal or dated offer with a start and end." },
};

export const STATUS: Record<DealStatus, { label: string; chip: string; fg: string; bg: string; icon: IconName }> = {
  live: { label: "Live", chip: "LIVE NOW", fg: D.green, bg: D.greenTint, icon: "ellipse" },
  scheduled: { label: "Scheduled", chip: "SCHEDULED", fg: D.purple, bg: D.purpleTint, icon: "time-outline" },
  ended: { label: "Ended", chip: "ENDED", fg: D.muted, bg: D.chip, icon: "checkmark-circle-outline" },
};

export type MetricKey = "views" | "saves" | "redemptions" | "revenue";

export const METRICS: { key: MetricKey; label: string; icon: IconName; color: string }[] = [
  { key: "views", label: "Views", icon: "eye", color: D.blue },
  { key: "redemptions", label: "Redemptions", icon: "ticket", color: D.blue },
  { key: "saves", label: "Saves", icon: "bookmark", color: D.blue },
  { key: "revenue", label: "Revenue", icon: "logo-usd", color: D.blue },
];

export const metricLabel = (key: MetricKey) => METRICS.find((m) => m.key === key)!.label;

export const fmtMetric = (key: MetricKey, n: number) => (key === "revenue" ? money(n) : compact(n));

/** Per-day totals across `deals`, last `days` days, oldest first. */
export function dailySeries(deals: Deal[], days: number): DealDaily[] {
  const len = deals[0]?.history.length ?? 0;
  const from = Math.max(0, len - days);
  const out: DealDaily[] = [];
  for (let i = from; i < len; i++) {
    const row: DealDaily = { date: deals[0].history[i].date, views: 0, saves: 0, redemptions: 0, revenue: 0 };
    for (const d of deals) {
      const h = d.history[i];
      if (!h) continue;
      row.views += h.views;
      row.saves += h.saves;
      row.redemptions += h.redemptions;
      row.revenue += h.revenue;
    }
    out.push(row);
  }
  return out;
}

export const sumSeries = (rows: DealDaily[], key: MetricKey) => rows.reduce((n, r) => n + r[key], 0);

/** Redemptions left before a capped deal closes. Happy-hour limits are per visit, so none. */
export function remainingRedemptions(d: Deal): number | undefined {
  if (!d.redemptionLimit || d.kind === "happy_hour") return undefined;
  return Math.max(0, d.redemptionLimit - d.redemptions);
}

export function ruleLines(d: Deal): string[] {
  return [
    d.minSpend ? `Minimum spend ${money(d.minSpend)}` : null,
    d.redemptionLimit ? (d.kind === "happy_hour" ? `Limit ${d.redemptionLimit} per visit` : `Limit ${d.redemptionLimit} redemptions`) : null,
    d.expires ? `Expires ${d.expires}` : null,
  ].filter((x): x is string => !!x);
}

export const shortDate = (yyyyMmDd: string) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};
