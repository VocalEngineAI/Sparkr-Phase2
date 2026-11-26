import React from "react";
import { View } from "react-native";
import {
  mockBusinessPosts,
  mockCampaigns,
  mockDeals,
  mockGoogleReviews,
  mockPostReviews,
  mockSmsCredits,
  mockSocialPosts,
  mockVouchers,
} from "@sparkr/shared";
import { FeatureCard, Screen, type IconName } from "../../../components/business/kit";
import type { MarketingScreenProps, MarketingStackParamList } from "../../../navigation/businessTypes";

// Marketing: everything related to attracting and engaging customers (Features 1–8).
const FEATURES: {
  route: Exclude<keyof MarketingStackParamList, "MarketingHub">;
  icon: IconName;
  title: string;
  description: string;
  meta?: string;
}[] = [
  {
    route: "Campaigns",
    icon: "megaphone-outline",
    title: "Influencer Campaigns",
    description: "Create campaigns, review applications, hire influencers and track posts.",
    meta: `${mockCampaigns.filter((c) => c.status === "active").length} active · ${mockPostReviews.length} posts to review`,
  },
  {
    route: "Analytics",
    icon: "analytics-outline",
    title: "Analytics & ROI",
    description: "Influencer performance, redemptions, deal revenue and reports.",
  },
  {
    route: "Google",
    icon: "logo-google",
    title: "Google Management",
    description: "Google reviews, AI replies, business posts and reputation insights.",
    meta: `${mockGoogleReviews.length} new reviews`,
  },
  {
    route: "Social",
    icon: "share-social-outline",
    title: "Social Media",
    description: "Instagram, Facebook, TikTok, YouTube and RedNote management.",
    meta: `${mockSocialPosts.filter((p) => p.status === "scheduled").length} scheduled`,
  },
  {
    route: "Messaging",
    icon: "chatbubbles-outline",
    title: "SMS & Picture Messages",
    description: "SMS campaigns, AI messaging, MMS and automated triggers.",
    meta: `${mockSmsCredits.sms} SMS credits left`,
  },
  {
    route: "Vouchers",
    icon: "gift-outline",
    title: "Vouchers & Gift Cards",
    description: "Create, sell and monitor vouchers and gift cards.",
    meta: `${mockVouchers.filter((v) => v.status === "active").length} on sale`,
  },
  {
    route: "Deals",
    icon: "pricetag-outline",
    title: "Happy Hours & Deals",
    description: "Create, schedule and manage promotions.",
    meta: `${mockDeals.filter((d) => d.status === "live").length} live now`,
  },
  {
    route: "Posts",
    icon: "images-outline",
    title: "Business Posts",
    description: "Publish photos and videos to the customer discovery feed.",
    meta: mockBusinessPosts.some((p) => p.sponsoredDaysLeft) ? "1 sponsored" : undefined,
  },
];

export default function MarketingHubScreen({ navigation }: MarketingScreenProps<"MarketingHub">) {
  return (
    <Screen hub title="Marketing" subtitle="Attract and engage customers">
      <View className="gap-3">
        {FEATURES.map((f) => (
          <FeatureCard
            key={f.route}
            icon={f.icon}
            title={f.title}
            description={f.description}
            meta={f.meta}
            onPress={() => navigation.navigate(f.route)}
          />
        ))}
      </View>
    </Screen>
  );
}
