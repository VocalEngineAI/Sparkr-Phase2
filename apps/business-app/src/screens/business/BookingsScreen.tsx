import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function BookingsScreen() {
  return (
    <PlaceholderScreen
      title="Bookings"
      description="Feature 16 reservations & waitlist, plus events & tickets. See docs/03-business-app-features.md and docs/07-events-and-tickets.md."
      upcoming={[
        "Calendar & live table view",
        "Deposit & cancellation policy config",
        "Guest details & arrival check",
        "Digital waitlist management",
        "Create & publish events, ticket pricing & promo codes",
        "Ticket sales dashboard & influencer promotion",
      ]}
    />
  );
}
