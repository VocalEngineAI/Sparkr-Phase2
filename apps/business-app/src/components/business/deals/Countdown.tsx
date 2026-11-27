import React from "react";
import type { TextStyle } from "react-native";
import type { Deal } from "@sparkr/shared";
import { Text } from "../../ui/text";
import { dealPhase, formatCountdown, useNow } from "../../../lib/dealTime";

/**
 * Live countdown derived from the deal's timing: "Ends in 1h 24m", "Starts in 2d 3h",
 * "Always on", "Paused", "Ended". Plain text so it can sit in any chip; ticks once a second
 * on its own so the card doesn't re-render.
 */
export function Countdown({ deal, className, style }: { deal: Pick<Deal, "timing" | "active">; className?: string; style?: TextStyle }) {
  const now = useNow(1000);
  const phase = dealPhase(deal, now);
  const text = phase.until !== undefined ? `${phase.label} ${formatCountdown(phase.until - now)}` : phase.label;
  return (
    <Text className={className} style={[{ fontVariant: ["tabular-nums"] }, style]} accessibilityLiveRegion="polite" numberOfLines={1}>
      {text}
    </Text>
  );
}
