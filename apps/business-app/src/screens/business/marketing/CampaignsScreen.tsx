import React, { useMemo, useState } from "react";
import { Alert, View } from "react-native";
import {
  mockApplicants,
  mockCampaigns,
  mockInfluencerDirectory,
  mockPostReviews,
  type Campaign,
  type InfluencerPlatform,
} from "@sparkr/shared";
import {
  Actions,
  Badge,
  Button,
  Card,
  Chips,
  compact,
  EmptyState,
  InfoBanner,
  ListCard,
  ListRow,
  money,
  notYet,
  PlatformIcon,
  PlatformRow,
  ProgressBar,
  Screen,
  Section,
  Segmented,
  Text,
  useHeaderButton,
} from "../../../components/business/kit";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 1: create campaigns, review applications, hire influencers, review live posts.

/** Sparkr's cut of a paid campaign, by size (slide 47). Barter is free. */
function sparkrFeePct(c: Campaign) {
  if (c.type === "barter" || !c.paymentPerInfluencer) return 0;
  const p = c.paymentPerInfluencer;
  return p < 100 ? 10 : p <= 300 ? 15 : 20;
}

export default function CampaignsScreen({ navigation }: MarketingScreenProps<"Campaigns">) {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [status, setStatus] = useState<Campaign["status"]>("active");
  const [reviews, setReviews] = useState(mockPostReviews);
  const [applicants, setApplicants] = useState(mockApplicants);

  useHeaderButton(navigation, {
    label: "New",
    icon: "add",
    onPress: () =>
      notYet(
        "New campaign",
        "The campaign builder (paid/barter, platforms, slots & budget, visit hours, follower offer, minimum followers) is the next build."
      ),
  });

  const count = (s: Campaign["status"]) => campaigns.filter((c) => c.status === s).length;
  const shown = campaigns.filter((c) => c.status === status);

  const publish = (id: string) => {
    setCampaigns((list) => list.map((c) => (c.id === id ? { ...c, status: "active" } : c)));
    setStatus("active");
  };

  const approve = (id: string) => {
    setReviews((list) => list.filter((r) => r.id !== id));
    Alert.alert("Post approved", "Paid campaigns are paid from your wallet within 72 hours.");
  };

  const hire = (id: string, handle: string) => {
    setApplicants((list) => list.filter((a) => a.id !== id));
    Alert.alert("Hired", `${handle} gets a unique code to share with followers.`);
  };

  return (
    <Screen>
      <InfoBanner text="Barter campaigns have no Sparkr fee. Cancelling or rescheduling is always free. Paid campaigns are paid from your wallet within 72 hours of approving a post." />

      <View>
        <Segmented
          options={[
            ["active", `Active (${count("active")})`],
            ["draft", `Drafts (${count("draft")})`],
            ["completed", `Done (${count("completed")})`],
          ]}
          value={status}
          onChange={setStatus}
          className="mb-3"
        />
        <View className="gap-3">
          {shown.length === 0 ? (
            <EmptyState icon="megaphone-outline" title="Nothing here yet" />
          ) : (
            shown.map((c) => <CampaignCard key={c.id} c={c} onPublish={() => publish(c.id)} />)
          )}
        </View>
      </View>

      <Section title="Posts to review" count={reviews.length}>
        {reviews.length === 0 ? (
          <Text className="text-sm text-textMuted">You're all caught up.</Text>
        ) : (
          <View className="gap-3">
            {reviews.map((r) => (
              <Card key={r.id}>
                <View className="flex-row items-center gap-2">
                  <PlatformIcon platform={r.platform} size={18} />
                  <Text className="font-semibold flex-1">{r.handle}</Text>
                  <Badge label={r.autoApprovesIn} tone="warning" icon="time-outline" />
                </View>
                <Text className="text-xs text-textMuted mt-1">
                  {r.campaignTitle} · {r.submitted}
                </Text>
                <View className="bg-surface rounded-xl p-3 mt-3">
                  <Text className="text-sm">{r.caption}</Text>
                </View>
                <Actions>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() =>
                      notYet("Request changes", "Opens in-app messaging. You can ask for caption or hashtag changes only.")
                    }
                  >
                    <Text>Request changes</Text>
                  </Button>
                  <Button size="sm" onPress={() => approve(r.id)}>
                    <Text>Approve</Text>
                  </Button>
                </Actions>
              </Card>
            ))}
          </View>
        )}
      </Section>

      <Section title="Applicants" count={applicants.length}>
        {applicants.length === 0 ? (
          <Text className="text-sm text-textMuted">No new applications.</Text>
        ) : (
          <View className="gap-3">
            {applicants.map((a) => (
              <Card key={a.id}>
                <View className="flex-row items-center gap-2">
                  <PlatformIcon platform={a.platform} size={18} />
                  <Text className="font-semibold">{a.handle}</Text>
                  <Text className="text-sm text-textMuted">· {compact(a.followers)} followers</Text>
                </View>
                <Text className="text-sm text-textMuted mt-1">
                  {a.name} · {a.location} · {a.pastCollabs} past collabs · party of {a.partySize}
                </Text>
                <Text className="text-xs text-textMuted mt-1">Applied to {a.campaignTitle}</Text>
                <Actions>
                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => setApplicants((l) => l.filter((x) => x.id !== a.id))}
                  >
                    <Text>Decline</Text>
                  </Button>
                  <Button variant="outline" size="sm" onPress={() => notYet("Influencer profile")}>
                    <Text>Profile</Text>
                  </Button>
                  <Button size="sm" onPress={() => hire(a.id, a.handle)}>
                    <Text>Hire</Text>
                  </Button>
                </Actions>
              </Card>
            ))}
          </View>
        )}
      </Section>

      <FindInfluencers />
    </Screen>
  );
}

function CampaignCard({ c, onPublish }: { c: Campaign; onPublish: () => void }) {
  const fee = sparkrFeePct(c);
  const open = c.slotsTotal - c.slotsFilled;
  return (
    <Card>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-bold text-base">{c.title}</Text>
          <Text className="text-xs text-textMuted mt-0.5">
            {c.startDate} – {c.endDate} · {c.branch}
          </Text>
        </View>
        <Badge label={c.type === "paid" ? "Paid" : "Barter"} tone={c.type === "paid" ? "primary" : "accent"} />
      </View>

      <View className="flex-row items-center justify-between mt-3">
        <PlatformRow platforms={c.platforms} size={16} />
        <Text className="text-xs text-textMuted">
          {c.minFollowers ? `${compact(c.minFollowers)}+ followers` : "No follower minimum"}
        </Text>
      </View>

      <ProgressBar pct={(c.slotsFilled / c.slotsTotal) * 100} className="mt-3" />
      <View className="flex-row justify-between mt-1.5">
        <Text className="text-xs text-textMuted">
          {c.slotsFilled} of {c.slotsTotal} slots hired
        </Text>
        <Text className="text-xs text-textMuted">
          {c.status === "active" && open === 0 ? "Full · closed to applications" : c.applicants ? `${c.applicants} applicants` : ""}
        </Text>
      </View>

      <View className="bg-surface rounded-xl p-3 mt-3 gap-1">
        <Text className="text-sm">
          {money(c.creditOffered)} dining credit
          {c.paymentPerInfluencer ? ` + ${money(c.paymentPerInfluencer)} per influencer` : ""}
        </Text>
        <Text className="text-xs text-textMuted">
          Visits {c.visitHours}
          {fee ? ` · Sparkr fee ${fee}%` : " · No Sparkr fee"}
        </Text>
        {c.followerOffer ? <Text className="text-xs text-textMuted">Follower offer: {c.followerOffer}</Text> : null}
      </View>

      {c.status === "draft" ? (
        <Actions>
          <Button variant="outline" size="sm" onPress={() => notYet("Edit campaign")}>
            <Text>Edit</Text>
          </Button>
          <Button size="sm" onPress={onPublish}>
            <Text>Publish</Text>
          </Button>
        </Actions>
      ) : null}
    </Card>
  );
}

// Slide 41: filter influencers by platform, followers and location.
function FindInfluencers() {
  const [platform, setPlatform] = useState<"all" | InfluencerPlatform>("all");
  const [minFollowers, setMinFollowers] = useState<"0" | "10000" | "50000">("0");

  const results = useMemo(
    () =>
      mockInfluencerDirectory.filter((i) =>
        i.accounts.some(
          (a) => (platform === "all" || a.platform === platform) && a.followers >= Number(minFollowers)
        )
      ),
    [platform, minFollowers]
  );

  return (
    <Section title="Find influencers">
      <View className="gap-2 mb-3">
        <Chips
          options={[
            ["all", "All platforms"],
            ["instagram", "Instagram"],
            ["tiktok", "TikTok"],
            ["youtube", "YouTube"],
            ["rednote", "RedNote"],
          ]}
          value={platform}
          onChange={setPlatform}
        />
        <Chips
          options={[
            ["0", "Any followers"],
            ["10000", "10K+"],
            ["50000", "50K+"],
          ]}
          value={minFollowers}
          onChange={setMinFollowers}
        />
      </View>
      {results.length === 0 ? (
        <EmptyState icon="search-outline" title="No influencers match" detail="Try a different platform or follower range." />
      ) : (
        <ListCard>
          {results.map((i, idx) => (
            <ListRow
              key={i.id}
              title={i.handle}
              subtitle={`${i.category} · ${i.location} · ${i.accounts
                .map((a) => `${compact(a.followers)}`)
                .join(" / ")} followers`}
              right={<PlatformRow platforms={i.accounts.map((a) => a.platform)} />}
              onPress={() => notYet(i.name, `${i.pastCollabs} past collaborations. Profile & invite come with the campaign builder.`)}
              last={idx === results.length - 1}
            />
          ))}
        </ListCard>
      )}
    </Section>
  );
}
