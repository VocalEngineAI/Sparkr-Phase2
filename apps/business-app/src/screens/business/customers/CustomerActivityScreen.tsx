import React, { useState } from "react";
import { mockCustomerActivity, mockCustomers, type CustomerActivity } from "@sparkr/shared";
import { Chips, EmptyState, ListCard, ListRow, Screen, Text, type IconName, type Tone } from "../../../components/business/kit";
import type { CustomersScreenProps } from "../../../navigation/businessTypes";

// Membership activity across all members: visits, coins earned, redemptions, joins.

const KIND: Record<CustomerActivity["kind"], { label: string; icon: IconName; tone: Tone }> = {
  visit: { label: "Visit", icon: "location-outline", tone: "neutral" },
  coins_earned: { label: "Coins earned", icon: "add-circle-outline", tone: "success" },
  redeemed: { label: "Coins redeemed", icon: "remove-circle-outline", tone: "neutral" },
  joined: { label: "Joined", icon: "person-add-outline", tone: "accent" },
  voucher: { label: "Voucher", icon: "gift-outline", tone: "neutral" },
};

export default function CustomerActivityScreen({ navigation }: CustomersScreenProps<"CustomerActivity">) {
  const [filter, setFilter] = useState<"all" | CustomerActivity["kind"]>("all");
  const items = mockCustomerActivity.filter((a) => filter === "all" || a.kind === filter);

  return (
    <Screen>
      <Chips
        options={[
          ["all", "All"],
          ["visit", "Visits"],
          ["coins_earned", "Coins earned"],
          ["redeemed", "Redemptions"],
          ["voucher", "Vouchers"],
          ["joined", "New members"],
        ]}
        value={filter}
        onChange={setFilter}
      />

      {items.length === 0 ? (
        <EmptyState icon="pulse-outline" title="No activity" />
      ) : (
        <ListCard>
          {items.map((a, i) => {
            const k = KIND[a.kind];
            const customer = mockCustomers.find((c) => c.name === a.customer);
            return (
              <ListRow
                key={a.id}
                icon={k.icon}
                iconTone={k.tone}
                title={a.customer}
                subtitle={a.detail}
                right={<Text className="text-xs text-textMuted">{a.time}</Text>}
                onPress={customer ? () => navigation.navigate("CustomerDetail", { customerId: customer.id }) : undefined}
                last={i === items.length - 1}
              />
            );
          })}
        </ListCard>
      )}
    </Screen>
  );
}
