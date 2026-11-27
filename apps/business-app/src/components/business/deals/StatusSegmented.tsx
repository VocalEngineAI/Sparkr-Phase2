import React from "react";
import { View } from "react-native";
import type { DealStatus } from "@sparkr/shared";
import { Button, Text } from "../kit";
import { D } from "./common";

/**
 * Same segmented switch as the rest of the app (soft track, one filled segment), with this
 * screen's blue for the selected segment instead of brand navy.
 */
export function StatusSegmented({ value, counts, onChange }: { value: DealStatus; counts: Record<DealStatus, number>; onChange: (s: DealStatus) => void }) {
  const options: [DealStatus, string][] = [
    ["live", `Live (${counts.live})`],
    ["scheduled", `Scheduled (${counts.scheduled})`],
    ["ended", `Ended (${counts.ended})`],
  ];
  return (
    <View className="flex-row bg-surface rounded-2xl p-1">
      {options.map(([key, label]) => {
        const selected = key === value;
        return (
          <Button
            key={key}
            size="sm"
            variant="ghost"
            className="flex-1 px-1 rounded-xl active:bg-transparent"
            style={selected ? { backgroundColor: D.blue } : undefined}
            onPress={() => onChange(key)}
            accessibilityState={{ selected }}
          >
            <Text numberOfLines={1} className="text-sm font-semibold" style={{ color: selected ? D.card : D.ink, fontVariant: ["tabular-nums"] }}>
              {label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
}
