import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView, View, type LayoutChangeEvent, type ScrollViewInstance } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  mockBranches,
  mockBusiness,
  mockGoogleProfileStats,
  mockGooglePosts,
  mockGoogleRatingBreakdown,
  mockGoogleRatingTrend,
  mockGoogleReputation,
  mockGoogleReviews,
  type BusinessCategory,
  type GooglePost,
  type GoogleReplyTone,
} from "@sparkr/shared";
import { GoogleLogo } from "../../../components/GoogleLogo";
import { Button, compact } from "../../../components/business/kit";
import {
  G,
  GAnimatedBar,
  GAnimatedColumn,
  GAvatar,
  GButton,
  GCard,
  GChip,
  GDivider,
  GFilterChip,
  GIconBox,
  GIconButton,
  GMiniStat,
  GSearchField,
  GSection,
  GStars,
  GSwitchRow,
  GText,
  Reveal,
  type MaterialIconName,
} from "../../../components/business/google";
import { ReviewCard, type Reply } from "../../../components/business/googleReviews";
import { ConnectCard, LocationsSheet, PostComposerSheet, ToneSheet, type PostDraft } from "../../../components/business/googleSheets";
import { draftReply, TONES } from "../../../lib/googleDrafts";
import type { MarketingScreenProps } from "../../../navigation/businessTypes";

// Feature 3: connect Google (OAuth), monitor reviews with AI auto-replies, post on Google,
// and reputation insights. Needs Google API approval, so it runs on sample data for now.
//
// Styled after Google Business Profile (see components/business/google.tsx): white page,
// whitespace instead of dividers, Google Blue actions, DM Sans type. Sections are flat and
// collapsible; the chip row under the profile jumps to a section. Reviews expand in place.
// Connect/disconnect, locations, posts, replies and the AI tone are all screen state until
// the backend exists — the UI is complete, the wiring isn't.

type SectionKey = "reviews" | "performance" | "posts" | "settings";
type Filter = "all" | "positive" | "negative" | "unreplied";
type Sort = "newest" | "lowest" | "highest";
type Chart = "rating" | "volume";

const PAGE = 4;

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

const SORT_LABEL: Record<Sort, string> = { newest: "Newest", lowest: "Lowest rating", highest: "Highest rating" };

const SAMPLE_REVIEW = mockGoogleReviews.find((r) => r.rating === 5) ?? mockGoogleReviews[0];

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function GoogleScreen({ navigation }: MarketingScreenProps<"Google">) {
  // Connection
  const [connected, setConnected] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [linked, setLinked] = useState<string[]>(() => mockBranches.filter((b) => b.isMain).map((b) => b.id));
  const [locationsOpen, setLocationsOpen] = useState(false);

  // Settings
  const [autoReply, setAutoReply] = useState(true);
  const [notify, setNotify] = useState(true);
  const [tone, setTone] = useState<GoogleReplyTone>("warm");
  const [toneOpen, setToneOpen] = useState(false);

  // Reviews
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  const [chart, setChart] = useState<Chart>("rating");
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, Reply>>(() =>
    Object.fromEntries(
      mockGoogleReviews.filter((r) => r.aiReply).map((r) => [r.id, { text: r.aiReply!, by: "ai", status: "posted" } satisfies Reply])
    )
  );

  // Posts
  const [posts, setPosts] = useState<GooglePost[]>(mockGooglePosts);
  const [composer, setComposer] = useState<{ open: boolean; post?: GooglePost }>({ open: false });

  // Page
  const [refreshing, setRefreshing] = useState(false);
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({ reviews: true, performance: true, posts: true, settings: true });
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsets = useRef<Partial<Record<SectionKey, number>>>({});

  // Derived
  const total = mockGoogleRatingBreakdown.reduce((n, r) => n + r.count, 0);
  const maxCount = Math.max(...mockGoogleRatingBreakdown.map((r) => r.count));
  const maxVolume = Math.max(...mockGoogleReputation.volume.map((v) => v.count));
  const unreplied = mockGoogleReviews.filter((r) => !replies[r.id]).length;
  const linkedBranches = mockBranches.filter((b) => linked.includes(b.id));
  const toneLabel = TONES.find((t) => t.key === tone)?.label ?? "Warm";

  const reviews = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = mockGoogleReviews.filter((r) => {
      const byFilter =
        filter === "all" ? true : filter === "positive" ? r.rating >= 4 : filter === "negative" ? r.rating <= 3 : !replies[r.id];
      const byQuery = !q || r.text.toLowerCase().includes(q) || r.author.toLowerCase().includes(q);
      return byFilter && byQuery;
    });
    if (sort === "lowest") return [...list].sort((a, b) => a.rating - b.rating);
    if (sort === "highest") return [...list].sort((a, b) => b.rating - a.rating);
    return list; // mock order is newest first
  }, [filter, sort, query, replies]);
  const visibleReviews = reviews.slice(0, shown);

  // Actions
  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const connect = async () => {
    setConnecting(true);
    await wait(1400); // OAuth hand-off goes here
    setConnecting(false);
    setConnected(true);
    setLocationsOpen(true);
  };

  const disconnect = () =>
    Alert.alert("Disconnect Google?", "Reviews, posts and performance stop syncing until you connect again. Nothing is deleted on Google.", [
      { text: "Cancel", style: "cancel" },
      { text: "Disconnect", style: "destructive", onPress: () => setConnected(false) },
    ]);

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

  const pickSort = () =>
    Alert.alert("Sort reviews", undefined, [
      ...(["newest", "lowest", "highest"] as Sort[]).map((s) => ({ text: SORT_LABEL[s], onPress: () => setSort(s) })),
      { text: "Cancel", style: "cancel" as const },
    ]);

  const overflow = () =>
    Alert.alert("Google Business Profile", undefined, [
      {
        text: "Refresh",
        onPress: () => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
          refresh();
        },
      },
      { text: "Manage locations", onPress: () => setLocationsOpen(true) },
      { text: "Disconnect Google", style: "destructive", onPress: disconnect },
      { text: "Cancel", style: "cancel" },
    ]);

  const postReply = async (id: string, text: string) => {
    await wait(900);
    setReplies((r) => ({ ...r, [id]: { text, by: "owner", status: "saved" } }));
  };

  const savePost = async (draft: PostDraft) => {
    await wait(900);
    const editing = composer.post;
    setPosts((list) =>
      editing ? list.map((p) => (p.id === editing.id ? { ...p, ...draft } : p)) : [{ id: `gp_${Date.now()}`, ...draft, time: "Just now", views: 0 }, ...list]
    );
    setComposer({ open: false });
  };

  const postActions = (p: GooglePost) =>
    Alert.alert(p.title, `${POST_KIND[p.kind].label} · ${p.time} · ${compact(p.views)} views`, [
      { text: "Edit", onPress: () => setComposer({ open: true, post: p }) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          Alert.alert("Delete this post?", "It's removed from your Business Profile on Google.", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => setPosts((list) => list.filter((x) => x.id !== p.id)) },
          ]),
      },
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
          {connected ? <GIconButton icon="more-vert" label="More options" onPress={overflow} /> : null}
        </View>
      ),
    });
  }, [navigation, connected]);

  // ------------------------------------------------------------------ not connected
  if (!connected) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: G.bg }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 }}>
        <Reveal>
          <ConnectCard connecting={connecting} onConnect={connect} businessName={mockBusiness.name} />
        </Reveal>
        <Reveal delay={60}>
          <GText variant="caption" style={{ textAlign: "center", paddingHorizontal: 12, marginTop: 28 }}>
            Sparkr is not affiliated with Google. Google and the Google logo are trademarks of Google LLC.
          </GText>
        </Reveal>
      </ScrollView>
    );
  }

  // ------------------------------------------------------------------ connected
  return (
    <>
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
                {linkedBranches.length === 1
                  ? `1 location linked · ${linkedBranches[0].address}`
                  : `${linkedBranches.length} locations linked · ${linkedBranches.map((b) => b.name.split(" · ").pop()).join(", ")}`}
              </GText>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
              <GButton label="Manage locations" icon="storefront" variant="outlined" compact onPress={() => setLocationsOpen(true)} />
              <GButton label="Refresh" icon="refresh" variant="text" compact loading={refreshing} onPress={refresh} />
            </View>
          </GCard>
        </Reveal>

        {/* Section chips (jump links) */}
        <Reveal delay={40}>
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
          delay={80}
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

          {/* Reputation */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 18 }}>
            <GMiniStat icon="forum" value={`${mockGoogleReputation.replyRatePct}%`} label="Reply rate" />
            <GMiniStat icon="timer" value={mockGoogleReputation.avgReplyTime} label="Avg. time to reply" />
            <GMiniStat icon="reviews" value={String(mockGoogleReputation.volume.at(-1)?.count ?? 0)} label="New this month" />
          </View>

          {/* Trend: rating or volume */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 18, marginBottom: 8 }}>
            <GText variant="caption" style={{ flex: 1 }}>
              {chart === "rating" ? "Average rating · last 6 months" : "New reviews · last 6 months"}
            </GText>
            <View style={{ flexDirection: "row", gap: 6 }}>
              <GFilterChip label="Rating" selected={chart === "rating"} onPress={() => setChart("rating")} />
              <GFilterChip label="Volume" selected={chart === "volume"} onPress={() => setChart("volume")} />
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", height: 92 }}>
            {chart === "rating"
              ? mockGoogleRatingTrend.map((m, i) => (
                  <View key={m.month} style={{ alignItems: "center", flex: 1, gap: 4 }}>
                    <GText variant="caption" weight="medium" color={G.text}>
                      {m.rating.toFixed(1)}
                    </GText>
                    <GAnimatedColumn height={Math.max(6, (m.rating - 4) * 48)} delay={i * 50} />
                    <GText variant="caption">{m.month}</GText>
                  </View>
                ))
              : mockGoogleReputation.volume.map((m, i) => (
                  <View key={m.month} style={{ alignItems: "center", flex: 1, gap: 4 }}>
                    <GText variant="caption" weight="medium" color={G.text}>
                      {m.count}
                    </GText>
                    <GAnimatedColumn height={Math.max(6, (m.count / maxVolume) * 48)} delay={i * 50} color={G.green} />
                    <GText variant="caption">{m.month}</GText>
                  </View>
                ))}
          </View>

          {/* Search, filters, sort */}
          <View style={{ marginTop: 20 }}>
            <GSearchField
              value={query}
              onChangeText={(v) => {
                setQuery(v);
                setShown(PAGE);
              }}
              placeholder="Search reviews"
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
              {(
                [
                  ["all", "All"],
                  ["positive", "4–5 stars"],
                  ["negative", "1–3 stars"],
                  ["unreplied", "Awaiting reply"],
                ] as const
              ).map(([key, label]) => (
                <GFilterChip
                  key={key}
                  label={label}
                  selected={filter === key}
                  onPress={() => {
                    setFilter(key);
                    setShown(PAGE);
                  }}
                />
              ))}
            </ScrollView>
            <GIconButton icon="sort" label={`Sort: ${SORT_LABEL[sort]}`} onPress={pickSort} />
          </View>
          <GText variant="caption" style={{ marginTop: 6 }}>
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"} · {SORT_LABEL[sort]}
          </GText>

          {/* Review cards */}
          <View style={{ gap: 10, marginTop: 12 }}>
            {reviews.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 24, gap: 6 }}>
                <MaterialIcons name={query ? "search" : "check-circle"} size={32} color={query ? G.textSecondary : G.green} />
                <GText variant="body" color={G.textSecondary} style={{ textAlign: "center" }}>
                  {query ? `No reviews match "${query.trim()}".` : "Nothing here — every review has a reply."}
                </GText>
              </View>
            ) : (
              visibleReviews.map((r) => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  reply={replies[r.id]}
                  expanded={expandedReview === r.id}
                  onToggle={() => setExpandedReview((cur) => (cur === r.id ? null : r.id))}
                  onReply={(text) => postReply(r.id, text)}
                  autoReply={autoReply}
                  tone={tone}
                  businessName={mockBusiness.name}
                />
              ))
            )}
            {reviews.length > shown ? (
              <View style={{ alignItems: "center", marginTop: 4 }}>
                <GButton label={`Show more (${reviews.length - shown})`} icon="expand-more" variant="outlined" compact onPress={() => setShown((n) => n + PAGE)} />
              </View>
            ) : null}
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
          delay={120}
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
          subtitle={`${posts.length} published`}
          action={<GButton label="New post" icon="add" variant="text" compact onPress={() => setComposer({ open: true })} />}
          open={open.posts}
          onToggle={() => toggle("posts")}
          onLayout={onSectionLayout("posts")}
          delay={160}
        >
          {posts.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 20, gap: 8 }}>
              <GIconBox icon="campaign" size={44} />
              <GText variant="body" color={G.textSecondary} style={{ textAlign: "center" }}>
                No posts yet. Updates, offers and events show up on your profile in Search and Maps.
              </GText>
              <GButton label="Write your first post" variant="tonal" compact onPress={() => setComposer({ open: true })} />
            </View>
          ) : (
            posts.map((p, i) => {
              const kind = POST_KIND[p.kind];
              return (
                <Reveal key={p.id}>
                  <Button
                    variant="ghost"
                    className="h-auto -mx-2 flex-row items-center justify-start gap-0 rounded-xl px-2 py-2.5 active:bg-[#F8F9FA]"
                    onPress={() => postActions(p)}
                    accessibilityLabel={`${p.title}, ${kind.label}`}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: G.surface, alignItems: "center", justifyContent: "center" }}>
                      <MaterialIcons name={kind.icon} size={20} color={G.textSecondary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <GText variant="body" weight="medium" numberOfLines={1}>
                        {p.title}
                      </GText>
                      <GText variant="caption" numberOfLines={1}>
                        {kind.label} · {p.time}
                      </GText>
                    </View>
                    <GText variant="caption" color={G.textSecondary} style={{ marginLeft: 8 }}>
                      {compact(p.views)} views
                    </GText>
                    <MaterialIcons name="more-vert" size={20} color={G.textSecondary} style={{ marginLeft: 4 }} />
                  </Button>
                  {i < posts.length - 1 ? <GDivider inset={52} /> : null}
                </Reveal>
              );
            })
          )}
        </GSection>

        {/* Settings */}
        <GSection
          icon="settings"
          title="Review settings"
          subtitle={autoReply ? `AI auto-replies on · ${toneLabel} tone` : "AI auto-replies off"}
          open={open.settings}
          onToggle={() => toggle("settings")}
          onLayout={onSectionLayout("settings")}
          delay={200}
        >
          <GSwitchRow
            icon="auto-awesome"
            title="AI auto-replies"
            description="AI replies to every review in your tone and posts it as the owner's response."
            value={autoReply}
            onValueChange={setAutoReply}
          />
          <Button
            variant="ghost"
            className="h-auto -mx-2 flex-row items-center justify-start gap-0 rounded-xl px-2 py-3 active:bg-[#F8F9FA]"
            onPress={() => setToneOpen(true)}
            accessibilityLabel={`AI reply tone, ${toneLabel}`}
          >
            <MaterialIcons name="auto-fix-high" size={22} color={G.textSecondary} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <GText variant="headline" weight="regular">
                Reply tone
              </GText>
              <GText variant="caption">{TONES.find((t) => t.key === tone)?.description}</GText>
            </View>
            <GText variant="label" color={G.blueText} style={{ marginRight: 4 }}>
              {toneLabel}
            </GText>
            <MaterialIcons name="chevron-right" size={22} color={G.textSecondary} />
          </Button>
          <GDivider />
          <GSwitchRow icon="notifications-none" title="Review notifications" value={notify} onValueChange={setNotify} last />
          <View style={{ marginTop: 8 }}>
            <GButton label="Disconnect Google" icon="link-off" variant="text" compact onPress={disconnect} />
          </View>
        </GSection>

        <Reveal delay={240}>
          <GText variant="caption" style={{ textAlign: "center", paddingHorizontal: 12 }}>
            Sparkr is not affiliated with Google. Google and the Google logo are trademarks of Google LLC.
          </GText>
        </Reveal>
      </ScrollView>

      <LocationsSheet
        visible={locationsOpen}
        onClose={() => setLocationsOpen(false)}
        locations={mockBranches}
        linked={linked}
        onSave={(ids) => {
          setLinked(ids);
          setLocationsOpen(false);
        }}
      />
      <PostComposerSheet
        visible={composer.open}
        onClose={() => setComposer({ open: false })}
        initial={composer.post}
        businessName={mockBusiness.name}
        onSave={savePost}
      />
      <ToneSheet
        visible={toneOpen}
        onClose={() => setToneOpen(false)}
        tone={tone}
        onSave={(t) => {
          setTone(t);
          setToneOpen(false);
        }}
        preview={(t) => draftReply(SAMPLE_REVIEW, t, mockBusiness.name)}
      />
    </>
  );
}
