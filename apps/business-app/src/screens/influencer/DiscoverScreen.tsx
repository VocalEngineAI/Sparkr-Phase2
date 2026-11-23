import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function InfluencerDiscoverScreen() {
  return (
    <PlaceholderScreen
      title="Discover"
      description="Feature 21 — search & filters, AI recommendations, featured campaigns. See docs/05-influencer-app-features.md."
      upcoming={[
        "Filters: location, category, compensation, platform, followers, dates",
        "AI-recommended campaigns",
        "Featured campaigns",
      ]}
    />
  );
}
