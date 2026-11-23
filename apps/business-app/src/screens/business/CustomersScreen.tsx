import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function CustomersScreen() {
  return (
    <PlaceholderScreen
      title="Customers"
      description="Features 10–14 — database, segments, membership, tiers, coins. See docs/03-business-app-features.md."
      upcoming={[
        "Customer list & segment filters",
        "CSV import & welcome messages",
        "Membership card designer & tier builder",
        "Sparkr Coins — rate config & QR scan",
      ]}
    />
  );
}
