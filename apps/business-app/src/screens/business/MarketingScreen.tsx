import React from "react";
import PlaceholderScreen from "../../components/PlaceholderScreen";

export default function MarketingScreen() {
  return (
    <PlaceholderScreen
      title="Marketing"
      description="Features 3–9 — Google reviews, social media, SMS, vouchers, deals, posts, One-Tab. See docs/03-business-app-features.md."
      upcoming={[
        "Google Reviews & AI replies",
        "Social media calendar & AI captions",
        "SMS campaigns & picture messages",
        "Vouchers, gift cards, happy hours & deals",
        "Business posts feed & One-Tab add-on",
      ]}
    />
  );
}
