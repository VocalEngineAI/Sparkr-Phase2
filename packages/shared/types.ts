// Shared domain types used across business-app, customer-app, and admin-web.
// Filled in incrementally as each screen/feature is built — see docs/03-07 for the
// feature definitions these types should model (campaigns, vouchers, reservations, etc).

export type UserRole = "business" | "influencer" | "customer" | "admin";

// ---------------------------------------------------------------------------
// Business profile
// ---------------------------------------------------------------------------

export type BusinessCategory = "restaurant" | "nail_salon" | "spa";

export type Business = {
  id: string;
  name: string;
  category: BusinessCategory;
  cuisine?: string;
  ownerName: string;
  ownerFirstName: string;
  address: string;
  city: string;
  /** Prepaid business wallet balance (docs/03 Feature 1) — funds campaigns, SMS, AI. */
  walletBalance: number;
  /** Google rating across connected locations (Feature 3). */
  googleRating: number;
  googleReviewCount: number;
  memberCount: number;
  /** Sparkr Coins currently outstanding across all members (Feature 14). */
  coinsOutstanding: number;
};

// ---------------------------------------------------------------------------
// Business home dashboard
// ---------------------------------------------------------------------------

/** Rolling stats shown in the dashboard overview card. */
export type BusinessOverview = {
  checkInsToday: number;
  reservationsToday: number;
  activeCampaigns: number;
  activeDeals: number;
};

export type ActionRequiredKind =
  | "post_review" // influencer post awaiting approval (auto-approves after 7 days)
  | "campaign_payment" // paid campaign due within 72h of approval
  | "arrival_check" // "did the guest arrive?" prompt (Feature 16)
  | "applicants" // influencer applications waiting on a hire decision
  | "wallet_low";

export type ActionRequiredItem = {
  id: string;
  kind: ActionRequiredKind;
  title: string;
  detail: string;
  /** Short deadline label, e.g. "Due in 18h". */
  deadline?: string;
  urgent?: boolean;
  cta: string;
};

export type ActivityKind =
  | "check_in"
  | "voucher_sold"
  | "review"
  | "member_joined"
  | "coins_redeemed"
  | "influencer_post"
  | "reservation";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  /** Relative time label, e.g. "12m ago". */
  time: string;
};

export type PerformanceHighlight = {
  id: string;
  label: string;
  value: string;
  /** Percent change vs. the previous period; positive is up. */
  changePct: number;
};

export type Reservation = {
  id: string;
  guestName: string;
  partySize: number;
  /** Display label, e.g. "Today · 7:00 PM". */
  when: string;
  status: "confirmed" | "pending" | "seated" | "waitlist";
  /** Deposit collected in-app, if the business has deposits enabled. */
  deposit?: number;
  vip?: boolean;
  note?: string;
};

export type BusinessEvent = {
  id: string;
  title: string;
  /** Display label, e.g. "Sat, Dec 6 · 8:00 PM". */
  when: string;
  ticketsSold: number;
  ticketsTotal: number;
  ticketPrice: number;
};
