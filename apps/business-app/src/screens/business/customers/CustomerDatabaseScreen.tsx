import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusiness, mockCustomers, type MembershipTier } from "@sparkr/shared";
import { Chips, EmptyState, ListCard, ListRow, Screen, Text } from "../../../components/business/kit";
import TierBadge from "../../../components/business/TierBadge";
import { Input } from "../../../components/ui/input";
import type { CustomersScreenProps } from "../../../navigation/businessTypes";

// Feature 10: every member in one list — joiners appear automatically, no manual entry.

export default function CustomerDatabaseScreen({ navigation }: CustomersScreenProps<"CustomerDatabase">) {
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<"all" | MembershipTier>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCustomers.filter(
      (c) =>
        (tier === "all" || c.tier === tier) &&
        (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q))
    );
  }, [query, tier]);

  return (
    <Screen>
      <View className="gap-3">
        <View>
          <Input
            value={query}
            onChangeText={setQuery}
            placeholder="Search name, email or phone"
            className="pl-11"
            autoCorrect={false}
            returnKeyType="search"
          />
          <View className="absolute left-4 top-0 bottom-0 justify-center" pointerEvents="none">
            <Ionicons name="search" size={18} color={colors.textMuted} />
          </View>
        </View>
        <Chips
          options={[
            ["all", "All tiers"],
            ["gold", "Gold"],
            ["silver", "Silver"],
            ["bronze", "Bronze"],
          ]}
          value={tier}
          onChange={setTier}
        />
        <Text className="text-xs text-textMuted">
          {mockBusiness.memberCount.toLocaleString("en-US")} members · showing {results.length}
        </Text>
      </View>

      {results.length === 0 ? (
        <EmptyState icon="search-outline" title="No members found" />
      ) : (
        <ListCard>
          {results.map((c, i) => (
            <ListRow
              key={c.id}
              title={c.name}
              subtitle={`${c.coins} coins · ${c.visits} visits · last ${c.lastVisit.toLowerCase()}`}
              right={
                <View className="items-end gap-1">
                  <TierBadge tier={c.tier} />
                  {!c.smsOptIn ? <Text className="text-[10px] text-textMuted">No SMS</Text> : null}
                </View>
              }
              onPress={() => navigation.navigate("CustomerDetail", { customerId: c.id })}
              last={i === results.length - 1}
            />
          ))}
        </ListCard>
      )}
    </Screen>
  );
}
