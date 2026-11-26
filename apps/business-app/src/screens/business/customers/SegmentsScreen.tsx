import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockCustomers, mockSegments } from "@sparkr/shared";
import {
  Button,
  Card,
  IconCircle,
  ListCard,
  ListRow,
  Screen,
  Section,
  Text,
  type IconName,
} from "../../../components/business/kit";
import { cn } from "../../../lib/utils";
import type { CustomersScreenProps } from "../../../navigation/businessTypes";

// Feature 10 segments: last check-in (1/3/6 months), offers claimed, birthdays, new but
// not returned, opted in. A segment is the audience for SMS and picture messages.

const ICONS: Record<string, IconName> = {
  seg_1: "gift-outline",
  seg_2: "time-outline",
  seg_3: "time-outline",
  seg_4: "time-outline",
  seg_5: "person-outline",
  seg_6: "pricetag-outline",
  seg_7: "chatbubble-outline",
};

// Which demo members fall in each segment (the real filter runs server-side later).
const MATCH: Record<string, (c: (typeof mockCustomers)[number]) => boolean> = {
  seg_1: (c) => c.birthday.startsWith("Dec"),
  seg_2: (c) => /month|months/.test(c.lastVisit),
  seg_3: (c) => /[3-9] months/.test(c.lastVisit),
  seg_4: (c) => /[6-9] months/.test(c.lastVisit),
  seg_5: (c) => c.visits <= 1,
  seg_6: (c) => c.visits >= 10,
  seg_7: (c) => c.smsOptIn,
};

export default function SegmentsScreen({ navigation }: CustomersScreenProps<"Segments">) {
  const [selected, setSelected] = useState(mockSegments[0].id);
  const segment = mockSegments.find((s) => s.id === selected)!;
  const members = mockCustomers.filter(MATCH[selected] ?? (() => false));

  return (
    <Screen>
      <View className="gap-3">
        {mockSegments.map((s) => {
          const on = s.id === selected;
          return (
            <Button
              key={s.id}
              variant="outline"
              className={cn("h-auto justify-start gap-0 rounded-2xl p-4", on && "border-primary border-2")}
              onPress={() => setSelected(s.id)}
              accessibilityState={{ selected: on }}
            >
              <View className="mr-3">
                <IconCircle icon={ICONS[s.id] ?? "people-outline"} tone={on ? "primary" : "neutral"} size={40} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-base">{s.name}</Text>
                <Text className="text-sm text-textMuted">{s.description}</Text>
              </View>
              <Text className="text-lg font-extrabold ml-2">{s.count}</Text>
            </Button>
          );
        })}
      </View>

      <Section title={segment.name} subtitle={`${segment.count} members`}>
        {members.length === 0 ? (
          <Text className="text-sm text-textMuted">No demo members in this segment.</Text>
        ) : (
          <ListCard className="mb-3">
            {members.map((c, i) => (
              <ListRow
                key={c.id}
                title={c.name}
                subtitle={`Last visit ${c.lastVisit.toLowerCase()} · birthday ${c.birthday}`}
                onPress={() => navigation.navigate("CustomerDetail", { customerId: c.id })}
                last={i === members.length - 1}
              />
            ))}
          </ListCard>
        )}
        <Card tone="surface">
          <Text className="text-sm">
            Message this segment by SMS or picture message. Only opted-in members receive it.
          </Text>
          <Button
            className="mt-3"
            onPress={() => navigation.getParent()?.navigate("Marketing", { screen: "Messaging", initial: false })}
          >
            <Ionicons name="paper-plane-outline" size={16} color={colors.background} />
            <Text>Message {segment.count} members</Text>
          </Button>
        </Card>
      </Section>
    </Screen>
  );
}
