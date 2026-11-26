// Customers: Features 10–14 (database & segments, import, membership cards, tiers, coins).

export type MembershipTier = "bronze" | "silver" | "gold";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  coins: number;
  tier: MembershipTier;
  lastVisit: string;
  visits: number;
  joined: string;
  /** SMS consent, tracked per customer (Feature 10). */
  smsOptIn: boolean;
  source: "app" | "nfc" | "import" | "influencer";
  /** Spend over the last 12 months, which drives tiers. */
  spend12m: number;
  notes?: string;
};

export type CustomerSegment = {
  id: string;
  name: string;
  description: string;
  count: number;
};

export type CustomerImport = {
  id: string;
  fileName: string;
  date: string;
  rows: number;
  /** Rows already matched to a Sparkr account by email or phone. */
  matched: number;
  welcomeChannel: "sms" | "email";
  welcomeSent: number;
};

export type TierConfig = {
  tier: MembershipTier;
  /** 12-month spend needed to reach the tier. */
  threshold: number;
  rewardPct: number;
  members: number;
};

export type MemberPromotion = {
  id: string;
  title: string;
  kind: "daily" | "weekly" | "time_specific" | "holiday";
  schedule: string;
  active: boolean;
};

export type CoinLedgerEntry = {
  id: string;
  customer: string;
  kind: "earn" | "redeem" | "expire";
  coins: number;
  bill?: number;
  time: string;
};

/** Customer wallet top-up package (opt-in per business, slide 36). */
export type TopUpPackage = {
  id: string;
  pay: number;
  bonus: number;
};

export type CustomerActivity = {
  id: string;
  customer: string;
  kind: "visit" | "coins_earned" | "redeemed" | "joined" | "voucher";
  detail: string;
  time: string;
};
