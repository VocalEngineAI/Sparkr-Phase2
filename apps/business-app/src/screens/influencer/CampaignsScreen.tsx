import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function InfluencerCampaignsScreen() {
  return (
    <PlaceholderScreen
      title="My Campaigns"
      description="Feature 22 — pipeline, calendar, messaging, disputes. See docs/05-influencer-app-features.md."
      upcoming={[
        "Pipeline: invited → applied → hired → scheduled → posted → completed",
        "Calendar of booked visits & saved campaigns",
        "In-app messaging (post-acceptance)",
        "Dispute flow",
      ]}
    />
  );
}
