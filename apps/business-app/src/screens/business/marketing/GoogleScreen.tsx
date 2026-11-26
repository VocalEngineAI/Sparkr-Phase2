import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import {
  mockBusiness,
  mockGoogleProfileStats,
  mockGooglePosts,
  mockGoogleRatingBreakdown,
  mockGoogleRatingTrend,
  mockGoogleReviews,
  type GoogleReview,
} from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  Chips,
  compact,
  IconCircle,
  InfoBanner,
  LinkButton,
  ListCard,
  ListRow,
  notYet,
  ProgressBar,
  Screen,
  Section,
  StatStrip,
  SwitchRow,
  Text,
} from "../../../components/business/kit";
import { cn } from "../../../lib/utils";

// Feature 3: connect Google (OAuth), monitor reviews with AI auto-replies, post on Google,
// and reputation insights. Needs Google API approval, so it runs on sample data for now.

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-outline"}
          size={size}
          color={colors.accent}
        />
      ))}
    </View>
  );
}

export default function GoogleScreen() {
  const [autoReply, setAutoReply] = useState(true);
  const [notify, setNotify] = useState(true);
  const [filter, setFilter] = useState<"all" | "positive" | "negative">("all");

  const total = mockGoogleRatingBreakdown.reduce((n, r) => n + r.count, 0);
  const reviews = mockGoogleReviews.filter((r) =>
    filter === "all" ? true : filter === "positive" ? r.rating >= 4 : r.rating <= 3
  );
  const maxTrend = 5;

  return (
    <Screen>
      <InfoBanner text="Google management needs Google API approval for Sparkr. Until then, this shows sample data." />

      <Card>
        <View className="flex-row items-center">
          <IconCircle icon="logo-google" size={44} />
          <View className="flex-1 ml-3">
            <Text className="font-bold">Google Business Profile</Text>
            <Text className="text-sm text-textMuted">1 location linked · {mockBusiness.address}</Text>
          </View>
          <Badge label="Connected" tone="success" icon="checkmark" />
        </View>
        <Button variant="outline" size="sm" className="mt-3 self-start" onPress={() => notYet("Manage locations", "Pick which verified locations on your Google account to link.")}>
          <Text>Manage locations</Text>
        </Button>
      </Card>

      <Section title="Reputation">
        <Card>
          <View className="flex-row items-center">
            <View className="items-center mr-5">
              <Text className="text-4xl font-extrabold">{mockBusiness.googleRating.toFixed(1)}</Text>
              <Stars rating={mockBusiness.googleRating} />
              <Text className="text-xs text-textMuted mt-1">{total} reviews</Text>
            </View>
            <View className="flex-1 gap-1.5">
              {mockGoogleRatingBreakdown.map((r) => (
                <View key={r.stars} className="flex-row items-center gap-2">
                  <Text className="text-xs w-3">{r.stars}</Text>
                  <ProgressBar pct={(r.count / total) * 100} className="flex-1" />
                </View>
              ))}
            </View>
          </View>

          <Text className="text-xs text-textMuted mt-5 mb-2">Average rating · last 6 months</Text>
          <View className="flex-row items-end justify-between h-20">
            {mockGoogleRatingTrend.map((m) => (
              <View key={m.month} className="items-center flex-1">
                <Text className="text-[10px] text-textMuted mb-1">{m.rating.toFixed(1)}</Text>
                <View
                  className="w-5 rounded-t-md bg-primary"
                  style={{ height: Math.max(6, ((m.rating - 4) / (maxTrend - 4)) * 48) }}
                />
                <Text className="text-[10px] text-textMuted mt-1">{m.month}</Text>
              </View>
            ))}
          </View>
        </Card>
      </Section>

      <Section title="Profile performance" subtitle="Last 30 days">
        <StatStrip items={mockGoogleProfileStats} />
      </Section>

      <Section title="Reviews">
        <ListCard className="mb-3">
          <SwitchRow
            icon="sparkles-outline"
            title="AI auto-replies"
            description="AI replies to every review in your tone and posts it as the owner's response."
            value={autoReply}
            onValueChange={setAutoReply}
          />
          <SwitchRow
            icon="notifications-outline"
            title="Review notifications"
            value={notify}
            onValueChange={setNotify}
            last
          />
        </ListCard>
        <View className="mb-3">
          <Chips
            options={[
              ["all", "All"],
              ["positive", "4–5★"],
              ["negative", "1–3★"],
            ]}
            value={filter}
            onChange={setFilter}
          />
        </View>
        <View className="gap-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </View>
      </Section>

      <Section
        title="Posts on Google"
        action={<LinkButton label="New post" onPress={() => notYet("New Google post", "AI drafts the post, like the social media tool.")} />}
      >
        <ListCard>
          {mockGooglePosts.map((p, i) => (
            <ListRow
              key={p.id}
              icon={p.kind === "offer" ? "pricetag-outline" : p.kind === "event" ? "calendar-outline" : "newspaper-outline"}
              title={p.title}
              subtitle={`${p.kind === "offer" ? "Offer" : p.kind === "event" ? "Event" : "Update"} · ${p.time}`}
              right={<Text className="text-sm text-textMuted">{compact(p.views)} views</Text>}
              chevron={false}
              last={i === mockGooglePosts.length - 1}
            />
          ))}
        </ListCard>
      </Section>
    </Screen>
  );
}

function ReviewCard({ r }: { r: GoogleReview }) {
  const negative = r.rating <= 2;
  return (
    <Card className={cn(negative && "border-warning/40")}>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold">{r.author}</Text>
        <Text className="text-xs text-textMuted">{r.time}</Text>
      </View>
      <View className="mt-1">
        <Stars rating={r.rating} />
      </View>
      <Text className="text-sm mt-2">{r.text}</Text>
      {r.aiReply ? (
        <View className="bg-surface rounded-xl p-3 mt-3">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name="sparkles" size={12} color={colors.text} />
            <Text className="text-xs font-semibold">AI reply · posted</Text>
          </View>
          <Text className="text-sm">{r.aiReply}</Text>
        </View>
      ) : null}
    </Card>
  );
}
