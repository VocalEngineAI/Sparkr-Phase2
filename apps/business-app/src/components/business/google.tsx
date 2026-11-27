// Google-flavoured building blocks for the Google management screen (Feature 3). The
// screen is meant to feel like Google Business Profile on a phone — Material 3 pills,
// DM Sans type, Google Blue as the one interactive colour — while still living
// inside the Sparkr app, so this kit is deliberately separate from `kit.tsx` (the Sparkr
// brand kit) and nothing else imports it.
//
// Type: DM Sans, like the rest of the app (regular + medium weights), set via explicit
// fontFamily on plain RN `Text` so the Material size scale below is self-contained.
// Motion: react-native-reanimated (already in the app). Every animation uses
// `ReduceMotion.System`, so it's skipped when the OS reduce-motion setting is on.

import React, { useEffect } from "react";
import { ActivityIndicator, Switch, Text as RNText, View, type TextProps, type TextStyle, type ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

// ---------------------------------------------------------------------------
// Palette (Google's Material palette as used across its own apps)
// ---------------------------------------------------------------------------

export const G = {
  blue: "#4285F4",
  /** Darker blue Google uses for text links and pressed fills (readable on white). */
  blueText: "#1A73E8",
  bluePressed: "#1967D2",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
  /** Google's darker green for text/icons on white (#34A853 is too light for text). */
  greenText: "#188038",
  /** Darker red for text on white. */
  redText: "#C5221F",
  text: "#202124",
  textSecondary: "#5F6368",
  bg: "#FFFFFF",
  surface: "#F8F9FA",
  surfacePressed: "#F1F3F4",
  border: "#DADCE0",
  track: "#E8EAED",
  blueTint: "#E8F0FE",
  blueTintPressed: "#D2E3FC",
  greenTint: "#E6F4EA",
  redTint: "#FCE8E6",
  yellowTint: "#FEF7E0",
  /** Dark amber for text on the yellow tint. */
  amberText: "#B06000",
} as const;

// Letter-avatar colours, in the same spirit as Google account avatars.
const AVATAR_COLORS = [G.blue, G.red, "#F9AB00", G.green, "#A142F4", "#12B5CB", "#E52592"];

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

// DM Sans ships one file per weight (see tailwind.config.js), so pick the file directly.
const FONT = { regular: "DMSans_400Regular", medium: "DMSans_500Medium" } as const;

export type GTextVariant = "display" | "title" | "section" | "headline" | "label" | "body" | "caption";

const VARIANT: Record<GTextVariant, { size: number; line: number; weight: "regular" | "medium" }> = {
  // Line heights stay >= 1.35x the size: DM Sans's natural line is 1.30x and iOS clips
  // glyphs (descenders first) when lineHeight is tighter than that.
  display: { size: 44, line: 60, weight: "regular" },
  title: { size: 20, line: 28, weight: "medium" },
  section: { size: 18, line: 26, weight: "medium" },
  headline: { size: 16, line: 22, weight: "medium" },
  label: { size: 14, line: 20, weight: "medium" },
  body: { size: 14, line: 20, weight: "regular" },
  caption: { size: 12, line: 17, weight: "regular" },
};

// Note: no `includeFontPadding: false` — on Android that trims the room DM Sans needs for
// descenders, so "g"/"p" in button labels get clipped on some devices.
export function gFont(weight: "regular" | "medium" = "regular"): TextStyle {
  return { fontFamily: FONT[weight] };
}

export function GText({
  variant = "body",
  color,
  weight,
  style,
  ...props
}: TextProps & { variant?: GTextVariant; color?: string; weight?: "regular" | "medium" }) {
  const v = VARIANT[variant];
  return (
    <RNText
      style={[
        gFont(weight ?? v.weight),
        { fontSize: v.size, lineHeight: v.line, color: color ?? (variant === "caption" ? G.textSecondary : G.text) },
        style,
      ]}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Surfaces
// ---------------------------------------------------------------------------

/** White card with a hairline border and no shadow (Google Business Profile style). */
export function GCard({ children, style, padded = true }: { children: React.ReactNode; style?: ViewStyle; padded?: boolean }) {
  return (
    <View
      style={[
        { backgroundColor: G.bg, borderRadius: 12, borderWidth: 1, borderColor: G.border, overflow: "hidden" },
        padded && { padding: 16 },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function GDivider({ inset = 0, style }: { inset?: number; style?: ViewStyle }) {
  return <View style={[{ height: 1, backgroundColor: G.border, marginLeft: inset }, style]} />;
}

/** Square-ish tinted icon box used at the start of rows and section headers. */
export function GIconBox({
  icon,
  size = 36,
  color = G.blueText,
  background = G.blueTint,
}: {
  icon: MaterialIconName;
  size?: number;
  color?: string;
  background?: string;
}) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: background, alignItems: "center", justifyContent: "center" }}>
      <MaterialIcons name={icon} size={Math.round(size * 0.55)} color={color} />
    </View>
  );
}

/** Letter avatar, coloured deterministically from the name (like Google account avatars). */
export function GAvatar({ name, size = 40, color }: { name: string; size?: number; color?: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const hash = Array.from(name).reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 9973, 7);
  const bg = color ?? AVATAR_COLORS[hash % AVATAR_COLORS.length];
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}
      accessibilityLabel={name}
    >
      <RNText style={[gFont("medium"), { color: "#FFFFFF", fontSize: Math.round(size * 0.45), lineHeight: Math.round(size * 0.65) }]}>
        {initial}
      </RNText>
    </View>
  );
}

export type GChipTone = "green" | "amber" | "blue" | "grey" | "red";

/** Small status chip ("Connected", "Replied", "Awaiting reply"). */
export function GChip({ label, tone = "grey", icon, dot }: { label: string; tone?: GChipTone; icon?: MaterialIconName; dot?: boolean }) {
  const palette: Record<GChipTone, { bg: string; fg: string }> = {
    green: { bg: G.greenTint, fg: G.greenText },
    amber: { bg: G.yellowTint, fg: G.amberText },
    blue: { bg: G.blueTint, fg: G.blueText },
    red: { bg: G.redTint, fg: G.redText },
    grey: { bg: G.surfacePressed, fg: G.textSecondary },
  };
  const { bg, fg } = palette[tone];
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, height: 24, gap: 5 }}
    >
      {dot ? <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: fg }} /> : null}
      {icon ? <MaterialIcons name={icon} size={13} color={fg} /> : null}
      <GText variant="caption" weight="medium" color={fg}>
        {label}
      </GText>
    </View>
  );
}

/** Inline notice (blue tint, info icon). */
export function GNotice({ text, icon = "info-outline" }: { text: string; icon?: MaterialIconName }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, backgroundColor: G.blueTint, borderRadius: 12, padding: 14 }}>
      <MaterialIcons name={icon} size={20} color={G.blueText} />
      <GText style={{ flex: 1 }}>{text}</GText>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Controls — all built on the ui `Button` (Pressable) so press states + roles are consistent
// ---------------------------------------------------------------------------

export type GButtonVariant = "filled" | "tonal" | "outlined" | "text";

const BUTTON_CLASS: Record<GButtonVariant, string> = {
  filled: "bg-[#4285F4] active:bg-[#1967D2]",
  tonal: "bg-[#E8F0FE] active:bg-[#D2E3FC]",
  outlined: "bg-white border border-[#DADCE0] active:bg-[#F1F3F4]",
  text: "bg-transparent active:bg-[#E8F0FE]",
};

/** Material 3 pill button. `loading` shows a spinner and disables the press. */
export function GButton({
  label,
  icon,
  variant = "filled",
  onPress,
  loading,
  disabled,
  compact,
  className,
}: {
  label: string;
  icon?: MaterialIconName;
  variant?: GButtonVariant;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const fg = variant === "filled" ? "#FFFFFF" : G.blueText;
  return (
    <Button
      variant="ghost"
      className={cn("rounded-full gap-2 py-0", compact ? "h-9 px-4" : "h-10 px-5", BUTTON_CLASS[variant], className)}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : icon ? (
        <MaterialIcons name={icon} size={18} color={fg} />
      ) : null}
      <GText variant="label" color={fg}>
        {label}
      </GText>
    </Button>
  );
}

/** 40×40 round icon button (header actions, overflow menu). */
export function GIconButton({
  icon,
  label,
  onPress,
  color = G.textSecondary,
}: {
  icon: MaterialIconName;
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full active:bg-[#F1F3F4]"
      onPress={onPress}
      accessibilityLabel={label}
    >
      <MaterialIcons name={icon} size={24} color={color} />
    </Button>
  );
}

/** Material filter chip (single-select row). */
export function GFilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-8 rounded-lg px-3 py-0 gap-1",
        selected ? "bg-[#E8F0FE] active:bg-[#D2E3FC]" : "bg-white border border-[#DADCE0] active:bg-[#F1F3F4]"
      )}
      onPress={onPress}
      accessibilityState={{ selected }}
    >
      {selected ? <MaterialIcons name="check" size={16} color={G.blueText} /> : null}
      <GText variant="label" color={selected ? G.blueText : G.text}>
        {label}
      </GText>
    </Button>
  );
}

/** Settings-style row with a Google-blue switch. */
export function GSwitchRow({
  icon,
  title,
  description,
  value,
  onValueChange,
  last,
}: {
  icon: MaterialIconName;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: G.border,
      }}
    >
      <MaterialIcons name={icon} size={22} color={G.textSecondary} />
      <View style={{ flex: 1 }}>
        <GText variant="headline" weight="regular">
          {title}
        </GText>
        {description ? (
          <GText variant="caption" style={{ marginTop: 2 }}>
            {description}
          </GText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#BDC1C6", true: G.blue }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#BDC1C6"
        accessibilityLabel={title}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Ratings
// ---------------------------------------------------------------------------

/** Google-style star row (full / half / outline). */
export function GStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }} accessibilityLabel={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const name: MaterialIconName = rating >= i - 0.25 ? "star" : rating >= i - 0.75 ? "star-half" : "star-border";
        return <MaterialIcons key={i} name={name} size={size} color={G.yellow} />;
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

const EASE = Easing.out(Easing.cubic);

/** Horizontal bar that fills from 0 to `pct` when it mounts. */
export function GAnimatedBar({
  pct,
  delay = 0,
  color = G.yellow,
  height = 8,
  style,
}: {
  pct: number;
  delay?: number;
  color?: string;
  height?: number;
  style?: ViewStyle;
}) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(
      delay,
      withTiming(Math.max(0, Math.min(100, pct)), { duration: 700, easing: EASE, reduceMotion: ReduceMotion.System })
    );
  }, [pct, delay, w]);
  const fill = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={[{ height, borderRadius: height / 2, backgroundColor: G.track, overflow: "hidden" }, style]}>
      <Animated.View style={[{ height: "100%", borderRadius: height / 2, backgroundColor: color }, fill]} />
    </View>
  );
}

/** Vertical column that grows to `height` when it mounts (trend chart bars). */
export function GAnimatedColumn({ height, delay = 0, color = G.blue, width = 20 }: { height: number; delay?: number; color?: string; width?: number }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(height, { duration: 600, easing: EASE, reduceMotion: ReduceMotion.System }));
  }, [height, delay, h]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return <Animated.View style={[{ width, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: color }, style]} />;
}

/** Fades + slides a block into view when it mounts; also animates later layout shifts. */
export function Reveal({ delay = 0, children, style, onLayout }: { delay?: number; children: React.ReactNode; style?: ViewStyle; onLayout?: React.ComponentProps<typeof View>["onLayout"] }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(380).delay(delay).easing(EASE).reduceMotion(ReduceMotion.System)}
      layout={LinearTransition.duration(240).easing(EASE).reduceMotion(ReduceMotion.System)}
      style={style}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
}

/** Content that appears/disappears inside an expandable block. */
export function Expand({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <Animated.View
      entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(140).reduceMotion(ReduceMotion.System)}
      layout={LinearTransition.duration(240).easing(EASE).reduceMotion(ReduceMotion.System)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

/**
 * Collapsible flat section: a header row (tinted icon, title, optional action, chevron)
 * sitting directly on the page, like Google Business Profile's sections. No dividers or
 * borders — whitespace between sections (the screen's `gap`) does the separating, and the
 * content renders on the page gutter so cards inside it don't nest.
 */
export function GSection({
  icon,
  title,
  subtitle,
  action,
  open,
  onToggle,
  delay = 0,
  onLayout,
  children,
}: {
  icon: MaterialIconName;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  delay?: number;
  onLayout?: React.ComponentProps<typeof View>["onLayout"];
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay} onLayout={onLayout}>
      <Button
        variant="ghost"
        className="h-auto -mx-4 flex-row items-center justify-start gap-0 rounded-xl px-4 py-3 active:bg-[#F8F9FA]"
        onPress={onToggle}
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${title}, ${open ? "collapse" : "expand"}`}
      >
        <GIconBox icon={icon} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <GText variant="section">{title}</GText>
          {subtitle ? (
            <GText variant="caption" numberOfLines={1}>
              {subtitle}
            </GText>
          ) : null}
        </View>
        {action ? <View style={{ marginRight: 4 }}>{action}</View> : null}
        <MaterialIcons name={open ? "expand-less" : "expand-more"} size={24} color={G.textSecondary} />
      </Button>
      {open ? <Expand style={{ paddingTop: 4, paddingBottom: 8 }}>{children}</Expand> : null}
    </Reveal>
  );
}
