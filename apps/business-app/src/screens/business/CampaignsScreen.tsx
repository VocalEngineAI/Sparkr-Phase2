import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function CampaignsScreen() {
  return (
    <PlaceholderScreen
      title="Influencer Campaigns"
      description="Feature 1 — create, manage, and track campaigns. See docs/03-business-app-features.md."
      upcoming={[
        "Campaign list (paid/barter, slots filled)",
        "Create/edit wizard — dates, platforms, slots, budget, visit availability, offer",
        "Applicant review & hire flow",
        "Visit tracking & post review/revision",
      ]}
    />
  );
}
