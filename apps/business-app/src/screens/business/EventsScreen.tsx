import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function EventsScreen() {
  return (
    <PlaceholderScreen
      title="Events & Tickets"
      description="Events & ticket sales. See docs/07-events-and-tickets.md."
      upcoming={[
        "Create & publish events",
        "Ticket quantity, pricing & promo codes",
        "Sales dashboard",
        "Open event to influencer promotion",
      ]}
    />
  );
}
