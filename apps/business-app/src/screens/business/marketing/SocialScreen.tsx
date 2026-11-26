import React, { useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@sparkr/ui";
import { mockSocialAccounts, mockSocialPosts, type SocialPlatform } from "@sparkr/shared";
import {
  Actions,
  Badge,
  Button,
  Card,
  compact,
  InfoBanner,
  ListCard,
  ListRow,
  notYet,
  PlatformIcon,
  PlatformRow,
  platformLabel,
  Screen,
  Section,
  Segmented,
  Text,
  useHeaderButton,
} from "../../../components/business/kit";
import { Input } from "../../../components/ui/input";
import { cn } from "../../../lib/utils";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Social media management: connected platforms, content calendar & scheduling (write once,
// post to Facebook + Instagram together), AI captions & hashtags, performance tracking.
// Business posting only — influencers can't post through this.

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayStrip() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return { offset, label: offset === 0 ? "Today" : DAY[d.getDay()], date: d.getDate() };
  });
}

// Stand-in for the AI caption generator until the LLM is wired up.
function fakeCaption(topic: string) {
  const t = topic.trim() || "tonight's specials";
  return `Come hungry 🍣 ${t.charAt(0).toUpperCase() + t.slice(1)} at Tang Sushie, Grand St. Members earn coins on every visit.\n\n#nycsushi #omakase #chinatownnyc #tangsushie`;
}

export default function SocialScreen({ navigation }: MarketingScreenProps<"Social">) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [tab, setTab] = useState<"scheduled" | "posted">("scheduled");
  const [topic, setTopic] = useState("");
  const [caption, setCaption] = useState("");

  useHeaderButton(navigation, {
    label: "Post",
    icon: "create-outline",
    onPress: () => notYet("New post", "Write once, then post now or schedule to Facebook and Instagram together."),
  });

  const days = dayStrip();
  const posts = mockSocialPosts.filter((p) => p.status === tab);
  const dayPosts = mockSocialPosts.filter((p) => p.status === "scheduled" && p.dayOffset === selectedDay);

  return (
    <Screen>
      <Section title="Accounts">
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {mockSocialAccounts.map((a) => (
            <Card key={a.platform} className="w-[48.5%] p-3">
              <View className="flex-row items-center gap-2">
                <PlatformIcon platform={a.platform} size={20} />
                <Text className="font-semibold flex-1">{platformLabel(a.platform)}</Text>
              </View>
              {a.connected ? (
                <Text className="text-xs text-textMuted mt-2" numberOfLines={1}>
                  {a.handle} · {compact(a.followers ?? 0)}
                </Text>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-2 h-8"
                  onPress={() => notYet(`Connect ${platformLabel(a.platform)}`)}
                >
                  <Text>Connect</Text>
                </Button>
              )}
            </Card>
          ))}
        </View>
      </Section>

      <Section title="Content calendar">
        <View className="flex-row justify-between mb-3">
          {days.map((d) => {
            const has = mockSocialPosts.some((p) => p.status === "scheduled" && p.dayOffset === d.offset);
            const selected = d.offset === selectedDay;
            return (
              <Button
                key={d.offset}
                variant={selected ? "default" : "secondary"}
                className="w-[13%] h-16 flex-col gap-0.5 px-0 rounded-xl"
                onPress={() => setSelectedDay(d.offset)}
                accessibilityState={{ selected }}
              >
                <Text className="text-[10px]">{d.label}</Text>
                <Text className="text-base font-bold">{d.date}</Text>
                <View
                  className={cn("w-1.5 h-1.5 rounded-full", has ? (selected ? "bg-accent" : "bg-primary") : "bg-transparent")}
                />
              </Button>
            );
          })}
        </View>
        {dayPosts.length === 0 ? (
          <Text className="text-sm text-textMuted">Nothing scheduled for this day.</Text>
        ) : (
          <ListCard>
            {dayPosts.map((p, i) => (
              <ListRow
                key={p.id}
                title={p.when}
                subtitle={p.caption}
                right={<PlatformRow platforms={p.platforms} />}
                chevron={false}
                last={i === dayPosts.length - 1}
              />
            ))}
          </ListCard>
        )}
      </Section>

      <Section title="AI captions & hashtags">
        <Card tone="surface">
          <Text className="text-sm text-textMuted mb-2">What's the post about?</Text>
          <Input
            value={topic}
            onChangeText={setTopic}
            placeholder="e.g. the new winter roll"
            className="bg-background"
            returnKeyType="done"
          />
          <Button className="mt-3" onPress={() => setCaption(fakeCaption(topic))}>
            <Ionicons name="sparkles" size={16} color={colors.background} />
            <Text>Generate caption</Text>
          </Button>
          {caption ? (
            <View className="bg-background rounded-xl p-3 mt-3">
              <Text className="text-sm">{caption}</Text>
              <Actions>
                <Button variant="ghost" size="sm" onPress={() => setCaption(fakeCaption(topic))}>
                  <Text>Try again</Text>
                </Button>
                <Button size="sm" onPress={() => notYet("Schedule post", "Pick platforms and a time to schedule this caption.")}>
                  <Text>Use caption</Text>
                </Button>
              </Actions>
            </View>
          ) : null}
        </Card>
      </Section>

      <Section title="Posts">
        <Segmented
          options={[
            ["scheduled", "Scheduled"],
            ["posted", "Performance"],
          ]}
          value={tab}
          onChange={setTab}
          className="mb-3"
        />
        <View className="gap-3">
          {posts.map((p) => (
            <Card key={p.id}>
              <View className="flex-row items-center justify-between">
                <PlatformRow platforms={p.platforms as SocialPlatform[]} size={16} />
                <Text className="text-xs text-textMuted">{p.when}</Text>
              </View>
              <Text className="text-sm mt-2">{p.caption}</Text>
              {p.status === "posted" ? (
                <View className="flex-row gap-2 mt-3">
                  <Badge label={`${compact(p.reach ?? 0)} reach`} icon="eye-outline" />
                  <Badge label={`${p.engagementPct}% engagement`} icon="heart-outline" tone="success" />
                </View>
              ) : null}
            </Card>
          ))}
        </View>
      </Section>

      <InfoBanner text="What's possible on each platform depends on its API. Only your business can post here, not influencers." />
    </Screen>
  );
}
