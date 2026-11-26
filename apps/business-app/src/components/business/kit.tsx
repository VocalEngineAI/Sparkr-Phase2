// Building blocks shared by the business-side screens. Everything tappable is the ui
// `Button` (or a native RN control like `Switch`) restyled with variants/classNames, so
// press states, accessibility roles and text colours stay consistent.

import React from "react";
import { Alert, ScrollView, Switch, View, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import type { PerformanceHighlight, SocialPlatform } from "@sparkr/shared";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { cn } from "../../lib/utils";

export type IconName = React.ComponentProps<typeof Ionicons>["name"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function money(n: number, cents = false) {
  const abs = Math.abs(n);
  const fixed = abs.toFixed(cents ? 2 : abs % 1 === 0 ? 0 : 2);
  return `${n < 0 ? "-" : ""}$${fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function compact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

/** Placeholder for actions that need the backend or a flow that isn't built yet. */
export function notYet(what: string, detail = "This isn't connected yet.") {
  Alert.alert(what, detail);
}

// ---------------------------------------------------------------------------
// Screen shells
// ---------------------------------------------------------------------------

/**
 * Scrolling page body. `hub` screens have no native header, so they pad for the status
 * bar and show a large title; stack screens sit under the native header.
 */
export function Screen({
  hub,
  title,
  subtitle,
  headerRight,
  children,
  contentClassName,
  ...props
}: ScrollViewProps & {
  hub?: boolean;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: hub ? insets.top + 12 : 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {hub && title ? (
        <View className="flex-row items-end px-5 mb-6">
          <View className="flex-1">
            <Text className="text-3xl font-extrabold">{title}</Text>
            {subtitle ? <Text className="text-sm text-textMuted mt-1">{subtitle}</Text> : null}
          </View>
          {headerRight}
        </View>
      ) : null}
      <View className={cn("px-5 gap-8", contentClassName)}>{children}</View>
    </ScrollView>
  );
}

export function Section({
  title,
  subtitle,
  count,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-3 min-h-[28px]">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-lg font-bold">{title}</Text>
          {count ? (
            <View className="bg-accent rounded-full px-2 py-0.5">
              <Text className="text-xs font-bold">{count}</Text>
            </View>
          ) : null}
          {subtitle ? (
            <Text className="text-sm text-textMuted" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {action}
      </View>
      {children}
    </View>
  );
}

/** Text-style button for section headers ("See all", "Edit", …). */
export function LinkButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Button variant="link" size="sm" className="px-0 h-7" onPress={onPress}>
      <Text className="text-text font-semibold text-sm">{label}</Text>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

export function Card({
  className,
  tone = "outline",
  children,
}: {
  className?: string;
  tone?: "outline" | "surface" | "primary";
  children: React.ReactNode;
}) {
  return (
    <View
      className={cn(
        "rounded-2xl p-4",
        tone === "outline" && "border border-border bg-background",
        tone === "surface" && "bg-surface",
        tone === "primary" && "bg-primary",
        className
      )}
    >
      {children}
    </View>
  );
}

/** Bordered container for a stack of ListRows / SwitchRows. */
export function ListCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={cn("rounded-2xl border border-border overflow-hidden", className)}>{children}</View>;
}

export type Tone = "neutral" | "accent" | "warning" | "success" | "primary";

export function Badge({ label, tone = "neutral", icon }: { label: string; tone?: Tone; icon?: IconName }) {
  const fg =
    tone === "warning" ? colors.warning : tone === "success" ? colors.success : tone === "primary" ? colors.background : colors.text;
  return (
    <View
      className={cn(
        "flex-row items-center self-start rounded-full px-2 py-0.5 gap-1",
        tone === "neutral" && "bg-surface",
        tone === "accent" && "bg-accent",
        tone === "warning" && "bg-warning/10",
        tone === "success" && "bg-success/10",
        tone === "primary" && "bg-primary"
      )}
    >
      {icon ? <Ionicons name={icon} size={11} color={fg} /> : null}
      <Text
        className={cn(
          "text-[11px] font-semibold",
          tone === "warning" && "text-warning",
          tone === "success" && "text-success",
          tone === "primary" && "text-background"
        )}
      >
        {label}
      </Text>
    </View>
  );
}

export function IconCircle({
  icon,
  tone = "neutral",
  size = 40,
}: {
  icon: IconName;
  tone?: Tone;
  size?: number;
}) {
  const color =
    tone === "warning" ? colors.warning : tone === "success" ? colors.success : tone === "primary" ? colors.background : colors.text;
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={cn(
        "items-center justify-center",
        tone === "neutral" && "bg-surface",
        tone === "accent" && "bg-accent",
        tone === "warning" && "bg-warning/10",
        tone === "success" && "bg-success/10",
        tone === "primary" && "bg-primary"
      )}
    >
      <Ionicons name={icon} size={Math.round(size * 0.48)} color={color} />
    </View>
  );
}

export function InfoBanner({
  text,
  tone = "info",
  icon,
}: {
  text: string;
  tone?: "info" | "warning";
  icon?: IconName;
}) {
  return (
    <View
      className={cn(
        "flex-row items-start rounded-2xl p-3.5 gap-3",
        tone === "warning" ? "bg-warning/10" : "bg-surface"
      )}
    >
      <Ionicons
        name={icon ?? (tone === "warning" ? "warning-outline" : "information-circle-outline")}
        size={18}
        color={tone === "warning" ? colors.warning : colors.text}
      />
      <Text className={cn("text-sm flex-1", tone === "warning" && "text-warning")}>{text}</Text>
    </View>
  );
}

export function ProgressBar({ pct, className }: { pct: number; className?: string }) {
  return (
    <View className={cn("h-2 rounded-full bg-surface overflow-hidden", className)}>
      <View className="h-full rounded-full bg-primary" style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export function Trend({ changePct }: { changePct: number }) {
  const up = changePct >= 0;
  return (
    <View className="flex-row items-center">
      <Ionicons name={up ? "trending-up" : "trending-down"} size={14} color={up ? colors.success : colors.warning} />
      <Text className={cn("text-xs font-semibold ml-1", up ? "text-success" : "text-warning")}>
        {up ? "+" : ""}
        {changePct}%
      </Text>
    </View>
  );
}

export function StatTile({
  label,
  value,
  changePct,
  hint,
  className,
}: {
  label: string;
  value: string;
  changePct?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <View className={cn("bg-surface rounded-2xl p-4", className)}>
      <Text className="text-xs text-textMuted" numberOfLines={1}>
        {label}
      </Text>
      <Text className="text-2xl font-extrabold mt-1.5">{value}</Text>
      {changePct !== undefined ? (
        <View className="mt-1.5">
          <Trend changePct={changePct} />
        </View>
      ) : hint ? (
        <Text className="text-xs text-textMuted mt-1.5">{hint}</Text>
      ) : null}
    </View>
  );
}

/** Two-column grid of stat tiles. */
export function StatGrid({ items }: { items: { label: string; value: string; changePct?: number; hint?: string }[] }) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {items.map((s) => (
        <StatTile key={s.label} {...s} className="w-[48.5%]" />
      ))}
    </View>
  );
}

/** Edge-to-edge horizontal row of stat tiles. */
export function StatStrip({ items }: { items: PerformanceHighlight[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5"
      contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
    >
      {items.map((h) => (
        <StatTile key={h.id} label={h.label} value={h.value} changePct={h.changePct} className="w-36" />
      ))}
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Rows & controls
// ---------------------------------------------------------------------------

export function ListRow({
  icon,
  iconTone,
  title,
  subtitle,
  right,
  onPress,
  last,
  chevron = !!onPress,
  destructive,
}: {
  icon?: IconName;
  iconTone?: Tone;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  last?: boolean;
  chevron?: boolean;
  destructive?: boolean;
}) {
  const body = (
    <>
      {icon ? (
        <View className="mr-3">
          <IconCircle icon={icon} tone={iconTone ?? (destructive ? "warning" : "neutral")} size={36} />
        </View>
      ) : null}
      <View className="flex-1">
        <Text className={cn("text-base font-semibold", destructive && "text-warning")} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-sm text-textMuted mt-0.5" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View className="ml-3 items-end">{right}</View> : null}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: 8 }} /> : null}
    </>
  );
  const rowClass = cn("flex-row items-center px-4 py-3.5 bg-background", !last && "border-b border-border");

  if (!onPress) return <View className={rowClass}>{body}</View>;
  return (
    <Button variant="ghost" className={cn(rowClass, "h-auto justify-start rounded-none gap-0")} onPress={onPress}>
      {body}
    </Button>
  );
}

export function SwitchRow({
  title,
  description,
  value,
  onValueChange,
  last,
  icon,
}: {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
  icon?: IconName;
}) {
  return (
    <View className={cn("flex-row items-center px-4 py-3.5 bg-background", !last && "border-b border-border")}>
      {icon ? (
        <View className="mr-3">
          <IconCircle icon={icon} size={36} />
        </View>
      ) : null}
      <View className="flex-1 mr-3">
        <Text className="font-semibold">{title}</Text>
        {description ? <Text className="text-sm text-textMuted mt-0.5">{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.border}
        accessibilityLabel={title}
      />
    </View>
  );
}

/** Segmented control: one selected option out of 2–4. */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly (readonly [K, string])[];
  value: K;
  onChange: (k: K) => void;
  className?: string;
}) {
  return (
    <View className={cn("flex-row bg-surface rounded-2xl p-1", className)}>
      {options.map(([key, label]) => (
        <Button
          key={key}
          size="sm"
          variant={value === key ? "default" : "ghost"}
          className="flex-1 px-1"
          onPress={() => onChange(key)}
          accessibilityState={{ selected: value === key }}
        >
          <Text numberOfLines={1}>{label}</Text>
        </Button>
      ))}
    </View>
  );
}

/** Horizontally scrolling filter chips; single select. */
export function Chips<K extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly (readonly [K, string])[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-5"
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
      {options.map(([key, label]) => (
        <Button
          key={key}
          size="sm"
          variant={value === key ? "default" : "outline"}
          className="rounded-full"
          onPress={() => onChange(key)}
          accessibilityState={{ selected: value === key }}
        >
          <Text>{label}</Text>
        </Button>
      ))}
    </ScrollView>
  );
}

/** Hub entry for one feature area: icon, title, one-line description, live metric. */
export function FeatureCard({
  icon,
  title,
  description,
  meta,
  onPress,
}: {
  icon: IconName;
  title: string;
  description: string;
  meta?: string;
  onPress: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto flex-row items-center justify-start gap-0 rounded-2xl p-4"
      onPress={onPress}
    >
      <View className="mr-4">
        <IconCircle icon={icon} size={44} />
      </View>
      <View className="flex-1">
        <Text className="font-bold text-base">{title}</Text>
        <Text className="text-sm text-textMuted mt-0.5">{description}</Text>
        {meta ? (
          <View className="mt-2">
            <Badge label={meta} tone="accent" />
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} style={{ marginLeft: 8 }} />
    </Button>
  );
}

export function EmptyState({ icon, title, detail }: { icon: IconName; title: string; detail?: string }) {
  return (
    <View className="items-center py-10 px-6">
      <IconCircle icon={icon} size={52} />
      <Text className="font-bold mt-3">{title}</Text>
      {detail ? <Text className="text-sm text-textMuted text-center mt-1">{detail}</Text> : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Social platforms
// ---------------------------------------------------------------------------

// Ionicons has brand glyphs for every platform except RedNote (Xiaohongshu), which uses a
// generic "book" glyph in RedNote red.
const PLATFORM: Record<SocialPlatform, { label: string; icon: IconName; color: string }> = {
  instagram: { label: "Instagram", icon: "logo-instagram", color: "#E4405F" },
  facebook: { label: "Facebook", icon: "logo-facebook", color: "#0866FF" },
  tiktok: { label: "TikTok", icon: "logo-tiktok", color: "#000000" },
  youtube: { label: "YouTube", icon: "logo-youtube", color: "#FF0000" },
  rednote: { label: "RedNote", icon: "book", color: "#FF2442" },
};

export function platformLabel(p: SocialPlatform) {
  return PLATFORM[p].label;
}

export function PlatformIcon({ platform, size = 16 }: { platform: SocialPlatform; size?: number }) {
  const p = PLATFORM[platform];
  return <Ionicons name={p.icon} size={size} color={p.color} accessibilityLabel={p.label} />;
}

export function PlatformRow({ platforms, size = 15 }: { platforms: SocialPlatform[]; size?: number }) {
  return (
    <View className="flex-row items-center gap-1.5">
      {platforms.map((p) => (
        <PlatformIcon key={p} platform={p} size={size} />
      ))}
    </View>
  );
}

/** Adds a compact primary button to the native header's right side. */
export function useHeaderButton(
  navigation: { setOptions: (options: { headerRight?: () => React.ReactNode }) => void },
  { label, icon, onPress }: { label: string; icon?: IconName; onPress: () => void }
) {
  // Latest handler via ref, so re-renders don't reset the header options every time.
  const handler = React.useRef(onPress);
  handler.current = onPress;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button size="sm" className="rounded-full px-3" onPress={() => handler.current()} accessibilityLabel={label}>
          {icon ? <Ionicons name={icon} size={16} color={colors.background} /> : null}
          <Text>{label}</Text>
        </Button>
      ),
    });
  }, [navigation, label, icon]);
}

/** Row of action buttons, right-aligned (card footers). */
export function Actions({ children, className }: { children: React.ReactNode; className?: string }) {
  return <View className={cn("flex-row justify-end gap-2 mt-3", className)}>{children}</View>;
}

export { Button, Text };
