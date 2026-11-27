import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView, TextInput, View, type LayoutChangeEvent, type ScrollViewInstance } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  mockBusiness,
  mockGoogleProfileStats,
  mockGooglePosts,
  mockGoogleRatingBreakdown,
  mockGoogleRatingTrend,
  mockGoogleReviews,
  type BusinessCategory,
  type GooglePost,
  type GoogleReview,
} from "@sparkr/shared";
import { GoogleLogo } from "../../../components/GoogleLogo";
import { Button, compact, notYet } from "../../../components/business/kit";
import {
  Expand,
  G,
  GAnimatedBar,
  GAnimatedColumn,
  GAvatar,
  GButton,
  GCard,
  GChip,
  GDivider,
  GFilterChip,
  GIconButton,
  GSection,
  GStars,
  GSwitchRow,
  GText,
  gFont,
  Reveal,
  type MaterialIconName,
} from "../../../components/business/google";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 3: connect Google (OAuth), monitor reviews with AI auto-replies, post on Google,
// and reputation insights. Needs Google API approval, so it runs on sample data for now.
//
// Styled after Google Business Profile (see components/business/google.tsx): white page,
// whitespace instead of dividers, Google Blue actions, DM Sans type. Sections are flat and collapsible;
// the chip row under the profile jumps to a section. Reviews expand in place to show the
// full text, the owner reply and a reply composer.

type SectionKey = "reviews" | "performance" | "posts" | "settings";
type Filter = "all" | "positive" | "negative" | "unreplied";

/** Owner response shown under a review. `posted` came from Google; `saved` was written
 * here and will publish once the Google connection is live. */
type Reply = { text: string; by: "ai" | "owner"; status: "posted" | "saved" };

const CATEGORY_LABEL: Record<BusinessCategory, string> = {
  restaurant: "Restaurant",
  nail_salon: "Nail salon",
  spa: "Spa",
};

const SECTIONS: { key: SectionKey; icon: MaterialIconName; label: string }[] = [
  { key: "reviews", icon: "rate-review", label: "Reviews" },
  { key: "performance", icon: "insights", label: "Performance" },
  { key: "posts", icon: "campaign", label: "Posts" },
  { key: "settings", icon: "settings", label: "Settings" },
];

const POST_KIND: Record<GooglePost["kind"], { icon: MaterialIconName; label: string }> = {
  update: { icon: "article", label: "Update" },
  offer: { icon: "local-offer", label: "Offer" },
  event: { icon: "event", label: "Event" },
};

export default function GoogleScreen({ navigation }: MarketingScreenProps<"Google">) {
  const [autoReply, setAutoReply] = useState(true);
  const [notify, setNotify] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({ reviews: true, performance: true, posts: true, settings: true });
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, Reply>>(() =>
    Object.fromEntries(
      mockGoogleReviews.filter((r) => r.aiReply).map((r) => [r.id, { text: r.aiReply!, by: "ai", status: "posted" } satisfies Reply])
    )
  );

  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsets = useRef<Partial<Record<SectionKey, number>>>({});

  const total = mockGoogleRatingBreakdown.reduce((n, r) => n + r.count, 0);
  const maxCount = Math.max(...mockGoogleRatingBreakdown.map((r) => r.count));
  const unreplied = mockGoogleReviews.filter((r) => !replies[r.id]).length;
  const reviews = useMemo(
    () =>
      mockGoogleReviews.filter((r) =>
        filter === "all" ? true : filter === "positive" ? r.rating >= 4 : filter === "negative" ? r.rating <= 3 : !replies[r.id]
      ),
    [filter, replies]
  );

  // Sample data only: "refreshing" just shows the native (Google-coloured on Android) spinner.
  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const jumpTo = (key: SectionKey) => {
    setActiveSection(key);
    setOpen((o) => ({ ...o, [key]: true }));
    const y = offsets.current[key];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
  };
  const toggle = (key: SectionKey) => setOpen((o) => ({ ...o, [key]: !o[key] }));
  const onSectionLayout = (key: SectionKey) => (e: LayoutChangeEvent) => {
    offsets.current[key] = e.nativeEvent.layout.y;
  };

  const overflow = () =>
    Alert.alert("Google Business Profile", undefined, [
      { text: "Refresh", onPress: () => { scrollRef.current?.scrollTo({ y: 0, animated: true }); refresh(); } },
      { text: "Manage locations", onPress: () => notYet("Manage locations", "Pick which verified locations on your Google account to link.") },
      { text: "Cancel", style: "cancel" },
    ]);

  // Compact Google-style header: G mark + title; business avatar + overflow on the right.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <GoogleLogo size={22} />
          <GText variant="headline" style={{ fontSize: 17, lineHeight: 24 }} numberOfLines={1}>
            Google Business Profile
          </GText>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full active:bg-[#F1F3F4]"
            onPress={() => navigation.navigate("More", { screen: "BusinessProfile", initial: false })}
            accessibilityLabel={`${mockBusiness.name} profile`}
          >
            <GAvatar name={mockBusiness.name} size={30} color={G.blue} />
          </Button>
          <GIconButton icon="more-vert" label="More options" onPress={overflow} />
        </View>
      ),
    });
  }, [navigation]);

  const postReply = (id: string, text: string) =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setReplies((r) => ({ ...r, [id]: { text, by: "owner", status: "saved" } }));
        resolve();
      }, 900)
    );

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: G.bg }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, gap: 28 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={G.blue} colors={[G.blue, G.red, G.yellow, G.green]} />
      }
    >
      {/* Profile overview */}
      <Reveal>
        <GCard>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <GAvatar name={mockBusiness.name} size={52} color={G.blue} />
            <View style={{ flex: 1 }}>
              <GText variant="title" numberOfLines={1}>
                {mockBusiness.name}
              </GText>
              <GText variant="body" color={G.textSecondary} numberOfLines={1}>
                {CATEGORY_LABEL[mockBusiness.category]}
                {mockBusiness.cuisine ? ` · ${mockBusiness.cuisine}` : ""}
              </GText>
            </View>
            <GChip label="Connected" tone="green" dot />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 }}>
            <GText variant="headline" weight="medium">
              {mockBusiness.googleRating.toFixed(1)}
            </GText>
            <GStars rating={mockBusiness.googleRating} size={16} />
            <GText variant="body" color={G.textSecondary}>
              ({mockBusiness.googleReviewCount})
            </GText>
          </View>

          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 6, marginTop: 6 }}>
            <MaterialIcons name="location-on" size={16} color={G.textSecondary} style={{ marginTop: 2 }} />
            <GText variant="body" color={G.textSecondary} style={{ flex: 1 }}>
              1 location linked · {mockBusiness.address}, {mockBusiness.city}
            </GText>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            <GButton
              label="Manage locations"
              icon="storefront"
              variant="outlined"
              compact
              onPress={() => notYet("Manage locations", "Pick which verified locations on your Google account to link.")}
            />
            <GButton label="Refresh" icon="refresh" variant="text" compact loading={refreshing} onPress={refresh} />
          </View>
        </GCard>
      </Reveal>

      {/* Section chips (jump links) */}
      <Reveal delay={80}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {SECTIONS.map((s) => (
            <Button
              key={s.key}
              variant="ghost"
              className={
                activeSection === s.key
                  ? "h-9 rounded-full px-4 py-0 gap-1.5 bg-[#E8F0FE] active:bg-[#D2E3FC]"
                  : "h-9 rounded-full px-4 py-0 gap-1.5 bg-white border border-[#DADCE0] active:bg-[#F1F3F4]"
              }
              onPress={() => jumpTo(s.key)}
              accessibilityState={{ selected: activeSection === s.key }}
            >
              <MaterialIcons name={s.icon} size={18} color={activeSection === s.key ? G.blueText : G.textSecondary} />
              <GText variant="label" color={activeSection === s.key ? G.blueText : G.text}>
                {s.label}
              </GText>
            </Button>
          ))}
        </ScrollView>
      </Reveal>

      {/* Reviews */}
      <GSection
        icon="rate-review"
        title="Reviews"
        subtitle={unreplied ? `${total} total · ${unreplied} awaiting reply` : `${total} total · all replied`}
        open={open.reviews}
        onToggle={() => toggle("reviews")}
        onLayout={onSectionLayout("reviews")}
        delay={120}
      >
        {/* Rating overview */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <View style={{ alignItems: "center", minWidth: 84 }}>
            <GText variant="display">{mockBusiness.googleRating.toFixed(1)}</GText>
            <GStars rating={mockBusiness.googleRating} size={18} />
            <GText variant="caption" style={{ marginTop: 4 }}>
              {total} reviews
            </GText>
          </View>
          <View style={{ flex: 1, gap: 6 }}>
            {mockGoogleRatingBreakdown.map((r, i) => (
              <View key={r.stars} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <GText variant="caption" color={G.text} style={{ width: 10, textAlign: "center" }}>
                  {r.stars}
                </GText>
                <GAnimatedBar pct={(r.count / maxCount) * 100} delay={120 + i * 60} style={{ flex: 1 }} />
                <GText variant="caption" style={{ width: 30, textAlign: "right" }}>
                  {r.count}
                </GText>
              </View>
            ))}
          </View>
        </View>

        {/* Trend */}
        <GText variant="caption" style={{ marginTop: 18, marginBottom: 8 }}>
          Average rating · last 6 months
        </GText>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 92 }}>
          {mockGoogleRatingTrend.map((m, i) => (
            <View key={m.month} style={{ alignItems: "center", flex: 1, gap: 4 }}>
              <GText variant="caption" weight="medium" color={G.text}>
                {m.rating.toFixed(1)}
              </GText>
              <GAnimatedColumn height={Math.max(6, ((m.rating - 4) / 1) * 48)} delay={300 + i * 50} />
              <GText variant="caption">{m.month}</GText>
            </View>
          ))}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16, marginTop: 20 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {(
            [
              ["all", "All"],
              ["positive", "4–5 stars"],
              ["negative", "1–3 stars"],
              ["unreplied", "Awaiting reply"],
            ] as const
          ).map(([key, label]) => (
            <GFilterChip key={key} label={label} selected={filter === key} onPress={() => setFilter(key)} />
          ))}
        </ScrollView>

        {/* Review cards */}
        <View style={{ gap: 10, marginTop: 14 }}>
          {reviews.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 24, gap: 6 }}>
              <MaterialIcons name="check-circle" size={32} color={G.green} />
              <GText variant="body" color={G.textSecondary}>
                Nothing here — every review has a reply.
              </GText>
            </View>
          ) : (
            reviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                reply={replies[r.id]}
                expanded={expandedReview === r.id}
                onToggle={() => setExpandedReview((cur) => (cur === r.id ? null : r.id))}
                onReply={(text) => postReply(r.id, text)}
                autoReply={autoReply}
              />
            ))
          )}
        </View>
      </GSection>

      {/* Performance */}
      <GSection
        icon="insights"
        title="Performance"
        subtitle="Last 30 days · how people find you on Google"
        open={open.performance}
        onToggle={() => toggle("performance")}
        onLayout={onSectionLayout("performance")}
        delay={160}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 10 }}>
          {mockGoogleProfileStats.map((s) => {
            const up = (s.changePct ?? 0) >= 0;
            return (
              <View key={s.id} style={{ width: "48.5%", backgroundColor: G.surface, borderRadius: 12, padding: 14 }}>
                <GText variant="caption" numberOfLines={1}>
                  {s.label}
                </GText>
                <GText variant="title" style={{ fontSize: 24, lineHeight: 33, marginTop: 4 }}>
                  {s.value}
                </GText>
                {s.changePct !== undefined ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2, marginTop: 4 }}>
                    <MaterialIcons name={up ? "arrow-upward" : "arrow-downward"} size={14} color={up ? G.greenText : G.redText} />
                    <GText variant="caption" weight="medium" color={up ? G.greenText : G.redText}>
                      {Math.abs(s.changePct)}%
                    </GText>
                    <GText variant="caption"> vs previous</GText>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </GSection>

      {/* Posts */}
      <GSection
        icon="campaign"
        title="Posts on Google"
        subtitle={`${mockGooglePosts.length} published`}
        action={<GButton label="New post" icon="add" variant="text" compact onPress={() => notYet("New Google post", "AI drafts the post, like the social media tool.")} />}
        open={open.posts}
        onToggle={() => toggle("posts")}
        onLayout={onSectionLayout("posts")}
        delay={200}
      >
        {mockGooglePosts.map((p, i) => {
          const kind = POST_KIND[p.kind];
          return (
            <View key={p.id}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: G.surface, alignItems: "center", justifyContent: "center" }}>
                  <MaterialIcons name={kind.icon} size={20} color={G.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <GText variant="body" weight="medium" numberOfLines={1}>
                    {p.title}
                  </GText>
                  <GText variant="caption">
                    {kind.label} · {p.time}
                  </GText>
                </View>
                <GText variant="caption" color={G.textSecondary}>
                  {compact(p.views)} views
                </GText>
              </View>
              {i < mockGooglePosts.length - 1 ? <GDivider inset={52} /> : null}
            </View>
          );
        })}
      </GSection>

      {/* Settings */}
      <GSection
        icon="settings"
        title="Review settings"
        subtitle={autoReply ? "AI auto-replies on" : "AI auto-replies off"}
        open={open.settings}
        onToggle={() => toggle("settings")}
        onLayout={onSectionLayout("settings")}
        delay={240}
      >
        <GSwitchRow
          icon="auto-awesome"
          title="AI auto-replies"
          description="AI replies to every review in your tone and posts it as the owner's response."
          value={autoReply}
          onValueChange={setAutoReply}
        />
        <GSwitchRow icon="notifications-none" title="Review notifications" value={notify} onValueChange={setNotify} last />
      </GSection>

      <Reveal delay={280}>
        <GText variant="caption" style={{ textAlign: "center", paddingHorizontal: 12 }}>
          Sparkr is not affiliated with Google. Google and the Google logo are trademarks of Google LLC.
        </GText>
      </Reveal>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Review card: collapsed = author, stars, 3 lines, reply status. Tap to expand into the full
// text, the owner reply and the reply composer.
// ---------------------------------------------------------------------------

function ReviewCard({
  review: r,
  reply,
  expanded,
  onToggle,
  onReply,
  autoReply,
}: {
  review: GoogleReview;
  reply?: Reply;
  expanded: boolean;
  onToggle: () => void;
  onReply: (text: string) => Promise<void>;
  autoReply: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const composing = expanded && (!reply || editing);

  return (
    <Reveal>
      <View style={{ borderRadius: 12, borderWidth: 1, borderColor: expanded ? G.blue : G.border, backgroundColor: G.bg, overflow: "hidden" }}>
        <Button
          variant="ghost"
          className="h-auto flex-col items-stretch justify-start gap-0 rounded-none p-3.5 active:bg-[#F8F9FA]"
          onPress={onToggle}
          accessibilityState={{ expanded }}
          accessibilityLabel={`Review by ${r.author}, ${r.rating} stars`}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <GAvatar name={r.author} size={36} />
            <View style={{ flex: 1 }}>
              <GText variant="label" numberOfLines={1}>
                {r.author}
              </GText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 1 }}>
                <GStars rating={r.rating} size={14} />
                <GText variant="caption">{r.time}</GText>
              </View>
            </View>
            <MaterialIcons name={expanded ? "expand-less" : "expand-more"} size={22} color={G.textSecondary} />
          </View>

          <GText variant="body" style={{ marginTop: 10 }} numberOfLines={expanded ? undefined : 3}>
            {r.text}
          </GText>

          {!expanded ? (
            <View style={{ marginTop: 10 }}>
              {reply ? (
                <GChip label={reply.by === "ai" ? "Replied · AI" : "Replied"} tone="green" icon="check" />
              ) : (
                <GChip label="Awaiting reply" tone="amber" icon="schedule" />
              )}
            </View>
          ) : null}
        </Button>

        {expanded ? (
          <Expand style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            {reply && !editing ? (
              <View style={{ backgroundColor: G.surface, borderRadius: 10, padding: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <MaterialIcons name={reply.by === "ai" ? "auto-awesome" : "store"} size={14} color={G.blueText} />
                  <GText variant="caption" weight="medium" color={G.text}>
                    {mockBusiness.name} (Owner)
                  </GText>
                  <GText variant="caption">· {reply.by === "ai" ? "AI reply" : "Your reply"}</GText>
                  <View style={{ flex: 1 }} />
                  <GChip label={reply.status === "posted" ? "Posted" : "Saved"} tone={reply.status === "posted" ? "green" : "blue"} />
                </View>
                <GText variant="body">{reply.text}</GText>
                {reply.status === "saved" ? (
                  <GText variant="caption" style={{ marginTop: 6 }}>
                    Publishes to Google once the connection is live.
                  </GText>
                ) : null}
                <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 8 }}>
                  <GButton label="Edit reply" icon="edit" variant="text" compact onPress={() => setEditing(true)} />
                </View>
              </View>
            ) : null}

            {composing ? (
              <ReplyComposer
                initial={editing && reply ? reply.text : ""}
                hint={!reply && autoReply ? "AI auto-replies are on, so a reply will be drafted for this review. You can still answer it yourself." : undefined}
                onCancel={editing ? () => setEditing(false) : undefined}
                onSubmit={async (text) => {
                  await onReply(text);
                  setEditing(false);
                }}
              />
            ) : null}
          </Expand>
        ) : null}
      </View>
    </Reveal>
  );
}

function ReplyComposer({
  initial,
  hint,
  onCancel,
  onSubmit,
}: {
  initial: string;
  hint?: string;
  onCancel?: () => void;
  onSubmit: (text: string) => Promise<void>;
}) {
  const [text, setText] = useState(initial);
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const canSend = text.trim().length > 0 && !sending;

  const submit = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      await onSubmit(text.trim());
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ marginTop: 4 }}>
      {hint ? (
        <GText variant="caption" style={{ marginBottom: 8 }}>
          {hint}
        </GText>
      ) : null}
      <TextInput
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        placeholder="Write a reply as the owner…"
        placeholderTextColor={G.textSecondary}
        editable={!sending}
        accessibilityLabel="Reply to review"
        style={[
          gFont("regular"),
          {
            minHeight: 88,
            maxHeight: 180,
            fontSize: 14,
            lineHeight: 20,
            color: G.text,
            backgroundColor: G.bg,
            borderRadius: 8,
            borderWidth: focused ? 2 : 1,
            borderColor: focused ? G.blue : G.border,
            paddingHorizontal: focused ? 11 : 12,
            paddingTop: focused ? 11 : 12,
            paddingBottom: focused ? 11 : 12,
            textAlignVertical: "top",
            opacity: sending ? 0.6 : 1,
          },
        ]}
      />
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 10 }}>
        {onCancel ? <GButton label="Cancel" variant="text" compact onPress={onCancel} disabled={sending} /> : null}
        <GButton label={initial ? "Save" : "Reply"} icon={initial ? undefined : "send"} compact loading={sending} disabled={!canSend} onPress={submit} />
      </View>
    </View>
  );
}
