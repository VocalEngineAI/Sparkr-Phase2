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

/** A headline number with its change vs. the previous period (positive is up). */
export type PerformanceHighlight = {
  id: string;
  label: string;
  value: string;
  changePct: number;
};
