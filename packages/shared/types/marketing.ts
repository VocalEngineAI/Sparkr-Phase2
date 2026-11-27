// Marketing: Features 1–8 (campaigns, analytics, Google, social, SMS/MMS, vouchers,
// deals, business posts).

/** Platforms influencers post on (campaigns are limited to these four). */
export type InfluencerPlatform = "instagram" | "tiktok" | "youtube" | "rednote";
/** Platforms the business manages through social media management. */
export type SocialPlatform = InfluencerPlatform | "facebook";

// --- Feature 1: Influencer campaigns ---------------------------------------

export type Campaign = {
  id: string;
  title: string;
  type: "paid" | "barter";
  status: "active" | "draft" | "completed";
  platforms: InfluencerPlatform[];
  slotsFilled: number;
  slotsTotal: number;
  /** Dining/promo credit each influencer receives. */
  creditOffered: number;
  /** Paid campaigns only: cash per influencer on top of the credit. */
  paymentPerInfluencer?: number;
  startDate: string;
  endDate: string;
  applicants: number;
  /** 0 = no minimum, otherwise a preset (1K / 5K / 10K / 50K). */
  minFollowers: number;
  followerOffer?: string;
  visitHours: string;
  branch: string;
};

/** A live post an influencer submitted for review (7 days, then auto-approved). */
export type CampaignPostReview = {
  id: string;
  handle: string;
  campaignTitle: string;
  platform: InfluencerPlatform;
  submitted: string;
  autoApprovesIn: string;
  caption: string;
};

export type CampaignApplicant = {
  id: string;
  handle: string;
  name: string;
  campaignTitle: string;
  platform: InfluencerPlatform;
  followers: number;
  location: string;
  pastCollabs: number;
  partySize: number;
};

// --- Feature 2: Analytics & ROI ---------------------------------------------

export type InfluencerPerformance = {
  id: string;
  handle: string;
  /** Unique code/link assigned on hire. */
  code: string;
  visits: number;
  redemptions: number;
  newMembers: number;
  offerSales: number;
};

export type OfferPerformance = {
  id: string;
  title: string;
  kind: "deal" | "voucher" | "influencer_offer";
  redemptions: number;
  revenue: number;
};

// --- Feature 3: Google management -------------------------------------------

export type GoogleReview = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  time: string;
  /** AI reply posted as the owner's response. */
  aiReply?: string;
};

export type GooglePost = {
  id: string;
  title: string;
  kind: "update" | "offer" | "event";
  /** Post body (what the composer edits). */
  body?: string;
  time: string;
  views: number;
};

/** Voice the AI uses when replying to reviews as the owner. */
export type GoogleReplyTone = "warm" | "professional" | "playful" | "concise";

export type GoogleReputation = {
  /** Share of reviews that have an owner reply. */
  replyRatePct: number;
  /** Typical time from review to reply, display string. */
  avgReplyTime: string;
  /** New reviews per month, oldest first (same months as the rating trend). */
  volume: { month: string; count: number }[];
};

// --- Social media management ------------------------------------------------

export type SocialAccount = {
  platform: SocialPlatform;
  handle?: string;
  connected: boolean;
  followers?: number;
};

export type ScheduledSocialPost = {
  id: string;
  platforms: SocialPlatform[];
  caption: string;
  when: string;
  /** Day offset from today, for the content calendar strip. */
  dayOffset: number;
  status: "scheduled" | "posted";
  reach?: number;
  engagementPct?: number;
};

// --- Features 4–5: SMS & picture messages -----------------------------------

export type SmsCampaign = {
  id: string;
  name: string;
  kind: "sms" | "mms";
  audience: string;
  status: "sent" | "scheduled" | "draft";
  when: string;
  recipients: number;
  delivered?: number;
  clicks?: number;
};

export type SmsAutomation = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  sentThisMonth: number;
};

// --- Feature 6: Vouchers & gift cards ---------------------------------------

export type Voucher = {
  id: string;
  title: string;
  kind: "paid" | "free";
  /** What the customer pays (paid vouchers). */
  price?: number;
  /** What it's worth in store. */
  value: number;
  sold: number;
  redeemed: number;
  revenue: number;
  validity: string;
  conditions?: string;
  status: "active" | "paused";
};

export type GiftCardProduct = {
  id: string;
  amount: number;
  sold: number;
  revenue: number;
  claimed: number;
};

// --- Feature 7: Happy hours & deals -----------------------------------------

export type DealKind = "happy_hour" | "flash" | "secret_menu" | "limited_time";

export type DealStatus = "live" | "scheduled" | "ended";

/**
 * When a deal runs. Instants are ISO strings; recurring windows use "HH:MM" local time and
 * `days` are JS weekday numbers (0 = Sunday). Status and countdowns derive from this.
 */
export type DealTiming =
  | { type: "window"; startsAt: string; endsAt: string }
  | { type: "recurring"; days: number[]; start: string; end: string; startsAt: string }
  | { type: "ongoing"; startsAt: string };

/** One day of deal analytics. `date` is YYYY-MM-DD. */
export type DealDaily = { date: string; views: number; saves: number; redemptions: number; revenue: number };

export type Deal = {
  id: string;
  title: string;
  kind: DealKind;
  /** Human-readable schedule ("Weekdays • 4 PM – 6 PM"); derived from `timing` for new deals. */
  schedule: string;
  timing: DealTiming;
  /** Big offer headline on the card ("20% OFF", "$5 ROLLS"). */
  highlight?: string;
  /** Photo URL. Sample deals use hosted stock photos; uploads come with the backend. */
  image?: string;
  /** What the customer gets ("$5 hand rolls, 2 per visit"). */
  offer?: string;
  description?: string;
  minSpend?: number;
  /** Happy hours: per visit. Everything else: total redemptions before the deal closes. */
  redemptionLimit?: number;
  expires?: string;
  /** Stored status; screens re-derive it from `timing` so it stays accurate over time. */
  status: DealStatus;
  active: boolean;
  redemptions: number;
  views: number;
  saves: number;
  revenue: number;
  /** Daily analytics for the last 30 days, oldest first. Sums to the lifetime totals above. */
  history: DealDaily[];
};

// --- Feature 8: Business posts ----------------------------------------------

export type BusinessPost = {
  id: string;
  caption: string;
  kind: "photo" | "video";
  time: string;
  likes: number;
  saves: number;
  views: number;
  linkedVoucher?: string;
  /** Days left on a sponsored top spot (1, 3 or 7-day buys). */
  sponsoredDaysLeft?: number;
};

/** An influencer in the business's "Find influencers" search (slide 41). */
export type InfluencerProfile = {
  id: string;
  handle: string;
  name: string;
  accounts: { platform: InfluencerPlatform; followers: number }[];
  /** State or province (US and Canada). */
  location: string;
  pastCollabs: number;
  category: string;
};
