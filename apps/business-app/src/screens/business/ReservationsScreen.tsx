import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function ReservationsScreen() {
  return (
    <PlaceholderScreen
      title="Reservations"
      description="Feature 16 — bookings, waitlist, deposits & policies. See docs/03-business-app-features.md."
      upcoming={[
        "Calendar & live table view",
        "Deposit & cancellation policy config",
        "Guest details & arrival check",
        "Digital waitlist management",
      ]}
    />
  );
}
