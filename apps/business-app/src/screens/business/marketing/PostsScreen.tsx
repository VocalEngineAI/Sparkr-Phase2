import React, { useState } from "react";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockBusinessPosts, type BusinessPost } from "@sparkr/shared";
import {
  Badge,
  Button,
  Card,
  compact,
  InfoBanner,
  notYet,
  Screen,
  Section,
  StatGrid,
  Text,
  useHeaderButton,
} from "../../../components/business/kit";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 8: photos/videos to the business profile and the customer discovery feed. A post
// can link to a voucher. Posting is free; sponsored top spots rotate for 1, 3 or 7 days.

const SPONSOR_PRICES = [
  { days: 1, price: 5 },
  { days: 3, price: 12 },
  { days: 7, price: 25 },
];

export default function PostsScreen({ navigation }: MarketingScreenProps<"Posts">) {
  const [posts, setPosts] = useState(mockBusinessPosts);

  useHeaderButton(navigation, {
    label: "Post",
    icon: "add",
    onPress: () => notYet("New post", "Add a photo or video, a caption, and optionally link a voucher."),
  });

  const sponsor = (id: string) =>
    Alert.alert(
      "Sponsor this post",
      "Rotate into the top spots of the discovery feed. Paid from your wallet. Tap outside to cancel.",
      // Android alerts show at most three buttons, so the three durations are the buttons.
      SPONSOR_PRICES.map((p) => ({
        text: `${p.days}d · $${p.price}`,
        onPress: () => setPosts((list) => list.map((x) => (x.id === id ? { ...x, sponsoredDaysLeft: p.days } : x))),
      })),
      { cancelable: true }
    );

  const totals = posts.reduce(
    (t, p) => ({ views: t.views + p.views, likes: t.likes + p.likes, saves: t.saves + p.saves }),
    { views: 0, likes: 0, saves: 0 }
  );

  return (
    <Screen>
      <StatGrid
        items={[
          { label: "Feed views", value: compact(totals.views), changePct: 16 },
          { label: "Likes", value: compact(totals.likes), changePct: 9 },
          { label: "Saves", value: compact(totals.saves), changePct: 12 },
          { label: "Followers", value: "2.1K", changePct: 5 },
        ]}
      />

      <Section title="Your posts">
        <View className="gap-3">
          {posts.map((p) => (
            <PostCard key={p.id} p={p} onSponsor={() => sponsor(p.id)} />
          ))}
        </View>
      </Section>

      <InfoBanner text="Customers can follow you, like and save posts, and share them outside the app by link. Only businesses post here." />
    </Screen>
  );
}

function PostCard({ p, onSponsor }: { p: BusinessPost; onSponsor: () => void }) {
  return (
    <Card className="p-0 overflow-hidden">
      <View className="h-40 bg-primary items-center justify-center">
        <Ionicons name={p.kind === "video" ? "play-circle" : "image"} size={48} color={colors.primaryLight} />
        <View className="absolute top-3 left-3 flex-row gap-2">
          {p.kind === "video" ? <Badge label="Video" icon="videocam" /> : null}
          {p.sponsoredDaysLeft ? (
            <Badge label={`Sponsored · ${p.sponsoredDaysLeft}d left`} tone="accent" icon="rocket-outline" />
          ) : null}
        </View>
      </View>
      <View className="p-4">
        <Text className="text-sm">{p.caption}</Text>
        {p.linkedVoucher ? (
          <View className="mt-2">
            <Badge label={`Links to: ${p.linkedVoucher}`} icon="gift-outline" />
          </View>
        ) : null}
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-xs text-textMuted">
            {p.time} · {compact(p.views)} views · {p.likes} likes · {p.saves} saves
          </Text>
        </View>
        <View className="flex-row justify-end gap-2 mt-3">
          <Button variant="ghost" size="sm" onPress={() => notYet("Share link", "Shares a deep link to Instagram, TikTok and more.")}>
            <Ionicons name="share-outline" size={15} color={colors.text} />
            <Text>Share</Text>
          </Button>
          {!p.sponsoredDaysLeft ? (
            <Button variant="outline" size="sm" onPress={onSponsor}>
              <Ionicons name="rocket-outline" size={15} color={colors.text} />
              <Text>Sponsor</Text>
            </Button>
          ) : null}
        </View>
      </View>
    </Card>
  );
}
